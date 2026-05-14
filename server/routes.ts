import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import passport from "passport";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { z } from "zod";
import { willFormDataSchema } from "@shared/schema";
import type { User as DbUser } from "@shared/schema";
import { triggerOnboardingFlow, getOnboardingStats, sendWelcomeEmail, sendBroadcastEmails } from "./services/onboarding";
import { stripeService } from "./stripeService";
import { getStripePublishableKey } from "./stripeClient";

// Extend Express Request to include user
declare global {
  namespace Express {
    interface User extends DbUser {}
  }
}

// Authentication middleware
function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

// Admin authentication middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated() && req.user && req.user.isAdmin === 1) {
    return next();
  }
  res.status(403).json({ message: "Admin access required" });
}

// Register validation schema
const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(1, "Full name is required"),
});

// Login validation schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Will status enum
const willStatusEnum = z.enum(["draft", "completed"]);

// Create will validation schema
const createWillSchema = z.object({
  formData: willFormDataSchema,
  status: willStatusEnum.optional(),
});

// Update will validation schema
const updateWillSchema = z.object({
  formData: willFormDataSchema.optional(),
  status: willStatusEnum.optional(),
  completedAt: z.string().datetime().optional().or(z.null()),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  
  // POST /api/auth/register - Create new user
  app.post("/api/auth/register", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, fullName } = registerSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const user = await storage.createUser({
        email,
        passwordHash,
        fullName,
      });

      // Trigger onboarding flow (non-blocking)
      triggerOnboardingFlow(user.id, user.email, user.fullName, 'web').catch((error) => {
        console.error('Onboarding flow error:', error);
      });

      // Log in the user
      req.login(user, (err) => {
        if (err) return next(err);
        
        // Return user without password
        const { passwordHash: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword });
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      next(error);
    }
  });

  // POST /api/auth/login - Login user
  app.post("/api/auth/login", (req: Request, res: Response, next: NextFunction) => {
    try {
      loginSchema.parse(req.body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
    }

    passport.authenticate("local", (err: any, user: DbUser, info: any) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info?.message || "Invalid credentials" });
      }

      req.login(user, (err) => {
        if (err) return next(err);
        
        // Return user without password
        const { passwordHash: _, ...userWithoutPassword } = user;
        res.json({ user: userWithoutPassword });
      });
    })(req, res, next);
  });

  // POST /api/auth/logout - Logout user
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // GET /api/auth/me - Get current user
  app.get("/api/auth/me", requireAuth, (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = req.user;
    res.json({ user: userWithoutPassword });
  });

  // POST /api/auth/consent - Record the current user's GDPR consent
  // Charter Item 5: every paying user must give explicit consent before
  // payment is taken. The privacy policy version is captured so a future
  // material change can re-prompt only the users who haven't yet agreed.
  app.post("/api/auth/consent", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { version } = z.object({
        version: z.string().min(1).max(20),
      }).parse(req.body);

      const updated = await storage.recordConsent(req.user.id, version);
      if (!updated) {
        return res.status(404).json({ message: "User not found" });
      }

      const { passwordHash: _, ...userWithoutPassword } = updated;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      next(error);
    }
  });

  // Will routes

  // GET /api/wills - Get all wills for current user
  app.get("/api/wills", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const wills = await storage.getWillsByUserId(req.user.id);
      res.json({ wills });
    } catch (error) {
      next(error);
    }
  });

  // GET /api/wills/:id - Get specific will
  app.get("/api/wills/:id", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const willId = parseInt(req.params.id);
      const will = await storage.getWill(willId);

      if (!will) {
        return res.status(404).json({ message: "Will not found" });
      }

      // Verify ownership
      if (will.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json({ will });
    } catch (error) {
      next(error);
    }
  });

  // POST /api/wills - Create new will
  app.post("/api/wills", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      // Validate request body
      const validatedData = createWillSchema.parse(req.body);

      const will = await storage.createWill({
        userId: req.user.id,
        formData: validatedData.formData,
        status: validatedData.status || "draft",
      });

      res.json({ will });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      next(error);
    }
  });

  // PATCH /api/wills/:id - Update will
  app.patch("/api/wills/:id", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const willId = parseInt(req.params.id);
      const existingWill = await storage.getWill(willId);

      if (!existingWill) {
        return res.status(404).json({ message: "Will not found" });
      }

      // Verify ownership
      if (existingWill.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Validate request body
      const validatedData = updateWillSchema.parse(req.body);
      const updates: any = {};

      if (validatedData.formData !== undefined) updates.formData = validatedData.formData;
      if (validatedData.status !== undefined) updates.status = validatedData.status;
      if (validatedData.completedAt !== undefined) {
        updates.completedAt = validatedData.completedAt ? new Date(validatedData.completedAt) : null;
      }

      const updatedWill = await storage.updateWill(willId, updates);
      res.json({ will: updatedWill });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      next(error);
    }
  });

  // DELETE /api/wills/:id - Delete will
  app.delete("/api/wills/:id", requireAuth, async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const willId = parseInt(req.params.id);
      const existingWill = await storage.getWill(willId);

      if (!existingWill) {
        return res.status(404).json({ message: "Will not found" });
      }

      // Verify ownership
      if (existingWill.userId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      await storage.deleteWill(willId);
      res.json({ message: "Will deleted successfully" });
    } catch (error) {
      next(error);
    }
  });

  // Admin routes for onboarding monitoring
  
  // GET /api/admin/onboarding-stats - Get onboarding statistics (ADMIN ONLY)
  app.get("/api/admin/onboarding-stats", requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await getOnboardingStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  });

  // POST /api/admin/test-onboarding - Manually trigger test onboarding (ADMIN ONLY)
  app.post("/api/admin/test-onboarding", requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, fullName } = z.object({
        email: z.string().email(),
        fullName: z.string().min(1),
      }).parse(req.body);

      const result = await sendWelcomeEmail(email, fullName);
      
      if (result.success) {
        res.json({ success: true, message: `Test welcome email sent to ${email}` });
      } else {
        res.status(500).json({ success: false, error: result.error });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      next(error);
    }
  });

  // POST /api/admin/broadcast-email - Send broadcast email to users (ADMIN ONLY)
  app.post("/api/admin/broadcast-email", requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { subject, message, userFilter } = z.object({
        subject: z.string().min(1, "Subject is required"),
        message: z.string().min(1, "Message is required"),
        userFilter: z.enum(['all', 'last_7_days', 'last_30_days']),
      }).parse(req.body);

      const result = await sendBroadcastEmails(
        subject,
        message,
        userFilter
      );
      
      res.json({ 
        success: true, 
        totalSent: result.totalSent,
        totalFailed: result.totalFailed,
        errors: result.errors,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      next(error);
    }
  });

  // Stripe Payment Routes

  // GET /api/stripe/publishable-key - Get Stripe publishable key
  app.get("/api/stripe/publishable-key", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const publishableKey = await getStripePublishableKey();
      res.json({ publishableKey });
    } catch (error) {
      next(error);
    }
  });

  // POST /api/stripe/create-checkout-session - Create a checkout session for will purchase
  app.post("/api/stripe/create-checkout-session", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, willId } = z.object({
        email: z.string().email("Valid email required"),
        willId: z.number().optional(),
      }).parse(req.body);

      // Use the Islamic Will product price ID from environment or default
      const priceId = process.env.STRIPE_WILL_PRICE_ID;
      
      if (!priceId) {
        return res.status(500).json({ message: "Payment configuration not set up" });
      }

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const successUrl = `${baseUrl}/thank-you?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${baseUrl}/?payment=cancelled`;

      const session = await stripeService.createCheckoutSession(
        email,
        priceId,
        successUrl,
        cancelUrl,
        willId ? { willId: willId.toString() } : undefined
      );

      res.json({ url: session.url, sessionId: session.id });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      next(error);
    }
  });

  // GET /api/stripe/checkout-session/:sessionId - Verify checkout session status
  app.get("/api/stripe/checkout-session/:sessionId", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId } = req.params;
      const session = await stripeService.getCheckoutSession(sessionId);
      
      res.json({
        status: session.status,
        paymentStatus: session.payment_status,
        customerEmail: session.customer_email,
      });
    } catch (error) {
      next(error);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

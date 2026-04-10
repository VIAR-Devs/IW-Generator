import { pgTable, text, serial, integer, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Step 1: Basic Details
export const basicDetailsSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  addressLine1: z.string().optional(),
  city: z.string().optional(),
  postcode: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  burialCountry: z.string().optional(),
});

export type BasicDetails = z.infer<typeof basicDetailsSchema>;

// Step 2: Executors
export const executorSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Executor name is required"),
  address: z.string().min(1, "Executor address is required"),
});

export type Executor = z.infer<typeof executorSchema>;

// Step 3: Guardians
export const guardianSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Guardian name is required"),
  address: z.string().optional(),
});

export const childSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Child name is required"),
  gender: z.enum(["male", "female"]),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
});

export type Guardian = z.infer<typeof guardianSchema>;
export type Child = z.infer<typeof childSchema>;

// Step 4: Funeral & Burial Preferences
export const funeralPreferencesSchema = z.object({
  restrictPostMortem: z.boolean().default(false),
  organDonation: z.boolean().default(false),
  imamOrMasjid: z.string().optional(),
  cemetery: z.string().optional(),
  charityAtFuneral: z.string().optional(),
});

export type FuneralPreferences = z.infer<typeof funeralPreferencesSchema>;

// Step 5: Charitable Bequest (Wasiyyah)
export const wasiyyahBeneficiarySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Beneficiary name is required"),
  percentage: z.number().min(0.1, "Percentage must be at least 0.1%").max(33, "Percentage cannot exceed 33%"),
});

export const wasiyyahSchema = z.object({
  enabled: z.boolean().default(false),
  beneficiaries: z.array(wasiyyahBeneficiarySchema),
}).refine(
  (data) => {
    if (!data.enabled) return true;
    const totalPercentage = data.beneficiaries.reduce((sum, b) => sum + (b.percentage || 0), 0);
    return totalPercentage <= 33;
  },
  { message: "Total Wasiyyah percentage cannot exceed 33% (one-third) of the estate" }
);

export type WasiyyahBeneficiary = z.infer<typeof wasiyyahBeneficiarySchema>;
export type Wasiyyah = z.infer<typeof wasiyyahSchema>;

// Step 6: Heirs Snapshot
export const heirsSnapshotSchema = z.object({
  hasSpouse: z.boolean().default(false),
  numberOfSons: z.number().min(0).default(0),
  numberOfDaughters: z.number().min(0).default(0),
  motherAlive: z.boolean().default(false),
  fatherAlive: z.boolean().default(false),
  otherHeirs: z.string().optional(),
  madhhab: z.enum(["hanafi", "shafi", "maliki", "hanbali", "not_sure"]).optional(),
});

export type HeirsSnapshot = z.infer<typeof heirsSnapshotSchema>;

// Step 7: Optional Add-Ons
export const letterOfWishesSchema = z.object({
  funeralTone: z.string().optional(),
  debtsZakatNotes: z.string().optional(),
  guardianSchoolingHopes: z.string().optional(),
  charitableIntentions: z.string().optional(),
  mementos: z.string().optional(),
  businessDigitalAccess: z.string().optional(),
  additionalWishes: z.string().optional(),
});

export const guidanceForGuardiansSchema = z.object({
  personalMessage: z.string().optional(),
});

export const optionalAddOnsSchema = z.object({
  letterOfWishesEnabled: z.boolean().default(false),
  letterOfWishes: letterOfWishesSchema.optional(),
  guidanceForGuardiansEnabled: z.boolean().default(false),
  guidanceForGuardians: guidanceForGuardiansSchema.optional(),
  guidanceForExecutorsEnabled: z.boolean().default(false),
});

export type LetterOfWishes = z.infer<typeof letterOfWishesSchema>;
export type GuidanceForGuardians = z.infer<typeof guidanceForGuardiansSchema>;
export type OptionalAddOns = z.infer<typeof optionalAddOnsSchema>;

// Complete Will Form Data
export const willFormDataSchema = z.object({
  basicDetails: basicDetailsSchema,
  executors: z.array(executorSchema),
  guardians: z.array(guardianSchema),
  children: z.array(childSchema),
  funeralPreferences: funeralPreferencesSchema,
  wasiyyah: wasiyyahSchema,
  heirsSnapshot: heirsSnapshotSchema,
  optionalAddOns: optionalAddOnsSchema,
});

export type WillFormData = z.infer<typeof willFormDataSchema>;

// Database Tables - referenced from blueprint:javascript_database

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name").notNull(),
  isAdmin: integer("is_admin").default(0),
  signupSource: varchar("signup_source", { length: 50 }),
  onboardingStatus: varchar("onboarding_status", { length: 50 }).default("pending"),
  onboardingStartedAt: timestamp("onboarding_started_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  wills: many(wills),
}));

export type User = typeof users.$inferSelect;
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;

// Wills Table
export const wills = pgTable("wills", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  status: varchar("status", { length: 20 }).notNull().default("draft"), // 'draft' or 'completed'
  formData: jsonb("form_data").$type<WillFormData>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const willsRelations = relations(wills, ({ one }) => ({
  user: one(users, {
    fields: [wills.userId],
    references: [users.id],
  }),
}));

export type Will = typeof wills.$inferSelect;
export const insertWillSchema = createInsertSchema(wills).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertWill = z.infer<typeof insertWillSchema>;

// Scheduled Jobs Table (for persistent follow-up emails)
export const scheduledJobs = pgTable("scheduled_jobs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  jobType: varchar("job_type", { length: 50 }).notNull(), // 'follow_up_email'
  scheduledFor: timestamp("scheduled_for").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // 'pending', 'completed', 'failed'
  attempts: integer("attempts").default(0),
  lastAttemptAt: timestamp("last_attempt_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const scheduledJobsRelations = relations(scheduledJobs, ({ one }) => ({
  user: one(users, {
    fields: [scheduledJobs.userId],
    references: [users.id],
  }),
}));

export type ScheduledJob = typeof scheduledJobs.$inferSelect;
export const insertScheduledJobSchema = createInsertSchema(scheduledJobs).omit({
  id: true,
  createdAt: true,
});
export type InsertScheduledJob = z.infer<typeof insertScheduledJobSchema>;

# Islamic Will Generator - Replit Agent Guide

## Overview

This is a **Shariah-compliant Islamic Will Generator** for the UK market. The application guides users through creating legally valid wills that comply with both UK law and Islamic inheritance principles (Faraid). It features a 9-step form wizard that collects personal details, executors, guardians, funeral preferences, heirs information, and optional charitable bequests (Wasiyyah), then generates a professionally formatted will document.

**Key Purpose**: Simplify the creation of Islamic wills for UK Muslims by providing a guided, accessible interface that ensures both legal validity and religious compliance.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript using Vite as the build tool

**UI Component System**: 
- Shadcn/ui components (Radix UI primitives) following the "New York" style variant
- Tailwind CSS for styling with custom design tokens
- Material Design principles adapted for Islamic cultural sensitivity
- Custom color palette: Deep teal primary (HSL 158 65% 35%) for professional Islamic aesthetic
- Typography: Inter font family for clarity in legal text

**Form Management**:
- React Hook Form for form state and validation
- Zod schemas for runtime validation (defined in `shared/schema.ts`)
- `@hookform/resolvers` for Zod integration
- Multi-step wizard pattern with progress indication

**State Management**:
- Local React state for form wizard navigation
- TanStack Query (React Query) for server state management (fully integrated with backend)
- AuthProvider context manages global authentication state
- Custom hooks (useAuth, useUserWills, useWillDraft) for data fetching and mutations
- Form data accumulated across steps in parent component (`client/src/pages/Home.tsx`)

**Routing**:
- Wouter for client-side routing (lightweight alternative to React Router)
- Single-page application with landing page and will generator flow

**Design System Approach**:
- Professional credibility with legal gravitas
- Islamic cultural elements (gold accents, Arabic fonts for Quranic text)
- Dark/light mode support via CSS variables
- Accessibility-focused with clear hierarchy and readable typography

### Backend Architecture

**Server Framework**: Express.js with TypeScript

**Current State**: Fully implemented and production-ready
- Express server with session management (`server/index.ts`)
- Complete API routes for auth and will management (`server/routes.ts`)
- PostgreSQL database storage layer (`server/storage.ts`)
- Passport.js authentication with bcrypt password hashing
- Session storage using connect-pg-simple in PostgreSQL
- Vite middleware integration for development hot-reload
- Frontend-backend integration complete with React Query

**Authentication & Authorization**: ✅ Production Ready
- Email/password authentication with secure session cookies
- Protected routes with automatic redirect for unauthenticated users
- User dashboard with real data from backend API
- Global authentication state via AuthProvider context
- Proper error handling and user feedback

**Onboarding Automation**: ✅ Production Ready (November 2025)
- Automated welcome emails via Resend integration
- 3-day follow-up email scheduler with persistent job queue
- Admin dashboard for monitoring onboarding metrics
- Role-based access control for admin functions
- Error handling with automatic retry logic (3 attempts, exponential backoff)
- Database-backed job scheduling survives server restarts

**Admin Broadcast Email System**: ✅ Production Ready (November 2025)
- Manual broadcast emails to registered users via admin interface
- User filtering options: all users, last 7 days, last 30 days
- Batch processing (50 users per batch) to respect rate limits
- Delivery tracking with success/failure counts and error reporting
- Confirmation dialog before sending to prevent accidental sends
- Professional HTML + text email templates with dynamic subject and message
- Admin-only access via requireAdmin middleware
- Accessible at /dashboard/admin/broadcast

**Payment Processing**: ✅ Production Ready (December 2025)
- Stripe integration via Replit connector
- Stripe Checkout for secure payment processing
- Webhook handling with stripe-replit-sync for data sync
- Product: Islamic Will Document (£49.99 one-time payment)
- Environment variable: STRIPE_WILL_PRICE_ID for price configuration
- Thank You page with payment confirmation at /thank-you

**Remaining Features**: 
- Document generation endpoints (PDF export)
- Email delivery for will documents (infrastructure ready)
- Will form autosave/resume functionality

### Data Storage

**Database**: PostgreSQL via Neon serverless (fully implemented)

**ORM**: Drizzle ORM
- Schema definitions in `shared/schema.ts`
- Migration management via `drizzle-kit push`
- Connection via `@neondatabase/serverless`
- Database connection pool in `server/db.ts`

**Database Tables**:
- `users` table: Stores user accounts (email, password hash, full name, isAdmin, signupSource, onboardingStatus, onboardingStartedAt, timestamps)
- `wills` table: Stores will documents (user_id, status, form data as JSONB, timestamps)
- `scheduled_jobs` table: Stores persistent job queue (user_id, job_type, scheduled_for, status, attempts, last_attempt_at, timestamps)
- `session` table: Stores user sessions (automatically managed by connect-pg-simple)

**Form Data Schemas** (validated with Zod):
- `basicDetailsSchema`: Personal identity and address
- `executorSchema`: Estate executors
- `guardianSchema` & `childSchema`: Child guardianship (optional - based on whether user has children under 18)
- `funeralPreferencesSchema`: Burial and funeral wishes
- `wasiyyahBeneficiarySchema`: Charitable bequests (up to 1/3 of estate)
- `heirsSnapshotSchema`: Family structure for Faraid calculations
  - Includes madhhab field with options: Hanafi, Shafi'i, Maliki, Hanbali, or "Not sure / No preference"
- `optionalAddOnsSchema`: Letter of wishes and guardian guidance
- `willFormDataSchema`: Complete will form data (stored as JSONB in database)

**Data Flow Pattern**:
- Form data collected in React components
- Validated client-side with Zod schemas
- Submitted to backend API endpoints
- Server validates again using shared Zod schemas
- Persisted to PostgreSQL database
- Retrieved for editing via authenticated API calls

### External Dependencies

**UI Component Libraries**:
- Radix UI primitives (@radix-ui/*) - Accessible component foundation
- Shadcn/ui - Pre-built component library
- Lucide React - Icon system
- cmdk - Command menu component
- embla-carousel-react - Carousel functionality

**Form & Validation**:
- react-hook-form - Form state management
- zod - Schema validation
- drizzle-zod - Drizzle-to-Zod schema conversion

**Styling**:
- Tailwind CSS - Utility-first CSS framework
- class-variance-authority - Variant-based component styling
- clsx & tailwind-merge - Class name utilities

**Backend Infrastructure**:
- express - Web server framework
- @neondatabase/serverless - PostgreSQL serverless driver
- drizzle-orm - Type-safe ORM
- connect-pg-simple - PostgreSQL session store (active)
- passport - Authentication middleware
- passport-local - Local username/password strategy
- bcryptjs - Password hashing
- express-session - Session management

**Development Tools**:
- Vite - Build tool and dev server
- tsx - TypeScript execution
- esbuild - Production bundling
- @replit/vite-plugin-* - Replit-specific development plugins

**Date & Time**:
- date-fns - Date manipulation utilities

**Email Services**:
- Resend - Transactional email delivery (configured via Replit integration)
- Email templates: welcome-email.ts, follow-up-email.ts, broadcast-email.ts (HTML + text versions)

**Planned External Services**:
- Payment processing (Stripe or similar) - Not yet integrated
- PDF generation service - For final will documents

### API Structure

**Implemented Endpoints** (prefix: `/api`):

**Authentication Routes**:
- `POST /api/auth/register` - Create new user account (validates email, password min 8 chars, full name)
- `POST /api/auth/login` - Authenticate user and create session
- `POST /api/auth/logout` - Destroy user session
- `GET /api/auth/me` - Get current authenticated user info

**Will Management Routes** (all require authentication):
- `GET /api/wills` - Get all wills for current user (ordered by updatedAt DESC)
- `GET /api/wills/:id` - Get specific will (with ownership verification)
- `POST /api/wills` - Create new will (validates form data and status)
- `PATCH /api/wills/:id` - Update will (validates partial updates, ownership check)
- `DELETE /api/wills/:id` - Delete will (with ownership verification)

**Admin Routes** (all require admin authentication):
- `GET /api/admin/onboarding-stats` - Get onboarding metrics (total users, emails sent/failed, pending follow-ups)
- `POST /api/admin/test-onboarding` - Manually trigger test onboarding emails
- `POST /api/admin/broadcast-email` - Send broadcast email to filtered users (validates subject, message, userFilter: all/last_7_days/last_30_days)

**Planned Routes**:
- `POST /api/wills/:id/generate` - Generate PDF document
- `POST /api/payment` - Process payment (Stripe integration)

**Data Validation Strategy**:
- Shared Zod schemas between client and server (`shared/schema.ts`)
- Server-side validation on all endpoints using:
  - `registerSchema` - Email, password (min 8 chars), full name
  - `loginSchema` - Email and password
  - `createWillSchema` - Full willFormDataSchema + status enum
  - `updateWillSchema` - Partial updates with status enum and completedAt
- Runtime validation on both client and server
- Type safety via TypeScript inference from Zod
- Detailed error messages for validation failures
- 400 status for validation errors, 401 for auth failures, 403 for ownership violations

### Key Architectural Decisions

**Multi-Step Form Wizard**:
- **Problem**: Complex legal document with extensive information requirements
- **Solution**: Progressive disclosure via 9-step wizard with persistent state
- **Rationale**: Reduces cognitive load, allows save/resume functionality, clear progress indication
- **Pros**: Better UX, reduced abandonment, easier validation per section
- **Cons**: Requires careful state management, more complex navigation logic

**Shared Schema Definitions**:
- **Problem**: Need consistent validation between client and server
- **Solution**: Single source of truth in `shared/schema.ts` using Zod
- **Rationale**: DRY principle, type safety, runtime validation
- **Pros**: No schema drift, TypeScript inference, reusable validation
- **Cons**: Tight coupling between frontend and backend

**Database-First with Type Safety**:
- **Problem**: Need persistent storage with type safety across stack
- **Solution**: PostgreSQL with Drizzle ORM, shared Zod schemas for validation
- **Rationale**: Single source of truth for data models, runtime and compile-time safety
- **Pros**: No schema drift, full TypeScript inference, JSONB flexibility for complex form data
- **Cons**: Requires careful migration management, JSONB type assertions needed
- **Implementation Date**: November 2025 - Fully operational with users and wills tables

**Islamic Design Sensitivity**:
- **Problem**: Legal application requiring cultural appropriateness
- **Solution**: Material Design base with Islamic aesthetic adaptations (teal palette, Arabic fonts, minimal gold accents)
- **Rationale**: Trust-building through cultural recognition while maintaining professional credibility
- **Pros**: Culturally resonant, professional appearance, accessible
- **Cons**: Requires careful balance to avoid kitsch, font loading considerations

**Client-Side First Architecture**:
- **Problem**: Need responsive UI with minimal backend initially
- **Solution**: Rich client-side React application with backend as future enhancement
- **Rationale**: Faster MVP, better perceived performance
- **Pros**: Immediate interactivity, works offline (partially), easier deployment
- **Cons**: SEO limitations, eventual need for server-side features
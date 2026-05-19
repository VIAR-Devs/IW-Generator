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
//
// gdprConsentAt + gdprConsentVersion record the consent moment required
// by Charter Item 5. A null timestamp means the user has not yet consented
// under the current policy version. The version string lets us re-prompt
// when the policy materially changes.
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name").notNull(),
  isAdmin: integer("is_admin").default(0),
  signupSource: varchar("signup_source", { length: 50 }),
  onboardingStatus: varchar("onboarding_status", { length: 50 }).default("pending"),
  onboardingStartedAt: timestamp("onboarding_started_at"),
  // Engagement tracking (Phase 1 — populated by Resend event webhook)
  lastOpenedAt: timestamp("last_opened_at"),
  lastClickedAt: timestamp("last_clicked_at"),
  openCount: integer("open_count").default(0),
  clickCount: integer("click_count").default(0),
  bounceStatus: varchar("bounce_status", { length: 50 }), // null | soft | hard | complaint
  unsubscribedAt: timestamp("unsubscribed_at"),
  // GDPR consent moment (Charter Item 5 — recorded at payment step)
  gdprConsentAt: timestamp("gdpr_consent_at"),
  gdprConsentVersion: varchar("gdpr_consent_version", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  wills: many(wills),
  userContext: one(userContext),
  consents: many(consents),
  emailEvents: many(emailEvents),
  conversationSessions: many(conversationSessions),
  gapsAnalysis: many(gapsAnalysis),
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

// Admin Audit Log Table — records every admin-bypass action against PII tables.
// Required by Charter Item 4 ("admin bypass logged in audit table"). Inserted by
// requireAdmin middleware before the handler runs; never deleted in normal ops.
export const adminAuditLog = pgTable("admin_audit_log", {
  id: serial("id").primaryKey(),
  adminEmail: varchar("admin_email", { length: 255 }).notNull(),
  adminUserId: integer("admin_user_id").references(() => users.id),
  action: varchar("action", { length: 100 }).notNull(),
  route: varchar("route", { length: 255 }),
  targetUserId: integer("target_user_id"),
  metadata: jsonb("metadata"),
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AdminAuditLog = typeof adminAuditLog.$inferSelect;
export const insertAdminAuditLogSchema = createInsertSchema(adminAuditLog).omit({
  id: true,
  createdAt: true,
});
export type InsertAdminAuditLog = z.infer<typeof insertAdminAuditLogSchema>;

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

// Assistance Requests Table (Route 2 & 3 - users needing personal guidance)
export const assistanceRequests = pgTable("assistance_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  message: text("message"),
  currentStep: integer("current_step").notNull(),
  willId: integer("will_id").references(() => wills.id),
  status: varchar("status", { length: 20 }).notNull().default("pending"), // 'pending', 'contacted', 'resolved'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
});

export type AssistanceRequest = typeof assistanceRequests.$inferSelect;
export const insertAssistanceRequestSchema = createInsertSchema(assistanceRequests).omit({
  id: true,
  createdAt: true,
});
export type InsertAssistanceRequest = z.infer<typeof insertAssistanceRequestSchema>;

// ──────────────────────────────────────────────────────────────────────────
// Phase 1 Foundations (iw-025) — conversational rebuild prerequisites
// Spec: 00_foundation/specs/iw-generator-conversational-spec-v1.md
// ──────────────────────────────────────────────────────────────────────────

// Consents Table — three-way consent model per data policy template
// (service_delivery, ecosystem_matching, marketing)
export const consents = pgTable("consents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  consentType: varchar("consent_type", { length: 50 }).notNull(), // 'service_delivery' | 'ecosystem_matching' | 'marketing'
  granted: integer("granted").notNull().default(0), // 0/1 bool
  grantedAt: timestamp("granted_at"),
  withdrawnAt: timestamp("withdrawn_at"),
  policyVersion: varchar("policy_version", { length: 20 }),
  method: varchar("method", { length: 50 }), // 'checkbox' | 'api' | 'email_unsubscribe' | 'admin'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const consentsRelations = relations(consents, ({ one }) => ({
  user: one(users, { fields: [consents.userId], references: [users.id] }),
}));

export type Consent = typeof consents.$inferSelect;
export const insertConsentSchema = createInsertSchema(consents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertConsent = z.infer<typeof insertConsentSchema>;

// User Context Table — captured beyond-the-will data used for ecosystem routing
// + gap analysis. One row per user.
export const userContext = pgTable("user_context", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique().references(() => users.id),
  estateSizeBand: varchar("estate_size_band", { length: 20 }), // 'under-100k' | '100-500k' | '500k-1m' | '1m-plus' | 'prefer-not-say'
  hasBusinessOwnership: integer("has_business_ownership"), // 0/1 nullable
  overseasAssets: integer("overseas_assets"), // 0/1 nullable
  overseasJurisdictions: jsonb("overseas_jurisdictions").$type<string[]>(),
  migrationIntent: varchar("migration_intent", { length: 30 }), // 'none' | 'considering' | 'actively-planning' | 'already-moved'
  migrationDestination: text("migration_destination"),
  givingIntentLevel: varchar("giving_intent_level", { length: 20 }), // 'none' | 'occasional' | 'regular' | 'substantial'
  preferredCauses: jsonb("preferred_causes").$type<string[]>(), // ['water', 'orphans', 'education', 'health', 'dawah', 'local-masjid', 'other']
  ageBand: varchar("age_band", { length: 20 }),
  cityBand: varchar("city_band", { length: 100 }),
  referrerSource: varchar("referrer_source", { length: 50 }), // 'organic' | 'ad' | 'signature-project' | 'middle-way' | 'direct'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userContextRelations = relations(userContext, ({ one }) => ({
  user: one(users, { fields: [userContext.userId], references: [users.id] }),
}));

export type UserContext = typeof userContext.$inferSelect;
export const insertUserContextSchema = createInsertSchema(userContext).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertUserContext = z.infer<typeof insertUserContextSchema>;

// Email Events Table — time-series log of Resend webhook events
// Keyed to user (when known) or recipient_email (when anonymous)
export const emailEvents = pgTable("email_events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id), // nullable — events may arrive before user is created
  messageId: varchar("message_id", { length: 255 }),
  eventType: varchar("event_type", { length: 50 }).notNull(), // 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'complained' | 'unsubscribed'
  subject: text("subject"),
  recipientEmail: varchar("recipient_email", { length: 255 }),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  occurredAt: timestamp("occurred_at").defaultNow().notNull(),
});

export const emailEventsRelations = relations(emailEvents, ({ one }) => ({
  user: one(users, { fields: [emailEvents.userId], references: [users.id] }),
}));

export type EmailEvent = typeof emailEvents.$inferSelect;
export const insertEmailEventSchema = createInsertSchema(emailEvents).omit({
  id: true,
  occurredAt: true,
});
export type InsertEmailEvent = z.infer<typeof insertEmailEventSchema>;

// Conversation Sessions Table — one row per conversational session
// Pre-user-creation sessions keyed by session_token; linked to user once email is captured
export const conversationSessions = pgTable("conversation_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id), // nullable until email captured at beat ~3
  sessionToken: varchar("session_token", { length: 64 }).notNull().unique(),
  journeyType: varchar("journey_type", { length: 30 }), // 'self-serve' | 'assisted' | 'abandoned-recovered' | 'complex'
  currentBeat: varchar("current_beat", { length: 50 }),
  beatsCompleted: jsonb("beats_completed").$type<string[]>(),
  messages: jsonb("messages").$type<Array<{ role: "user" | "assistant"; content: string; timestamp: string }>>(),
  contextSnapshot: jsonb("context_snapshot").$type<Record<string, unknown>>(), // latest AI layer context for resume
  abandonedAt: timestamp("abandoned_at"),
  recoveredAt: timestamp("recovered_at"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  lastActivityAt: timestamp("last_activity_at").defaultNow().notNull(),
});

export const conversationSessionsRelations = relations(conversationSessions, ({ one }) => ({
  user: one(users, { fields: [conversationSessions.userId], references: [users.id] }),
}));

export type ConversationSession = typeof conversationSessions.$inferSelect;
export const insertConversationSessionSchema = createInsertSchema(conversationSessions).omit({
  id: true,
  startedAt: true,
  lastActivityAt: true,
});
export type InsertConversationSession = z.infer<typeof insertConversationSessionSchema>;

// Gaps Analysis Table — one row per will issuance. Holds the personalised gap list
// surfaced at the payment/report moment + CTA click telemetry.
export const gapsAnalysis = pgTable("gaps_analysis", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  willId: integer("will_id").references(() => wills.id),
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
  gaps: jsonb("gaps").$type<Array<{
    gap_type: string; // 'trust' | 'lpa' | 'iht' | 'cross_jurisdiction' | 'probate' | 'gift_strategy' | 'sadaqah_jariyah' | 'ongoing_review'
    severity: "low" | "medium" | "high";
    recommended_route: string; // 'tabs' | 'hadleys' | 'sdqa-signature' | 'middle-way' | 'khatmah' | 'self-serve-review'
    reasoning: string;
  }>>().notNull(),
  surfacedToUser: integer("surfaced_to_user").default(0),
  surfacedAt: timestamp("surfaced_at"),
  ctaClicks: jsonb("cta_clicks").$type<Array<{ gap_type: string; cta: string; clicked_at: string }>>(),
});

export const gapsAnalysisRelations = relations(gapsAnalysis, ({ one }) => ({
  user: one(users, { fields: [gapsAnalysis.userId], references: [users.id] }),
  will: one(wills, { fields: [gapsAnalysis.willId], references: [wills.id] }),
}));

export type GapsAnalysis = typeof gapsAnalysis.$inferSelect;
export const insertGapsAnalysisSchema = createInsertSchema(gapsAnalysis).omit({
  id: true,
  generatedAt: true,
});
export type InsertGapsAnalysis = z.infer<typeof insertGapsAnalysisSchema>;

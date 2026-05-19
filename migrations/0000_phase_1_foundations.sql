CREATE TABLE "assistance_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"message" text,
	"current_step" integer NOT NULL,
	"will_id" integer,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"resolved_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "consents" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"consent_type" varchar(50) NOT NULL,
	"granted" integer DEFAULT 0 NOT NULL,
	"granted_at" timestamp,
	"withdrawn_at" timestamp,
	"policy_version" varchar(20),
	"method" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversation_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"session_token" varchar(64) NOT NULL,
	"journey_type" varchar(30),
	"current_beat" varchar(50),
	"beats_completed" jsonb,
	"messages" jsonb,
	"context_snapshot" jsonb,
	"abandoned_at" timestamp,
	"recovered_at" timestamp,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp,
	"last_activity_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "conversation_sessions_session_token_unique" UNIQUE("session_token")
);
--> statement-breakpoint
CREATE TABLE "email_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"message_id" varchar(255),
	"event_type" varchar(50) NOT NULL,
	"subject" text,
	"recipient_email" varchar(255),
	"metadata" jsonb,
	"occurred_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gaps_analysis" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"will_id" integer,
	"generated_at" timestamp DEFAULT now() NOT NULL,
	"gaps" jsonb NOT NULL,
	"surfaced_to_user" integer DEFAULT 0,
	"surfaced_at" timestamp,
	"cta_clicks" jsonb
);
--> statement-breakpoint
CREATE TABLE "scheduled_jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"job_type" varchar(50) NOT NULL,
	"scheduled_for" timestamp NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"attempts" integer DEFAULT 0,
	"last_attempt_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_context" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"estate_size_band" varchar(20),
	"has_business_ownership" integer,
	"overseas_assets" integer,
	"overseas_jurisdictions" jsonb,
	"migration_intent" varchar(30),
	"migration_destination" text,
	"giving_intent_level" varchar(20),
	"preferred_causes" jsonb,
	"age_band" varchar(20),
	"city_band" varchar(100),
	"referrer_source" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_context_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"full_name" text NOT NULL,
	"is_admin" integer DEFAULT 0,
	"signup_source" varchar(50),
	"onboarding_status" varchar(50) DEFAULT 'pending',
	"onboarding_started_at" timestamp,
	"last_opened_at" timestamp,
	"last_clicked_at" timestamp,
	"open_count" integer DEFAULT 0,
	"click_count" integer DEFAULT 0,
	"bounce_status" varchar(50),
	"unsubscribed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "wills" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"status" varchar(20) DEFAULT 'draft' NOT NULL,
	"form_data" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "assistance_requests" ADD CONSTRAINT "assistance_requests_will_id_wills_id_fk" FOREIGN KEY ("will_id") REFERENCES "public"."wills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consents" ADD CONSTRAINT "consents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_sessions" ADD CONSTRAINT "conversation_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "email_events" ADD CONSTRAINT "email_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gaps_analysis" ADD CONSTRAINT "gaps_analysis_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gaps_analysis" ADD CONSTRAINT "gaps_analysis_will_id_wills_id_fk" FOREIGN KEY ("will_id") REFERENCES "public"."wills"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "scheduled_jobs" ADD CONSTRAINT "scheduled_jobs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_context" ADD CONSTRAINT "user_context_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wills" ADD CONSTRAINT "wills_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
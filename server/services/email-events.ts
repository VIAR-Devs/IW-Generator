import { Webhook } from "svix";
import { db } from "../db";
import { emailEvents, users, type InsertEmailEvent } from "@shared/schema";
import { eq, sql } from "drizzle-orm";

// Resend webhook event shape. Reference: https://resend.com/docs/dashboard/webhooks/event-types
// Types we care about: email.sent / delivered / opened / clicked / bounced / complained / unsubscribed
export interface ResendWebhookEvent {
  type: string;
  created_at: string;
  data: {
    email_id?: string;
    created_at?: string;
    from?: string;
    to?: string[] | string;
    subject?: string;
    bounce?: {
      type?: "Transient" | "Permanent";
      message?: string;
    };
    click?: {
      link?: string;
      timestamp?: string;
    };
    [key: string]: unknown;
  };
}

/**
 * Verify a Resend webhook payload signature using Svix.
 * Returns the parsed event on success, throws on failure.
 *
 * Call BEFORE parsing the body with express.json() — the raw buffer is required.
 */
export function verifyResendWebhook(
  rawBody: Buffer,
  headers: {
    "svix-id"?: string | string[];
    "svix-timestamp"?: string | string[];
    "svix-signature"?: string | string[];
  },
  webhookSecret: string,
): ResendWebhookEvent {
  const wh = new Webhook(webhookSecret);

  const headerPayload: Record<string, string> = {};
  for (const key of ["svix-id", "svix-timestamp", "svix-signature"] as const) {
    const v = headers[key];
    if (!v) throw new Error(`Missing webhook header: ${key}`);
    headerPayload[key] = Array.isArray(v) ? v[0] : v;
  }

  return wh.verify(rawBody.toString("utf8"), headerPayload) as ResendWebhookEvent;
}

/**
 * Map a Resend event type to our canonical event_type enum.
 * Canonical set: sent | delivered | opened | clicked | bounced | complained | unsubscribed | delivery_delayed
 */
function normaliseEventType(resendType: string): string {
  // "email.opened" -> "opened", "email.delivery_delayed" -> "delivery_delayed"
  return resendType.replace(/^email\./, "");
}

/**
 * Persist a verified Resend event to email_events and update user engagement fields.
 * Idempotent where possible (duplicate events from Resend retries are tolerated — we'll
 * write them both but downstream analytics can de-dupe on svix-id if needed).
 */
export async function persistResendEvent(event: ResendWebhookEvent): Promise<void> {
  const eventType = normaliseEventType(event.type);
  const data = event.data || {};
  const messageId = (data.email_id as string | undefined) ?? null;
  const subject = (data.subject as string | undefined) ?? null;

  const toField = data.to;
  const recipientEmail = Array.isArray(toField) ? toField[0] : (toField as string | undefined) ?? null;

  // Best-effort user lookup by recipient email. Events for unknown emails still recorded
  // (email lands in inbox first, user account may be created later in the funnel).
  let userId: number | null = null;
  if (recipientEmail) {
    const userRow = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, recipientEmail))
      .limit(1);
    if (userRow.length > 0) {
      userId = userRow[0].id;
    }
  }

  const toInsert: InsertEmailEvent = {
    userId,
    messageId,
    eventType,
    subject,
    recipientEmail,
    metadata: data as Record<string, unknown>,
  };

  await db.insert(emailEvents).values(toInsert);

  // Update user engagement columns when the event is user-attributable.
  if (userId !== null) {
    switch (eventType) {
      case "opened":
        await db
          .update(users)
          .set({
            lastOpenedAt: new Date(event.created_at),
            openCount: sql`COALESCE(${users.openCount}, 0) + 1`,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userId));
        break;

      case "clicked":
        await db
          .update(users)
          .set({
            lastClickedAt: new Date(event.created_at),
            clickCount: sql`COALESCE(${users.clickCount}, 0) + 1`,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userId));
        break;

      case "bounced": {
        const bounceType = (data.bounce as { type?: string } | undefined)?.type;
        const status =
          bounceType === "Permanent" ? "hard" : bounceType === "Transient" ? "soft" : "unknown";
        await db
          .update(users)
          .set({ bounceStatus: status, updatedAt: new Date() })
          .where(eq(users.id, userId));
        break;
      }

      case "complained":
        await db
          .update(users)
          .set({ bounceStatus: "complaint", updatedAt: new Date() })
          .where(eq(users.id, userId));
        break;

      case "unsubscribed":
        await db
          .update(users)
          .set({ unsubscribedAt: new Date(event.created_at), updatedAt: new Date() })
          .where(eq(users.id, userId));
        break;

      // "sent" | "delivered" | "delivery_delayed" — logged only; no user-field updates
      default:
        break;
    }
  }
}

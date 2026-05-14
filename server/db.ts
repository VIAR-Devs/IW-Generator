import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { sql, type ExtractTablesWithRelations } from 'drizzle-orm';
import type { NeonQueryResultHKT } from 'drizzle-orm/neon-serverless';
import type { PgTransaction } from 'drizzle-orm/pg-core';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });

type Schema = typeof schema;
export type Tx = PgTransaction<NeonQueryResultHKT, Schema, ExtractTablesWithRelations<Schema>>;

// Runs `fn` inside a transaction with per-request RLS context set. The two
// session variables (app.user_id, app.is_admin) are SET LOCAL so they apply
// only to the transaction and are cleared on commit/rollback — see
// migrations/0001_enable_rls.sql for the policies that read them.
//
// Once the production DB connects as the non-bypass `app_user` role (see
// RUNBOOK "RLS role swap"), all PII-touching storage methods must run inside
// withUserContext(). Before the role swap this is a no-op safety net.
export async function withUserContext<T>(
  context: { userId: number | null; isAdmin: boolean },
  fn: (tx: Tx) => Promise<T>,
): Promise<T> {
  return db.transaction(async (tx) => {
    const userIdStr = context.userId === null ? "" : String(context.userId);
    const isAdminStr = context.isAdmin ? "true" : "false";
    await tx.execute(sql`SELECT set_config('app.user_id', ${userIdStr}, true)`);
    await tx.execute(sql`SELECT set_config('app.is_admin', ${isAdminStr}, true)`);
    return fn(tx);
  });
}

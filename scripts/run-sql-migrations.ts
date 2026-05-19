// Apply raw SQL migrations in lexical order.
//
// Drizzle's `db:push` syncs the table schema but does not handle RLS policies,
// roles, or grants. Those live as plain SQL files in migrations/ and are
// applied by this script. Each file is executed atomically (BEGIN/COMMIT live
// inside the file itself). Tracking lives in a small `_sql_migrations` table.
//
// Usage:
//   tsx scripts/run-sql-migrations.ts            # apply pending migrations
//   tsx scripts/run-sql-migrations.ts --status   # show applied + pending
//
// DATABASE_URL must be set. The connection MUST be the database owner (or a
// role with BYPASSRLS + CREATE ROLE), not the app_user role — see RUNBOOK.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.resolve(__dirname, "..", "migrations");

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set to run migrations.");
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const statusOnly = process.argv.includes("--status");

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS _sql_migrations (
        filename TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const applied = new Set<string>(
      (await pool.query<{ filename: string }>("SELECT filename FROM _sql_migrations"))
        .rows.map((r) => r.filename),
    );

    const files = fs.existsSync(MIGRATIONS_DIR)
      ? fs.readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith(".sql")).sort()
      : [];

    if (statusOnly) {
      console.log(`Migration directory: ${MIGRATIONS_DIR}`);
      console.log("");
      for (const f of files) {
        console.log(`${applied.has(f) ? "✓" : "·"} ${f}`);
      }
      return;
    }

    const pending = files.filter((f) => !applied.has(f));
    if (pending.length === 0) {
      console.log("No pending migrations.");
      return;
    }

    for (const file of pending) {
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8");
      console.log(`Applying ${file}...`);
      await pool.query(sql);
      await pool.query("INSERT INTO _sql_migrations (filename) VALUES ($1)", [file]);
      console.log(`  ✓ applied`);
    }

    console.log(`\nApplied ${pending.length} migration(s).`);
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

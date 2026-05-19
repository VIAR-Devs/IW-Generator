# ADR 0003 — Row-level security & per-request row access

Date: 2026-05-14
Status: Active (migration written; role swap is a deploy-time action)

## Context

The IW Generator stores user-scoped PII (names, addresses, DOBs, beneficiaries, estate values, executor and guardian details) in two tables: `users` and `wills`. A third table, `scheduled_jobs`, holds user-keyed delivery state for follow-up emails. The Phase 1 conversational layer adds four more user-scoped tables on a separate branch.

Charter Item 4 requires every PII table to enforce row-level access — a user can read/write only their own rows — with admin-bypass logged to an audit table. Application-layer ownership checks alone don't meet that bar: a bug in any future route could leak rows across users, and bug discovery typically happens after the leak, not before.

Neon Postgres supports native row-level security. The question was how to enforce it given the live stack constraints:
- the app uses `@neondatabase/serverless` with a WebSocket-backed `Pool`, so SET LOCAL session variables persist across queries within a single client checkout
- Drizzle's default query path picks a fresh client per call, which would break SET LOCAL
- the production DB connects today as a role with implicit BYPASSRLS, so even a perfect policy set would not enforce until the role is changed

## Decision

Three pieces:

1. **Migration `migrations/0001_enable_rls.sql`** enables RLS on `users`, `wills`, `scheduled_jobs`, and the new `admin_audit_log` table; creates two policies per table (owner-access + admin-bypass) using two session variables (`app.user_id`, `app.is_admin`); and creates an `app_user` role with no BYPASSRLS plus the necessary GRANTs.

2. **Helper `withUserContext(context, fn)` in `server/db.ts`** wraps the work in a Drizzle transaction, sets the two session variables via `set_config('app.user_id', ..., true)` and `set_config('app.is_admin', ..., true)` (transaction-scoped), and yields the transaction handle for queries.

3. **Role swap is a deploy-time action**, documented in RUNBOOK ("RLS role swap"). The migration creates `app_user` but cannot rotate the production `DATABASE_URL` — that is a Neon dashboard + Replit Secrets / Vercel env action. Until that swap happens, the existing connection retains BYPASSRLS and the policies are visible but not enforced.

## Why session variables, not row-scoped connection pooling

Two alternatives were considered and rejected:

- **Per-tenant connection pools** — would require a non-trivial connection-manager rewrite, and Neon's serverless pool limit (~10 simultaneous WS connections on Hacker tier) makes this fragile at scale.
- **Inlining user-id checks in every WHERE clause** — fragile in exactly the way RLS is meant to protect against (a forgotten clause is a leak).

`set_config('app.user_id', ..., true)` is the canonical Postgres pattern for this. The `true` third argument makes the setting local to the current transaction, which guarantees it cannot bleed into the next query on the same pooled connection.

## Why FORCE ROW LEVEL SECURITY

Without `FORCE`, the table owner bypasses policies. Replit's Neon connection often uses the owner role. `FORCE` makes the policies apply to everyone including the owner — defence in depth against a dev mis-configuration.

## Admin audit log

A new table `admin_audit_log` captures admin-bypass actions: `admin_email`, `admin_user_id`, `action`, `route`, `target_user_id` (optional), `metadata` (jsonb), `ip_address`, `created_at`. The `requireAdmin` middleware inserts a row before delegating to the route handler. Inserts are fire-and-forget — a logging failure does not block the admin action, but is logged loudly to stderr.

RLS on `admin_audit_log` itself: anyone can INSERT, only admins can SELECT. This makes the log tamper-resistant against a regular user even if they somehow obtained the connection.

## Consequences

Positive:
- A bug in any future PII-touching route fails closed: queries see zero rows when the context isn't set, not other users' rows.
- Admin actions are auditable after the fact without bolt-on logging.
- The migration is idempotent and replayable, which makes preview-DB rebuilds trivial.

Negative:
- Every PII-touching storage method must eventually move inside `withUserContext()`. This is a refactor across `DatabaseStorage`, and is deferred to the post-launch sprint to avoid bundling it with the launch-window change.
- The role swap is a manual deploy step that someone has to remember. Documented in RUNBOOK with a checklist; no other process protects this.
- A failed admin-audit insert is silent at the user-facing level. Acceptable trade-off vs. blocking the admin action on a transient DB hiccup.

## Migration ordering

The Drizzle schema (`shared/schema.ts`) adds `admin_audit_log` as a regular table. The standard `npm run db:push` will create that table. After push, `npm run migrate:sql` (or `tsx scripts/run-sql-migrations.ts`) applies the RLS DDL. The runner records applied migrations in a `_sql_migrations` table so it is safe to re-run.

## When this ADR gets superseded

- When the conversational Phase 1 branch lands, its four new PII tables (`user_context`, `conversation_sessions`, `email_events`, `gaps_analysis`) need their own RLS migration following this same pattern. That migration goes in as `migrations/0002_*.sql`. This ADR does not need updating — the pattern is the contract.
- When `DatabaseStorage` is refactored to require `withUserContext()` for all PII queries, a follow-up ADR (0004) should document the new query path and any helper changes.

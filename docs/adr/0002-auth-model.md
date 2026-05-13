# ADR 0002 - Auth model

Date: 2026-05-13
Status: **Implemented with one Charter gap (admin allowlist pattern).**

## Context

The IW Generator needs to:
1. Authenticate paying users so they can resume an unfinished will, retrieve their issued PDF, and access the "My Will" dashboard.
2. Authorise an admin tier for Tabs and Garden engineering to inspect cases, manage handoffs, trigger broadcast emails, and view engagement stats.

By 10 April 2026 the live source on Replit had a working implementation: `passport` + `passport-local` + `bcryptjs` for password hashing, `express-session` + `connect-pg-simple` for Postgres-backed sessions, and a `users` table column `isAdmin` for the admin tier.

## Decision

**Authentication:** session-based via Passport (Local strategy). Email + password. Passwords are bcrypt-hashed (10 rounds) at registration time. Sessions persist in Postgres via `connect-pg-simple` and the `wordpress_logged_in_*`-equivalent cookie is `HttpOnly` + `SameSite=Lax`.

**Authorisation today (live state):**
- `requireAuth` middleware uses `req.isAuthenticated()` (Passport's check). Applied to all routes that touch user data.
- `requireAdmin` middleware reads `req.user.isAdmin === 1` (a column on the `users` DB row). Applied to `/api/admin/*` routes (`onboarding-stats`, `test-onboarding`, `broadcast-email`, etc.).
- Two test accounts exist for development: `test@test.com` / `test`.

**Authorisation Charter gap:** the Garden Engineering Charter requires the admin role to be determined from a `ADMIN_EMAILS` env var array, NOT a DB column. The reasoning: a DB-column admin flag is mutable by anyone with DB write access, which means a partner-developer with a Drizzle migration can grant themselves admin without going through a deploy. The env-array pattern means admin grants require deploying the env vars, which is harder to do accidentally.

The plan: refactor `requireAdmin` to check `ADMIN_EMAILS.split(',').includes(req.user.email)`. Keep the `isAdmin` DB column as a denormalised cache during the transition, but make the env array the source of truth. Charter Item 4 stays amber until this refactor lands.

**Service role keys** (Stripe live, Anthropic admin) are server-side only. Verified by `grep -r "STRIPE_SECRET\|ANTHROPIC_API_KEY" client/src/` returning empty on 13 May 2026.

**Row-Level Security:** TODO. Neon Postgres supports native RLS. Every table holding PII (users, wills, plus the Phase 1 branch tables: user_context, conversation_sessions, email_events, gaps_analysis) needs an RLS policy stating "a user reads/writes only their own rows; admin bypasses." This is part of Charter Item 4 close.

## Consequences

**Positive:**
- Auth is wired and working; the live test login proves it.
- Bcrypt + session-cookie is a well-understood pattern, consistent with the rest of the Garden portfolio.

**Negative:**
- Admin allowlist pattern is the wrong shape today. Easy to fix.
- RLS at the DB layer is not yet in place. Risk: a bug in app code that miswrites a query can leak across users. Mitigation: every PR touching DB queries gets the code-reviewer agent on it; RLS landing is the structural fix.

## Open items to close Charter Item 4 fully

1. Refactor `requireAdmin` to use `ADMIN_EMAILS` env array.
2. Add the env var to `.env.example` (done).
3. Enable RLS on `users` + `wills` + the Phase 1 branch tables. Write the policies in a Drizzle migration.
4. Grep verification: confirm no Stripe / Anthropic / DB service-role keys leak to the client bundle. Wire this as a CI step.

## References

- Charter: `~/TheGarden-Context-OS/00_foundation/processes/garden-engineering-charter.md` (Item 4)
- Live auth code: `server/routes.ts` (lines 22, 30, 80, 120 around the auth middleware + register/login routes)
- Live storage: `server/storage.ts` (`DatabaseStorage` class)
- Spec: `iw-generator-conversational-spec-v1.md` §2.5 (Guardrails) and §4 (Data model)
# IW Generator — Runbook

Operational procedures: deploy, rollback, incident response, data restoration, common issues.

Last reviewed: 2026-05-14 (RLS role-swap section added alongside Charter Items 4 + 5 close).

## Deploy

### Current: Replit (v1)

1. Push to `main` (Replit gitsafe-backup) or via the Replit web editor.
2. Replit auto-builds via the `Run` button or `dev` script in `package.json`.
3. Confirm health: hit the live URL, run through one will draft end-to-end, verify Sentry shows no new P0/P1 errors.

### Target: Vercel + Neon (post Charter close)

Migration to Vercel is its own milestone. When it lands, this section becomes:
1. PR merged to `main` after CI green (lint + typecheck + build + test).
2. Vercel deploys preview on PR, production on merge to `main`.
3. Production env vars in Vercel project panel (see `.env.example` for the list).
4. Run smoke test (auth + will draft + payment + PDF + email) post-deploy.

## Rollback

### Replit

- Revert the last commit on `main` in the gitsafe-backup remote.
- Replit auto-rebuilds. Verify the prior version is live.
- If the commit broke the DB schema, restore from Neon point-in-time recovery (see Data restoration below).

### Vercel (target)

- Vercel dashboard → Deployments → Previous successful deployment → Promote to Production.
- DB schema rollback: separate Neon PITR restore (see below).

## Incident response

| Severity | Symptom | First action |
|---|---|---|
| P0 (production down) | Site 5xx, payment failures, mass error spike in Sentry | Roll back to last known good deploy. Notify Irfan + Tabs immediately. |
| P1 (degraded) | Specific flow broken (e.g. Stripe webhook drop, Resend bounce, AI cost overrun) | Identify scope. Isolate or hotfix. |
| P2 (low) | Cosmetic or non-blocking | Open issue. Address in next sprint. |

Communication channels:
- Internal: Garden Collective WhatsApp
- User-facing: Tabs handles direct comms to affected users
- Status: no public status page in v1; planned post-launch

## Data restoration (PITR)

Neon Postgres has Point-in-Time Recovery enabled (free tier: 1 day retention; Pro: 7 days).

Procedure:
1. Neon dashboard → project → Branches → Restore.
2. Choose timestamp to restore to.
3. Update `DATABASE_URL` in Replit/Vercel env to point at the restored branch.
4. Redeploy.
5. Verify with one read query + one write query.

**Quarterly DR drill:** simulate Neon project deletion, restore from PITR, redeploy from GitHub. Document time-to-recovery in `docs/dr-drill-{date}.md`. See Charter Item 6.

## Common issues

### Stripe webhook drop

Symptom: payment completes but no will issued.
Cause: webhook endpoint unreachable or signature verification failed.
Fix:
1. Check Stripe dashboard → Webhooks → recent attempts. Replay any failed events.
2. Verify `STRIPE_WEBHOOK_SECRET` matches the endpoint's signing secret.
3. Check Sentry for any `/api/stripe/webhook` errors.

### Resend bounces

Symptom: user reports not receiving will PDF or follow-up emails.
Fix:
1. Resend dashboard → Logs → search by user email.
2. If `bounced` or `complained`, the user's email is dead - contact them via Tabs to update.
3. If `delivered` but user denies receipt, ask them to check spam.

### AI cost overrun

Symptom: Anthropic spend unexpectedly high.
Fix:
1. Anthropic console → Usage → look for outlier sessions.
2. Check `conversation_sessions` table for sessions with >50 turns or >100k tokens.
3. If abuse pattern detected, throttle at intake or block IP.

### Faraid calculator gives unexpected output

Symptom: user disputes the share distribution.
Fix:
1. Pull the heirs snapshot from `wills` table for that user.
2. Re-run the deterministic Faraid calculator with the same input.
3. If output differs, there's a bug — escalate to Tabs / Mariam / BLJ for solicitor review BEFORE talking to user.
4. Faraid is deterministic and unit-tested; this should never happen in practice.

## RLS role swap (one-time, before first paid traffic)

`migrations/0001_enable_rls.sql` creates an `app_user` role with no BYPASSRLS and enables FORCE ROW LEVEL SECURITY on the four PII tables. Until the production `DATABASE_URL` connects as `app_user`, the existing owner-role connection still bypasses every policy. Do the swap before the first paid traffic lands.

1. Apply the migration if you haven't already: `npm run db:push` (creates `admin_audit_log` and the GDPR consent columns on `users`), then `tsx scripts/run-sql-migrations.ts` (enables RLS + creates the `app_user` role + policies).
2. In the Neon dashboard, open the IW Generator project → Roles → `app_user`. Reset / set the password and copy the connection string (it starts `postgresql://app_user:...`).
3. In Replit Secrets (v1) or the Vercel env panel (Phase 2), update `DATABASE_URL` to the new connection string. Keep the old owner-role string in a safe place for rollback.
4. Redeploy. Hit the live URL and run through one will draft end-to-end while signed in. Check Replit logs (or Sentry once wired) for `permission denied for table` — that means a query is running outside `withUserContext()` and needs refactoring.
5. Positive proof: connect as `app_user` from the Neon SQL editor (no session variables set) and run `SELECT * FROM users LIMIT 1`. Expected: zero rows. Rows coming back means the role inherited BYPASSRLS from a parent role — fix at the Neon role level before continuing.

Rollback: switch `DATABASE_URL` back to the owner-role connection string and redeploy. The migration leaves the policies in place; they just stop enforcing while the bypass role is in use.

See `docs/adr/0003-rls-and-row-access.md` for the full model.

## Privacy policy version bump

`PaymentStep.tsx` ships a `PRIVACY_POLICY_VERSION` constant. When `docs/data-policy.md` changes materially (new vendor, new processing purpose, retention shift) bump it. Existing users will get a re-prompt on their next visit to the payment step — their stored `gdpr_consent_version` no longer matches the current one, so the checkbox unticks. The `/privacy` and `/terms` routes render from the policy doc; keep them in lockstep.

## On-call (post-launch)

Until paid traffic is on, Tabs is first point of contact for user-side issues. Irfan handles infra/code issues. No formal rotation in v1.

## Cache

The IW Generator does not have its own page cache layer in v1 (Replit serves dynamic). No cache purge step in deploy. When migrated to Vercel, Vercel edge cache rules will be set per route in `vercel.json`.

The islamicwills.pro **marketing site** is separate (WordPress + Bridge theme + SG Optimizer + Elementor). For marketing site cache purge see `~/.claude/projects/-Users-irfanakram-TheGarden-Context-OS/memory/reference_iw_wordpress_stack.md`.

## When in doubt

- Don't push to main on Friday afternoon.
- Don't write `_elementor_data` via the WP REST API (rule applies to the marketing site, not this app, but cited here for completeness).
- For any data-loss-risking operation, restore-from-PITR is the answer.
- For any user-facing comms during an incident, route through Tabs.
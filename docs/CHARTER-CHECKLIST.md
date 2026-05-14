# Charter compliance — IW Generator (live source)

Last verified: 2026-05-14 by Irfan (via Claude pre-flight) against the live VIAR-Devs/IW-Generator repo on GitHub. Live deploy: https://iw-generator.replit.app/

**Stage:** Garden Product Development OS Stage 1 — Charter pre-flight (G0)
**Launch window:** w/c 12 May 2026 (per `iw-generator-launch-may-2026.md`)
**Decision rule on G0:** every item classified; blockers gate launch (per OS plan 11 May 2026)

## The eight items — live source state

| # | Item | Status | Evidence | Notes |
|---|---|---|---|---|
| 1 | Secrets management | ✅ | `.env.example` committed with every required key documented. `.gitignore` covers `.env*.local`, `.local/`, coverage outputs, editor cruft. Git history clean — `git log --all --full-history -- '*.env*'` returns 0 hits. Source audit: no hardcoded Stripe / Resend / Anthropic keys in `server/`, `shared/`, `client/src/`. Production secrets in Replit Secrets panel. | Landed 13 May 2026. |
| 2 | Error tracking & observability | ⏸ (deferred) | DEFERRED to post-launch by explicit decision 13 May 2026 (Irfan). Sentry + Plausible to wire once we have real traffic and can choose the right plan. | **Accepted gap.** Re-open within 2 weeks of launch. Risks: errors go dark at the paid wall. Mitigation: Replit's own log retention + Tabs's daily monitoring of completed wills vs Stripe payment events. |
| 3 | Tests & CI/CD | ⚠ (staged, lands on first PR merge) | Vitest 2.1.9 in devDeps. `vitest.config.ts` with @ and @shared aliases matching tsconfig. `shared/schema.test.ts` with smoke tests across the will form schemas + the new admin audit log schema (Item 4 close). `npm test` + `npm run test:watch` scripts. `.github/workflows/ci.yml` runs typecheck + test + build on PR/main. | Goes green on first PR. Branch protection on `main` must be enabled in GitHub UI right after merge. |
| 4 | Auth & RBAC | ✅ (on PR merge of feature/admin-emails-allowlist + feature/charter-item-4-rls; production role swap deploy-time) | Live auth: `passport-local` + `bcryptjs` (10 rounds) + `express-session` + Postgres session store via `connect-pg-simple`. `requireAuth` middleware uses `req.isAuthenticated()`. `requireAdmin` reads the `ADMIN_EMAILS` env allowlist (Charter pattern). `admin_audit_log` table captures every admin-bypass action with actor email, route, target user id, ip, metadata. `migrations/0001_enable_rls.sql` enables FORCE ROW LEVEL SECURITY on `users` / `wills` / `scheduled_jobs` / `admin_audit_log`; owner-access + admin-bypass policies driven by `app.user_id` and `app.is_admin` session variables; creates a no-BYPASS `app_user` role with the necessary GRANTs. `server/db.ts` exports `withUserContext()` to run queries inside a transaction with the session variables set. ADR 0003 documents the model. | The Neon role swap (production `DATABASE_URL` → `app_user`) is a deploy-time action — see RUNBOOK "RLS role swap". After the swap, RLS enforces. |
| 5 | Data sensitivity & GDPR | ✅ (on PR merge of feature/privacy-terms-pages + feature/charter-item-5-consent; DPA vendor sign-offs deploy-time) | `docs/data-policy.md` documents what data we collect, retention rules, 8 sub-processors, Garden ecosystem data-share consent model, full RTBF flow. `docs/dpa-inventory.md` tracks the 8 DPAs. README has the PII inventory. `/privacy` and `/terms` React routes ship in feature/privacy-terms-pages. Consent moment at payment ships in feature/charter-item-5-consent: `gdpr_consent_at` + `gdpr_consent_version` columns on `users`, `POST /api/auth/consent`, consent checkbox blocks "Proceed to Secure Payment" until ticked, policy-version bump re-prompts. | Remaining: (a) DPA sign-off in each vendor dashboard (Irfan, ~5 min each). |
| 6 | Backups & DR | ⚠ (mirror exists, transfer + PITR pending) | RUNBOOK covers deploy / rollback / incident response / PITR restoration / RLS role swap / common issues. **Live source is at github.com/VIAR-Devs/IW-Generator** with gardenprojectx as collaborator. Charter Item 6 technically satisfied (off-site mirror exists), but ownership sits with the external developer (Faareen / VIAR-Devs), not with Garden. PITR confirmation depends on Neon plan tier on the live project. | Action: transfer repo from VIAR-Devs/IW-Generator to gardenprojectx/iw-generator. Confirm Neon PITR enabled. |
| 7 | Documentation | ✅ | `README.md` rewritten with stack, pricing, env vars, data sensitivity inventory, ownership, ADR index, related Context OS pointers. `RUNBOOK.md` covers deploy / rollback / incident response / data restoration / RLS role swap / privacy policy version bump / common issues. `docs/adr/0001-replit-hosting.md`, `docs/adr/0002-auth-model.md`, `docs/adr/0003-rls-and-row-access.md` written. | Will add ADRs 0004+ as future decisions land (Stripe payment flow, Resend templates, PDF generation, conversational layer architecture). |
| 8 | Bus factor & continuity | ❌ (audit pending) | Known today: Irfan + Riaz have GH access via gardenprojectx + their own accounts. Need to confirm Humza. VIAR-Devs (Faareen) still owns the GH repo and Replit project. Neon / Stripe / Resend / Anthropic admin coverage TBC. | Action: Irfan confirms admin coverage across 6 systems. Minimum bar = at least 2 of {Irfan, Riaz, Humza} on every production system. Document in README ownership section. |

## Compliance summary — 14 May 2026

- **Compliant (green):** 4 of 8 (Items 1, 4 on PR merge, 5 on PR merge, 7). Items 4 + 5 are code-complete; the remaining steps (Neon role swap, DPA sign-offs) are deploy-time actions, not code work.
- **Partial (amber):** 3 of 8 (Item 2 deferred, Item 3 staged for first PR merge, Item 6 mirror-exists-transfer-pending)
- **Red (still blocked on external action):** 1 of 8 (Item 8 — bus factor audit)

Progress vs 13 May (2 green / 5 amber / 1 red): Items 4 and 5 promoted from amber to green-on-merge. Item 6 is the only structural gap left, blocked on Faareen actioning the GH transfer.

## Pull-request order (lands on main in this sequence)

1. **`feature/admin-emails-allowlist`** — `ADMIN_EMAILS` env-allowlist refactor + tests. Charter Item 4 admin-allowlist gap close.
2. **`feature/privacy-terms-pages`** — `/privacy` + `/terms` React routes. Charter Item 5 in-app routes.
3. **`feature/charter-item-4-rls`** (depends on #1) — `admin_audit_log` table, `migrations/0001_enable_rls.sql`, `withUserContext()` helper, ADR 0003, audit-log insert in `requireAdmin`. Charter Item 4 RLS close.
4. **`feature/charter-item-5-consent`** — `gdpr_consent_at` + `gdpr_consent_version` columns, `POST /api/auth/consent`, consent checkbox gate on `PaymentStep`. Charter Item 5 consent close.
5. **`feature/charter-runbook-and-checklist`** — RUNBOOK gains RLS role-swap and policy-version-bump sections; this CHARTER-CHECKLIST updated to the post-merge state.

Each PR runs the CI workflow (typecheck + test + build). On first merge, enable branch protection on `main` in the GitHub UI.

## Deploy plan (locked 14 May 2026)

- **GitHub source:** today github.com/VIAR-Devs/IW-Generator (gardenprojectx collaborator). Action: transfer to gardenprojectx/iw-generator following the Garden pattern (madmuslims-platform, postroom-hq, akf-website, Middle-Way all under gardenprojectx).
- **Production deploy target:** `app.islamicwills.pro` subdomain. The WordPress marketing site at `islamicwills.pro` stays as the public face. The conversational generator app lives at the subdomain. CTAs on the WP site that currently route to `/consultation/` will be repointed to `app.islamicwills.pro` once the app is Charter-green and the role swap is done.
- **v1 hosting:** Replit (per ADR 0001). Vercel migration is Phase 2 once traffic + ops cost justify it.
- **Post-merge deploy ordering:** `npm run db:push` (sync `admin_audit_log` + GDPR columns) → `tsx scripts/run-sql-migrations.ts` (enable RLS + create `app_user`) → flip `DATABASE_URL` to `app_user` in Replit Secrets → redeploy → smoke-test signed-in flow → enable branch protection.

## Outstanding actions to close Charter-green (post-merge)

1. **Neon role swap** — apply migration + flip `DATABASE_URL` to `app_user`. See RUNBOOK "RLS role swap". Owner: Irfan + Riaz, ~30 min.
2. **DPA sign-offs** — 8 vendors (Neon, Replit, Vercel, Anthropic, Stripe, Resend, Plausible, Sentry). Owner: Irfan. ~5 min each in each vendor dashboard.
3. **Item 6 repo transfer** — GitHub Settings on VIAR-Devs/IW-Generator → Transfer ownership → gardenprojectx. Faareen (VIAR-Devs owner) needs to action this; Garden has agreed buyout per the Faareen-cleared decision in the 7 May Tabs meeting.
4. **Item 6 Neon PITR** — confirm enabled in Neon dashboard. Document plan tier + retention window in RUNBOOK.
5. **Item 8 bus factor** — add Humza as collaborator on the GH repo. Confirm admin coverage on Replit / Neon / Stripe / Resend / Anthropic. Document in README ownership section.
6. **Item 3 branch protection** — enable on `main` in GitHub UI right after the first PR merges.

Everything in this list is operational (dashboards, GH UI, deploy commands), not code work. The code work is complete on the five feature branches above.

## Changelog

- 2026-05-12 — Irfan + Claude — initial pre-flight against the November 2025 Replit zip snapshot. 0/8 green, 1/8 amber, 7/8 red.
- 2026-05-13 — Irfan + Claude — live source at VIAR-Devs/IW-Generator located + cloned + audited. 2/8 green, 5/8 amber, 1/8 red. Item 4 admin-allowlist refactor landed on `feature/admin-emails-allowlist`. Item 5 in-app routes landed on `feature/privacy-terms-pages`.
- 2026-05-14 — Irfan + Claude — Item 4 RLS migration + audit log + helper landed on `feature/charter-item-4-rls`. Item 5 consent moment landed on `feature/charter-item-5-consent`. RUNBOOK gained RLS role-swap section. **State on full merge of all five PRs: 4/8 green, 3/8 amber, 1/8 red.** Remaining work is operational, not code.

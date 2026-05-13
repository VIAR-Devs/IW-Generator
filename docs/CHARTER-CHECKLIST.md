# Charter compliance - IW Generator (live source)

Last verified: 2026-05-13 by Irfan (via Claude pre-flight) against the live VIAR-Devs/IW-Generator repo on GitHub. Live deploy: https://iw-generator.replit.app/

**Stage:** Garden Product Development OS Stage 1 - Charter pre-flight (G0)
**Launch window:** w/c 12 May 2026 (per `iw-generator-launch-may-2026.md`)
**Decision rule on G0:** every item classified; blockers gate launch (per OS plan 11 May 2026)

## The eight items - live source state

| # | Item | Status | Evidence | Notes |
|---|---|---|---|---|
| 1 | Secrets management | ✅ | `.env.example` committed with every required key documented (DATABASE_URL, SESSION_SECRET, ADMIN_EMAILS, STRIPE_*, RESEND_API_KEY, ANTHROPIC_API_KEY, SENTRY_*, VITE_PLAUSIBLE_*). `.gitignore` extended to cover `.env*.local`, `.local/`, coverage outputs, editor cruft. **Git history clean** - `git log --all --full-history -- '*.env*'` returns 0 hits across both Nov snapshot and live repo. Source audit: no hardcoded Stripe / Resend / Anthropic keys in server/, shared/, client/src/ (verified 13 May 2026 via grep). Production secrets in Replit Secrets panel. | Landed this commit. |
| 2 | Error tracking & observability | ⏸ (deferred) | DEFERRED to post-launch by explicit decision 13 May 2026 (Irfan). Sentry + Plausible to wire once we have real traffic and can choose the right plan. | **Accepted gap.** Re-open within 2 weeks of launch. Risks: errors go dark at the paid wall. Mitigation: Replit's own log retention + Tabs's daily monitoring of completed wills vs Stripe payment events. |
| 3 | Tests & CI/CD | ⚠ (staged, lands on first PR merge) | Vitest 2.1.9 in devDeps. `vitest.config.ts` with @ and @shared aliases matching tsconfig. `shared/schema.test.ts` with 15 smoke tests across basicDetails, executor, guardian, child, funeralPreferences, wasiyyahBeneficiary schemas. `npm test` + `npm run test:watch` scripts. `.github/workflows/ci.yml` runs typecheck + test + build on PR/main. | Goes green on first PR. Branch protection on `main` must be enabled in GitHub UI right after merge. |
| 4 | Auth & RBAC | ⚠ (auth wired, admin-allowlist gap) | Live auth IS implemented (verified 13 May 2026): `passport-local` + `bcryptjs` (10 rounds) + `express-session` + Postgres session store via `connect-pg-simple`. `requireAuth` middleware uses `req.isAuthenticated()`. `DatabaseStorage` class with Drizzle queries (not MemStorage). **One gap:** `requireAdmin` uses `req.user.isAdmin === 1` (DB column boolean), Charter requires `ADMIN_EMAILS` env array. Documented in ADR 0002 as the close-out refactor. No service-role keys leak client-side (grep verified). RLS on PII tables is still TODO. | Admin-allowlist refactor + RLS migration are the two remaining tasks. Both are short. |
| 5 | Data sensitivity & GDPR | ⚠ (docs done, in-app routes + DPA sign-offs pending) | `docs/data-policy.md` documents what data we collect, retention rules, 8 sub-processors, Garden ecosystem data-share consent model, full RTBF flow. `docs/dpa-inventory.md` tracks the 8 DPAs to sign. README has data sensitivity inventory + PII table classification. | Remaining: (a) `/privacy` + `/terms` HTML routes in the app, (b) DPA sign-off in each vendor dashboard (Irfan, ~5 min each), (c) wire the consent moment at payment. |
| 6 | Backups & DR | ⚠ (mirror exists, transfer + PITR pending) | RUNBOOK covers deploy / rollback / incident response / PITR restoration / common issues. **Live source is at github.com/VIAR-Devs/IW-Generator** with gardenprojectx as collaborator. Charter Item 6 technically satisfied (off-site mirror exists), but ownership sits with the external developer (Faareen / VIAR-Devs), not with Garden. PITR confirmation depends on Neon plan tier on the live project. | Action: transfer repo from VIAR-Devs/IW-Generator to gardenprojectx/iw-generator. Confirm Neon PITR enabled. |
| 7 | Documentation | ✅ | `README.md` rewritten with stack, pricing, env vars, data sensitivity inventory, ownership, ADR index, related Context OS pointers. `RUNBOOK.md` covers deploy / rollback / incident response / data restoration / common issues. `docs/adr/0001-replit-hosting.md` and `docs/adr/0002-auth-model.md` written. | Will add ADRs 0003+ as future decisions land (Stripe payment flow, Resend templates, PDF generation, conversational layer architecture). |
| 8 | Bus factor & continuity | ❌ (audit pending) | Known today: Irfan + Riaz have GH access via gardenprojectx + their own accounts. Need to confirm Humza. VIAR-Devs (Faareen) still owns the GH repo and Replit project. Neon / Stripe / Resend / Anthropic admin coverage TBC. | Action: Irfan confirms admin coverage across 6 systems. Minimum bar = at least 2 of {Irfan, Riaz, Humza} on every production system. Document in README ownership section. |

## Compliance summary - 13 May 2026

- **Compliant (green):** 2 of 8 (Items 1, 7)
- **Partial (amber):** 5 of 8 (Items 2 deferred, 3 staged for PR merge, 4 auth-wired-admin-gap, 5 docs-done-routes-pending, 6 mirror-exists-transfer-pending)
- **Red (still blocked on external action):** 1 of 8 (Item 8 - bus factor audit)

Progress vs the 12 May initial pre-flight against the Nov snapshot: 2 newly green, 5 newly amber, 1 still red. The live source verification (Item 4) unblocked the bulk of the assessment.

## Deploy plan (locked 13 May 2026)

- **GitHub source:** today github.com/VIAR-Devs/IW-Generator (Riaz pushed 10 April, gardenprojectx collaborator). Action: transfer to gardenprojectx/iw-generator following the Garden pattern (madmuslims-platform, postroom-hq, akf-website, Middle-Way all under gardenprojectx).
- **Production deploy target:** `app.islamicwills.pro` subdomain. The WordPress marketing site at `islamicwills.pro` (cleaned 12 May 2026 - Faareen / Zahur surfaces removed, services voice-passed) stays as the public face. The conversational generator app lives at the subdomain. CTAs on the WP site that currently route to `/consultation/` will be repointed to `app.islamicwills.pro` once the app is Charter-green.
- **v1 hosting:** Replit (per ADR 0001). Vercel migration is Phase 2 once traffic + ops cost justify it.

## Outstanding actions to close Charter-green

1. **Item 4 admin allowlist refactor.** Replace `req.user.isAdmin === 1` with `ADMIN_EMAILS.split(',').includes(req.user.email)`. Keep `isAdmin` DB column as denormalised cache. ~1 hour.
2. **Item 4 RLS migration.** Drizzle migration enabling RLS on `users` + `wills` + Phase 1 branch tables (`user_context`, `conversation_sessions`, `email_events`, `gaps_analysis`). Policies: a user reads/writes only their own rows; admin bypass logged in audit table. ~2 hours.
3. **Item 5 in-app routes.** `/privacy` + `/terms` React pages that render the policy from `docs/data-policy.md`. ~1 hour.
4. **Item 5 DPA sign-offs.** 8 vendors (Neon, Replit, Vercel, Anthropic, Stripe, Resend, Plausible, Sentry). Owner: Irfan. ~5 min each.
5. **Item 5 consent moment at payment.** UI step before Stripe checkout. ~1 hour.
6. **Item 6 repo transfer.** GitHub Settings on VIAR-Devs/IW-Generator → Transfer ownership → gardenprojectx. Faareen (VIAR-Devs owner) needs to action this; Garden has agreed buyout per the Faareen-cleared decision in the 7 May Tabs meeting.
7. **Item 6 Neon PITR.** Confirm enabled in Neon dashboard.
8. **Item 8 bus factor.** Add Humza as collaborator on the GH repo. Confirm admin coverage on Replit / Neon / Stripe / Resend / Anthropic.

Total to Charter-green: ~6-8 hours of focused work, plus the DPA sign-offs and the Faareen-action transfer step.

## Changelog

- 2026-05-12 - Irfan + Claude - initial pre-flight against the November 2025 Replit zip snapshot. 0/8 green, 1/8 amber, 7/8 red. Live source verification pending.
- 2026-05-13 - Irfan + Claude - live source at VIAR-Devs/IW-Generator located + cloned + audited. Updated assessment: 2/8 green, 5/8 amber, 1/8 red. Charter Item 6 satisfied in principle (off-site mirror exists). Bulk of work shifted from "build" to "tighten" - the live source is more advanced than the Nov snapshot, just needs the Charter floor wrapped around it.

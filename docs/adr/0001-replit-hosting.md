# ADR 0001 - Replit hosting for v1

Date: 2026-05-13
Status: Active

## Context

The IW Generator was built on Replit by VIAR-Devs from Sept 2025 through early 2026, then handed to Garden. The codebase uses Replit-specific Vite plugins (`@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner`, `@replit/vite-plugin-runtime-error-modal`) and the in-Replit gitsafe-backup remote for source control. No GitHub mirror exists as of 13 May 2026.

The 7 May 2026 Tabs meeting committed to launching the £19.99 self-serve will in week of 12 May. The Garden Engineering Charter pre-flight on 12 May 2026 returned 0/8 fully compliant with hard blockers on Item 6 (DR / off-site git mirror) and Item 8 (bus factor — Irfan is the only admin).

The question: stay on Replit for v1 launch, or migrate to Vercel + Neon before launch?

## Decision

Stay on Replit for v1. Migrate to Vercel + Neon as Phase 2, after the generator is in market and we have real traffic data.

## Consequences

**Positive:**
- Faster path to v1 launch. VIAR-Devs codebase runs as-is on Replit. Migrating to Vercel now would add 1-2 weeks of risk and dev work for no user-visible benefit.
- Replit's hosted environment + secrets management is sufficient for v1 traffic volumes (single-digit to low-double-digit wills per day in the first 6 weeks per the launch plan).
- Replit's `gitsafe-backup` provides internal version history.

**Negative:**
- Single hosting vendor lock-in (Charter Item 8 weakness, mitigated by GitHub mirror per ADR 0002).
- Replit-specific Vite plugins are tied to the platform. Migration to Vercel will require removing them, which is a 1-line change but means we cannot directly redeploy the same artefact across both.
- Replit's free tier sleeps after inactivity; production needs at least Replit Hacker tier (paid) for always-on. Cost: ~$7/month, well within v1 budget.

**Mitigations:**
- Push to GitHub immediately (Charter Item 6) as off-site mirror. GitHub remote becomes the canonical source for the team; Replit syncs from there.
- Document the migration path to Vercel in this ADR + RUNBOOK so when Phase 2 kicks off the work is well-scoped.

## Migration trigger

Move to Vercel + Neon when ANY of:
- Traffic exceeds 1,000 sessions/month consistently for 2 months
- Replit ops cost exceeds $50/month
- Replit's environment becomes a friction point (cold starts, log retention, build minute limits)
- A Charter item gets stuck because Replit's platform doesn't support it (e.g. specific Sentry source-map upload integration)

When migrating:
- Remove `@replit/vite-plugin-*` from package.json
- Set up Vercel project + link to GitHub repo
- Migrate env vars (the `.env.example` list)
- Switch DNS for the app subdomain (TBD: app.islamicwills.pro or wills.islamicwills.pro)
- Run smoke test on Vercel preview, then promote to production
- Keep Replit running for 14 days as fallback

## References

- Charter: `~/TheGarden-Context-OS/00_foundation/processes/garden-engineering-charter.md` (Item 6 + Item 8)
- Charter pre-flight artefact: `docs/CHARTER-CHECKLIST.md`
- Launch plan: `~/TheGarden-Context-OS/knowledge_base/business/projects/iw-generator-launch-may-2026.md`
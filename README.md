# IW Generator

The conversational Islamic Will Generator for islamicwills.pro.

A Shariah-compliant Islamic will writing service for the UK market. Guides users through creating a legally valid will that complies with both UK law and Islamic inheritance principles (Faraid). Built as part of [The Garden Network](https://gardenproject.pro) portfolio (Garden 50% / Shaheb 25% / Tabs 25%).

## Status

Stage 1 (Charter pre-flight) of Garden Product Development OS. Live at https://iw-generator.replit.app/ pre-launch. Charter compliance in progress as of 13 May 2026; see `docs/CHARTER-CHECKLIST.md`.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 + TypeScript + Vite |
| UI | Shadcn (Radix UI) + Tailwind CSS |
| Forms | React Hook Form + Zod |
| Routing | Wouter |
| State | TanStack Query + local component state |
| Backend | Express.js + TypeScript (tsx in dev, esbuild in prod) |
| Database | PostgreSQL via Neon serverless |
| ORM | Drizzle ORM (schema + migrations via drizzle-kit) |
| Auth | express-session + Passport (Local) + bcryptjs + connect-pg-simple |
| Payments | Stripe (Checkout sessions + webhooks) |
| Email | Resend |
| Hosting (current) | Replit |
| Hosting (target) | Vercel (post Charter close, per ADR 0001) |
| AI (planned, conversational layer) | Anthropic Claude (Sonnet for prose, Haiku for intent/emotion classification) |
| Observability | Sentry + Plausible (deferred to post-launch) |
| Testing | Vitest |
| CI/CD | GitHub Actions |

## Pricing (locked 7 May 2026)

| Tier | Price | What user gets | Tabs time |
|---|---|---|---|
| Self-serve | £19.99 | Pay-first conversational generator, e-signed PDF emailed back | None |
| Assisted | £49.99 total (£19.99 base + £30 add-on) | Self-serve plus a Tabs call when human help is wanted | 15-30 min |
| Complex | £100+ | Full consultation via Tabs, separate paid matter | Full matter |

The £19.99 self-serve makes the fard accessible. The business sits in the gap services (LPAs, trusts, IHT, probate) that surface at the gaps moment after payment, not in the will price itself. See spec at `~/TheGarden-Context-OS/00_foundation/specs/iw-generator-conversational-spec-v1.md`.

## Local development

```bash
# Prerequisites
node >= 20
npm

# Install
git clone git@github.com:VIAR-Devs/IW-Generator.git ~/dev/iw-generator
cd ~/dev/iw-generator
npm install

# Configure env
cp .env.example .env.local
# Fill in DATABASE_URL, SESSION_SECRET, ADMIN_EMAILS, STRIPE_*, RESEND_API_KEY at minimum

# Push schema to your Neon dev DB (one-time per schema change)
npm run db:push

# Dev
npm run dev
# Express + Vite frontend on :5000

# Tests
npm test           # one-shot
npm run test:watch # watch mode
```

## Env vars

See `.env.example` for the full list. Production values live in the Replit Secrets panel (v1) and will move to Vercel env (Phase 2 per ADR 0001).

## Deployment

Current: Replit (single source, GH mirror at github.com/VIAR-Devs/IW-Generator). gardenprojectx has collaborator access.
Target (post Charter close): Vercel + Neon at `app.islamicwills.pro` subdomain.

See `RUNBOOK.md` for deploy / rollback / incident response.

## Data sensitivity & GDPR

This service collects donor-adjacent family PII at scale. Every table holding will data, user contact details, family structure, or estate values is **PII / sensitive**.

| Table | Sensitivity | RLS required | Notes |
|---|---|---|---|
| `users` | High (PII + auth) | Yes | Email, name, bcrypt password hash, contact details |
| `wills` | High (legal + financial PII) | Yes | Will payload covers names, addresses, DOBs, estate values, beneficiaries, executors, guardians |
| `user_context` (Phase 1 branch) | High | Yes | Estate band, business ownership, migration intent, giving signals |
| `conversation_sessions` (Phase 1 branch) | High | Yes | Full transcripts of the will-writing conversation |
| `email_events` (Phase 1 branch) | Medium | Yes | Resend webhook event log |
| `gaps_analysis` (Phase 1 branch) | Medium | Yes | Personalised gap analysis per user |

Right-to-be-forgotten flow: see `docs/data-policy.md`.
Sub-processors: Neon, Replit, Vercel (target), Anthropic (when conversational layer ships), Resend, Stripe, Plausible (deferred), Sentry (deferred). DPAs tracked in `docs/dpa-inventory.md`.

## Ownership

| Role | Person | Notes |
|---|---|---|
| Product lead | Irfan Akram | Strategy + build direction |
| Operator | Tabs Rashid | Post-launch operator; primary contact for users |
| Original developer | VIAR-Devs (Faareen) | Repo owner. Garden has collaborator access via gardenprojectx. Ownership transfer to gardenprojectx planned as Charter Item 8 close. |
| Cap table | Garden 50% / Shaheb 25% / Tabs 25% | Locked |
| Engineering | Claude Code under Irfan | Tabs onboarding to Claude Code (Visual Studio + £15/mo subscription) |
| Legal review | Solicitor-of-record model | Template review by Mariam / BLJ before production release |

Bus factor: at least two of {Irfan, Riaz, Humza} must have admin access on every production system (Replit / GitHub / Neon / Stripe / Resend / Anthropic). Charter Item 8 audits this.

## Architecture decisions

Logged as ADRs in `docs/adr/`:

- [0001-replit-hosting.md](docs/adr/0001-replit-hosting.md) - why Replit for v1, when to migrate to Vercel
- [0002-auth-model.md](docs/adr/0002-auth-model.md) - session auth via Passport + bcryptjs; Charter gap on admin allowlist pattern

More to follow as decisions are taken.

## Garden Engineering Charter

`docs/CHARTER-CHECKLIST.md` is the source-of-truth artefact, re-verified quarterly per `00_foundation/processes/garden-engineering-charter.md` in the Garden Context OS.

## Related

- Spec: `~/TheGarden-Context-OS/00_foundation/specs/iw-generator-conversational-spec-v1.md`
- Intake schema: `~/TheGarden-Context-OS/00_foundation/specs/iw-generator-intake-schema-v1.md`
- Launch plan: `~/TheGarden-Context-OS/knowledge_base/business/projects/iw-generator-launch-may-2026.md`
- Charter: `~/TheGarden-Context-OS/00_foundation/processes/garden-engineering-charter.md`
- Product OS: `~/TheGarden-Context-OS/00_foundation/processes/garden-product-development-os.md`

# DPA (Data Processing Agreement) inventory

Tracks the Data Processing Agreements with our sub-processors. Required per UK GDPR Article 28.

Last reviewed: 2026-05-13.

| Sub-processor | DPA status | Reference | Renewal |
|---|---|---|---|
| Neon (database) | Pending | Sign at https://neon.tech/dpa | Annual |
| Replit (hosting v1) | Pending | Replit Pro/Hacker tier includes DPA | Annual |
| Vercel (hosting target) | Pending | Sign at https://vercel.com/legal/dpa when migrating | Annual |
| Anthropic (AI) | Pending | Sign at https://www.anthropic.com/legal/dpa | Annual |
| Stripe (payments) | Pending | Stripe Online DPA in account dashboard | Annual |
| Resend (email) | Pending | Sign at https://resend.com/legal/dpa | Annual |
| Plausible (analytics) | Pending | Plausible DPA in account settings | Annual |
| Sentry (error tracking) | Pending | Sentry DPA in account settings | Annual |

## Action

Each row above is a Charter Item 5 task. Owner: Irfan (commercial sign-off authority).

Sign each DPA in the relevant vendor dashboard, then update the Status column here.

## What "Pending" means here

Pending = either we have not yet signed up to the service (i.e. service is in our planned stack but not yet provisioned), OR we have signed up but have not yet executed the DPA. The Charter cannot mark Item 5 fully green until every row is Active.

## Notes

- Anthropic, Stripe, and Resend all have standardised online DPAs that take ~5 minutes to sign in the dashboard.
- Neon's DPA is auto-included for paid plans; verify version in the account dashboard.
- Vercel's DPA is part of the Pro plan onboarding.
- Replit's DPA covers up to Pro/Hacker tier; v1 should be on at least Hacker tier so the DPA applies.
- All DPAs should incorporate the latest UK ICO-approved SCCs for any non-UK data transfer.
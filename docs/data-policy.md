# Data policy — IW Generator

How we collect, store, use, share, and delete personal data on islamicwills.pro and the IW Generator app.

Last reviewed: 2026-05-13 (Charter Item 5).

## What we collect

We collect the following categories of personal data through the IW Generator:

1. **Account data:** name, email address, phone number, password (hashed).
2. **Family + estate data:** marital status, children's names and ages, spouse/parents/siblings names, ethnicity, preferred language, health conditions.
3. **Asset data:** addresses of property, mortgage values, property values, savings, stocks, other assets, business interests, overseas assets.
4. **Will content:** executor names + addresses, guardian names + addresses, beneficiary names + amounts, funeral preferences, charitable bequest details.
5. **Conversation data:** transcripts of the will-writing conversation with our AI layer (for audit and quality purposes).
6. **Engagement data:** email opens, clicks, bounces, session activity, drop-off points.
7. **Payment data:** Stripe handles card details directly; we receive a Stripe Customer ID and metadata only.

## How we use it

- **To deliver the will service:** generate the will document, route to specialists where the case is complex.
- **To improve the service:** anonymised pattern analysis of where users drop off, what questions are hardest to answer, how long the average conversation takes.
- **To stay in touch:** transactional email (will PDF delivery, executor briefing, nudges if a session is abandoned) and, with explicit consent, marketing email about Garden Network services.
- **To route within the Garden Network:** with the user's consent at payment, share signals with Garden services where they apply (SDQA Signature projects on the Wasiyyah moment, Middle Way on migration intent, Tabs/Hadleys on complex estate matters, Khatmah on post-will Sadaqah Jariyah). See "Ecosystem data share" below.

## How long we keep it

- **Account + will data:** indefinitely while the account exists, OR 30 days after the user requests deletion (whichever comes first).
- **Conversation transcripts:** 24 months from session, then anonymised aggregates only.
- **Engagement data:** 24 months from session.
- **Payment data:** Stripe retains per their own policy; we hold only customer ID + invoice references for 7 years (tax requirement).

## Who we share with

We use the following sub-processors. DPAs in place or required.

| Sub-processor | Purpose | Location | DPA |
|---|---|---|---|
| Neon | Postgres database | EU (Frankfurt) | Required - confirm at signup |
| Replit (v1) | Application hosting | US | Replit DPA available |
| Vercel (target) | Application hosting | EU edge regions | Vercel DPA available |
| Anthropic | AI conversational layer | US | Anthropic DPA available (commercial agreement) |
| Stripe | Payment processing | Global | Stripe DPA available |
| Resend | Transactional email | EU | Resend DPA available |
| Plausible | Cookie-less analytics | EU (Frankfurt) | Plausible DPA available |
| Sentry | Error tracking | EU (Frankfurt) when self-hosted EU, else US | Sentry DPA available |

We **do not** share data with any party outside Garden Network Ltd (and the named sub-processors above) without explicit user consent.

## Ecosystem data share (Garden-wide consent)

At payment, the user is asked to consent to one Garden-wide data-share statement:

> "Information shared during this conversation may be used by Garden Network services to connect you to relevant support — Sadaqah Jariyah projects, migration advisory, estate planning specialists, or related services. We do not share your data with any party outside Garden Network Ltd. You can withdraw consent at any time."

If consented:
- SDQA Signature project re-marketing feed pulls users who showed Wasiyyah intent.
- Middle Way's nurture sequence pulls users who showed migration intent or overseas-property holding.
- Tabs's consultation booking system pulls users who hit the complexity detector.
- Hadleys' lead feed pulls users above the IHT threshold.
- Khatmah's post-will Sadaqah Jariyah flow pulls every completer who consented.

The user can revoke this consent at any time via account settings or by emailing Tabs.

## Right to be forgotten (RTBF)

A user can request full data deletion at any time. We honour requests within 30 days.

Process (Tabs handles; v1 is manual; Phase 2 will automate):

1. User emails `info@islamicwills.pro` from the email on their account, OR uses the in-account "Delete my account" button (Phase 2).
2. Tabs replies within 2 business days to confirm identity and acknowledge.
3. Within 30 days of confirmation:
   - All rows tied to the user are deleted from `users`, `wills`, `user_context`, `conversation_sessions`, `email_events`, `gaps_analysis`, plus any referenced storage objects (PDFs).
   - Stripe Customer record is anonymised (Stripe retains payment records per their own retention; we cannot delete those, but we remove our internal link).
   - Sub-processors are notified: Resend (suppression list), Plausible (no PII held, no action), Sentry (any event with user data is purged).
4. User receives written confirmation.

Audit:
- Every deletion is logged in `audit_log` with the deleter, timestamp, scope.
- Quarterly review of RTBF requests + processing times.

## Children's data

The service is intended for adults writing wills. Children's data (names, ages) is captured incidentally as part of guardian / beneficiary information for the adult user's will. We do not market to children and do not collect children's data outside this context.

## International transfers

The Anthropic AI layer is in the US. We rely on Anthropic's Standard Contractual Clauses (SCCs) for the EU/UK→US transfer. This is disclosed in our privacy policy.

## Cookies

- **Plausible:** does not set cookies.
- **Stripe:** sets minimal session cookies on the payment page (strictly necessary).
- **Session cookie:** HttpOnly + SameSite=Lax, sole purpose is auth session.

We do not run third-party tracking cookies on the public site or in the app.

## Data subject rights (UK GDPR)

Users have the right to:
- Access their data (download via account dashboard in Phase 2; manual request to Tabs in v1)
- Rectify inaccurate data (via account dashboard or Tabs)
- Erase their data (RTBF flow above)
- Restrict processing (request via Tabs)
- Object to processing (request via Tabs)
- Data portability (machine-readable export via Tabs in v1, account dashboard in Phase 2)

Response SLA: 30 days from valid request.

## Complaints

Complaints can be raised with:
1. Us first: info@islamicwills.pro
2. The Information Commissioner's Office (ICO): https://ico.org.uk

## Open work to close Charter Item 5

- [ ] Sign DPAs with all sub-processors named above. Track in `docs/dpa-inventory.md`.
- [ ] Publish `/privacy` and `/terms` pages on the IW Generator app (separate from islamicwills.pro marketing site).
- [ ] Wire the "Delete my account" button in the Phase 2 dashboard.
- [ ] Add the audit_log table to the schema.
- [ ] Add the consent moment at payment per the Ecosystem data share section.
- [ ] Annual review of this policy.

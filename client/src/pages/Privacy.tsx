import { Link } from "wouter";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-8">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            &larr; Back to home
          </Link>
        </div>

        <h1 className="text-4xl font-semibold mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-10">Last reviewed: 13 May 2026</p>

        <div className="prose prose-neutral max-w-none space-y-6">
          <section>
            <p>
              Islamic Will Generator (a trading name of The Garden Network Ltd) collects personal information so we
              can prepare a Shariah-compliant Islamic will on your behalf. This page sets out what we collect, how we
              use it, how long we keep it, and the rights you have over it.
            </p>
            <p>
              If you have any questions, write to us at <a href="mailto:info@islamicwills.pro">info@islamicwills.pro</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-10 mb-4">What we collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Account data:</strong> name, email address, phone number, and a hashed password.
              </li>
              <li>
                <strong>Family and estate data:</strong> marital status, children's names and ages, names of spouse,
                parents, or siblings where relevant for the Faraid calculation, ethnicity, preferred language, and any
                relevant health conditions.
              </li>
              <li>
                <strong>Asset data:</strong> property addresses, mortgage values, property values, savings, stocks,
                other assets, business interests, and overseas assets.
              </li>
              <li>
                <strong>Will content:</strong> executor names and addresses, guardian names and addresses, beneficiary
                names and amounts, funeral preferences, and charitable bequest details.
              </li>
              <li>
                <strong>Conversation data:</strong> transcripts of any conversation with our AI layer, kept for audit
                and quality purposes.
              </li>
              <li>
                <strong>Engagement data:</strong> email opens, clicks, bounces, session activity, drop-off points.
              </li>
              <li>
                <strong>Payment data:</strong> Stripe handles card details directly. We receive a Stripe customer ID
                and metadata only. We never see your card number.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-10 mb-4">How we use it</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To prepare and deliver your will document.</li>
              <li>To route to a specialist if the case is complex (handled by Tabs, with your consent).</li>
              <li>
                To improve the service through anonymised analysis of where users drop off and how long the average
                conversation takes.
              </li>
              <li>
                To send you transactional emails (will delivery, executor briefing, nudges if a session is abandoned).
              </li>
              <li>
                With your explicit consent at payment, to surface relevant services from across The Garden Network
                where they apply (Sadaqah Jariyah projects, migration advisory, estate planning specialists). You can
                withdraw this consent at any time.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-10 mb-4">How long we keep it</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Account and will data:</strong> indefinitely while your account exists, or 30 days after you
                request deletion (whichever comes first).
              </li>
              <li>
                <strong>Conversation transcripts:</strong> 24 months from the session, then anonymised aggregates only.
              </li>
              <li>
                <strong>Engagement data:</strong> 24 months from the session.
              </li>
              <li>
                <strong>Payment data:</strong> Stripe retains records per their own policy. We hold customer ID and
                invoice references for 7 years (UK tax requirement).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-10 mb-4">Who we share with</h2>
            <p>
              We use the following sub-processors. Data Processing Agreements are in place with each:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li>Neon (Postgres database, EU)</li>
              <li>Replit (application hosting, US)</li>
              <li>Anthropic (AI conversational layer, US)</li>
              <li>Stripe (payment processing)</li>
              <li>Resend (transactional email, EU)</li>
              <li>Plausible (cookie-less analytics, EU)</li>
              <li>Sentry (error tracking, EU)</li>
            </ul>
            <p className="mt-4">
              We do not share your data with any party outside The Garden Network Ltd and the sub-processors above
              without your explicit consent.
            </p>
            <p>
              The Anthropic AI layer is hosted in the US. We rely on Standard Contractual Clauses for the UK to US
              transfer.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-10 mb-4">Your rights under UK GDPR</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li>Access the data we hold on you</li>
              <li>Rectify inaccurate data</li>
              <li>Erase your data (the right to be forgotten)</li>
              <li>Restrict or object to processing</li>
              <li>Data portability (export in a machine-readable format)</li>
            </ul>
            <p className="mt-4">
              To action any of these, write to <a href="mailto:info@islamicwills.pro">info@islamicwills.pro</a> from
              the email on your account. We respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-10 mb-4">Cookies</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Session cookie:</strong> HttpOnly + SameSite=Lax, used only to keep you signed in.
              </li>
              <li>
                <strong>Stripe:</strong> sets minimal session cookies on the payment page (strictly necessary).
              </li>
              <li>
                <strong>Analytics (Plausible):</strong> cookie-less.
              </li>
            </ul>
            <p className="mt-4">We do not run third-party tracking cookies.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-10 mb-4">Children's data</h2>
            <p>
              The service is intended for adults writing wills. Children's data (names, ages) is captured incidentally
              as part of guardian or beneficiary information. We do not market to children and do not collect
              children's data outside this context.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-10 mb-4">Complaints</h2>
            <p>
              Complaints can be raised with us first at{" "}
              <a href="mailto:info@islamicwills.pro">info@islamicwills.pro</a>, and with the Information
              Commissioner's Office (ICO) at{" "}
              <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">
                ico.org.uk
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-10 mb-4">Data controller</h2>
            <p>
              The Garden Network Ltd is the data controller for the information collected through this service.
              Company number: 16552976. Registered office: 20 Wenlock Road, London, N1 7GU.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

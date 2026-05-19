import { Link } from "wouter";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-8">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            &larr; Back to home
          </Link>
        </div>

        <h1 className="text-4xl font-semibold mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-10">Last reviewed: 13 May 2026</p>

        <div className="prose prose-neutral max-w-none space-y-6">
          <section>
            <p>
              These Terms govern your use of the Islamic Will Generator at islamicwills.pro and the app at
              iw-generator.replit.app. The service is provided by The Garden Network Ltd (company number 16552976,
              registered at 20 Wenlock Road, London, N1 7GU), trading as Islamic Will Generator.
            </p>
            <p>
              By creating an account, paying for a will, or otherwise using the service, you agree to these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-10 mb-4">What the service is</h2>
            <p>
              Islamic Will Generator helps you create a Shariah-compliant Islamic will valid under the law of England
              and Wales. We guide you through a conversation, collect the relevant information about your family and
              estate, calculate the Faraid shares deterministically, and produce a will document for you to sign.
            </p>
            <p>
              The service is one tier of a broader offering. Where your situation needs additional support, we can
              route you to specialists for LPAs, trusts, inheritance tax planning, or probate. None of those are
              required Islamically. Your will is the fard.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-10 mb-4">Pricing</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Self-serve will:</strong> £19.99. The full conversational generator, pay-first, e-signed PDF
                emailed back to you.
              </li>
              <li>
                <strong>Assisted will:</strong> £49.99 total. The £19.99 self-serve plus a 15-30 minute call with
                Tabs when you want human help completing the conversation.
              </li>
              <li>
                <strong>Complex matters:</strong> from £100. Full consultation through Tabs, handled as a separate
                paid matter, where the estate involves business interests, overseas assets, complex family
                structures, or trust setup.
              </li>
            </ul>
            <p className="mt-4">
              Add-on services (LPAs, trusts, IHT planning, probate, will registration with The National Will Register,
              hardcopy printed and posted will) are quoted separately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-10 mb-4">What we provide</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>A will document drafted from the information you provide.</li>
              <li>Faraid calculation performed deterministically against the heirs you list.</li>
              <li>An e-signed PDF emailed to you on completion.</li>
              <li>A copy retained in your account dashboard so you can retrieve it later.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-10 mb-4">What the service is not</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Not legal advice.</strong> The will template has been reviewed by a qualified UK solicitor and
                the Faraid calculator follows mainstream Sunni jurisprudence, but the service is a self-serve
                document-preparation tool, not a regulated legal practice. For a will to be legally valid in England
                and Wales it must be signed and witnessed by two adult witnesses per the Wills Act 1837. You are
                responsible for completing the signing and witnessing correctly.
              </li>
              <li>
                <strong>Not Shariah arbitration.</strong> For edge cases in Islamic inheritance (adopted children,
                half-siblings, converts, prior wealth transfers), we flag the case for specialist review rather than
                making a judgement.
              </li>
              <li>
                <strong>Not a substitute for a solicitor when you need one.</strong> If your estate is complex, if
                there are likely disputes, if you own a business, or if any beneficiary is outside the UK, we will
                recommend you speak to Tabs or one of our partner solicitors.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-10 mb-4">Refunds</h2>
            <p>
              You can request a refund within 14 days of payment if you have not yet received your finalised will
              document. After the will PDF has been issued to you, refunds are at our discretion. Email{" "}
              <a href="mailto:info@islamicwills.pro">info@islamicwills.pro</a> with the reason and we will respond
              within 5 business days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-10 mb-4">Your responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate information when answering the conversation. The will is only as accurate as the inputs.</li>
              <li>Sign and witness the will correctly under the Wills Act 1837 once you receive it.</li>
              <li>Store your will somewhere your executors can find it.</li>
              <li>Update your will if your circumstances change (marriage, divorce, new children, significant assets).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-10 mb-4">Liability</h2>
            <p>
              We take care to provide a will document that reflects the information you supply, is Shariah-compliant,
              and meets the formal requirements for a valid will in England and Wales. To the extent permitted by
              law, our total liability to you is limited to the amount you paid for the service.
            </p>
            <p>
              Nothing in these Terms limits any liability that cannot lawfully be limited (including death or
              personal injury caused by negligence, and fraud).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-10 mb-4">Privacy and your data</h2>
            <p>
              We process personal data in line with our{" "}
              <Link href="/privacy" className="underline">
                Privacy Policy
              </Link>
              . By using the service you agree to that processing.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-10 mb-4">Account suspension or termination</h2>
            <p>
              We may suspend or close an account that misuses the service (for example, attempting to deceive the
              Faraid calculator, abusing the AI conversation, or attempting to access another user's data). We will
              tell you the reason in writing where we can.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-10 mb-4">Governing law</h2>
            <p>
              These Terms are governed by the law of England and Wales. The courts of England and Wales have
              exclusive jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-10 mb-4">Contact</h2>
            <p>
              For any questions about these Terms, email{" "}
              <a href="mailto:info@islamicwills.pro">info@islamicwills.pro</a> or write to:
            </p>
            <p>
              The Garden Network Ltd<br />
              20 Wenlock Road<br />
              London, N1 7GU<br />
              United Kingdom
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
import Link from "next/link";

export const metadata = {
  title: "Terms of Service — OutreachSafe",
  description: "OutreachSafe terms of service.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-base font-semibold text-gray-900">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            OutreachSafe
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">← Back</Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Terms of Service</h1>
          <p className="text-sm text-gray-500 mb-8">Effective May 14, 2026 · Cyber Global Technologies LLC</p>

          <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">1. What OutreachSafe does</h2>
              <p className="text-gray-600">OutreachSafe analyzes LinkedIn outreach messages against known compliance patterns including LinkedIn&apos;s Terms of Service, the CAN-SPAM Act, GDPR Article 6, and spam-signal heuristics. It provides a compliance score and improvement suggestions.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">2. Not legal advice</h2>
              <p className="text-gray-600 font-medium">OutreachSafe is not a law firm and does not provide legal advice.</p>
              <p className="text-gray-600 mt-1">Results are informational only. Do not rely on them as legal guidance. Consult a qualified attorney for legal questions.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">3. Acceptable use</h2>
              <p className="text-gray-600 mb-2">You agree to use OutreachSafe only for messages you are authorized to send. You agree not to:</p>
              <ul className="space-y-1 list-disc list-inside text-gray-600">
                <li>Use the service to facilitate spam, harassment, or deceptive outreach</li>
                <li>Attempt to reverse-engineer, scrape, or abuse the API</li>
                <li>Use the service for any unlawful purpose</li>
                <li>Resell or redistribute the service without written permission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">4. Free tier</h2>
              <p className="text-gray-600">The free tier is limited to 5 checks per day per user. We may modify or discontinue the free tier at any time.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">5. Subscriptions</h2>
              <p className="text-gray-600">Paid plans are billed monthly. Cancel anytime. Refunds are issued at our discretion for unused portions of a billing period.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">6. Limitation of liability</h2>
              <p className="text-gray-600">To the maximum extent permitted by law, Cyber Global Technologies LLC is not liable for indirect, incidental, or consequential damages. Total liability is limited to amounts paid in the 30 days prior to any claim.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">7. Governing law</h2>
              <p className="text-gray-600">These terms are governed by the laws of the State of New Jersey, United States.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">8. Contact</h2>
              <p className="text-gray-600">Cyber Global Technologies LLC<br/>legal@outreachsafe.com<br/>outreachsafe.com</p>
            </section>
          </div>
        </div>
      </div>

      <footer className="max-w-2xl mx-auto px-6 pb-8 text-center text-xs text-gray-400">
        © 2026 Cyber Global Technologies LLC ·{" "}
        <Link href="/privacy" className="hover:text-gray-600">Privacy Policy</Link>
      </footer>
    </main>
  );
}

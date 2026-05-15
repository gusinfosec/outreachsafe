import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — OutreachSafe",
  description: "How OutreachSafe handles your data.",
};

export default function PrivacyPage() {
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
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Privacy Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Effective May 14, 2026 · Cyber Global Technologies LLC</p>

          <div className="space-y-6 text-sm text-gray-700 leading-relaxed">

            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3">
              <p className="font-semibold text-green-800 mb-1">The short version</p>
              <p className="text-green-700">We do not store the messages you check. We do not sell your data. We do not require a LinkedIn login.</p>
            </div>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">What we collect</h2>
              <p className="mb-2">When you use OutreachSafe to check a message:</p>
              <ul className="space-y-1 list-disc list-inside text-gray-600">
                <li>The message text is sent to Anthropic&apos;s API for analysis and immediately discarded. It is never written to a database.</li>
                <li>We may log anonymous request metadata (timestamp, response time) for debugging. This contains no message content.</li>
                <li>If you create an account, we collect your email address for authentication only.</li>
                <li>If you subscribe, payment information is handled by Stripe and never stored on our servers.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">What we do not do</h2>
              <ul className="space-y-1 list-disc list-inside text-gray-600">
                <li>We do not sell, rent, or share your data with third parties for marketing.</li>
                <li>We do not use your messages to train AI models.</li>
                <li>We do not require a LinkedIn login or any social account connection.</li>
                <li>We do not store message history.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">Third-party services</h2>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-3 py-2 font-medium text-gray-700">Service</th>
                      <th className="text-left px-3 py-2 font-medium text-gray-700">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr><td className="px-3 py-2 font-medium">Anthropic</td><td className="px-3 py-2 text-gray-600">AI compliance analysis</td></tr>
                    <tr><td className="px-3 py-2 font-medium">Vercel</td><td className="px-3 py-2 text-gray-600">Hosting and deployment</td></tr>
                    <tr><td className="px-3 py-2 font-medium">Stripe</td><td className="px-3 py-2 text-gray-600">Payment processing</td></tr>
                    <tr><td className="px-3 py-2 font-medium">Supabase</td><td className="px-3 py-2 text-gray-600">Database (account data only)</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">Your rights (GDPR)</h2>
              <p className="text-gray-600">If you are in the EU/EEA, you have the right to access, correct, or delete any personal data we hold. Email us at privacy@outreachsafe.com to exercise these rights.</p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-gray-900 mb-2">Contact</h2>
              <p className="text-gray-600">Cyber Global Technologies LLC<br/>privacy@outreachsafe.com<br/>outreachsafe.com</p>
            </section>
          </div>
        </div>
      </div>

      <footer className="max-w-2xl mx-auto px-6 pb-8 text-center text-xs text-gray-400">
        © 2026 Cyber Global Technologies LLC ·{" "}
        <Link href="/terms" className="hover:text-gray-600">Terms of Service</Link>
      </footer>
    </main>
  );
}

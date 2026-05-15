import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — OutreachSafe",
  description: "How OutreachSafe handles your data.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-5 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span className="text-sm font-semibold text-slate-900">OutreachSafe</span>
          </Link>
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">← Back to app</Link>
        </div>
      </header>
      <div className="max-w-2xl mx-auto px-5 py-10">
        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Privacy Policy</h1>
          <p className="text-sm text-slate-400 mb-8">Effective May 14, 2026 · Cyber Global Technologies LLC</p>
          <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
              <p className="font-semibold text-emerald-800 mb-1">The short version</p>
              <p className="text-emerald-700">We do not store the messages you check. We do not sell your data. We do not require a LinkedIn login.</p>
            </div>
            <section>
              <h2 className="text-base font-semibold text-slate-900 mb-2">What we collect</h2>
              <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                <li>Message text is sent to our AI provider (Anthropic) for analysis only and is never stored in a database.</li>
                <li>Anonymous request metadata (timestamp, response time) for debugging — no message content.</li>
                <li>If you create an account: email address for authentication only.</li>
                <li>Payment information is handled by Stripe — we never store card data.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold text-slate-900 mb-2">What we do not do</h2>
              <ul className="space-y-1.5 list-disc list-inside text-slate-600">
                <li>We do not sell or share your data with third parties for marketing purposes.</li>
                <li>We do not use your messages to train AI models.</li>
                <li>We do not require a LinkedIn login or social account.</li>
                <li>We do not store message history.</li>
              </ul>
            </section>
            <section>
              <h2 className="text-base font-semibold text-slate-900 mb-2">Third-party services</h2>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50"><tr>
                    <th className="text-left px-3 py-2 font-medium text-slate-600">Service</th>
                    <th className="text-left px-3 py-2 font-medium text-slate-600">Purpose</th>
                  </tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {[["Anthropic","AI compliance analysis"],["Vercel","Hosting"],["Stripe","Payment processing"],["Supabase","Database (account data only)"]].map(([s,p]) => (
                      <tr key={s}><td className="px-3 py-2 font-medium text-slate-700">{s}</td><td className="px-3 py-2 text-slate-500">{p}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <section>
              <h2 className="text-base font-semibold text-slate-900 mb-2">Your rights (GDPR)</h2>
              <p className="text-slate-600">EU/EEA residents may request access, correction, or deletion of personal data by emailing privacy@outreachsafe.com.</p>
            </section>
            <section>
              <h2 className="text-base font-semibold text-slate-900 mb-2">Contact</h2>
              <p className="text-slate-600">Cyber Global Technologies LLC<br/>privacy@outreachsafe.com · outreachsafe.com</p>
            </section>
          </div>
        </div>
      </div>
      <footer className="max-w-2xl mx-auto px-5 pb-8 text-center text-xs text-slate-400">
        © 2026 Cyber Global Technologies LLC ·{" "}
        <Link href="/terms" className="hover:text-slate-600">Terms of Service</Link>
      </footer>
    </main>
  );
}

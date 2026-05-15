import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — OutreachSafe",
  description: "OutreachSafe terms of service and acceptable use policy.",
};

export default function TermsPage() {
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
          <h1 className="text-2xl font-semibold text-slate-900 mb-1">Terms of Service</h1>
          <p className="text-sm text-slate-400 mb-8">Effective May 14, 2026 · Cyber Global Technologies LLC</p>
          <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
            {[
              ["1. What OutreachSafe does", "OutreachSafe is an informational tool that analyzes LinkedIn outreach messages against common compliance patterns including LinkedIn's messaging guidelines, CAN-SPAM Act, GDPR Article 6, and spam-signal heuristics. It returns a score and improvement suggestions. OutreachSafe is not affiliated with, endorsed by, or connected to LinkedIn, Meta, or any platform analyzed."],
              ["2. Not legal advice", "OutreachSafe is not a law firm and does not provide legal advice. Results are informational only. Do not rely on them as legal guidance. Consult a qualified attorney for legal questions. We make no guarantees about compliance, deliverability, or avoidance of platform restrictions."],
              ["3. No guarantee of results", "OutreachSafe identifies common patterns associated with compliance risk. It does not guarantee that a message passing analysis will be delivered, accepted, or free from platform action. Platform policies change frequently and this tool may not reflect the most current guidelines."],
              ["4. Acceptable use", "You agree to use OutreachSafe only for messages you are authorized to send. You agree not to use this service to facilitate spam, harassment, or deceptive outreach; attempt to abuse the API; use the service for any unlawful purpose; or resell the service without written permission."],
              ["5. Free tier", "The free tier is limited to 5 analyses per day per user. We may modify or discontinue the free tier at any time."],
              ["6. Subscriptions", "Paid plans are billed monthly. Cancel anytime. Refunds are at our discretion."],
              ["7. Limitation of liability", "To the maximum extent permitted by law, Cyber Global Technologies LLC is not liable for indirect, incidental, or consequential damages. Total liability is limited to amounts paid in the 30 days prior to any claim."],
              ["8. Governing law", "These terms are governed by the laws of the State of New Jersey, United States."],
              ["9. Contact", "Cyber Global Technologies LLC · legal@outreachsafe.com · outreachsafe.com"],
            ].map(([h, b]) => (
              <section key={h as string}>
                <h2 className="text-base font-semibold text-slate-900 mb-2">{h}</h2>
                <p className="text-slate-600">{b}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
      <footer className="max-w-2xl mx-auto px-5 pb-8 text-center text-xs text-slate-400">
        © 2026 Cyber Global Technologies LLC ·{" "}
        <Link href="/privacy" className="hover:text-slate-600">Privacy Policy</Link>
      </footer>
    </main>
  );
}

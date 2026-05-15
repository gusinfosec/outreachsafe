import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome to OutreachSafe",
  description: "Your subscription is active.",
  robots: { index: false, follow: false },
};

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-5">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-md w-full text-center">

        {/* Success icon */}
        <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto mb-5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        <h1 className="text-xl font-semibold text-slate-900 mb-2">
          You&apos;re in — welcome to OutreachSafe.
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed mb-6">
          Your subscription is active. You now have access to unlimited compliance checks, the Chrome extension, and your weekly digest.
        </p>

        <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-6 text-left space-y-2">
          <p className="text-xs font-semibold text-slate-700 mb-2">What happens next</p>
          {[
            "A receipt is on its way to your email from Stripe.",
            "Start checking your messages — the analyzer is ready now.",
            "Reply to this email with any questions — we respond within 24 hours.",
          ].map((t, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" className="flex-shrink-0 mt-px" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
              {t}
            </div>
          ))}
        </div>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-b from-violet-500 to-violet-700 hover:from-violet-400 hover:to-violet-600 text-white font-semibold text-sm py-3 rounded-xl transition-all shadow-md shadow-violet-200"
        >
          Start analyzing messages →
        </Link>

        <p className="text-xs text-slate-400 mt-4">
          Questions? Email{" "}
          <a href="mailto:hello@outreachsafe.com" className="text-violet-600 hover:underline">
            hello@outreachsafe.com
          </a>
        </p>
      </div>
    </main>
  );
}

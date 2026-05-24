import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — OutreachSafe",
  description: "How OutreachSafe handles your data.",
};

export default function PrivacyPage() {
  return (
    <main className="relative z-10">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-[100] bg-[#0F1221]/90 backdrop-blur-xl border-b border-white/[0.07] py-3.5">
        <div className="max-w-[720px] mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#60A5FA] flex items-center justify-center text-white">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
            </div>
            <span className="text-[16px] font-extrabold text-white tracking-tight">Outreach<span className="text-[#7C3AED]">Safe</span></span>
          </Link>
          <Link href="/" className="text-[13px] font-medium text-slate-500 hover:text-white transition-colors">← Back to app</Link>
        </div>
      </nav>

      <div className="max-w-[720px] mx-auto px-6 pt-16 pb-20">
        <div className="font-mono text-[11px] text-slate-500 tracking-[0.2em] mb-3 uppercase font-bold">Legal</div>
        <h1 className="text-4xl font-extrabold text-white leading-tight tracking-tighter mb-4">Privacy Policy</h1>
        <div className="font-mono text-[12px] text-slate-500 mb-10 pb-6 border-b border-white/[0.07]">Effective May 14, 2026 · Cyber Global Technologies LLC</div>

        <div className="bg-[#7C3AED]/10 border border-[#7C3AED]/25 rounded-xl p-6 mb-10">
          <p className="text-[14px] text-slate-300 leading-relaxed">
            <strong className="text-white">The short version:</strong> We do not store the messages you check. We do not sell your data. We do not require a LinkedIn login.
          </p>
        </div>

        <section className="space-y-4 mb-10">
          <h2 className="text-[18px] font-bold text-white pb-2 border-b border-white/[0.07]">What we collect</h2>
          <ul className="space-y-3">
            {[
              "Message text is sent to our AI provider (Anthropic) for analysis only and is never stored in a database.",
              "Anonymous request metadata (timestamp, response time) for debugging — no message content.",
              "If you create an account: email address for authentication only.",
              "Payment information is handled by Stripe — we never store card data."
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-[14px] text-slate-400 leading-relaxed">
                <span className="text-[#7C3AED] text-lg font-mono leading-none">·</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-[18px] font-bold text-white pb-2 border-b border-white/[0.07]">What we do not do</h2>
          <ul className="space-y-3">
            {[
              "We do not sell or share your data with third parties for marketing purposes.",
              "We do not use your messages to train AI models.",
              "We do not require a LinkedIn login or social account.",
              "We do not store message history."
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-[14px] text-slate-400 leading-relaxed">
                <span className="text-[#7C3AED] text-lg font-mono leading-none">·</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-[18px] font-bold text-white pb-2 border-b border-white/[0.07]">Third-party services</h2>
          <div className="bg-white/[0.02] border border-white/[0.07] rounded-xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="border-b border-white/[0.07]">
                <tr>
                  <th className="font-mono text-[10px] text-slate-500 tracking-widest uppercase p-4">Service</th>
                  <th className="font-mono text-[10px] text-slate-500 tracking-widest uppercase p-4">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {[
                  ["Anthropic", "AI compliance analysis"],
                  ["Vercel", "Hosting"],
                  ["Stripe", "Payment processing"],
                  ["Supabase", "Database (account data only)"]
                ].map(([s, p]) => (
                  <tr key={s}>
                    <td className="p-4 text-[13px] font-bold text-white">{s}</td>
                    <td className="p-4 text-[13px] text-slate-400">{p}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4 mb-10">
          <h2 className="text-[18px] font-bold text-white pb-2 border-b border-white/[0.07]">Your rights (GDPR)</h2>
          <p className="text-[14px] text-slate-400 leading-relaxed">
            EU/EEA residents may request access, correction, or deletion of personal data by emailing <a href="mailto:privacy@outreachsafe.com" className="text-[#A78BFA] hover:underline">privacy@outreachsafe.com</a>.
          </p>
        </section>

        <div className="bg-white/[0.02] border border-white/[0.07] rounded-xl p-6 mt-12">
          <p className="font-mono text-[13px] text-slate-500">
            Cyber Global Technologies LLC · <a href="mailto:privacy@outreachsafe.com" className="text-[#A78BFA] hover:underline">privacy@outreachsafe.com</a> · outreachsafe.com
          </p>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="py-10 border-t border-white/[0.05] text-center">
        <div className="max-w-[720px] mx-auto px-6">
          <p className="font-mono text-[11px] text-slate-700">
            © 2026 Cyber Global Technologies LLC · <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </p>
        </div>
      </footer>
      <div className="fixed bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#7C3AED] via-[#60A5FA] to-transparent z-[100]"></div>
    </main>
  );
}

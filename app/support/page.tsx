import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support — OutreachSafe",
  description: "Get help with OutreachSafe. Contact support, find answers to common questions, and learn how to use the compliance checker.",
};

const FAQS = [
  {
    q: "How does OutreachSafe work?",
    a: "Paste your LinkedIn outreach message and click Analyze. OutreachSafe checks it against 30+ compliance patterns across LinkedIn's messaging guidelines, CAN-SPAM Act, GDPR Article 6, and common spam signals. You get a score from 0–100, every flagged phrase, a plain-English explanation of why it matters, and a specific fix suggestion."
  },
  {
    q: "Does OutreachSafe store my messages?",
    a: "No. Messages are sent to our AI provider (Anthropic) for analysis only and are never stored in a database. We do not keep message history unless you are on a paid plan with history enabled."
  },
  {
    q: "Do I need a LinkedIn account to use OutreachSafe?",
    a: "No. OutreachSafe does not connect to LinkedIn in any way. You simply paste your message text into the checker. No login, no OAuth, no LinkedIn connection required."
  },
  {
    q: "How many free checks do I get?",
    a: "The free tier includes 5 message analyses per day. Checks reset every 24 hours. Upgrade to Starter for 200 checks per month, or Pro for unlimited."
  },
  {
    q: "How do I install the Chrome extension?",
    a: "Search for OutreachSafe in the Chrome Web Store and click Add to Chrome. Once installed, the extension adds a Check with OutreachSafe button to LinkedIn's compose window automatically. It also adds a toolbar icon you can click to analyze any message from any page."
  },
  {
    q: "The Chrome extension button isn't appearing in LinkedIn. What do I do?",
    a: "Try refreshing the LinkedIn page after installing the extension. If the button still doesn't appear, go to chrome://extensions, find OutreachSafe, click the reload icon, then refresh LinkedIn. If the issue persists, email us at hello@outreachsafe.com."
  },
  {
    q: "Is OutreachSafe affiliated with LinkedIn?",
    a: "No. OutreachSafe is an independent tool and is not affiliated with, endorsed by, or connected to LinkedIn or Meta in any way. Our analysis is based on publicly available information about LinkedIn's messaging guidelines and applicable regulations."
  },
  {
    q: "Is this legal advice?",
    a: "No. OutreachSafe is an informational tool only. Results identify common compliance patterns and should not be relied upon as legal guidance. Consult a qualified attorney for legal questions."
  },
  {
    q: "How do I cancel my subscription?",
    a: "You can cancel anytime by emailing hello@outreachsafe.com with your account email. We will cancel your subscription immediately and you will not be charged again. Refunds are handled at our discretion."
  },
  {
    q: "What is the Chrome extension's privacy policy?",
    a: "The Chrome extension follows the same privacy policy as outreachsafe.com. Message text is sent to our API for analysis and is not stored. The extension does not read any LinkedIn data other than the text in the compose box when you click the Check button."
  },
];

export default function SupportPage() {
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
        <div className="font-mono text-[11px] text-slate-500 tracking-[0.2em] mb-3 uppercase font-bold">Support</div>
        <h1 className="text-4xl font-extrabold text-white leading-tight tracking-tighter mb-4">How can we help?</h1>
        <p className="text-[15px] text-slate-400 mb-10 pb-8 border-b border-white/[0.07] leading-relaxed">
          Find answers to common questions below, or reach out directly. We respond to all emails within 24 hours.
        </p>

        {/* Email CTA */}
        <div className="bg-[#7C3AED]/10 border border-[#7C3AED]/25 rounded-2xl p-8 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-[16px] font-bold text-white mb-2">Email support</h2>
            <p className="text-[13px] text-slate-400 leading-relaxed">
              Billing questions, account issues, bug reports — we respond within 24 hours on weekdays.
            </p>
          </div>
          <a href="mailto:hello@outreachsafe.com" className="bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] text-white text-[13px] font-bold px-5 py-3 rounded-xl shadow-[0_4px_16px_rgba(124,58,237,0.3)] hover:shadow-[0_6px_20px_rgba(124,58,237,0.4)] transition-all whitespace-nowrap">
            ✉ hello@outreachsafe.com
          </a>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-16">
          {[
            { icon: "🛡️", title: "Check a message", desc: "Go to the analyzer", href: "/" },
            { icon: "🔒", title: "Privacy Policy", desc: "How we handle your data", href: "/privacy" },
            { icon: "📋", title: "Terms of Service", desc: "Usage and billing terms", href: "/terms" },
          ].map((l) => (
            <Link key={l.title} href={l.href} className="bg-white/[0.02] border border-white/[0.07] rounded-xl p-5 hover:border-[#7C3AED]/30 hover:bg-white/[0.04] transition-all group">
              <div className="text-xl mb-3 group-hover:scale-110 transition-transform">{l.icon}</div>
              <p className="text-[13px] font-bold text-white mb-1">{l.title}</p>
              <p className="text-[11px] text-slate-500 font-medium">{l.desc}</p>
            </Link>
          ))}
        </div>

        {/* FAQ */}
        <h2 className="text-[22px] font-extrabold text-white tracking-tight mb-6">Frequently asked questions</h2>
        <div className="space-y-3 mb-16">
          {FAQS.map((f, i) => (
            <details key={i} className="bg-white/[0.02] border border-white/[0.07] rounded-xl overflow-hidden group">
              <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none hover:bg-white/[0.04] transition-colors">
                <span className="text-[14px] font-bold text-slate-300">{f.q}</span>
                <span className="text-[#7C3AED] text-lg font-mono leading-none transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-6 pb-5 pt-0 border-t border-white/[0.07] mt-[-1px]">
                <p className="text-[13px] text-slate-400 leading-relaxed pt-4">{f.a}</p>
              </div>
            </details>
          ))}
        </div>

        {/* Chrome Extension Steps */}
        <h2 className="text-[22px] font-extrabold text-white tracking-tight mb-6">Chrome extension setup</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          {[
            { step: "1", t: "Install from Chrome Web Store", d: "Search OutreachSafe or visit the store directly and click Add to Chrome." },
            { step: "2", t: "Open LinkedIn messaging", d: "Go to any DM, InMail, or connection request compose window." },
            { step: "3", t: "Click the Check button", d: "Purple button appears below the compose box automatically." },
            { step: "4", t: "See results in the sidebar", d: "Score, violations, and specific fixes slide in from the right." },
          ].map((s) => (
            <div key={s.step} className="bg-white/[0.02] border border-white/[0.07] rounded-xl p-6">
              <div className="w-8 h-8 rounded-lg bg-[#7C3AED]/15 border border-[#7C3AED]/30 flex items-center justify-center font-mono text-[13px] font-bold text-[#A78BFA] mb-4">
                {s.step}
              </div>
              <h3 className="text-[14px] font-bold text-white mb-2">{s.t}</h3>
              <p className="text-[12px] text-slate-400 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>

        {/* Still need help */}
        <div className="bg-[#60A5FA]/10 border border-[#60A5FA]/20 rounded-2xl p-8 text-center">
          <h3 className="text-[18px] font-bold text-white mb-2">Still need help?</h3>
          <p className="text-[14px] text-slate-400 mb-6">We read every email and respond within 24 hours on weekdays.</p>
          <a href="mailto:hello@outreachsafe.com" className="inline-block bg-[#60A5FA]/10 border border-[#60A5FA]/30 text-[#60A5FA] font-bold px-6 py-2.5 rounded-xl hover:bg-[#60A5FA]/20 transition-all text-[14px]">
            Email hello@outreachsafe.com →
          </a>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="py-10 border-t border-white/[0.05] text-center">
        <div className="max-w-[720px] mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <Link href="/privacy" className="text-[12px] text-slate-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-[12px] text-slate-500 hover:text-white transition-colors">Terms of Service</Link>
          </div>
          <p className="font-mono text-[11px] text-slate-700">
            © 2026 Cyber Global Technologies LLC · Informational only · Not legal advice · Not affiliated with LinkedIn
          </p>
        </div>
      </footer>
      <div className="fixed bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#7C3AED] via-[#60A5FA] to-transparent z-[100]"></div>
    </main>
  );
}

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

function ShieldIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  );
}

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-5 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <ShieldIcon />
            <span className="text-[15px] font-semibold text-slate-900 tracking-tight">OutreachSafe</span>
          </Link>
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">← Back to app</Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-5 py-10 space-y-6">

        {/* Hero */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-violet-50 border border-violet-200 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">How can we help?</h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Find answers to common questions below, or reach out directly. We respond to all emails within 24 hours.
          </p>
        </div>

        {/* Contact card */}
        <div className="bg-violet-50 rounded-2xl border border-violet-200 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-violet-100 border border-violet-200 flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-[14px] font-semibold text-violet-900 mb-1">Email support</h2>
              <p className="text-[13px] text-violet-700 mb-3 leading-relaxed">
                For billing questions, account issues, bug reports, or anything else — email us directly. We respond within 24 hours on weekdays.
              </p>
              <a
                href="mailto:hello@outreachsafe.com"
                className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-[13px] font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                hello@outreachsafe.com
              </a>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", title: "Check a message", desc: "Go to the analyzer", href: "/" },
            { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", title: "Privacy Policy", desc: "How we handle your data", href: "/privacy" },
            { icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", title: "Terms of Service", desc: "Usage and billing terms", href: "/terms" },
          ].map(({ icon, title, desc, href }) => (
            <Link key={title} href={href}
              className="bg-white rounded-xl border border-slate-200 p-4 hover:border-violet-300 hover:shadow-sm transition-all group">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center mb-3 group-hover:bg-violet-50 group-hover:border-violet-200 transition-colors">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={icon}/>
                </svg>
              </div>
              <p className="text-[13px] font-semibold text-slate-900 mb-0.5">{title}</p>
              <p className="text-[12px] text-slate-500">{desc}</p>
            </Link>
          ))}
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-[15px] font-semibold text-slate-900">Frequently asked questions</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {FAQS.map(({ q, a }, i) => (
              <details key={i} className="group">
                <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none hover:bg-slate-50 transition-colors">
                  <span className="text-[13px] font-medium text-slate-900">{q}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
                    className="flex-shrink-0 transition-transform group-open:rotate-180">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </summary>
                <div className="px-6 pb-4 pt-0">
                  <p className="text-[13px] text-slate-600 leading-relaxed">{a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Chrome extension section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-[14px] font-semibold text-slate-900 mb-4">Chrome extension</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { step: "1", t: "Install from Chrome Web Store", d: "Search OutreachSafe or visit the store directly" },
              { step: "2", t: "Open LinkedIn messaging", d: "Go to any DM, InMail, or connection request" },
              { step: "3", t: "Click the Check button", d: "Purple button appears below the compose box" },
              { step: "4", t: "See results in the sidebar", d: "Score, violations, and fixes slide in from the right" },
            ].map(({ step, t, d }) => (
              <div key={step} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-7 h-7 rounded-full bg-violet-600 text-white text-[12px] font-semibold flex items-center justify-center flex-shrink-0">{step}</div>
                <div>
                  <p className="text-[12px] font-semibold text-slate-900 mb-0.5">{t}</p>
                  <p className="text-[11.5px] text-slate-500">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Still need help */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-sm">
          <p className="text-[14px] font-semibold text-slate-900 mb-1">Still need help?</p>
          <p className="text-[13px] text-slate-500 mb-4">We read every email and respond within 24 hours on weekdays.</p>
          <a href="mailto:hello@outreachsafe.com"
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-[13px] font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm shadow-violet-200">
            Email hello@outreachsafe.com →
          </a>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-200 pt-5 pb-6 text-center text-[11.5px] text-slate-400 space-y-2">
          <p>© 2026 Cyber Global Technologies LLC</p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/privacy" className="hover:text-violet-600 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-violet-600 transition-colors">Terms of Service</Link>
          </div>
          <p className="text-[11px]">Informational only · Not legal advice · Not affiliated with LinkedIn</p>
        </footer>

      </div>
    </main>
  );
}

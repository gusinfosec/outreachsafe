import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import NavAuth from "../components/NavAuth";

export const metadata: Metadata = {
  title: "Terms of Service — OutreachSafe",
  description: "OutreachSafe terms of service and acceptable use policy.",
};

export default function TermsPage() {
  return (
    <main className="relative z-10">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-[100] bg-[#0F1221]/90 backdrop-blur-xl border-b border-white/[0.07] py-3.5">
        <div className="max-w-[720px] mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image 
              src="/icon.png" 
              alt="OutreachSafe" 
              width={32} 
              height={32} 
              style={{ borderRadius: '8px' }}
            />
            <span className="text-[16px] font-extrabold text-white tracking-tight">Outreach<span className="text-[#7C3AED]">Safe</span></span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[13px] font-medium text-slate-500 hover:text-white transition-colors">← Back to app</Link>
            <NavAuth btnClass="text-[12px] font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] px-3 py-1 rounded-lg transition-colors" />
          </div>
        </div>
      </nav>

      <div className="max-w-[720px] mx-auto px-6 pt-16 pb-20">
        <div className="font-mono text-[11px] text-slate-500 tracking-[0.2em] mb-3 uppercase font-bold">Legal</div>
        <h1 className="text-4xl font-extrabold text-white leading-tight tracking-tighter mb-4">Terms of Service</h1>
        <div className="font-mono text-[12px] text-slate-500 mb-10 pb-6 border-b border-white/[0.07]">Effective May 14, 2026 · Cyber Global Technologies LLC</div>

        <div className="space-y-10">
          {[
            ["1. What OutreachSafe does", "OutreachSafe is an informational tool that analyzes LinkedIn outreach messages against common compliance patterns including LinkedIn's messaging guidelines, CAN-SPAM Act, GDPR Article 6, and spam-signal heuristics. It returns a score and improvement suggestions. OutreachSafe is not affiliated with, endorsed by, or connected to LinkedIn, Meta, or any platform analyzed."],
            ["2. Not legal advice", "OutreachSafe is not a law firm and does not provide legal advice. Results are informational only. Do not rely on them as legal guidance. Consult a qualified attorney for legal questions. We make no guarantees about compliance, deliverability, or avoidance of platform restrictions."],
            ["3. No guarantee of results", "OutreachSafe identifies common patterns associated with compliance risk. It does not guarantee that a message passing analysis will be delivered, accepted, or free from platform action. Platform policies change frequently and this tool may not reflect the most current guidelines."],
            ["4. Acceptable use", "You agree to use OutreachSafe only for messages you are authorized to send. You agree not to use this service to facilitate spam, harassment, or deceptive outreach; attempt to abuse the API; use the service for any unlawful purpose; or resell the service without written permission."],
            ["5. Free tier", "The free tier is limited to 5 analyses per day per user. We may modify or discontinue the free tier at any time."],
            ["6. Subscriptions", "Paid plans are billed monthly. Cancel anytime. Refunds are at our discretion."],
            ["7. Limitation of liability", "To the maximum extent permitted by law, Cyber Global Technologies LLC is not liable for indirect, incidental, or consequential damages. Total liability is limited to amounts paid in the 30 days prior to any claim."],
            ["8. Governing law", "These terms are governed by the laws of the State of New Jersey, United States."],
          ].map(([h, b]) => (
            <section key={h as string} className="space-y-4">
              <h2 className="font-mono text-[14px] font-bold text-[#A78BFA] tracking-wider uppercase">{h}</h2>
              <p className="text-[14px] text-slate-400 leading-relaxed">{b}</p>
            </section>
          ))}
        </div>

        <div className="bg-white/[0.02] border border-white/[0.07] rounded-xl p-6 mt-12">
          <p className="font-mono text-[13px] text-slate-500">
            Cyber Global Technologies LLC · <a href="mailto:legal@outreachsafe.com" className="text-[#A78BFA] hover:underline">legal@outreachsafe.com</a> · outreachsafe.com
          </p>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="py-10 border-t border-white/[0.05] text-center">
        <div className="max-w-[720px] mx-auto px-6">
          <p className="font-mono text-[11px] text-slate-700">
            © 2026 Cyber Global Technologies LLC · <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </p>
        </div>
      </footer>
      <div className="fixed bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#7C3AED] via-[#60A5FA] to-transparent z-[100]"></div>
    </main>
  );
}

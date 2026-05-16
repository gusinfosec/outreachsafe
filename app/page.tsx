"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
type Severity = "high" | "medium" | "low";
type Risk     = "high" | "medium" | "low" | "clean";

interface Violation {
  rule_id: string;
  rule_name: string;
  severity: Severity;
  triggered_text: string;
  explanation: string;
  fix: string;
}

interface CheckResult {
  violations: Violation[];
  passed_rules_count: number;
  overall_risk: Risk;
  summary: string;
}

// ─── Design tokens ────────────────────────────────────────────────────────────
const SEV_MAP: Record<Severity, { bg: string; border: string; badge: string; dot: string; label: string; shadow: string }> = {
  high:   { bg: "bg-rose-50",   border: "border-rose-200",   badge: "bg-rose-100 text-rose-700",     dot: "bg-rose-500",   label: "High",   shadow: "hover:shadow-rose-100"   },
  medium: { bg: "bg-amber-50",  border: "border-amber-200",  badge: "bg-amber-100 text-amber-700",   dot: "bg-amber-400",  label: "Medium", shadow: "hover:shadow-amber-100"  },
  low:    { bg: "bg-sky-50",    border: "border-sky-200",    badge: "bg-sky-100 text-sky-700",       dot: "bg-sky-400",    label: "Low",    shadow: "hover:shadow-sky-100"    },
};

const RISK_MAP: Record<Risk, { bg: string; text: string; border: string; label: string }> = {
  high:   { bg: "bg-rose-50",    text: "text-rose-800",    border: "border-rose-200",    label: "Needs attention"  },
  medium: { bg: "bg-amber-50",   text: "text-amber-800",   border: "border-amber-200",   label: "Some concerns"    },
  low:    { bg: "bg-sky-50",     text: "text-sky-800",     border: "border-sky-200",     label: "Minor issues"     },
  clean:  { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-200", label: "Looking good"     },
};

function scoreStyle(s: number) {
  if (s >= 80) return { color: "text-emerald-700", trackColor: "#10B981", label: "Looking good",       ring: "border-emerald-300" };
  if (s >= 60) return { color: "text-sky-700",     trackColor: "#38BDF8", label: "Minor issues",       ring: "border-sky-300"     };
  if (s >= 40) return { color: "text-amber-700",   trackColor: "#F59E0B", label: "Needs work",         ring: "border-amber-300"   };
  if (s >= 20) return { color: "text-orange-700",  trackColor: "#F97316", label: "Significant issues", ring: "border-orange-300"  };
  return             { color: "text-rose-700",    trackColor: "#F43F5E", label: "High concern",       ring: "border-rose-300"    };
}

const LOADING_MSGS = [
  "Analyzing spam-risk patterns…",
  "Checking LinkedIn policy heuristics…",
  "Reviewing CAN-SPAM compliance signals…",
  "Scanning GDPR Article 6 indicators…",
  "Evaluating outreach language quality…",
  "Generating safer recommendations…",
];

const PLACEHOLDER = `Paste any LinkedIn message here — cold outreach, connection request, InMail, or follow-up.

Examples you can test:
• "Hi [First Name], I know you're struggling with your sales numbers…"
• "LIMITED TIME OFFER — click here to book a call TODAY!"
• "I send this to everyone who might benefit from our solution…"

Or paste your own message to check it for compliance patterns.`;

function wordCount(t: string) { return t.split(/\s+/).filter(Boolean).length; }

function calcScore(violations: Violation[]) {
  const h = violations.filter(v => v.severity === "high").length;
  const m = violations.filter(v => v.severity === "medium").length;
  const l = violations.filter(v => v.severity === "low").length;
  return Math.max(0, 100 - h * 15 - m * 7 - l * 3);
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function ShieldLogo({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="1.75"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function CheckMark() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10B981"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true" className="flex-shrink-0 mt-px">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ScoreRing({ score, style }: { score: number; style: ReturnType<typeof scoreStyle> }) {
  const r    = 26;
  const circ = 2 * Math.PI * r;
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setTimeout(() => setAnimated(score), 80));
    return () => cancelAnimationFrame(raf);
  }, [score]);

  const offset = circ - (animated / 100) * circ;

  return (
    <div className="relative w-[68px] h-[68px] flex-shrink-0"
      role="img" aria-label={`Compliance score: ${score} out of 100`}>
      <svg width="68" height="68" viewBox="0 0 68 68">
        <circle cx="34" cy="34" r={r} fill="white" stroke="#E2E8F0" strokeWidth="4" />
        <circle cx="34" cy="34" r={r} fill="none" stroke={style.trackColor}
          strokeWidth="4" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          transform="rotate(-90 34 34)"
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(0.34,1.56,0.64,1)" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className={`text-[18px] font-semibold leading-none ${style.color}`}>{score}</span>
        <span className="text-[9px] text-slate-400 mt-0.5 leading-none">/100</span>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3 animate-pulse" aria-hidden="true">
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-start gap-4">
          <div className="w-[68px] h-[68px] rounded-full bg-slate-100 flex-shrink-0" />
          <div className="flex-1 space-y-2 pt-1">
            <div className="h-4 bg-slate-100 rounded-md w-32" />
            <div className="h-3 bg-slate-100 rounded-md w-full" />
            <div className="h-3 bg-slate-100 rounded-md w-4/5" />
          </div>
        </div>
      </div>
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-slate-100 rounded-md w-40" />
            <div className="h-5 bg-slate-100 rounded-full w-14" />
          </div>
          <div className="h-9 bg-slate-50 rounded-xl w-full" />
          <div className="h-3 bg-slate-100 rounded-md w-full" />
          <div className="h-3 bg-slate-100 rounded-md w-3/4" />
          <div className="h-10 bg-slate-50 rounded-xl w-full" />
        </div>
      ))}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [msg,           setMsg]           = useState("");
  const [eu,            setEu]            = useState("unknown");
  const [auto,          setAuto]          = useState("no");
  const [type,          setType]          = useState("cold");
  const [result,        setResult]        = useState<CheckResult | null>(null);
  const [loading,       setLoading]       = useState(false);
  const [lIdx,          setLIdx]          = useState(0);
  const [err,           setErr]           = useState("");
  const [focused,       setFocused]       = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [checkoutErr,   setCheckoutErr]   = useState("");

  const resultsRef = useRef<HTMLDivElement>(null);
  const words      = wordCount(msg);
  const tooLong    = words > 300;

  useEffect(() => {
    if (!loading) { setLIdx(0); return; }
    const id = setInterval(() => setLIdx(i => (i + 1) % LOADING_MSGS.length), 2600);
    return () => clearInterval(id);
  }, [loading]);

  const handleCheck = useCallback(async () => {
    if (!msg.trim()) { setErr("Please paste a message to analyze."); return; }
    setLoading(true); setErr(""); setResult(null);
    try {
      const res  = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, euRecipient: eu, automationTool: auto, outreachType: type }),
      });
      const data = await res.json();
      if (data.error) { setErr(data.error); return; }
      setResult(data);
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
    } catch {
      setErr("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [msg, eu, auto, type]);

  // ── Stripe checkout handler ───────────────────────────────────────────────
  const handleSubscribe = useCallback(async (planName: string, priceEnvKey: string) => {
    setCheckoutLoading(planName);
    setCheckoutErr("");
    try {
      const priceId = priceEnvKey === "starter"
        ? process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID
        : process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID;

      const res  = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.error) { setCheckoutErr(data.error); return; }
      if (data.url)   { window.location.href = data.url; }
    } catch {
      setCheckoutErr("Could not start checkout. Please try again.");
    } finally {
      setCheckoutLoading(null);
    }
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && msg.trim() && !loading) handleCheck();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleCheck, msg, loading]);

  const risk  = result ? RISK_MAP[result.overall_risk] : null;
  const score = result ? calcScore(result.violations) : null;
  const ss    = score !== null ? scoreStyle(score) : null;

  return (
    // Subtle lavender-tinted page background
    <main className="min-h-screen" style={{ background: "linear-gradient(180deg, #F5F3FF 0%, #F8FAFC 120px, #F8FAFC 100%)" }}>

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-violet-100/80"
        style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", boxShadow: "0 1px 3px rgba(109,40,217,0.06)" }}>
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group outline-none focus-visible:ring-2 focus-visible:ring-violet-400 rounded-lg px-1">
            <span className="text-violet-600 group-hover:text-violet-700 transition-colors duration-150">
              <ShieldLogo size={19} />
            </span>
            <span className="text-[15px] font-semibold text-slate-900 tracking-tight">OutreachSafe</span>
            <span className="ml-0.5 text-[11px] bg-violet-50 text-violet-600 border border-violet-200/80 rounded-full px-2.5 py-[3px] font-medium leading-none">Beta</span>
          </Link>
          <nav className="flex items-center gap-1">
            <a href="#pricing" className="text-[13px] text-slate-500 hover:text-slate-900 hover:bg-violet-50 transition-all duration-150 px-3 py-1.5 rounded-lg font-medium">Pricing</a>
            <Link href="/privacy" className="text-[13px] text-slate-500 hover:text-slate-900 hover:bg-violet-50 transition-all duration-150 px-3 py-1.5 rounded-lg font-medium">Privacy</Link>
          </nav>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section style={{ background: "linear-gradient(180deg, rgba(237,233,254,0.5) 0%, rgba(255,255,255,0.0) 100%)" }}
        className="border-b border-violet-100/60">
        <div className="max-w-3xl mx-auto px-5 py-12 sm:py-16 text-center">
          <div className="inline-flex items-center gap-1.5 bg-white/80 text-violet-700 text-[12px] font-medium px-3 py-1.5 rounded-full border border-violet-200/70 mb-5"
            style={{ boxShadow: "0 1px 6px rgba(109,40,217,0.10)" }}>
            <ShieldLogo size={12} className="text-violet-500" />
            LinkedIn guidelines · CAN-SPAM · GDPR Article 6
          </div>
          <h1 className="text-[1.9rem] sm:text-[2.5rem] font-semibold text-slate-900 leading-[1.15] tracking-tight mb-4">
            Know if your LinkedIn message is<br className="hidden sm:block" /> safe to send — before you hit send.
          </h1>
          <p className="text-[15px] sm:text-base text-slate-500 max-w-[460px] mx-auto mb-7 leading-relaxed">
            Paste your outreach, get a compliance score, see every flagged pattern, and receive specific improvement suggestions — in under 20 seconds.
          </p>
          <div className="flex items-center justify-center gap-5 sm:gap-7 text-[12px] text-slate-400 flex-wrap">
            {[
              ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", "No LinkedIn login"],
              ["M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636", "Messages not stored"],
              ["M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", "Free to start"],
            ].map(([d, t]) => (
              <span key={t as string} className="flex items-center gap-1.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d as string}/></svg>
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-5 py-7 space-y-4">

        {/* ── Checker card ─────────────────────────────────────────────── */}
        <div className={`bg-white rounded-2xl border transition-all duration-200 ${focused
          ? "border-violet-300 shadow-[0_0_0_4px_rgba(139,92,246,0.08),0_4px_16px_rgba(109,40,217,0.10)]"
          : "border-slate-200/80 shadow-[0_2px_8px_rgba(109,40,217,0.06)]"} hover:border-violet-200`}>
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-2.5">
              <label htmlFor="msg-input" className="text-[13px] font-semibold text-slate-700">
                Paste your LinkedIn message
              </label>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                ~15 sec · ⌘↵ to run
              </span>
            </div>

            <textarea id="msg-input" value={msg}
              onChange={e => setMsg(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={PLACEHOLDER} rows={8}
              aria-label="LinkedIn outreach message to analyze"
              className="w-full text-[13.5px] text-slate-900 border border-slate-200 rounded-xl p-4 resize-none focus:outline-none focus:ring-0 focus:border-violet-300 placeholder-slate-400/70 leading-[1.65] transition-colors min-h-[180px]"
              style={{ background: "linear-gradient(180deg, #FAFAFA 0%, #FFFFFF 100%)" }}
            />

            <div className="flex justify-between items-center mt-2 mb-4">
              <p className="text-[11.5px] text-slate-400 flex items-center gap-1.5">
                <ShieldLogo size={11} className="text-slate-400" />
                Checks 30+ LinkedIn, CAN-SPAM &amp; GDPR patterns
              </p>
              <div className="flex items-center gap-2.5 text-[11.5px]">
                {msg.length > 0 && <span className="text-slate-400">{msg.length} chars</span>}
                <span className={tooLong ? "text-amber-500 font-medium" : "text-slate-400"}>
                  {words} words{tooLong && " · consider shortening"}
                </span>
              </div>
            </div>

            {/* Context toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              {([
                { label: "EU recipient?",          state: eu,   setState: setEu,   opts: ["yes","no","unknown"]       },
                { label: "Automation tool?",        state: auto, setState: setAuto, opts: ["yes","no"]                 },
                { label: "Outreach type",           state: type, setState: setType, opts: ["cold","warm","connection"] },
              ] as const).map(({ label, state, setState, opts }) => (
                <div key={label}>
                  <p className="text-[11.5px] font-medium text-slate-500 mb-1.5">{label}</p>
                  <div className="flex gap-1.5 flex-wrap">
                    {opts.map((o: string) => (
                      <button key={o} type="button" aria-pressed={state === o}
                        onClick={() => (setState as (v: string) => void)(o)}
                        className={`text-[12px] px-3 py-1.5 rounded-lg border font-medium transition-all duration-150 ${
                          state === o
                            ? "bg-violet-50 border-violet-300 text-violet-700 shadow-sm shadow-violet-100"
                            : "bg-white border-slate-200 text-slate-500 hover:bg-violet-50/40 hover:border-violet-200 hover:text-slate-700"
                        }`}>
                        {o.charAt(0).toUpperCase() + o.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button type="button" onClick={handleCheck}
              disabled={loading || !msg.trim()} aria-busy={loading}
              className="w-full relative font-semibold text-[13.5px] py-3.5 rounded-xl transition-all duration-200 disabled:cursor-not-allowed text-white border border-violet-800/20 hover:-translate-y-[1px] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2"
              style={{
                background: loading || !msg.trim()
                  ? "linear-gradient(180deg, #C4B5FD 0%, #A78BFA 100%)"
                  : "linear-gradient(180deg, #7C3AED 0%, #4F46E5 100%)",
                boxShadow: loading || !msg.trim()
                  ? "none"
                  : "0 2px 10px rgba(109,40,217,0.35), 0 1px 2px rgba(109,40,217,0.2), inset 0 1px 0 rgba(255,255,255,0.15)",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2.5">
                  <svg className="animate-spin h-4 w-4 opacity-75" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  <span>{LOADING_MSGS[lIdx]}</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <ShieldLogo size={15} />
                  Analyze my message
                </span>
              )}
            </button>

            {loading && (
              <div className="flex items-center justify-center gap-1.5 mt-3" role="status" aria-live="polite" aria-label={LOADING_MSGS[lIdx]}>
                {LOADING_MSGS.map((_, i) => (
                  <div key={i} className={`rounded-full transition-all duration-500 ${i === lIdx ? "w-2 h-2 bg-violet-500" : "w-1.5 h-1.5 bg-slate-300"}`} aria-hidden="true" />
                ))}
              </div>
            )}

            <p className="text-center text-[11px] text-slate-400 mt-3 flex items-center justify-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              Powered by Claude AI · analysis runs privately
            </p>

            {err && <p className="mt-3 text-[13px] text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-2.5" role="alert">{err}</p>}
          </div>
        </div>

        {/* ── Loading skeleton ─────────────────────────────────────────── */}
        {loading && <LoadingSkeleton />}

        {/* ── Results ──────────────────────────────────────────────────── */}
        {result && risk && score !== null && ss && (
          <div ref={resultsRef} className="space-y-3">
            <div className={`rounded-2xl border ${risk.border} ${risk.bg} p-5 shadow-sm`}>
              <div className="flex items-start gap-4">
                <ScoreRing score={score} style={ss} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[13px] font-semibold ${risk.text}`}>{risk.label}</span>
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full bg-white/70 border ${risk.border} ${risk.text}`}>{ss.label}</span>
                    </div>
                    <div className="flex gap-3 text-[12px] text-slate-500">
                      <span><span className="font-semibold text-slate-800">{result.violations.length}</span> flagged</span>
                      <span><span className="font-semibold text-slate-800">{result.passed_rules_count}</span> passed</span>
                    </div>
                  </div>
                  <p className={`text-[13px] ${risk.text} leading-relaxed`}>{result.summary}</p>
                  {result.violations.length > 0 && (
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {(["high","medium","low"] as const).map(s => {
                        const c = result.violations.filter(v => v.severity === s).length;
                        if (!c) return null;
                        return <span key={s} className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${SEV_MAP[s].badge}`}>{c} {s}</span>;
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center px-2 leading-relaxed">
              Analysis is informational only — not legal advice. Not affiliated with LinkedIn, Meta, or any platform referenced.
            </p>

            {result.violations.length === 0 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center shadow-sm">
                <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center mx-auto mb-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <p className="text-emerald-800 font-semibold text-[14px] mb-1">No patterns flagged</p>
                <p className="text-emerald-700 text-[13px]">This message looks clean across all 30+ checks. Compliance score: {score}/100.</p>
              </div>
            )}

            {result.violations.map((v, i) => {
              const s = SEV_MAP[v.severity];
              return (
                <div key={i} className={`rounded-2xl border ${s.border} ${s.bg} p-5 shadow-sm hover:shadow-md ${s.shadow} transition-shadow duration-200`}>
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-[3px] ${s.dot}`} aria-hidden="true" />
                      <span className="text-[13px] font-semibold text-slate-900 leading-snug">{v.rule_name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${s.badge}`}>{s.label}</span>
                      <span className="text-[10px] text-slate-400 font-mono bg-white/70 px-1.5 py-0.5 rounded-md border border-white">{v.rule_id}</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-[13px]">
                    <div className="bg-white/60 rounded-xl px-3.5 py-2.5 border border-white/80">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.08em] mr-1.5">Pattern</span>
                      <span className="text-slate-700 italic">&ldquo;{v.triggered_text}&rdquo;</span>
                    </div>
                    <div className="px-0.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.08em] mr-1.5">Why it matters</span>
                      <span className="text-slate-600 leading-relaxed">{v.explanation}</span>
                    </div>
                    <div className="bg-white/80 rounded-xl px-3.5 py-2.5 border border-white shadow-sm">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.08em] mr-1.5">Suggestion</span>
                      <span className="text-slate-900 leading-relaxed">{v.fix}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {result.violations.length > 0 && (
              <div className="text-center py-2">
                <button type="button"
                  onClick={() => { setResult(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="text-[13px] text-violet-600 hover:text-violet-800 font-medium transition-colors inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-violet-50">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
                  Edit and re-analyze
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── How it works ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6"
          style={{ boxShadow: "0 2px 8px rgba(109,40,217,0.05)" }}>
          <h2 className="text-[13px] font-semibold text-slate-900 mb-5">How it works</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { n: "1", t: "Paste your message",  d: "Drop in any LinkedIn outreach — InMail, DM, or connection request" },
              { n: "2", t: "Run the analysis",    d: "AI checks 30+ compliance patterns across 4 regulatory frameworks"  },
              { n: "3", t: "Apply suggestions",   d: "Fix flagged patterns, re-analyze until clean, then send confidently" },
            ].map(({ n, t, d }) => (
              <div key={n} className="group">
                <div className="w-8 h-8 rounded-full bg-violet-50 border border-violet-200 text-violet-600 text-[13px] font-semibold flex items-center justify-center mx-auto mb-2.5 group-hover:bg-violet-100 transition-colors duration-150">
                  {n}
                </div>
                <p className="text-[12px] font-semibold text-slate-800 mb-1 leading-snug">{t}</p>
                <p className="text-[11.5px] text-slate-500 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Pricing ──────────────────────────────────────────────────── */}
        <div id="pricing" className="rounded-2xl border border-violet-100 p-5 sm:p-6"
          style={{ background: "linear-gradient(180deg, #F5F3FF 0%, #FFFFFF 100%)", boxShadow: "0 2px 12px rgba(109,40,217,0.07)" }}>
          <h2 className="text-[13px] font-semibold text-slate-900 mb-0.5">Pricing</h2>
          <p className="text-[12px] text-slate-400 mb-5">Start free — no credit card, no account required.</p>

          {checkoutErr && (
            <p className="mb-4 text-[12px] text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-2.5" role="alert">
              {checkoutErr}
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {[
              {
                name: "Free", price: "$0", period: "forever", planKey: "free",
                desc: "For occasional checking",
                features: ["5 analyses per day","30+ compliance patterns","Compliance score 0–100","Improvement suggestions"],
                featured: false, cta: "Start free",
              },
              {
                name: "Starter", price: "$19", period: "/month", planKey: "starter",
                desc: "For active SDRs and founders",
                features: ["200 analyses per month","Chrome extension (in-context)","CAN-SPAM + GDPR deep scan","Weekly digest email","Message history"],
                featured: true, cta: "Get Starter",
              },
              {
                name: "Pro", price: "$49", period: "/month", planKey: "pro",
                desc: "For sales teams and agencies",
                features: ["Unlimited analyses","3 team seats (+$12/extra)","API access","Bulk template scanner","Priority support"],
                featured: false, cta: "Get Pro",
              },
            ].map(({ name, price, period, planKey, desc, features, featured, cta }) => {
              const isLoading = checkoutLoading === name;
              return (
                <div key={name} className={`relative rounded-xl p-4 transition-all duration-200 ${
                  featured
                    ? "border-2 border-violet-500 hover:-translate-y-[2px]"
                    : "border border-slate-200 hover:border-violet-200 hover:-translate-y-[1px]"
                }`}
                  style={featured
                    ? { background: "linear-gradient(180deg, #FAFAFF 0%, #FFFFFF 100%)", boxShadow: "0 4px 16px rgba(109,40,217,0.14), 0 1px 4px rgba(109,40,217,0.08)" }
                    : { background: "#FFFFFF", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }
                  }>
                  {featured && (
                    <div className="absolute -top-[13px] left-1/2 -translate-x-1/2 text-white text-[11px] font-semibold px-3 py-0.5 rounded-full whitespace-nowrap"
                      style={{ background: "linear-gradient(180deg, #7C3AED 0%, #4F46E5 100%)", boxShadow: "0 2px 6px rgba(109,40,217,0.35)" }}>
                      Most popular
                    </div>
                  )}
                  <p className="font-semibold text-[13px] text-slate-900 mb-0.5">{name}</p>
                  <div className="flex items-baseline gap-1 mb-0.5">
                    <span className="text-[22px] font-semibold text-slate-900 leading-none">{price}</span>
                    <span className="text-[11px] text-slate-400">{period}</span>
                  </div>
                  <p className="text-[11.5px] text-slate-500 mb-3.5">{desc}</p>
                  <div className="space-y-1.5 mb-4">
                    {features.map(f => (
                      <div key={f} className="flex items-start gap-1.5 text-[12px] text-slate-600">
                        <CheckMark />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    disabled={isLoading || (planKey !== "free" && checkoutLoading !== null)}
                    onClick={() => planKey !== "free" && handleSubscribe(name, planKey)}
                    className={`w-full text-[12px] font-semibold py-2 rounded-lg transition-all duration-150 disabled:cursor-not-allowed ${
                      featured
                        ? "text-white border border-violet-800/20"
                        : planKey === "free"
                        ? "bg-white hover:bg-violet-50 text-slate-700 border border-slate-200 hover:border-violet-200"
                        : "bg-white hover:bg-violet-50 text-slate-700 border border-slate-200 hover:border-violet-200"
                    }`}
                    style={featured ? {
                      background: isLoading
                        ? "linear-gradient(180deg, #C4B5FD 0%, #A78BFA 100%)"
                        : "linear-gradient(180deg, #7C3AED 0%, #4F46E5 100%)",
                      boxShadow: isLoading ? "none" : "0 2px 8px rgba(109,40,217,0.30)",
                    } : undefined}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-1.5">
                        <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                        </svg>
                        Redirecting…
                      </span>
                    ) : cta}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <footer className="border-t border-violet-100 pt-5 pb-6" role="contentinfo">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11.5px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldLogo size={11} className="text-slate-400" />
              <span>© 2026 Cyber Global Technologies LLC</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-violet-600 transition-colors duration-150">Privacy Policy</Link>
              <Link href="/terms"   className="hover:text-violet-600 transition-colors duration-150">Terms of Service</Link>
            </div>
            <span className="text-center text-[11px] leading-relaxed text-slate-400/80">
              Informational only · Not legal advice · Not affiliated with LinkedIn
            </span>
          </div>
        </footer>

      </div>
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";

type Violation = {
  rule_id: string;
  rule_name: string;
  severity: "high" | "medium" | "low";
  triggered_text: string;
  explanation: string;
  fix: string;
};

type CheckResult = {
  violations: Violation[];
  passed_rules_count: number;
  overall_risk: "high" | "medium" | "low" | "clean";
  summary: string;
};

const SEV_STYLES = {
  high:   { bg: "bg-red-50",   border: "border-red-200",   badge: "bg-red-100 text-red-700",     dot: "bg-red-500",   label: "HIGH"   },
  medium: { bg: "bg-amber-50", border: "border-amber-200", badge: "bg-amber-100 text-amber-700", dot: "bg-amber-500", label: "MEDIUM" },
  low:    { bg: "bg-blue-50",  border: "border-blue-200",  badge: "bg-blue-100 text-blue-700",   dot: "bg-blue-500",  label: "LOW"    },
};

const RISK_STYLES = {
  high:   { bg: "bg-red-50",   text: "text-red-700",   border: "border-red-200",   label: "High risk",   ring: "border-red-400"   },
  medium: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", label: "Medium risk", ring: "border-amber-400" },
  low:    { bg: "bg-blue-50",  text: "text-blue-700",  border: "border-blue-200",  label: "Low risk",    ring: "border-blue-400"  },
  clean:  { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", label: "Clean",       ring: "border-green-400" },
};

const SCORE_STYLE = (score: number) => {
  if (score >= 80) return { color: "text-green-700", ring: "border-green-400", bg: "bg-green-50",  label: "Safe to send" };
  if (score >= 50) return { color: "text-amber-700", ring: "border-amber-400", bg: "bg-amber-50",  label: "Needs work" };
  return               { color: "text-red-700",   ring: "border-red-400",   bg: "bg-red-50",    label: "Do not send" };
};

const LOADING_MESSAGES = [
  "Checking against LinkedIn TOS...",
  "Scanning for CAN-SPAM violations...",
  "Reviewing GDPR Article 6 compliance...",
  "Analyzing spam trigger patterns...",
  "Generating fix suggestions...",
  "Almost done...",
];

function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function calcScore(violations: Violation[]): number {
  const high   = violations.filter(v => v.severity === "high").length;
  const medium = violations.filter(v => v.severity === "medium").length;
  const low    = violations.filter(v => v.severity === "low").length;
  return Math.max(0, 100 - (high * 15) - (medium * 7) - (low * 3));
}

export default function Home() {
  const [message, setMessage]           = useState("");
  const [euRecipient, setEuRecipient]   = useState("unknown");
  const [automationTool, setAutomation] = useState("no");
  const [outreachType, setOutreachType] = useState("cold");
  const [result, setResult]             = useState<CheckResult | null>(null);
  const [loading, setLoading]           = useState(false);
  const [loadingMsg, setLoadingMsg]     = useState(LOADING_MESSAGES[0]);
  const [error, setError]               = useState("");

  const words   = wordCount(message);
  const tooLong = words > 300;

  useEffect(() => {
    if (!loading) return;
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[i]);
    }, 3000);
    return () => clearInterval(interval);
  }, [loading]);

  async function handleCheck() {
    if (!message.trim()) { setError("Please paste a message first."); return; }
    setLoading(true);
    setLoadingMsg(LOADING_MESSAGES[0]);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, euRecipient, automationTool, outreachType }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setResult(data);
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const risk  = result ? RISK_STYLES[result.overall_risk] : null;
  const score = result ? calcScore(result.violations) : null;
  const ss    = score !== null ? SCORE_STYLE(score) : null;

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span className="text-base font-semibold text-gray-900">OutreachSafe</span>
            <span className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-full px-2.5 py-0.5 font-medium">Beta</span>
          </div>
          <a href="#pricing" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Pricing</a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-10 text-center">
          <h1 className="text-3xl font-semibold text-gray-900 mb-3 leading-tight">
            One message can get your LinkedIn<br className="hidden sm:block" /> account restricted.
          </h1>
          <p className="text-base text-gray-500 max-w-xl mx-auto mb-6 leading-relaxed">
            OutreachSafe checks your outreach against LinkedIn TOS, CAN-SPAM, and GDPR before you send — so you never find out the hard way.
          </p>
          <div className="flex items-center justify-center gap-6 text-xs text-gray-400 flex-wrap">
            <span className="flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              No LinkedIn login required
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.51"/></svg>
              Messages are not stored
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
              Free to start — no account needed
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">

        {/* Input card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paste your LinkedIn message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Hi [First Name], I know you're struggling with..."
            rows={7}
            className="w-full text-sm text-gray-900 border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-400 leading-relaxed"
          />

          {/* Word counter */}
          <div className="flex justify-between items-center mt-1 mb-4">
            <p className="text-xs text-gray-400">
              Checks against 30+ compliance rules
            </p>
            <p className="text-xs">
              <span className={tooLong ? "text-amber-500 font-medium" : "text-gray-400"}>
                {words} words
              </span>
              {tooLong && <span className="text-amber-500 ml-1">⚠ over 300 words</span>}
            </p>
          </div>

          {/* Context toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1.5">EU recipient?</p>
              <div className="flex gap-2">
                {["yes", "no", "unknown"].map((v) => (
                  <button key={v} onClick={() => setEuRecipient(v)}
                    className={`text-xs px-3 py-1.5 rounded-md border font-medium transition-colors ${
                      euRecipient === v
                        ? "bg-indigo-50 border-indigo-400 text-indigo-700"
                        : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1.5">Using automation tool?</p>
              <div className="flex gap-2">
                {["yes", "no"].map((v) => (
                  <button key={v} onClick={() => setAutomation(v)}
                    className={`text-xs px-3 py-1.5 rounded-md border font-medium transition-colors ${
                      automationTool === v
                        ? "bg-indigo-50 border-indigo-400 text-indigo-700"
                        : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1.5">Outreach type</p>
              <div className="flex gap-2">
                {["cold", "warm", "connection"].map((v) => (
                  <button key={v} onClick={() => setOutreachType(v)}
                    className={`text-xs px-3 py-1.5 rounded-md border font-medium transition-colors ${
                      outreachType === v
                        ? "bg-indigo-50 border-indigo-400 text-indigo-700"
                        : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button onClick={handleCheck} disabled={loading || message.trim().length === 0}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-medium text-sm py-3 rounded-lg transition-colors">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                {loadingMsg}
              </span>
            ) : "Check my message →"}
          </button>

          {error && (
            <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
              {error}
            </p>
          )}
        </div>

        {/* Results */}
        {result && risk && score !== null && ss && (
          <div id="results" className="space-y-4">

            {/* Score + risk banner */}
            <div className={`rounded-xl border ${risk.border} ${risk.bg} p-5`}>
              <div className="flex items-start gap-4">
                {/* Score ring */}
                <div className={`flex-shrink-0 w-16 h-16 rounded-full border-4 ${ss.ring} flex flex-col items-center justify-center ${ss.bg}`}>
                  <span className={`text-xl font-semibold leading-none ${ss.color}`}>{score}</span>
                  <span className={`text-xs ${ss.color} opacity-70`}>/100</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${risk.text}`}>{risk.label}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ss.bg} ${ss.color}`}>{ss.label}</span>
                    </div>
                    <div className="flex gap-3 text-xs text-gray-500">
                      <span><span className="font-semibold text-gray-800">{result.violations.length}</span> violations</span>
                      <span><span className="font-semibold text-gray-800">{result.passed_rules_count}</span> passed</span>
                    </div>
                  </div>
                  <p className={`text-sm ${risk.text} leading-relaxed`}>{result.summary}</p>
                  {result.violations.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {(["high","medium","low"] as const).map((s) => {
                        const count = result.violations.filter(v => v.severity === s).length;
                        if (!count) return null;
                        const st = SEV_STYLES[s];
                        return <span key={s} className={`text-xs font-medium px-2 py-0.5 rounded-full ${st.badge}`}>{count} {s}</span>;
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Clean state */}
            {result.violations.length === 0 && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                <p className="text-green-700 font-semibold">No violations found — this message looks clean.</p>
                <p className="text-green-600 text-sm mt-1">Safe to send. Score: {score}/100.</p>
              </div>
            )}

            {/* Violation cards */}
            {result.violations.map((v, i) => {
              const s = SEV_STYLES[v.severity];
              return (
                <div key={i} className={`rounded-xl border ${s.border} ${s.bg} p-5`}>
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-0.5 ${s.dot}`} aria-hidden="true"/>
                      <span className="text-sm font-semibold text-gray-900">{v.rule_name}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.badge}`}>{s.label}</span>
                      <span className="text-xs text-gray-400 font-mono">{v.rule_id}</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="bg-white bg-opacity-70 rounded-lg px-3 py-2">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Triggered by </span>
                      <span className="text-gray-800 italic">&quot;{v.triggered_text}&quot;</span>
                    </div>
                    <div className="px-1">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Why </span>
                      <span className="text-gray-700">{v.explanation}</span>
                    </div>
                    <div className="bg-white bg-opacity-90 rounded-lg px-3 py-2">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Fix </span>
                      <span className="text-gray-900">{v.fix}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {result.violations.length > 0 && (
              <div className="text-center pt-2">
                <button onClick={() => { setResult(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                  ← Edit message and re-check
                </button>
              </div>
            )}
          </div>
        )}

        {/* How it works */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">How it works</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { step: "1", title: "Paste your message", desc: "Drop in your LinkedIn outreach text" },
              { step: "2", title: "Run the check", desc: "AI scans against 30+ compliance rules" },
              { step: "3", title: "Fix and send", desc: "Apply specific fixes, then send with confidence" },
            ].map(({ step, title, desc }) => (
              <div key={step}>
                <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm font-semibold flex items-center justify-center mx-auto mb-2">{step}</div>
                <p className="text-xs font-medium text-gray-900 mb-1">{title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing */}
        <div id="pricing" className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Pricing</h2>
          <p className="text-xs text-gray-500 mb-5">Start free. Upgrade when you need more checks.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { name: "Free", price: "$0", period: "forever", desc: "For occasional checking", features: ["5 checks per day", "All 30+ rules", "Severity scoring", "Fix suggestions"], featured: false },
              { name: "Starter", price: "$19", period: "/month", desc: "For active SDRs", features: ["200 checks per month", "Chrome extension", "CAN-SPAM + GDPR rules", "Weekly digest email", "Message history"], featured: true },
              { name: "Pro", price: "$49", period: "/month", desc: "For sales teams", features: ["Unlimited checks", "3 team seats", "API access", "Bulk template scanner", "Priority support"], featured: false },
            ].map(({ name, price, period, desc, features, featured }) => (
              <div key={name} className={`rounded-lg p-4 ${featured ? "border-2 border-indigo-500 relative" : "border border-gray-200"}`}>
                {featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-medium px-3 py-0.5 rounded-full">Most popular</div>}
                <div className="font-medium text-sm text-gray-900 mb-0.5">{name}</div>
                <div className="mb-1">
                  <span className="text-2xl font-semibold text-gray-900">{price}</span>
                  <span className="text-xs text-gray-500">{period}</span>
                </div>
                <p className="text-xs text-gray-500 mb-3">{desc}</p>
                {features.map(f => (
                  <div key={f} className="flex items-center gap-1.5 text-xs text-gray-600 mb-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                    {f}
                  </div>
                ))}
                <button className={`mt-4 w-full text-xs font-medium py-2 rounded-md transition-colors ${featured ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200"}`}>
                  {name === "Free" ? "Start free" : `Get ${name}`}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-200 pt-6 pb-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
            <div className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span>© 2026 Cyber Global Technologies LLC</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="/privacy" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
              <a href="/terms" className="hover:text-gray-600 transition-colors">Terms of Service</a>
            </div>
            <span>Not legal advice</span>
          </div>
        </footer>
      </div>
    </main>
  );
}

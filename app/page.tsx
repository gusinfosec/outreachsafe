"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

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

const SEV: Record<Severity, { bg: string; border: string; badge: string; dot: string; label: string }> = {
  high:   { bg: "bg-rose-500/10",   border: "border-rose-500/30",   badge: "bg-rose-500/20 text-rose-400",     dot: "bg-rose-500",   label: "High"   },
  medium: { bg: "bg-amber-500/10",  border: "border-amber-500/30",  badge: "bg-amber-500/20 text-amber-400",   dot: "bg-amber-400",  label: "Medium" },
  low:    { bg: "bg-blue-500/10",    border: "border-blue-500/30",    badge: "bg-blue-500/20 text-blue-400",       dot: "bg-blue-400",    label: "Low"    },
};

const RISK: Record<Risk, { bg: string; text: string; border: string; label: string }> = {
  high:   { bg: "bg-rose-500/10",    text: "text-rose-400",    border: "border-rose-500/30",    label: "Needs attention" },
  medium: { bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/30",   label: "Some concerns"   },
  low:    { bg: "bg-blue-500/10",     text: "text-blue-400",     border: "border-blue-500/30",     label: "Minor issues"    },
  clean:  { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30", label: "Looking good"    },
};

function scoreStyle(s: number) {
  if (s >= 80) return { color: "text-emerald-400", trackColor: "#34D399", label: "Looking good",       ring: "border-emerald-500/30" };
  if (s >= 60) return { color: "text-blue-400",     trackColor: "#60A5FA", label: "Minor issues",       ring: "border-blue-500/30"     };
  if (s >= 40) return { color: "text-amber-400",   trackColor: "#FBBF24", label: "Needs work",         ring: "border-amber-500/30"   };
  if (s >= 20) return { color: "text-orange-400",  trackColor: "#FB923C", label: "Significant issues", ring: "border-orange-500/30"  };
  return             { color: "text-rose-400",    trackColor: "#F87171", label: "High concern",       ring: "border-rose-500/30"    };
}

const LOADING_MSGS = [
  "Analyzing spam-risk patterns…",
  "Checking LinkedIn policy heuristics…",
  "Reviewing CAN-SPAM compliance signals…",
  "Scanning GDPR Article 6 indicators…",
  "Evaluating outreach language quality…",
  "Generating safer recommendations…",
];

// ── Stripe price IDs (public — safe to hardcode) ──────────────────────────────
const PRICES = {
  starter: "price_1TXWvuFnIuEgeFxO6nVnXJoB",
  pro:     "price_1TXWuPFnIuEgeFxOesJVBAgJ",
};

function wc(t: string) { return t.split(/\s+/).filter(Boolean).length; }
function calcScore(v: Violation[]) {
  return Math.max(0, 100 - v.filter(x=>x.severity==="high").length*15 - v.filter(x=>x.severity==="medium").length*7 - v.filter(x=>x.severity==="low").length*3);
}

function Shield({ size=18, cls="" }: { size?: number; cls?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={cls}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor"/>
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}

function Tick({ cls="" }: { cls?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`flex-shrink-0 ${cls}`}>
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function ScoreRing({ score, style }: { score: number; style: ReturnType<typeof scoreStyle> }) {
  const r=26, circ=2*Math.PI*r;
  const [anim, setAnim] = useState(0);
  useEffect(() => { const t=setTimeout(()=>setAnim(score),80); return ()=>clearTimeout(t); }, [score]);
  return (
    <div className="relative w-[68px] h-[68px] flex-shrink-0" role="img" aria-label={`Score: ${score}/100`}>
      <svg width="68" height="68" viewBox="0 0 68 68">
        <circle cx="34" cy="34" r={r} fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="4"/>
        <circle cx="34" cy="34" r={r} fill="none" stroke={style.trackColor} strokeWidth="4" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ-(anim/100)*circ}
          transform="rotate(-90 34 34)"
          style={{ transition:"stroke-dashoffset 1.1s cubic-bezier(0.34,1.56,0.64,1)" }}/>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-[18px] font-semibold leading-none ${style.color}`}>{score}</span>
        <span className="text-[9px] text-slate-500 mt-0.5 font-mono">/100</span>
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="space-y-4 animate-pulse max-w-[640px] mx-auto mt-8">
      <div className="bg-white/5 rounded-2xl border border-white/5 p-6">
        <div className="flex gap-5"><div className="w-[68px] h-[68px] rounded-full bg-white/5 flex-shrink-0"/><div className="flex-1 space-y-3 pt-2"><div className="h-4 bg-white/5 rounded w-32"/><div className="h-3 bg-white/5 rounded w-full"/><div className="h-3 bg-white/5 rounded w-4/5"/></div></div>
      </div>
      {[1,2].map(i=>(
        <div key={i} className="bg-white/5 rounded-2xl border border-white/5 p-6 space-y-4">
          <div className="flex justify-between"><div className="h-4 bg-white/5 rounded w-40"/><div className="h-5 bg-white/5 rounded-full w-14"/></div>
          <div className="h-10 bg-white/5 rounded-xl"/><div className="h-3 bg-white/5 rounded"/><div className="h-3 bg-white/5 rounded w-3/4"/><div className="h-12 bg-white/5 rounded-xl"/>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const [msg,     setMsg]     = useState("");
  const [eu,      setEu]      = useState("unknown");
  const [auto,    setAuto]    = useState("no");
  const [type,    setType]    = useState("cold");
  const [result,  setResult]  = useState<CheckResult|null>(null);
  const [loading, setLoading] = useState(false);
  const [lIdx,    setLIdx]    = useState(0);
  const [err,     setErr]     = useState("");
  const [focused, setFocused] = useState(false);
  const [coLoading, setCoLoading] = useState<string|null>(null);
  const [coErr,   setCoErr]   = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const words = wc(msg), tooLong = words>300;

  useEffect(()=>{
    if(!loading){setLIdx(0);return;}
    const id=setInterval(()=>setLIdx(i=>(i+1)%LOADING_MSGS.length),2600);
    return ()=>clearInterval(id);
  },[loading]);

  const handleCheck = useCallback(async()=>{
    if(!msg.trim()){setErr("Please paste a message to analyze.");return;}
    setLoading(true);setErr("");setResult(null);
    try{
      const res=await fetch("/api/check",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:msg,euRecipient:eu,automationTool:auto,outreachType:type})});
      const data=await res.json();
      if(data.error){setErr(data.error);return;}
      setResult(data);
      setTimeout(()=>ref.current?.scrollIntoView({behavior:"smooth",block:"start"}),200);
    }catch{setErr("Something went wrong. Please try again.");}
    finally{setLoading(false);}
  },[msg,eu,auto,type]);

  const handleSubscribe = useCallback(async(planName: string, planKey: "starter"|"pro")=>{
    const priceId = PRICES[planKey];
    if(!priceId){
      setCoErr("Configuration error — price ID missing. Please contact support.");
      return;
    }
    setCoLoading(planName);
    setCoErr("");
    try{
      const res=await fetch("/api/checkout",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({priceId}),
      });
      if(!res.ok){
        setCoErr(`Checkout failed. Please try again or contact support.`);
        return;
      }
      const data=await res.json();
      if(data.error){
        setCoErr(data.error);
        return;
      }
      if(data.url) window.location.href=data.url;
    }catch(e){
      setCoErr("Network error starting checkout. Please try again.");
    }finally{
      setCoLoading(null);
    }
  },[]);

  useEffect(()=>{
    const h=(e:KeyboardEvent)=>{if((e.metaKey||e.ctrlKey)&&e.key==="Enter"&&msg.trim()&&!loading)handleCheck();};
    window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);
  },[handleCheck,msg,loading]);

  const risk=result?RISK[result.overall_risk]:null;
  const score=result?calcScore(result.violations):null;
  const ss=score!==null?scoreStyle(score):null;

  return (
    <main className="relative z-10">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-[100] bg-[#0F1221]/85 backdrop-blur-xl border-b border-white/[0.07] py-3.5">
        <div className="max-w-[960px] mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image 
              src="/icon.png" 
              alt="OutreachSafe" 
              width={32} 
              height={32} 
              style={{ borderRadius: '8px' }}
            />
            <span className="text-[17px] font-extrabold text-white tracking-tight">Outreach<span className="text-[#7C3AED]">Safe</span></span>
            <span className="bg-[#7C3AED]/15 border border-[#7C3AED]/25 text-[#A78BFA] font-mono text-[10px] px-2 py-0.5 rounded-[3px] ml-1 tracking-wider uppercase">Beta</span>
          </Link>
          <div className="flex items-center gap-6">
            <a href="#pricing" className="text-[13px] font-medium text-slate-500 hover:text-white transition-colors">Pricing</a>
            <Link href="/support" className="text-[13px] font-medium text-slate-500 hover:text-white transition-colors">Support</Link>
            <Link href="/privacy" className="text-[13px] font-medium text-slate-500 hover:text-white transition-colors">Privacy</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="pt-20 pb-16 text-center">
        <div className="max-w-[960px] mx-auto px-6">
          <div className="inline-flex items-center gap-2 bg-[#7C3AED]/10 border border-[#7C3AED]/25 rounded-full px-4 py-1.5 mb-7">
            <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] shadow-[0_0_6px_#7C3AED]"></div>
            <span className="font-mono text-[11px] text-[#A78BFA] tracking-wider uppercase">LinkedIn guidelines · CAN-SPAM · GDPR Article 6</span>
          </div>

          <h1 className="text-4xl md:text-[54px] font-extrabold text-white leading-[1.1] tracking-tighter mb-5 max-w-[720px] mx-auto">
            Know if your LinkedIn message is <span className="text-[#7C3AED]">safe to send</span> — before you hit send.
          </h1>

          <p className="text-[17px] text-slate-400 max-w-[520px] mx-auto mb-10 leading-relaxed font-medium">
            Paste your outreach, get a compliance score, see every flagged pattern, and receive specific improvement suggestions — in under 20 seconds.
          </p>

          {/* ── Analyzer ── */}
          <div className={`max-w-[640px] mx-auto bg-white/[0.03] border rounded-2xl p-6 text-left transition-all duration-300 ${focused?"border-[#7C3AED]/50 shadow-[0_0_40px_rgba(124,58,237,0.1)]":"border-[#7C3AED]/25"}`}>
            <textarea
              value={msg}
              onChange={e=>setMsg(e.target.value)}
              onFocus={()=>setFocused(true)}
              onBlur={()=>setFocused(false)}
              placeholder={"Paste your LinkedIn message here...\n\n~15 sec · ⌘↵ to run"}
              className="w-full bg-white/[0.04] border border-white/[0.07] rounded-xl p-4 text-slate-300 placeholder:text-slate-600 text-[14px] leading-relaxed resize-none h-[140px] focus:outline-none focus:border-[#7C3AED]/40 transition-colors"
            />

            <div className="flex flex-wrap gap-4 mt-4">
              {([
                {label:"EU RECIPIENT?",  state:eu,   set:setEu,   opts:["yes","no","unknown"]},
                {label:"AUTOMATION TOOL?",state:auto,set:setAuto, opts:["yes","no"]},
                {label:"OUTREACH TYPE",  state:type, set:setType, opts:["cold","warm","connection"]},
              ] as const).map(({label,state,set,opts})=>(
                <div key={label} className="flex flex-col gap-1.5">
                  <span className="font-mono text-[9px] text-slate-500 tracking-widest uppercase">{label}</span>
                  <div className="flex gap-1.5">
                    {opts.map((o:string)=>(
                      <button
                        key={o}
                        onClick={()=>(set as (v:string)=>void)(o)}
                        className={`text-[11px] px-2.5 py-1 rounded-full border transition-all duration-200 ${state===o?"bg-[#7C3AED]/15 border-[#7C3AED]/40 text-[#A78BFA]":"bg-transparent border-white/[0.07] text-slate-500 hover:text-slate-300"}`}
                      >
                        {o.charAt(0).toUpperCase()+o.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleCheck}
              disabled={loading||!msg.trim()}
              className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] text-white font-bold text-[15px] shadow-[0_8px_24px_rgba(124,58,237,0.3)] hover:shadow-[0_12px_32px_rgba(124,58,237,0.4)] hover:-translate-y-px active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2.5">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                  {LOADING_MSGS[lIdx]}
                </span>
              ) : (
                "Analyze my message"
              )}
            </button>

            <p className="mt-3 text-center font-mono text-[11px] text-slate-600">
              Powered by <span className="text-[#A78BFA]">Claude AI</span> · analysis runs privately
            </p>

            {err&&<p className="mt-4 text-[13px] text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">{err}</p>}
          </div>

          {/* ── Trust Pills ── */}
          <div className="flex flex-wrap justify-center gap-3 mt-10">
            {[
              "No LinkedIn login",
              "Messages not stored",
              "Free to start"
            ].map(t=>(
              <div key={t} className="flex items-center gap-2 bg-white/[0.02] border border-white/[0.07] rounded-full px-4 py-2 text-[12px] text-slate-400">
                <div className="w-1.5 h-1.5 rounded-full bg-[#34D399]"></div>
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Results ── */}
      <div className="max-w-[640px] mx-auto px-6 pb-20">
        {loading&&<Skeleton/>}
        {result&&risk&&score!==null&&ss&&(
          <div ref={ref} className="space-y-4 pt-8">
            <div className={`rounded-2xl border ${risk.border} ${risk.bg} p-6 shadow-xl`}>
              <div className="flex items-start gap-5">
                <ScoreRing score={score} style={ss}/>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[14px] font-bold ${risk.text}`}>{risk.label}</span>
                      <span className="bg-white/5 border border-white/10 text-slate-400 font-mono text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">{ss.label}</span>
                    </div>
                    <div className="text-[12px] text-slate-500 font-medium">
                      <span className="text-slate-300">{result.violations.length}</span> flagged · <span className="text-slate-300">{result.passed_rules_count}</span> passed
                    </div>
                  </div>
                  <p className="text-[13.5px] text-slate-300 leading-relaxed mb-3">{result.summary}</p>
                  <div className="flex gap-2">
                    {(["high","medium","low"] as const).map(s=>{const c=result.violations.filter(v=>v.severity===s).length;if(!c)return null;return<span key={s} className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${SEV[s].badge}`}>{c} {s}</span>;})}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 text-center font-mono">Analysis is informational only — not legal advice. Not affiliated with LinkedIn.</p>

            {result.violations.length===0&&(
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <Tick cls="text-[#34D399] w-6 h-6"/>
                </div>
                <h3 className="text-white font-bold text-[16px] mb-1">No patterns flagged</h3>
                <p className="text-slate-400 text-[14px]">This message looks clean across all 30+ checks. Score: {score}/100.</p>
              </div>
            )}

            {result.violations.map((v,i)=>{const s=SEV[v.severity];return(
              <div key={i} className={`rounded-2xl border ${s.border} ${s.bg} p-6 hover:bg-white/[0.04] transition-colors duration-300`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2 h-2 rounded-full mt-1 ${s.dot} shadow-[0_0_6px_currentColor]`}/>
                    <span className="text-[14px] font-bold text-white">{v.rule_name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${s.badge}`}>{s.label}</span>
                    <span className="text-[10px] text-slate-500 font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5">{v.rule_id}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                    <span className="block font-mono text-[9px] text-slate-500 tracking-widest uppercase mb-1">Pattern</span>
                    <span className="text-slate-300 italic text-[13px] leading-relaxed">&ldquo;{v.triggered_text}&rdquo;</span>
                  </div>
                  <div>
                    <span className="block font-mono text-[9px] text-slate-500 tracking-widest uppercase mb-1">Why it matters</span>
                    <span className="text-slate-400 text-[13.5px] leading-relaxed">{v.explanation}</span>
                  </div>
                  <div className="bg-[#7C3AED]/10 rounded-xl px-4 py-3 border border-[#7C3AED]/20">
                    <span className="block font-mono text-[9px] text-[#A78BFA] tracking-widest uppercase mb-1">Suggestion</span>
                    <span className="text-[#E2E8F0] text-[13.5px] font-medium leading-relaxed">{v.fix}</span>
                  </div>
                </div>
              </div>
            );})}

            <div className="text-center pt-4">
              <button onClick={()=>{setResult(null);window.scrollTo({top:0,behavior:"smooth"});}}
                className="text-[13px] text-[#A78BFA] hover:text-white font-semibold transition-colors flex items-center gap-2 mx-auto">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                Edit and re-analyze
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── How it works ── */}
      <section className="py-24 border-t border-white/[0.05]">
        <div className="max-w-[960px] mx-auto px-6">
          <div className="font-mono text-[11px] text-[#7C3AED] tracking-[0.2em] text-center mb-4 font-bold uppercase">How it works</div>
          <h2 className="text-3xl font-extrabold text-white text-center tracking-tight mb-14">Three steps to <span className="text-[#7C3AED]">compliant outreach</span></h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { n: "1", t: "Paste your message", d: "Drop in any LinkedIn outreach — InMail, DM, or connection request. No account needed." },
              { n: "2", t: "Run the analysis", d: "AI checks 30+ compliance patterns across LinkedIn ToS, CAN-SPAM, GDPR, and spam signals." },
              { n: "3", t: "Apply suggestions", d: "Fix flagged patterns, re-analyze until clean, then send confidently. Most fixes take under 5 minutes." }
            ].map(s=>(
              <div key={s.n} className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-8 hover:border-[#7C3AED]/30 hover:bg-white/[0.04] transition-all group">
                <div className="w-9 h-9 rounded-xl bg-[#7C3AED]/15 border border-[#7C3AED]/30 flex items-center justify-center font-mono text-[14px] font-bold text-[#A78BFA] mb-5 group-hover:scale-110 transition-transform">
                  {s.n}
                </div>
                <h3 className="text-[17px] font-bold text-white mb-2.5">{s.t}</h3>
                <p className="text-[14px] text-slate-500 leading-relaxed font-medium">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 border-t border-white/[0.05]">
        <div className="max-w-[960px] mx-auto px-6">
          <div className="font-mono text-[11px] text-[#7C3AED] tracking-[0.2em] text-center mb-4 font-bold uppercase">Pricing</div>
          <h2 className="text-3xl font-extrabold text-white text-center tracking-tight mb-12">Start free. <span className="text-[#7C3AED]">Upgrade when ready.</span></h2>

          {coErr&&(
            <div className="max-w-[640px] mx-auto mb-8 text-[13px] text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 flex justify-between items-center">
              <span><strong>Checkout error:</strong> {coErr}</span>
              <button onClick={()=>setCoErr("")} className="text-rose-400 hover:text-white">✕</button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "FREE",
                price: "0",
                period: "forever · no credit card",
                tier: "pt-free",
                cta: "Start free",
                ctaClass: "cta-free bg-white/[0.04] border border-white/[0.07] text-slate-400",
                features: [
                  ["✓", "5 analyses per day", true],
                  ["✓", "30+ compliance patterns", false],
                  ["✓", "Compliance score 0–100", false],
                  ["✓", "Improvement suggestions", false],
                  ["✗", "Chrome extension", false, true],
                  ["✗", "CAN-SPAM deep scan", false, true],
                  ["✗", "GDPR deep scan", false, true],
                  ["✗", "Message history", false, true],
                ]
              },
              {
                name: "STARTER",
                price: "19",
                period: "per month",
                tier: "pt-starter",
                cta: "Get Starter",
                ctaClass: "cta-starter bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] text-white shadow-[0_6px_20px_rgba(124,58,237,0.3)]",
                featured: true,
                features: [
                  ["✓", "200 analyses per month", true],
                  ["✓", "Chrome extension (soon)", true],
                  ["✓", "CAN-SPAM deep scan", true],
                  ["✓", "GDPR Article 6 scan", true],
                  ["✓", "Message history", true],
                  ["✓", "All 30+ patterns", false],
                  ["✗", "Team seats", false, true],
                  ["✗", "API access", false, true],
                ]
              },
              {
                name: "PRO",
                price: "49",
                period: "per month",
                tier: "pt-pro",
                cta: "Get Pro",
                ctaClass: "cta-pro bg-[#60A5FA]/10 border border-[#60A5FA]/20 text-[#60A5FA]",
                features: [
                  ["✓", "Unlimited analyses", true],
                  ["✓", "Everything in Starter", true],
                  ["✓", "3 team seats (+$12/ea)", true],
                  ["✓", "API access", true],
                  ["✓", "Bulk template scanner", true],
                  ["✓", "Priority support", false],
                  ["✓", "Annual billing (2mo free)", false],
                ]
              }
            ].map(p=>(
              <div key={p.name} className={`relative flex flex-col bg-white/[0.02] border rounded-2xl p-8 hover:border-[#7C3AED]/30 transition-all ${p.featured?"border-[#7C3AED]/40 bg-[#7C3AED]/[0.05]":"border-white/[0.07]"}`}>
                {p.featured&&(
                  <>
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7C3AED] to-[#60A5FA]"></div>
                    <div className="absolute top-4 right-4 bg-gradient-to-br from-[#7C3AED] to-[#60A5FA] text-white font-mono text-[9px] font-bold px-2 py-1 rounded-[3px] tracking-wider uppercase">Most Popular</div>
                  </>
                )}
                <div className={`font-mono text-[11px] tracking-widest font-bold mb-4 ${p.tier==="pt-free"?"text-slate-600":p.tier==="pt-starter"?"text-[#7C3AED]":"text-[#60A5FA]"}`}>{p.name}</div>
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white tracking-tighter"><sup>$</sup>{p.price}</span>
                  </div>
                  <div className="font-mono text-[11px] text-slate-500 mt-2">{p.period}</div>
                </div>
                <div className="w-full h-px bg-white/[0.07] mb-6"></div>
                <div className="flex-1 space-y-3.5 mb-8">
                  {p.features.map((f,idx)=>(
                    <div key={idx} className="flex items-start gap-3">
                      <span className={`text-[13px] flex-shrink-0 ${f[0]==="✓"?"text-[#34D399]":"text-slate-800"}`}>{f[0]}</span>
                      <span className={`text-[13px] ${f[3]?"text-slate-700":f[2]?"text-slate-300 font-bold":"text-slate-400"}`}>{f[1]}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={()=>p.price!=="0" && handleSubscribe(p.name, p.name.toLowerCase() as "starter"|"pro")}
                  className={`w-full py-3 rounded-xl font-mono text-[13px] font-bold transition-all duration-200 hover:-translate-y-px active:translate-y-0 ${p.ctaClass}`}
                >
                  {coLoading===p.name ? "Redirecting..." : p.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 border-t border-white/[0.05] text-center">
        <div className="max-w-[960px] mx-auto px-6">
          <div className="text-[17px] font-extrabold text-white tracking-tight mb-5">Outreach<span className="text-[#7C3AED]">Safe</span></div>
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <Link href="/support" className="text-[12px] text-slate-500 hover:text-white transition-colors">Support</Link>
            <Link href="/privacy" className="text-[12px] text-slate-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-[12px] text-slate-500 hover:text-white transition-colors">Terms of Service</Link>
          </div>
          <p className="font-mono text-[11px] text-slate-700 leading-relaxed max-w-lg mx-auto">
            © 2026 Cyber Global Technologies LLC · Informational only · Not legal advice · Not affiliated with LinkedIn
          </p>
        </div>
      </footer>

      {/* Bottom Accent */}
      <div className="fixed bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#7C3AED] via-[#60A5FA] to-transparent z-[100]"></div>
    </main>
  );
}

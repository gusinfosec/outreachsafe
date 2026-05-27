"use client";

import { useEffect, useState } from "react";
import { useUser, useAuth, SignIn } from "@clerk/nextjs";

const EXTENSION_ID = process.env.NEXT_PUBLIC_EXTENSION_ID;

type Status = "idle" | "sending" | "success" | "no_extension" | "error";

export default function ExtensionAuthPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { getToken } = useAuth();
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    async function sendToken() {
      setStatus("sending");
      try {
        const token = await getToken();
        if (!token) { setStatus("error"); return; }

        const email = user?.primaryEmailAddress?.emailAddress ?? "";
        const plan  = (user?.publicMetadata?.plan as string) ?? "free";

        const chrome = (window as Window & { chrome?: { runtime?: { sendMessage: (...a: unknown[]) => void; lastError?: { message?: string } } } }).chrome;
        if (!chrome?.runtime?.sendMessage) {
          setStatus("no_extension");
          return;
        }

        chrome.runtime.sendMessage(
          EXTENSION_ID,
          { type: "AUTH_TOKEN", token, email, plan },
          () => {
            if (chrome.runtime?.lastError) {
              console.error("[OutreachSafe] Extension message error:", chrome.runtime.lastError.message);
              setStatus("no_extension");
            } else {
              setStatus("success");
            }
          }
        );
      } catch (err) {
        console.error("[OutreachSafe] Token fetch error:", err);
        setStatus("error");
      }
    }

    sendToken();
  }, [isLoaded, isSignedIn, getToken, user]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0F1221] flex items-center justify-center">
        <div className="animate-spin w-6 h-6 border-2 border-white/20 border-t-[#7C3AED] rounded-full" />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-[#0F1221] flex flex-col items-center justify-center px-4">
        <div className="mb-8 text-center">
          <div className="text-[22px] font-extrabold text-white tracking-tight mb-2">
            Outreach<span className="text-[#7C3AED]">Safe</span>
          </div>
          <p className="text-sm text-slate-400">Sign in to connect your account to the Chrome extension.</p>
        </div>
        <SignIn forceRedirectUrl="/extension-auth" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1221] flex items-center justify-center px-4">
      <div className="max-w-sm w-full bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8 text-center">
        <div className="text-[20px] font-extrabold text-white tracking-tight mb-6">
          Outreach<span className="text-[#7C3AED]">Safe</span>
        </div>

        {(status === "idle" || status === "sending") && (
          <>
            <div className="animate-spin w-8 h-8 border-2 border-white/10 border-t-[#7C3AED] rounded-full mx-auto mb-4" />
            <p className="text-sm text-slate-400">Connecting to extension…</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <p className="text-white font-semibold mb-1">You&rsquo;re connected!</p>
            <p className="text-sm text-slate-400 mb-6">Your OutreachSafe account is now linked to the extension. You can close this tab.</p>
            <button
              onClick={() => window.close()}
              className="w-full py-2.5 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] text-white font-semibold text-sm"
            >
              Close tab
            </button>
          </>
        )}

        {status === "no_extension" && (
          <>
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <p className="text-white font-semibold mb-1">Extension not detected</p>
            <p className="text-sm text-slate-400 mb-6">
              Make sure the OutreachSafe Chrome extension is installed and enabled, then try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-slate-300 font-semibold text-sm"
            >
              Try again
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </div>
            <p className="text-white font-semibold mb-1">Something went wrong</p>
            <p className="text-sm text-slate-400 mb-6">Could not retrieve your session. Please try signing in again.</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-slate-300 font-semibold text-sm"
            >
              Retry
            </button>
          </>
        )}
      </div>
    </div>
  );
}

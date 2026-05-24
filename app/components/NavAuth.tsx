"use client";

import { SignInButton, SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";

export default function NavAuth({ 
  showPlan = false, 
  btnClass = "text-[13px] font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] px-4 py-1.5 rounded-lg transition-colors" 
}: { 
  showPlan?: boolean; 
  btnClass?: string;
}) {
  const { user } = useUser();
  
  return (
    <>
      <SignedOut>
        <SignInButton mode="modal">
          <button className={btnClass}>
            Sign In
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <div className="flex items-center gap-3">
          {showPlan && (
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
              user?.publicMetadata?.plan === "pro" ? "border-blue-500/30 text-blue-400 bg-blue-500/10" :
              user?.publicMetadata?.plan === "starter" ? "border-[#7C3AED]/30 text-[#A78BFA] bg-[#7C3AED]/10" :
              "border-slate-500/30 text-slate-400 bg-slate-500/10"
            }`}>
              {((user?.publicMetadata?.plan as string) || "FREE").toUpperCase()}
            </span>
          )}
          <UserButton />
        </div>
      </SignedIn>
    </>
  );
}

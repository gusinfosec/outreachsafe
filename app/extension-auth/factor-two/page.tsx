"use client";

import { SignIn } from "@clerk/nextjs";

export default function FactorTwoPage() {
  return (
    <div className="min-h-screen bg-[#0F1221] flex flex-col items-center justify-center px-4">
      <SignIn routing="path" path="/extension-auth" forceRedirectUrl="/extension-auth" />
    </div>
  );
}

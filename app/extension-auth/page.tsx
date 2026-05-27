"use client";
import { SignIn, useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

export default function ExtensionAuth() {
  const { isSignedIn, getToken } = useAuth();

  useEffect(() => {
    if (!isSignedIn) return;
    (async () => {
      try {
        const token = await getToken();
        const EXTENSION_ID = process.env.NEXT_PUBLIC_EXTENSION_ID;
        if (token && EXTENSION_ID && (window as any).chrome?.runtime) {
          (window as any).chrome.runtime.sendMessage(
            EXTENSION_ID,
            { type: "AUTH_TOKEN", token }
          );
        }
      } catch (e) {
        console.error("Extension auth error:", e);
      }
    })();
  }, [isSignedIn]);

  if (isSignedIn) {
    return (
      <div style={{display:"flex",alignItems:"center",
        justifyContent:"center",minHeight:"100vh",
        background:"#0a0d1a",color:"#fff",
        fontFamily:"sans-serif",flexDirection:"column",gap:"12px"}}>
        <div style={{fontSize:"32px"}}>✓</div>
        <div style={{fontSize:"18px",fontWeight:"700"}}>
          Connected to OutreachSafe
        </div>
        <div style={{color:"#888",fontSize:"14px"}}>
          You can close this tab and return to the extension.
        </div>
      </div>
    );
  }

  return (
    <div style={{display:"flex",alignItems:"center",
      justifyContent:"center",minHeight:"100vh",
      background:"#0a0d1a",flexDirection:"column",gap:"16px"}}>
      <div style={{color:"#fff",fontSize:"18px",
        fontWeight:"700",marginBottom:"8px"}}>
        OutreachSafe
      </div>
      <SignIn afterSignInUrl="/extension-auth" />
    </div>
  );
}

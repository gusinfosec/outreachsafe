"use client";
import { SignIn, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

type Status = "connecting" | "connected" | "failed";

const DELAY = (ms: number) => new Promise(r => setTimeout(r, ms));

async function trySendMessage(id: string, token: string): Promise<boolean> {
  return new Promise(resolve => {
    try {
      (window as any).chrome.runtime.sendMessage(
        id,
        { type: "AUTH_TOKEN", token },
        () => {
          const err = (window as any).chrome.runtime.lastError;
          resolve(!err);
        }
      );
    } catch {
      resolve(false);
    }
  });
}

export default function ExtensionAuth() {
  const { isSignedIn, getToken } = useAuth();
  const [status, setStatus] = useState<Status>("connecting");

  useEffect(() => {
    if (!isSignedIn) return;

    (async () => {
      setStatus("connecting");

      // Wait for page to stabilise before attempting sendMessage
      await DELAY(500);

      let token: string | null = null;
      try {
        token = await getToken();
      } catch (e) {
        console.error("Extension auth: getToken failed", e);
        setStatus("failed");
        return;
      }

      if (!token || !(window as any).chrome?.runtime) {
        setStatus("failed");
        return;
      }

      const EXTENSION_IDS = [
        process.env.NEXT_PUBLIC_EXTENSION_ID,
        process.env.NEXT_PUBLIC_EXTENSION_DEV_ID,
      ].filter(Boolean) as string[];

      const MAX_ATTEMPTS = 3;
      let succeeded = false;

      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        for (const id of EXTENSION_IDS) {
          const ok = await trySendMessage(id, token);
          if (ok) { succeeded = true; break; }
        }
        if (succeeded) break;
        if (attempt < MAX_ATTEMPTS) await DELAY(1000);
      }

      setStatus(succeeded ? "connected" : "failed");
    })();
  }, [isSignedIn, getToken]);

  if (isSignedIn) {
    return (
      <div style={{display:"flex",alignItems:"center",
        justifyContent:"center",minHeight:"100vh",
        background:"#0a0d1a",color:"#fff",
        fontFamily:"sans-serif",flexDirection:"column",gap:"12px"}}>

        {status === "connecting" && (
          <>
            <div style={{width:"32px",height:"32px",border:"3px solid #333",
              borderTop:"3px solid #7c3aed",borderRadius:"50%",
              animation:"spin 0.8s linear infinite"}} />
            <div style={{fontSize:"16px",fontWeight:"600"}}>Connecting…</div>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </>
        )}

        {status === "connected" && (
          <>
            <div style={{fontSize:"32px"}}>✓</div>
            <div style={{fontSize:"18px",fontWeight:"700"}}>
              Connected to OutreachSafe
            </div>
            <div style={{color:"#888",fontSize:"14px"}}>
              You can close this tab and return to the extension.
            </div>
          </>
        )}

        {status === "failed" && (
          <>
            <div style={{fontSize:"32px"}}>⚠</div>
            <div style={{fontSize:"18px",fontWeight:"700",color:"#f87171"}}>
              Connection failed
            </div>
            <div style={{color:"#888",fontSize:"14px",textAlign:"center",maxWidth:"280px"}}>
              Please close this tab and try signing in from the extension again.
            </div>
          </>
        )}
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
      <SignIn forceRedirectUrl="/extension-auth" />
    </div>
  );
}

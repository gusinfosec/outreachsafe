"use client";
import { SignIn, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

console.log("[OutreachSafe] extension-auth module loaded");

type Status = "idle" | "connecting" | "connected" | "failed";

const DELAY = (ms: number) => new Promise(r => setTimeout(r, ms));

async function trySendMessage(id: string, token: string): Promise<boolean> {
  return new Promise(resolve => {
    console.log("[OutreachSafe] trySendMessage → ID:", id);
    console.log("[OutreachSafe] chrome.runtime present:", !!(window as any).chrome?.runtime);
    try {
      (window as any).chrome.runtime.sendMessage(
        id,
        { type: "AUTH_TOKEN", token },
        (response: unknown) => {
          const err = (window as any).chrome?.runtime?.lastError;
          if (err) {
            console.error("[OutreachSafe] sendMessage error for", id, ":", err.message);
            resolve(false);
          } else {
            console.log("[OutreachSafe] sendMessage success for", id, "response:", response);
            resolve(true);
          }
        }
      );
    } catch (e) {
      console.error("[OutreachSafe] sendMessage threw for", id, ":", e);
      resolve(false);
    }
  });
}

export default function ExtensionAuth() {
  const { isSignedIn, getToken } = useAuth();
  const [status, setStatus] = useState<Status>("idle");

  console.log("[OutreachSafe] render — isSignedIn:", isSignedIn, "status:", status);

  useEffect(() => {
    console.log("[OutreachSafe] useEffect fired — isSignedIn:", isSignedIn);
    if (!isSignedIn) return;

    (async () => {
      setStatus("connecting");
      console.log("[OutreachSafe] starting token send flow");

      await DELAY(500);

      let token: string | null = null;
      try {
        token = await getToken();
        console.log("[OutreachSafe] getToken result:", token ? "got token" : "null");
      } catch (e) {
        console.error("[OutreachSafe] getToken threw:", e);
        setStatus("failed");
        return;
      }

      if (!token) {
        console.error("[OutreachSafe] token is null after getToken");
        setStatus("failed");
        return;
      }

      if (!(window as any).chrome?.runtime) {
        console.error("[OutreachSafe] window.chrome.runtime not available");
        setStatus("failed");
        return;
      }

      const EXTENSION_IDS = [
        process.env.NEXT_PUBLIC_EXTENSION_ID,
      ].filter(Boolean) as string[];
      console.log("[OutreachSafe] IDs to try:", EXTENSION_IDS);

      let succeeded = false;
      for (let attempt = 1; attempt <= 3; attempt++) {
        console.log("[OutreachSafe] attempt", attempt, "of 3");
        for (const id of EXTENSION_IDS) {
          const ok = await trySendMessage(id, token);
          if (ok) { succeeded = true; break; }
        }
        if (succeeded) break;
        if (attempt < 3) {
          console.log("[OutreachSafe] retrying in 1s…");
          await DELAY(1000);
        }
      }

      console.log("[OutreachSafe] final result:", succeeded ? "succeeded" : "failed");
      setStatus(succeeded ? "connected" : "failed");
    })();
  }, [isSignedIn, getToken]);

  if (isSignedIn) {
    return (
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",
        minHeight:"100vh",background:"#0a0d1a",color:"#fff",
        fontFamily:"sans-serif",flexDirection:"column",gap:"12px"}}>

        <div style={{position:"fixed",top:0,left:0,right:0,background:"#1a1a2e",
          padding:"8px 16px",fontSize:"11px",color:"#888",fontFamily:"monospace"}}>
          isSignedIn: {String(isSignedIn)} · status: {status}
        </div>

        {(status === "idle" || status === "connecting") && (
          <>
            <div style={{width:"32px",height:"32px",border:"3px solid #333",
              borderTop:"3px solid #7c3aed",borderRadius:"50%",
              animation:"spin 0.8s linear infinite"}} />
            <div style={{fontSize:"16px",fontWeight:"600"}}>
              {status === "idle" ? "Waiting…" : "Connecting…"}
            </div>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </>
        )}

        {status === "connected" && (
          <>
            <div style={{fontSize:"32px"}}>✓</div>
            <div style={{fontSize:"18px",fontWeight:"700"}}>Connected to OutreachSafe</div>
            <div style={{color:"#888",fontSize:"14px"}}>
              You can close this tab and return to the extension.
            </div>
          </>
        )}

        {status === "failed" && (
          <>
            <div style={{fontSize:"32px"}}>⚠</div>
            <div style={{fontSize:"18px",fontWeight:"700",color:"#f87171"}}>Connection failed</div>
            <div style={{color:"#888",fontSize:"14px",textAlign:"center",maxWidth:"280px"}}>
              Check the browser console for details. Close this tab and try again.
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",
      minHeight:"100vh",background:"#0a0d1a",flexDirection:"column",gap:"16px"}}>
      <div style={{color:"#fff",fontSize:"18px",fontWeight:"700",marginBottom:"8px"}}>
        OutreachSafe
      </div>
      <SignIn forceRedirectUrl="/extension-auth" />
    </div>
  );
}

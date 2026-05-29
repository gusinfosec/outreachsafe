"use client";
import { SignIn, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

type Status = "idle" | "connecting" | "connected" | "failed";

export default function ExtensionAuth() {
  const { isSignedIn, getToken } = useAuth();
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    if (!isSignedIn) return;

    (async () => {
      setStatus("connecting");

      let token: string | null = null;
      try {
        token = await getToken();
      } catch {
        setStatus("failed");
        return;
      }

      if (!token) {
        setStatus("failed");
        return;
      }

      // SameSite=None;Secure required so the chrome-extension fetch can send this cookie
      document.cookie = `os_ext_token=${token}; domain=outreachsafe.com; path=/; max-age=300; SameSite=None; Secure`;
      setStatus("connected");
    })();
  }, [isSignedIn, getToken]);

  if (isSignedIn) {
    return (
      <div style={{display:"flex",alignItems:"center",justifyContent:"center",
        minHeight:"100vh",background:"#0a0d1a",color:"#fff",
        fontFamily:"sans-serif",flexDirection:"column",gap:"12px"}}>

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

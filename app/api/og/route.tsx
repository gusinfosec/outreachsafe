// app/app/api/og/route.tsx
// Generates og:image dynamically using @vercel/og
// Install: npm install @vercel/og
// Then reference /api/og in layout.tsx instead of /og-image.png

import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          padding: "60px",
        }}
      >
        {/* Shield icon area */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
          <div
            style={{
              width: "64px", height: "64px",
              background: "rgba(255,255,255,0.15)",
              borderRadius: "16px",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "2px solid rgba(255,255,255,0.3)",
            }}
          >
            <span style={{ fontSize: "32px" }}>🛡</span>
          </div>
          <span style={{ fontSize: "36px", fontWeight: "700", color: "white", letterSpacing: "-1px" }}>
            OutreachSafe
          </span>
          <div
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "20px",
              padding: "4px 14px",
              fontSize: "16px",
              color: "rgba(255,255,255,0.9)",
              fontWeight: "600",
            }}
          >
            Beta
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "52px",
            fontWeight: "700",
            color: "white",
            textAlign: "center",
            lineHeight: "1.15",
            letterSpacing: "-1.5px",
            marginBottom: "20px",
            maxWidth: "900px",
          }}
        >
          Is your LinkedIn message safe to send?
        </div>

        {/* Subheadline */}
        <div
          style={{
            fontSize: "24px",
            color: "rgba(255,255,255,0.75)",
            textAlign: "center",
            maxWidth: "700px",
            lineHeight: "1.4",
            marginBottom: "40px",
          }}
        >
          Compliance score · Flagged patterns · Fix suggestions
        </div>

        {/* Trust pills */}
        <div style={{ display: "flex", gap: "12px" }}>
          {["LinkedIn TOS", "CAN-SPAM", "GDPR Article 6", "Free to start"].map((t) => (
            <div
              key={t}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
                borderRadius: "30px",
                padding: "8px 20px",
                fontSize: "18px",
                color: "white",
                fontWeight: "500",
              }}
            >
              {t}
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            right: "48px",
            fontSize: "18px",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          outreachsafe.com
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

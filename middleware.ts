import { NextRequest, NextResponse } from "next/server";

// In-memory rate limiter — works for MVP on Vercel serverless
// Each function instance has its own Map, but 5 checks/day per IP is generous enough
// Replace with Vercel KV when you have >100 daily users

const rateMap = new Map<string, { count: number; reset: number }>();
const LIMIT   = 5;
const WINDOW  = 24 * 60 * 60 * 1000; // 24 hours in ms

export function middleware(req: NextRequest) {
  // Only rate-limit the AI check endpoint
  if (!req.nextUrl.pathname.startsWith("/api/check")) {
    return NextResponse.next();
  }

  const ip  = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const rec = rateMap.get(ip);

  // New IP or window expired — reset counter
  if (!rec || now > rec.reset) {
    rateMap.set(ip, { count: 1, reset: now + WINDOW });
    return NextResponse.next();
  }

  // Over limit
  if (rec.count >= LIMIT) {
    return NextResponse.json(
      {
        error: "You've used your 5 free checks for today. Upgrade to Starter for 200 checks/month.",
        upgrade_url: "/#pricing",
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit":     String(LIMIT),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset":     String(rec.reset),
          "Retry-After":           String(Math.ceil((rec.reset - now) / 1000)),
        },
      }
    );
  }

  // Increment and continue
  rec.count++;
  const res = NextResponse.next();
  res.headers.set("X-RateLimit-Limit",     String(LIMIT));
  res.headers.set("X-RateLimit-Remaining", String(LIMIT - rec.count));
  return res;
}

export const config = {
  matcher: "/api/check",
};

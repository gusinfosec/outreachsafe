// app/app/api/check/route.ts
// Rate limiter moved inline — works on Render (no Edge middleware needed)

import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

// ── CORS headers — allows Chrome extension to call this API ──────────────
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Handle preflight OPTIONS request
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

// ── Rate limiter ──────────────────────────────────────────────────────────
const rateMap = new Map<string, { count: number; reset: number }>();
const LIMIT   = 5;
const WINDOW  = 24 * 60 * 60 * 1000;
const STARTER_LIMIT = 200;

type Plan = "free" | "starter" | "pro";
type UsageUpdate = {
  userId: string;
  privateMetadata: Record<string, unknown>;
  fields: Record<string, string | number>;
};

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const rec = rateMap.get(ip);
  if (Math.random() < 0.01) {
    for (const [key, val] of rateMap.entries()) {
      if (now > val.reset) rateMap.delete(key);
    }
  }
  if (!rec || now > rec.reset) {
    rateMap.set(ip, { count: 1, reset: now + WINDOW });
    return true;
  }
  if (rec.count >= LIMIT) return false;
  rec.count++;
  return true;
}

function currentDateKey() {
  return new Date().toISOString().slice(0, 10);
}

function currentMonthKey() {
  return new Date().toISOString().slice(0, 7);
}

function getPlan(plan: unknown): Plan {
  return plan === "starter" || plan === "pro" ? plan : "free";
}

function quotaExceededResponse(message: string) {
  return NextResponse.json(
    { error: message, upgrade_url: "/#pricing" },
    { status: 429, headers: CORS_HEADERS }
  );
}

function getUsageCount(value: unknown) {
  return typeof value === "number" ? value : 0;
}

async function getUsageUpdate(userId: string): Promise<UsageUpdate | null | NextResponse> {
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);
  const plan = getPlan(user.publicMetadata.plan);

  if (plan === "pro") return null;

  const privateMetadata = user.privateMetadata;

  if (plan === "starter") {
    const usageMonth = currentMonthKey();
    const count = privateMetadata.usage_month === usageMonth
      ? getUsageCount(privateMetadata.usage_count)
      : 0;

    if (count >= STARTER_LIMIT) {
      return quotaExceededResponse("Monthly limit reached. Upgrade to Pro for unlimited checks.");
    }

    return {
      userId,
      privateMetadata,
      fields: { usage_month: usageMonth, usage_count: count + 1 },
    };
  }

  const usageDate = currentDateKey();
  const count = privateMetadata.usage_date === usageDate
    ? getUsageCount(privateMetadata.usage_count)
    : 0;

  if (count >= LIMIT) {
    return quotaExceededResponse("Daily limit reached. Upgrade to Starter for 200 checks/month.");
  }

  return {
    userId,
    privateMetadata,
    fields: { usage_date: usageDate, usage_count: count + 1 },
  };
}

async function incrementUsage(update: UsageUpdate | null) {
  if (!update) return;
  const clerk = await clerkClient();
  await clerk.users.updateUserMetadata(update.userId, {
    privateMetadata: {
      ...update.privateMetadata,
      ...update.fields,
    },
  });
}

// ── Anthropic client ──────────────────────────────────────────────────────
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Load system prompt ────────────────────────────────────────────────────
function loadSystemPrompt(): string {
  const candidates = [
    path.join(process.cwd(), "..", "prompts", "system_prompt.txt"),
    path.join(process.cwd(), "prompts", "system_prompt.txt"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return fs.readFileSync(p, "utf-8");
  }
  throw new Error(`system_prompt.txt not found. Tried: ${candidates.join(", ")}`);
}

function extractJson(raw: string): string {
  const trimmed = raw.trim();
  const match   = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) return match[1].trim();
  return trimmed;
}

// ── POST handler ──────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { message, euRecipient, automationTool, outreachType } = await req.json();

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const { userId } = await auth();
    let usageUpdate: UsageUpdate | null = null;

    if (userId) {
      const update = await getUsageUpdate(userId);
      if (update instanceof NextResponse) return update;
      usageUpdate = update;
    } else {
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
      if (!checkRateLimit(ip)) {
        return quotaExceededResponse("Daily limit reached. Upgrade to Starter for 200 checks/month.");
      }
    }

    const systemPrompt = loadSystemPrompt();

    const userMessage = `MESSAGE:
${message}

CONTEXT:
- EU recipient: ${euRecipient || "unknown"}
- Using automation tool: ${automationTool || "unknown"}
- Outreach type: ${outreachType || "cold"}`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 2500,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const raw   = (response.content[0] as { text: string }).text;
    const clean = extractJson(raw);

    let result;
    try {
      result = JSON.parse(clean);
    } catch {
      const match = clean.match(/\{[\s\S]*\}/);
      if (match) result = JSON.parse(match[0]);
      else throw new Error("Could not parse Claude response as JSON");
    }

    await incrementUsage(usageUpdate);

    return NextResponse.json(result, { headers: CORS_HEADERS });

  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to check message. Please try again." },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

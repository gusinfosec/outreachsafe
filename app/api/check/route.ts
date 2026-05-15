// app/app/api/check/route.ts
// Rate limiter moved inline — works on Render (no Edge middleware needed)

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

// ── Rate limiter ──────────────────────────────────────────────────────────────
const rateMap = new Map<string, { count: number; reset: number }>();
const LIMIT   = 5;
const WINDOW  = 24 * 60 * 60 * 1000; // 24 hours

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const rec = rateMap.get(ip);

  // Clean up expired entries occasionally to prevent memory growth
  if (Math.random() < 0.01) {
    for (const [key, val] of rateMap.entries()) {
      if (now > val.reset) rateMap.delete(key);
    }
  }

  if (!rec || now > rec.reset) {
    rateMap.set(ip, { count: 1, reset: now + WINDOW });
    return true; // allowed
  }
  if (rec.count >= LIMIT) {
    return false; // blocked
  }
  rec.count++;
  return true; // allowed
}

// ── Anthropic client ──────────────────────────────────────────────────────────
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Load system prompt ────────────────────────────────────────────────────────
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

// ── Strip markdown fences if Claude wraps response ───────────────────────────
function extractJson(raw: string): string {
  const trimmed = raw.trim();
  const match   = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) return match[1].trim();
  return trimmed;
}

// ── POST handler ──────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      {
        error: "You've used your 5 free checks for today. Upgrade to Starter for 200 checks/month.",
        upgrade_url: "/#pricing",
      },
      { status: 429 }
    );
  }

  try {
    const { message, euRecipient, automationTool, outreachType } = await req.json();

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
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

    return NextResponse.json(result);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to check message. Please try again." },
      { status: 500 }
    );
  }
}

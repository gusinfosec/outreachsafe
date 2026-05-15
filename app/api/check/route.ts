import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

function loadSystemPrompt(): string {
  // Try relative to cwd first, then fallback to absolute from project root
  const candidates = [
    path.join(process.cwd(), "..", "prompts", "system_prompt.txt"),
    path.join(process.cwd(), "prompts", "system_prompt.txt"),
    path.join(__dirname, "..", "..", "..", "..", "prompts", "system_prompt.txt"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return fs.readFileSync(p, "utf-8");
  }
  throw new Error(`system_prompt.txt not found. Tried: ${candidates.join(", ")}`);
}

function extractJson(raw: string): string {
  const trimmed = raw.trim();
  const match = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (match) return match[1].trim();
  return trimmed;
}

export async function POST(req: NextRequest) {
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

    const raw = (response.content[0] as { text: string }).text;
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

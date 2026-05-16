// app/app/api/checkout/route.ts

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {

  // ── Step 1: Log all relevant env vars (masked) ──────────────────────────
  const secretKey  = process.env.STRIPE_SECRET_KEY;
  const starterID  = process.env.STRIPE_STARTER_PRICE_ID;
  const proID      = process.env.STRIPE_PRO_PRICE_ID;
  const appURL     = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  console.log("[Checkout] ENV CHECK:");
  console.log("  STRIPE_SECRET_KEY    :", secretKey  ? `${secretKey.slice(0,10)}...` : "MISSING");
  console.log("  STRIPE_STARTER_PRICE_ID:", starterID || "MISSING");
  console.log("  STRIPE_PRO_PRICE_ID  :", proID      || "MISSING");
  console.log("  NEXT_PUBLIC_APP_URL  :", appURL);

  // ── Step 2: Validate secret key ──────────────────────────────────────────
  if (!secretKey) {
    console.error("[Checkout] STRIPE_SECRET_KEY is missing");
    return NextResponse.json(
      { error: "Payment configuration error — contact support. (code: no-key)" },
      { status: 500 }
    );
  }

  if (!secretKey.startsWith("sk_live_") && !secretKey.startsWith("sk_test_")) {
    console.error("[Checkout] STRIPE_SECRET_KEY has invalid format:", secretKey.slice(0,15));
    return NextResponse.json(
      { error: "Payment configuration error — contact support. (code: bad-key)" },
      { status: 500 }
    );
  }

  // ── Step 3: Parse request body ───────────────────────────────────────────
  let priceId: string | undefined;
  try {
    const body = await req.json();
    priceId = body.priceId;
    console.log("[Checkout] Received priceId:", priceId || "MISSING");
  } catch (e) {
    console.error("[Checkout] Failed to parse request body:", e);
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // ── Step 4: Validate price ID ────────────────────────────────────────────
  if (!priceId) {
    console.error("[Checkout] No priceId in request body");
    return NextResponse.json({ error: "No plan selected." }, { status: 400 });
  }

  if (!priceId.startsWith("price_")) {
    console.error("[Checkout] Invalid priceId format:", priceId);
    return NextResponse.json({ error: "Invalid plan ID." }, { status: 400 });
  }

  // ── Step 5: Validate price ID is known ──────────────────────────────────
  const knownPrices = [starterID, proID].filter(Boolean);
  if (knownPrices.length > 0 && !knownPrices.includes(priceId)) {
    console.error("[Checkout] priceId not in known set:", priceId, "known:", knownPrices);
    return NextResponse.json({ error: "Unrecognized plan." }, { status: 400 });
  }

  // ── Step 6: Initialize Stripe ────────────────────────────────────────────
  let stripe: Stripe;
  try {
    stripe = new Stripe(secretKey, { apiVersion: "2026-04-22.dahlia" });
    console.log("[Checkout] Stripe initialized successfully");
  } catch (e) {
    console.error("[Checkout] Failed to initialize Stripe:", e);
    return NextResponse.json(
      { error: "Payment system initialization failed." },
      { status: 500 }
    );
  }

  // ── Step 7: Create checkout session ─────────────────────────────────────
  try {
    const origin = appURL.replace(/\/$/, ""); // remove trailing slash

    console.log("[Checkout] Creating session with:");
    console.log("  priceId    :", priceId);
    console.log("  success_url:", `${origin}/success`);
    console.log("  cancel_url :", `${origin}/#pricing`);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${origin}/#pricing`,
      allow_promotion_codes: true,
    });

    console.log("[Checkout] Session created:", session.id);
    console.log("[Checkout] Session URL:", session.url);

    return NextResponse.json({ url: session.url });

  } catch (e: unknown) {
    // Log the exact Stripe error
    if (e instanceof Stripe.errors.StripeError) {
      console.error("[Checkout] Stripe error:");
      console.error("  type   :", e.type);
      console.error("  code   :", e.code);
      console.error("  message:", e.message);
      return NextResponse.json(
        { error: `Payment error: ${e.message}` },
        { status: 500 }
      );
    }
    console.error("[Checkout] Unknown error creating session:", e);
    return NextResponse.json(
      { error: "Could not create checkout session. Please try again." },
      { status: 500 }
    );
  }
}

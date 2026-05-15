import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// ── DO NOT initialize Stripe at module level ──────────────────────────────────
// Render reads env vars at runtime, not build time.
// Initializing here causes "Neither apiKey provided" during build.

const VALID_PRICES = () => new Set([
  process.env.STRIPE_STARTER_PRICE_ID,
  process.env.STRIPE_PRO_PRICE_ID,
]);

export async function POST(req: NextRequest) {
  // Initialize Stripe inside the handler — reads env at runtime, not build time
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-04-22.dahlia",
  });

  try {
    const { priceId } = await req.json();

    if (!priceId || !VALID_PRICES().has(priceId)) {
      return NextResponse.json({ error: "Invalid plan selected." }, { status: 400 });
    }

    const origin = process.env.NEXT_PUBLIC_APP_URL || "https://outreachsafe.com";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${origin}/#pricing`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      metadata: { source: "outreachsafe_web" },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Could not create checkout session. Please try again." },
      { status: 500 }
    );
  }
}

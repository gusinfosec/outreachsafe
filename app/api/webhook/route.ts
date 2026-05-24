import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import Stripe from "stripe";

export const runtime = "nodejs";

const FALLBACK_STARTER_PRICE_ID = "price_1TXWvuFnIuEgeFxO6nVnXJoB";
const FALLBACK_PRO_PRICE_ID = "price_1TXWuPFnIuEgeFxOesJVBAgJ";

type Plan = "free" | "starter" | "pro";

function stripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error("STRIPE_SECRET_KEY is not configured");
  return new Stripe(secretKey, { apiVersion: "2026-04-22.dahlia" });
}

function planFromPriceId(priceId?: string | null): Plan {
  if (!priceId) return "free";
  if (priceId === (process.env.STRIPE_PRO_PRICE_ID || FALLBACK_PRO_PRICE_ID)) return "pro";
  if (priceId === (process.env.STRIPE_STARTER_PRICE_ID || FALLBACK_STARTER_PRICE_ID)) return "starter";
  return "free";
}

function getCustomerId(customer: string | Stripe.Customer | Stripe.DeletedCustomer | null) {
  return typeof customer === "string" ? customer : customer?.id;
}

async function getPlanFromSubscription(stripe: Stripe, subscriptionId: string): Promise<Plan> {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = subscription.items.data[0]?.price.id;
  return planFromPriceId(priceId);
}

async function findUserIdByEmail(email?: string | null) {
  if (!email) return null;
  const clerk = await clerkClient();
  const users = await clerk.users.getUserList({ emailAddress: [email], limit: 1 });
  return users.data[0]?.id ?? null;
}

async function findUserIdByStripeCustomer(customerId?: string | null) {
  if (!customerId) return null;
  const clerk = await clerkClient();
  const users = await clerk.users.getUserList({
    query: customerId,
    limit: 10,
  });
  return users.data.find((user) => user.privateMetadata.stripe_customer_id === customerId)?.id ?? null;
}

async function updateUserPlan(userId: string, plan: Plan, stripeCustomerId?: string | null) {
  const clerk = await clerkClient();
  const user = await clerk.users.getUser(userId);

  await clerk.users.updateUserMetadata(userId, {
    publicMetadata: {
      ...user.publicMetadata,
      plan,
    },
    privateMetadata: {
      ...user.privateMetadata,
      ...(stripeCustomerId ? { stripe_customer_id: stripeCustomerId } : {}),
    },
  });
}

async function handleCheckoutCompleted(stripe: Stripe, session: Stripe.Checkout.Session) {
  const customerId = getCustomerId(session.customer);
  const userId = session.client_reference_id
    || await findUserIdByEmail(session.customer_details?.email || session.customer_email);

  if (!userId) return;

  let plan = planFromPriceId(session.metadata?.price_id);
  if (plan === "free" && typeof session.subscription === "string") {
    plan = await getPlanFromSubscription(stripe, session.subscription);
  }

  await updateUserPlan(userId, plan, customerId);
}

async function handleSubscriptionUpdated(stripe: Stripe, subscription: Stripe.Subscription) {
  const customerId = getCustomerId(subscription.customer);
  const userId = await findUserIdByStripeCustomer(customerId);
  if (!userId) return;

  const priceId = subscription.items.data[0]?.price.id;
  await updateUserPlan(userId, planFromPriceId(priceId), customerId);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = getCustomerId(subscription.customer);
  const userId = await findUserIdByStripeCustomer(customerId);
  if (!userId) return;

  await updateUserPlan(userId, "free", customerId);
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret is not configured" }, { status: 500 });
  }

  const stripe = stripeClient();
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(stripe, event.data.object as Stripe.Checkout.Session);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(stripe, event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook handling failed:", error);
    return NextResponse.json({ error: "Webhook handling failed" }, { status: 500 });
  }
}

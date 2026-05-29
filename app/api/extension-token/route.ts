import { NextRequest, NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

// Chrome extensions with host_permissions bypass CORS, but we still send headers
// for any future browser-side callers.
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("os_ext_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "No pending token" }, { status: 404, headers: CORS_HEADERS });
  }

  let userId: string | undefined;
  try {
    const payload = JSON.parse(
      Buffer.from(
        token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"),
        "base64"
      ).toString()
    );
    userId = payload.sub;
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 400, headers: CORS_HEADERS });
  }

  if (!userId) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400, headers: CORS_HEADERS });
  }

  let email = "";
  let plan = "free";
  try {
    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    email = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress ?? "";
    plan = (user.publicMetadata.plan as string) ?? "free";
  } catch {
    return NextResponse.json({ error: "User not found" }, { status: 401, headers: CORS_HEADERS });
  }

  const response = NextResponse.json({ token, email, plan }, { headers: CORS_HEADERS });
  // Expire the cookie immediately — one-time use
  response.cookies.set("os_ext_token", "", {
    domain: "outreachsafe.com",
    path: "/",
    maxAge: 0,
    sameSite: "none",
    secure: true,
  });

  return response;
}

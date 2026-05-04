import { NextRequest, NextResponse } from "next/server";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } from "@/lib/google-oauth";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state") || "/";
  const error = searchParams.get("error");

  if (error) {
    const url = new URL("/", request.url);
    url.searchParams.set("auth_error", error);
    return NextResponse.redirect(url);
  }

  if (!code) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      const url = new URL("/", request.url);
      url.searchParams.set("auth_error", "token_exchange_failed");
      return NextResponse.redirect(url);
    }

    const tokens = await tokenRes.json();

    // Get user profile
    const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!profileRes.ok) {
      const url = new URL("/", request.url);
      url.searchParams.set("auth_error", "profile_fetch_failed");
      return NextResponse.redirect(url);
    }

    const profile = await profileRes.json();

    // Redirect to client-side handler to set localStorage
    const callbackUrl = new URL("/auth/success", request.url);
    callbackUrl.searchParams.set("user", JSON.stringify({
      id: "google-" + profile.id,
      name: profile.name || profile.email.split("@")[0],
      email: profile.email,
      phone: "",
      googleId: profile.id,
      picture: profile.picture || "",
    }));
    callbackUrl.searchParams.set("callback", state);

    return NextResponse.redirect(callbackUrl);
  } catch {
    const url = new URL("/", request.url);
    url.searchParams.set("auth_error", "server_error");
    return NextResponse.redirect(url);
  }
}

import { NextResponse } from "next/server";
import { GOOGLE_CLIENT_ID, GOOGLE_REDIRECT_URI } from "@/lib/google-oauth";

const scope = "email profile";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const callback = searchParams.get("callback") || "/";

  if (!GOOGLE_CLIENT_ID || !GOOGLE_REDIRECT_URI) {
    const url = new URL("/", request.url);
    url.searchParams.set("error", "google_not_configured");
    return NextResponse.redirect(url);
  }

  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID);
  googleAuthUrl.searchParams.set("redirect_uri", GOOGLE_REDIRECT_URI);
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", scope);
  googleAuthUrl.searchParams.set("state", callback);
  googleAuthUrl.searchParams.set("prompt", "consent select_account");
  googleAuthUrl.searchParams.set("access_type", "online");

  return NextResponse.redirect(googleAuthUrl.toString());
}

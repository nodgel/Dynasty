import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

// Lightweight "am I logged in as admin?" probe used by the EditFromSiteLink
// client component to render the edit pill on public pages without forcing
// the whole route into dynamic rendering. Returns 200 with {ok:true} for
// authed admins, 401 otherwise.
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({ ok: true });
}

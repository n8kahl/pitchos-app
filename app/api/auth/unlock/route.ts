import { NextResponse } from "next/server";

const PASSWORD = process.env.DEMO_PASSWORD ?? "weekend";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));

  if (body.password !== PASSWORD) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("pitchos_access", "granted", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
  return res;
}

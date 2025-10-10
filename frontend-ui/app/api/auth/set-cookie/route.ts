import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const user = await req.json();
  const cookieStore = await cookies();
  cookieStore.set("user", user, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  console.log("Cookie set:", cookieStore.get("user"));
  return NextResponse.json({ message: "User saved" });
}

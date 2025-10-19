"use server";

import { cookies } from "next/headers";

export async function updateAccessToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("accessToken", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}
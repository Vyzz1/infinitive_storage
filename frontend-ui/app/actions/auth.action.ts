"use server";
import { cookies } from "next/headers";
import { apiUrl } from ".";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("connect.sid");

  if (!sessionCookie) {
    console.log("No session cookie found");
    return null;
  }

  const res = await fetch(`${apiUrl}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: `connect.sid=${sessionCookie.value}`, 
    },
    cache: "no-store",
  });

  console.log("Auth response status:", res.status);

  if (!res.ok) {
    console.log("Auth check failed");
    return null;
  }

  let data = null;
  try {
    data = await res.json();
  } catch (error) {
    console.warn("Response not JSON or empty", error);
  }

  console.log("Current user data:", data);
  return data;
}

"use server";
import { cookies } from "next/headers";
import apiFetch from ".";
import { redirect } from "next/navigation";

const apiUrl =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8888/api";
export async function getCurrentUser() {
  const res = await apiFetch(`/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
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

  return data;
}

export async function signIn(email: string, password: string) {
  console.log(`${apiUrl}/auth/sign-in`);

  const res = await fetch(`${apiUrl}/auth/sign-in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Sign-in failed");
  }
  const cookieStore = await cookies();

  const body = await res.json();

  const accessToken = body.tokens.accessToken;

  const refreshToken = body.tokens.refreshToken;

  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
  });
  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
  });

  return body;
}

export async function signUp(email: string, password: string, name: string) {
  console.log(`${apiUrl}/auth/sign-up`);

  const res = await fetch(`${apiUrl}/auth/sign-up`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, name }),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Sign-up failed");
  }
  const cookieStore = await cookies();

  const body = await res.json();

  const accessToken = body.tokens.accessToken;

  const refreshToken = body.tokens.refreshToken;

  cookieStore.set("accessToken", accessToken, {
    httpOnly: true,
  });
  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: true,
  });

  return body;
}

export async function signOut() {
  const cookieStore = await cookies();

  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  redirect("/sign-in");
}


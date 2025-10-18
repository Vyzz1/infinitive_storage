"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const apiUrl =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8888/api";

const apiFetch = async (url: string, options: RequestInit = {}) => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!accessToken || !refreshToken) {
    redirect("/sign-in");
  }

  let res = await fetch(`${apiUrl}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "include",
  });
  if (res.status === 401) {
    console.log("Access token expired, attempting to refresh...");

    res = await fetch(`${apiUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
      body: JSON.stringify({
        refreshToken: refreshToken,
      }),
      credentials: "include",
    });
    if (res.ok) {
      console.log("Token refreshed successfully");
      const data = await res.json();
      const newAccessToken = data.accessToken;
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessToken: newAccessToken }),
      });
      res = await fetch(`${apiUrl}${url}`, {
        ...options,
        headers: {
          ...options.headers,
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.accessToken}`,
        },
        credentials: "include",
      });
    } else {
      console.log("Refresh token invalid, redirecting to sign-in");
      redirect("/sign-in");
    }
  }
  return res;
};

const getTokenForClient = async () => {
  "use server";
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  let res = await fetch(`${apiUrl}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const refreshToken = cookieStore.get("refreshToken")?.value;

    res = await fetch(`${apiUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken: refreshToken,
      }),
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      const newAccessToken = data.accessToken;
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessToken: newAccessToken }),
      });
      return newAccessToken;
    } else {
      redirect("/sign-in");
    }
  }

  return cookieStore.get("accessToken")?.value;
};

export { getTokenForClient };

export default apiFetch;

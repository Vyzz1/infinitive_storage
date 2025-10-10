"use server";

import { cookies } from "next/headers";

export const createFolder = async (name: string, parentId?: string | null) => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("connect.sid");

  if (!sessionCookie) {
    console.log("No session cookie found");
    return null;
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/folder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: `connect.sid=${sessionCookie.value}`,
    },
    body: JSON.stringify({ name, parentId }),
    cache: "no-store",
  });

  return await res.json();
};

export const getRootFolder = async (): Promise<FolderDbItem[] | null> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("connect.sid");

  if (!sessionCookie) {
    console.log("No session cookie found");
    return null;
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/folder/root`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: `connect.sid=${sessionCookie.value}`, // Fixed cookie format
    },
    cache: "no-store",
  });

  return await res.json();
};

"use server";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const getRootFile = async (): Promise<FileDbItem[] | null> => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("connect.sid");

  if (!sessionCookie) {
    console.log("No session cookie found");
    return null;
  }
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/file/root`, {
    method: "GET",
    next: {
      tags: ["file"],
    },
    headers: {
      "Content-Type": "application/json",
      Cookie: `connect.sid=${sessionCookie.value}`, // Fixed cookie format
    },
    cache: "no-store",
  });

  return await res.json();
};

export const invalidateTag = async (tag: string) => {
  return revalidateTag(tag);
};

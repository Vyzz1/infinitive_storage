"use server";

import { revalidateTag } from "next/cache";
import getCookies from ".";

export const createFolder = async (name: string, parentId?: string | null) => {
  const cookie = await getCookies();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/folder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    body: JSON.stringify({ name, parentId }),
    cache: "no-store",
  });
  revalidateTag("folder");
  return await res.json();
};

export const getRootFolder = async (): Promise<FolderDbItem[] | null> => {
  const cookie = await getCookies();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/folder/root`, {
    method: "GET",
    next: {
      tags: ["folder"],
    },
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    cache: "no-store",
  });

  return await res.json();
};

export const getFoldersInFolder = async (
  folderId: string
): Promise<FolderDbItem[] | null> => {
  const cookie = await getCookies();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/folder/parent/${folderId}`,
    {
      method: "GET",
      next: {
        tags: ["folder"],
      },
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
      cache: "no-store",
    }
  );
  if (!res.ok) {
    console.log("Failed to fetch folders");
    return null;
  }
  return await res.json();
};

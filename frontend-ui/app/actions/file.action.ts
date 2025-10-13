"use server";
import { revalidateTag } from "next/cache";
import getCookies, { apiUrl } from ".";

export const getRootFile = async (): Promise<FileDbItem[] | null> => {
  const cookie = await getCookies();

  const res = await fetch(`${apiUrl}/file/root`, {
    method: "GET",

    next: {
      tags: ["file"],
    },
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    cache: "no-store",
  });

  return await res.json();
};

export const invalidateTag = async (tag: string) => {
  return revalidateTag(tag);
};

export const getFilesInFolder = async (
  folderId: string
): Promise<FileDbItem[] | null> => {
  const cookie = await getCookies();

  const res = await fetch(`${apiUrl}/file/folder/${folderId}`, {
    method: "GET",
    next: {
      tags: ["file"],
    },
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.log("Failed to fetch files");
    return null;
  }

  return await res.json();
};

"use server";
import { revalidateTag } from "next/cache";
import apiFetch from ".";

export const getRootFile = async (): Promise<FileDbItem[] | null> => {
  const res = await apiFetch(`/file/root`, {
    method: "GET",

    next: {
      tags: ["file"],
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
  const res = await apiFetch(`/file/folder/${folderId}`, {
    method: "GET",
    next: {
      tags: ["file"],
    },

    cache: "no-store",
  });

  if (!res.ok) {
    console.log("Failed to fetch files");
    return null;
  }

  return await res.json();
};

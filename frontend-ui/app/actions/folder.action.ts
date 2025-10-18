"use server";

import { revalidateTag } from "next/cache";
import apiFetch from ".";

export const createFolder = async (name: string, parentId?: string | null) => {
  const res = await apiFetch(`/folder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, parentId }),
    cache: "no-store",
  });
  revalidateTag("folder");
  return await res.json();
};

export const getRootFolder = async (): Promise<FolderDbItem[] | null> => {
  const res = await apiFetch(`/folder/root`, {
    method: "GET",
    next: {
      tags: ["folder"],
    },
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  return await res.json();
};

export const getFoldersInFolder = async (
  folderId: string
): Promise<FolderDbItem[] | null> => {
  const res = await apiFetch(`/folder/parent/${folderId}`, {
    method: "GET",
    next: {
      tags: ["folder"],
    },
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (!res.ok) {
    console.log("Failed to fetch folders");
    return null;
  }
  return await res.json();
};
interface BreadcrumbResponse {
  id: string;
  name: string;
}
export const getFolderBreadcrumbs = async (
  folderId: string
): Promise<BreadcrumbResponse[] | null> => {
  const res = await apiFetch(`/folder/breadcrumbs/${folderId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    console.log("Failed to fetch folder breadcrumbs");
    return null;
  }

  return await res.json();
};

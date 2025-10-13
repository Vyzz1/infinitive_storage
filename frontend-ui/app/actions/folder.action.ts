"use server";

import { revalidateTag } from "next/cache";
import getCookies, { apiUrl } from ".";

export const createFolder = async (name: string, parentId?: string | null) => {
  const cookie = await getCookies();
  const res = await fetch(`${apiUrl}/folder`, {
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
  const res = await fetch(`${apiUrl}/folder/root`, {
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

  const res = await fetch(`${apiUrl}/folder/parent/${folderId}`, {
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
  const cookie = await getCookies();
  const res = await fetch(`${apiUrl}/folder/breadcrumbs/${folderId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
  });

  if (!res.ok) {
    console.log("Failed to fetch folder breadcrumbs");
    return null;
  }

  return await res.json();
};

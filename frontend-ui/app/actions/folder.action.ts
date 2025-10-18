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

// Delete folder
export const deleteFolder = async (folderId: string) => {
  const cookie = await getCookies();

  const res = await fetch(`${apiUrl}/folder/${folderId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete folder");
  }

  revalidateTag("folder");
  revalidateTag("file");
  return await res.json();
};

export const renameFolder = async (folderId: string, newName: string) => {
  const cookie = await getCookies();

  const res = await fetch(`${apiUrl}/folder/${folderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    body: JSON.stringify({ name: newName }),
  });

  if (!res.ok) {
    throw new Error("Failed to rename folder");
  }

  revalidateTag("folder");
  return await res.json();
};

export const searchFolders = async (query: string): Promise<FolderDbItem[]> => {
  const cookie = await getCookies();

  const res = await fetch(
    `${apiUrl}/folder?search=${encodeURIComponent(query)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return [];
  }

  const data = await res.json();
  return data.content || [];
};


export const moveFolderToFolder = async (
  folderId: string,
  targetParentId: string | null
) => {
  const cookie = await getCookies();

  const res = await fetch(`${apiUrl}/folder/${folderId}/move`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    body: JSON.stringify({ targetParentId }), 
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to move folder");
  }

  revalidateTag("file");
  revalidateTag("folder");
  return await res.json();
};

export const getAllFolders = async (): Promise<FolderDbItem[]> => {
  const cookie = await getCookies();

  const res = await fetch(`${apiUrl}/folder`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    console.log("Failed to fetch all folders");
    return [];
  }

  const data = await res.json();
  return data.content || data || [];
};

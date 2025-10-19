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

export const deleteFolder = async (folderId: string) => {
  const res = await apiFetch(`/folder/${folderId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete folder");
  }

  revalidateTag("folder");
  revalidateTag("file");
  return await res.json();
};

export const renameFolder = async (folderId: string, newName: string) => {
  const res = await apiFetch(`/folder/${folderId}`, {
    method: "PUT",
    body: JSON.stringify({ name: newName }),
  });

  if (!res.ok) {
    throw new Error("Failed to rename folder");
  }

  revalidateTag("folder");
  return await res.json();
};

export const searchFolders = async (query: string): Promise<FolderDbItem[]> => {
  const res = await apiFetch(`/folder?search=${encodeURIComponent(query)}`, {
    method: "GET",
    cache: "no-store",
  });

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
  const res = await apiFetch(`/folder/${folderId}/move`, {
    method: "PUT",
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
  const res = await apiFetch(`/folder`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    console.log("Failed to fetch all folders");
    return [];
  }

  const data = await res.json();
  return data.content || data || [];
};

export const getFolderSize = async (folderId: string): Promise<number> => {
  try {
    const filesRes = await apiFetch(`/file/folder/${folderId}`, {
      method: "GET",
      cache: "no-store",
    });

    if (!filesRes.ok) {
      return 0;
    }

    const files: FileDbItem[] = await filesRes.json();
    
    let totalSize = 0;
    files.forEach(file => {
      totalSize += file.size || 0;
    });

    const subfoldersRes = await apiFetch(`/folder/parent/${folderId}`, {
      method: "GET",
      cache: "no-store",
    });

    if (subfoldersRes.ok) {
      const subfolders: FolderDbItem[] = await subfoldersRes.json();
      
      for (const subfolder of subfolders) {
        const subfolderSize = await getFolderSize(subfolder.id);
        totalSize += subfolderSize;
      }
    }

    return totalSize;
  } catch (error) {
    console.error("Error calculating folder size:", error);
    return 0;
  }
};
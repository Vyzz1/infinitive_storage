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

export const deleteFile = async (fileId: string) => {
  const res = await apiFetch(`/file/${fileId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete file");
  }

  revalidateTag("file");
  return await res.json();
};

export const renameFile = async (fileId: string, newName: string) => {
  const res = await apiFetch(`/file/${fileId}`, {
    method: "PUT",
    body: JSON.stringify({ fileName: newName }),
  });

  if (!res.ok) {
    throw new Error("Failed to rename file");
  }

  revalidateTag("file");
  return await res.json();
};

export const getFileById = async (fileId: string): Promise<FileDbItem | null> => {
  const res = await apiFetch(`/file/${fileId}`, {
    method: "GET",
  });

  if (!res.ok) {
    return null;
  }

  return await res.json();
};

export const searchFiles = async (query: string): Promise<FileDbItem[]> => {
  const res = await apiFetch(`/file?search=${encodeURIComponent(query)}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  const data = await res.json();
  return data.content || [];
};

export const getFilesWithFilters = async (params: {
  search?: string;
  type?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  folderId?: string;
}): Promise<{ content: FileDbItem[] }> => {
  const queryParams = new URLSearchParams();
  if (params.search) queryParams.append("search", params.search);
  if (params.type) queryParams.append("type", params.type);
  if (params.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
  if (params.folderId) queryParams.append("folderId", params.folderId);

  const res = await apiFetch(`/file?${queryParams.toString()}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    return { content: [] };
  }

  return await res.json();
};

export const moveFileToFolder = async (fileId: string, targetFolderId: string | null) => {
  if (targetFolderId === null) {
    const res = await apiFetch(`/file/${fileId}`, {
      method: "PUT",
      body: JSON.stringify({ folderId: null }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to move file to root");
    }

    revalidateTag("file");
    revalidateTag("folder");
    return await res.json();
  }

  const res = await apiFetch(`/file/${fileId}/move`, {
    method: "PUT",
    body: JSON.stringify({ targetFolderId }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to move file");
  }

  revalidateTag("file");
  revalidateTag("folder");
  return await res.json();
};

export const getRecentFiles = async (): Promise<FileDbItem[]> => {
  const res = await apiFetch(`/file?sortBy=updatedAt&sortOrder=desc&limit=20`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  const data = await res.json();
  return data.content || [];
};

export const getDocumentFiles = async (): Promise<FileDbItem[]> => {
  const documentTypes = ["pdf", "document"];
  const results: FileDbItem[] = [];

  for (const type of documentTypes) {
    const res = await apiFetch(`/file?type=${type}`, {
      method: "GET",
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      if (data.content) {
        results.push(...data.content);
      }
    }
  }

  return results;
};
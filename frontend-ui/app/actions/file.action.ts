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

export const deleteFile = async (fileId: string) => {
  const cookie = await getCookies();

  const res = await fetch(`${apiUrl}/file/${fileId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete file");
  }

  revalidateTag("file");
  return await res.json();
};

export const renameFile = async (fileId: string, newName: string) => {
  const cookie = await getCookies();

  const res = await fetch(`${apiUrl}/file/${fileId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    body: JSON.stringify({ fileName: newName }),
  });

  if (!res.ok) {
    throw new Error("Failed to rename file");
  }

  revalidateTag("file");
  return await res.json();
};

export const getFileById = async (fileId: string): Promise<FileDbItem | null> => {
  const cookie = await getCookies();

  const res = await fetch(`${apiUrl}/file/${fileId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
  });

  if (!res.ok) {
    return null;
  }

  return await res.json();
};

export const searchFiles = async (query: string): Promise<FileDbItem[]> => {
  const cookie = await getCookies();

  const res = await fetch(`${apiUrl}/file?search=${encodeURIComponent(query)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
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
  const cookie = await getCookies();

  const queryParams = new URLSearchParams();
  if (params.search) queryParams.append("search", params.search);
  if (params.type) queryParams.append("type", params.type);
  if (params.sortBy) queryParams.append("sortBy", params.sortBy);
  if (params.sortOrder) queryParams.append("sortOrder", params.sortOrder);
  if (params.folderId) queryParams.append("folderId", params.folderId);

  const res = await fetch(`${apiUrl}/file?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return { content: [] };
  }

  return await res.json();
};



export const moveFileToFolder = async (fileId: string, targetFolderId: string | null) => {
  const cookie = await getCookies();

  if (targetFolderId === null) {
    const res = await fetch(`${apiUrl}/file/${fileId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
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

  const res = await fetch(`${apiUrl}/file/${fileId}/move`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
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
  const cookie = await getCookies();

  const res = await fetch(`${apiUrl}/file?sortBy=updatedAt&sortOrder=desc&limit=20`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookie,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  const data = await res.json();
  return data.content || [];
};

export const getDocumentFiles = async (): Promise<FileDbItem[]> => {
  const cookie = await getCookies();

  const documentTypes = ["pdf", "document"];
  const results: FileDbItem[] = [];

  for (const type of documentTypes) {
    const res = await fetch(`${apiUrl}/file?type=${type}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookie,
      },
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
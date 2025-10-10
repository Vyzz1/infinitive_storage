"use client";

import { create } from "zustand";
import axios, { AxiosError, CancelTokenSource } from "axios";

export interface UploadItem {
  id: string;
  fileName: string;
  fileSize: number;
  progress: number;
  status: "uploading" | "completed" | "error" | "cancelled";
  error?: string;
  timeRemaining?: number;
}

interface UploadStore {
  uploads: UploadItem[];
  addUpload: (file: File, folderId?: string | undefined) => Promise<string>;
  updateUpload: (id: string, updates: Partial<UploadItem>) => void;
  cancelUpload: (id: string) => void;
  removeUpload: (id: string) => void;
  clearCompleted: () => void;
}

const cancelTokens: Record<string, CancelTokenSource> = {};
export const useUploadStore = create<UploadStore>((set, get) => ({
  uploads: [],

  addUpload: async (file, folderId) => {
    const id = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const newUpload: UploadItem = {
      id,
      fileName: file.name,
      fileSize: file.size,
      progress: 0,
      status: "uploading",
    };

    set((state) => ({ uploads: [...state.uploads, newUpload] }));

    const source = axios.CancelToken.source();
    cancelTokens[id] = source;

    try {
      const startTime = Date.now();
      const formData = new FormData();

      formData.append("files", file);
      if (folderId) formData.append("folderId", folderId);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          cancelToken: source.token,

          onUploadProgress: (event) => {
            if (!event.total) return;
            const progress = (event.loaded / event.total) * 100;
            const elapsed = (Date.now() - startTime) / 1000;
            const speed = event.loaded / elapsed;
            const remainingBytes = event.total - event.loaded;
            const timeRemaining = Math.round(remainingBytes / speed);

            get().updateUpload(id, { progress, timeRemaining });
          },
          withCredentials: true,
        }
      );

      if (response.status >= 200 && response.status < 300) {
        get().updateUpload(id, {
          status: "completed",
          progress: 100,
          timeRemaining: 0,
        });
      } else {
        get().updateUpload(id, {
          status: "error",
          error: `Upload failed with status ${response.status}`,
        });
      }
    } catch (error) {
      const err = error as AxiosError;
      if (axios.isCancel(err)) {
        get().updateUpload(id, { status: "cancelled" });
      } else {
        get().updateUpload(id, {
          status: "error",
          error: err.message || "Upload failed",
        });
      }
    } finally {
      delete cancelTokens[id];
    }

    return id;
  },

  updateUpload: (id, updates) =>
    set((state) => ({
      uploads: state.uploads.map((u) =>
        u.id === id ? { ...u, ...updates } : u
      ),
    })),

  cancelUpload: (id) => {
    const token = cancelTokens[id];
    if (token) token.cancel("Upload cancelled by user");
    set((state) => ({
      uploads: state.uploads.map((u) =>
        u.id === id ? { ...u, status: "cancelled" } : u
      ),
    }));
  },

  removeUpload: (id) =>
    set((state) => ({
      uploads: state.uploads.filter((u) => u.id !== id),
    })),

  clearCompleted: () =>
    set((state) => ({
      uploads: state.uploads.filter((u) => u.status === "uploading"),
    })),
}));

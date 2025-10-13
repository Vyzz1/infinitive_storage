import React, { useCallback, useEffect, useRef } from "react";
import { useUploadStore } from "../_context/upload-context";
import { useFolderStore } from "../_context/folder-context";
import { createFolder } from "@/app/actions/folder.action";
import { invalidateTag } from "@/app/actions/file.action";
import { useParams } from "next/navigation";

export default function useQuickActions() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const folderInputRef = useRef<HTMLInputElement | null>(null);
  const { addUpload } = useUploadStore();
  const { setOpen } = useFolderStore();

  const { id } = useParams<{ id: string }>();

  const openFolder = useCallback(() => {
    setOpen(true);
  }, [setOpen]);
  const handleUploadFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleUploadFolderClick = () => {
    folderInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files) return;

    for (const file of Array.from(files)) {
      await addUpload(file, id);
    }
    invalidateTag("file");
    e.target.value = "";
  };

  const handleFolderChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const folderSet = new Set<string>();

    for (const file of Array.from(files)) {
      const parts = file.webkitRelativePath.split("/");
      let currentPath = "";

      for (let i = 0; i < parts.length - 1; i++) {
        currentPath = currentPath ? `${currentPath}/${parts[i]}` : parts[i];
        folderSet.add(currentPath);
      }
    }

    const folderMap = new Map<string, string>();

    for (const folderPath of Array.from(folderSet).sort(
      (a, b) => a.length - b.length
    )) {
      const parts = folderPath.split("/");
      const folderName = parts[parts.length - 1];
      const parentPath = parts.slice(0, -1).join("/");

      const parentId = parentPath ? folderMap.get(parentPath) : id;

      if (!folderMap.has(folderPath)) {
        const newFolder = await createFolder(folderName, parentId);
        folderMap.set(folderPath, newFolder.id);
      }
    }

    for (const file of Array.from(files)) {
      const parts = file.webkitRelativePath.split("/");
      const folderPath = parts.slice(0, -1).join("/");

      const parentId = folderMap.get(folderPath) ?? id;
      console.log("Parent Id", parentId);

      await addUpload(file, parentId!);
    }

    e.target.value = "";
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      if (isCmdOrCtrl && e.key.toLowerCase() === "k") {
        e.preventDefault();
        handleUploadFileClick();
      }

      if (isCmdOrCtrl && e.key.toLowerCase() === "l") {
        e.preventDefault();
        handleUploadFolderClick();
      }

      if (isCmdOrCtrl && e.key.toLowerCase() === "r") {
        e.preventDefault();
        openFolder();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openFolder]);

  return {
    uploadFile: handleUploadFileClick,
    uploadFolder: handleUploadFolderClick,
    fileChange: handleFileChange,
    folderChange: handleFolderChange,
    openFolder,
    fileInputRef,
    folderInputRef,
  };
}

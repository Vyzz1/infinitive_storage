"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  deleteFolder,
  renameFolder,
  changeFolderColor,
} from "@/app/actions/folder.action";
import { invalidateTag } from "@/app/actions/file.action";

export function useFolderOperations() {
  const [selectedFolder, setSelectedFolder] = useState<FolderDbItem | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!selectedFolder) return;

    setIsLoading(true);
    try {
      await deleteFolder(selectedFolder.id);
      toast.success("Folder deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedFolder(null);
      await invalidateTag("folder");
      await invalidateTag("file");
    } catch (error) {
      toast.error("Failed to delete folder");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRename = async (newName: string) => {
    if (!selectedFolder) return;

    setIsLoading(true);
    try {
      await renameFolder(selectedFolder.id, newName);
      toast.success("Folder renamed successfully");
      setIsRenameDialogOpen(false);
      setSelectedFolder(null);
      await invalidateTag("folder");
    } catch (error) {
      toast.error("Failed to rename folder");
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleColorChange = async (color: string | null) => {
    if (!selectedFolder) return;

    try {
      await changeFolderColor(selectedFolder.id, color);
      toast.success("Folder color changed successfully");
      setIsColorPickerOpen(false);
      setSelectedFolder(null);
      await invalidateTag("folder");
    } catch (error: any) {
      toast.error(error.message || "Failed to change folder color");
      console.error(error);
      throw error;
    }
  };

  const openDeleteDialog = (folder: FolderDbItem) => {
    setSelectedFolder(folder);
    setIsDeleteDialogOpen(true);
  };

  const openRenameDialog = (folder: FolderDbItem) => {
    setSelectedFolder(folder);
    setIsRenameDialogOpen(true);
  };

  const openColorPicker = (folder: FolderDbItem) => {
    setSelectedFolder(folder);
    setIsColorPickerOpen(true);
  };

  return {
    selectedFolder,
    isDeleteDialogOpen,
    isRenameDialogOpen,
    isColorPickerOpen,
    isLoading,
    setIsDeleteDialogOpen,
    setIsRenameDialogOpen,
    setIsColorPickerOpen,
    handleDelete,
    handleRename,
    handleColorChange,
    openDeleteDialog,
    openRenameDialog,
    openColorPicker,
  };
}

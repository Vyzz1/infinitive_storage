"use client";

import { useState } from "react";
import { toast } from "sonner";
import { deleteFile, renameFile, invalidateTag } from "@/app/actions/file.action";

export function useFileOperations() {
  const [selectedFile, setSelectedFile] = useState<FileDbItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    try {
      await deleteFile(selectedFile.id);
      toast.success("File deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedFile(null);
      await invalidateTag("file");
    } catch (error) {
      toast.error("Failed to delete file");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRename = async (newName: string) => {
    if (!selectedFile) return;

    setIsLoading(true);
    try {
      await renameFile(selectedFile.id, newName);
      toast.success("File renamed successfully");
      setIsRenameDialogOpen(false);
      setSelectedFile(null);
      await invalidateTag("file");
    } catch (error) {
      toast.error("Failed to rename file");
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (file: FileDbItem) => {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Download started");
  };

  const openDeleteDialog = (file: FileDbItem) => {
    setSelectedFile(file);
    setIsDeleteDialogOpen(true);
  };

  const openRenameDialog = (file: FileDbItem) => {
    setSelectedFile(file);
    setIsRenameDialogOpen(true);
  };

  const openViewer = (file: FileDbItem) => {
    setSelectedFile(file);
    setIsViewerOpen(true);
  };

  const openDetails = (file: FileDbItem) => {
    setSelectedFile(file);
    setIsDetailsOpen(true);
  };

  return {
    selectedFile,
    isDeleteDialogOpen,
    isRenameDialogOpen,
    isViewerOpen,
    isDetailsOpen,
    isLoading,
    setIsDeleteDialogOpen,
    setIsRenameDialogOpen,
    setIsViewerOpen,
    setIsDetailsOpen,
    handleDelete,
    handleRename,
    handleDownload,
    openDeleteDialog,
    openRenameDialog,
    openViewer,
    openDetails,
  };
}
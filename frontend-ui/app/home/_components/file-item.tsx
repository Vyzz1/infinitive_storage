"use client";

import { FileIcon } from "@/components/file-icon";
import { formatFileSize } from "@/lib/utils";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  MoreVertical,
  Download,
  Trash2,
  Edit,
  Info,
  Eye,
  FolderOpen,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useDragAndDrop } from "../_hooks/useDragAndDrop";

import { DeleteDialog } from "./delete-dialog";
import { RenameDialog } from "./rename-dialog";
import { FileViewer } from "./file-viewer";
import { FileDetailsDialog } from "./file-details-dialog";
import { MoveToFolderDialog } from "./move-to-folder-dialog";
import { deleteFile, renameFile, invalidateTag,moveFileToFolder } from "@/app/actions/file.action";
import { toast } from "sonner";

export default function FileItem({ 
  file, 
  folders 
}: { 
  file: FileDbItem;
  folders: FolderDbItem[];
}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { handleDragStart, handleDragEnd } = useDragAndDrop();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await deleteFile(file.id);
      toast.success("File deleted successfully");
      setIsDeleteDialogOpen(false);
      await invalidateTag("file");
    } catch (error) {
      toast.error("Failed to delete file");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRename = async (newName: string) => {
    setIsLoading(true);
    try {
      await renameFile(file.id, newName);
      toast.success("File renamed successfully");
      setIsRenameDialogOpen(false);
      await invalidateTag("file");
    } catch (error) {
      toast.error("Failed to rename file");
      console.error(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    fetch(file.url)
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = file.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch(() => {
        window.open(file.url, "_blank");
      });
    
    toast.success("Download started!");
  };

  const handleMove = async (targetFolderId: string | null) => {
  setIsLoading(true);
  try {
    await moveFileToFolder(file.id, targetFolderId);
    
    toast.success("File moved successfully");
    setIsMoveDialogOpen(false);
    await invalidateTag("file");
  } catch (error: any) {
    toast.error(error.message || "Failed to move file");
    console.error(error);
    throw error;
  } finally {
    setIsLoading(false);
  }
};

  const handleDoubleClick = () => {
    sessionStorage.setItem(`file_${file.id}`, JSON.stringify(file));
    window.open(`/preview/${file.id}`, '_blank');
  };

  const handlePreview = () => {
    setIsViewerOpen(true);
  };

  return (
    <>
      <div
        key={file.id}
        className="grid grid-cols-4 gap-4 border-b border-border px-6 py-3 text-sm hover:bg-muted/50 transition-colors cursor-pointer"
        onDoubleClick={handleDoubleClick}
        draggable
        onDragStart={(e) =>
          handleDragStart({ id: file.id, type: "file", name: file.fileName }, e)
        }
        onDragEnd={handleDragEnd}
      >
        <div className="flex items-center gap-3">
          <FileIcon className="flex-shrink-0" file={file} />
          <span className="text-foreground truncate">{file.fileName}</span>
        </div>

        <div className="flex items-center text-muted-foreground">
          {file.updatedAt
            ? formatDistanceToNow(new Date(file.updatedAt), { addSuffix: true })
            : formatDistanceToNow(new Date(file.createdAt), { addSuffix: true })}
        </div>

        <div className="flex items-center text-muted-foreground">
          {formatFileSize(file.size)}
        </div>

        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handlePreview}>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setIsDetailsOpen(true)}>
                <Info className="mr-2 h-4 w-4" />
                Details
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => setIsRenameDialogOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setIsMoveDialogOpen(true)}>
                <FolderOpen className="mr-2 h-4 w-4" />
                Move to...
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete File"
        description={`Are you sure you want to delete "${file.fileName}"? This action cannot be undone.`}
        isLoading={isLoading}
      />

      <RenameDialog
        open={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
        onConfirm={handleRename}
        currentName={file.fileName}
        type="file"
      />

      <FileViewer
        open={isViewerOpen}
        onOpenChange={setIsViewerOpen}
        file={file}
      />

      <FileDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        file={file}
      />

      <MoveToFolderDialog
        open={isMoveDialogOpen}
        onOpenChange={setIsMoveDialogOpen}
        onConfirm={handleMove}
        currentFolderId={file.folderId}
        itemName={file.fileName}
        itemType="file"
        folders={folders}
      />
    </>
  );
}

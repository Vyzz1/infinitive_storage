"use client";

import { FolderIcon } from "@/components/folder-icon";
import React, { useState,useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { formatFileSize } from "@/lib/utils";
import { MoreVertical, Trash2, Edit, FolderOpen } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useFolderOperations } from "../_hooks/useFolderOperations";
import { useDragAndDrop } from "../_hooks/useDragAndDrop";
import { DeleteDialog } from "./delete-dialog";
import { RenameDialog } from "./rename-dialog";
import { MoveToFolderDialog } from "./move-to-folder-dialog"; 
import { moveFileToFolder } from "@/app/actions/file.action";
import { moveFolderToFolder } from "@/app/actions/folder.action";
import { invalidateTag } from "@/app/actions/file.action";
import { toast } from "sonner"; 

interface FolderItemProps {
  folder: FolderDbItem;
  folders: FolderDbItem[]; 
}

export default function FolderItem({ 
  folder,
  folders 
}: FolderItemProps) {
  const router = useRouter();
  const [isDropTarget, setIsDropTarget] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false); 

  const {
    selectedFolder,
    isDeleteDialogOpen,
    isRenameDialogOpen,
    isLoading,
    setIsDeleteDialogOpen,
    setIsRenameDialogOpen,
    handleDelete,
    handleRename,
    openDeleteDialog,
    openRenameDialog,
  } = useFolderOperations();

  const handleMoveItem = async (
    itemId: string,
    itemType: "file" | "folder",
    targetFolderId: string
  ) => {
    if (itemType === "file") {
      await moveFileToFolder(itemId, targetFolderId);
    } else {
      await moveFolderToFolder(itemId, targetFolderId);
    }
    await invalidateTag("file");
    await invalidateTag("folder");
  };

  const { handleDragStart, handleDragEnd, handleDragOver, handleDrop } =
    useDragAndDrop(handleMoveItem);

  const handleOpen = () => {
    router.push(`/home/folder/${folder.id}`);
  };

  const handleMove = async (targetFolderId: string | null) => {
  try {
    await moveFolderToFolder(folder.id, targetFolderId);
    
    toast.success("Folder moved successfully");
    setIsMoveDialogOpen(false);
    await invalidateTag("folder");
  } catch (error: any) {
    toast.error(error.message || "Failed to move folder");
    console.error(error);
    throw error;
  }
};

  return (
    <>
      <div
        key={folder.id}
        className={`grid grid-cols-4 gap-4 border-b border-border px-6 py-3 text-sm hover:bg-muted/50 transition-colors cursor-move ${
          isDropTarget ? "ring-2 ring-primary bg-primary/10" : ""
        }`}
        onDoubleClick={handleOpen}
        draggable
        onDragStart={(e) =>
          handleDragStart({ id: folder.id, type: "folder", name: folder.name }, e)
        }
        onDragEnd={handleDragEnd}
        onDragOver={(e) => {
          handleDragOver(e);
          setIsDropTarget(true);
        }}
        onDragLeave={() => setIsDropTarget(false)}
        onDrop={(e) => {
          handleDrop(folder.id)(e);
          setIsDropTarget(false);
        }}
      >
        <div className="flex items-center gap-3">
          <FolderIcon folder={folder} />
          <span className="text-foreground">{folder.name}</span>
        </div>

        <div className="flex items-center text-muted-foreground">
          {folder.updatedAt
            ? formatDistanceToNow(new Date(folder.updatedAt), {
                addSuffix: true,
              })
            : formatDistanceToNow(new Date(folder.createdAt), {
                addSuffix: true,
              })}
        </div>

        <div className="flex items-center text-muted-foreground">—</div>

        <div className="flex items-center justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleOpen}>
                <FolderOpen className="mr-2 h-4 w-4" />
                Open
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => openRenameDialog(folder)}>
                <Edit className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setIsMoveDialogOpen(true)}>
                <FolderOpen className="mr-2 h-4 w-4" />
                Move to...
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => openDeleteDialog(folder)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Delete Dialog */}
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Folder"
        description={`Are you sure you want to delete "${selectedFolder?.name}"? All files and subfolders inside will also be deleted. This action cannot be undone.`}
        isLoading={isLoading}
      />

      {/* Rename Dialog */}
      <RenameDialog
        open={isRenameDialogOpen}
        onOpenChange={setIsRenameDialogOpen}
        onConfirm={handleRename}
        currentName={selectedFolder?.name || ""}
        type="folder"
      />

      <MoveToFolderDialog
        open={isMoveDialogOpen}
        onOpenChange={setIsMoveDialogOpen}
        onConfirm={handleMove}
        currentFolderId={folder.parentId}
        itemName={folder.name}
        itemType="folder"
        folders={folders}
        excludeFolderId={folder.id}
      />
    </>
  );
}
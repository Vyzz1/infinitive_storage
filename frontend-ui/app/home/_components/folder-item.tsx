"use client";

import { FolderIcon } from "@/components/folder-icon";
import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, Trash2, Edit, FolderOpen, Palette } from "lucide-react";
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
import { DeleteDialog } from "./delete-dialog";
import { RenameDialog } from "./rename-dialog";
import { MoveToFolderDialog } from "./move-to-folder-dialog";
import { ColorPickerDialog } from "./color-picker-dialog";
import { moveFolderToFolder } from "@/app/actions/folder.action";
import { invalidateTag } from "@/app/actions/file.action";
import { toast } from "sonner";

interface FolderItemProps {
  folder: FolderDbItem;
  folders: FolderDbItem[];
}

export default function FolderItem({ folder, folders }: FolderItemProps) {
  const router = useRouter();
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);

  const {
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
  } = useFolderOperations();

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
        className={`grid grid-cols-4 gap-4 border-b border-border px-6 py-3 text-sm hover:bg-muted/50 transition-colors cursor-pointer `}
        onDoubleClick={handleOpen}
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
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => openRenameDialog(folder)}>
                <Edit className="mr-2 h-4 w-4" />
                Rename
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => openColorPicker(folder)}>
                <Palette className="mr-2 h-4 w-4" />
                Change Color
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

      {/* Color Picker Dialog */}
      <ColorPickerDialog
        open={isColorPickerOpen}
        onOpenChange={setIsColorPickerOpen}
        onConfirm={handleColorChange}
        currentColor={selectedFolder?.color}
        folderName={selectedFolder?.name || ""}
      />
    </>
  );
}

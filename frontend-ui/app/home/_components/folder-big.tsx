"use client";
import { FolderIcon } from "@/components/folder-icon";
import { Button } from "@/components/ui/button";
import {
  MoreVerticalIcon,
  FolderOpen,
  Edit,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFolderOperations } from "../_hooks/useFolderOperations";
import { useDragAndDrop } from "../_hooks/useDragAndDrop";
import { DeleteDialog } from "./delete-dialog";
import { RenameDialog } from "./rename-dialog";
import { MoveToFolderDialog } from "./move-to-folder-dialog"; 
import { moveFileToFolder } from "@/app/actions/file.action";
import { moveFolderToFolder, } from "@/app/actions/folder.action";
import { invalidateTag } from "@/app/actions/file.action";
import { toast } from "sonner"; 

interface FolderBigProps {
  folder: FolderDbItem;
  folders: FolderDbItem[];
}

export default function FolderBig({ folder, folders }: FolderBigProps) {
  const router = useRouter();
  const [isDropTarget, setIsDropTarget] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false); 
  const [folderSize, setFolderSize] = useState<number | null>(null);
  const [isLoadingSize, setIsLoadingSize] = useState(false);
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
        className={`group flex rounded-xl bg-muted/50 items-center justify-between hover:bg-muted hover:shadow-sm transition-all duration-200 cursor-move p-3 hover:scale-[1.01] ${
          isDropTarget ? "ring-2 ring-primary bg-primary/10" : ""
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="transition-transform duration-200 group-hover:scale-110 shrink-0">
            <FolderIcon folder={folder} />
          </div>
          <span className="text-foreground font-medium truncate group-hover:text-foreground/90 transition-colors">
            {folder.name}
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-background/60 rounded-full shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <MoreVerticalIcon className="size-4" />
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

      {/* Delete Dialog */}
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Folder"
        description={`Are you sure you want to delete "${selectedFolder?.name}"? All files and subfolders inside will also be deleted. This action cannot be undone.`}
        isLoading={isLoading}
      />

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
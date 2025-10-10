"use client";
import React from "react";
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from "@/components/ui/context-menu";
import { FileIcon, FolderArchiveIcon, FolderPlusIcon } from "lucide-react";
import useQuickActions from "../_hooks/useQuickActions";
export default function RightClickContext() {
  const {
    fileChange,
    fileInputRef,
    folderInputRef,
    openFolder,
    uploadFile,
    uploadFolder,
  } = useQuickActions();
  return (
    <>
      <input
        id="file-right-click"
        type="file"
        hidden
        multiple
        ref={fileInputRef}
        onChange={fileChange}
      />

      <input
        type="file"
        hidden
        id="folder-right-click"
        {...({ webkitdirectory: true } as any)}
        multiple
        ref={folderInputRef}
        onChange={fileChange}
      />

      <ContextMenuContent className="w-52">
        <ContextMenuItem
          onClick={() => {
            uploadFile();
          }}
        >
          <FileIcon />
          Upload File
          <ContextMenuShortcut>⌘ + K</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={uploadFolder}>
          <FolderArchiveIcon />
          Upload Folder
          <ContextMenuShortcut>⌘ + L</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={openFolder}>
          <FolderPlusIcon />
          New Folder
          <ContextMenuShortcut>⌘ + R</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </>
  );
}

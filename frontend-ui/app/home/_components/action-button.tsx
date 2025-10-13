"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileIcon,
  FolderArchiveIcon,
  FolderPlusIcon,
  PlusIcon,
} from "lucide-react";

import useQuickActions from "../_hooks/useQuickActions";

export default function ActionButton() {
  const {
    fileChange,
    folderChange,
    fileInputRef,
    folderInputRef,
    openFolder,
    uploadFile,
    uploadFolder,
  } = useQuickActions();
  return (
    <>
      {/* hidden inputs */}
      <input
        id="file-action"
        type="file"
        hidden
        multiple
        ref={fileInputRef}
        onChange={fileChange}
      />

      {/* eslint/no-check */}
      <input
        id="folder-action"
        type="file"
        hidden
        multiple
        {...{ webkitdirectory: "" }}
        {...{ directory: "" }}
        ref={folderInputRef}
        onChange={folderChange}
      />

      {/* Dropdown menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="rounded-2xl py-6" variant="outline">
            New <PlusIcon className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-60">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={uploadFile}>
              <FileIcon className="mr-2 h-4 w-4" />
              Upload File
              <DropdownMenuShortcut>⌘ + K</DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={uploadFolder}>
              <FolderArchiveIcon className="mr-2 h-4 w-4" />
              Upload Folder
              <DropdownMenuShortcut>⌘ + L</DropdownMenuShortcut>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => openFolder()}>
              <FolderPlusIcon className="mr-2 h-4 w-4" />
              New Folder
              <DropdownMenuShortcut>⌘ + R</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

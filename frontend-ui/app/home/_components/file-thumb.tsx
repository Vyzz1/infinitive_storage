"use client";

import { FileIcon } from "@/components/file-icon";
import { Button } from "@/components/ui/button";
import { codeEtxs } from "@/constants/ext";
import {
  MoreVerticalIcon,
  Download,
  Trash2,
  Edit,
  Eye,
  Info,
  FolderOpen,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDragAndDrop } from "../_hooks/useDragAndDrop";
import { DeleteDialog } from "./delete-dialog";
import { RenameDialog } from "./rename-dialog";
import { FileViewer } from "./file-viewer";
import { FileDetailsDialog } from "./file-details-dialog";
import { MoveToFolderDialog } from "./move-to-folder-dialog";
import {
  deleteFile,
  renameFile,
  invalidateTag,
  moveFileToFolder,
} from "@/app/actions/file.action";
import { toast } from "sonner";

export default function FileThumb({
  file,
  folders,
}: {
  file: FileDbItem;
  folders: FolderDbItem[];
}) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isHoveringVideo, setIsHoveringVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { handleDragStart, handleDragEnd } = useDragAndDrop();

  const isCodeFile = codeEtxs.includes(file.extension.toLowerCase());

  useEffect(() => {
    if (isCodeFile) {
      setLoading(true);
      fetch(file.url)
        .then((res) => res.text())
        .then((text) => {
          const limited = text.split("\n").slice(0, 200).join("\n");
          setContent(limited);
        })
        .catch(() => setContent("Unable to load preview."))
        .finally(() => setLoading(false));
    }
  }, [file.url, isCodeFile]);

  useEffect(() => {
    if (videoRef.current) {
      if (isHoveringVideo) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHoveringVideo]);

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
      .then((res) => res.blob())
      .then((blob) => {
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
    window.open(`/preview/${file.id}`, "_blank");
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsViewerOpen(true);
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sessionStorage.setItem(`file_${file.id}`, JSON.stringify(file));
    window.open(`/preview/${file.id}`, "_blank");
  };

  const getDocumentIconColor = (ext: string) => {
    switch (ext.toLowerCase()) {
      case "doc":
      case "docx":
        return "text-blue-600";
      case "xls":
      case "xlsx":
        return "text-green-600";
      case "ppt":
      case "pptx":
        return "text-orange-600";
      case "pdf":
        return "text-red-600";
      default:
        return "text-blue-500";
    }
  };

  const getDocumentTypeName = (ext: string) => {
    switch (ext.toLowerCase()) {
      case "doc":
      case "docx":
        return "Word Document";
      case "xls":
      case "xlsx":
        return "Excel Spreadsheet";
      case "ppt":
      case "pptx":
        return "PowerPoint";
      case "pdf":
        return "PDF Document";
      default:
        return "Document";
    }
  };

  return (
    <>
      <div
        className="group rounded-lg p-3 bg-muted hover:bg-muted/80 transition-all duration-200 hover:shadow-md hover:scale-[1.02] cursor-pointer"
        onDoubleClick={handleDoubleClick}
        draggable
        onDragStart={(e) =>
          handleDragStart({ id: file.id, type: "file", name: file.fileName }, e)
        }
        onDragEnd={handleDragEnd}
      >
        <div className="flex justify-between items-start gap-2 mb-3">
          <div className="flex-1 flex items-center gap-2 min-w-0">
            <div className="transition-transform group-hover:scale-110">
              <FileIcon file={file} />
            </div>
            <p className="text-sm font-medium truncate group-hover:text-foreground transition-colors">
              {file.fileName}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-background/60 rounded-full shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVerticalIcon className="size-4" />
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

        <div
          className="rounded-lg overflow-hidden w-full aspect-square relative"
          onDoubleClick={handleDoubleClick}
        >
          {file.type === "image" ? (
            <div className="relative w-full h-full">
              <Image
                src={file.url}
                alt={file.fileName}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200" />
            </div>
          ) : file.type === "video" ? (
            <div
              className="relative w-full h-full bg-black"
              onMouseEnter={() => setIsHoveringVideo(true)}
              onMouseLeave={() => setIsHoveringVideo(false)}
              onClick={handleVideoClick}
            >
              <video
                ref={videoRef}
                src={file.url}
                className="w-full h-full object-cover"
                muted={false}
                loop
                playsInline
              />
              {!isHoveringVideo && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-black ml-1"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ) : file.type === "document" || file.type === "pdf" ? (
            file.thumbnail ? (
              <div className="relative w-full h-full">
                <Image
                  src={file.thumbnail}
                  alt={file.fileName}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200" />
                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded uppercase font-semibold">
                  {file.extension}
                </div>
              </div>
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-muted to-muted/50 flex flex-col items-center justify-center gap-3 transition-colors duration-200 group-hover:from-muted/80 group-hover:to-muted/30">
                <svg
                  className={`w-20 h-20 ${getDocumentIconColor(
                    file.extension
                  )} group-hover:scale-110 transition-transform`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 13h6m-6 4h6m-6-8h3"
                  />
                </svg>
                <div className="text-center px-2">
                  <p className="text-xs font-semibold text-foreground/70 uppercase tracking-wider">
                    {file.extension}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {getDocumentTypeName(file.extension)}
                  </p>
                </div>
                <div className="absolute bottom-2 right-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                </div>
              </div>
            )
          ) : loading ? (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
              Loading preview...
            </div>
          ) : isCodeFile && content ? (
            <div className="h-full w-full overflow-hidden text-xs bg-zinc-950 text-white rounded-lg">
              <SyntaxHighlighter
                showLineNumbers
                language={file.extension}
                style={darcula}
                customStyle={{
                  overflow: "hidden",
                  margin: 0,
                  padding: "0.75rem",
                  height: "100%",
                  fontSize: "0.75rem",
                }}
              >
                {content}
              </SyntaxHighlighter>
            </div>
          ) : file.type === "audio" ? (
            <div className="h-full w-full bg-gradient-to-br from-muted to-muted/50 flex flex-col items-center justify-center gap-3">
              <svg
                className="w-16 h-16 text-pink-500 group-hover:text-pink-600 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                />
              </svg>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {file.extension}
              </p>
            </div>
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-muted to-muted/50 flex flex-col items-center justify-center gap-3">
              <svg
                className="w-16 h-16 text-muted-foreground group-hover:text-foreground/70 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {file.extension}
              </p>
            </div>
          )}
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

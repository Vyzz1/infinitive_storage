"use client";
import { FolderIcon } from "@/components/folder-icon";
import { Button } from "@/components/ui/button";
import { MoreVerticalIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function FolderBig({ folder }: { folder: FolderDbItem }) {
  const router = useRouter();
  return (
    <div
      onDoubleClick={() => router.push(`/home/folder/${folder.id}`)}
      className="group flex rounded-xl bg-muted/50 items-center justify-between hover:bg-muted hover:shadow-sm transition-all duration-200 cursor-pointer p-3 hover:scale-[1.01]"
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div className="transition-transform duration-200 group-hover:scale-110 shrink-0">
          <FolderIcon folder={folder} />
        </div>
        <span className="text-foreground font-medium truncate group-hover:text-foreground/90 transition-colors">
          {folder.name}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 hover:bg-background/60 rounded-full shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
      >
        <MoreVerticalIcon className="size-4" />
      </Button>
    </div>
  );
}

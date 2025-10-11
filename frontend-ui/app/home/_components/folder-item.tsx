"use client";
import { FolderIcon } from "@/components/folder-icon";
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface FolderItemProps {
  folder: FolderDbItem;
}

export default function FolderItem({ folder }: FolderItemProps) {
  const router = useRouter();

  return (
    <div
      onDoubleClick={() => {
        router.push(`/home/folder/${folder.id}`);
      }}
      key={folder.id}
      className="grid grid-cols-4 gap-4 border-b border-border px-6 py-3 text-sm hover:bg-muted/50 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <FolderIcon folder={folder} />
        <span className="text-foreground">{folder.name}</span>
      </div>

      <div className="flex items-center text-muted-foreground">
        {folder.updatedAt
          ? formatDistanceToNow(folder.updatedAt!)
          : formatDistanceToNow(folder.createdAt!)}
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
            <DropdownMenuItem>Mở</DropdownMenuItem>
            <DropdownMenuItem>Đổi tên</DropdownMenuItem>
            <DropdownMenuItem>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

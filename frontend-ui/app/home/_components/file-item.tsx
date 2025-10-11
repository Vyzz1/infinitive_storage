import { FileIcon } from "@/components/file-icon";
import { formatFileSize } from "@/lib/utils";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
export default function FileItem({ file }: { file: FileDbItem }) {
  return (
    <div
      key={file.id}
      className="grid grid-cols-4 gap-4 border-b border-border px-6 py-3 text-sm hover:bg-muted/50 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <FileIcon className="flex-shrink-0" file={file} />
        <span className="text-foreground truncate">{file.fileName}</span>
      </div>

      <div className="flex items-center text-muted-foreground">
        {" "}
        {file.updatedAt
          ? formatDistanceToNow(file.updatedAt!)
          : formatDistanceToNow(file.createdAt!)}
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
            <DropdownMenuItem>Tải xuống</DropdownMenuItem>
            <DropdownMenuItem>Đổi tên</DropdownMenuItem>
            <DropdownMenuItem>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

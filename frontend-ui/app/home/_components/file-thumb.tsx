import { FileIcon } from "@/components/file-icon";
import { Button } from "@/components/ui/button";
import { MoreVerticalIcon } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function FileThumb({ file }: { file: FileDbItem }) {
  return (
    <div className="group rounded-lg p-3 bg-muted hover:bg-muted/80 transition-all duration-200 hover:shadow-md hover:scale-[1.02] cursor-pointer">
      <div className="flex justify-between items-start gap-2 mb-3">
        <div className="flex-1 flex items-center gap-2 min-w-0">
          <div className="transition-transform group-hover:scale-110">
            <FileIcon file={file} />
          </div>
          <p className="text-sm font-medium truncate group-hover:text-foreground transition-colors">
            {file.fileName}
          </p>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-background/60 rounded-full shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
        >
          <MoreVerticalIcon className="size-4" />
        </Button>
      </div>

      <div className="rounded-lg overflow-hidden w-full aspect-square relative">
        {file.thumbnail || file.type === "image" ? (
          <div className="relative w-full h-full">
            <Image
              src={file.type === "image" ? file.url : file.thumbnail!}
              alt={file.fileName}
              width={256}
              height={256}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-200" />
          </div>
        ) : (
          <div className="h-full w-full bg-muted-foreground/10 group-hover:bg-muted-foreground/15 flex items-center justify-center transition-colors duration-200">
            <p className="text-xs text-muted-foreground text-center px-2 group-hover:text-foreground/70 transition-colors">
              No Preview Available
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

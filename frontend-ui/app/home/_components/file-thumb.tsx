"use client";

import { FileIcon } from "@/components/file-icon";
import { Button } from "@/components/ui/button";
import { codeEtxs } from "@/constants/ext";
import { MoreVerticalIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function FileThumb({ file }: { file: FileDbItem }) {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
        {file.type === "image" || file.thumbnail ? (
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
        ) : loading ? (
          <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
            Loading preview...
          </div>
        ) : isCodeFile && content ? (
          <div className="h-full w-full overflow-hidden text-xs bg-zinc-950 text-white rounded-lg">
            <SyntaxHighlighter
              showLineNumbers
              theme={darcula}
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

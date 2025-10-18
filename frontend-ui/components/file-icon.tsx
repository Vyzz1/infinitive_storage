import { codeEtxs } from "@/constants/ext";
import { FileText, FileImage, FileVideo, FileAudio, File } from "lucide-react";
import Image from "next/image";

interface FileIconProps {
  file: FileDbItem;
  className?: string;
}

const iconMap: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  jsx: "react",
  tsx: "react",
  py: "python",
  yml: "yaml",
  sh: "powershell",
  rb: "ruby",
  md: "markdown",
  html: "html",
  sql: "database",
};

export function FileIcon({ file, className = "h-5 w-5" }: FileIconProps) {
  const iconClass = className;
  const isCodeFile = codeEtxs.includes(file.extension.toLowerCase());

  if (isCodeFile) {
    const icon =
      iconMap[file.extension.toLowerCase()] || file.extension.toLowerCase();

    return (
      <Image
        src={`https://raw.githubusercontent.com/material-extensions/vscode-material-icon-theme/refs/heads/main/icons/${icon}.svg`}
        alt={file.fileName}
        width={20}
        height={20}
      />
    );
  }
  switch (file.type) {
    case "image":
      return <FileImage className={`${iconClass} text-red-500`} />;
    case "video":
      return <FileVideo className={`${iconClass} text-purple-500`} />;
    case "audio":
      return <FileAudio className={`${iconClass} text-blue-500`} />;
    case "pdf":
      return <FileText className={`${iconClass} text-red-500`} />;
    case "document":
      return <FileText className={`${iconClass} text-blue-500`} />;

    default:
      return <File className={`${iconClass} text-muted-foreground`} />;
  }
}

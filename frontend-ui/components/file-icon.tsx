import { FileText, FileImage, FileVideo, FileAudio, File } from "lucide-react";

interface FileIconProps {
  file: FileDbItem;
  className?: string;
}

export function FileIcon({ file, className = "h-5 w-5" }: FileIconProps) {
  const iconClass = className;

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

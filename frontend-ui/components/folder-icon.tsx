import { Folder } from "lucide-react";

interface FolderIconProps {
  folder: FolderDbItem;
  className?: string;
}

export function FolderIcon({ folder, className = "h-5 w-5" }: FolderIconProps) {
  return (
    <Folder
      className={className}
      style={{ color: folder.color || undefined }}
      fill={folder.color || "currentColor"}
    />
  );
}

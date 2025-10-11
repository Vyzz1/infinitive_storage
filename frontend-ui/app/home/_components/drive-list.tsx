import FolderItem from "./folder-item";
import FileItem from "./file-item";
interface DriveTableProps {
  folders: FolderDbItem[];
  files: FileDbItem[];
}

export function DriveTable({ folders, files }: DriveTableProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-4 gap-4 border-b border-border px-6 py-3 text-sm font-medium text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>Name</span>
        </div>

        <div className="flex items-center gap-2">
          <span>Last Modified</span>
        </div>
        <div className="flex items-center gap-2">
          <span>File Size</span>
        </div>
        <div className="flex items-center justify-end">
          <span>Actions</span>
        </div>
      </div>

      {folders.map((folder) => (
        <FolderItem key={folder.id} folder={folder} />
      ))}

      {files.map((file) => (
        <FileItem key={file.id} file={file} />
      ))}
    </div>
  );
}

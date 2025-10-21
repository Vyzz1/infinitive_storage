import React from "react";
import FileThumb from "./file-thumb";
import FolderBig from "./folder-big";

interface DriveGridProps {
  folders: FolderDbItem[];
  files: FileDbItem[];
  allFolders: FolderDbItem[];
}

export default function DriveGrid({
  folders,
  files,
  allFolders,
}: DriveGridProps) {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-6">
        {folders?.map((folder) => (
          <FolderBig key={folder.id} folder={folder} folders={allFolders} />
        ))}
      </div>

      <div className="mt-10 px-6 gap-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {files?.map((file) => (
          <FileThumb key={file.id} file={file} folders={allFolders} />
        ))}
      </div>
    </div>
  );
}

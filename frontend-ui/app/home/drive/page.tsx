import { getRootFile } from "@/app/actions/file.action";
import { getRootFolder, getAllFolders } from "@/app/actions/folder.action";
import FileItem from "../_components/file-item";
import FolderItem from "../_components/folder-item";
import { FolderOpen } from "lucide-react";

export default async function MyDrivePage() {
  const [files, folders, allFolders] = await Promise.all([
    getRootFile(),
    getRootFolder(),
    getAllFolders(),
  ]);

  const hasContent = (files && files.length > 0) || (folders && folders.length > 0);

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">My Drive</h1>
          <p className="text-muted-foreground">
            All your files and folders in one place
          </p>
        </div>

        {!hasContent ? (
          <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center">
              <FolderOpen className="w-16 h-16 text-muted-foreground" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No files yet</h3>
              <p className="text-sm text-muted-foreground">
                Upload your first file or create a folder to get started
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Folders Section */}
            {folders && folders.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Folders</h2>
                <div className="bg-background rounded-lg border border-border overflow-hidden">
                  <div className="grid grid-cols-4 gap-4 border-b border-border px-6 py-3 text-sm font-medium bg-muted/50">
                    <div>Name</div>
                    <div>Last Modified</div>
                    <div>Size</div>
                    <div></div>
                  </div>
                  {folders.map((folder) => (
                    <FolderItem 
                      key={folder.id} 
                      folder={folder}
                      folders={allFolders || []} 
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Files Section */}
            {files && files.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold mb-4">Files</h2>
                <div className="bg-background rounded-lg border border-border overflow-hidden">
                  <div className="grid grid-cols-4 gap-4 border-b border-border px-6 py-3 text-sm font-medium bg-muted/50">
                    <div>Name</div>
                    <div>Last Modified</div>
                    <div>Size</div>
                    <div></div>
                  </div>
                  {files.map((file) => (
                    <FileItem 
                      key={file.id} 
                      file={file}
                      folders={allFolders || []} 
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
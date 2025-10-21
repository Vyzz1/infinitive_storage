import { getDocumentFiles } from "@/app/actions/file.action";
import { getAllFolders } from "@/app/actions/folder.action";
import FileItem from "../_components/file-item";
import { FileText } from "lucide-react";

export default async function DocumentsPage() {
  const [files, allFolders] = await Promise.all([
    getDocumentFiles(),
    getAllFolders(),
  ]);

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-muted-foreground">
            All your documents in one place (PDF, Word, Excel, PowerPoint)
          </p>
        </div>

        {!files || files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
            <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center">
              <FileText className="w-16 h-16 text-muted-foreground" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">No documents yet</h3>
              <p className="text-sm text-muted-foreground">
                Upload your first document to get started
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-background rounded-lg border border-border overflow-hidden">
            <div className="grid grid-cols-4 gap-4 border-b border-border px-6 py-3 text-sm font-medium bg-muted/50">
              <div>Name</div>
              <div>Last Modified</div>
              <div>Size</div>
              <div></div>
            </div>
            {files.map((file) => (
              <FileItem key={file.id} file={file} folders={allFolders || []} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

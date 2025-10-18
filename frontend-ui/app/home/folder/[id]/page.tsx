import { getFilesInFolder } from "@/app/actions/file.action";
import {
  getFolderBreadcrumbs,
  getFoldersInFolder,
  getAllFolders, 
} from "@/app/actions/folder.action";
import ViewSwitcher from "../../_components/view-swticher";
import EmptyState from "@/components/empty-state";
import FolderBreadcums from "../../_components/folder-breadcums";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [files, folders, breadcrumbs, allFolders] = await Promise.all([
    getFilesInFolder(id),
    getFoldersInFolder(id),
    getFolderBreadcrumbs(id),
    getAllFolders(), 
  ]);

  const isEmpty = files?.length === 0 && folders?.length === 0;

  return (
    <section className="min-h-screen bg-background">
      <FolderBreadcums folders={breadcrumbs || []} />

      {isEmpty ? (
        <EmptyState />
      ) : (
        <ViewSwitcher 
          folders={folders} 
          files={files}
          allFolders={allFolders} 
        />
      )}
    </section>
  );
}

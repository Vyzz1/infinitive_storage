import { getFilesInFolder } from "@/app/actions/file.action";
import {
  getFolderBreadcrumbs,
  getFoldersInFolder,
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

  const files = await getFilesInFolder(id);
  const folders = await getFoldersInFolder(id);
  const breadcrumbs = await getFolderBreadcrumbs(id);

  console.log(files);
  const isEmpty = files?.length === 0 && folders?.length === 0;

  return (
    <section className="min-h-screen bg-background">
      {<FolderBreadcums folders={breadcrumbs || []} />}

      {isEmpty ? (
        <EmptyState />
      ) : (
        <ViewSwitcher folders={folders} files={files} />
      )}
    </section>
  );
}

import { getFilesInFolder } from "@/app/actions/file.action";
import { getFoldersInFolder } from "@/app/actions/folder.action";
import Header from "@/components/header";
import ViewSwitcher from "../../_components/view-swticher";
import EmptyState from "@/components/empty-state";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const files = await getFilesInFolder(id);
  const folders = await getFoldersInFolder(id);

  const isEmpty = files?.length === 0 && folders?.length === 0;
  return (
    <section className="min-h-screen bg-background">
      {!isEmpty && <Header title={`Folder : ${folders![0].location}`} />}

      {isEmpty ? (
        <EmptyState />
      ) : (
        <ViewSwitcher folders={folders} files={files} />
      )}
    </section>
  );
}

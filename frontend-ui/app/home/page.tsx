import React from "react";
import { getRootFile } from "../actions/file.action";
import { getRootFolder } from "../actions/folder.action";
import Header from "@/components/header";
import { DriveTable } from "./_components/table-list";

export default async function Homepage() {
  const filesRoot = await getRootFile();
  const folderRoot = await getRootFolder();

  console.log("Files Root:", filesRoot);
  console.log("Folder root", folderRoot);

  return (
    <section className="min-h-screen bg-background">
      <Header title="Your Infinite Drive" />
      <div className="py-6">
        <DriveTable folders={folderRoot!} files={filesRoot!} />
      </div>
    </section>
  );
}

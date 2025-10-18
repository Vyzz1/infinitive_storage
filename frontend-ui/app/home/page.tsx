import React from "react";
import { getRootFile } from "../actions/file.action";
import { getRootFolder, getAllFolders } from "../actions/folder.action"; 
import Header from "@/components/header";
import ViewSwitcher from "./_components/view-swticher";
import EmptyState from "@/components/empty-state";

export default async function Homepage() {
  const filesRoot = await getRootFile();
  const folderRoot = await getRootFolder();
  const allFolders = await getAllFolders(); 

  console.log("🏠 Homepage data:", {
    filesCount: filesRoot?.length || 0,
    rootFoldersCount: folderRoot?.length || 0,
    allFoldersCount: allFolders?.length || 0, 
  });

  if (filesRoot?.length === 0 && folderRoot?.length === 0) {
    return <EmptyState />;
  }

  return (
    <section className="min-h-screen bg-background">
      <Header title="Your Infinite Drive" />
      <ViewSwitcher 
        folders={folderRoot}     
        files={filesRoot}
        allFolders={allFolders}   
      />
    </section>
  );
}
"use client";
import { ButtonGroup } from "@/components/ui/button-group";
import { useViewStore } from "../_context/view-context";
import DriveGrid from "./drive-grid";
import { DriveTable } from "./drive-list";
import { Button } from "@/components/ui/button";
import { Grid, List } from "lucide-react";

interface ViewSwitcherProps {
  folders: any;
  files: any;
  allFolders: FolderDbItem[]; 
}

export default function ViewSwitcher({ folders, files, allFolders }: ViewSwitcherProps) {
  const { view, setView } = useViewStore();

  console.log("🔀 ViewSwitcher:", {
    displayFolders: folders?.length || 0,
    allFolders: allFolders?.length || 0, 
  });

  return (
    <div className="py-6">
      <div className="flex justify-end mb-4 gap-2">
        <ButtonGroup>
          <Button
            variant={view === "grid" ? "default" : "outline"}
            onClick={() => setView("grid")}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={view === "list" ? "default" : "outline"}
            onClick={() => setView("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </ButtonGroup>
      </div>

      {view === "grid" ? (
        <DriveGrid 
          folders={folders} 
          files={files}
          allFolders={allFolders} 
        />
      ) : (
        <DriveTable 
          folders={folders} 
          files={files}
          allFolders={allFolders} 
        />
      )}
    </div>
  );
}
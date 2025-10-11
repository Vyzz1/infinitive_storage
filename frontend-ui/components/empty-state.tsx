import { Folder, File, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Icon Stack */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl" />
        <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-muted">
          <div className="absolute -top-2 -right-2">
            <div className="w-12 h-12 rounded-lg bg-background shadow-lg flex items-center justify-center border border-border">
              <File className="w-6 h-6 text-muted-foreground" />
            </div>
          </div>
          <Folder className="w-10 h-10 text-muted-foreground" />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-foreground mb-2">
        No files or folders yet
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
        Get started by uploading your first file or creating a new folder to
        organize your content.
      </p>

      <ul className="flex flex-col list-inside list-disc">
        <li className="text-muted-foreground">
          {" "}
          Right click anywhere to open the context menu
        </li>
        <li className="text-muted-foreground">
          Or use the quick actions button
        </li>
      </ul>
    </div>
  );
}

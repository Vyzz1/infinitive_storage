"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { formatFileSize } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { toast } from "sonner";
import { FileViewerFactory } from "@/lib/file-viewer-factory";

interface FileViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: FileDbItem | null;
}

export function FileViewer({ open, onOpenChange, file }: FileViewerProps) {
  if (!file) return null;

  const handleDownload = async () => {
    fetch(file.url)
      .then(res => res.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = file.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch(() => {
        window.open(file.url, "_blank");
      });
    
    toast.success("Download started!");
  };

  const viewerObj = FileViewerFactory.getViewerForFile(file);
  const ViewerComponent = viewerObj.component;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[85vh] p-0 gap-0 flex flex-col">
        <VisuallyHidden>
          <DialogTitle>{file.fileName}</DialogTitle>
        </VisuallyHidden>

        {/* Header */}
        <div className="flex items-center justify-between p-4 pr-12 border-b shrink-0">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold truncate">{file.fileName}</h2>
            <p className="text-sm text-muted-foreground">
              {formatFileSize(file.size)} • {file.type}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="hover:bg-muted"
              onClick={handleDownload}
              title="Download file"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <ViewerComponent />
        </div>
      </DialogContent>
    </Dialog>
  );
}
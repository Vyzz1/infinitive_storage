"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatFileSize } from "@/lib/utils";
import { format } from "date-fns";
import { File, Calendar, HardDrive, MapPin } from "lucide-react";
import { FileIcon } from "@/components/file-icon";

interface FileDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: FileDbItem | null;
}

export function FileDetailsDialog({
  open,
  onOpenChange,
  file,
}: FileDetailsDialogProps) {
  if (!file) return null;

  const details = [
    {
      icon: File,
      label: "Type",
      value: `${file.type?.toUpperCase() || "Unknown"} (${file.extension})`,
    },
    {
      icon: HardDrive,
      label: "Size",
      value: formatFileSize(file.size),
    },
    {
      icon: MapPin,
      label: "Location",
      value: file.location || "Root",
    },
    {
      icon: Calendar,
      label: "Created",
      value: format(new Date(file.createdAt), "PPpp"),
    },
    {
      icon: Calendar,
      label: "Modified",
      value: format(new Date(file.updatedAt || file.createdAt), "PPpp"),
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>File Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Preview */}
          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            <div className="flex-shrink-0">
              <FileIcon file={file} className="w-12 h-12" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{file.fileName}</h3>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(file.size)}
              </p>
            </div>
          </div>

          {/* File Details */}
          <div className="space-y-3">
            {details.map((detail, index) => (
              <div key={index} className="flex items-start gap-3">
                <detail.icon className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{detail.label}</p>
                  <p className="text-sm text-muted-foreground break-words">
                    {detail.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {file.url && (
            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground mb-2">File URL:</p>
              <p className="text-xs font-mono bg-muted p-2 rounded break-all">
                {file.url}
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
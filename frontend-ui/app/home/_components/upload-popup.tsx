"use client";

import { useEffect, useState } from "react";
import {
  X,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUploadStore } from "../_context/upload-context";

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

function formatTimeRemaining(seconds?: number): string | null {
  if (!seconds || seconds <= 0) return null;
  if (seconds < 60) return `About ${seconds} seconds remaining...`;
  const minutes = Math.floor(seconds / 60);
  return `About ${minutes} minutes remaining...`;
}

export function UploadPopup() {
  const { uploads, cancelUpload, removeUpload, clearCompleted } =
    useUploadStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isVisible, setIsVisible] = useState(uploads.length > 0);

  const activeUploads = uploads.filter((u) => u.status === "uploading");
  const completedUploads = uploads.filter((u) => u.status === "completed");

  useEffect(() => {
    if (uploads.length > 0) {
      setIsVisible(true);
    }
  }, [uploads.length]);
  if (uploads.length === 0 || !isVisible) {
    return null;
  }

  const uploadingCount = activeUploads.length;

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      className="fixed bottom-6 right-6 z-50 w-[380px] shadow-2xl rounded-lg border border-border bg-card overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-sm text-foreground">
            {uploadingCount > 0
              ? `Uploading ${uploadingCount} items`
              : `${completedUploads.length} items uploaded`}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="max-h-[400px] overflow-y-auto">
          {/* Time remaining summary */}
          {Boolean(
            activeUploads.length > 0 && activeUploads[0].timeRemaining
          ) && (
            <div className="px-4 py-2 flex items-center justify-between text-sm border-b border-border">
              <span className="text-muted-foreground">
                {formatTimeRemaining(activeUploads[0].timeRemaining)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-primary hover:text-primary"
                onClick={() => activeUploads.forEach((u) => cancelUpload(u.id))}
              >
                Cancel all
              </Button>
            </div>
          )}

          {/* Upload items */}
          <div className="divide-y divide-border">
            {uploads.map((upload) => (
              <div
                key={upload.id}
                className="px-4 py-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="mt-0.5">
                    {upload.status === "uploading" && (
                      <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    )}
                    {upload.status === "completed" && (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    )}
                    {(upload.status === "error" ||
                      upload.status === "cancelled") && (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        {upload.fileName}
                      </p>
                      {upload.status === "uploading" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs text-primary hover:text-primary shrink-0"
                          onClick={() => cancelUpload(upload.id)}
                        >
                          Cancel
                        </Button>
                      )}
                      {(upload.status === "completed" ||
                        upload.status === "error" ||
                        upload.status === "cancelled") && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0"
                          onClick={() => removeUpload(upload.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </div>

                    {/* Progress bar */}
                    {upload.status === "uploading" && (
                      <div className="space-y-1">
                        <Progress value={upload.progress} className="h-1" />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{Math.round(upload.progress)}%</span>
                          <span>{formatFileSize(upload.fileSize)}</span>
                        </div>
                      </div>
                    )}

                    {/* Status messages */}
                    {upload.status === "completed" && (
                      <p className="text-xs text-muted-foreground">
                        Upload completed • {formatFileSize(upload.fileSize)}
                      </p>
                    )}
                    {upload.status === "cancelled" && (
                      <p className="text-xs text-destructive">Cancelled</p>
                    )}
                    {upload.status === "error" && (
                      <p className="text-xs text-destructive">
                        {upload.error || "Upload failed"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Clear completed button */}
          {completedUploads.length > 0 && activeUploads.length === 0 && (
            <div className="px-4 py-3 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-transparent"
                onClick={clearCompleted}
              >
                Clear completed
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Collapsed view */}
      {!isExpanded && (
        <div className="px-4 py-2 text-sm text-muted-foreground">
          {uploadingCount > 0 ? (
            <span>{uploadingCount} uploading</span>
          ) : (
            <span>{completedUploads.length} completed</span>
          )}
        </div>
      )}
    </div>
  );
}

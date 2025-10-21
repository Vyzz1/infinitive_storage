"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FileViewerFactory } from "@/lib/file-viewer-factory";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Loader2 } from "lucide-react";
import { formatFileSize } from "@/lib/utils";

export default function PreviewPage() {
  const params = useParams();
  const router = useRouter();
  const fileId = params.fileId as string;

  const [file, setFile] = useState<FileDbItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (fileId) {
      setIsLoading(true);

      const storedFile = sessionStorage.getItem(`file_${fileId}`);

      if (storedFile) {
        try {
          const fileData = JSON.parse(storedFile);
          setFile(fileData);
        } catch (error) {
          console.error("Failed to parse file data:", error);
        }
      }

      setIsLoading(false);
    }
  }, [fileId]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading file...</p>
        </div>
      </div>
    );
  }

  if (!file) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 max-w-md text-center px-4">
          <div className="text-6xl">😕</div>
          <h1 className="text-2xl font-bold">File Not Found</h1>
          <p className="text-muted-foreground">
            The file you&apos;re looking for doesn&apos;t exist or the preview
            link has expired.
          </p>
          <p className="text-sm text-muted-foreground">
            Please go back to home and double-click the file again to preview.
          </p>
          <Button onClick={() => router.push("/home")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const viewerObj = FileViewerFactory.getViewerForFile(file);
  const ViewerComponent = viewerObj.component;

  const handleDownload = () => {
    fetch(file.url)
      .then((res) => res.blob())
      .then((blob) => {
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
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold truncate">
                {file.fileName}
              </h1>
              <p className="text-sm text-muted-foreground">
                {formatFileSize(file.size)} • {file.extension.toUpperCase()} •{" "}
                {file.type}
              </p>
            </div>
          </div>

          <Button variant="default" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        <ViewerComponent />
      </main>
    </div>
  );
}

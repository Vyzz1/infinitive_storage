import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FileAudio, FileText } from "lucide-react";
import { formatFileSize } from "./utils";
import Image from "next/image";

interface FileViewerComponent {
  component: React.FC;
}

export class FileViewerFactory {
  static getViewerForFile(file: FileDbItem): FileViewerComponent {
    const ext = file.extension.toLowerCase();

    if (["xlsx", "xls", "doc", "docx", "ppt", "pptx"].includes(ext)) {
      return { component: () => <MicrosoftOfficeViewer file={file} /> };
    }

    if (ext === "pdf") {
      return { component: () => <PDFViewer file={file} /> };
    }

    if (["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(ext)) {
      return { component: () => <ImageViewer file={file} /> };
    }

    if (["mp4", "webm", "ogg", "mov", "avi"].includes(ext)) {
      return { component: () => <VideoViewer file={file} /> };
    }

    if (["mp3", "wav", "ogg", "m4a", "aac"].includes(ext)) {
      return { component: () => <AudioViewer file={file} /> };
    }

    if (
      [
        "js",
        "jsx",
        "ts",
        "tsx",
        "py",
        "java",
        "cpp",
        "c",
        "css",
        "html",
        "json",
        "xml",
        "sql",
        "sh",
        "md",
        "yml",
        "yaml",
        "go",
        "rb",
        "php",
        "rs",
        "swift",
        "kt",
        "ex",
      ].includes(ext)
    ) {
      return { component: () => <CodeViewer file={file} /> };
    }

    return { component: () => <DefaultViewer file={file} /> };
  }
}

const MicrosoftOfficeViewer: React.FC<{ file: FileDbItem }> = ({ file }) => {
  const officeUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
    file.url
  )}`;

  return (
    <div className="w-full h-full">
      <iframe
        src={officeUrl}
        className="w-full h-full border-0"
        title={file.fileName}
        allowFullScreen
      />
    </div>
  );
};

const PDFViewer: React.FC<{ file: FileDbItem }> = ({ file }) => {
  return (
    <div className="w-full h-full">
      <iframe
        src={`${file.url}#view=FitH&toolbar=0`}
        className="w-full h-full border-0"
        title={file.fileName}
      />
    </div>
  );
};

const ImageViewer: React.FC<{ file: FileDbItem }> = ({ file }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black/90 rounded-lg overflow-hidden">
      <Image
        src={file.url}
        alt={file.fileName}
        fill
        style={{ objectFit: "contain" }}
      />
    </div>
  );
};

const VideoViewer: React.FC<{ file: FileDbItem }> = ({ file }) => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-black rounded-lg overflow-hidden">
      <video
        controls
        className="max-w-full max-h-full"
        src={file.url}
        preload="metadata"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

const AudioViewer: React.FC<{ file: FileDbItem }> = ({ file }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 p-8">
      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
        <FileAudio className="w-16 h-16 text-primary" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">{file.fileName}</h3>
        <p className="text-sm text-muted-foreground">
          {file.extension.toUpperCase()} Audio File •{" "}
          {formatFileSize(file.size)}
        </p>
      </div>
      <audio controls className="w-full max-w-md" src={file.url}>
        Your browser does not support the audio tag.
      </audio>
    </div>
  );
};

const CodeViewer: React.FC<{ file: FileDbItem }> = ({ file }) => {
  const [code, setCode] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetch(file.url)
      .then((res) => res.text())
      .then((text) => setCode(text))
      .catch(() => setCode("Unable to load code"))
      .finally(() => setIsLoading(false));
  }, [file.url]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading code...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-auto rounded-lg">
      <SyntaxHighlighter
        language={file.extension}
        style={vscDarkPlus}
        showLineNumbers
        customStyle={{
          margin: 0,
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
          height: "100%",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

const DefaultViewer: React.FC<{ file: FileDbItem }> = ({ file }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8">
      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-muted-foreground/20 to-muted-foreground/5 flex items-center justify-center">
        <FileText className="w-16 h-16 text-muted-foreground" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">{file.fileName}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {file.extension.toUpperCase()} File • {formatFileSize(file.size)}
        </p>
        <p className="text-sm text-muted-foreground">
          Preview not available for this file type
        </p>
      </div>
    </div>
  );
};

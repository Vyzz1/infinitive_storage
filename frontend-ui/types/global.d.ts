declare type FileDbItem = {
  id: string;
  url: string;
  fileName: string;
  type: "image" | "video" | "document" | "other" | "audio" | "pdf" | null;
  extension: string;
  createdAt: Date;
  updatedAt: Date;
  location: string;
  folderId: string | null;
  size: number;
  thumbnail: string | null;
};

declare type FolderDbItem = {
  id: string;
  name: string;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
  parentId: string;
  location: string | null;
};

import { create } from "zustand";

interface FolderStore {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useFolderStore = create<FolderStore>((set) => ({
  open: false,
  setOpen: (open: boolean) => set({ open }),
}));

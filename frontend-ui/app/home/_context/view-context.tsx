import { create } from "zustand";

interface ViewContext {
  view: "grid" | "list";
  setView: (view: "grid" | "list") => void;
}

export const useViewStore = create<ViewContext>((set) => ({
  view: "grid",
  setView: (view: "grid" | "list") => set({ view }),
}));

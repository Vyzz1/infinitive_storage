import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface ViewContext {
  view: "grid" | "list";
  setView: (view: "grid" | "list") => void;
}

export const useViewStore = create<ViewContext>()(
  persist(
    (set) => ({
      view: "grid",
      setView: (view: "grid" | "list") => set({ view }),
    }),
    {
      name: "view-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

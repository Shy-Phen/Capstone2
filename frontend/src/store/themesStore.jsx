import { create } from "zustand";

export const themeStore = create((set) => ({
  theme: localStorage.getItem("preferred-theme") || "night",
  setTheme: (theme) => {
    localStorage.setItem("preferred-theme", theme);
    set({ theme });
  },
}));

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
    theme: "dark" | "light";
    isSidebarOpen: boolean;
    setTheme: (theme: "dark" | "light") => void;
    toggleSidebar: () => void;
    closeSidebar: () => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set) => ({
            theme: "dark",
            isSidebarOpen: false,
            setTheme: (theme) => {
                set({ theme });
            },
            toggleSidebar: () =>
                set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
            closeSidebar: () => set({ isSidebarOpen: false }),
        }),
        { name: "ui-storage" }
    )
);

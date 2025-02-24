import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<State>()(persist((set) => {
    return {
        theme: "system",
        setTheme: (theme: Theme) => {
            set((state: State) => {
                return {
                    ...state,
                    theme
                }
            });
        },
    }
}, {
    name: "theme",
}));
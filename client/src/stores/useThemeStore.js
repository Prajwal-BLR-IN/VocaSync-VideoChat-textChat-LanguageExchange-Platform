import { create } from 'zustand'

export const useThemeStore = create((set, get) => ({
    theme: "light",
    setTheme: theme => {
        set({theme}),
        localStorage.setItem("VocaSync_theme", theme),
        document.documentElement.classList.remove("light", "dark"),
        document.documentElement.classList.add(theme)
    },
    toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === "dark" ? "light": "dark";
        get().setTheme(newTheme);
    }
}))
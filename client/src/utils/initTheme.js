import { useThemeStore } from "../stores/useThemeStore";

export const initTheme = () => {
    const savedTheme = localStorage.getItem("VocaSync_theme");

    if (savedTheme) { 
        useThemeStore.getState().setTheme(savedTheme); 
    } else {
        const preferedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
        useThemeStore.getState().setTheme(preferedTheme? "dark": "light");
    }
}
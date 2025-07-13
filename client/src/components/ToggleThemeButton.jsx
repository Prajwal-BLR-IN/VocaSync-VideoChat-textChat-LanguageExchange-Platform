import { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { useThemeStore } from "../stores/useThemeStore";

const ToggleThemeButton = () => {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const [fade, setFade] = useState(false);
  const [icon, setIcon] = useState(theme === "dark" ? assets.darkIcon : assets.lightIcon);

  useEffect(() => {
    setFade(true); // start fade out

    const timeout = setTimeout(() => {
      setIcon(theme === "dark" ? assets.darkIcon : assets.lightIcon);
      setFade(false); // fade in
    }, 150); // half of total transition duration

    return () => clearTimeout(timeout);
  }, [theme]);

  return (
    <button onClick={toggleTheme}>
      <img
        src={icon}
        alt="theme icon"
        className={`theme-icon ${fade ? "fade-out" : ""}`}
      />
    </button>
  );
};

export default ToggleThemeButton;

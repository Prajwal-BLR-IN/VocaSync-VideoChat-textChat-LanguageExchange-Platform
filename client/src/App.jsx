import React, { useEffect, useState } from "react";
import "./index.css";
import { Route, Routes } from "react-router-dom";
import Home from './pages/Home'
import Login from './pages/Login'
import NotFound from "./pages/NotFound";
import toast, {Toaster} from 'react-hot-toast'

function App() {
  const getInitialTheme = () => {
    const stored = localStorage.getItem("theme");
    if (stored) return stored;
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return systemPrefersDark ? "dark" : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <>
    <Toaster />
    <button onClick={() => toast.success("Hey look me")} >click here</button>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={ <Login /> } />
      <Route path="*" element={ <NotFound /> } />
    </Routes>
    </>
  );
}

export default App;

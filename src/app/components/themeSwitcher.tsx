// We indicate that this file is a component running on the client, which allows hooks to be used.
"use client";

import { Button } from "@nextui-org/react";

// We import the hook useTheme from 'next-themes', a library that facilitates theme management (dark/light).
import { useTheme } from "next-themes";
import { FaLightbulb } from "react-icons/fa6";

export default function ThemeSwitcher() {
  //setTheme is a function to change the theme.
  const { theme, setTheme } = useTheme();

  return (
    //If the theme is equal to dark then the theme will change to light, otherwise it will change to light.
    //will change to dark.

    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="
      fixed 
      bottom-5 
      right-5 
      bg-yellow-500 
      rounded-full 
      w-12 
      h-12 
      flex 
      items-center 
      justify-center 
      shadow-md 
      hover:bg-yellow-400 
      focus:outline-none  
      focus:ring-yellow-300
      z-[9999]
    "
      aria-label="Activar función"
    >
      <FaLightbulb size={25} />
    </button>
  );
}

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

// Custom hook to handle dark mode
const useDarkMode = () => {
  // Get the current theme and the function to change the theme from the useTheme hook of next-themes
  const { theme, setTheme } = useTheme();
  // State to check if the component is mounted
  const [mounted, setMounted] = useState(false);

  // useEffect to set the mounted state to true when the component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // useEffect to apply the dark or light theme based on the user's preference
  useEffect(() => {
    if (mounted) {
      // Check if the user prefers dark mode
      const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (isDarkMode) {
        // If the user prefers dark mode, set the theme to "dark"
        setTheme("dark");
      } else {
        // If the user prefers light mode, set the theme to "light"
        setTheme("light");
      }
    }
  }, [mounted, setTheme]);

  // Return the current theme and the mounted state
  return { theme, mounted };
};

export default useDarkMode;

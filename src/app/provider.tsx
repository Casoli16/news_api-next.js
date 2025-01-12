// The use client directive is used, to specify that everything will be run client-side.
"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import useDarkMode from "../hooks/useDarkMode";

export function Providers({ children }: { children: React.ReactNode }) {
  //Hook to manage the change of theme
  const { mounted } = useDarkMode();

  // Prevent rendering until the hook is mounted.
  if (!mounted) return null;

  return (
    //Wraps the entire NextUIProvider component inside the NextThemeProvider so that it can be applied.
    //theme change on the site (dark mode / light mode)
    <NextThemesProvider attribute="class" defaultTheme="sytem">
      {/* Wraps the children component in a NextUIProvider so that the components of the library of Next UI works */}
      <NextUIProvider>{children}</NextUIProvider>
    </NextThemesProvider>
  );
}

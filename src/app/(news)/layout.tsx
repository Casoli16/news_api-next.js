"use client";

import { Providers } from "../provider";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ThemeSwitcher from "../../components/themeSwitcher";
import { TopMenu } from "@/src/components/ui/topMenu";
import { Footer } from "@/src/components/ui/footer";

interface SearchIconProps {
  size?: number;
  strokeWidth?: number;
  width?: number;
  height?: number;
  [key: string]: any;
}

export const SearchIcon: React.FC<SearchIconProps> = ({
  size = 24,
  strokeWidth = 1.5,
  width,
  height,
  ...props
}) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={height || size}
      role="presentation"
      viewBox="0 0 24 24"
      width={width || size}
      {...props}
    >
      <path
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
      <path
        d="M22 22L20 20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export default function WebLayout({ children }: { children: React.ReactNode }) {
  const [search, setSearch] = useState(""); // Estado para almacenar el texto del buscador
  const router = useRouter(); // Hook para manejar la navegación

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim()) {
      // Navega a la ruta con el término de búsqueda como query
      router.push(`/search/${encodeURIComponent(search)}`);
      setSearch("");
    }
  };

  return (
    <Providers>
      {/* NavBar */}
      <TopMenu />
      <div className="bg-white dark:bg-gray-800 text-black dark:text-white">
        {/* Button for the change of theme (Dark/Light)*/}
        <ThemeSwitcher />
        {children}
      </div>
      {/* Footer */}
      <Footer />
    </Providers>
  );
}

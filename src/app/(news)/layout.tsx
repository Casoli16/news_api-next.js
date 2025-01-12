"use client";

import Link from "next/link";
import { Providers } from "../provider";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Input,
} from "@nextui-org/react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ThemeSwitcher from "../../components/themeSwitcher";
import { TopMenu } from "@/src/components/ui/topMenu";

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
      <TopMenu />
      <div className="bg-white dark:bg-gray-800 text-black dark:text-white">
        <div className="flex flex-row justify-end pr-4 pt-4 sm:pr-8 sm:pt-8">
          <ThemeSwitcher />
        </div>
        {children}
      </div>
      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 text-black dark:text-white pt-5">
        <div className="flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-56 p-5">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image src={"/icon.png"} alt="logo" width={60} height={10} />
          </div>

          {/* Título principal */}
          <div className="text-center lg:text-left">
            <p className="text-2xl font-bold">Breaking News</p>
            <p>Las noticias más actuales a nivel mundial</p>
          </div>

          {/* Categorías */}
          <div className="text-center lg:text-left">
            <p className="text-lg font-bold">
              Descubre las noticias de tu gusto
            </p>
            <div className="flex flex-col gap-1">
              <p>Entretenimiento</p>
              <p>Salud</p>
              <p>Tecnología</p>
              <p>Negocios</p>
              <p>Ciencias</p>
            </div>
          </div>
        </div>
        <p className="text-center p-5 text-sm">
          © 2025 Breaking News. All Rights Reserved.
        </p>
      </footer>
    </Providers>
  );
}

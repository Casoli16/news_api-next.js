//Import the different components that will be used to structure the top-menu.
import {
  Input,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ThemeSwitcher from "../themeSwitcher";

//We write the data we expect to be returned to structure the iconSearch
interface SearchIconProps {
  size?: number;
  strokeWidth?: number;
  width?: number;
  height?: number;
  [key: string]: any;
}

//Component is created that will allow to use the svg icon occupied in the input.
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

export const TopMenu = () => {
  const [search, setSearch] = useState(""); // State to store the browser text
  const router = useRouter(); // Hook to manage navigation

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // If the key pressed is enter, the code will be executed.
    if (e.key === "Enter" && search.trim()) {
      // Navigates to the path with the search term as query
      router.push(`/search/${encodeURIComponent(search)}`);
      // The value of search will be cleared
      setSearch("");
    }
  };

  return (
    // Top-Menu
    <Navbar isBordered className="dark:bg-gray-900 text-black dark:text-white">
      <NavbarContent justify="start">
        <NavbarBrand>
          <Image
            src={"/icon.png"}
            width={30}
            height={30}
            alt="icon"
            className="mr-5"
          />
          <Link href={"../"}>
            <p className="hidden sm:block font-bold text-inherit text-xl">
              Breaking news
            </p>
          </Link>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-3 ml-16">
          <NavbarItem>
            <Link
              color="foreground"
              href="/category/technology"
              className="hover:bg-slate-300 p-2 rounded-lg"
            >
              Tecnología
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              href="/category/health"
              className="hover:bg-slate-300 p-2 rounded-lg"
            >
              Salud
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              color="foreground"
              href="/category/entertainment"
              className="hover:bg-slate-300 p-2 rounded-lg"
            >
              Entretenimiento
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              color="foreground"
              href="/category/science"
              className="hover:bg-slate-300 p-2 rounded-lg"
            >
              Ciencias
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link
              color="foreground"
              href="/category/business"
              className="hover:bg-slate-300 p-2 rounded-lg"
            >
              Negocios
            </Link>
          </NavbarItem>
        </NavbarContent>
      </NavbarContent>

      {/* Input */}
      <NavbarContent
        as="div"
        justify="center"
        className="flex items-center gap-12"
      >
        <Input
          classNames={{
            base: "max-w-full sm:max-w-[50rem] h-10",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper:
              "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Buscar..."
          size="sm"
          startContent={<SearchIcon size={18} />}
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </NavbarContent>
    </Navbar>
  );
};

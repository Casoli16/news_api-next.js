import Link from "next/link";
import Image from "next/image";

export const Footer = () => {
  return (
    // We apply tailwind classes that will allow to change the colours when changing the theme.
    <footer className="bg-gray-100 dark:bg-gray-900 text-black dark:text-white pt-5">
      <div className="flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-56 p-5">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="../">
            <Image src={"/icon.png"} alt="logo" width={60} height={10} />
          </Link>
        </div>

        {/* Título principal */}
        <div className="text-center lg:text-left">
          <p className="text-2xl font-bold">Breaking News</p>
          <p>Las noticias más actuales a nivel mundial</p>
        </div>

        {/* Categorías */}
        <div className="text-center lg:text-left">
          <p className="text-lg font-bold">Descubre las noticias de tu gusto</p>
          <div className="flex flex-col gap-1">
            <Link color="foreground" href="/category/technology">
              Tecnología
            </Link>
            <Link href="/category/health">Salud</Link>
            <Link color="foreground" href="/category/entertainment">
              Entretenimiento
            </Link>
            <Link color="foreground" href="/category/science">
              Ciencias
            </Link>
            <Link color="foreground" href="/category/business">
              Negocios
            </Link>
          </div>
        </div>
      </div>
      <p className="text-center p-5 text-sm">
        © 2025 Breaking News. All Rights Reserved.
      </p>
    </footer>
  );
};

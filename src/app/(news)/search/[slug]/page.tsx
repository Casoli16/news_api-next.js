"use client";

import { useEffect, useState } from "react";
import { Input } from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";
import { HorizontalCard } from "@/src/components/cards/horizontalCard";
import { Loading } from "@/src/components/loadComponent";
import { NewsInterface } from "@/src/interfaces/NewsInterface";
import { useRouter } from "next/navigation";

// Describimos cómo debe ser el parámetro que recibe esta pantalla.
interface Props {
  params: Promise<{
    slug: string;
  }>;
}

// Describimos cómo se debería recibir la respuesta de la API.
interface ApiResponse {
  articles: NewsInterface[]; // La estructura de los datos a recibir se encuentra en NewsInterface[].
}

export default function SearchPage({ params }: Props) {
  const [search, setSearch] = useState<string | null>(null); // Estado real que dispara la búsqueda
  const [inputValue, setInputValue] = useState<string | null>(null); // Estado del input
  const [data, setData] = useState<NewsInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchParams = async () => {
      if ((await params).slug) {
        const { slug } = await params;
        const decodedSlug = decodeURIComponent(slug as string);
        setSearch(decodedSlug);
        setInputValue(decodedSlug); // Sincroniza el input inicial con el parámetro
      } else {
        console.error("El parámetro slug es nulo o no está definido");
      }
    };

    fetchParams();
  }, [params]);

  useEffect(() => {
    const fetchData = async () => {
      const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
      if (!apiKey) throw new Error("API key is missing");

      try {
        const response = await fetch(
          `https://newsapi.org/v2/everything?q="${encodeURIComponent(
            search || ""
          )}"&apiKey=${apiKey}&pageSize=20`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }

        const jsonData: ApiResponse = await response.json();

        setData(jsonData.articles);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (search) {
      fetchData();
    }
  }, [search]);

  // Implementación de debouncing
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(inputValue); // Actualiza el estado `search` solo después de un retraso
    }, 600); // Espera 500ms después de que el usuario deje de escribir

    return () => clearTimeout(handler); // Limpia el temporizador en cada cambio
  }, [inputValue]);

  useEffect(() => {
    if (search) {
      router.push(`/search/${encodeURIComponent(search)}`);
    }
  }, [search, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center h-screen text-center p-5">
        <p className="text-xl font-bold">
          Ha ocurrido un error al cargar los datos
        </p>
        <p className=" text-slate-500">
          Por favor intentalo nuevamente más tarde
        </p>
        <p className="text-sm mt-2">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="pl-16 pt-8 pb-12">
        <div className="flex flex-row items-center gap-3">
          <FaSearch />
          <p className="text-xl font-bold">Resultados de tu búsqueda</p>
        </div>
        <div className="flex w-10/12 mt-4">
          <div className="flex w-full flex-wrap items-end md:flex-nowrap mb-6 md:mb-0 gap-4">
            <Input
              placeholder="Buscar en Breaking News..."
              type="search"
              value={inputValue || ""}
              onChange={(e) => setInputValue(e.target.value)} // Actualiza solo el valor del input
            />
          </div>
        </div>
        {data.length === 0 ? (
          <div className="flex flex-col items-center p-20">
            <p className="sm:text-md md:text-xl font-bold mb-5 text-center">
              No se encontraron resultados para tu búsqueda.
            </p>
            <FaSearch size={30} />
          </div>
        ) : (
          data.map((item, index) => (
            <div key={index}>
              <Link href={{ pathname: "/news", query: { title: item.title } }}>
                <HorizontalCard data={[item]} />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

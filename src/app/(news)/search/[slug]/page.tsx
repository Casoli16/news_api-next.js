"use client";

import { useEffect, useState } from "react";
import { Input } from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";
import { HorizontalCard } from "@/src/components/cards/horizontalCard";
import { Loading } from "@/src/components/loadComponent";
import { NewsInterface } from "@/src/interfaces/NewsInterface";
import { useRouter } from "next/navigation";

// We describe what the parameter that this screen receives should look like.
interface Props {
  params: Promise<{
    slug: string;
  }>;
}

// We describe how the API response should be received.
interface ApiResponse {
  articles: NewsInterface[]; // The structure of the data to be received is in NewsInterface[].
}

export default function SearchPage({ params }: Props) {
  const [search, setSearch] = useState<string | null>(null); // Initial search status
  const [inputValue, setInputValue] = useState<string | null>(null); // Initial state of input
  const [data, setData] = useState<NewsInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  //Hook for routing management
  const router = useRouter();

  useEffect(() => {
    const fetchParams = async () => {
      if ((await params).slug) {
        const { slug } = await params;
        //The parameter sent by the url is decoded.
        const decodedSlug = decodeURIComponent(slug as string);
        setSearch(decodedSlug);
        setInputValue(decodedSlug); // Synchronise the search input with the parameter
      } else {
        console.error("El parámetro slug es nulo o no está definido");
      }
    };

    fetchParams();
  }, [params]);

  useEffect(() => {
    // Function that sends the request to the API
    const fetchData = async () => {
      // We access the API key.
      const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;
      // Check if the API key is OK, otherwise send the error message
      if (!apiKey) throw new Error("API key is missing");

      try {
        // We send the API request
        const response = await fetch(
          `https://newsapi.org/v2/everything?q="${encodeURIComponent(
            search || ""
          )}"&apiKey=${apiKey}&pageSize=20`
        );

        // We check if the API response came OK, if not we send a message with the status received from the API.
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }

        // We convert the API response to JSON format.
        const jsonData: ApiResponse = await response.json();

        // We return the data received from the API.
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
  }, [search]); // Runs every time the search status changes value.

  // Implementation of debouncing, to avoid too many requests being sent each time you type in the search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(inputValue); // Update search`status only after a delay
    }, 600); // Wait 500ms after user stops typing

    return () => clearTimeout(handler); // Clears the timer at each change
  }, [inputValue]);

  useEffect(() => {
    //Check if there is a value for search, if so then the value of search will also be changed in the url.
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
      <div className="pl-16 pt-12 pb-12">
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
              onChange={(e) => setInputValue(e.target.value)} // Update only the value of the input
            />
          </div>
        </div>
        {data.length === 0 ? (
          <div className="flex flex-col items-center p-20">
            <p className="sm:text-md md:text-xl font-bold mb-5 text-center">
              No se encontraron resultados para tu búsqueda.
            </p>
            {/* Icon */}
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

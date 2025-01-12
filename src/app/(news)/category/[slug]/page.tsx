// To be executed client-side
"use client";

import { HorizontalCard } from "@/src/components/cards/horizontalCard";
import { Loading } from "@/src/components/loadComponent";
import { NewsInterface } from "@/src/interfaces/NewsInterface";
import Link from "next/link";
import { useEffect, useState } from "react";

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

// Screen receiving a parameter (Described in the Props interface).
export default function CategoryPage({ params }: Props) {
  // State management
  const [category, setCategory] = useState<string | null>(null);
  const [data, setData] = useState<NewsInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [spanishCategory, setSpanishCategory] = useState<string | null>(null);

  useEffect(() => {
    // Function that assigns the `slug` parameter to the `category` state.
    const fetchParams = async () => {
      if ((await params).slug) {
        const { slug } = await params; // We unpack the promise
        setCategory(slug); // We store the received parameter in the category state.
      } else {
        console.error("El parámetro slug es nulo o no está definido");
      }
    };

    fetchParams();
  }, [params]);

  // Change the category name to English.
  useEffect(() => {
    if (category) {
      switch (category) {
        case "health":
          setSpanishCategory("Salud");
          break;
        case "technology":
          setSpanishCategory("Tecnología");
          break;
        case "entertainment":
          setSpanishCategory("Entretenimiento");
          break;
        case "science":
          setSpanishCategory("Ciencias");
          break;
        case "business":
          setSpanishCategory("Negocios");
          break;
        default:
          console.warn("La categoría enviada no existe");
      }
    }
  }, [category]);

  // Make the API request.
  useEffect(() => {
    //Checks if a category exists to send the request to the api
    if (category) {
      const fetchData = async () => {
        setLoading(true);
        // The variable containing the apiKey is accessed.
        const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;

        // Check if the apiKey exists.
        if (!apiKey) {
          setError("La api key no existe");
          setLoading(false);
          return;
        }

        // Petition to the api (required two params, category and apiKey)
        try {
          const response = await fetch(
            `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${apiKey}&pageSize=20`
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

      fetchData();
    }
  }, [category]);

  //While the loading status is set to true, the loading component will be displayed.
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }


  //While the error status is set to true, a error message will be display
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
    <div className="pl-16 pt-12 pb-14">
      <p className="text-sm">Categoría</p>
      <p className="text-2xl text-slate-600 font-bold">{spanishCategory}</p>
      {data.map((item, index) => (
        <div key={index}>
          <Link
            href={{
              pathname: "/news",
              query: {
                title: item.title,
              },
            }}
          >
            {/* Component that will load the letters with the information received from the api / required an array*/}
            <HorizontalCard data={[item]} />
          </Link>
        </div>
      ))}
    </div>
  );
}

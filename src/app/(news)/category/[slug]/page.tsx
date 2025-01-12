"use client";

import { HorizontalCard } from "@/src/app/components/cards/horizontalCard";
import { Loading } from "@/src/app/components/loadComponent";
import { NewsInterface } from "@/src/interfaces/NewsInterface";
import Link from "next/link";
import { useEffect, useState } from "react";

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

// Pantalla que recibe un parámetro (Descrito en la interfaz Props).
export default function CategoryPage({ params }: Props) {
  const [category, setCategory] = useState<string | null>(null);
  const [data, setData] = useState<NewsInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [spanishCategory, setSpanishCategory] = useState<string | null>(null);

  // Asignar el parámetro `slug` al estado `category`.
  useEffect(() => {
    const fetchParams = async () => {
      if ((await params).slug) {
        const { slug } = await params; // Desempaquetamos la promesa
        setCategory(slug); // Guardamos el parametro recibido en el estado category
      } else {
        console.error("El parámetro slug es nulo o no está definido");
      }
    };

    fetchParams();
  }, [params]);

  // Cambia el nombre de la categoría a español.
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

  // Hacer la solicitud a la API.
  useEffect(() => {
    if (category) {
      const fetchData = async () => {
        setLoading(true);
        const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;

        if (!apiKey) {
          setError("API key is missing");
          setLoading(false);
          return;
        }

        try {
          const response = await fetch(
            `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${apiKey}&pageSize=20`
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-xl font-bold">
          Ha ocurrido un error al cargar los datos
        </h1>
        <p className="text-sm text-slate-500">
          Por favor intentalo nuevamente más tarde
        </p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="pl-16 pt-5 pb-14">
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
            <HorizontalCard data={[item]} />
          </Link>
        </div>
      ))}
    </div>
  );
}

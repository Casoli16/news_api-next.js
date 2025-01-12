"use client";

import { useEffect, useState } from "react";
import { NewsInterface } from "@/src/interfaces/NewsInterface";
import { Button } from "@nextui-org/button";
import { VerticalCard } from "../components/cards/verticalCard";
import { Card, CardHeader, CardFooter, Image } from "@nextui-org/react";
import { StaticCard } from "../components/cards/statitCard";
import Link from "next/link";
import { url } from "inspector";
import { Loading } from "../components/loadComponent";

//Describimos como se deberia recibir la respuesta de la api
interface ApiResponse {
  articles: NewsInterface[]; //La estructura de los datos a recibir se encuentra en NewInterface[];
}

//Función que manda la petición a la api
const fetchNews = async (category: string) => {
  //Accedemos a la api key.
  const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;

  //Revisamos si la api key viene bien, de lo contrario envia el mensaje de error
  if (!apiKey) {
    throw new Error("API key is missing");
  }

  //Enviamos la petición para la api
  const response = await fetch(
    `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${apiKey}&pageSize=20`
  );

  //Verificamos si la respuesta de la api vino bien, de lo contrario mandamos un mensaje con el estatus recibido de la api
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  //Convertimos la respuesta de la api a formato json
  const jsonData: ApiResponse = await response.json();

  //Retornamos la data recibida de la api
  return jsonData.articles;
};

export default function Page() {
  const [data, setData] = useState<NewsInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  //UseEffect Se ejecuta al cargar la web
  useEffect(() => {
    //Funcion encargada de manejar el llamado a la funcion fetchNews();
    const fetchData = async () => {
      try {
        const categories = ["technology", "sports"];
        const promises = categories.map((category) => fetchNews(category));
        const results = await Promise.all(promises);
        const combinedData = results.flat();
        setData(combinedData);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    <div className="p-4 pb-10  md:pl-16 md:pb-20">
      <p className="text-xl md:text-2xl font-bold">
        Las últimas noticias internacionales y nacionales
      </p>
      <p className="text-sm md:text-base">
        Encuentra las noticias del último momento.
      </p>
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 mt-6 lg:mt-8">
        {/* Sección principal de noticias */}
        <div className="w-full lg:w-3/4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
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
                  <VerticalCard data={[item]} />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Sección de categorías */}
        <div className="w-full lg:w-1/4">
          <h2 className="text-lg md:text-xl font-bold mb-4">Categorías</h2>
          <div className="grid grid-cols-1 gap-4">
            <StaticCard
              title="Entretenimiento"
              image="/cards/entertaiment.jpg"
              path="/category/entertainment"
              color="dark"
            />
            <StaticCard
              title="Salud"
              image="/cards/health.jpeg"
              path="/category/health"
              color="white"
            />
            <StaticCard
              title="Tecnología"
              image="/cards/tecnology.jpg"
              path="/category/technology"
              color="white"
            />
            <StaticCard
              title="Negocios"
              image="/cards/bussiness.jpg"
              path="/category/business"
              color="white"
            />
            <StaticCard
              title="Ciencias"
              image="/cards/scient.jpg"
              path="/category/science"
              color="white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { NewsInterface } from "@/src/interfaces/NewsInterface";
import { VerticalCard } from "@/src/components/cards/verticalCard";
import { StaticCard } from "@/src/components/cards/statitCard";
import Link from "next/link";
import { Loading } from "../../components/loadComponent";

//We write how the response should be received from the api
interface ApiResponse {
  articles: NewsInterface[]; //The structure of the data to be received is in NewInterface[];
}

export default function Page() {
  const [data, setData] = useState<NewsInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  //UseEffect runs when loading the website
  useEffect(() => {
    //Function sending the request to the api
    const fetchNews = async () => {
      //Accedemos a la api key.
      const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;

      //Check if the api key is OK, otherwise it sends the error message
      if (!apiKey) {
        throw new Error("API key is missing");
      }

      try {
        //Send the request for the api
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?category=general&apiKey=${apiKey}&pageSize=20`
        );

        //We check if the response from the api came OK, if not we send a message with the status received from the api.
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }

        //Convert api response to json format
        const jsonData: ApiResponse = await response.json();

        //Returning the data received from the api
        setData(jsonData.articles);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
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
    <div className="p-4 pt-12 pb-10  md:pl-16 md:pb-20">
      <p className="text-xl md:text-2xl font-bold">
        Las últimas noticias internacionales y nacionales
      </p>
      <p className="text-sm md:text-base">
        Encuentra las noticias del último momento.
      </p>
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 mt-6 lg:mt-8">
        {/* Main news section */}
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

        {/* Category section */}
        <div className="w-full lg:w-1/4">
          <h2 className="text-lg md:text-xl font-bold mb-4">Categorías</h2>
          <div className="grid grid-cols-1 gap-4">
            <StaticCard
              title="Entretenimiento"
              image="/cards/entertainment.jpg"
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
              image="/cards/science.jpg"
              path="/category/science"
              color="white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

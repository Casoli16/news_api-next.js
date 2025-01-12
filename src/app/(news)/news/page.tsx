"use client";

import {
  Image,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { NewsInterface } from "@/src/interfaces/NewsInterface";
import { Loading } from "../../../components/loadComponent";
import {
  EmailIcon,
  EmailShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

import { FaClockRotateLeft, FaLink } from "react-icons/fa6";
import Link from "next/link";

// We describe how the API response should be received.
interface ApiResponse {
  articles: NewsInterface[]; // The structure of the data to be received is in NewsInterface[];
}

export default function DetailNewPage() {
  const searchParams = useSearchParams();

  // We get the title sent by the URL.
  const title = searchParams.get("title") || "";

  //Obtain the whole title without the part after the hyphen.
  const titleParts = title.split(" - ");
  const query = titleParts[0];

  // We get the first word of the title
  const relatedTitle = title.split(" ");
  const relatedQuery = relatedTitle.slice(0, 2).join(" ");

  const [currentUrl, setCurrentUrl] = useState("");
  const [data, setData] = useState<NewsInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedData, setRelatedData] = useState<NewsInterface[]>([]);

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  useEffect(() => {
    // Function that sends the request to the API
    const fetchData = async () => {
      // We access the API key.
      const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;

      // Check if the API key is OK, otherwise send the error message
      if (!apiKey) {
        throw new Error("API key is missing");
      }

      try {
        // We send the API request
        const response = await fetch(
          `https://newsapi.org/v2/everything?q="${encodeURIComponent(
            query
          )}"&searchIn=title&apiKey=${apiKey}&pageSize=1`
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

    fetchData();
  }, [title]);

  //Fetch which handles the request to fetch the related titles.
  useEffect(() => {
    // Function that sends the request to the API
    const fetchRelatedNews = async () => {
      // We access the API key.
      const apiKey = process.env.NEXT_PUBLIC_NEWS_API_KEY;

      // Check if the API key is OK, otherwise send the error message
      if (!apiKey) {
        throw new Error("API key is missing");
      }

      try {
        // We send the API request
        const response = await fetch(
          `https://newsapi.org/v2/everything?q="${encodeURIComponent(
            relatedQuery
          )}"&apiKey=${apiKey}&pageSize=8`
        );

        // We check if the API response came OK, if not we send a message with the status received from the API.
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }

        // We convert the API response to JSON format.
        const jsonData: ApiResponse = await response.json();

        // We return the data received from the API.
        setRelatedData(jsonData.articles);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedNews();
  }, []);

  //Function that allows to copy the url of the page to the clipboard.
  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        console.log("Enlace copiado correctamente");
      })
      .catch((err) => {
        console.error("Error al copiar el enlace: ", err);
      });
  };

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

  //In case the response from the api is correct, but does not come with data, the following message will be shown
  if (data.length === 0) {
    return (
      <div className="p-10 flex flex-col justify-center items-center h-screen text-center ">
        <p className="font-bold sm:text-md md:text-xl">
          Actualmente no se encuentran disponibles los datos de esta noticia
        </p>
        <p className="text-slate-600">
          Por favor intenta nuevamente más tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row p-4 sm:p-10 lg:pl-16 lg:pt-12 lg:pb-14 gap-8 lg:gap-12">
      {data.map((article, index) => {
        const date = new Date(article.publishedAt);
        //The date is converted to a more readable format.
        const formattedDate = date.toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          timeZoneName: "short",
        });

        return (
          <div className="w-full lg:w-4/6" key={index}>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              {article.title}
            </h1>
            <p className="text-sm sm:text-base">
              {article.description ||
                "Actualmente no se encuentra disponible la descripción de esta noticia."}
            </p>
            <p className="mt-4 text-slate-500">
              Por {article.author || "Breaking News"}
            </p>
            <div className="flex gap-2 items-center">
              <FaClockRotateLeft className="text-sm" />
              <p className="text-xs sm:text-sm">Publicado el {formattedDate}</p>
            </div>

            <div className="mt-4 flex gap-4 mb-4 items-center">
              <WhatsappShareButton title={article.title} url={currentUrl}>
                <WhatsappIcon size={28} round={true} />
              </WhatsappShareButton>
              <TwitterShareButton title={article.title} url={currentUrl}>
                <TwitterIcon size={28} round={true} />
              </TwitterShareButton>
              <EmailShareButton
                subject={title}
                body={currentUrl}
                url={currentUrl}
              >
                <EmailIcon size={28} round={true} />
              </EmailShareButton>
              <Popover placement="right-end">
                <PopoverTrigger>
                  <FaLink
                    onClick={copyToClipboard}
                    className="cursor-pointer text-xl sm:text-2xl md:text-3xl"
                  />
                </PopoverTrigger>
                <PopoverContent>
                  <div className="px-1 py-2">
                    <div className="text-sm">Enlace copiado</div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <Image
              alt="News image"
              className="object-cover mt-5 w-full"
              src={article.urlToImage || "/cards/newsLayer.png"}
              width={850}
            />
            <p className="mt-5 text-sm sm:text-base">{article.content}</p>
            <p className="mt-4 text-slate-500">Fuente:</p>
            <Link
              target="_blank"
              href={article.url || ""}
              className="mb-16 text-blue-600 text-sm sm:text-base"
            >
              Ir al sitio de publicación
            </Link>
          </div>
        );
      })}

      <div className="w-full lg:w-72">
        <p className="text-lg font-bold mb-3">Titulos relacionados</p>
        {relatedData.map((item, index) => (
          <Link
            key={index}
            href={{
              pathname: "/news",
              query: {
                title: item.title,
              },
            }}
          >
            <div>
              <div className="flex flex-col md:flex-row p-3 items-center gap-4">
                <div className="w-full md:w-32">
                  <Image
                    src={item.urlToImage || "/cards/newsLayer.png"}
                    className="object-cover w-full"
                    height={80}
                  />
                </div>
                <p className="font-bold w-full md:w-56 text-sm sm:text-base">
                  {item.title}
                </p>
              </div>
              <hr className="mb-5"></hr>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

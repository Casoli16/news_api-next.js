"use client";

import { NewsInterface } from "@/src/interfaces/NewsInterface";
import { Image } from "@nextui-org/react";

//We write what the data we expect to receive should look like.
interface CardProps {
  data: NewsInterface[];
}

//Component receiving an array of objects
export const HorizontalCard = ({ data }: CardProps) => {
  return (
    <div>
      {data.map((item, index) => {
        // Change the date to a more readable format.
        const date = new Date(item.publishedAt);
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
          <div key={index}>
            <div className="flex flex-col md:flex-row items-center mt-4 gap-4 md:gap-8 pt-5 lr-5 w-full md:w-10/12">
              <div className="w-full md:w-1/4">
                <p>{formattedDate}</p>
                <p className="text-sm text-sky-800">{item.author}</p>
              </div>
              <div className="w-full md:w-3/6">
                <p className="text-lg font-bold">{item.title}</p>
                <p>{item.description}</p>
              </div>
              <div className="w-full md:w-auto">
                <Image
                  src={item.urlToImage || "/cards/newsLayer.png"}
                  width={220}
                  height={120}
                />
              </div>
            </div>
            <hr className="w-full md:w-10/12 mt-4"></hr>
          </div>
        );
      })}
    </div>
  );
};

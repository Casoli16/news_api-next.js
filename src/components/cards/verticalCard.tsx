"use client";

import { NewsInterface } from "@/src/interfaces/NewsInterface";
import {
  Card,
  CardHeader,
  CardFooter,
  Image,
  Button,
  CardBody,
} from "@nextui-org/react";

interface CardProps {
  data: NewsInterface[];
}

export const VerticalCard = ({ data }: CardProps) => {
  return (
    <div>
      {data.map((item, index) => {
        // Split the description into words
        const splitWords = item.description?.split(" ");
        // Get the first nine words of the description
        const shortDescription = splitWords?.slice(0, 8).join(" ");
        return (
          <Card className="py-4" key={index}>
            <CardBody className="overflow-visible py-2">
              <Image
                alt="Card background"
                className="object-cover rounded-xl"
                src={item.urlToImage || "/cards/newsLayer.png"}
                width={270}
                height={155}
              />
            </CardBody>
            <hr />
            <CardHeader
              className="pb-0 pt-2 px-4 flex-col items-start"
              style={{ height: 260 }}
            >
              <h4 className="text-black dark:text-white font-bold text-large mb-2">
                {item.title}
              </h4>
              <p className="text-black dark:text-white text-tiny uppercase font-bold mb-1">
                {item.author}
              </p>
              <small className="text-default-500">
                {shortDescription ||
                  "La descripción de esta noticia aún no está disponible"}...
              </small>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
};

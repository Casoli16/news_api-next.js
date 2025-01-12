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
import Link from "next/link";

interface StatiCard {
  title: string;
  image: string;
  path: string;
  color: string;
}

export const StaticCard = ({ title, image, path, color }: StatiCard) => {
  return (
    <Link href={path}>
      <Card className="col-span-12 sm:col-span-4 h-[300px] mt-5">
        <CardHeader className="absolute z-10 top-1 flex-col !items-start">
          <p className="text-tiny uppercase font-bold" style={{ color: color }}>
            Categoría
          </p>
          <h4 className="font-medium text-large" style={{ color: color }}>
            {title}
          </h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Card background"
          className="z-0 w-full h-full object-cover"
          src={image}
        />
      </Card>
    </Link>
  );
};

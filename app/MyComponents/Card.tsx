import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FiDollarSign } from "react-icons/fi";
import { IoPersonOutline } from "react-icons/io5";
import { FaBoxArchive } from "react-icons/fa6";
import { CiWavePulse1 } from "react-icons/ci";

// Define the type for home data items
interface HomeDataItem {
  id: number;
  title: string;
  number: number;
  footer: string;
  symbol: 'dollar' | 'person' | 'box' | 'wave';
}

import { homeData } from "@/constants/home";
// Create the icon map with explicit type
const iconMap: Record<HomeDataItem['symbol'], JSX.Element> = {
  dollar: <FiDollarSign />,
  person: <IoPersonOutline />,
  box: <FaBoxArchive />,
  wave: <CiWavePulse1 />,
};

function CardComponent() {
  return (
    <div className="flex flex-wrap gap-4">
      {homeData.map((item) => (
        <Card key={item.id} className="relative flex-1 min-w-[150px] w-full lg:w-auto p-1 overflow-hidden">
          <CardHeader className="text-wrap">
            <CardTitle className="text-sm font-normal">{item.title}</CardTitle>
            <CardDescription className="text-2xl text-black font-bold">{item.number}</CardDescription>
          </CardHeader>
          <CardContent className="absolute top-2 right-2 text-xl">
            {iconMap[item.symbol as keyof typeof iconMap]}
          </CardContent>
          <CardFooter>
            <p>{item.footer}</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default CardComponent;
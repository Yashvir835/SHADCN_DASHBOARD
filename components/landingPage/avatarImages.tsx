"use client";

import Image from "next/image";
import React from "react";
import { CardBody, CardContainer, CardItem } from "../ui/3d-card";
import Link from "next/link";
import avatarImages from "@/components/landingPage/data/avatarImage"; 

export function ThreeDCardDemo() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {avatarImages.map((avatar, index) => (
        <CardContainer key={index} className="inter-var">
          <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[20rem] h-auto rounded-xl p-6 border">
            <CardItem
              translateZ="50"
              className="text-xl font-bold text-neutral-600 dark:text-white"
            >
              {avatar.alt}
            </CardItem>
            <CardItem
              as="p"
              translateZ="60"
              className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
            >
              {avatar.description}
            </CardItem>
            <CardItem translateZ="100" className="flex justify-center items-center w-full mt-4">
              <Image
                src={avatar.src}
                height="1000"
                width="1000"
                className="h-60 w-auto object-cover rounded-xl group-hover/card:shadow-xl"
                alt={avatar.alt}
              />
            </CardItem>
            <div className="flex justify-between items-center mt-20">
              <CardItem
                translateZ={20}
                as={Link}
                href=""
                target="__blank"
                className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
              >
                Learn More →
              </CardItem>
              {/* <CardItem
                translateZ={20}
                as="button"
                className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
              >
                Sign Up
              </CardItem> */}
            </div>
          </CardBody>
        </CardContainer>
      ))}
    </div>
  );
}

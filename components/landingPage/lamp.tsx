"use client";
import React from "react";
import { motion } from "framer-motion";
import { LampContainer } from "@/components/ui/lamp";
import { PricingBasic } from "./pricingPlains";
import { ThreeDCardDemo } from "./avatarImages";
export function LampDemo() {
  return (
    <LampContainer>
      <div className="flex flex-col  items-center justify-center space-y-10]">
        <motion.h1
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 1,
            ease: "easeInOut",
          }}
          className="mt-[400px] bg-gradient-to-br from-slate-300 to-slate-500 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl"
        >
          List of digital <br /> Avatars
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.5,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="w-full max-w-4xl"
        >
        </motion.div>
      </div>
          {/* <ThreeDPhotoCarousel /> */}
      <ThreeDCardDemo/>
      <PricingBasic/>
    </LampContainer>
  );
}


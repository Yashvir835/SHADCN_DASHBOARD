"use client";
import React from "react";
import { SparklesCore } from "@/components/ui/sparkles"
import { SignInButton } from "@clerk/nextjs";
import { TypewriterEffectSmoothDemo } from "@/components/landingPage/typeEffect"
import AnimatedGradientText from "@/components/ui/animated-gradient-text";
import ShineBorder from "../ui/shine-border";

export function SparklesPreview() {

  return (
    <>
          <div
            className="relative flex  w-full flex-col items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl"
        >

      <div className=" h-[42rem] w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md relative ">
        
      <h1 className="md:text-7xl text-3xl lg:text-9xl font-bold text-center text-white relative z-20">
        
          <TypewriterEffectSmoothDemo />
      </h1>
        <div className="w-[80%] h-[40%] relative">
        {/* Gradients */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

        {/* Core component */}
        <SparklesCore
          background="black"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="absolute inset w-full h-full"
          particleColor="#FFFFFF"
          />

        {/* Radial Gradient to prevent sharp edges */}
        <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)] flex flex-col justify-center items-center">
          <p className="mb-2 mt-2 text-white text-center font-bold animate-glow">
            Revolutionizing the world of digital humans
          </p>
           
          <SignInButton mode="modal">
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">

                <button className="w-40 h-10 rounded-xl bg-white text-black border border-black  text-sm">
                  <AnimatedGradientText  text="Sign In" />
                </button>
              </div>
          </SignInButton>
        </div>

      </div>
      
    </div>

          </div>
    </>
  );
}


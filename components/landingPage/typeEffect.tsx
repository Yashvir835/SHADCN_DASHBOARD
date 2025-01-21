"use client";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";

export function TypewriterEffectSmoothDemo() {
  const words = [
    {
      text: "Build",
      className: "text-black dark:text-white",
    },
    {
      text: "your",
      className: "text-black dark:text-white",
    },
    {
      text: "Digital Avatar",
      className: "text-black dark:text-white",
    },
    {
      text: "with",
      className: "text-black dark:text-white",
    },
    {
      text: "Nexus Beings.",
      className: "text-blue-500 dark:text-blue-500",
    },
  ];

  return (
    <div className="mt-4 flex flex-col items-center justify-center">
      <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base mb-4">
        The road to technology starts here, paving the way for the next generation of digital humans.
      </p>
      <TypewriterEffectSmooth words={words} />
    </div>
  );
}


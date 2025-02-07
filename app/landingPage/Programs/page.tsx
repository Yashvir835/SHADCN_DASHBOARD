"use client";
import React from "react";
import { motion, useAnimation } from "framer-motion";

const blurIn = {
  initial: { opacity: 0, filter: "blur(0px)" },
  whileInView: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 1 },
  },
  viewport: { once: true },
};

const staggerContainer = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1, transition: { staggerChildren: 0.2 } },
  viewport: { once: true },
};

// ----------------------------------------------------------------
const paragraphLine = {
  hidden: { opacity: 0, y: -10 },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      // Each line's animation is delayed based on its index (custom multiplier)
      delay: custom * 0.15,
      type: "tween",
      duration: 1.0,
      // A gentle cubic-bezier easing function for smooth, fluid motion
      ease: [0.42, 0, 0.58, 1],
    },
  }),
};

// ----------------------------------------------------------------

export default function Page() {
  // Separate animation controls for each arrow
  const arrowControlsUpdates = useAnimation(); // For the "Go to Updates" arrow in Our Progress section
  const arrowControlsProgress = useAnimation(); // For the "Go to Progress" arrow in Our Aim section

  // Handle arrow hover animation for the "Go to Updates" arrow
  const handleArrowHoverUpdates = async () => {
    await arrowControlsUpdates.start({
      x: 15, // Move arrow right
      opacity: 0,
      transition: { duration: 0.4, ease: "easeInOut" },
    });
    arrowControlsUpdates.set({ x: -14, opacity: 1 }); // Reset to starting position
    await arrowControlsUpdates.start({
      x: 0,
      transition: { duration: 0.2, ease: "easeInOut" },
    });
  };

  // Handle arrow hover animation for the "Go to Progress" arrow
  const handleArrowHoverProgress = async () => {
    await arrowControlsProgress.start({
      x: 15,
      opacity: 0,
      transition: { duration: 0.4, ease: "easeInOut" },
    });
    arrowControlsProgress.set({ x: -14, opacity: 1 });
    await arrowControlsProgress.start({
      x: 0,
      transition: { duration: 0.2, ease: "easeInOut" },
    });
  };

  return (
    <div className="scrollbar-hide h-screen overflow-y-auto">
      {/* Base container */}
      <div className="min-h-screen bg-black p-4 md:p-6 lg:p-8 text-[0.75rem] font-normal">
        <div className="mx-auto md:mt-24 mt-32 max-w-6xl">
          {/* Our Progress Section */}
          <div className="grid md:pl-64 gap-8">
            <motion.span
              className="text-[32px] md:text-[8px] text-white/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 100,
                delay: 0.3,
              }}
            >
              Our Progress
            </motion.span>

            {/* Use a 3‑column layout for all screen sizes */}
            <div className="flex flex-col md:flex-row gap-8 md:gap-[72px] text-white">
              {/* Left Column */}
              <motion.div className="flex flex-col gap-8 md:gap-2">
                <motion.h2
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.05 } },
                    hidden: {},
                  }}
                  className="text-sm md:text-md font-thin"
                >
                  {Array.from("The new Method").map((char, i) => (
                    <motion.span
                      key={i}
                      variants={{
                        hidden: { opacity: 0, filter: "blur(4px)", x: -40 },
                        visible: { opacity: 1, filter: "blur(0px)", x: 0 },
                      }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </motion.h2>
                {/* Arrow and "Go to Updates" button */}
                <motion.div
                  initial={{ opacity: 0, filter: "blur(16px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{}}
                  className="flex justify-center md:justify-start items-center gap-4 cursor-pointer self-start"
                  onHoverStart={handleArrowHoverUpdates}
                >
                  <div className="md:w-8 w-10 h-4 mt-1 rounded-full border border-blue-500 flex items-center justify-center relative">
                    <motion.svg
                      animate={arrowControlsUpdates}
                      width="23"
                      height="8"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="blue"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="absolute"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </motion.svg>
                  </div>

                  <motion.span
                    className="text-blue-500 text-[16px] md:text-[10px] font-extralight"
                    initial={{ filter: "blur(4px)" }}
                    animate={{ filter: "blur(0px)" }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    whileHover={{
                      filter: "blur(1px)",
                      transition: { duration: 0.1 },
                    }}
                  >
                    Go to Updates
                  </motion.span>
                </motion.div>
              </motion.div>

              {/* ----------------------------------------------------------------
                  Middle Column for Mobile - Paragraphs 
              ---------------------------------------------------------------- */}
              <motion.div
                className="flex md:hidden block flex-col gap-8"
                {...blurIn}
              >
                <p className="md:text-[0.75rem] text-[1rem] leading-6">
                  Where the future is wearable
                </p>

                <div className="flex flex-col gap-4">
                  {/* First Paragraph */}
                  <motion.div
                    className="flex flex-col text-[16px] font-sm text-white/80 space-y-[-0.15em]"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {[
                      "We blend innovation and insight to transform bold visions into reality, redefining the future of human enhancement with cutting-edge wearable technologies such as A¹ Sense, B¹ Eye, and A¹ Neuro.",
                    ].map((line, i) => (
                      <motion.span
                        key={i}
                        custom={i * 0.2}
                        variants={paragraphLine}
                        className="block leading-[1.4]"
                      >
                        {line}
                      </motion.span>
                    ))}
                  </motion.div>

                  {/* Second Paragraph */}
                  <motion.div
                    className="flex flex-col text-[16px] font-sm text-white/80 space-y-[-0.15em]"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {[
                      "These devices are not merely products; they are keys to unparalleled human augmentation. With a mission focused on enhancing the human experience, our company leads in the fields of Invisible Sense, Spatial, and Neural Computing, aiming for a future where technology amplifies human potential and makes every moment extraordinary.",
                    ].map((line, i) => (
                      <motion.span
                        key={i}
                        custom={i * 0.2}
                        variants={paragraphLine}
                        className="block leading-[1.4]"
                      >
                        {line}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>
              </motion.div>

              {/* ----------------------------------------------------------------
                  Middle Column for Desktop - Paragraphs with Ripple Effect on Each Line
              ---------------------------------------------------------------- */}
              <motion.div
                className="flex hidden md:block flex-col gap-4"
                {...blurIn}
              >
                <p className="md:text-[0.75rem] text-[1rem] leading-6">
                  Where the future is wearable
                </p>

                <div className="grid gap-4">
                  {/* First Paragraph */}
                  <motion.div
                    className="grid md:text-[9px] text-[16px] font-sm text-white/80"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {[
                      "We blend innovation and",
                      "insight to transform bold",
                      "visions into reality, redefining",
                      "the future of human",
                      "enhancement with",
                      "cutting-edge wearable",
                      "technologies such as A¹",
                      "Sense, B¹ Eye, and A¹ Neuro.",
                    ].map((line, i) => (
                      <motion.span
                        key={i}
                        custom={i * 0.2}
                        variants={paragraphLine}
                      >
                        {line}
                      </motion.span>
                    ))}
                  </motion.div>

                  {/* Second Paragraph */}
                  <motion.div
                    className="grid md:text-[9px] text-[16px] font-sm text-white/80"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {[
                      "These devices are not merely",
                      "products; they are keys to",
                      "unparalleled human",
                      "augmentation. With a mission",
                      "focused on enhancing the",
                      "human experience, our",
                      "company leads in the fields of",
                      "Invisible Sense, Spatial, and",
                      "Neural Computing, aiming for",
                      "a future where technology",
                      "amplifies human potential and",
                      "makes every moment",
                      "extraordinary.",
                    ].map((line, i) => (
                      <motion.span
                        key={i}
                        custom={i * 0.2}
                        variants={paragraphLine}
                      >
                        {line}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>
              </motion.div>

              {/* ----------------------------------------------------------------
                  Right Column for Mobile
              ---------------------------------------------------------------- */}
              <motion.div
                className="flex md:hidden block items-start flex-col gap-2 text-[16px] text-white/60"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={paragraphLine}
              >
                <span className="text-white">*</span>
                <motion.div
                  className="flex flex-col gap-1 text-[16px] font-sm text-white/80"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {[
                    "Committed to advancing Wearable & Neural Technologies for the Intelligence Age.",
                  ].map((line, i) => (
                    <motion.span
                      key={i}
                      custom={i * 0.2}
                      variants={paragraphLine}
                    >
                      {line}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>

              {/* ----------------------------------------------------------------
                  Right Column for Desktop
              ---------------------------------------------------------------- */}
              <motion.div
                className="flex hidden md:block items-start flex-col gap-2 md:text-[9px] text-[16px] text-white/60"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={paragraphLine}
              >
                <span className="text-white">*</span>
                <motion.div
                  className="grid gap-1 md:text-[9px] text-[16px] font-sm text-white/80"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {[
                    "Committed to advancing",
                    "Wearable & Neural",
                    "Technologies for the",
                    "Intelligence Age.",
                  ].map((line, i) => (
                    <motion.span
                      key={i}
                      custom={i * 0.2}
                      variants={paragraphLine}
                    >
                      {line}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* White line above Our Aim */}
        <div className="mx-auto my-12 w-[90%] md:w-[80%]">
          <div className="border-t border-white" />
        </div>

        {/* Our Aim Section */}
        <div className="mx-auto md:mt-24 mt-32 max-w-6xl">
          <div className="grid md:pl-64 gap-8">
            <motion.span
              className="text-[32px] md:text-[8px] text-white/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 100,
                delay: 0.3,
              }}
            >
              Our Aim
            </motion.span>

            <div className="flex flex-col md:mb-0 mb-24 md:flex-row gap-8 md:gap-[72px] text-white">
              {/* Left Column */}
              <motion.div className="flex flex-col gap-2">
                <motion.h2
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.05 } },
                    hidden: {},
                  }}
                  className="text-sm md:text-md font-thin"
                >
                  {Array.from("A Radical Impact for Our Life").map(
                    (char, i) => (
                      <motion.span
                        key={i}
                        variants={{
                          hidden: { opacity: 0, filter: "blur(4px)", x: -40 },
                          visible: { opacity: 1, filter: "blur(0px)", x: 0 },
                        }}
                      >
                        {char}
                      </motion.span>
                    )
                  )}
                </motion.h2>
                {/* Arrow and "Go to Progress" button */}
                <motion.div
                  initial={{ opacity: 0, filter: "blur(16px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{}}
                  className="flex justify-center mt-6 md:mt-0 mb-2 md:mb-0 md:justify-start items-center gap-4 cursor-pointer self-start"
                  onHoverStart={handleArrowHoverProgress}
                >
                  <div className="md:w-8 w-10 h-4 mt-1 rounded-full border border-blue-500 flex items-center justify-center relative">
                    <motion.svg
                      animate={arrowControlsProgress}
                      width="23"
                      height="8"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="blue"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="absolute"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </motion.svg>
                  </div>

                  <motion.span
                    className="text-blue-500 text-[16px] md:text-[10px] font-extralight"
                    initial={{ filter: "blur(4px)" }}
                    animate={{ filter: "blur(0px)" }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    whileHover={{
                      filter: "blur(1px)",
                      transition: { duration: 0.1 },
                    }}
                  >
                    Go to Progress
                  </motion.span>
                </motion.div>
              </motion.div>

              {/* ----------------------------------------------------------------
                  Middle Column for Mobile - Paragraphs 
              ---------------------------------------------------------------- */}
              <motion.div
                className="flex md:hidden block flex-col gap-8 md:gap-4"
                {...blurIn}
              >
                <p className="md:text-[0.75rem] text-[1rem]  leading-6">
                  The future lies in our hands
                </p>

                <div className="flex flex-col gap-4">
                  {/* First Paragraph */}
                  <motion.div
                    className="flex flex-col text-[16px] font-sm text-white/80 space-y-[-0.15em]"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {[
                      "We aim to create advanced technological devices that are seamlessly integrated with the human body,ensuring stability in their use.",
                    ].map((line, i) => (
                      <motion.span
                        key={i}
                        custom={i * 0.2}
                        variants={paragraphLine}
                        className="block leading-[1.4]"
                      >
                        {line}
                      </motion.span>
                    ))}
                  </motion.div>

                  {/* Second Paragraph */}
                  <motion.div
                    className="flex flex-col text-[16px] font-sm text-white/80 space-y-[-0.15em]"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {[
                      "We always keep the end - users of our products in mind, prioritizing safety,accessibility, and reliability throughout our process.",
                    ].map((line, i) => (
                      <motion.span
                        key={i}
                        custom={i * 0.2}
                        variants={paragraphLine}
                        className="block leading-[1.4]"
                      >
                        {line}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>
              </motion.div>

              {/* ----------------------------------------------------------------
                  Middle Column for Desktop - Paragraphs with Ripple Effect on Each Line
              ---------------------------------------------------------------- */}
              <motion.div
                className="flex hidden md:block flex-col gap-4"
                {...blurIn}
              >
                <p className="md:text-[0.75rem]  leading-6">
                  The future lies in our hands
                </p>

                <div className="grid gap-4">
                  {/* First Paragraph */}
                  <motion.div
                    className="grid md:text-[9px] text-[16px] font-sm text-white/80"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {[
                      "We aim to create advanced",
                      "technological devices that",
                      "are seamlessly integrated",
                      "with the human body,",
                      "ensuring stability in their use.",
                    ].map((line, i) => (
                      <motion.span
                        key={i}
                        custom={i * 0.2}
                        variants={paragraphLine}
                      >
                        {line}
                      </motion.span>
                    ))}
                  </motion.div>

                  {/* Second Paragraph */}
                  <motion.div
                    className="grid md:text-[9px] text-[16px] font-sm text-white/80"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {[
                      "We always keep the",
                      "end-users of our products in",
                      "mind, prioritizing safety,",
                      "accessibility, and reliability",
                      "throughout our engineering",
                      "process",
                    ].map((line, i) => (
                      <motion.span
                        key={i}
                        custom={i * 0.2}
                        variants={paragraphLine}
                      >
                        {line}
                      </motion.span>
                    ))}
                  </motion.div>
                </div>
              </motion.div>

              {/* ----------------------------------------------------------------
                  Right Column for Mobile
              ---------------------------------------------------------------- */}
              <motion.div
                className="flex md:hidden block items-start flex-col gap-2 text-[16px] text-white/60"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={paragraphLine}
              >
                <span className="text-white">*</span>
                <motion.div
                  className="flex flex-col gap-1 text-[16px] font-sm text-white/80"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {[
                    "Envisioning the future with a Pro-Human approach.",
                  ].map((line, i) => (
                    <motion.span
                      key={i}
                      custom={i * 0.2}
                      variants={paragraphLine}
                    >
                      {line}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>

              {/* ----------------------------------------------------------------
                  Right Column for Desktop
              ---------------------------------------------------------------- */}
              <motion.div
                className="flex hidden md:block items-start flex-col gap-2 md:text-[9px] text-[16px] text-white/60"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={paragraphLine}
              >
                <span className="text-white">*</span>
                <motion.div
                  className="grid gap-1 md:text-[9px] text-[16px] font-sm text-white/80"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {[
                    "Envisioning the future with a",
                    " Pro-Human approach.",
                  ].map((line, i) => (
                    <motion.span
                      key={i}
                      custom={i * 0.2}
                      variants={paragraphLine}
                    >
                      {line}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

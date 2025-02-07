'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Animation variants for text elements
const textVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (customDelay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay: customDelay },
  }),
};

const staggerText = {
  visible: { transition: { staggerChildren: 0.05 } },
  hidden: {},
};

const characterVariants = {
  hidden: { opacity: 0, filter: 'blur(8px)', x: -20 },
  visible: { opacity: 1, filter: 'blur(0px)', x: 0 },
};

export default function Page() {
  return (
    <div className="scrollbar-hide h-screen overflow-y-auto">
       {/*  outer container */}
      <div className="flex flex-col items-center justify-start bg-zinc-800 p-4 space-y-12">
        {/* Header Section */}
        <motion.div
          className="grid grid-cols-1 items-center mt-32 gap-4 px-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } },
              hidden: {},
            }}
            className="text-sm md:text-xs text-gray-400 font-extralight text-center md:text-left"
          >
            {Array.from("At Nexus Beings").map((char, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, filter: 'blur(8px)', x: -20 },
                  visible: { opacity: 1, filter: 'blur(0px)', x: 0 },
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h2>
          <motion.h2
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05 } },
              hidden: {},
            }}
            className="text-sm text-blue-400 font-extralight text-center md:text-left"
          >
            {Array.from("We put Humans First").map((char, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, filter: 'blur(8px)', x: -20 },
                  visible: { opacity: 1, filter: 'blur(0px)', x: 0 },
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h2>
        </motion.div>

        {/* Mission, Vision, and Ambition Section */}
        {/* here padding add margin in the bottom just remember that */}
        <div className="w-full max-w-4xl mx-auto px-4 space-y-4 pb-24">
          {/* Our Mission */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-5 items-center text-white p-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={textVariant}
            custom={0.3}
          >
            <div className="md:col-span-2 flex flex-col items-start mb-4 md:mb-0">
              <span className="text-sm md:text-xs text-gray-400 font-extralight">
                0.1
              </span>
              <h2 className="text-sm md:text-xs font-extralight">Our Mission</h2>
            </div>
            <div className="md:col-span-3 flex flex-col items-start">
              <span className="text-md md:text-md font-extralight">
                Make humans better—a lot better
              </span>
              {/* this is the white line undet the mission  */}
              <div className="flex items-center justify-center my-4 w-full">
                <div className="flex-grow border-t border-white mx-0">

                </div>
              </div>            </div>
          </motion.div>

          {/* Our Vision */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-5 items-center text-white p-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={textVariant}
            custom={0.4}
          >
            <div className="md:col-span-2 flex flex-col items-start mb-4 md:mb-0">
              <span className="text-sm md:text-xs text-gray-400 font-extralight">
                0.2
              </span>
              <h2 className="text-sm md:text-xs font-extralight">Our Vision</h2>
            </div>
            <div className="md:col-span-3 flex flex-col items-start">
              <span className="text-md md:text-md font-extralight">
                Lead the future of digital human
              </span>
              {/* this is the white line undet the vision */}
              <div className="flex items-center justify-center my-4 w-full">
                <div className="flex-grow border-t border-white mx-0">

                </div>
              </div>
         
              
                 </div>
          </motion.div>

          {/* Our Ambition */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-5 items-center text-white p-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={textVariant}
            custom={0.5}
          >
            <div className="md:col-span-2 flex flex-col items-start mb-4 md:mb-0">
              <span className="text-sm md:text-xs text-gray-400 font-extralight">
                0.3
              </span>
              <h2 className="text-sm md:text-xs font-extralight">Our Ambition</h2>
            </div>
            <div className="md:col-span-3 flex flex-col items-start">
              <span className="text-md md:text-md font-extralight">
                Simply heads-up computing
              </span>
              {/* this is the white line undet the ambition */}
              <div className="flex items-center justify-center my-4 w-full">
                <div className="flex-grow border-t border-white mx-0">

                </div>
              </div>            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full  bg-black p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 md:ml-48 mt-4 md:mt-12 gap-4">
          {['Industries', 'Core Business', 'Domain'].map((title, idx) => (
            <motion.div
              key={title}
              className="text-white p-6 relative"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={textVariant}
              custom={0.3 + idx * 0.1}
            >
              <div className="mt-4 p-[0.5] bg-blue-600 w-2" />
              <motion.h1
                initial="hidden"
                animate="visible"
                variants={staggerText}
                className="text-sm md:text-xs text-gray-500 font-extralight mb-2 mt-2"
              >
                {Array.from(title).map((char, i) => (
                  <motion.span key={i} variants={characterVariants}>
                    {char}
                  </motion.span>
                ))}
              </motion.h1>
              <motion.span className="text-sm font-extralight">
                {[
                  'Wearable & Neural technologies',
                  'AI Wearable technologies',
                  'nexus.pro'
                ][idx]}
              </motion.span>
            </motion.div>
          ))}
        </div>

        {/* How We Talk – Centered Container */}
        <div className="mx-auto w-full pb-28 md:pb-4 max-w-4xl px-4">
          {/* this is the white line undet the how we talk */}
          <div className="flex items-center justify-center my-4 w-full">
            <div className="flex-grow border-t border-white mx-0">

            </div>
          </div>      
              <motion.div
            className="flex flex-col md:flex-row items-center justify-center gap-8 mt-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
              hidden: {},
            }}
          >
            <motion.div
              className="grid grid-col items-center"
              variants={textVariant}
              custom={0.7}
            >
              <span className="text-sm ml-6 md:ml-0 md:text-xs text-gray-400 font-extralight">
                0.4
              </span>
              <h2 className="text-sm text-white md:text-xs font-extralight">
                How We Talk
              </h2>
            </motion.div>
            <motion.div
              className="flex flex-col md:flex-row items-center w-full justify-center md:space-x-16 space-y-8 md:space-y-0"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: { transition: { staggerChildren: 0.1 } },
                hidden: {},
              }}
            >
              {[
                { acronym: 'ehe ¹', words: ['Enhance', 'Human', 'Experience'] },
                { acronym: 'ICT', words: ['Invisible', 'Computing', 'Technologies'] },
                { acronym: 'AIWC', words: ['Artificial', 'Intelligence', 'Wearable', 'Company'] }
              ].map((item, index) => (
                <motion.div
                  key={item.acronym}
                  className="grid grid-cols-1 items-center text-white"
                  variants={textVariant}
                  custom={0.8 + index * 0.1}
                >
                  <h1 className="text-center">
                    <span className="text-blue-600">[</span>
                    {item.acronym}
                    <span className="text-blue-600">]</span>
                  </h1>
                  <div className="flex flex-col mt-2 items-center">
                    {item.words.map((word, wordIndex) => (
                      <span
                        key={wordIndex}
                        className="text-sm text-white md:text-xs font-extralight"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

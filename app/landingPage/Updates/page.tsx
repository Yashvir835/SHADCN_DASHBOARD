'use client';

import React from 'react';
import { motion, useAnimation } from 'framer-motion';

// Animation variants for text elements
const textVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (customDelay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', delay: customDelay },
  }),
};



export default function Page() {
  const arrowControlsDocumentation = useAnimation(); // For the Comapny documentation
  const arrowControlsCareer = useAnimation(); // For the Career Options
  const arrowControlsNews = useAnimation(); // For the LATEST NEWS

  // Handle arrow hover animation for the "Go to arrowControlsDocumentation" arrow
  const handleArrowHoverDocumentation = async () => {
    await arrowControlsDocumentation.start({
      x: 15, // Move arrow right
      opacity: 0,
      transition: { duration: 0.4, ease: "easeInOut" },
    });
    arrowControlsDocumentation.set({ x: -14, opacity: 1 }); // Reset to starting position
    await arrowControlsDocumentation.start({
      x: 0,
      transition: { duration: 0.2, ease: "easeInOut" },
    });
  };

  // Handle arrow hover animation for the "Go to arrowControlsCareer" arrow
  const handleArrowHoverCareer = async () => {
    await arrowControlsCareer.start({
      x: 15, // Move arrow right
      opacity: 0,
      transition: { duration: 0.4, ease: "easeInOut" },
    });
    arrowControlsCareer.set({ x: -14, opacity: 1 }); // Reset to starting position
    await arrowControlsCareer.start({
      x: 0,
      transition: { duration: 0.2, ease: "easeInOut" },
    });
  };


  // Handle arrow hover animation for the "Go to arrowControlsNews" arrow
  const handleArrowHoverNews = async () => {
    await arrowControlsNews.start({
      x: 15, // Move arrow right
      opacity: 0,
      transition: { duration: 0.4, ease: "easeInOut" },
    });
    arrowControlsNews.set({ x: -14, opacity: 1 }); // Reset to starting position
    await arrowControlsNews.start({
      x: 0,
      transition: { duration: 0.2, ease: "easeInOut" },
    });
  };

  return (
    <div className="scrollbar-hide bg-white h-screen overflow-y-auto">
      {/* Outer container */}
      <motion.div
        className="flex flex-col items-center justify-start bg-blue-500 p-4 space-y-8"
        initial="hidden"
        whileInView="visible"
        transition={{
          duration:0.3,ease:'easeInOut'
        }}
        viewport={{ once: true }}
      >
        <div className="mt-18 md:mt-[22px] mb-24">
          <motion.div
            className="mt-24 flex md:flex-row flex-col gap-8 md:gap-3 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.7}
            variants={textVariant}
          >
            <span className="text-md text-white font-extralight">1.0</span>
            <h2 className="text-3xl text-white font-extralight">Avatar Deck Pro</h2>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.7}
            variants={textVariant}
          className="w-64 p-2 text-xs font-thin mt-[36px] flex flex-wrap">
            <p className="text-cyan-100 text-center">
              Request access to get more info on Nexus Beings
            </p>
          </motion.div>
          <div>
            {/* Arrow and document section */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1 }}
              className="flex justify-center mt-12 md:justify-start items-center gap-6 cursor-pointer self-center md:self-start"
              onHoverStart={handleArrowHoverDocumentation}

            >
              <div className="w-8 h-4 mt-1 rounded-full border border-white flex items-center justify-center relative">
                <motion.svg
                  whileHover="hover"
                  animate={arrowControlsDocumentation}
                  width="8"
                  height="8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </motion.svg>
              </div>
              <motion.span
                className="text-white font-extralight"
                initial={{ filter: 'blur(4px)' }}
                whileInView={{ filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.2 }}
                whileHover={{ filter: 'blur(1px)', transition: { duration: 0.1 } }}
              >
                Company Documentation
              </motion.span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* White section */}
      <div className="flex flex-col md:flex-row items-center justify-center mt-12 mb-12 space-y-12 md:space-y-0 md:space-x-12">
        {/* "Putting People First" Section */}
        <motion.div
          className="flex flex-col items-center justify-start p-4 space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            className="flex md:flex-row flex-col gap-8 md:gap-3 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.7}
            variants={textVariant}
          >
            <span className="text-md font-extralight">2.0</span>
            <h2 className="text-xl font-extralight">Putting People First</h2>
          </motion.div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.7}
            variants={textVariant}
          className="w-64 p-2 text-xs font-thin mt-[36px] flex flex-wrap">
            <p className="text-gray-500 text-center">
              Through the use of wearable technology, we aim to enhance human capabilities and generate a positive impact on the world.
            </p>
          </motion.div>
          <div>
            {/* Arrow and career section */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex justify-center md:justify-start items-center gap-6 cursor-pointer self-center md:self-start"
              onHoverStart={handleArrowHoverCareer}

            >
              <div className="w-8 h-4 mt-1 rounded-full border border-blue-500 flex items-center justify-center relative">
                <motion.svg

                  animate={arrowControlsCareer}
                  width="8"
                  height="8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="blue"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </motion.svg>
              </div>
              <motion.span
                className="text-blue-500 font-extralight"
                initial={{ filter: 'blur(4px)' }}
                whileInView={{ filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.2 }}
                whileHover={{ filter: 'blur(1px)', transition: { duration: 0.1 } }}
              >
                Career Options
              </motion.span>
            </motion.div>
          </div>
        </motion.div>

        {/* "Stay Updated" Section */}
        <motion.div
          className="flex flex-col items-center justify-start p-4 space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            className="flex md:flex-row flex-col gap-8 md:gap-3 items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.7}
            variants={textVariant}
          >
            <span className="text-md font-extralight">3.0</span>
            <h2 className="text-xl font-extralight">Stay Updated</h2>
          </motion.div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0.7}
            variants={textVariant}
          className="w-64 p-2 text-xs font-thin mt-[36px] flex flex-wrap">
            <p className="text-gray-500 text-center">
              Stay updated with our latest technological innovations and advancements in research and development.
            </p>
          </motion.div>
          <div>
            {/* Arrow and news section */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex justify-center md:justify-start items-center gap-6 cursor-pointer self-center md:self-start"
              onHoverStart={handleArrowHoverNews}

            >
              <div className="w-8 h-4 mt-1 rounded-full border border-blue-500 flex items-center justify-center relative">
                <motion.svg
                  animate={arrowControlsNews}
                  width="8"
                  height="8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="blue"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="absolute"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </motion.svg>
              </div>
              <motion.span
                className="text-blue-500 font-extralight"
                initial={{ filter: 'blur(4px)' }}
                whileInView={{ filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1.2 }}
                whileHover={{ filter: 'blur(1px)', transition: { duration: 0.1 } }}
              >
                Latest News
              </motion.span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

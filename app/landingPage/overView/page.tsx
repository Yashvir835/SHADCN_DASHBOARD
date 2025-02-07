'use client';
import React, { useState, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import {ArrowButton} from '@/app/landingPage/_components/ui/BlueArrow';
const TEXTS = [
  "empowering",    // Empowering individuals through seamless digital integration
  "redefining",    // Redefining the boundaries of human-tech interaction
  "transforming",  // Transforming everyday experiences into extraordinary ones
  "elevating",     // Elevating human potential with intelligent interfaces
  "inspiring"      // Inspiring new dimensions of creativity and connection
];

export default function Page() {
  const [currentText, setCurrentText] = useState(TEXTS[0]);
  const arrowControls = useAnimation(); // Animation controls for the arrow

  useEffect(() => {
    // Update the text every 5 seconds for a smoother experience.
    const interval = setInterval(() => {
      setCurrentText(prev => TEXTS[(TEXTS.indexOf(prev) + 1) % TEXTS.length]);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // Handle arrow hover animation
  const handleArrowHover = async () => {
    await arrowControls.start({
      x: 15, // Make sure the arrow doesn't go beyond the border
      opacity: 0,
      transition: { duration: 0.4, ease: 'easeInOut' },
    });
    arrowControls.set({ x: -14, opacity: 1 }); // Reset to starting position
    await arrowControls.start({
      x: 0,
      transition: { duration: 0.2, ease: 'easeInOut' },
    });
  };

  return (
    <div className="bg-stone-200 min-h-screen">
      {/*  paddings for responsive layout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 100,
          delay: 0.2
        }}
        className="container mx-auto flex flex-col md:flex-row justify-center items-start px-4 py-8 pt-20 md:pt-24"
      >
        <div className="flex flex-col  items-center md:ml-16  md:items-start mt-24 md:mt-40 space-y-2 w-full md:w-1/3 mb-8 md:mb-0">
          <motion.h2
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05 } }, hidden: {} }}
            className="text-sm md:text-xs text-gray-400 font-extralight"
          >
            {Array.from("Overview").map((char, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, filter: "blur(8px)", x: -20 },
                  visible: { opacity: 1, filter: "blur(0px)", x: 0 }
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h2>

          <motion.h2
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.05 } }, hidden: {} }}
            className="text-sm md:text-xs font-extralight"
          >
            {Array.from("What's Nexus Beings").map((char, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, filter: "blur(16px)", x: -40 },
                  visible: { opacity: 1, filter: "blur(0px)", x: 0 }
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h2>
        </div>

        <div className="flex flex-col md:mt-40 space-y-32 md:space-y-16 w-full md:w-2/3">
        <div className='p-4 md:p-0 mt-8 md:mt-0'>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-md m  font-extralight "
          >
            Nexus Beings is revolutionizing how we interact with the digital human world{' '}
            <AnimatePresence mode="wait">
              <motion.span
                key={currentText}
                initial={{ filter: "blur(8px)", opacity: 0 }}
                animate={{ filter: "blur(0px)", opacity: 1 }}
                exit={{
                  opacity: 0,
                  filter: "blur(8px)",
                  transition: { duration: 0.8 }
                }}
                transition={{
                  type: "spring",
                  stiffness: 50,
                  damping: 15
                }}
                className="text-blue-600 font-thin inline-block"
              >
                {currentText}
              </motion.span>
            </AnimatePresence>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-md md:text-md  font-extralight ">
             {' '} the future of digital connection.
            </motion.span>
          </motion.p>
          </div>

          {/* Arrow and community section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            // Added md:self-start to align left on md and larger screens
            className="flex justify-center  md:justify-start items-center gap-6 cursor-pointer self-center md:self-start"
            onHoverStart={handleArrowHover}
          >
            <div className="w-8 h-4 mt-1 rounded-full border border-blue-600 flex items-center justify-center relative">
              <motion.svg
                animate={arrowControls}
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
              className="text-blue-600 font-extralight"
              initial={{ filter: "blur(4px)" }}
              animate={{ filter: "blur(0px)" }}
              transition={{ duration: 0.5, delay: 1.2 }}
              whileHover={{
                filter: "blur(1px)",
                transition: { duration: 0.1 }
              }}
            >
              Join Community
            </motion.span>
          </motion.div>
          
        </div>
         <div className="absolute bottom-0 mb-16 md:mb-0 left-1/2 -translate-x-1/2 z-50 w-full">
                  <ArrowButton nextPage="/landingPage/Mission" />
                </div>
      </motion.div>
    </div>
  );
}

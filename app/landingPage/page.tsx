"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowButton } from "@/app/landingPage/_components/ScrollButton";
import { SignInButton } from "@clerk/nextjs";

export default function Page() {
  return (
    <AnimatePresence>
      <motion.div
        className="relative flex flex-col items-center justify-center min-h-screen p-2 overflow-hidden"
        initial={{ opacity: 0, filter: "blur(5px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        {/* Blur Overlay */}
        <motion.div
          className="absolute inset-0 bg-white"
          initial={{ y: -100, opacity: 1 }}
          animate={{ y: "100%", opacity: 0 }}
          transition={{ duration: 2.2, ease: "easeInOut" }}
          style={{ mixBlendMode: "screen", pointerEvents: "none" }}
        />

        {/* Sign In Button */}
        <SignInButton mode="modal">

        <motion.div
          className="hidden md:flex absolute top-0 z-20 right-2 mt-4 items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 4 }}
        >
          <motion.button
            className="relative px-4 py-1 rounded-full bg-gray-200 dark:bg-slate-300 flex items-center justify-center overflow-hidden"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="mr-2">Sign In</span>
            <motion.div
              className="relative w-8 h-8 rounded-full flex items-center justify-center"
              animate={{ x: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
            >
              <motion.svg
                className="absolute text-gray-800 w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </motion.svg>
            </motion.div>
          </motion.button>
        </motion.div>
          </SignInButton>
        {/* Dynamic Video Container */}
        <motion.div className="absolute inset-0 flex items-center justify-center z-0">
          <video
            className="object-cover w-full h-full"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/video/v4.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </motion.div>

        {/* Text Container */}
        <motion.div
          className="absolute z-20 flex flex-col bottom-20 mb-12 md:mb-4 left-1/2 transform -translate-x-1/2 items-center"
        >
          <motion.div
            className="space-y-4"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
            initial="hidden"
            animate="visible"
          >
            <motion.h2
              className="text-xl w-full pl-4 md:text-2xl font-bold md:font-extrabold"
              variants={{ hidden: { y: 20 }, visible: { y: -10 } }}
              transition={{ delay: 2, ease: "easeInOut", duration: 2 }}
            >
              Nexus Beings
            </motion.h2>
            <motion.p
              className="text-sm w-full ml-3 md:ml-0  md:text-xl font-semibold text-gray-600 overflow-hidden"
              variants={{ hidden: { y: 10 }, visible: { y: -20 } }}
              transition={{ delay: 2, ease: "easeInOut", duration: 2 }}
            >
              Beyond humanware.
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Centered Scroll Button */}
        <div className="absolute bottom-0 mb-12 md:mb-0  left-1/2 -translate-x-1/2 z-50 w-full">
          <ArrowButton nextPage="/landingPage/overView" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

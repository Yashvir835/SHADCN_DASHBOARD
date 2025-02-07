"use client";
import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useRouter } from "next/navigation";

interface ArrowButtonProps {
  nextPage: string;
}

export const ArrowButton = ({ nextPage }: ArrowButtonProps) => {
  const router = useRouter();
  const arrowControls = useAnimation();

  // Animate the arrow on mount: start slightly below and invisible,
  // then animate into view.
  useEffect(() => {
    arrowControls.set({ y: 20, opacity: 0 });
    arrowControls.start({
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    });
  }, [arrowControls]);

  // On hover, the arrow moves down (and fades out), then resets above
  // and falls into view from the top.
  const handleArrowHover = async () => {
    // Animate arrow moving downwards and fading out
    await arrowControls.start({
      y: 15,
      opacity: 0,
      transition: { duration: 0.4, ease: "easeInOut" },
    });
    // Instantly set the arrow's position above the container
    arrowControls.set({ y: -20, opacity: 0 });
    // Animate it falling into its resting position and fading in
    await arrowControls.start({
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    });
  };

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 pb-4">
      <motion.div
        onClick={() => router.push(nextPage)}
        onHoverStart={handleArrowHover}
        initial={{ opacity: 0.7 }}
        whileHover={{ scale: 1.3 }}
        whileTap={{ scale: 0.9 }}
        style={{ transformOrigin: "center bottom" }}
        className="flex justify-center items-center gap-6 cursor-pointer"
      >
        {/* Arrow Icon Container */}
        <div className="w-4 h-8 mt-1 rounded-full border border-blue-600 flex items-center justify-center relative">
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
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </motion.svg>
        </div>
      </motion.div>
    </div>
  );
};

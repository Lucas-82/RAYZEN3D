/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import images using Vite's static asset resolution
import decoImg from "../../Img/Deco.png";
import iluminacionImg from "../../Img/Iluminacion.png";
import juegosImg from "../../Img/Juegos.png";
import llaverosImg from "../../Img/Llaveros.png";

const HERO_SLIDES: string[] = [
  decoImg,
  iluminacionImg,
  juegosImg,
  llaverosImg
];

export default function HeroSlider(): React.JSX.Element {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isHovered, setIsHovered] = useState(false);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  // Autoplay every 5 seconds, pauses on hover
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, isHovered]);

  // Framer Motion variants for cross-fade with a slight slide
  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? 50 : -50,
    }),
    center: {
      opacity: 1,
      x: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
      },
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: dir > 0 ? -50 : 50,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
      },
    }),
  };

  return (
    <section
      id="hero-slider-section"
      className="relative w-full min-h-[360px] md:min-h-[440px] bg-transparent overflow-hidden flex items-center justify-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image Carousel with AnimatePresence for transitions */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full flex items-center justify-center"
          >
            {/* The Image itself (non-interactable, click does nothing, object-contain to be full and uncropped) */}
            <img
              src={HERO_SLIDES[currentIndex]}
              alt={`Slide ${currentIndex + 1}`}
              className="w-full h-full object-contain pointer-events-none select-none"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Manual Controls: Prev Arrow Button (Light theme matched styling) */}
      <button
        id="btn-slider-prev"
        onClick={handlePrev}
        className="absolute left-4 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/75 hover:bg-white border border-gray-200 text-gray-700 hover:text-black backdrop-blur-xs transition-all active:scale-95 cursor-pointer shadow-xs hover:scale-105"
        title="Anterior"
        aria-label="Previous Slide"
      >
        <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
      </button>

      {/* Manual Controls: Next Arrow Button (Light theme matched styling) */}
      <button
        id="btn-slider-next"
        onClick={handleNext}
        className="absolute right-4 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-white/75 hover:bg-white border border-gray-200 text-gray-700 hover:text-black backdrop-blur-xs transition-all active:scale-95 cursor-pointer shadow-xs hover:scale-105"
        title="Siguiente"
        aria-label="Next Slide"
      >
        <ChevronRight size={20} className="sm:w-6 sm:h-6" />
      </button>

      {/* Navigation Indicators (Dots) at bottom (Light theme dark dots) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            id={`btn-slider-dot-${index}`}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              index === currentIndex
                ? "w-6 bg-indigo-600 shadow-xs"
                : "w-2 bg-gray-300 hover:bg-gray-400"
            }`}
            title={`Diapositiva ${index + 1}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

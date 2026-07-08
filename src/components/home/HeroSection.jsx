import React, { memo } from "react";
import { motion } from "framer-motion";

const VIDEO_URL =
  "https://pub-8ae493bd1ab54c509da9d77d006297b8.r2.dev/lv_0_20240514200655.mp4";

const smoothEase = [0.16, 1, 0.3, 1];

const BackgroundVideo = memo(() => (
  <motion.video
    autoPlay
    muted
    loop
    playsInline
    preload="metadata"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{
      delay: 0.9,
      duration: 1.8,
      ease: smoothEase,
    }}
    className="absolute inset-0 h-full w-full object-cover"
  >
    <source src={VIDEO_URL} type="video/mp4" />
  </motion.video>
));

BackgroundVideo.displayName = "BackgroundVideo";

const HeroSection = () => {
  return (
    <section className="relative h-[90vh] min-h-[680px] overflow-hidden bg-black">
      <BackgroundVideo />

      {/* Video overlays */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 1,
          duration: 1.7,
          ease: smoothEase,
        }}
        className="absolute inset-0 bg-black/30"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 1,
          duration: 1.7,
          ease: smoothEase,
        }}
        className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-black/0"
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 1,
          duration: 1.7,
          ease: smoothEase,
        }}
        className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/0"
      />

{/* Intro centered text */}
<motion.div
  initial={{ opacity: 1 }}
  animate={{ opacity: 0 }}
  transition={{
    delay: 3.6,
    duration: 0.8,
    ease: [0.19, 1, 0.22, 1],
  }}
  className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black px-6 text-center"
>
  <motion.div
    initial={{
      opacity: 0,
      y: 90,
      filter: "blur(10px)",
    }}
    animate={{
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
    }}
    transition={{
      delay: 0.6,
      duration: 1.8,
      ease: [0.19, 1, 0.22, 1],
    }}
    className="max-w-[1100px]"
  >
    <h1 className="font-['Cormorant_Garamond'] text-[42px] font-medium leading-[1.05] tracking-[-0.02em] text-white md:text-[58px] lg:text-[72px]">
      Premium Surfaces for Every Space
    </h1>

    <p className="mx-auto mt-5 max-w-[720px] font-['Inter'] text-[17px] font-normal leading-[1.35] text-white/85 md:text-[21px]">
      From natural stone to engineered quartz, explore materials selected
      for homes, commercial projects, and timeless interiors.
    </p>
  </motion.div>
</motion.div>
    </section>
  );
};

export default memo(HeroSection);
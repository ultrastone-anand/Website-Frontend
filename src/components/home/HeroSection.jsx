import React, { memo, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import frame0 from "../../assets/home/frame0.png"

const VIDEO_URL = "https://cdn.ultrastone.in/lv_0_20240514200655.mp4";
const FIRST_FRAME_URL = frame0;

const smoothEase = [0.16, 1, 0.3, 1];

const HeroSection = () => {
  const videoRef = useRef(null);
  const [playVideo, setPlayVideo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPlayVideo(true);

      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
    }, 3600);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative h-[90vh] min-h-[680px] overflow-hidden bg-black">
      {/* Actual video */}
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={VIDEO_URL} type="video/mp4" />
      </video>

{/* Permanent top gradient for navbar */}
<div className="absolute inset-x-0 top-0 z-20 h-44 bg-gradient-to-b from-black/60 via-black/35 to-transparent pointer-events-none" />      {/* Static first frame with overlay only on image */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: playVideo ? 0 : 1 }}
        transition={{
          duration: playVideo ? 1.1 : 1.2,
          ease: smoothEase,
        }}
        className="absolute inset-0 z-10"
      >
        <img
          src={FIRST_FRAME_URL}
          alt=""
          draggable="false"
          className="h-full w-full object-cover"
        />

        {/* Overlay only for image */}
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
      </motion.div>

      {/* Intro centered text */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{
          delay: 3.1,
          duration: 0.7,
          ease: [0.19, 1, 0.22, 1],
        }}
        className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-6 text-center"
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
            delay: 0.4,
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
import React, { memo } from "react";
import { motion } from "framer-motion";

const VIDEO_URL =
  "https://pub-8ae493bd1ab54c509da9d77d006297b8.r2.dev/lv_0_20240514200655.mp4";

const BackgroundVideo = memo(() => (
  <video
    autoPlay
    muted
    loop
    playsInline
    preload="metadata"
    className="absolute inset-0 h-full w-full object-cover"
  >
    <source src={VIDEO_URL} type="video/mp4" />
  </video>
));

BackgroundVideo.displayName = "BackgroundVideo";

const HeroSection = () => {
  return (
    <section className="relative h-[90vh] min-h-[680px] overflow-hidden">
      <BackgroundVideo />

      {/* Dark cinematic overlay like reference */}
      <div className="absolute inset-0 bg-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-black/0" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/0" />

      <div className="relative z-10 flex h-full items-center pt-[110px]">
        <div className="w-full px-6 lg:px-[70px]">
          <motion.div
  initial={{ opacity: 0, y: 45 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1 }}
  className="max-w-[1100px]"
>
  <h1 className="font-['Cormorant_Garamond'] text-[46px] font-medium leading-[1.05] tracking-[-0.02em] text-white md:text-[58px] lg:text-[72px] whitespace-normal lg:whitespace-nowrap">
    Premium Surfaces for Every Space
  </h1>

  <p className="mt-5 max-w-[720px] font-['Inter'] text-[18px] font-normal leading-[1.35] text-white/90 md:text-[21px]">
    From natural stone to engineered quartz, explore materials selected for
    homes, commercial projects, and timeless interiors.
  </p>
</motion.div>
        </div>
      </div>
    </section>
  );
};

export default memo(HeroSection);
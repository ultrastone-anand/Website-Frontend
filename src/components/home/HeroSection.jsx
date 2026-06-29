import React, { memo } from "react";
import { motion } from "framer-motion";

const VIDEO_URL =
"https://pub-8ae493bd1ab54c509da9d77d006297b8.r2.dev/lv_0_20240514200655.mp4";
const BackgroundVideo = memo(() => {
  return (
    <video
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      className="absolute inset-0 h-full w-full object-cover"
    >
      <source
        src={VIDEO_URL}
        type="video/mp4"
      />
    </video>
  );
});

BackgroundVideo.displayName =
  "BackgroundVideo";

const HeroSection = () => {
  return (
    <section className="relative h-[90vh] overflow-hidden pt-[110px]">
      {/* Background Video */}
      <BackgroundVideo />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-16">
          <motion.div
            initial={{
              opacity: 0,
              y: 60,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1,
            }}
            className="max-w-4xl"
          >
            <h1 className="mb-8 text-3xl font-light leading-[1] text-white md:text-4xl lg:text-6xl">
              Elevate Your Space
              <br />
              with Timeless Marble & Stones
            </h1>

            <p className="mb-10 max-w-3xl text-lg leading-relaxed text-white/90 md:text-xl">
              Transform any space into a masterpiece with our luxurious marble
              and stone selection. Whether it's for countertops, flooring, or
              statement accents, we have what you need.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default memo(HeroSection);
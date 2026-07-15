import { motion } from "framer-motion";
import {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { getOptimizedVideoUrl , getOriginalSafeUrl } from "../../utils/Mediahelper";
// Adjust the path according to your project structure

const ORIGINAL_VIDEO_URL =
  "https://cdn.ultrastone.in/lv_0_20240514200655.mp4";

const FIRST_FRAME_URL =
  "https://cdn.ultrastone.in/cdn-cgi/image/width=1920,quality=78,format=auto/frame0.png";

const smoothEase = [0.16, 1, 0.3, 1];

const HeroSection = () => {
  const videoRef = useRef(null);

  const [loadVideo, setLoadVideo] =
    useState(false);

  const [videoPlaying, setVideoPlaying] =
    useState(false);

  const [useOriginalVideo, setUseOriginalVideo] =
    useState(false);

  const optimizedVideoUrl = useMemo(
    () =>
      getOptimizedVideoUrl(
        ORIGINAL_VIDEO_URL,
        {
          width: 1920,
          fit: "scale-down",
          quality: "medium",
        }
      ),
    []
  );

  const originalVideoUrl = useMemo(
    () =>
      getOriginalSafeUrl(
        ORIGINAL_VIDEO_URL
      ),
    []
  );

  const activeVideoUrl =
    useOriginalVideo
      ? originalVideoUrl
      : optimizedVideoUrl;

  // Insert video source after intro animation
  useEffect(() => {
    const timer =
      window.setTimeout(() => {
        setLoadVideo(true);
      }, 3600);

    return () =>
      window.clearTimeout(timer);
  }, []);

  // Load and play after source is inserted or changed
  useEffect(() => {
    if (
      !loadVideo ||
      !videoRef.current
    ) {
      return;
    }

    const video =
      videoRef.current;

    setVideoPlaying(false);

    video.load();
    video.currentTime = 0;

    const playPromise =
      video.play();

    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.warn(
          "Hero video autoplay failed:",
          error
        );
      });
    }
  }, [
    loadVideo,
    activeVideoUrl,
  ]);

  const handleVideoError = () => {
    if (!useOriginalVideo) {
      console.warn(
        "Optimized video failed. Falling back to original video."
      );

      setUseOriginalVideo(true);
      return;
    }

    console.error(
      "Original hero video also failed."
    );
  };

  return (
    <section className="relative h-[90vh] min-h-[680px] overflow-hidden bg-black">
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        onPlaying={() => {
          setVideoPlaying(true);
        }}
        onWaiting={() => {
          setVideoPlaying(false);
        }}
        onStalled={() => {
          setVideoPlaying(false);
        }}
        onError={handleVideoError}
        className="absolute inset-0 h-full w-full object-cover"
      >
        {loadVideo && (
          <source
            key={activeVideoUrl}
            src={activeVideoUrl}
            type="video/mp4"
          />
        )}
      </video>

      {/* Permanent navbar gradient */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-44 bg-gradient-to-b from-black/60 via-black/35 to-transparent" />

      {/* First frame remains visible until video plays */}
      <motion.div
        initial={false}
        animate={{
          opacity:
            videoPlaying ? 0 : 1,
        }}
        transition={{
          duration:
            videoPlaying ? 1.1 : 0.25,
          ease: smoothEase,
        }}
        className="pointer-events-none absolute inset-0 z-10"
      >
        <img
          src={FIRST_FRAME_URL}
          alt=""
          aria-hidden="true"
          width="1920"
          height="1080"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          draggable="false"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/35" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
      </motion.div>

      {/* Intro text */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{
          delay: 3.1,
          duration: 0.7,
          ease: [
            0.19,
            1,
            0.22,
            1,
          ],
        }}
        className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-6 text-center"
      >
        <motion.div
          initial={{ y: 90 }}
          animate={{ y: 0 }}
          transition={{
            delay: 0.15,
            duration: 1.4,
            ease: [
              0.19,
              1,
              0.22,
              1,
            ],
          }}
          className="max-w-[1100px]"
        >
          <h1 className="font-['Cormorant_Garamond'] text-[42px] font-medium leading-[1.05] tracking-[-0.02em] text-white md:text-[58px] lg:text-[72px]">
            Premium Surfaces for Every
            Space
          </h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.45,
              duration: 1,
              ease: smoothEase,
            }}
            className="mx-auto mt-5 max-w-[720px] font-['Inter'] text-[17px] font-normal leading-[1.35] text-white/85 md:text-[21px]"
          >
            From natural stone to engineered
            quartz, explore materials selected
            for homes, commercial projects,
            and timeless interiors.
          </motion.p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default memo(HeroSection);
import { motion } from "framer-motion";
import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  getOptimizedVideoUrl,
  getOriginalSafeUrl,
} from "../../utils/Mediahelper";

const ORIGINAL_VIDEO_URL =
  "https://cdn.ultrastone.in/lv_0_20240514200655.mp4";

const FIRST_FRAME_URL =
  "https://cdn.ultrastone.in/cdn-cgi/image/width=1920,quality=78,format=auto/frame0.png";

const smoothEase = [0.16, 1, 0.3, 1];

const HeroSection = () => {
  const videoRef = useRef(null);

  const [loadVideo, setLoadVideo] = useState(false);
  const [hasVideoStarted, setHasVideoStarted] = useState(false);
  const [useOriginalVideo, setUseOriginalVideo] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  const optimizedVideoUrl = useMemo(
    () =>
      getOptimizedVideoUrl(ORIGINAL_VIDEO_URL, {
        width: 1920,
        fit: "scale-down",
        quality: "medium",
      }),
    []
  );

  const originalVideoUrl = useMemo(
    () => getOriginalSafeUrl(ORIGINAL_VIDEO_URL),
    []
  );

  const activeVideoUrl = useOriginalVideo
    ? originalVideoUrl
    : optimizedVideoUrl;

  // Start loading shortly before the intro text finishes.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoadVideo(true);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, []);

  // Load and start the active source.
  useEffect(() => {
    const video = videoRef.current;

    if (!loadVideo || !video || !activeVideoUrl) {
      return;
    }

    let cancelled = false;

    const startVideo = async () => {
      try {
        video.load();

        await video.play();

        if (!cancelled) {
          setHasVideoStarted(true);
        }
      } catch (error) {
        if (!cancelled) {
          console.warn("Hero video autoplay failed:", error);
        }
      }
    };

    startVideo();

    return () => {
      cancelled = true;
    };
  }, [loadVideo, activeVideoUrl]);

  const handleVideoPlaying = useCallback(() => {
    // Once playback succeeds, never show the first-frame overlay again
    // during temporary waiting, stalling, seeking, or looping.
    setHasVideoStarted(true);
  }, []);

  const handleVideoError = useCallback(() => {
    if (!useOriginalVideo) {
      console.warn(
        "Optimized video failed. Falling back to original video."
      );

      setHasVideoStarted(false);
      setUseOriginalVideo(true);
      return;
    }

    console.error("Original hero video also failed.");

    setVideoFailed(true);
    setHasVideoStarted(false);
  }, [useOriginalVideo]);

  return (
    <section className="relative h-[90vh] min-h-[680px] overflow-hidden bg-black">
      {!videoFailed && (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          autoPlay={loadVideo}
          preload={loadVideo ? "auto" : "none"}
          poster={FIRST_FRAME_URL}
          disablePictureInPicture
          onPlaying={handleVideoPlaying}
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
      )}

      {/* Permanent navbar gradient */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-44 bg-gradient-to-b from-black/60 via-black/35 to-transparent" />

      {/* Only visible before the video successfully starts for the first time */}
      <motion.div
        initial={false}
        animate={{
          opacity: hasVideoStarted ? 0 : 1,
        }}
        transition={{
          duration: hasVideoStarted ? 0.8 : 0.2,
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
          ease: [0.19, 1, 0.22, 1],
        }}
        className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-6 text-center"
      >
        <motion.div
          initial={{ y: 90 }}
          animate={{ y: 0 }}
          transition={{
            delay: 0.15,
            duration: 1.4,
            ease: [0.19, 1, 0.22, 1],
          }}
          className="max-w-[1100px]"
        >
          <h1 className="font-['Cormorant_Garamond'] text-[42px] font-medium leading-[1.05] tracking-[-0.02em] text-white md:text-[58px] lg:text-[72px]">
            Premium Surfaces for Every Space
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
            From natural stone to engineered quartz, explore materials selected
            for homes, commercial projects, and timeless interiors.
          </motion.p>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default memo(HeroSection);
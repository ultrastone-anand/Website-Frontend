import { motion, useReducedMotion } from "framer-motion";

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

/* =========================================================
   API CONFIGURATION
========================================================= */

const RAW_API_URL = import.meta.env.VITE_API_URL;

const normalizeApiUrl = (value = "") => {
  const trimmed = String(value)
    .trim()
    .replace(/\/+$/, "");

  if (!trimmed) {
    console.error("VITE_API_URL is not configured.");
    return "";
  }

  if (trimmed.endsWith("/api")) {
    return trimmed;
  }

  return `${trimmed}/api`;
};

const API_URL = normalizeApiUrl(RAW_API_URL);

const HOME_HERO_URL = `${API_URL}/home-hero/active`;

/* =========================================================
   CONSTANTS
========================================================= */

const MOBILE_BREAKPOINT = 768;

const MOBILE_VIDEO_WIDTH = 720;
const DESKTOP_VIDEO_WIDTH = 1440;

// Allow the poster to paint before starting the video.
const VIDEO_START_DELAY = 1200;

const smoothEase = [0.16, 1, 0.3, 1];
const introEase = [0.19, 1, 0.22, 1];

/* =========================================================
   HELPERS
========================================================= */

const getInitialMobileState = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia(
    `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
  ).matches;
};

const getAnimationInitial = (animation) => {
  switch (animation) {
    case "FADE":
      return { opacity: 0 };

    case "SLIDE_DOWN":
      return { opacity: 0, y: -90 };

    case "SLIDE_LEFT":
      return { opacity: 0, x: 90 };

    case "SLIDE_RIGHT":
      return { opacity: 0, x: -90 };

    case "ZOOM_IN":
      return { opacity: 0, scale: 0.85 };

    case "ZOOM_OUT":
      return { opacity: 0, scale: 1.15 };

    case "NONE":
      return { opacity: 1 };

    case "SLIDE_UP":
    default:
      return { opacity: 0, y: 90 };
  }
};

const getAnimationTarget = (animation) => {
  if (animation === "NONE") {
    return { opacity: 1 };
  }

  return {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
  };
};

const getNumber = (value, fallback = 0) => {
  const parsed = Number(value);

  return Number.isFinite(parsed)
    ? parsed
    : fallback;
};

/* =========================================================
   HERO SECTION
========================================================= */

const HeroSection = () => {
  const [hero, setHero] = useState(null);

  const [loading, setLoading] = useState(true);

  const [isMobile, setIsMobile] = useState(
    getInitialMobileState
  );

  const [hasVideoStarted, setHasVideoStarted] =
    useState(false);

  const [shouldLoadVideo, setShouldLoadVideo] =
    useState(false);

  const [useOriginalVideo, setUseOriginalVideo] =
    useState(false);

  const [videoFailed, setVideoFailed] =
    useState(false);

  const videoRef = useRef(null);

  const prefersReducedMotion = useReducedMotion();

  /* =======================================================
     MOBILE DETECTION
  ======================================================= */

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
    );

    const updateDevice = () => {
      setIsMobile(mediaQuery.matches);
    };

    updateDevice();

    mediaQuery.addEventListener(
      "change",
      updateDevice
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        updateDevice
      );
    };
  }, []);

  /* =======================================================
     FETCH ACTIVE HERO
  ======================================================= */

  useEffect(() => {
    const controller = new AbortController();

    const fetchHero = async () => {
      try {
        setLoading(true);

        const response = await fetch(HOME_HERO_URL, {
          method: "GET",

          // Allow normal HTTP caching where the backend permits it.
          cache: "default",

          headers: {
            Accept: "application/json",
          },

          signal: controller.signal,
        });

        const contentType =
          response.headers.get("content-type") || "";

        if (
          !contentType.includes("application/json")
        ) {
          throw new Error(
            "Home Hero API returned a non-JSON response."
          );
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to fetch active home hero"
          );
        }

        setHero(data?.data || null);
      } catch (error) {
        if (error?.name === "AbortError") {
          return;
        }

        console.error(
          "Failed to load active home hero:",
          error
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchHero();

    return () => {
      controller.abort();
    };
  }, []);

  /* =======================================================
     RESOLVED MEDIA
  ======================================================= */

  const mediaType = hero?.media_type || "IMAGE";

  const desktopMediaUrl = hero?.media_url || "";
  const mobileMediaUrl = hero?.mobile_media_url || "";

  const desktopPosterUrl = hero?.poster_url || "";
  const mobilePosterUrl = hero?.mobile_poster_url || "";

  const resolvedMediaUrl =
    isMobile && mobileMediaUrl
      ? mobileMediaUrl
      : desktopMediaUrl;

  const resolvedPosterUrl =
    isMobile && mobilePosterUrl
      ? mobilePosterUrl
      : desktopPosterUrl;

  /* =======================================================
     VIDEO URLS
  ======================================================= */

  const optimizedVideoUrl = useMemo(() => {
    if (
      mediaType !== "VIDEO" ||
      !resolvedMediaUrl
    ) {
      return "";
    }

    return getOptimizedVideoUrl(
      resolvedMediaUrl,
      {
        width: isMobile
          ? MOBILE_VIDEO_WIDTH
          : DESKTOP_VIDEO_WIDTH,

        fit: "scale-down",

        quality: "medium",
      }
    );
  }, [
    mediaType,
    resolvedMediaUrl,
    isMobile,
  ]);

  const originalVideoUrl = useMemo(() => {
    if (
      mediaType !== "VIDEO" ||
      !resolvedMediaUrl
    ) {
      return "";
    }

    return getOriginalSafeUrl(
      resolvedMediaUrl
    );
  }, [
    mediaType,
    resolvedMediaUrl,
  ]);

  const activeVideoUrl = useOriginalVideo
    ? originalVideoUrl
    : optimizedVideoUrl;

  /* =======================================================
     RESET VIDEO STATE
  ======================================================= */

  useEffect(() => {
    setHasVideoStarted(false);
    setShouldLoadVideo(false);
    setUseOriginalVideo(false);
    setVideoFailed(false);
  }, [
    hero?.id,
    hero?.source_type,
    hero?.phase,
    resolvedMediaUrl,
  ]);

  /* =======================================================
     DELAY VIDEO DOWNLOAD

     Poster is displayed first.

     Video begins loading after initial render.
  ======================================================= */

  useEffect(() => {
    if (
      loading ||
      !hero ||
      mediaType !== "VIDEO" ||
      !resolvedMediaUrl ||
      videoFailed ||
      prefersReducedMotion
    ) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setShouldLoadVideo(true);
    }, VIDEO_START_DELAY);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    loading,
    hero,
    mediaType,
    resolvedMediaUrl,
    videoFailed,
    prefersReducedMotion,
  ]);

  /* =======================================================
     VIDEO PLAYBACK
  ======================================================= */

  useEffect(() => {
    if (
      !shouldLoadVideo ||
      !videoRef.current ||
      videoFailed
    ) {
      return undefined;
    }

    const video = videoRef.current;

    const playVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        // Browser may block autoplay.
        // Poster remains visible.
        console.warn(
          "Hero video autoplay was prevented:",
          error
        );
      }
    };

    playVideo();

    return () => {
      video.pause();
    };
  }, [
    shouldLoadVideo,
    activeVideoUrl,
    videoFailed,
  ]);

  /* =======================================================
     VIDEO HANDLERS
  ======================================================= */

  const handleVideoPlaying = useCallback(() => {
    setHasVideoStarted(true);
  }, []);

  const handleVideoError = useCallback(() => {
    if (
      !useOriginalVideo &&
      originalVideoUrl &&
      originalVideoUrl !== optimizedVideoUrl
    ) {
      console.warn(
        "Optimized video failed. Falling back to original video."
      );

      setHasVideoStarted(false);
      setUseOriginalVideo(true);

      return;
    }

    console.error("Hero video failed.");

    setVideoFailed(true);
    setHasVideoStarted(false);
  }, [
    useOriginalVideo,
    originalVideoUrl,
    optimizedVideoUrl,
  ]);

  /* =======================================================
     LOADING PLACEHOLDER
  ======================================================= */

  if (loading || !hero) {
    return (
      <section
        className="relative h-[90vh] min-h-[680px] bg-black"
        aria-label="Loading homepage banner"
      />
    );
  }

  /* =======================================================
     ANIMATION TIMINGS
  ======================================================= */

  const textStartDelay =
    Math.max(
      getNumber(hero.text_start_delay),
      0
    ) / 1000;

  const animationDuration =
    Math.max(
      getNumber(hero.text_animation_duration),
      0
    ) / 1000;

  const descriptionDelay =
    Math.max(
      getNumber(hero.description_delay),
      0
    ) / 1000;

  const visibleDuration =
    Math.max(
      getNumber(hero.text_visible_duration),
      0
    ) / 1000;

  const fadeDuration =
    Math.max(
      getNumber(hero.text_fade_duration),
      0
    ) / 1000;

  const overlayOpacity =
    Math.min(
      Math.max(
        getNumber(hero.overlay_opacity, 0),
        0
      ),
      100
    ) / 100;

  const textAnimation =
    hero.text_animation || "SLIDE_UP";

  const keepTextVisible =
    Boolean(hero.keep_text_visible);

  const textExitDelay =
    textStartDelay +
    animationDuration +
    visibleDuration;

  /* =======================================================
     OVERLAY BEHAVIOR
  ======================================================= */

  const isDefaultHero =
    hero.source_type === "DEFAULT";

  const fadeDefaultOverlay =
    isDefaultHero && !keepTextVisible;

  const overlayExitDelay =
    textExitDelay + fadeDuration;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="relative h-[90vh] min-h-[680px] overflow-hidden bg-black">

      {/* =================================================
          VIDEO

          Video is mounted only after the initial
          poster has had time to render.
      ================================================= */}

      {mediaType === "VIDEO" &&
        shouldLoadVideo &&
        !videoFailed &&
        activeVideoUrl && (
          <video
            ref={videoRef}
            key={activeVideoUrl}
            muted
            loop
            playsInline
            autoPlay
            preload="none"
            poster={
              resolvedPosterUrl || undefined
            }
            disablePictureInPicture
            onPlaying={handleVideoPlaying}
            onError={handleVideoError}
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source
              src={activeVideoUrl}
              type="video/mp4"
            />
          </video>
        )}

      {/* =================================================
          IMAGE HERO
      ================================================= */}

      {mediaType === "IMAGE" &&
        resolvedMediaUrl && (
          <img
            src={resolvedMediaUrl}
            alt={hero.alt_text || ""}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            draggable="false"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

      {/* =================================================
          VIDEO POSTER

          Remains visible until video starts.
      ================================================= */}

      {mediaType === "VIDEO" &&
        resolvedPosterUrl && (
          <motion.div
            initial={false}
            animate={{
              opacity: hasVideoStarted ? 0 : 1,
            }}
            transition={{
              duration: hasVideoStarted ? 0.65 : 0,
              ease: smoothEase,
            }}
            className="pointer-events-none absolute inset-0 z-10"
          >
            <img
              src={resolvedPosterUrl}
              alt=""
              aria-hidden="true"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              draggable="false"
              className="h-full w-full object-cover"
            />
          </motion.div>
        )}

      {/* =================================================
          MAIN DARK OVERLAY
      ================================================= */}

      <motion.div
        initial={{
          opacity: overlayOpacity,
        }}
        animate={{
          opacity: fadeDefaultOverlay
            ? 0
            : overlayOpacity,
        }}
        transition={
          fadeDefaultOverlay
            ? {
                delay: overlayExitDelay,
                duration: 0.8,
                ease: smoothEase,
              }
            : {
                duration: 0,
              }
        }
        className="pointer-events-none absolute inset-0 z-10 bg-black"
      />

      {/* =================================================
          NAVBAR GRADIENT
      ================================================= */}

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-44 bg-gradient-to-b from-black/60 via-black/35 to-transparent" />

      {/* =================================================
          BOTTOM GRADIENT
      ================================================= */}

      <motion.div
        initial={{
          opacity: 1,
        }}
        animate={{
          opacity: fadeDefaultOverlay ? 0 : 1,
        }}
        transition={
          fadeDefaultOverlay
            ? {
                delay: overlayExitDelay,
                duration: 0.8,
                ease: smoothEase,
              }
            : {
                duration: 0,
              }
        }
        className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/20 via-transparent to-transparent"
      />

      {/* =================================================
          CONTENT
      ================================================= */}

      <motion.div
        key={`${hero.source_type}-${hero.id}-${hero.phase}`}
        initial={{
          opacity: 1,
        }}
        animate={{
          opacity: keepTextVisible ? 1 : 0,
        }}
        transition={
          keepTextVisible
            ? {
                duration: 0,
              }
            : {
                delay: textExitDelay,
                duration: fadeDuration,
                ease: introEase,
              }
        }
        className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center px-6 text-center"
      >
        <motion.div
          initial={
            prefersReducedMotion
              ? { opacity: 1 }
              : getAnimationInitial(textAnimation)
          }
          animate={
            getAnimationTarget(textAnimation)
          }
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : {
                  delay: textStartDelay,
                  duration: animationDuration,
                  ease: introEase,
                }
          }
          className="max-w-[1100px]"
        >
          {hero.heading && (
            <h1 className="font-['Cormorant_Garamond'] text-[42px] font-medium leading-[1.05] tracking-[-0.02em] text-white md:text-[58px] lg:text-[72px]">
              {hero.heading}
            </h1>
          )}

          {hero.description && (
            <motion.p
              initial={
                prefersReducedMotion
                  ? { opacity: 1 }
                  : {
                      opacity: 0,
                      y: 25,
                    }
              }
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : {
                      delay: descriptionDelay,
                      duration: 1,
                      ease: smoothEase,
                    }
              }
              className="mx-auto mt-5 max-w-[720px] font-['Inter'] text-[17px] font-normal leading-[1.35] text-white/85 md:text-[21px]"
            >
              {hero.description}
            </motion.p>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default memo(HeroSection);
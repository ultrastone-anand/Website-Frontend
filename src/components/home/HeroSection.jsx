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

const RAW_API_URL =
  import.meta.env.VITE_API_URL;

const normalizeApiUrl = (
  value = ""
) => {
  const trimmed =
    String(value)
      .trim()
      .replace(/\/+$/, "");

  if (!trimmed) {
    console.error(
      "VITE_API_URL is not configured."
    );

    return "";
  }

  if (
    trimmed.endsWith(
      "/api"
    )
  ) {
    return trimmed;
  }

  return `${trimmed}/api`;
};

const API_URL =
  normalizeApiUrl(
    RAW_API_URL
  );

const HOME_HERO_URL =
  `${API_URL}/home-hero/active`;

const smoothEase = [
  0.16,
  1,
  0.3,
  1,
];

/* =========================================================
   HELPERS
========================================================= */

const getAnimationInitial = (
  animation
) => {
  switch (animation) {
    case "FADE":
      return {
        opacity: 0,
      };

    case "SLIDE_DOWN":
      return {
        opacity: 0,
        y: -90,
      };

    case "SLIDE_LEFT":
      return {
        opacity: 0,
        x: 90,
      };

    case "SLIDE_RIGHT":
      return {
        opacity: 0,
        x: -90,
      };

    case "ZOOM_IN":
      return {
        opacity: 0,
        scale: 0.85,
      };

    case "ZOOM_OUT":
      return {
        opacity: 0,
        scale: 1.15,
      };

    case "NONE":
      return {
        opacity: 1,
      };

    case "SLIDE_UP":
    default:
      return {
        opacity: 0,
        y: 90,
      };
  }
};

const getAnimationTarget = (
  animation
) => {
  if (
    animation === "NONE"
  ) {
    return {
      opacity: 1,
    };
  }

  return {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
  };
};

/* =========================================================
   HERO
========================================================= */

const HeroSection = () => {
  const videoRef =
    useRef(null);

  const [
    hero,
    setHero,
  ] =
    useState(null);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    loadVideo,
    setLoadVideo,
  ] =
    useState(false);

  const [
    hasVideoStarted,
    setHasVideoStarted,
  ] =
    useState(false);

  const [
    useOriginalVideo,
    setUseOriginalVideo,
  ] =
    useState(false);

  const [
    videoFailed,
    setVideoFailed,
  ] =
    useState(false);

  /* =======================================================
     FETCH ACTIVE HERO
  ======================================================= */

  useEffect(() => {
    const fetchHero =
      async () => {
        try {
          const response =
            await fetch(
              HOME_HERO_URL,
              {
                method:
                  "GET",

                cache:
                  "no-store",
              }
            );

          const data =
            await response.json();

          if (
            !response.ok
          ) {
            throw new Error(
              data?.message ||
                "Failed to fetch active home hero"
            );
          }

          setHero(
            data?.data ||
              null
          );
        } catch (
          error
        ) {
          console.error(
            "Failed to load active home hero:",
            error
          );
        } finally {
          setLoading(
            false
          );
        }
      };

    fetchHero();
  }, []);

  /* =======================================================
     MEDIA
  ======================================================= */

  const desktopMediaUrl =
    hero?.media_url ||
    "";

  const desktopPosterUrl =
    hero?.poster_url ||
    "";

  const mediaType =
    hero?.media_type ||
    "IMAGE";

  const optimizedVideoUrl =
    useMemo(() => {
      if (
        mediaType !==
          "VIDEO" ||
        !desktopMediaUrl
      ) {
        return "";
      }

      return getOptimizedVideoUrl(
        desktopMediaUrl,
        {
          width:
            1920,

          fit:
            "scale-down",

          quality:
            "medium",
        }
      );
    }, [
      desktopMediaUrl,
      mediaType,
    ]);

  const originalVideoUrl =
    useMemo(() => {
      if (
        mediaType !==
          "VIDEO" ||
        !desktopMediaUrl
      ) {
        return "";
      }

      return getOriginalSafeUrl(
        desktopMediaUrl
      );
    }, [
      desktopMediaUrl,
      mediaType,
    ]);

  const activeVideoUrl =
    useOriginalVideo
      ? originalVideoUrl
      : optimizedVideoUrl;

  /* =======================================================
     VIDEO LOAD DELAY
  ======================================================= */

  useEffect(() => {
    if (
      !hero ||
      mediaType !==
        "VIDEO"
    ) {
      return undefined;
    }

    const delay =
      Number(
        hero.video_load_delay
      ) || 0;

    const timer =
      window.setTimeout(
        () => {
          setLoadVideo(
            true
          );
        },
        delay
      );

    return () =>
      window.clearTimeout(
        timer
      );
  }, [
    hero,
    mediaType,
  ]);

  /* =======================================================
     VIDEO START
  ======================================================= */

  useEffect(() => {
    const video =
      videoRef.current;

    if (
      !loadVideo ||
      !video ||
      !activeVideoUrl
    ) {
      return undefined;
    }

    let cancelled =
      false;

    const startVideo =
      async () => {
        try {
          video.load();

          await video.play();

          if (
            !cancelled
          ) {
            setHasVideoStarted(
              true
            );
          }
        } catch (
          error
        ) {
          if (
            !cancelled
          ) {
            console.warn(
              "Hero video autoplay failed:",
              error
            );
          }
        }
      };

    startVideo();

    return () => {
      cancelled =
        true;
    };
  }, [
    loadVideo,
    activeVideoUrl,
  ]);

  /* =======================================================
     VIDEO HANDLERS
  ======================================================= */

  const handleVideoPlaying =
    useCallback(() => {
      setHasVideoStarted(
        true
      );
    }, []);

  const handleVideoError =
    useCallback(() => {
      if (
        !useOriginalVideo
      ) {
        console.warn(
          "Optimized video failed. Falling back to original video."
        );

        setHasVideoStarted(
          false
        );

        setUseOriginalVideo(
          true
        );

        return;
      }

      console.error(
        "Original hero video also failed."
      );

      setVideoFailed(
        true
      );

      setHasVideoStarted(
        false
      );
    }, [
      useOriginalVideo,
    ]);

  /* =======================================================
     LOADING
  ======================================================= */

  if (
    loading ||
    !hero
  ) {
    return (
      <section className="relative h-[90vh] min-h-[680px] bg-black" />
    );
  }

  /* =======================================================
     TIMING
  ======================================================= */

  const textStartDelay =
    (
      Number(
        hero.text_start_delay
      ) || 0
    ) / 1000;

  const animationDuration =
    (
      Number(
        hero.text_animation_duration
      ) || 0
    ) / 1000;

  const descriptionDelay =
    (
      Number(
        hero.description_delay
      ) || 0
    ) / 1000;

  const visibleDuration =
    (
      Number(
        hero.text_visible_duration
      ) || 0
    ) / 1000;

  const fadeDuration =
    (
      Number(
        hero.text_fade_duration
      ) || 0
    ) / 1000;

  const overlayOpacity =
    Math.min(
      Math.max(
        Number(
          hero.overlay_opacity
        ) || 0,
        0
      ),
      100
    ) / 100;

  const textAnimation =
    hero.text_animation ||
    "SLIDE_UP";

  const textExitDelay =
    textStartDelay +
    animationDuration +
    visibleDuration;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="relative h-[90vh] min-h-[680px] overflow-hidden bg-black">
      {/* =================================================
          MEDIA
      ================================================= */}

      {mediaType ===
        "VIDEO" &&
        !videoFailed && (
          <video
            ref={
              videoRef
            }
            muted
            loop
            playsInline
            autoPlay={
              loadVideo
            }
            preload={
              loadVideo
                ? "auto"
                : "none"
            }
            poster={
              desktopPosterUrl ||
              undefined
            }
            disablePictureInPicture
            onPlaying={
              handleVideoPlaying
            }
            onError={
              handleVideoError
            }
            className="absolute inset-0 h-full w-full object-cover"
          >
            {loadVideo &&
              activeVideoUrl && (
                <source
                  key={
                    activeVideoUrl
                  }
                  src={
                    activeVideoUrl
                  }
                  type="video/mp4"
                />
              )}
          </video>
        )}

      {mediaType ===
        "IMAGE" &&
        desktopMediaUrl && (
          <img
            src={
              desktopMediaUrl
            }
            alt={
              hero.alt_text ||
              ""
            }
            loading="eager"
            fetchPriority="high"
            decoding="async"
            draggable="false"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}

      {/* =================================================
          VIDEO POSTER BEFORE PLAYBACK
      ================================================= */}

      {mediaType ===
        "VIDEO" &&
        desktopPosterUrl && (
          <motion.div
            initial={
              false
            }
            animate={{
              opacity:
                hasVideoStarted
                  ? 0
                  : 1,
            }}
            transition={{
              duration:
                hasVideoStarted
                  ? 0.8
                  : 0.2,

              ease:
                smoothEase,
            }}
            className="pointer-events-none absolute inset-0 z-10"
          >
            <img
              src={
                desktopPosterUrl
              }
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
          OVERLAY
      ================================================= */}

      <div
        className="pointer-events-none absolute inset-0 z-10 bg-black"
        style={{
          opacity:
            overlayOpacity,
        }}
      />

      {/* Permanent navbar gradient */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-44 bg-gradient-to-b from-black/60 via-black/35 to-transparent" />

      {/* Bottom gradient */}
      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      {/* =================================================
          CONTENT
      ================================================= */}

      <motion.div
        initial={{
          opacity: 1,
        }}
        animate={{
          opacity: 0,
        }}
        transition={{
          delay:
            textExitDelay,

          duration:
            fadeDuration,

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
          initial={
            getAnimationInitial(
              textAnimation
            )
          }
          animate={
            getAnimationTarget(
              textAnimation
            )
          }
          transition={{
            delay:
              textStartDelay,

            duration:
              animationDuration,

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
            {
              hero.heading
            }
          </h1>

          {hero.description && (
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
                delay:
                  descriptionDelay,

                duration: 1,

                ease:
                  smoothEase,
              }}
              className="mx-auto mt-5 max-w-[720px] font-['Inter'] text-[17px] font-normal leading-[1.35] text-white/85 md:text-[21px]"
            >
              {
                hero.description
              }
            </motion.p>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default memo(
  HeroSection
);
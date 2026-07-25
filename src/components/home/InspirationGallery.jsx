import {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { createPortal } from "react-dom";

import {
  Columns2,
  Grid2x2,
  Play,
  Square,
} from "lucide-react";

import { getOptimizedImageUrl } from "../../utils/Mediahelper";

const API_URL = import.meta.env.VITE_API_URL;
const IMAGE_LIMIT = 20;

const VIDEO_EXTENSIONS = [
  "mp4",
  "webm",
  "mov",
  "m4v",
  "ogg",
  "ogv",
];

const getMediaUrl = (media) =>
  media?.image_url ||
  media?.video_url ||
  media?.media_url ||
  media?.url ||
  "";

const getMediaExtension = (url = "") => {
  const cleanUrl = url
    .split("?")[0]
    .split("#")[0];

  return (
    cleanUrl
      .split(".")
      .pop()
      ?.toLowerCase() || ""
  );
};

const isVideoMedia = (media) => {
  const declaredType = String(
    media?.media_type ||
      media?.type ||
      media?.mime_type ||
      ""
  ).toLowerCase();

  if (
    declaredType === "video" ||
    declaredType.startsWith("video/")
  ) {
    return true;
  }

  const extension =
    getMediaExtension(
      getMediaUrl(media)
    );

  return VIDEO_EXTENSIONS.includes(
    extension
  );
};

const getMediaAlt = (media) =>
  media?.image_alt ||
  media?.video_alt ||
  media?.title ||
  media?.name ||
  (isVideoMedia(media)
    ? "Gallery video"
    : "Gallery image");

const GallerySkeleton = ({
  layout,
}) => {
  if (layout === "grid") {
    return (
      <div
        className="min-h-[760px] overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="grid w-max grid-flow-col grid-rows-3 gap-5"
          style={{
            gridAutoColumns: "320px",
          }}
        >
          {Array.from({
            length: 12,
          }).map((_, index) => (
            <div
              key={index}
              className="gallery-skeleton h-[240px] w-[320px]"
            />
          ))}
        </div>
      </div>
    );
  }

  const cardClass =
    layout === "one"
      ? "h-[650px] w-[calc(100vw-120px)]"
      : "h-[520px] w-[calc(50vw-60px)]";

  return (
    <div
      className="min-h-[700px] overflow-hidden"
      aria-hidden="true"
    >
      <div className="flex flex-nowrap gap-5">
        {Array.from({
          length:
            layout === "one" ? 2 : 4,
        }).map((_, index) => (
          <div
            key={index}
            className={`gallery-skeleton shrink-0 ${cardClass}`}
          />
        ))}
      </div>
    </div>
  );
};

const GalleryCard = memo(
  ({
    media,
    className,
    mediaClassName,
    onClick,
    imageWidth = 480,
    imageQuality = 70,
    imageSizes = "320px",
  }) => {
    const videoRef = useRef(null);

    const mediaUrl =
      getMediaUrl(media);

    const mediaAlt =
      getMediaAlt(media);

    const isVideo =
      isVideoMedia(media);

    if (!mediaUrl) {
      return null;
    }

    const handleMouseEnter = () => {
      if (
        !isVideo ||
        !videoRef.current
      ) {
        return;
      }

      videoRef.current
        .play()
        .catch(() => {
          // Browser may block playback.
        });
    };

    const handleMouseLeave = () => {
      if (
        !isVideo ||
        !videoRef.current
      ) {
        return;
      }

      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    };

    return (
      <button
        type="button"
        onClick={() =>
          onClick(media)
        }
        onMouseEnter={
          handleMouseEnter
        }
        onMouseLeave={
          handleMouseLeave
        }
        aria-label={`Open ${mediaAlt} preview`}
        className={`
          group
          relative
          block
          cursor-pointer
          overflow-hidden
          bg-[#f1f1f1]
          text-left
          ${className}
        `}
      >
        {isVideo ? (
          <video
            ref={videoRef}
            src={mediaUrl}
            aria-label={mediaAlt}
            muted
            loop
            playsInline
            preload="metadata"
            disablePictureInPicture
            controlsList="nodownload noplaybackrate"
            className={mediaClassName}
          />
        ) : (
          <img
            src={getOptimizedImageUrl(
              mediaUrl,
              imageWidth,
              imageQuality
            )}
            srcSet={`
              ${getOptimizedImageUrl(mediaUrl, 480, 74)} 480w,
              ${getOptimizedImageUrl(mediaUrl, 640, 76)} 640w,
              ${getOptimizedImageUrl(mediaUrl, 900, 78)} 900w,
              ${getOptimizedImageUrl(mediaUrl, 1200, 80)} 1200w,
              ${getOptimizedImageUrl(mediaUrl, 1600, 82)} 1600w
            `}
            sizes={imageSizes}
            width="320"
            height="240"
            alt={mediaAlt}
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            draggable="false"
            className={mediaClassName}
          />
        )}

        {isVideo && (
          <>
            <span
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-0
                bg-black/10
                transition-colors
                duration-300
                group-hover:bg-black/20
              "
            />

            <span
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                flex
                h-14
                w-14
                -translate-x-1/2
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                bg-black/60
                text-white
                shadow-lg
                backdrop-blur-sm
                transition-all
                duration-300
                group-hover:scale-110
                group-hover:bg-white
                group-hover:text-black
              "
            >
              <Play
                size={21}
                fill="currentColor"
                className="ml-0.5"
              />
            </span>
          </>
        )}
      </button>
    );
  }
);

GalleryCard.displayName =
  "GalleryCard";

const InspirationGallery = () => {
  const sectionRef = useRef(null);
  const imageCacheRef = useRef(
    new Map()
  );

  const [
    shouldFetch,
    setShouldFetch,
  ] = useState(false);

  const [layout, setLayout] =
    useState("grid");

  const [
    activeCategoryId,
    setActiveCategoryId,
  ] = useState("all");

  const [categories, setCategories] =
    useState([]);

  const [
    galleryImages,
    setGalleryImages,
  ] = useState([]);

  const [
    loadingCategories,
    setLoadingCategories,
  ] = useState(false);

  const [
    loadingImages,
    setLoadingImages,
  ] = useState(false);

  const [
    galleryError,
    setGalleryError,
  ] = useState("");

  const [
    selectedMedia,
    setSelectedMedia,
  ] = useState(null);

  useEffect(() => {
    const section =
      sectionRef.current;

    if (!section) {
      return undefined;
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (
            !entry.isIntersecting
          ) {
            return;
          }

          setShouldFetch(true);
          observer.disconnect();
        },
        {
          root: null,
          rootMargin: "150px",
          threshold: 0.01,
        }
      );

    observer.observe(section);

    return () =>
      observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldFetch) {
      return undefined;
    }

    const controller =
      new AbortController();

    const fetchCategories =
      async () => {
        try {
          setLoadingCategories(
            true
          );

          const response =
            await fetch(
              `${API_URL}/inspiration-gallery/categories`,
              {
                signal:
                  controller.signal,
              }
            );

          if (!response.ok) {
            throw new Error(
              `Categories request failed: ${response.status}`
            );
          }

          const result =
            await response.json();

          if (!result.success) {
            throw new Error(
              result.message ||
                "Failed to load categories"
            );
          }

          setCategories(
            Array.isArray(
              result.data
            )
              ? result.data
              : []
          );
        } catch (error) {
          if (
            error.name !==
            "AbortError"
          ) {
            console.error(
              "Failed to fetch inspiration categories:",
              error
            );
          }
        } finally {
          if (
            !controller.signal
              .aborted
          ) {
            setLoadingCategories(
              false
            );
          }
        }
      };

    fetchCategories();

    return () =>
      controller.abort();
  }, [shouldFetch]);

  useEffect(() => {
    if (!shouldFetch) {
      return undefined;
    }

    const cacheKey = String(
      activeCategoryId
    );

    const cachedImages =
      imageCacheRef.current.get(
        cacheKey
      );

    if (cachedImages) {
      setGalleryImages(
        cachedImages
      );

      setLoadingImages(false);
      setGalleryError("");

      return undefined;
    }

    const controller =
      new AbortController();

    const fetchImages =
      async () => {
        try {
          setLoadingImages(true);
          setGalleryError("");

          const query =
            new URLSearchParams({
              limit: String(
                IMAGE_LIMIT
              ),
            });

          if (
            activeCategoryId !==
            "all"
          ) {
            query.set(
              "categoryId",
              String(
                activeCategoryId
              )
            );
          }

          const response =
            await fetch(
              `${API_URL}/inspiration-gallery/images?${query.toString()}`,
              {
                signal:
                  controller.signal,
              }
            );

          if (!response.ok) {
            throw new Error(
              `Images request failed: ${response.status}`
            );
          }

          const result =
            await response.json();

          if (!result.success) {
            throw new Error(
              result.message ||
                "Failed to load gallery media"
            );
          }

          const images =
            Array.isArray(
              result.data
            )
              ? result.data
              : result.data
                    ?.images ||
                result.data?.items ||
                result.data?.rows ||
                [];

          imageCacheRef.current.set(
            cacheKey,
            images
          );

          setGalleryImages(images);
        } catch (error) {
          if (
            error.name !==
            "AbortError"
          ) {
            console.error(
              "Failed to fetch inspiration gallery media:",
              error
            );

            setGalleryImages([]);

            setGalleryError(
              "Unable to load inspiration media."
            );
          }
        } finally {
          if (
            !controller.signal
              .aborted
          ) {
            setLoadingImages(
              false
            );
          }
        }
      };

    fetchImages();

    return () =>
      controller.abort();
  }, [
    shouldFetch,
    activeCategoryId,
  ]);

  useEffect(() => {
    if (!selectedMedia) {
      return undefined;
    }

    const previousOverflow =
      document.body.style
        .overflow;

    document.body.style.overflow =
      "hidden";

    const handleKeyDown = (
      event
    ) => {
      if (
        event.key === "Escape"
      ) {
        setSelectedMedia(null);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [selectedMedia]);

  const filters = useMemo(
    () => [
      {
        id: "all",
        name: "All",
      },
      ...categories,
    ],
    [categories]
  );

  const iconClass = (type) =>
    `transition-colors duration-200 ${
      layout === type
        ? "text-black"
        : "text-[#666] hover:text-black"
    }`;

  const getMediaCardClass = () => {
    if (layout === "two") {
      return "h-[520px] w-[calc(50vw-60px)]";
    }

    if (layout === "one") {
      return "h-[650px] w-[calc(100vw-120px)]";
    }

    return "";
  };

  const responsiveImageSettings =
    useMemo(() => {
      if (layout === "one") {
        return {
          imageWidth: 1400,
          imageQuality: 80,
          imageSizes:
            "calc(100vw - 120px)",
        };
      }

      if (layout === "two") {
        return {
          imageWidth: 1000,
          imageQuality: 76,
          imageSizes:
            "calc(50vw - 60px)",
        };
      }

      return {
        imageWidth: 480,
        imageQuality: 70,
        imageSizes: "320px",
      };
    }, [layout]);

  const selectedMediaUrl =
    getMediaUrl(selectedMedia);

  const selectedMediaIsVideo =
    selectedMedia
      ? isVideoMedia(
          selectedMedia
        )
      : false;

  const selectedMediaAlt =
    selectedMedia
      ? getMediaAlt(
          selectedMedia
        )
      : "";

  return (
    <section
      ref={sectionRef}
      className="bg-white py-[42px]"
    >
      <style>
        {`
          @keyframes galleryShimmer {
            0% {
              transform: translateX(-100%);
            }

            100% {
              transform: translateX(100%);
            }
          }

          .gallery-skeleton {
            position: relative;
            overflow: hidden;
            background: #eeeeee;
          }

          .gallery-skeleton::after {
            content: "";
            position: absolute;
            inset: 0;
            transform: translateX(-100%);
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.75),
              transparent
            );
            animation: galleryShimmer 1.4s infinite;
          }

          @media (prefers-reduced-motion: reduce) {
            .gallery-skeleton::after {
              animation: none;
            }
          }
        `}
      </style>

      <div className="mx-auto max-w-[1850px] px-6 xl:px-[52px]">
        <div className="mb-11 flex items-center justify-between">
          <h2
            className="flex items-center gap-7 text-[18px] font-bold uppercase text-[#111] md:text-[22px]"
            style={{
              fontFamily:
                "Montserrat, sans-serif",
            }}
          >
            INSPIRATION GALLERIES

            <span
              aria-hidden="true"
              className="text-[24px] font-normal text-[#B45309]"
            >
              &rarr;
            </span>
          </h2>
        </div>

        <div className="mb-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div className="flex flex-wrap gap-x-12 gap-y-4">
            {filters.map(
              (item) => {
                const isActive =
                  String(
                    activeCategoryId
                  ) ===
                  String(item.id);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setActiveCategoryId(
                        item.id
                      )
                    }
                    aria-pressed={
                      isActive
                    }
                    className="group relative min-h-11 px-1 pb-2 text-[14px]"
                    style={{
                      fontFamily:
                        "Inter, sans-serif",
                    }}
                  >
                    <span
                      className={`transition-colors duration-300 ${
                        isActive
                          ? "text-black"
                          : "text-[#555] group-hover:text-black"
                      }`}
                    >
                      {item.name}
                    </span>

                    <span
                      aria-hidden="true"
                      className={`absolute bottom-0 left-0 h-[1.5px] bg-black transition-all duration-300 ${
                        isActive
                          ? "w-full"
                          : "w-0 group-hover:w-full"
                      }`}
                    />
                  </button>
                );
              }
            )}

            {loadingCategories &&
              categories.length ===
                0 && (
                <span className="flex min-h-11 items-center text-[14px] text-[#666]">
                  Loading
                  categories...
                </span>
              )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Show gallery in grid layout"
              aria-pressed={
                layout === "grid"
              }
              onClick={() =>
                setLayout("grid")
              }
              className="flex h-11 w-11 items-center justify-center"
            >
              <Grid2x2
                size={18}
                aria-hidden="true"
                className={iconClass(
                  "grid"
                )}
              />
            </button>

            <button
              type="button"
              aria-label="Show gallery in two-column layout"
              aria-pressed={
                layout === "two"
              }
              onClick={() =>
                setLayout("two")
              }
              className="flex h-11 w-11 items-center justify-center"
            >
              <Columns2
                size={18}
                aria-hidden="true"
                className={iconClass(
                  "two"
                )}
              />
            </button>

            <button
              type="button"
              aria-label="Show gallery in single-column layout"
              aria-pressed={
                layout === "one"
              }
              onClick={() =>
                setLayout("one")
              }
              className="flex h-11 w-11 items-center justify-center"
            >
              <Square
                size={18}
                aria-hidden="true"
                className={iconClass(
                  "one"
                )}
              />
            </button>
          </div>
        </div>

        {!shouldFetch ||
        loadingImages ? (
          <GallerySkeleton
            layout={layout}
          />
        ) : galleryError ? (
          <div className="flex h-[700px] items-center justify-center border border-[#ECECEC] bg-[#FAFAFA]">
            <p className="text-[16px] text-[#666]">
              {galleryError}
            </p>
          </div>
        ) : galleryImages.length >
          0 ? (
          layout === "grid" ? (
            <div className="min-h-[760px] overflow-x-auto overflow-y-hidden">
              <div
                className="grid w-max grid-flow-col grid-rows-3 gap-5 pb-3"
                style={{
                  gridAutoColumns:
                    "320px",
                }}
              >
                {galleryImages.map(
                  (media) => (
                    <GalleryCard
                      key={
                        media.id ||
                        getMediaUrl(
                          media
                        )
                      }
                      media={media}
                      onClick={
                        setSelectedMedia
                      }
                      imageWidth={480}
                      imageQuality={70}
                      imageSizes="320px"
                      className="h-[240px] w-[320px]"
                      mediaClassName="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )
                )}
              </div>
            </div>
          ) : (
            <div className="min-h-[700px] overflow-x-auto">
              <div className="flex flex-nowrap gap-5 pb-3">
                {galleryImages.map(
                  (media) => (
                    <GalleryCard
                      key={
                        media.id ||
                        getMediaUrl(
                          media
                        )
                      }
                      media={media}
                      onClick={
                        setSelectedMedia
                      }
                      {...responsiveImageSettings}
                      className={`shrink-0 ${getMediaCardClass()}`}
                      mediaClassName="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )
                )}
              </div>
            </div>
          )
        ) : (
          <div className="flex h-[700px] items-center justify-center border border-[#ECECEC] bg-[#FAFAFA]">
            <div className="text-center">
              <p className="text-[18px] font-medium text-[#222]">
                No inspiration
                media found
              </p>

              <p className="mt-2 text-[14px] text-[#666]">
                Images and videos
                for this category
                will appear here.
              </p>
            </div>
          </div>
        )}
      </div>

{selectedMedia &&
  selectedMediaUrl &&
  createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={
        selectedMediaIsVideo
          ? "Video preview"
          : "Image preview"
      }
      className="
        fixed
        inset-0
        z-[99999]
        flex
        h-[100dvh]
        w-screen
        items-center
        justify-center
        overflow-hidden
        bg-black/80
        p-4
        sm:p-6
      "
      onClick={() =>
        setSelectedMedia(null)
      }
    >
      <button
        type="button"
        aria-label="Close media preview"
        onClick={() =>
          setSelectedMedia(null)
        }
        className="
          absolute
          right-4
          top-4
          z-20
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-full
          bg-black/40
          text-4xl
          font-light
          leading-none
          text-white
          backdrop-blur-sm
          transition
          hover:bg-white
          hover:text-black
        "
      >
        <span
          aria-hidden="true"
          className="-mt-1"
        >
          ×
        </span>
      </button>

      <div
        className="
          relative
          flex
          h-full
          w-full
          items-center
          justify-center
        "
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {selectedMediaIsVideo ? (
          <video
            key={selectedMediaUrl}
            src={selectedMediaUrl}
            aria-label={
              selectedMediaAlt
            }
            controls
            autoPlay
            playsInline
            preload="auto"
            controlsList="nodownload"
            className="
              block
              max-h-full
              max-w-full
              bg-black
              object-contain
            "
          >
            Your browser does not
            support video playback.
          </video>
        ) : (
          <img
            src={getOptimizedImageUrl(
              selectedMediaUrl,
              1800,
              82
            )}
            alt={selectedMediaAlt}
            decoding="async"
            fetchPriority="high"
            className="
              block
              max-h-full
              max-w-full
              object-contain
            "
          />
        )}
      </div>
    </div>,
    document.body
  )}
    </section>
  );
};

export default InspirationGallery;
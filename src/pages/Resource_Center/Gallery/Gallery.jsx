import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Columns2,
  Grid2X2,
  ImageIcon,
  Maximize2,
  Play,
  RefreshCw,
  Square,
  X,
} from "lucide-react";

import { Link } from "react-router-dom";

import { getOptimizedImageUrl } from "../../../utils/Mediahelper";

const API_URL = import.meta.env.VITE_API_URL;
const IMAGES_PER_PAGE = 24;

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
  media?.image ||
  "";

const getFileExtension = (url = "") => {
  try {
    const pathname = new URL(
      url,
      window.location.origin
    ).pathname;

    return (
      pathname
        .split(".")
        .pop()
        ?.toLowerCase() || ""
    );
  } catch {
    return (
      url
        .split("?")[0]
        .split("#")[0]
        .split(".")
        .pop()
        ?.toLowerCase() || ""
    );
  }
};

const isVideoMedia = (media) => {
  const mediaType = String(
    media?.media_type ||
      media?.type ||
      media?.mime_type ||
      ""
  ).toLowerCase();

  if (
    mediaType === "video" ||
    mediaType.startsWith("video/")
  ) {
    return true;
  }

  const mediaUrl = getMediaUrl(media);
  const extension =
    getFileExtension(mediaUrl);

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
    ? "Inspiration gallery video"
    : "Inspiration gallery image");

const getCategoryName = (media) =>
  media?.category_name ||
  media
    ?.inspiration_gallery_categories
    ?.name ||
  "";

const getDisplayTitle = (media) => {
  const title =
    media?.title || media?.name || "";

  if (!title) {
    return "";
  }

  return title.replace(
    /\.(mp4|webm|mov|m4v|ogg|ogv|jpg|jpeg|png|webp|avif)$/i,
    ""
  );
};

const GallerySkeleton = ({ layout }) => {
  if (layout === "one") {
    return (
      <div className="space-y-5">
        {Array.from({ length: 3 }).map(
          (_, index) => (
            <div
              key={index}
              className="
                gallery-skeleton
                aspect-[16/8]
                w-full
                overflow-hidden
                bg-[#eeeeee]
              "
            />
          )
        )}
      </div>
    );
  }

  if (layout === "two") {
    return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {Array.from({ length: 8 }).map(
          (_, index) => (
            <div
              key={index}
              className="
                gallery-skeleton
                aspect-[4/3]
                w-full
                overflow-hidden
                bg-[#eeeeee]
              "
            />
          )
        )}
      </div>
    );
  }

  return (
    <div
      className="
        grid
        grid-cols-1
        gap-4
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
      "
    >
      {Array.from({ length: 12 }).map(
        (_, index) => (
          <div
            key={index}
            className="
              gallery-skeleton
              aspect-[4/3]
              w-full
              overflow-hidden
              bg-[#eeeeee]
            "
          />
        )
      )}
    </div>
  );
};

const GalleryCard = memo(
  ({ media, layout, index, onClick }) => {
    const videoRef = useRef(null);

    const mediaUrl = getMediaUrl(media);
    const mediaAlt = getMediaAlt(media);
    const categoryName =
      getCategoryName(media);
    const displayTitle =
      getDisplayTitle(media);
    const isVideo = isVideoMedia(media);

    if (!mediaUrl) {
      return null;
    }

    const isSingleLayout =
      layout === "one";

    const isTwoLayout =
      layout === "two";

    const imageWidth = isSingleLayout
      ? 1800
      : isTwoLayout
        ? 1100
        : 700;

    const imageQuality = isSingleLayout
      ? 82
      : isTwoLayout
        ? 78
        : 74;

    const imageSizes = isSingleLayout
      ? "(max-width: 768px) 100vw, 1600px"
      : isTwoLayout
        ? "(max-width: 768px) 100vw, 50vw"
        : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw";

    const handleMouseEnter = () => {
      if (!isVideo || !videoRef.current) {
        return;
      }

      videoRef.current
        .play()
        .catch(() => {});
    };

    const handleMouseLeave = () => {
      if (!isVideo || !videoRef.current) {
        return;
      }

      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    };

    return (
      <button
        type="button"
        onClick={() => onClick(media)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label={`Open ${mediaAlt}`}
        className={`
          group
          relative
          block
          w-full
          cursor-pointer
          overflow-hidden
          bg-[#eeeeee]
          text-left
          ${
            isSingleLayout
              ? "aspect-[16/8]"
              : "aspect-[4/3]"
          }
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
            preload={
              index < 4
                ? "metadata"
                : "none"
            }
            disablePictureInPicture
            controlsList="nodownload noplaybackrate"
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-700
              ease-out
              group-hover:scale-105
            "
          />
        ) : (
          <img
            src={getOptimizedImageUrl(
              mediaUrl,
              imageWidth,
              imageQuality
            )}
            srcSet={`
              ${getOptimizedImageUrl(mediaUrl, 480, 72)} 480w,
              ${getOptimizedImageUrl(mediaUrl, 700, 74)} 700w,
              ${getOptimizedImageUrl(mediaUrl, 1000, 77)} 1000w,
              ${getOptimizedImageUrl(mediaUrl, 1400, 80)} 1400w,
              ${getOptimizedImageUrl(mediaUrl, 1800, 82)} 1800w
            `}
            sizes={imageSizes}
            alt={mediaAlt}
            width={
              isSingleLayout
                ? 1600
                : 800
            }
            height={
              isSingleLayout
                ? 800
                : 600
            }
            loading={
              index < 4
                ? "eager"
                : "lazy"
            }
            decoding="async"
            fetchPriority={
              index < 2
                ? "high"
                : "low"
            }
            draggable="false"
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-700
              ease-out
              group-hover:scale-105
            "
          />
        )}

        <span
          aria-hidden="true"
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/45
            via-transparent
            to-transparent
            opacity-0
            transition-opacity
            duration-300
            group-hover:opacity-100
          "
        />

        {isVideo && (
          <span
            aria-hidden="true"
            className="
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
              bg-black/55
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
              size={22}
              fill="currentColor"
              aria-hidden="true"
              className="ml-0.5"
            />
          </span>
        )}

        <span
          className="
            absolute
            right-4
            top-4
            flex
            h-10
            w-10
            translate-y-2
            items-center
            justify-center
            rounded-full
            bg-white/95
            text-[#161412]
            opacity-0
            shadow-lg
            transition-all
            duration-300
            group-hover:translate-y-0
            group-hover:opacity-100
          "
        >
          <Maximize2
            size={17}
            aria-hidden="true"
          />
        </span>

        {(displayTitle ||
          categoryName) && (
          <span
            className="
              absolute
              bottom-0
              left-0
              right-0
              translate-y-3
              p-5
              opacity-0
              transition-all
              duration-300
              group-hover:translate-y-0
              group-hover:opacity-100
            "
          >
            {displayTitle && (
              <span className="block text-[15px] font-medium text-white">
                {displayTitle}
              </span>
            )}

            {categoryName && (
              <span
                className="
                  mt-1
                  block
                  text-[11px]
                  uppercase
                  tracking-[0.14em]
                  text-white/75
                "
              >
                {categoryName}
              </span>
            )}
          </span>
        )}
      </button>
    );
  }
);

GalleryCard.displayName = "GalleryCard";

const LayoutButton = ({
  active,
  label,
  onClick,
  children,
}) => (
  <button
    type="button"
    aria-label={label}
    aria-pressed={active}
    onClick={onClick}
    className={`
      flex
      h-10
      w-10
      items-center
      justify-center
      border
      transition-all
      duration-300
      ${
        active
          ? "border-[#161412] bg-[#161412] text-white"
          : "border-[#dddddd] bg-white text-[#666] hover:border-[#161412] hover:text-[#161412]"
      }
    `}
  >
    {children}
  </button>
);

const normalizeGalleryResponse = (
  result,
  requestedPage
) => {
  const responseData = result?.data;

  if (Array.isArray(responseData)) {
    return {
      images: responseData,
      total: responseData.length,
      page: requestedPage,
      totalPages:
        responseData.length ===
        IMAGES_PER_PAGE
          ? requestedPage + 1
          : requestedPage,
    };
  }

  const images =
    responseData?.images ||
    responseData?.media ||
    responseData?.rows ||
    responseData?.items ||
    responseData?.results ||
    [];

  const total = Number(
    responseData?.total ??
      responseData?.count ??
      result?.total ??
      images.length
  );

  const page = Number(
    responseData?.page ??
      responseData?.currentPage ??
      result?.page ??
      requestedPage
  );

  const totalPages = Number(
    responseData?.totalPages ??
      responseData?.pages ??
      result?.totalPages ??
      Math.max(
        1,
        Math.ceil(
          total / IMAGES_PER_PAGE
        )
      )
  );

  return {
    images: Array.isArray(images)
      ? images
      : [],
    total,
    page,
    totalPages,
  };
};

export const Gallery = () => {
  const sectionRef = useRef(null);
  const imageCacheRef = useRef(
    new Map()
  );

  const [categories, setCategories] =
    useState([]);

  const [galleryImages, setGalleryImages] =
    useState([]);

  const [
    activeCategoryId,
    setActiveCategoryId,
  ] = useState("all");

  const [layout, setLayout] =
    useState("grid");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [totalPages, setTotalPages] =
    useState(1);

  const [totalImages, setTotalImages] =
    useState(0);

  const [
    loadingCategories,
    setLoadingCategories,
  ] = useState(true);

  const [loadingImages, setLoadingImages] =
    useState(true);

  const [galleryError, setGalleryError] =
    useState("");

  const [
    selectedMedia,
    setSelectedMedia,
  ] = useState(null);

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

  const galleryGridClass =
    useMemo(() => {
      if (layout === "one") {
        return "grid grid-cols-1 gap-5";
      }

      if (layout === "two") {
        return "grid grid-cols-1 gap-5 md:grid-cols-2";
      }

      return `
        grid
        grid-cols-1
        gap-4
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
      `;
    }, [layout]);

  const fetchCategories =
    useCallback(async (signal) => {
      try {
        setLoadingCategories(true);

        const response = await fetch(
          `${API_URL}/inspiration-gallery/categories`,
          {
            signal,
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
          Array.isArray(result.data)
            ? result.data
            : []
        );
      } catch (error) {
        if (
          error.name !== "AbortError"
        ) {
          console.error(
            "Failed to fetch inspiration categories:",
            error
          );
        }
      } finally {
        if (!signal.aborted) {
          setLoadingCategories(false);
        }
      }
    }, []);

  const fetchImages = useCallback(
    async ({
      categoryId,
      page,
      signal,
      force = false,
    }) => {
      const cacheKey = `${categoryId}-${page}`;

      if (
        !force &&
        imageCacheRef.current.has(
          cacheKey
        )
      ) {
        const cached =
          imageCacheRef.current.get(
            cacheKey
          );

        setGalleryImages(
          cached.images
        );

        setTotalImages(cached.total);

        setTotalPages(
          cached.totalPages
        );

        setGalleryError("");
        setLoadingImages(false);

        return;
      }

      try {
        setLoadingImages(true);
        setGalleryError("");

        const query =
          new URLSearchParams({
            limit: String(
              IMAGES_PER_PAGE
            ),
            page: String(page),
          });

        if (categoryId !== "all") {
          query.set(
            "categoryId",
            String(categoryId)
          );
        }

        const response = await fetch(
          `${API_URL}/inspiration-gallery/images?${query.toString()}`,
          {
            signal,
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

        const normalized =
          normalizeGalleryResponse(
            result,
            page
          );

        imageCacheRef.current.set(
          cacheKey,
          normalized
        );

        setGalleryImages(
          normalized.images
        );

        setTotalImages(
          normalized.total
        );

        setTotalPages(
          normalized.totalPages
        );
      } catch (error) {
        if (
          error.name !== "AbortError"
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
        if (!signal.aborted) {
          setLoadingImages(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    const controller =
      new AbortController();

    fetchCategories(
      controller.signal
    );

    return () =>
      controller.abort();
  }, [fetchCategories]);

  useEffect(() => {
    const controller =
      new AbortController();

    fetchImages({
      categoryId:
        activeCategoryId,
      page: currentPage,
      signal: controller.signal,
    });

    return () =>
      controller.abort();
  }, [
    activeCategoryId,
    currentPage,
    fetchImages,
  ]);

  useEffect(() => {
    if (!selectedMedia) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    const handleKeyDown = (
      event
    ) => {
      if (event.key === "Escape") {
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

  const scrollToSection =
    useCallback(() => {
      window.setTimeout(() => {
        sectionRef.current?.scrollIntoView(
          {
            behavior: "smooth",
            block: "start",
          }
        );
      }, 50);
    }, []);

  const handleCategoryChange = (
    categoryId
  ) => {
    if (
      String(categoryId) ===
      String(activeCategoryId)
    ) {
      return;
    }

    setActiveCategoryId(
      categoryId
    );

    setCurrentPage(1);
    scrollToSection();
  };

  const handlePageChange = (
    page
  ) => {
    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage
    ) {
      return;
    }

    setCurrentPage(page);
    scrollToSection();
  };

  const handleRetry = () => {
    const cacheKey = `${activeCategoryId}-${currentPage}`;

    imageCacheRef.current.delete(
      cacheKey
    );

    const controller =
      new AbortController();

    fetchImages({
      categoryId:
        activeCategoryId,
      page: currentPage,
      signal: controller.signal,
      force: true,
    });
  };

  const selectedMediaUrl =
    getMediaUrl(selectedMedia);

  const selectedMediaIsVideo =
    selectedMedia
      ? isVideoMedia(selectedMedia)
      : false;

  const selectedMediaAlt =
    selectedMedia
      ? getMediaAlt(selectedMedia)
      : "";

  const selectedMediaTitle =
    selectedMedia
      ? getDisplayTitle(selectedMedia)
      : "";

  return (
    <>
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
          }

          .gallery-skeleton::after {
            content: "";
            position: absolute;
            inset: 0;
            transform: translateX(-100%);
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.78),
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

      <div className="min-h-screen pt-[110px]">
        <section>
          <div className="mx-auto max-w-[1650px] px-6 xl:px-10">
            <h1
              className="text-[34px] font-semibold text-[#161412] md:text-[42px]"
              style={{
                fontFamily:
                  "Montserrat, sans-serif",
              }}
            >
              Inspiration Gallery
            </h1>

            <div className="mb-5 mt-3 h-[4px] w-[70px] bg-[#c91f26]" />

            <p className="text-[13px] text-[#777]">
              <Link
                to="/"
                className="duration-300 hover:text-[#161412]"
              >
                Home
              </Link>

              {" / "}

              <Link
                to="/"
                className="duration-300 hover:text-[#161412]"
              >
                Resource Center
              </Link>

              {" / "}

              <span className="font-semibold text-[#161412]">
                Portfolio
              </span>
            </p>
          </div>
        </section>

        <section
          className="scroll-mt-[110px] py-14"
          ref={sectionRef}
        >
          <div className="mx-auto max-w-[1650px] px-6 xl:px-10">
            <div
              className="
                mb-9
                flex
                flex-col
                gap-6
                border-b
                border-[#e4e4e4]
                pb-7
                lg:flex-row
                lg:items-end
                lg:justify-between
              "
            >
              <div className="min-w-0">
                <p
                  className="
                    mb-4
                    text-[12px]
                    font-semibold
                    uppercase
                    tracking-[0.16em]
                    text-[#777]
                  "
                >
                  Filter by application
                </p>

                <div className="flex max-w-full gap-2 overflow-x-auto pb-2">
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
                          disabled={
                            loadingCategories
                          }
                          onClick={() =>
                            handleCategoryChange(
                              item.id
                            )
                          }
                          className={`
                            shrink-0
                            border
                            px-5
                            py-2.5
                            text-[13px]
                            font-medium
                            transition-all
                            duration-300
                            disabled:opacity-50
                            ${
                              isActive
                                ? "border-[#161412] bg-[#161412] text-white"
                                : "border-[#dedede] bg-white text-[#555] hover:border-[#161412] hover:text-[#161412]"
                            }
                          `}
                        >
                          {item.name}
                        </button>
                      );
                    }
                  )}

                  {loadingCategories &&
                    categories.length ===
                      0 && (
                      <>
                        <div className="gallery-skeleton h-[42px] w-[105px] shrink-0 bg-[#eeeeee]" />
                        <div className="gallery-skeleton h-[42px] w-[125px] shrink-0 bg-[#eeeeee]" />
                        <div className="gallery-skeleton h-[42px] w-[110px] shrink-0 bg-[#eeeeee]" />
                      </>
                    )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <LayoutButton
                  active={
                    layout === "grid"
                  }
                  label="Grid layout"
                  onClick={() =>
                    setLayout("grid")
                  }
                >
                  <Grid2X2
                    size={17}
                    aria-hidden="true"
                  />
                </LayoutButton>

                <LayoutButton
                  active={
                    layout === "two"
                  }
                  label="Two-column layout"
                  onClick={() =>
                    setLayout("two")
                  }
                >
                  <Columns2
                    size={17}
                    aria-hidden="true"
                  />
                </LayoutButton>

                <LayoutButton
                  active={
                    layout === "one"
                  }
                  label="Single-column layout"
                  onClick={() =>
                    setLayout("one")
                  }
                >
                  <Square
                    size={16}
                    aria-hidden="true"
                  />
                </LayoutButton>
              </div>
            </div>

            {loadingImages ? (
              <GallerySkeleton
                layout={layout}
              />
            ) : galleryError ? (
              <div
                className="
                  flex
                  min-h-[500px]
                  items-center
                  justify-center
                  border
                  border-[#e5e5e5]
                  bg-[#fafafa]
                  px-6
                "
              >
                <div className="max-w-[420px] text-center">
                  <div
                    className="
                      mx-auto
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-full
                      bg-white
                      text-[#777]
                      shadow-sm
                    "
                  >
                    <ImageIcon
                      size={24}
                      aria-hidden="true"
                    />
                  </div>

                  <p className="mt-5 text-[18px] font-semibold text-[#222]">
                    Gallery unavailable
                  </p>

                  <p className="mt-2 text-[14px] leading-6 text-[#666]">
                    {galleryError}
                  </p>

                  <button
                    type="button"
                    onClick={
                      handleRetry
                    }
                    className="
                      mx-auto
                      mt-6
                      flex
                      items-center
                      gap-2
                      bg-[#161412]
                      px-6
                      py-3
                      text-[13px]
                      font-medium
                      text-white
                      transition-colors
                      duration-300
                      hover:bg-[#c91f26]
                    "
                  >
                    <RefreshCw
                      size={16}
                      aria-hidden="true"
                    />

                    Try Again
                  </button>
                </div>
              </div>
            ) : galleryImages.length >
              0 ? (
              <div
                className={
                  galleryGridClass
                }
              >
                {galleryImages.map(
                  (media, index) => (
                    <GalleryCard
                      key={
                        media.id ||
                        getMediaUrl(
                          media
                        ) ||
                        `${currentPage}-${index}`
                      }
                      media={media}
                      layout={layout}
                      index={index}
                      onClick={
                        setSelectedMedia
                      }
                    />
                  )
                )}
              </div>
            ) : (
              <div
                className="
                  flex
                  min-h-[500px]
                  items-center
                  justify-center
                  border
                  border-[#e5e5e5]
                  bg-[#fafafa]
                  px-6
                "
              >
                <div className="text-center">
                  <ImageIcon
                    size={34}
                    className="mx-auto text-[#999]"
                    aria-hidden="true"
                  />

                  <p className="mt-5 text-[18px] font-semibold text-[#222]">
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

            {!loadingImages &&
              !galleryError &&
              galleryImages.length > 0 &&
              totalPages > 1 && (
                <div className="mt-16 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      handlePageChange(
                        currentPage - 1
                      )
                    }
                    disabled={
                      currentPage === 1
                    }
                    className="
                      text-sm
                      duration-300
                      hover:text-[#c91f26]
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    Prev
                  </button>

                  {Array.from(
                    {
                      length:
                        totalPages,
                    },
                    (_, index) =>
                      index + 1
                  ).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() =>
                        handlePageChange(
                          page
                        )
                      }
                      className={`
                        h-8
                        w-8
                        rounded
                        text-sm
                        duration-300
                        ${
                          currentPage ===
                          page
                            ? "bg-black text-white"
                            : "hover:text-[#c91f26]"
                        }
                      `}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      handlePageChange(
                        currentPage + 1
                      )
                    }
                    disabled={
                      currentPage ===
                      totalPages
                    }
                    className="
                      text-sm
                      duration-300
                      hover:text-[#c91f26]
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    Next Page
                  </button>
                </div>
              )}
          </div>
        </section>
      </div>

      {selectedMedia &&
        selectedMediaUrl && (
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
              z-[9999]
              flex
              items-center
              justify-center
              bg-black/85
              p-4
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
                right-5
                top-5
                z-10
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-full
                bg-white/10
                text-white
                transition-colors
                duration-300
                hover:bg-white
                hover:text-black
              "
            >
              <X
                size={25}
                aria-hidden="true"
              />
            </button>

            <div
              className="
                flex
                max-h-[92vh]
                max-w-[96vw]
                flex-col
                items-center
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
                    max-h-[86vh]
                    max-w-[96vw]
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
                    2200,
                    86
                  )}
                  alt={
                    selectedMediaAlt
                  }
                  decoding="async"
                  fetchPriority="high"
                  className="
                    max-h-[86vh]
                    max-w-[96vw]
                    object-contain
                  "
                />
              )}


            </div>
          </div>
        )}

    </>
  );
};

export default Gallery;
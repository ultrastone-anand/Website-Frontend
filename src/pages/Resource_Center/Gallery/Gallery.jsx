import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { createPortal } from "react-dom";

import {
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  Maximize2,
  Play,
  RefreshCw,
  X,
} from "lucide-react";

import { Link } from "react-router-dom";

import {
  getOptimizedImageUrl,
} from "../../../utils/Mediahelper";

/* =========================================================
   CONFIG
========================================================= */

const API_URL =
  import.meta.env.VITE_API_URL;

const IMAGES_PER_PAGE = 24;

const VIDEO_EXTENSIONS = [
  "mp4",
  "webm",
  "mov",
  "m4v",
  "ogg",
  "ogv",
];

/* =========================================================
   MEDIA HELPERS
========================================================= */

const getMediaUrl = (media) =>
  media?.image_url ||
  media?.video_url ||
  media?.media_url ||
  media?.url ||
  media?.image ||
  "";

/* =========================================================
   FILE EXTENSION
========================================================= */

const getFileExtension = (
  url = "",
) => {
  try {
    const pathname =
      new URL(
        url,
        window.location.origin,
      ).pathname;

    return (
      pathname
        .split(".")
        .pop()
        ?.toLowerCase() ||
      ""
    );
  } catch {
    return (
      url
        .split("?")[0]
        .split("#")[0]
        .split(".")
        .pop()
        ?.toLowerCase() ||
      ""
    );
  }
};

/* =========================================================
   VIDEO CHECK
========================================================= */

const isVideoMedia = (
  media,
) => {
  const mediaType =
    String(
      media?.media_type ||
        media?.type ||
        media?.mime_type ||
        "",
    ).toLowerCase();

  if (
    mediaType ===
      "video" ||
    mediaType.startsWith(
      "video/",
    )
  ) {
    return true;
  }

  const mediaUrl =
    getMediaUrl(media);

  const extension =
    getFileExtension(
      mediaUrl,
    );

  return VIDEO_EXTENSIONS.includes(
    extension,
  );
};

/* =========================================================
   MEDIA ALT
========================================================= */

const getMediaAlt = (
  media,
) =>
  media?.image_alt ||
  media?.video_alt ||
  media?.title ||
  media?.name ||
  (isVideoMedia(media)
    ? "Inspiration gallery video"
    : "Inspiration gallery image");

/* =========================================================
   CATEGORY NAME
========================================================= */

const getCategoryName = (
  media,
) =>
  media?.category_name ||
  media
    ?.inspiration_gallery_categories
    ?.name ||
  "";

/* =========================================================
   DISPLAY TITLE
========================================================= */

const getDisplayTitle = (
  media,
) => {
  const title =
    media?.title ||
    media?.name ||
    "";

  if (!title) {
    return "";
  }

  return title.replace(
    /\.(mp4|webm|mov|m4v|ogg|ogv|jpg|jpeg|png|webp|avif)$/i,
    "",
  );
};

/* =========================================================
   NUMBER HELPER
========================================================= */

const getValidNumber = (
  ...values
) => {
  for (const value of values) {
    const number =
      Number(value);

    if (
      Number.isFinite(
        number,
      ) &&
      number >= 0
    ) {
      return number;
    }
  }

  return null;
};

/* =========================================================
   NORMALIZE API RESPONSE

   Supports responses like:

   data: {
     images: [],
     total: 100,
     page: 1,
     totalPages: 5
   }

   data: {
     images: [],
     pagination: {
       total: 100,
       page: 1,
       totalPages: 5
     }
   }

   data: {
     rows: [],
     pagination: {
       total_count: 100,
       current_page: 1,
       total_pages: 5
     }
   }

   Also works even when pagination metadata is missing.
========================================================= */

const normalizeGalleryResponse = (
  result,
  requestedPage,
) => {
  const responseData =
    result?.data;

  /* ===============================================
     RAW ARRAY RESPONSE
  =============================================== */

  if (
    Array.isArray(
      responseData,
    )
  ) {
    const images =
      responseData;

    const hasPossibleNextPage =
      images.length ===
      IMAGES_PER_PAGE;

    return {
      images,

      total: null,

      page:
        requestedPage,

      totalPages:
        hasPossibleNextPage
          ? requestedPage +
            1
          : requestedPage,

      hasNextPage:
        hasPossibleNextPage,

      hasPreviousPage:
        requestedPage >
        1,

      totalKnown:
        false,
    };
  }

  /* ===============================================
     FIND IMAGE ARRAY
  =============================================== */

  const images =
    responseData?.images ||
    responseData?.media ||
    responseData?.rows ||
    responseData?.items ||
    responseData?.results ||
    responseData?.data ||
    [];

  const normalizedImages =
    Array.isArray(images)
      ? images
      : [];

  /* ===============================================
     PAGINATION OBJECTS
  =============================================== */

  const pagination =
    responseData?.pagination ||
    responseData?.meta ||
    responseData?.paging ||
    result?.pagination ||
    result?.meta ||
    {};

  /* ===============================================
     TOTAL ITEMS
  =============================================== */

  const total =
    getValidNumber(
      responseData?.total,
      responseData?.count,
      responseData?.totalCount,
      responseData?.total_count,

      pagination?.total,
      pagination?.count,
      pagination?.totalCount,
      pagination?.total_count,
      pagination?.totalItems,
      pagination?.total_items,

      result?.total,
      result?.count,
    );

  /* ===============================================
     CURRENT PAGE
  =============================================== */

  const page =
    getValidNumber(
      responseData?.page,
      responseData?.currentPage,
      responseData?.current_page,

      pagination?.page,
      pagination?.currentPage,
      pagination?.current_page,

      result?.page,

      requestedPage,
    ) ||
    requestedPage;

  /* ===============================================
     BACKEND TOTAL PAGES
  =============================================== */

  const backendTotalPages =
    getValidNumber(
      responseData?.totalPages,
      responseData?.total_pages,
      responseData?.pages,
      responseData?.pageCount,
      responseData?.page_count,

      pagination?.totalPages,
      pagination?.total_pages,
      pagination?.pages,
      pagination?.pageCount,
      pagination?.page_count,
      pagination?.lastPage,
      pagination?.last_page,

      result?.totalPages,
      result?.total_pages,
    );

  /* ===============================================
     LIMIT / PAGE SIZE
  =============================================== */

  const pageSize =
    getValidNumber(
      responseData?.limit,
      responseData?.pageSize,
      responseData?.page_size,
      responseData?.perPage,
      responseData?.per_page,

      pagination?.limit,
      pagination?.pageSize,
      pagination?.page_size,
      pagination?.perPage,
      pagination?.per_page,

      IMAGES_PER_PAGE,
    ) ||
    IMAGES_PER_PAGE;

  /* ===============================================
     CALCULATE TOTAL PAGES
  =============================================== */

  let totalPages =
    1;

  let totalKnown =
    false;

  if (
    backendTotalPages !==
      null &&
    backendTotalPages > 0
  ) {
    totalPages =
      backendTotalPages;

    totalKnown =
      true;
  } else if (
    total !== null &&
    total >= 0
  ) {
    totalPages =
      Math.max(
        1,
        Math.ceil(
          total /
            pageSize,
        ),
      );

    totalKnown =
      true;
  } else {
    /*
     * IMPORTANT:
     *
     * If backend gives us exactly
     * 24 items but gives no total,
     * assume that another page might
     * exist.
     */
    totalPages =
      normalizedImages.length ===
      IMAGES_PER_PAGE
        ? page + 1
        : page;

    totalKnown =
      false;
  }

  /* ===============================================
     NEXT PAGE INFO
  =============================================== */

  const backendHasNext =
    pagination?.hasNextPage ??
    pagination?.has_next_page ??
    pagination?.hasNext ??
    pagination?.has_next ??
    responseData?.hasNextPage ??
    responseData?.has_next_page ??
    responseData?.hasNext ??
    null;

  const hasNextPage =
    backendHasNext !== null
      ? Boolean(
          backendHasNext,
        )
      : totalKnown
        ? page <
          totalPages
        : normalizedImages.length ===
          IMAGES_PER_PAGE;

  return {
    images:
      normalizedImages,

    total,

    page,

    totalPages:
      Math.max(
        page,
        totalPages,
      ),

    hasNextPage,

    hasPreviousPage:
      page > 1,

    totalKnown,
  };
};

/* =========================================================
   GALLERY SKELETON
========================================================= */

const GallerySkeleton =
  () => {
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
        {Array.from({
          length:
            IMAGES_PER_PAGE,
        }).map(
          (
            _,
            index,
          ) => (
            <div
              key={
                index
              }
              className="
                gallery-skeleton
                aspect-[4/3]
                w-full
                overflow-hidden
                bg-[#eeeeee]
              "
            />
          ),
        )}
      </div>
    );
  };

/* =========================================================
   GALLERY CARD
========================================================= */

const GalleryCard = memo(
  ({
    media,
    index,
    onClick,
  }) => {
    const videoRef =
      useRef(null);

    const mediaUrl =
      getMediaUrl(
        media,
      );

    const mediaAlt =
      getMediaAlt(
        media,
      );

    const categoryName =
      getCategoryName(
        media,
      );

    const displayTitle =
      getDisplayTitle(
        media,
      );

    const isVideo =
      isVideoMedia(
        media,
      );

    if (!mediaUrl) {
      return null;
    }

    /* ===============================================
       VIDEO HOVER
    =============================================== */

    const handleMouseEnter =
      () => {
        if (
          !isVideo ||
          !videoRef.current
        ) {
          return;
        }

        videoRef.current
          .play()
          .catch(
            () => {},
          );
      };

    const handleMouseLeave =
      () => {
        if (
          !isVideo ||
          !videoRef.current
        ) {
          return;
        }

        videoRef.current.pause();

        try {
          videoRef.current.currentTime =
            0;
        } catch {
          // Ignore
        }
      };

    return (
      <button
        type="button"
        onClick={() =>
          onClick(
            media,
          )
        }
        onMouseEnter={
          handleMouseEnter
        }
        onMouseLeave={
          handleMouseLeave
        }
        aria-label={`Open ${mediaAlt}`}
        className="
          group
          relative
          block
          aspect-[4/3]
          w-full
          cursor-pointer
          overflow-hidden
          bg-[#eeeeee]
          text-left
        "
      >
        {/* ===========================================
            MEDIA
        =========================================== */}

        {isVideo ? (
          <video
            ref={
              videoRef
            }
            src={
              mediaUrl
            }
            aria-label={
              mediaAlt
            }
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
              900,
              82,
            )}
            srcSet={`
              ${getOptimizedImageUrl(
                mediaUrl,
                480,
                76,
              )} 480w,

              ${getOptimizedImageUrl(
                mediaUrl,
                700,
                79,
              )} 700w,

              ${getOptimizedImageUrl(
                mediaUrl,
                900,
                82,
              )} 900w,

              ${getOptimizedImageUrl(
                mediaUrl,
                1200,
                84,
              )} 1200w
            `}
            sizes="
              (max-width: 639px) 100vw,
              (max-width: 1023px) 50vw,
              (max-width: 1279px) 33vw,
              25vw
            "
            alt={
              mediaAlt
            }
            width="900"
            height="675"
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
            draggable={
              false
            }
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

        {/* ===========================================
            DARK HOVER
        =========================================== */}

        <span
          aria-hidden="true"
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/55
            via-black/5
            to-transparent
            opacity-0
            transition-opacity
            duration-300
            group-hover:opacity-100
          "
        />

        {/* ===========================================
            VIDEO PLAY ICON
        =========================================== */}

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
              size={
                22
              }
              fill="currentColor"
              aria-hidden="true"
              className="ml-0.5"
            />
          </span>
        )}

        {/* ===========================================
            EXPAND ICON
        =========================================== */}

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
            size={
              17
            }
            aria-hidden="true"
          />
        </span>

        {/* ===========================================
            TITLE
        =========================================== */}

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
                {
                  displayTitle
                }
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
                {
                  categoryName
                }
              </span>
            )}
          </span>
        )}
      </button>
    );
  },
);

GalleryCard.displayName =
  "GalleryCard";

/* =========================================================
   PAGE BUTTON GENERATOR

   Avoid showing 50/100 page buttons.
========================================================= */

const getPageNumbers = ({
  currentPage,
  totalPages,
}) => {
  if (
    totalPages <= 7
  ) {
    return Array.from(
      {
        length:
          totalPages,
      },
      (
        _,
        index,
      ) =>
        index + 1,
    );
  }

  const pages =
    new Set([
      1,
      totalPages,
      currentPage,
      currentPage - 1,
      currentPage + 1,
    ]);

  return Array.from(
    pages,
  )
    .filter(
      (page) =>
        page >= 1 &&
        page <=
          totalPages,
    )
    .sort(
      (a, b) =>
        a - b,
    );
};

/* =========================================================
   GALLERY
========================================================= */

export const Gallery =
  () => {
    const sectionRef =
      useRef(null);

    const imageCacheRef =
      useRef(
        new Map(),
      );

    /* =====================================================
       STATE
    ===================================================== */

    const [
      categories,
      setCategories,
    ] = useState([]);

    const [
      galleryImages,
      setGalleryImages,
    ] = useState([]);

    const [
      activeCategoryId,
      setActiveCategoryId,
    ] = useState(
      "all",
    );

    const [
      currentPage,
      setCurrentPage,
    ] = useState(1);

    const [
      totalPages,
      setTotalPages,
    ] = useState(1);

    const [
      totalImages,
      setTotalImages,
    ] = useState(null);

    const [
      hasNextPage,
      setHasNextPage,
    ] = useState(
      false,
    );

    const [
      totalKnown,
      setTotalKnown,
    ] = useState(
      false,
    );

    const [
      loadingCategories,
      setLoadingCategories,
    ] = useState(
      true,
    );

    const [
      loadingImages,
      setLoadingImages,
    ] = useState(
      true,
    );

    const [
      galleryError,
      setGalleryError,
    ] = useState(
      "",
    );

    const [
      selectedMedia,
      setSelectedMedia,
    ] = useState(
      null,
    );

    const [
      previewLoading,
      setPreviewLoading,
    ] = useState(
      false,
    );

    /* =====================================================
       FILTERS
    ===================================================== */

    const filters =
      useMemo(
        () => [
          {
            id:
              "all",

            name:
              "All",
          },

          ...categories,
        ],
        [
          categories,
        ],
      );

    /* =====================================================
       FETCH CATEGORIES
    ===================================================== */

    const fetchCategories =
      useCallback(
        async (
          signal,
        ) => {
          try {
            setLoadingCategories(
              true,
            );

            const response =
              await fetch(
                `${API_URL}/inspiration-gallery/categories`,
                {
                  signal,
                },
              );

            if (
              !response.ok
            ) {
              throw new Error(
                `Categories request failed: ${response.status}`,
              );
            }

            const result =
              await response.json();

            if (
              !result.success
            ) {
              throw new Error(
                result.message ||
                  "Failed to load categories",
              );
            }

            const data =
              Array.isArray(
                result.data,
              )
                ? result.data
                : [];

            /*
             * Alphabetical categories
             */
            const sorted =
              [...data].sort(
                (
                  a,
                  b,
                ) =>
                  String(
                    a?.name ||
                      "",
                  ).localeCompare(
                    String(
                      b?.name ||
                        "",
                    ),
                    undefined,
                    {
                      sensitivity:
                        "base",
                    },
                  ),
              );

            setCategories(
              sorted,
            );
          } catch (error) {
            if (
              error.name !==
              "AbortError"
            ) {
              console.error(
                "Failed to fetch inspiration categories:",
                error,
              );
            }
          } finally {
            if (
              !signal.aborted
            ) {
              setLoadingCategories(
                false,
              );
            }
          }
        },
        [],
      );

    /* =====================================================
       FETCH IMAGES
    ===================================================== */

    const fetchImages =
      useCallback(
        async ({
          categoryId,
          page,
          signal,
          force = false,
        }) => {
          const cacheKey =
            `${categoryId}-${page}`;

          /* ===============================================
             CACHE
          =============================================== */

          if (
            !force &&
            imageCacheRef.current.has(
              cacheKey,
            )
          ) {
            const cached =
              imageCacheRef.current.get(
                cacheKey,
              );

            setGalleryImages(
              cached.images,
            );

            setTotalImages(
              cached.total,
            );

            setTotalPages(
              cached.totalPages,
            );

            setHasNextPage(
              cached.hasNextPage,
            );

            setTotalKnown(
              cached.totalKnown,
            );

            setGalleryError(
              "",
            );

            setLoadingImages(
              false,
            );

            return;
          }

          /* ===============================================
             REQUEST
          =============================================== */

          try {
            setLoadingImages(
              true,
            );

            setGalleryError(
              "",
            );

            const query =
              new URLSearchParams(
                {
                  limit:
                    String(
                      IMAGES_PER_PAGE,
                    ),

                  page:
                    String(
                      page,
                    ),
                },
              );

            if (
              categoryId !==
              "all"
            ) {
              query.set(
                "categoryId",
                String(
                  categoryId,
                ),
              );
            }

            const requestUrl =
              `${API_URL}/inspiration-gallery/images?${query.toString()}`;

            console.log(
              "🟦 Gallery request:",
              requestUrl,
            );

            const response =
              await fetch(
                requestUrl,
                {
                  signal,
                },
              );

            if (
              !response.ok
            ) {
              throw new Error(
                `Images request failed: ${response.status}`,
              );
            }

            const result =
              await response.json();

            console.log(
              "🟩 Gallery API response:",
              result,
            );

            if (
              result.success ===
              false
            ) {
              throw new Error(
                result.message ||
                  "Failed to load gallery media",
              );
            }

            const normalized =
              normalizeGalleryResponse(
                result,
                page,
              );

            console.log(
              "🟨 Normalized pagination:",
              normalized,
            );

            /* ===============================================
               IMPORTANT LAST PAGE HANDLING
            =============================================== */

            let resolvedTotalPages =
              normalized.totalPages;

            /*
             * Suppose page 1 had 24 items and no metadata,
             * so we guessed page 2 existed.
             *
             * Then page 2 returns 10.
             *
             * We now know page 2 is final.
             */
            if (
              !normalized.totalKnown &&
              normalized.images.length <
                IMAGES_PER_PAGE
            ) {
              resolvedTotalPages =
                page;
            }

            const finalData =
              {
                ...normalized,

                totalPages:
                  resolvedTotalPages,
              };

            imageCacheRef.current.set(
              cacheKey,
              finalData,
            );

            setGalleryImages(
              finalData.images,
            );

            setTotalImages(
              finalData.total,
            );

            setTotalPages(
              finalData.totalPages,
            );

            setHasNextPage(
              finalData.hasNextPage,
            );

            setTotalKnown(
              finalData.totalKnown,
            );
          } catch (error) {
            if (
              error.name !==
              "AbortError"
            ) {
              console.error(
                "Failed to fetch inspiration gallery media:",
                error,
              );

              setGalleryImages(
                [],
              );

              setGalleryError(
                "Unable to load inspiration media.",
              );
            }
          } finally {
            if (
              !signal.aborted
            ) {
              setLoadingImages(
                false,
              );
            }
          }
        },
        [],
      );

    /* =====================================================
       LOAD CATEGORIES
    ===================================================== */

    useEffect(() => {
      const controller =
        new AbortController();

      fetchCategories(
        controller.signal,
      );

      return () => {
        controller.abort();
      };
    }, [
      fetchCategories,
    ]);

    /* =====================================================
       LOAD PAGE
    ===================================================== */

    useEffect(() => {
      const controller =
        new AbortController();

      fetchImages({
        categoryId:
          activeCategoryId,

        page:
          currentPage,

        signal:
          controller.signal,
      });

      return () => {
        controller.abort();
      };
    }, [
      activeCategoryId,
      currentPage,
      fetchImages,
    ]);

    /* =====================================================
       PRELOAD NEXT PAGE LIGHTLY

       This makes page 2 feel quicker.
    ===================================================== */

    useEffect(() => {
      if (
        loadingImages ||
        !hasNextPage
      ) {
        return undefined;
      }

      const nextPage =
        currentPage + 1;

      const cacheKey =
        `${activeCategoryId}-${nextPage}`;

      if (
        imageCacheRef.current.has(
          cacheKey,
        )
      ) {
        return undefined;
      }

      const controller =
        new AbortController();

      const timeoutId =
        window.setTimeout(
          async () => {
            try {
              const query =
                new URLSearchParams(
                  {
                    limit:
                      String(
                        IMAGES_PER_PAGE,
                      ),

                    page:
                      String(
                        nextPage,
                      ),
                  },
                );

              if (
                activeCategoryId !==
                "all"
              ) {
                query.set(
                  "categoryId",
                  String(
                    activeCategoryId,
                  ),
                );
              }

              const response =
                await fetch(
                  `${API_URL}/inspiration-gallery/images?${query.toString()}`,
                  {
                    signal:
                      controller.signal,
                  },
                );

              if (
                !response.ok
              ) {
                return;
              }

              const result =
                await response.json();

              if (
                result.success ===
                false
              ) {
                return;
              }

              const normalized =
                normalizeGalleryResponse(
                  result,
                  nextPage,
                );

              imageCacheRef.current.set(
                cacheKey,
                normalized,
              );
            } catch (error) {
              if (
                error.name !==
                "AbortError"
              ) {
                console.warn(
                  "Next gallery page preload failed:",
                  error,
                );
              }
            }
          },
          500,
        );

      return () => {
        window.clearTimeout(
          timeoutId,
        );

        controller.abort();
      };
    }, [
      activeCategoryId,
      currentPage,
      hasNextPage,
      loadingImages,
    ]);

    /* =====================================================
       MODAL
    ===================================================== */

    useEffect(() => {
      if (
        !selectedMedia
      ) {
        return undefined;
      }

      const previousBodyOverflow =
        document.body.style
          .overflow;

      const previousHtmlOverflow =
        document.documentElement
          .style.overflow;

      document.body.style.overflow =
        "hidden";

      document.documentElement.style.overflow =
        "hidden";

      const handleKeyDown =
        (
          event,
        ) => {
          if (
            event.key ===
            "Escape"
          ) {
            setSelectedMedia(
              null,
            );

            setPreviewLoading(
              false,
            );
          }
        };

      window.addEventListener(
        "keydown",
        handleKeyDown,
      );

      return () => {
        document.body.style.overflow =
          previousBodyOverflow;

        document.documentElement.style.overflow =
          previousHtmlOverflow;

        window.removeEventListener(
          "keydown",
          handleKeyDown,
        );
      };
    }, [
      selectedMedia,
    ]);

    /* =====================================================
       SCROLL TO GALLERY
    ===================================================== */

    const scrollToSection =
      useCallback(
        () => {
          window.setTimeout(
            () => {
              sectionRef.current?.scrollIntoView(
                {
                  behavior:
                    "smooth",

                  block:
                    "start",
                },
              );
            },
            50,
          );
        },
        [],
      );

    /* =====================================================
       CATEGORY CHANGE
    ===================================================== */

    const handleCategoryChange =
      (
        categoryId,
      ) => {
        if (
          String(
            categoryId,
          ) ===
          String(
            activeCategoryId,
          )
        ) {
          return;
        }

        setActiveCategoryId(
          categoryId,
        );

        setCurrentPage(
          1,
        );

        setTotalPages(
          1,
        );

        setTotalImages(
          null,
        );

        setHasNextPage(
          false,
        );

        scrollToSection();
      };

    /* =====================================================
       PAGE CHANGE
    ===================================================== */

    const handlePageChange =
      (
        page,
      ) => {
        if (
          page < 1 ||
          page ===
            currentPage
        ) {
          return;
        }

        /*
         * If total is known, prevent
         * going beyond it.
         */
        if (
          totalKnown &&
          page >
            totalPages
        ) {
          return;
        }

        /*
         * If total isn't known,
         * only allow next page if
         * previous result indicated
         * there may be one.
         */
        if (
          !totalKnown &&
          page >
            currentPage &&
          !hasNextPage
        ) {
          return;
        }

        setCurrentPage(
          page,
        );

        scrollToSection();
      };

    /* =====================================================
       RETRY
    ===================================================== */

    const handleRetry =
      () => {
        const cacheKey =
          `${activeCategoryId}-${currentPage}`;

        imageCacheRef.current.delete(
          cacheKey,
        );

        const controller =
          new AbortController();

        fetchImages({
          categoryId:
            activeCategoryId,

          page:
            currentPage,

          signal:
            controller.signal,

          force:
            true,
        });
      };

    /* =====================================================
       OPEN PREVIEW
    ===================================================== */

    const handleOpenPreview =
      (
        media,
      ) => {
        setPreviewLoading(
          !isVideoMedia(
            media,
          ),
        );

        setSelectedMedia(
          media,
        );
      };

    /* =====================================================
       SELECTED MEDIA
    ===================================================== */

    const selectedMediaUrl =
      getMediaUrl(
        selectedMedia,
      );

    const selectedMediaIsVideo =
      selectedMedia
        ? isVideoMedia(
            selectedMedia,
          )
        : false;

    const selectedMediaAlt =
      selectedMedia
        ? getMediaAlt(
            selectedMedia,
          )
        : "";

    /* =====================================================
       PAGE NUMBERS
    ===================================================== */

    const pageNumbers =
      useMemo(
        () =>
          getPageNumbers(
            {
              currentPage,

              totalPages:
                Math.max(
                  totalPages,
                  hasNextPage
                    ? currentPage +
                        1
                    : currentPage,
                ),
            },
          ),
        [
          currentPage,
          totalPages,
          hasNextPage,
        ],
      );

    /* =====================================================
       RENDER
    ===================================================== */

    return (
      <>
        {/* =================================================
            CSS
        ================================================= */}

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

            @keyframes gallerySpinner {
              to {
                transform: rotate(360deg);
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

            .gallery-preview-spinner {
              animation: gallerySpinner 0.8s linear infinite;
            }

            @media (prefers-reduced-motion: reduce) {
              .gallery-skeleton::after {
                animation: none;
              }

              .gallery-preview-spinner {
                animation: none;
              }
            }
          `}
        </style>

        {/* =================================================
            PAGE
        ================================================= */}

        <div className="min-h-screen pt-[110px]">

          {/* ===============================================
              HEADING
          =============================================== */}

          <section>
            <div className="mx-auto max-w-[1650px] px-6 xl:px-10">

              <h1
                className="text-[34px] font-semibold text-[#161412] md:text-[42px]"
                style={{
                  fontFamily:
                    "Montserrat, sans-serif",
                }}
              >
                Inspiration
                Gallery
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

                <span>
                  Resource
                  Center
                </span>

                {" / "}

                <span className="font-semibold text-[#161412]">
                  Portfolio
                </span>
              </p>
            </div>
          </section>

          {/* ===============================================
              GALLERY
          =============================================== */}

          <section
            ref={
              sectionRef
            }
            className="scroll-mt-[120px] py-14"
          >
            <div className="mx-auto max-w-[1650px] px-6 xl:px-10">

              {/* =========================================
                  FILTER HEADER
              ========================================= */}

              <div
                className="
                  mb-9
                  border-b
                  border-[#e4e4e4]
                  pb-7
                "
              >
                <div className="flex items-end justify-between gap-6">

                  <div className="min-w-0 flex-1">

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
                      Filter by
                      application
                    </p>

                    <div className="flex max-w-full gap-2 overflow-x-auto pb-2">

                      {filters.map(
                        (
                          item,
                        ) => {
                          const isActive =
                            String(
                              activeCategoryId,
                            ) ===
                            String(
                              item.id,
                            );

                          return (
                            <button
                              key={
                                item.id
                              }
                              type="button"
                              disabled={
                                loadingCategories
                              }
                              onClick={() =>
                                handleCategoryChange(
                                  item.id,
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
                              {
                                item.name
                              }
                            </button>
                          );
                        },
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

                  {/* =====================================
                      TOTAL COUNT
                  ===================================== */}

                  {!loadingImages &&
                    totalImages !==
                      null && (
                      <p
                        className="
                          hidden
                          shrink-0
                          pb-2
                          text-[12px]
                          uppercase
                          tracking-[1px]
                          text-[#888]
                          md:block
                        "
                      >
                        {
                          totalImages
                        }{" "}
                        Items
                      </p>
                    )}
                </div>
              </div>

              {/* =========================================
                  LOADING
              ========================================= */}

              {loadingImages ? (
                <GallerySkeleton />
              ) : galleryError ? (
                /* =======================================
                   ERROR
                ======================================= */

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
                        size={
                          24
                        }
                        aria-hidden="true"
                      />
                    </div>

                    <p className="mt-5 text-[18px] font-semibold text-[#222]">
                      Gallery
                      unavailable
                    </p>

                    <p className="mt-2 text-[14px] leading-6 text-[#666]">
                      {
                        galleryError
                      }
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
                        size={
                          16
                        }
                        aria-hidden="true"
                      />

                      Try Again
                    </button>
                  </div>
                </div>
              ) : galleryImages.length >
                0 ? (
                /* =======================================
                   GALLERY GRID
                ======================================= */

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
                  {galleryImages.map(
                    (
                      media,
                      index,
                    ) => (
                      <GalleryCard
                        key={
                          media.id ||
                          getMediaUrl(
                            media,
                          ) ||
                          `${currentPage}-${index}`
                        }
                        media={
                          media
                        }
                        index={
                          index
                        }
                        onClick={
                          handleOpenPreview
                        }
                      />
                    ),
                  )}
                </div>
              ) : (
                /* =======================================
                   EMPTY
                ======================================= */

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
                      size={
                        34
                      }
                      className="mx-auto text-[#999]"
                      aria-hidden="true"
                    />

                    <p className="mt-5 text-[18px] font-semibold text-[#222]">
                      No
                      inspiration
                      media found
                    </p>

                    <p className="mt-2 text-[14px] text-[#666]">
                      Images and
                      videos for
                      this category
                      will appear
                      here.
                    </p>
                  </div>
                </div>
              )}

              {/* =========================================
                  PAGINATION

                  Shows if:
                  - More than one known page
                  - OR current response has 24 items,
                    meaning another page may exist
              ========================================= */}

              {!loadingImages &&
                !galleryError &&
                galleryImages.length >
                  0 &&
                (totalPages >
                  1 ||
                  currentPage >
                    1 ||
                  hasNextPage) && (
                  <div className="mt-16">

                    <div
                      className="
                        flex
                        flex-wrap
                        items-center
                        justify-center
                        gap-2
                      "
                    >
                      {/* =================================
                          PREVIOUS
                      ================================= */}

                      <button
                        type="button"
                        onClick={() =>
                          handlePageChange(
                            currentPage -
                              1,
                          )
                        }
                        disabled={
                          currentPage ===
                          1
                        }
                        className="
                          mr-2
                          flex
                          h-10
                          items-center
                          gap-2
                          border
                          border-[#dedede]
                          bg-white
                          px-4
                          text-[12px]
                          font-medium
                          uppercase
                          tracking-[0.6px]
                          text-[#333]
                          transition-all
                          duration-300
                          hover:border-black
                          hover:bg-black
                          hover:text-white
                          disabled:cursor-not-allowed
                          disabled:opacity-30
                          disabled:hover:border-[#dedede]
                          disabled:hover:bg-white
                          disabled:hover:text-[#333]
                        "
                      >
                        <ChevronLeft
                          size={
                            15
                          }
                        />

                        Prev
                      </button>

                      {/* =================================
                          PAGE NUMBERS
                      ================================= */}

                      {pageNumbers.map(
                        (
                          page,
                          index,
                        ) => {
                          const previousPage =
                            pageNumbers[
                              index -
                                1
                            ];

                          const showEllipsis =
                            index >
                              0 &&
                            previousPage &&
                            page -
                              previousPage >
                              1;

                          return (
                            <React.Fragment
                              key={
                                page
                              }
                            >
                              {showEllipsis && (
                                <span className="px-1 text-[#999]">
                                  …
                                </span>
                              )}

                              <button
                                type="button"
                                onClick={() =>
                                  handlePageChange(
                                    page,
                                  )
                                }
                                className={`
                                  flex
                                  h-10
                                  min-w-10
                                  items-center
                                  justify-center
                                  border
                                  px-3
                                  text-[13px]
                                  font-medium
                                  transition-all
                                  duration-300

                                  ${
                                    currentPage ===
                                    page
                                      ? "border-[#161412] bg-[#161412] text-white"
                                      : "border-[#dedede] bg-white text-[#555] hover:border-[#161412] hover:text-[#161412]"
                                  }
                                `}
                              >
                                {
                                  page
                                }
                              </button>
                            </React.Fragment>
                          );
                        },
                      )}

                      {/* =================================
                          NEXT
                      ================================= */}

                      <button
                        type="button"
                        onClick={() =>
                          handlePageChange(
                            currentPage +
                              1,
                          )
                        }
                        disabled={
                          totalKnown
                            ? currentPage >=
                              totalPages
                            : !hasNextPage
                        }
                        className="
                          ml-2
                          flex
                          h-10
                          items-center
                          gap-2
                          border
                          border-[#dedede]
                          bg-white
                          px-4
                          text-[12px]
                          font-medium
                          uppercase
                          tracking-[0.6px]
                          text-[#333]
                          transition-all
                          duration-300
                          hover:border-black
                          hover:bg-black
                          hover:text-white
                          disabled:cursor-not-allowed
                          disabled:opacity-30
                          disabled:hover:border-[#dedede]
                          disabled:hover:bg-white
                          disabled:hover:text-[#333]
                        "
                      >
                        Next

                        <ChevronRight
                          size={
                            15
                          }
                        />
                      </button>
                    </div>

                    {/* =====================================
                        PAGE LABEL
                    ===================================== */}

                    <p
                      className="
                        mt-5
                        text-center
                        text-[11px]
                        uppercase
                        tracking-[1.2px]
                        text-[#999]
                      "
                    >
                      Page{" "}
                      {
                        currentPage
                      }

                      {totalKnown &&
                        totalPages >
                          1 &&
                        ` of ${totalPages}`}
                    </p>
                  </div>
                )}
            </div>
          </section>
        </div>

{/* =================================================
    FULLSCREEN PREVIEW
================================================= */}

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
        z-[999999]
        flex
        h-[100dvh]
        w-screen
        items-center
        justify-center
        overflow-hidden
        bg-black/90
        p-4
        sm:p-6
        md:p-8
      "
      onClick={() => {
        setSelectedMedia(null);
        setPreviewLoading(false);
      }}
    >
      {/* =========================================
          CLOSE BUTTON
      ========================================= */}

      <button
        type="button"
        aria-label="Close media preview"
        onClick={(event) => {
          event.stopPropagation();

          setSelectedMedia(null);
          setPreviewLoading(false);
        }}
        className="
          absolute
          right-4
          top-4
          z-[60]
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-full
          border
          border-white/15
          bg-black/35
          text-white
          shadow-lg
          backdrop-blur-md
          transition-all
          duration-300
          hover:rotate-90
          hover:bg-white
          hover:text-black
          sm:right-6
          sm:top-6
          sm:h-12
          sm:w-12
        "
      >
        <X
          size={24}
          strokeWidth={1.7}
          aria-hidden="true"
        />
      </button>

      {/* =========================================
          MEDIA WRAPPER
      ========================================= */}

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
        {/* =======================================
            IMAGE LOADING SPINNER
        ======================================= */}

        {!selectedMediaIsVideo &&
          previewLoading && (
            <div
              className="
                absolute
                left-1/2
                top-1/2
                z-20
                flex
                -translate-x-1/2
                -translate-y-1/2
                flex-col
                items-center
                justify-center
                gap-3
              "
            >
              <div
                className="
                  gallery-preview-spinner
                  h-10
                  w-10
                  rounded-full
                  border-2
                  border-white/25
                  border-t-white
                "
              />

              <span
                className="
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[1.5px]
                  text-white/65
                "
              >
                Loading
              </span>
            </div>
          )}

        {/* =======================================
            VIDEO
        ======================================= */}

        {selectedMediaIsVideo ? (
          <video
            key={selectedMediaUrl}
            src={selectedMediaUrl}
            aria-label={selectedMediaAlt}
            controls
            autoPlay
            playsInline
            preload="auto"
            controlsList="nodownload"
            className="
              block
              max-h-[calc(100dvh-64px)]
              max-w-[calc(100vw-32px)]
              object-contain
              sm:max-h-[calc(100dvh-80px)]
              sm:max-w-[calc(100vw-48px)]
              md:max-h-[calc(100dvh-96px)]
              md:max-w-[calc(100vw-64px)]
            "
          >
            Your browser does not support
            video playback.
          </video>
        ) : (
          /* =====================================
             IMAGE
          ===================================== */

          <img
            key={selectedMediaUrl}
            src={getOptimizedImageUrl(
              selectedMediaUrl,
              2600,
              92,
            )}
            alt={selectedMediaAlt}
            decoding="async"
            fetchPriority="high"
            draggable={false}
            onLoad={() =>
              setPreviewLoading(false)
            }
            onError={() =>
              setPreviewLoading(false)
            }
            className={`
              block
              max-h-[calc(100dvh-64px)]
              max-w-[calc(100vw-32px)]
              object-contain
              transition-opacity
              duration-300

              sm:max-h-[calc(100dvh-80px)]
              sm:max-w-[calc(100vw-48px)]

              md:max-h-[calc(100dvh-96px)]
              md:max-w-[calc(100vw-64px)]

              ${
                previewLoading
                  ? "opacity-0"
                  : "opacity-100"
              }
            `}
          />
        )}
      </div>
    </div>,

    document.body,
  )}
      </>
    );
  };

export default Gallery;
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Columns2, Grid2x2, Square } from "lucide-react";
import { getOptimizedImageUrl } from "../../utils/Mediahelper";

const API_URL = import.meta.env.VITE_API_URL;
const IMAGE_LIMIT = 20;

const GallerySkeleton = ({ layout }) => {
  if (layout === "grid") {
    return (
      <div
        className="min-h-[760px] overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="grid w-max grid-flow-col grid-rows-3 gap-5"
          style={{ gridAutoColumns: "320px" }}
        >
          {Array.from({ length: 12 }).map((_, index) => (
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
        {Array.from({ length: layout === "one" ? 2 : 4 }).map(
          (_, index) => (
            <div
              key={index}
              className={`gallery-skeleton shrink-0 ${cardClass}`}
            />
          )
        )}
      </div>
    </div>
  );
};

const GalleryCard = memo(
  ({
    image,
    className,
    imageClassName,
    onClick,
    imageWidth = 480,
    imageQuality = 70,
    imageSizes = "320px",
  }) => {
    const imageAlt = image.image_alt || image.title || "Gallery image";

    return (
      <button
        type="button"
        onClick={() => onClick(image)}
        aria-label={`Open ${imageAlt} preview`}
        className={`block cursor-pointer overflow-hidden bg-[#f1f1f1] text-left ${className}`}
      >
        <img
  src={getOptimizedImageUrl(
    image.image_url,
    imageWidth,
    imageQuality
  )}
  srcSet={`
    ${getOptimizedImageUrl(image.image_url, 480, 74)} 480w,
    ${getOptimizedImageUrl(image.image_url, 640, 76)} 640w,
    ${getOptimizedImageUrl(image.image_url, 900, 78)} 900w,
    ${getOptimizedImageUrl(image.image_url, 1200, 80)} 1200w,
    ${getOptimizedImageUrl(image.image_url, 1600, 82)} 1600w
  `}
  sizes={imageSizes}
  width="320"
  height="240"
  alt={imageAlt}
  loading="lazy"
  decoding="async"
  fetchPriority="low"
  draggable="false"
  className={imageClassName}
/>
      </button>
    );
  }
);

GalleryCard.displayName = "GalleryCard";

const InspirationGallery = () => {
  const sectionRef = useRef(null);
  const imageCacheRef = useRef(new Map());

  const [shouldFetch, setShouldFetch] = useState(false);
  const [layout, setLayout] = useState("grid");
  const [activeCategoryId, setActiveCategoryId] = useState("all");

  const [categories, setCategories] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);

  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const [galleryError, setGalleryError] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

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

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldFetch) return undefined;

    const controller = new AbortController();

    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);

        const response = await fetch(
          `${API_URL}/inspiration-gallery/categories`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            `Categories request failed: ${response.status}`
          );
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(
            result.message || "Failed to load categories"
          );
        }

        setCategories(result.data || []);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(
            "Failed to fetch inspiration categories:",
            error
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingCategories(false);
        }
      }
    };

    fetchCategories();

    return () => controller.abort();
  }, [shouldFetch]);

  useEffect(() => {
    if (!shouldFetch) return undefined;

    const cacheKey = String(activeCategoryId);
    const cachedImages = imageCacheRef.current.get(cacheKey);

    if (cachedImages) {
      setGalleryImages(cachedImages);
      setLoadingImages(false);
      setGalleryError("");
      return undefined;
    }

    const controller = new AbortController();

    const fetchImages = async () => {
      try {
        setLoadingImages(true);
        setGalleryError("");

        const query = new URLSearchParams({
          limit: String(IMAGE_LIMIT),
        });

        if (activeCategoryId !== "all") {
          query.set("categoryId", String(activeCategoryId));
        }

        const response = await fetch(
          `${API_URL}/inspiration-gallery/images?${query.toString()}`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(
            `Images request failed: ${response.status}`
          );
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(
            result.message || "Failed to load images"
          );
        }

        const images = result.data || [];

        imageCacheRef.current.set(cacheKey, images);
        setGalleryImages(images);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(
            "Failed to fetch inspiration gallery images:",
            error
          );

          setGalleryImages([]);
          setGalleryError(
            "Unable to load inspiration images."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingImages(false);
        }
      }
    };

    fetchImages();

    return () => controller.abort();
  }, [shouldFetch, activeCategoryId]);

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

  const getImageCardClass = () => {
    if (layout === "two") {
      return "h-[520px] w-[calc(50vw-60px)]";
    }

    if (layout === "one") {
      return "h-[650px] w-[calc(100vw-120px)]";
    }

    return "";
  };

  const getResponsiveImageSettings = () => {
    if (layout === "one") {
      return {
        imageWidth: 1400,
        imageQuality: 80,
        imageSizes: "calc(100vw - 120px)",
      };
    }

    if (layout === "two") {
      return {
        imageWidth: 1000,
        imageQuality: 76,
        imageSizes: "calc(50vw - 60px)",
      };
    }

    return {
      imageWidth: 480,
      imageQuality: 70,
      imageSizes: "320px",
    };
  };

  const responsiveImageSettings =
    getResponsiveImageSettings();

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
              fontFamily: "Montserrat, sans-serif",
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
            {filters.map((item) => {
              const isActive =
                String(activeCategoryId) === String(item.id);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    setActiveCategoryId(item.id)
                  }
                  aria-pressed={isActive}
                  className="group relative min-h-11 px-1 pb-2 text-[14px]"
                  style={{
                    fontFamily: "Inter, sans-serif",
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
            })}

            {loadingCategories &&
              categories.length === 0 && (
                <span className="flex min-h-11 items-center text-[14px] text-[#666]">
                  Loading categories...
                </span>
              )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Show gallery in grid layout"
              aria-pressed={layout === "grid"}
              onClick={() => setLayout("grid")}
              className="flex h-11 w-11 items-center justify-center"
            >
              <Grid2x2
                size={18}
                aria-hidden="true"
                className={iconClass("grid")}
              />
            </button>

            <button
              type="button"
              aria-label="Show gallery in two-column layout"
              aria-pressed={layout === "two"}
              onClick={() => setLayout("two")}
              className="flex h-11 w-11 items-center justify-center"
            >
              <Columns2
                size={18}
                aria-hidden="true"
                className={iconClass("two")}
              />
            </button>

            <button
              type="button"
              aria-label="Show gallery in single-column layout"
              aria-pressed={layout === "one"}
              onClick={() => setLayout("one")}
              className="flex h-11 w-11 items-center justify-center"
            >
              <Square
                size={18}
                aria-hidden="true"
                className={iconClass("one")}
              />
            </button>
          </div>
        </div>

        {!shouldFetch || loadingImages ? (
          <GallerySkeleton layout={layout} />
        ) : galleryError ? (
          <div className="flex h-[700px] items-center justify-center border border-[#ECECEC] bg-[#FAFAFA]">
            <p className="text-[16px] text-[#666]">
              {galleryError}
            </p>
          </div>
        ) : galleryImages.length > 0 ? (
          layout === "grid" ? (
            <div className="min-h-[760px] overflow-x-auto overflow-y-hidden">
              <div
                className="grid w-max grid-flow-col grid-rows-3 gap-5 pb-3"
                style={{ gridAutoColumns: "320px" }}
              >
                {galleryImages.map((image) => (
                  <GalleryCard
                    key={image.id}
                    image={image}
                    onClick={setSelectedImage}
                    imageWidth={480}
                    imageQuality={70}
                    imageSizes="320px"
                    className="h-[240px] w-[320px]"
                    imageClassName="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="min-h-[700px] overflow-x-auto">
              <div className="flex flex-nowrap gap-5 pb-3">
                {galleryImages.map((image) => (
                  <GalleryCard
                    key={image.id}
                    image={image}
                    onClick={setSelectedImage}
                    {...responsiveImageSettings}
                    className={`shrink-0 ${getImageCardClass()}`}
                    imageClassName="h-full w-full object-cover"
                  />
                ))}
              </div>
            </div>
          )
        ) : (
          <div className="flex h-[700px] items-center justify-center border border-[#ECECEC] bg-[#FAFAFA]">
            <div className="text-center">
              <p className="text-[18px] font-medium text-[#222]">
                No inspiration images found
              </p>

              <p className="mt-2 text-[14px] text-[#666]">
                Images for this category will appear here.
              </p>
            </div>
          </div>
        )}
      </div>

      {selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-5"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            aria-label="Close image preview"
            onClick={() => setSelectedImage(null)}
            className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center text-4xl font-light text-white transition hover:text-[#FF8000]"
          >
            <span aria-hidden="true">×</span>
          </button>

          <img
            src={getOptimizedImageUrl(
              selectedImage.image_url,
              1800,
              82
            )}
            alt={
              selectedImage.image_alt ||
              selectedImage.title ||
              "Selected gallery image"
            }
            decoding="async"
            fetchPriority="high"
            className="max-h-[90vh] max-w-[95vw] object-contain"
            onClick={(event) =>
              event.stopPropagation()
            }
          />
        </div>
      )}
    </section>
  );
};

export default InspirationGallery;
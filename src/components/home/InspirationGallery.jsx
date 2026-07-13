import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Columns2, Grid2x2, Square } from "lucide-react";
import { getOptimizedImageUrl } from "../../utils/Mediahelper";

const API_URL = import.meta.env.VITE_API_URL;
const IMAGE_LIMIT = 20;

const GalleryCard = memo(
  ({ image, className, imageClassName, onClick }) => {
    const imageAlt = image.image_alt || image.title || "";

    return (
      <div
        onClick={() => onClick(image)}
        className={`cursor-pointer overflow-hidden bg-[#f1f1f1] ${className}`}
      >
        <img
          src={getOptimizedImageUrl(image.image_url, 480, 70)}
          srcSet={`
            ${getOptimizedImageUrl(image.image_url, 320, 68)} 320w,
            ${getOptimizedImageUrl(image.image_url, 480, 70)} 480w,
            ${getOptimizedImageUrl(image.image_url, 700, 72)} 700w
          `}
          sizes="320px"
          width="320"
          height="240"
          alt={imageAlt}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          draggable="false"
          className={imageClassName}
        />
      </div>
    );
  }
);

GalleryCard.displayName = "GalleryCard";

const InspirationGallery = () => {
  const sectionRef = useRef(null);

  /*
   * Saves already-loaded category results so returning to a tab
   * does not call the API again.
   *
   * Key:
   * "all" or category ID
   */
  const imageCacheRef = useRef(new Map());

  const [shouldFetch, setShouldFetch] = useState(false);
  const [layout, setLayout] = useState("grid");

  /*
   * Store category ID instead of category name.
   * "all" represents the mixed gallery.
   */
  const [activeCategoryId, setActiveCategoryId] = useState("all");

  const [categories, setCategories] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);

  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const [galleryError, setGalleryError] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);

  /*
   * Start loading shortly before the user reaches the section.
   */
  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldFetch(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: "300px",
        threshold: 0.1,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  /*
   * Fetch categories once.
   */
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
          throw new Error(`Categories request failed: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to load categories");
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

  /*
   * Fetch:
   *
   * All tab:
   * /images?limit=20
   *
   * Category tab:
   * /images?categoryId=1&limit=20
   */
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
          throw new Error(`Images request failed: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to load images");
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
          setGalleryError("Unable to load inspiration images.");
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
    `cursor-pointer transition-colors duration-200 ${
      layout === type
        ? "text-black"
        : "text-[#666] hover:text-black"
    }`;

  const getImageCardClass = () => {
    if (layout === "two") {
      return "w-[calc(50vw-60px)] h-[520px]";
    }

    if (layout === "one") {
      return "w-[calc(100vw-120px)] h-[650px]";
    }

    return "";
  };

  return (
    <section ref={sectionRef} className="bg-white py-[42px]">
      <div className="mx-auto max-w-[1850px] px-6 xl:px-[52px]">
        <div className="mb-11 flex items-center justify-between">
          <h2
            className="flex items-center gap-7 text-[18px] font-bold uppercase text-[#111] md:text-[22px]"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            INSPIRATION GALLERIES

            <span className="cursor-pointer text-[24px] font-normal text-[#FF8000] transition-colors duration-300 hover:text-[#8D8D8D]">
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
                  onClick={() => setActiveCategoryId(item.id)}
                  className="group relative pb-2 text-[14px]"
                  style={{ fontFamily: "Inter, sans-serif" }}
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
                    className={`absolute bottom-0 left-0 h-[1.5px] bg-black transition-all duration-300 ${
                      isActive
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </button>
              );
            })}

            {loadingCategories && categories.length === 0 && (
              <span className="pb-2 text-[14px] text-[#888]">
                Loading categories...
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Grid2x2
              size={18}
              onClick={() => setLayout("grid")}
              className={iconClass("grid")}
            />

            <Columns2
              size={18}
              onClick={() => setLayout("two")}
              className={iconClass("two")}
            />

            <Square
              size={18}
              onClick={() => setLayout("one")}
              className={iconClass("one")}
            />
          </div>
        </div>

        {!shouldFetch ? (
          <div className="h-[760px]" />
        ) : loadingImages ? (
          <div className="grid min-h-[760px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="h-[240px] animate-pulse bg-[#F1F1F1]"
              />
            ))}
          </div>
        ) : galleryError ? (
          <div className="flex h-[700px] items-center justify-center border border-[#ECECEC] bg-[#FAFAFA]">
            <p className="text-[16px] text-[#777]">
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
                    className={`flex-shrink-0 ${getImageCardClass()}`}
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

              <p className="mt-2 text-[14px] text-[#888]">
                Images for this category will appear here.
              </p>
            </div>
          </div>
        )}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-5"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            aria-label="Close image preview"
            onClick={() => setSelectedImage(null)}
            className="absolute right-6 top-5 text-4xl font-light text-white transition hover:text-[#FF8000]"
          >
            ×
          </button>

          <img
            src={getOptimizedImageUrl(
              selectedImage.image_url,
              2400,
              90
            )}
            alt={
              selectedImage.image_alt ||
              selectedImage.title ||
              ""
            }
            decoding="async"
            fetchPriority="high"
            className="max-h-[90vh] max-w-[95vw] object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};

export default InspirationGallery;
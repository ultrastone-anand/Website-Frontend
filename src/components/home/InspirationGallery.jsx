import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Columns2, Grid2x2, Square } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;
const INITIAL_LIMIT = 15;

const GalleryCard = memo(({ image, className, imageClassName, onClick }) => (
  <div
    onClick={() => onClick(image)}
    className={`cursor-pointer overflow-hidden bg-[#f3f3f3] ${className}`}
  >
    <img
      src={image.image_url}
      alt={image.image_alt || image.title || ""}
      loading="lazy"
      decoding="async"
      fetchPriority="low"
      draggable="false"
      className={imageClassName}
    />
  </div>
));

const InspirationGallery = () => {
  const sectionRef = useRef(null);

  const [shouldFetch, setShouldFetch] = useState(false);
  const [layout, setLayout] = useState("grid");
  const [activeFilter, setActiveFilter] = useState("All");
  const [categories, setCategories] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

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

  useEffect(() => {
    if (!shouldFetch) return;

    const controller = new AbortController();

    const fetchGalleryData = async () => {
      try {
        const [categoryRes, imageRes] = await Promise.all([
          fetch(`${API_URL}/inspiration-gallery/categories`, {
            signal: controller.signal,
          }),

          fetch(`${API_URL}/inspiration-gallery/images?limit=${INITIAL_LIMIT}`, {
            signal: controller.signal,
          }),
        ]);

        const categoryData = await categoryRes.json();
        const imageData = await imageRes.json();

        setCategories(categoryData.data || []);
        setGalleryImages(imageData.data || []);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to fetch inspiration gallery:", error);
        }
      }
    };

    fetchGalleryData();

    return () => controller.abort();
  }, [shouldFetch]);

  const filters = useMemo(
    () => ["All", ...categories.map((category) => category.name)],
    [categories]
  );

  const filteredImages = useMemo(() => {
    if (activeFilter === "All") return galleryImages;

    return galleryImages.filter(
      (image) => image.inspiration_gallery_categories?.name === activeFilter
    );
  }, [activeFilter, galleryImages]);

  const iconClass = (type) =>
    `cursor-pointer transition-colors duration-200 ${
      layout === type ? "text-black" : "text-[#666] hover:text-black"
    }`;

  const getImageCardClass = () => {
    if (layout === "two") return "w-[calc(50vw-60px)] h-[520px]";
    if (layout === "one") return "w-[calc(100vw-120px)] h-[650px]";
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
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setActiveFilter(item)}
                className="group relative pb-2 text-[14px]"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <span
                  className={`transition-colors duration-300 ${
                    activeFilter === item
                      ? "text-black"
                      : "text-[#555] group-hover:text-black"
                  }`}
                >
                  {item}
                </span>

                <span
                  className={`absolute bottom-0 left-0 h-[1.5px] bg-black transition-all duration-300 ${
                    activeFilter === item ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </button>
            ))}
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
        ) : filteredImages.length > 0 ? (
          layout === "grid" ? (
            <div className="min-h-[760px] overflow-x-auto overflow-y-hidden">
              <div
                className="grid w-max grid-flow-col grid-rows-3 gap-5 pb-3"
                style={{ gridAutoColumns: "320px" }}
              >
                {filteredImages.map((image) => (
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
                {filteredImages.map((image) => (
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
          <div className="flex h-[700px] items-center justify-center rounded border border-[#ECECEC] bg-[#FAFAFA]">
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
            onClick={() => setSelectedImage(null)}
            className="absolute right-6 top-5 text-4xl font-light text-white transition hover:text-[#FF8000]"
          >
            ×
          </button>

          <img
            src={selectedImage.image_url}
            alt={selectedImage.image_alt || selectedImage.title || ""}
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
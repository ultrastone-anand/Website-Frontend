import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const IntroSection = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/stones`
        );

        const result = response.data;

        if (result.success) {
          const activeCategories = result.data
            .filter((item) => item.is_active === true && item.parent_id === null)
            .sort((a, b) => {
              const orderA = a.display_order ?? 999;
              const orderB = b.display_order ?? 999;

              if (orderA !== orderB) return orderA - orderB;

              return a.name.localeCompare(b.name, undefined, {
                sensitivity: "base",
              });
            });

          setMaterials(activeCategories);
        }
      } catch (error) {
        console.error("Error fetching materials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  const carouselItems = useMemo(
    () => [...materials, ...materials],
    [materials]
  );

  return (
    <section className="overflow-hidden bg-white py-[110px]">
      <style>
        {`
          @keyframes categoryCarousel {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }

          .category-carousel-track {
            animation: categoryCarousel 100s linear infinite;
          }

          .category-carousel-track:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      <div className="mx-auto max-w-[1850px] px-6 xl:px-12">
<div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-center">
  <div>
    <p
      className="flex items-center gap-5 text-[18px] font-bold uppercase tracking-[0.02em] text-[#111]"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      OUR COLLECTION
      <span className="text-[32px] font-normal text-[#D67A1C]">→</span>
    </p>

    <h2
      className="mt-4 text-[45px] leading-[1.05] text-[#111]"
      style={{ fontFamily: '"Cormorant Garamond", serif' }}
    >
      curated by nature.
      <br />
      chosen for you.
    </h2>
  </div>

  <div className="max-w-[420px] lg:self-center">
    <p
      className="text-[16px] leading-[1.5] text-[#555]"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      Explore our exclusive range of natural and engineered stones, each
      piece a masterpiece.
    </p>

    <button
      type="button"
      onClick={() => navigate("/categories")}
      className="mt-4 border border-[#777] px-10 py-3 text-[12px] font-medium tracking-[0.02em] text-[#222] transition-all duration-300 hover:bg-black hover:text-white"
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      DISCOVER MORE
      <span className="ml-3 text-[#FF8000]">→</span>
    </button>
  </div>
</div>

        <div className="mt-[40px] overflow-hidden">
          {loading ? (
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-[4/5] bg-gray-200" />
                  <div className="mx-auto mt-6 h-5 w-24 bg-gray-200" />
                  <div className="mx-auto mt-3 h-4 w-36 bg-gray-100" />
                </div>
              ))}
            </div>
          ) : (
            <div className="category-carousel-track flex w-max gap-10">
              {carouselItems.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  onClick={() => navigate(`/product-category/${item.slug}`)}
                  className="group w-[300px] shrink-0 cursor-pointer text-center sm:w-[340px] lg:w-[390px]"
                >
                  <div className="overflow-hidden bg-gray-100">
                   <img
  src={getOptimizedImageUrl(item.thumbnail_url, 600, 72)}
  srcSet={`
    ${getOptimizedImageUrl(item.thumbnail_url, 360, 68)} 360w,
    ${getOptimizedImageUrl(item.thumbnail_url, 480, 70)} 480w,
    ${getOptimizedImageUrl(item.thumbnail_url, 600, 72)} 600w,
    ${getOptimizedImageUrl(item.thumbnail_url, 800, 74)} 800w
  `}
  sizes="(max-width: 639px) 300px, (max-width: 1023px) 340px, 390px"
  width="600"
  height="750"
  alt={item.name}
  loading="lazy"
  decoding="async"
  fetchPriority="low"
  draggable="false"
  className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105"
/>
                  </div>

                  <h3
                    className="mt-6 text-[20px] font-semibold uppercase tracking-[0.03em] text-[#111]"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {item.name}
                  </h3>

                  <p
                    className="mt-2 text-[15px] text-[#666]"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {item.description || `${item.name} collection`}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
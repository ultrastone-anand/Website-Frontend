import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const WarmToneGrid = () => {
  const scrollRef = useRef(null);

  const [stoneTypes, setStoneTypes] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const fetchProductsByCategory = async (categorySlug) => {
    try {
      setLoadingProducts(true);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/stones/${categorySlug}`
      );

      const result = response.data;

      if (result.success) {
        setSelectedCategoryName(result.category?.name || "");

        const activeProducts = (result.products || result.data || []).filter(
          (item) =>
            item.is_active === true &&
            item.is_published === true &&
            item.media?.length > 0
        );

        setProducts(activeProducts);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    const fetchStoneTypes = async () => {
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

          setStoneTypes(activeCategories);

          if (activeCategories.length > 0) {
            setSelectedCategory(activeCategories[0].slug);
            fetchProductsByCategory(activeCategories[0].slug);
          }
        }
      } catch (error) {
        console.error("Error fetching stone types:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchStoneTypes();
  }, []);

  const handleCategoryClick = (slug) => {
    setSelectedCategory(slug);
    fetchProductsByCategory(slug);
  };

  const scrollProducts = (direction) => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-white py-10 md:py-[24px] mb-[70px]">
      <div className="mx-auto max-w-[1850px] px-5 md:px-6 xl:px-[52px]">
        <div className="mb-8 flex items-center justify-between md:mb-[44px]">
          <h2
            className="flex items-center gap-4 text-[18px] font-bold uppercase tracking-[0.01em] text-[#111] md:gap-7 md:text-[18px]"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            FEATURED STONES
            <span className="text-[24px] font-normal text-[#FF8000] md:text-[28px]">
              →
            </span>
          </h2>

          <div className="flex items-center gap-5 text-[28px] text-[#111] md:gap-7 md:text-[34px]">
            <button
              type="button"
              onClick={() => scrollProducts("left")}
              className="leading-none transition hover:text-black"
            >
              ←
            </button>

            <button
              type="button"
              onClick={() => scrollProducts("right")}
              className="leading-none transition hover:text-black"
            >
              →
            </button>
          </div>
        </div>

        <div className="mb-6 flex gap-3 overflow-x-auto pb-2 lg:hidden">
          {loadingCategories
            ? Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-8 w-24 shrink-0 animate-pulse bg-gray-200"
                />
              ))
            : stoneTypes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleCategoryClick(item.slug)}
                  className={`shrink-0 border px-4 py-2 text-[13px] transition ${
                    selectedCategory === item.slug
                      ? "border-[#d97918] bg-[#d97918] text-white"
                      : "border-[#d0d0d0] text-[#5f5f5f]"
                  }`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {item.name}
                </button>
              ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[170px_1fr] xl:grid-cols-[180px_1fr]">
          <aside className="hidden border-r border-[#d0d0d0] pr-6 lg:block">
            <h3
              className="mb-5 text-[18px] font-bold uppercase tracking-[0.02em] text-[#111]"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              STONE TYPE
            </h3>

            <div className="space-y-[9px]">
              {loadingCategories
                ? Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={index}
                      className="ml-3 h-4 w-24 animate-pulse bg-gray-200"
                    />
                  ))
                : stoneTypes.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleCategoryClick(item.slug)}
                      className={`block w-full pl-3 text-left text-[14px] transition hover:text-black ${
                        selectedCategory === item.slug
                          ? "border-l-2 border-[#d97918] font-semibold text-[#111]"
                          : "text-[#5f5f5f]"
                      }`}
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {item.name}
                    </button>
                  ))}
            </div>

            <div className="mt-6 border-t border-[#bdbdbd] pt-4">
              <h4
                className="mb-3 text-[14px] font-bold uppercase text-[#111]"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                FILTER BY
              </h4>

              {["Color", "Finish", "Application"].map((item) => (
                <button
                  key={item}
                  type="button"
                  className="flex w-full items-center justify-between py-[5px] pl-3 text-left text-[14px] text-[#5f5f5f]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {item}
                  <span className="text-[16px]">⌄</span>
                </button>
              ))}
            </div>
          </aside>

          <div ref={scrollRef} className="overflow-x-auto overflow-y-hidden">
            <div className="flex gap-5 pb-3 md:gap-6">
              {loadingProducts ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="w-[230px] shrink-0 animate-pulse sm:w-[260px] lg:w-[300px] xl:w-[360px]"
                  >
                    <div className="h-[300px] bg-gray-200 sm:h-[340px] lg:h-[400px] xl:h-[460px]" />
                    <div className="mx-auto mt-5 h-5 w-32 bg-gray-200" />
                    <div className="mx-auto mt-3 h-4 w-24 bg-gray-100" />
                  </div>
                ))
              ) : products.length > 0 ? (
                products.map((item) => (
                  <Link
                    key={item.id || item.slug}
                    to={`/product/${selectedCategory}/${item.slug}`}
                    className="group w-[230px] shrink-0 text-center sm:w-[260px] lg:w-[300px] xl:w-[360px]"
                  >
                    <div className="h-[300px] overflow-hidden bg-[#f1f1f1] sm:h-[340px] lg:h-[400px] xl:h-[460px]">
                      <img
                        src={item.media?.[0]?.media_url || item.closeup_image}
                        alt={item.name}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    </div>

                    <h3
                      className="mt-4 text-[16px] font-bold uppercase leading-tight text-[#111] md:mt-5 md:text-[18px]"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {item.name}
                    </h3>

                    <p
                      className="mt-2 text-[12px] text-[#5f5f5f] md:text-[13px]"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {item.stone_group || selectedCategoryName}
                      {item.pattern ? ` • ${item.pattern}` : ""}
                    </p>
                  </Link>
                ))
              ) : (
                <div className="flex h-[300px] w-full items-center justify-center text-[16px] text-[#FF8000]">
                  No Stones found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WarmToneGrid;
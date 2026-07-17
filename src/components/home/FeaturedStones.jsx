import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { getOptimizedImageUrl } from "../../utils/Mediahelper";
import { ChevronDown } from "lucide-react";

const BROWSE_CATEGORY = {
  id: "browse",
  name: "Browse",
  slug: "browse",
  isVirtual: true,
};

const MAX_BROWSE_PRODUCTS = 12;

const getActiveProducts = (result) =>
  (result.products || result.data || []).filter((item) => {
    const hasImage =
      Boolean(item.closeup_image) ||
      Boolean(item.media?.[0]?.media_url);

    return (
      item.is_active === true &&
      item.is_published === true &&
      hasImage
    );
  });

const FeaturedStones = () => {
  const scrollRef = useRef(null);
  const requestIdRef = useRef(0);

  const [stoneTypes, setStoneTypes] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] =
    useState("browse");
  const [selectedCategoryName, setSelectedCategoryName] =
    useState("Browse");
  const [loadingCategories, setLoadingCategories] =
    useState(true);
  const [loadingProducts, setLoadingProducts] =
    useState(false);

  const resetProductScroll = useCallback(() => {
    scrollRef.current?.scrollTo({
      left: 0,
      behavior: "smooth",
    });
  }, []);

  // ==============================
  // BROWSE PRODUCTS
  // ==============================

  const fetchBrowseProducts = useCallback(async () => {
    const currentRequestId =
      requestIdRef.current + 1;

    requestIdRef.current = currentRequestId;

    try {
      setLoadingProducts(true);
      setSelectedCategoryName("Browse");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/stones/browse`,
        {
          params: {
            limit: MAX_BROWSE_PRODUCTS,
          },
        }
      );

      const result = response.data;

      if (
        requestIdRef.current !== currentRequestId
      ) {
        return;
      }

      if (result.success) {
        setProducts(result.data || []);
      } else {
        setProducts([]);
      }

      window.requestAnimationFrame(() => {
        resetProductScroll();
      });
    } catch (error) {
      console.error(
        "Error fetching Browse products:",
        error
      );

      if (
        requestIdRef.current === currentRequestId
      ) {
        setProducts([]);
      }
    } finally {
      if (
        requestIdRef.current === currentRequestId
      ) {
        setLoadingProducts(false);
      }
    }
  }, [resetProductScroll]);

  // ==============================
  // CATEGORY PRODUCTS
  // ==============================

  const fetchProductsByCategory = useCallback(
    async (categorySlug) => {
      const currentRequestId =
        requestIdRef.current + 1;

      requestIdRef.current = currentRequestId;

      try {
        setLoadingProducts(true);

        const response = await axios.get(
          `${
            import.meta.env.VITE_API_URL
          }/stones/${categorySlug}`
        );

        const result = response.data;

        if (
          requestIdRef.current !== currentRequestId
        ) {
          return;
        }

        if (result.success) {
          const categoryName =
            result.category?.name || "";

          setSelectedCategoryName(categoryName);

          const activeProducts =
            getActiveProducts(result).map(
              (item) => ({
                ...item,
                _categorySlug: categorySlug,
                _categoryName: categoryName,
              })
            );

          setProducts(activeProducts);
        } else {
          setProducts([]);
        }

        window.requestAnimationFrame(() => {
          resetProductScroll();
        });
      } catch (error) {
        console.error(
          "Error fetching category products:",
          error
        );

        if (
          requestIdRef.current === currentRequestId
        ) {
          setProducts([]);
        }
      } finally {
        if (
          requestIdRef.current === currentRequestId
        ) {
          setLoadingProducts(false);
        }
      }
    },
    [resetProductScroll]
  );

  // ==============================
  // INITIAL LOAD
  // ==============================

  useEffect(() => {
    const fetchStoneTypes = async () => {
      try {
        setLoadingCategories(true);

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/stones`
        );

        const result = response.data;

        if (result.success) {
          const activeCategories = (
            result.data || []
          )
            .filter(
              (item) =>
                item.is_active === true &&
                item.parent_id === null
            )
            .sort((a, b) => {
              const orderA =
                a.display_order ?? 999;

              const orderB =
                b.display_order ?? 999;

              if (orderA !== orderB) {
                return orderA - orderB;
              }

              return a.name.localeCompare(
                b.name,
                undefined,
                {
                  sensitivity: "base",
                }
              );
            });

          setStoneTypes(activeCategories);
          setSelectedCategory("browse");
          setSelectedCategoryName("Browse");

          await fetchBrowseProducts();
        } else {
          setStoneTypes([]);
          setProducts([]);
        }
      } catch (error) {
        console.error(
          "Error fetching stone types:",
          error
        );

        setStoneTypes([]);
        setProducts([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchStoneTypes();
  }, [fetchBrowseProducts]);

  // ==============================
  // HANDLERS
  // ==============================

  const handleCategoryClick = (slug) => {
    setSelectedCategory(slug);

    if (slug === "browse") {
      fetchBrowseProducts();
      return;
    }

    fetchProductsByCategory(slug);
  };

  const scrollProducts = (direction) => {
    if (!scrollRef.current) {
      return;
    }

    scrollRef.current.scrollBy({
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  const displayCategories = [
    BROWSE_CATEGORY,
    ...stoneTypes,
  ];

  return (
    <section className="mb-[70px] bg-white py-10 md:py-[24px]">
      <div className="mx-auto max-w-[1850px] px-5 md:px-6 xl:px-[52px]">
        <div className="mb-8 flex items-center justify-between md:mb-[44px]">
          <h2
            className="flex items-center gap-4 text-[18px] font-bold uppercase tracking-[0.01em] text-[#111] md:gap-7 md:text-[18px]"
            style={{
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            FEATURED STONES

            <span className="text-[24px] font-normal text-[#FF8000] md:text-[28px]">
              →
            </span>
          </h2>

          <div className="flex items-center gap-5 text-[28px] text-[#111] md:gap-7 md:text-[34px]">
            <button
              type="button"
              aria-label="Scroll featured stones left"
              onClick={() =>
                scrollProducts("left")
              }
              className="leading-none transition hover:text-black"
            >
              ←
            </button>

            <button
              type="button"
              aria-label="Scroll featured stones right"
              onClick={() =>
                scrollProducts("right")
              }
              className="leading-none transition hover:text-black"
            >
              →
            </button>
          </div>
        </div>

        {/* Mobile categories */}

        <div className="mb-6 flex gap-3 overflow-x-auto pb-2 lg:hidden">
          {loadingCategories
            ? Array.from({
                length: 6,
              }).map((_, index) => (
                <div
                  key={index}
                  className="h-8 w-24 shrink-0 animate-pulse bg-gray-200"
                />
              ))
            : displayCategories.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    handleCategoryClick(item.slug)
                  }
                  className={`shrink-0 border px-4 py-2 text-[13px] transition ${
                    selectedCategory === item.slug
                      ? "border-[#d97918] bg-[#d97918] text-white"
                      : "border-[#d0d0d0] text-[#5f5f5f] hover:border-[#d97918] hover:text-[#111]"
                  }`}
                  style={{
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {item.name}
                </button>
              ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[170px_1fr] xl:grid-cols-[180px_1fr]">
          {/* Desktop categories */}

          <aside className="hidden border-r border-[#d0d0d0] pr-6 lg:block">
            <h3
              className="mb-5 text-[18px] font-bold uppercase tracking-[0.02em] text-[#111]"
              style={{
                fontFamily:
                  "Montserrat, sans-serif",
              }}
            >
              STONE TYPE
            </h3>

            <div className="space-y-[9px]">
              {loadingCategories
                ? Array.from({
                    length: 8,
                  }).map((_, index) => (
                    <div
                      key={index}
                      className="ml-3 h-4 w-24 animate-pulse bg-gray-200"
                    />
                  ))
                : displayCategories.map(
                    (item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          handleCategoryClick(
                            item.slug
                          )
                        }
                        className={`block w-full pl-3 text-left text-[14px] transition hover:text-black ${
                          selectedCategory ===
                          item.slug
                            ? "border-l-2 border-[#d97918] font-semibold text-[#111]"
                            : "border-l-2 border-transparent text-[#5f5f5f]"
                        }`}
                        style={{
                          fontFamily:
                            "Inter, sans-serif",
                        }}
                      >
                        {item.name}
                      </button>
                    )
                  )}
            </div>

            {/* <div className="mt-6 border-t border-[#bdbdbd] pt-4">
              <h4
                className="mb-3 text-[14px] font-bold uppercase text-[#111]"
                style={{
                  fontFamily:
                    "Montserrat, sans-serif",
                }}
              >
                FILTER BY
              </h4>

              {[
                "Finish",
                "Thickness",
              ].map((item) => (
                <button
                  key={item}
                  type="button"
                  className="flex w-full items-center justify-between py-[5px] pl-3 text-left text-[14px] text-[#5f5f5f]"
                  style={{
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {item}

                  <span className="text-[12px]">
                    <ChevronDown size={18} />
                  </span>
                </button>
              ))}
            </div> */}
          </aside>

          {/* Products */}

          <div
            ref={scrollRef}
            className="overflow-x-auto overflow-y-hidden"
          >
            <div className="flex gap-5 pb-3 md:gap-6">
              {loadingProducts ? (
                Array.from({
                  length: 6,
                }).map((_, index) => (
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
                products.map((item) => {
                  /*
                   * Browse API provides:
                   * item.category.slug
                   * item.category.name
                   *
                   * Normal category API uses:
                   * item._categorySlug
                   * item._categoryName
                   */

                  const isBrowseProduct =
                    selectedCategory === "browse";

                  const productCategorySlug =
                    item.category?.slug ||
                    item._categorySlug ||
                    selectedCategory;

                  const productCategoryName =
                    item.category?.name ||
                    item._categoryName ||
                    selectedCategoryName;

                  const productImage =
                    item.closeup_image ||
                    item.media?.[0]?.media_url;

                  return (
                    <Link
                      key={`${productCategorySlug}-${
                        item.id || item.slug
                      }`}
                      to={`/product/${productCategorySlug}/${item.slug}`}
                      className="group w-[230px] shrink-0 text-center sm:w-[260px] lg:w-[300px] xl:w-[360px]"
                    >
                      <div className="h-[300px] overflow-hidden bg-[#f1f1f1] sm:h-[340px] lg:h-[400px] xl:h-[460px]">
                        <img
                          src={getOptimizedImageUrl(
                            productImage
                          )}
                          alt={item.name}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      </div>

                      <h3
                        className="mt-4 text-[16px] font-bold uppercase leading-tight text-[#111] md:mt-5 md:text-[18px]"
                        style={{
                          fontFamily:
                            "Montserrat, sans-serif",
                        }}
                      >
                        {item.name}
                      </h3>

                      <p
                        className="mt-2 text-[12px] text-[#5f5f5f] md:text-[13px]"
                        style={{
                          fontFamily:
                            "Inter, sans-serif",
                        }}
                      >
                        {isBrowseProduct
                          ? productCategoryName
                          : item.stone_group ||
                            productCategoryName}

                        {item.pattern
                          ? ` • ${item.pattern}`
                          : ""}
                      </p>
                    </Link>
                  );
                })
              ) : (
                <div className="flex h-[300px] min-w-full items-center justify-center text-[16px] text-[#FF8000]">
                  No stones found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedStones;
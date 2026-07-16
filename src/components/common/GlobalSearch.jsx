import axios from "axios";
import PropTypes from "prop-types";
import {
  BriefcaseBusiness,
  Building2,
  ExternalLink,
  FileText,
  Images,
  LoaderCircle,
  MapPin,
  PackageSearch,
  Search,
  Users,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

const WEBSITE_PAGES = [
  {
    id: "about-us",
    label: "About Us",
    path: "/aboutus",
    type: "Page",
    keywords: [
      "about",
      "about us",
      "company",
      "ultra stones",
      "experience",
    ],
    icon: Users,
  },
  {
    id: "our-process",
    label: "Our Process",
    path: "/ourprocess",
    type: "Page",
    keywords: [
      "process",
      "our process",
      "stone process",
      "how we work",
    ],
    icon: FileText,
  },
  {
    id: "online-inventory",
    label: "Online Inventory",
    path: "https://ultrastones.stoneprofitsweb.com/",
    type: "External",
    external: true,
    keywords: [
      "inventory",
      "online inventory",
      "stock",
      "available slabs",
      "online",
    ],
    icon: PackageSearch,
  },
  {
    id: "material-portfolio",
    label: "Material Portfolio",
    path: "/categories",
    type: "Page",
    keywords: [
      "materials",
      "material portfolio",
      "portfolio",
      "marble",
      "granite",
      "quartz",
      "quartzite",
      "stone",
    ],
    icon: PackageSearch,
  },
  {
    id: "merchandising-displays",
    label: "Merchandising Displays",
    path: "/merchandising-displays",
    type: "Resource",
    keywords: [
      "display",
      "displays",
      "merchandising",
      "sample display",
      "stand",
    ],
    icon: Building2,
  },
  {
    id: "gallery",
    label: "Gallery",
    path: "/gallery",
    type: "Resource",
    keywords: [
      "gallery",
      "images",
      "inspiration",
      "applications",
      "renders",
    ],
    icon: Images,
  },
  {
    id: "blogs",
    label: "Our Blogs",
    path: "/blogs",
    type: "Resource",
    keywords: [
      "blog",
      "blogs",
      "articles",
      "news",
      "information",
    ],
    icon: FileText,
  },
  {
    id: "ceu",
    label: "CEU",
    path: "/ceu",
    type: "Resource",
    keywords: [
      "ceu",
      "continuing education",
      "education",
      "course",
      "certificate",
    ],
    icon: FileText,
  },
  {
    id: "career",
    label: "Career",
    path: "/career",
    type: "Page",
    keywords: [
      "career",
      "careers",
      "job",
      "jobs",
      "vacancy",
      "hiring",
      "employment",
    ],
    icon: BriefcaseBusiness,
  },
  {
    id: "new-york",
    label: "New York Location",
    path: "/locations/new-york",
    type: "Location",
    keywords: [
      "new york",
      "ny",
      "farmingdale",
      "long island",
      "showroom",
    ],
    icon: MapPin,
  },
  {
    id: "philadelphia",
    label: "Philadelphia Location",
    path: "/locations/philadelphia",
    type: "Location",
    keywords: [
      "philadelphia",
      "pa",
      "pennsylvania",
      "warehouse",
      "showroom",
    ],
    icon: MapPin,
  },
  {
    id: "contact",
    label: "Contact",
    path: "/contact",
    type: "Page",
    keywords: [
      "contact",
      "contact us",
      "call",
      "email",
      "message",
      "support",
    ],
    icon: FileText,
  },
];

const normalizeText = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[-_/]+/g, " ")
    .replace(/\s+/g, " ");

const getResultIcon = (type) => {
  const normalizedType = String(type || "").toLowerCase();

  if (normalizedType === "product") {
    return PackageSearch;
  }

  if (
    normalizedType === "material" ||
    normalizedType === "collection" ||
    normalizedType === "category"
  ) {
    return PackageSearch;
  }

  if (
    normalizedType === "location" ||
    normalizedType === "showroom"
  ) {
    return MapPin;
  }

  if (normalizedType === "resource") {
    return FileText;
  }

  return FileText;
};

const GlobalSearch = ({
  materials = [],
  isLightNavbar = false,
  mobile = false,
  onResultClick,
}) => {
  const navigate = useNavigate();

  const searchContainerRef = useRef(null);
  const inputRef = useRef(null);
  const resultsContainerRef = useRef(null);

  const [query, setQuery] = useState("");
  const [apiResults, setApiResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);

  /*
   * Local items provide immediate results for website menu pages.
   * Materials are also included so category matches can appear
   * without waiting for the API request.
   */
  const localSearchItems = useMemo(() => {
    const materialItems = materials
      .filter(
        (material) =>
          material?.name &&
          material?.slug &&
          material?.is_active !== false
      )
      .map((material) => {
        const isParent =
          material.parent_id === null ||
          material.parent_id === undefined;

        return {
          id: `local-material-${material.id}`,
          label: material.name,
          path: `/product-category/${material.slug}`,
          type: isParent ? "Material" : "Collection",
          keywords: [
            material.name,
            material.slug,
            material.description,
            material.short_description,
            isParent
              ? "material category stone"
              : "collection subcategory stone",
          ].filter(Boolean),
          image: material.thumbnail_url || null,
          icon: PackageSearch,
          displayOrder: material.display_order ?? 999,
          score: 0,
        };
      });

    return [...WEBSITE_PAGES, ...materialItems];
  }, [materials]);

  /*
   * Search the backend after the user types at least two characters.
   * The delay prevents an API request for every immediate keystroke.
   */
  useEffect(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      setApiResults([]);
      setIsSearching(false);
      setSearchError("");

      return undefined;
    }

    const controller = new AbortController();

    const timeoutId = window.setTimeout(async () => {
      try {
        setIsSearching(true);
        setSearchError("");

        /*
         * Use this when VITE_API_URL already contains /api:
         *
         * VITE_API_URL=http://localhost:5000/api
         *
         * Final URL:
         * http://localhost:5000/api/search
         */
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/search`,
          {
            params: {
              q: trimmedQuery,
              limit: 15,
            },
            signal: controller.signal,
          }
        );

        const returnedResults =
          response.data?.data?.results;

        if (Array.isArray(returnedResults)) {
          const formattedResults = returnedResults
            .filter(
              (item) =>
                item?.label &&
                item?.path
            )
            .map((item, index) => ({
              ...item,
              id:
                item.id ||
                `api-result-${item.type}-${item.path}-${index}`,
              icon: getResultIcon(item.type),
              external:
                item.external === true ||
                String(item.path).startsWith("http"),
              score: Number(item.score) || 0,
            }));

          setApiResults(formattedResults);
        } else {
          setApiResults([]);
        }
      } catch (error) {
        const isCanceled =
          error.name === "CanceledError" ||
          error.code === "ERR_CANCELED" ||
          axios.isCancel(error);

        if (!isCanceled) {
          console.error("Global search failed:", error);

          setApiResults([]);
          setSearchError(
            "Unable to load product search results."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  /*
   * Search static pages and already-loaded categories locally.
   */
  const localResults = useMemo(() => {
    const normalizedQuery = normalizeText(query);

    if (!normalizedQuery) {
      return [];
    }

    const queryWords = normalizedQuery
      .split(" ")
      .filter(Boolean);

    return localSearchItems
      .map((item) => {
        const normalizedLabel = normalizeText(item.label);

        const normalizedKeywords = normalizeText(
          (item.keywords || []).join(" ")
        );

        let score = 0;

        if (normalizedLabel === normalizedQuery) {
          score += 200;
        }

        if (normalizedLabel.startsWith(normalizedQuery)) {
          score += 140;
        }

        if (normalizedLabel.includes(normalizedQuery)) {
          score += 100;
        }

        if (normalizedKeywords.includes(normalizedQuery)) {
          score += 50;
        }

        queryWords.forEach((word) => {
          if (normalizedLabel.startsWith(word)) {
            score += 30;
          }

          if (normalizedLabel.includes(word)) {
            score += 20;
          }

          if (normalizedKeywords.includes(word)) {
            score += 10;
          }
        });

        return {
          ...item,
          score,
        };
      })
      .filter((item) => item.score > 0);
  }, [query, localSearchItems]);

  /*
   * Merge backend results with local website results.
   * Duplicate paths are removed.
   */
  const results = useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    const combinedResults = [
      ...apiResults,
      ...localResults,
    ];

    const uniqueResults = Array.from(
      new Map(
        combinedResults.map((item) => [
          `${String(item.type).toLowerCase()}-${item.path}`,
          item,
        ])
      ).values()
    );

    return uniqueResults
      .sort((a, b) => {
        const scoreA = Number(a.score) || 0;
        const scoreB = Number(b.score) || 0;

        if (scoreB !== scoreA) {
          return scoreB - scoreA;
        }

        const orderA = a.displayOrder ?? 999;
        const orderB = b.displayOrder ?? 999;

        if (orderA !== orderB) {
          return orderA - orderB;
        }

        return String(a.label).localeCompare(
          String(b.label)
        );
      })
      .slice(0, 15);
  }, [query, apiResults, localResults]);

  /*
   * Close results when clicking outside the component.
   */
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  useEffect(() => {
    if (activeIndex >= results.length) {
      setActiveIndex(-1);
    }
  }, [activeIndex, results.length]);

  /*
   * Keep the keyboard-selected result visible.
   */
  useEffect(() => {
    if (
      activeIndex < 0 ||
      !resultsContainerRef.current
    ) {
      return;
    }

    const activeElement =
      resultsContainerRef.current.querySelector(
        `[data-search-index="${activeIndex}"]`
      );

    activeElement?.scrollIntoView({
      block: "nearest",
    });
  }, [activeIndex]);

  const resetSearch = () => {
    setQuery("");
    setApiResults([]);
    setSearchError("");
    setIsSearching(false);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const clearSearch = () => {
    resetSearch();

    window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const openResult = (item) => {
    if (!item?.path) {
      return;
    }

    const isExternal =
      item.external === true ||
      String(item.path).startsWith("http");

    if (isExternal) {
      window.open(
        item.path,
        "_blank",
        "noopener,noreferrer"
      );
    } else {
      navigate(item.path);
    }

    resetSearch();

    if (onResultClick) {
      onResultClick(item);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!query.trim()) {
      return;
    }

    if (
      activeIndex >= 0 &&
      results[activeIndex]
    ) {
      openResult(results[activeIndex]);
      return;
    }

    if (results.length === 1) {
      openResult(results[0]);
      return;
    }

    setIsOpen(true);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
      inputRef.current?.blur();

      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setIsOpen(true);

      if (!results.length) {
        return;
      }

      setActiveIndex((currentIndex) =>
        currentIndex >= results.length - 1
          ? 0
          : currentIndex + 1
      );

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);

      if (!results.length) {
        return;
      }

      setActiveIndex((currentIndex) =>
        currentIndex <= 0
          ? results.length - 1
          : currentIndex - 1
      );

      return;
    }

    if (
      event.key === "Enter" &&
      activeIndex >= 0 &&
      results[activeIndex]
    ) {
      event.preventDefault();
      openResult(results[activeIndex]);
    }
  };

  const showNoResults =
    query.trim().length > 0 &&
    !isSearching &&
    results.length === 0;

  return (
    <div
      ref={searchContainerRef}
      className={`relative ${
        mobile
          ? "w-full"
          : "w-full max-w-[320px]"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        role="search"
      >
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            placeholder="Search Website"
            autoComplete="off"
            aria-label="Search the Ultra Stones website"
            aria-expanded={isOpen}
            aria-controls="global-search-results"
            onChange={(event) => {
              const value = event.target.value;

              setQuery(value);
              setSearchError("");
              setIsOpen(Boolean(value.trim()));
            }}
            onFocus={() => {
              if (query.trim()) {
                setIsOpen(true);
              }
            }}
            onKeyDown={handleKeyDown}
            className={`
              w-full rounded-md border outline-none
              transition-all duration-300
              ${
                mobile
                  ? `
                    h-[48px] border-white/15 bg-white/10
                    px-4 pr-20 text-sm text-white
                    placeholder:text-white/50
                  `
                  : isLightNavbar
                    ? `
                      h-11 border-gray-300 bg-white px-4 pr-20
                      text-[12px] text-black
                      placeholder:text-gray-500
                      focus:border-gray-500
                    `
                    : `
                      h-11 border-white/20 bg-white/10 px-4 pr-20
                      text-[12px] text-white
                      placeholder:text-white/60
                      focus:border-white/40 focus:bg-white/15
                    `
              }
            `}
          />

          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={clearSearch}
              className={`
                absolute right-10 top-1/2 flex h-9 w-9
                -translate-y-1/2 items-center justify-center
                transition-colors
                ${
                  mobile || !isLightNavbar
                    ? "text-white/60 hover:text-white"
                    : "text-gray-400 hover:text-black"
                }
              `}
            >
              <X
                size={15}
                aria-hidden="true"
              />
            </button>
          )}

          <button
            type="submit"
            aria-label="Search website"
            className={`
              absolute right-0 top-1/2 flex h-11 w-11
              -translate-y-1/2 items-center justify-center
              transition-colors
              ${
                mobile || !isLightNavbar
                  ? "text-white/80 hover:text-white"
                  : "text-black/70 hover:text-black"
              }
            `}
          >
            {isSearching ? (
              <LoaderCircle
                size={17}
                className="animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Search
                size={17}
                aria-hidden="true"
              />
            )}
          </button>
        </div>
      </form>

      {isOpen && (
        <div
          id="global-search-results"
          className={`
            z-[100] overflow-hidden rounded-xl border
            border-black/10 bg-white
            shadow-[0_20px_60px_rgba(0,0,0,0.22)]
            ${
              mobile
                ? "relative mt-3 w-full"
                : "absolute right-0 top-[54px] w-[390px]"
            }
          `}
        >
          {searchError && (
            <div className="border-b border-red-100 bg-red-50 px-4 py-3">
              <p className="text-xs text-red-600">
                {searchError}
              </p>
            </div>
          )}

          {query.trim().length === 1 && (
            <div className="border-b border-black/10 px-4 py-2.5">
              <p className="text-[10px] tracking-[0.7px] text-black/40">
                Type one more character to search products.
              </p>
            </div>
          )}

          {results.length > 0 && (
            <>
              <div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[1.5px] text-black/45">
                  {results.length}{" "}
                  {results.length === 1
                    ? "result"
                    : "results"}{" "}
                  found
                </p>

                {isSearching && (
                  <div className="flex items-center gap-1.5 text-black/40">
                    <LoaderCircle
                      size={13}
                      className="animate-spin"
                    />

                    <span className="text-[10px] uppercase tracking-[1px]">
                      Searching
                    </span>
                  </div>
                )}
              </div>

              <div
                ref={resultsContainerRef}
                className="max-h-[420px] overflow-y-auto p-2"
              >
                {results.map((item, index) => {
                  const Icon =
                    item.icon ||
                    getResultIcon(item.type);

                  const isActive =
                    activeIndex === index;

                  const isExternal =
                    item.external === true ||
                    String(item.path).startsWith("http");

                  return (
                    <button
                      key={
                        item.id ||
                        `${item.type}-${item.path}`
                      }
                      type="button"
                      data-search-index={index}
                      onMouseEnter={() =>
                        setActiveIndex(index)
                      }
                      onClick={() =>
                        openResult(item)
                      }
                      className={`
                        flex w-full items-center gap-3 rounded-lg
                        px-3 py-3 text-left transition-colors
                        ${
                          isActive
                            ? "bg-[#f2f2f2]"
                            : "hover:bg-[#f7f7f7]"
                        }
                      `}
                    >
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-black/5">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.label}
                            loading="lazy"
                            className="h-full w-full object-cover"
                            onError={(event) => {
                              event.currentTarget.style.display =
                                "none";
                            }}
                          />
                        ) : (
                          <Icon
                            size={18}
                            className="text-black/55"
                            aria-hidden="true"
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-medium text-black">
                          {item.label}
                        </p>

                        <div className="mt-0.5 flex items-center gap-2">
                          <p className="text-[11px] uppercase tracking-[1px] text-black/45">
                            {item.type}
                          </p>

                          {item.category_name && (
                            <>
                              <span className="text-black/20">
                                •
                              </span>

                              <p className="truncate text-[11px] text-black/40">
                                {item.category_name}
                              </p>
                            </>
                          )}
                        </div>
                      </div>

                      {isExternal ? (
                        <ExternalLink
                          size={15}
                          className="shrink-0 text-black/35"
                          aria-hidden="true"
                        />
                      ) : (
                        <span
                          className="shrink-0 text-black/35"
                          aria-hidden="true"
                        >
                          →
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {isSearching &&
            results.length === 0 && (
              <div className="flex items-center justify-center gap-3 px-6 py-9">
                <LoaderCircle
                  size={20}
                  className="animate-spin text-black/35"
                />

                <p className="text-sm text-black/50">
                  Searching products and materials...
                </p>
              </div>
            )}

          {showNoResults && (
            <div className="px-6 py-8 text-center">
              <Search
                size={24}
                className="mx-auto text-black/25"
                aria-hidden="true"
              />

              <p className="mt-3 text-sm font-medium text-black">
                No results found
              </p>

              <p className="mt-1 text-xs leading-relaxed text-black/50">
                Try searching for a page, product,
                material, collection, or location.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

GlobalSearch.propTypes = {
  materials: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      name: PropTypes.string,
      slug: PropTypes.string,
      description: PropTypes.string,
      short_description: PropTypes.string,
      thumbnail_url: PropTypes.string,
      parent_id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      display_order: PropTypes.number,
      is_active: PropTypes.bool,
    })
  ),

  isLightNavbar: PropTypes.bool,
  mobile: PropTypes.bool,
  onResultClick: PropTypes.func,
};

export default GlobalSearch;
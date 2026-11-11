
import axios from "axios";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getOptimizedImageUrl,
} from "../../../utils/Mediahelper";

/* =========================================================
   CONFIGURATION
========================================================= */

const API_URL = String(
  import.meta.env.VITE_API_URL || ""
).replace(/\/+$/, "");

const STONES_URL = `${API_URL}/stones`;

const FONT = {
  fontFamily: "Montserrat, sans-serif",
};

/* =========================================================
   HELPERS
========================================================= */

const isActive = (item) =>
  item?.is_active === true;

const isPublished = (item) =>
  item?.is_active === true &&
  item?.is_published === true;

const isRoot = (category) =>
  category?.parent_id == null;

const sameId = (a, b) =>
  String(a) === String(b);

const sortByName = (a, b) =>
  String(a.name || "").localeCompare(
    String(b.name || ""),
    undefined,
    {
      sensitivity: "base",
      numeric: true,
    }
  );

const normalizeProducts = (
  products,
  owner
) => {
  if (!Array.isArray(products)) {
    return [];
  }

  return products
    .filter((product) =>
      sameId(
        product.category_id ?? owner.id,
        owner.id
      )
    )
    .map((product) => ({
      ...product,
      _categoryId: owner.id,
      _categorySlug: owner.slug,
    }));
};

const uniqueProducts = (products) => {
  const seen = new Set();

  return products.filter((product) => {
    const key = String(
      product.id ??
      `${product._categorySlug}:${product.slug}`
    );

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

/* =========================================================
   SUBCATEGORY NAVIGATION
========================================================= */

const SubcategoryNavigation = ({
  childrenCategories,
  selectedId,
  onSelect,
  counts,
}) => {
  if (!childrenCategories.length) {
    return null;
  }

  const options = [
    {
      id: "all",
      name: "All Products",
      count: counts.all,
    },
    ...childrenCategories.map((child) => ({
      id: String(child.id),
      name: child.name,
      count:
        counts.byCategory[String(child.id)] ??
        0,
    })),
  ];

  return (
    <section
      className="
        max-w-[1650px]
        mx-auto
        px-6
        xl:px-10
        mt-10
      "
    >
      <div
        className="
          border-b
          border-[#e5e5e5]
        "
      >
        <p
          className="
            text-[10px]
            uppercase
            tracking-[2px]
            font-semibold
            text-[#999]
            mb-5
          "
          style={FONT}
        >
          Browse Collection
        </p>

        <div
          role="group"
          aria-label="Browse subcategories"
          className="
            flex
            flex-wrap
            items-center
            gap-x-8
            gap-y-3
          "
        >
          {options.map((option) => {
            const selected =
              selectedId === option.id;

            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={selected}
                onClick={() =>
                  onSelect(option.id)
                }
                className={`
                  relative
                  pb-4
                  text-[12px]
                  font-semibold
                  uppercase
                  tracking-[1px]
                  transition-colors
                  duration-300
                  ${
                    selected
                      ? "text-[#161412]"
                      : "text-[#888] hover:text-[#161412]"
                  }
                `}
                style={FONT}
              >
                {option.name}

                <span
                  className={`
                    ml-2
                    text-[10px]
                    ${
                      selected
                        ? "text-[#c91f26]"
                        : "text-[#aaa]"
                    }
                  `}
                >
                  {option.count}
                </span>

                <span
                  className={`
                    absolute
                    bottom-0
                    left-0
                    h-[2px]
                    w-full
                    bg-[#c91f26]
                    origin-left
                    transition-transform
                    duration-300
                    ${
                      selected
                        ? "scale-x-100"
                        : "scale-x-0"
                    }
                  `}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/* =========================================================
   PRODUCT CARD
========================================================= */

const ProductCard = ({
  item,
  onNavigate,
}) => {
  const image =
    item.closeup_image || null;

  const imageUrl = image
    ? getOptimizedImageUrl(
        image,
        400,
        72
      )
    : "https://placehold.co/400x400";

  const srcSet = image
    ? [
        [240, 68],
        [320, 70],
        [400, 72],
        [520, 74],
        [700, 76],
      ]
        .map(
          ([width, quality]) =>
            `${getOptimizedImageUrl(
              image,
              width,
              quality
            )} ${width}w`
        )
        .join(", ")
    : undefined;

  return (
    <Link
      to={`/product/${item._categorySlug}/${item.slug}`}
      onClick={onNavigate}
      className="
        group
        cursor-pointer
        block
      "
    >
      <div
        className="
          overflow-hidden
          bg-[#eaeaea]
          aspect-square
        "
      >
        <img
          src={imageUrl}
          srcSet={srcSet}
          sizes="
            (min-width: 1280px) calc((100vw - 128px) / 4),
            (min-width: 768px) calc((100vw - 96px) / 3),
            calc((100vw - 72px) / 2)
          "
          alt={item.name}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          width="700"
          height="700"
          className="
            block
            w-full
            h-full
            object-cover
            duration-700
            group-hover:scale-[1.02]
          "
        />
      </div>

      <h2
        className="
          mt-4
          text-[15px]
          font-semibold
          text-[#161412]
          border-b
          border-[#1f1f1f]
          pb-1
          inline-block
        "
        style={FONT}
      >
        {item.name}
      </h2>

      <p
        className="
          mt-3
          text-[11px]
          leading-[1.65]
          text-[#8a8a8a]
          line-clamp-4
        "
        style={FONT}
      >
        {item.small_description}
      </p>
    </Link>
  );
};

/* =========================================================
   PRODUCT CATEGORY
========================================================= */

const ProductCategory = () => {
  const { slug } = useParams();

  const [category, setCategory] =
    useState(null);

  const [
    parentCategory,
    setParentCategory,
  ] = useState(null);

  const [
    childCategories,
    setChildCategories,
  ] = useState([]);

  const [
    productsByCategory,
    setProductsByCategory,
  ] = useState({});

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("all");

  const [
    searchQuery,
    setSearchQuery,
  ] = useState("");

  const [
    selectedPattern,
    setSelectedPattern,
  ] = useState("");

  const [
    selectedGroup,
    setSelectedGroup,
  ] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const hasRestoredScroll =
    useRef(false);

  /* =======================================================
     FETCH CATEGORY HIERARCHY
  ======================================================= */

  useEffect(() => {
    const controller =
      new AbortController();

    let mounted = true;

    hasRestoredScroll.current = false;

    const fetchData = async () => {
      setLoading(true);
      setError("");

      setCategory(null);
      setParentCategory(null);
      setChildCategories([]);
      setProductsByCategory({});

      setSelectedCategory("all");
      setSearchQuery("");
      setSelectedPattern("");
      setSelectedGroup("");

      try {
        const [
          detailResponse,
          listResponse,
        ] = await Promise.all([
          axios.get(
            `${STONES_URL}/${slug}`,
            {
              signal: controller.signal,
            }
          ),

          axios.get(
            STONES_URL,
            {
              signal: controller.signal,
            }
          ),
        ]);

        if (!mounted) return;

        const detail =
          detailResponse.data;

        const list =
          listResponse.data;

        if (
          !detail?.success ||
          !detail?.category
        ) {
          throw new Error(
            "Category not found."
          );
        }

        if (
          !list?.success ||
          !Array.isArray(list.data)
        ) {
          throw new Error(
            "Unable to load category hierarchy."
          );
        }

        const current =
          detail.category;

        const categories =
          list.data.filter(isActive);

        /*
         * Resolve the parent category.
         *
         * For a child URL, find its parent.
         * For a parent URL, use itself.
         */

        let parent = current;

        if (!isRoot(current)) {
          parent =
            categories.find(
              (item) =>
                sameId(
                  item.id,
                  current.parent_id
                )
            ) || current;
        }

        /*
         * Find active direct children.
         */

        const children =
          categories
            .filter(
              (item) =>
                item.parent_id != null &&
                sameId(
                  item.parent_id,
                  parent.id
                )
            )
            .sort(sortByName);

        /*
         * IMPORTANT:
         *
         * If children exist, the parent
         * is grouping-only.
         *
         * We fetch products from children,
         * NOT directly from the parent.
         *
         * If no children exist, preserve
         * normal category behavior.
         */

        const collectionCategories =
          children.length > 0
            ? children
            : [current];

        const results =
          await Promise.all(
            collectionCategories.map(
              async (item) => {
                /*
                 * Reuse current response
                 * when it belongs to the
                 * requested collection.
                 */

                if (
                  sameId(
                    item.id,
                    current.id
                  )
                ) {
                  return {
                    category: item,
                    products:
                      detail.products || [],
                  };
                }

                const response =
                  await axios.get(
                    `${STONES_URL}/${item.slug}`,
                    {
                      signal:
                        controller.signal,
                    }
                  );

                if (
                  !response.data?.success
                ) {
                  throw new Error(
                    `Unable to load ${item.name}.`
                  );
                }

                return {
                  category: item,
                  products:
                    response.data.products ||
                    [],
                };
              }
            )
          );

        if (!mounted) return;

        const grouped = {};

        results.forEach(
          ({ category: owner, products }) => {
            grouped[String(owner.id)] =
              normalizeProducts(
                products,
                owner
              );
          }
        );

        setCategory(current);
        setParentCategory(parent);
        setChildCategories(children);
        setProductsByCategory(grouped);

        /*
         * Parent page:
         * Show all child products.
         *
         * Child page:
         * Select that child by default.
         */

        const isChildPage =
          children.some(
            (child) =>
              sameId(
                child.id,
                current.id
              )
          );

        setSelectedCategory(
          isChildPage
            ? String(current.id)
            : "all"
        );
      } catch (err) {
        if (
          !mounted ||
          axios.isCancel(err) ||
          err.code === "ERR_CANCELED"
        ) {
          return;
        }

        console.error(
          "Error fetching category:",
          err
        );

        setError(
          "Unable to load this collection. Please try again."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [slug]);

  /* =======================================================
     ALL COLLECTION PRODUCTS
  ======================================================= */

  const allProducts = useMemo(() => {
    const ids =
      childCategories.length > 0
        ? childCategories.map(
            (item) =>
              String(item.id)
          )
        : category
          ? [String(category.id)]
          : [];

    const combined =
      ids.flatMap(
        (id) =>
          productsByCategory[id] || []
      );

    return uniqueProducts(combined);
  }, [
    category,
    childCategories,
    productsByCategory,
  ]);

  /* =======================================================
     COUNTS
  ======================================================= */

  const counts = useMemo(() => {
    const byCategory = {};

    childCategories.forEach(
      (child) => {
        byCategory[
          String(child.id)
        ] = (
          productsByCategory[
            String(child.id)
          ] || []
        ).filter(isPublished).length;
      }
    );

    return {
      all:
        allProducts.filter(
          isPublished
        ).length,
      byCategory,
    };
  }, [
    childCategories,
    productsByCategory,
    allProducts,
  ]);

  /* =======================================================
     SELECTED PRODUCTS
  ======================================================= */

  const selectedProducts = useMemo(() => {
    if (
      selectedCategory === "all" ||
      !childCategories.length
    ) {
      return allProducts;
    }

    return (
      productsByCategory[
        String(selectedCategory)
      ] || []
    );
  }, [
    selectedCategory,
    childCategories,
    productsByCategory,
    allProducts,
  ]);

  /* =======================================================
     PATTERN OPTIONS
  ======================================================= */

  const patternOptions = useMemo(() => {
    return [
      ...new Set(
        selectedProducts
          .filter(isPublished)
          .map(
            (item) =>
              item.pattern
          )
          .filter(Boolean)
      ),
    ].sort();
  }, [selectedProducts]);

  /* =======================================================
     GROUP OPTIONS
  ======================================================= */

  const groupOptions = useMemo(() => {
    return [
      ...new Set(
        selectedProducts
          .filter(isPublished)
          .map(
            (item) =>
              item.stone_group
          )
          .filter(Boolean)
      ),
    ].sort();
  }, [selectedProducts]);

  /* =======================================================
     FILTERED PRODUCTS
  ======================================================= */

  const filteredProducts = useMemo(() => {
    const search =
      searchQuery
        .trim()
        .toLowerCase();

    return selectedProducts
      .filter((item) => {
        const searchMatch =
          !search ||
          String(
            item.name || ""
          )
            .toLowerCase()
            .includes(search);

        const patternMatch =
          !selectedPattern ||
          item.pattern ===
            selectedPattern;

        const groupMatch =
          !selectedGroup ||
          item.stone_group ===
            selectedGroup;

        return (
          isPublished(item) &&
          searchMatch &&
          patternMatch &&
          groupMatch
        );
      })
      .sort(sortByName);
  }, [
    selectedProducts,
    searchQuery,
    selectedPattern,
    selectedGroup,
  ]);

  /* =======================================================
     CHANGE SUBCATEGORY
  ======================================================= */

  const handleCategoryChange = (id) => {
    setSelectedCategory(id);

    setSearchQuery("");
    setSelectedPattern("");
    setSelectedGroup("");
  };

  /* =======================================================
     SCROLL RESTORATION
  ======================================================= */

  useLayoutEffect(() => {
    if (
      loading ||
      !category ||
      hasRestoredScroll.current
    ) {
      return;
    }

    const key =
      `product-category-scroll:${slug}`;

    const saved =
      sessionStorage.getItem(key);

    if (saved === null) {
      hasRestoredScroll.current =
        true;
      return;
    }

    const position = Number(saved);

    if (!Number.isFinite(position)) {
      hasRestoredScroll.current =
        true;
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({
          top: position,
          left: 0,
          behavior: "auto",
        });

        hasRestoredScroll.current =
          true;
      });
    });
  }, [
    loading,
    category,
    slug,
  ]);

  const saveScrollPosition = () => {
    sessionStorage.setItem(
      `product-category-scroll:${slug}`,
      String(window.scrollY)
    );
  };

  /* =======================================================
     LOADING / ERROR
  ======================================================= */

  if (loading) {
    return (
      <ProductCategorySkeleton />
    );
  }

  if (
    error ||
    !category ||
    category.slug !== slug
  ) {
    return (
      <main
        className="
          min-h-screen
          pt-[150px]
          px-6
          text-center
        "
      >
        <h1
          className="
            text-[24px]
            font-semibold
            text-[#161412]
          "
          style={FONT}
        >
          Collection Unavailable
        </h1>

        <p
          className="
            mt-4
            text-[13px]
            text-[#777]
          "
          style={FONT}
        >
          {error ||
            "This collection could not be found."}
        </p>

        <Link
          to="/categories"
          className="
            inline-block
            mt-6
            border-b
            border-[#c91f26]
            pb-1
            text-[12px]
            uppercase
            tracking-[1px]
          "
          style={FONT}
        >
          Back to Material Portfolio
        </Link>
      </main>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className="
        min-h-screen
        pt-[110px]
      "
    >
      {/* =================================================
          HEADING
      ================================================= */}

      <section>
        <div
          className="
            max-w-[1650px]
            mx-auto
            px-6
            xl:px-10
          "
        >
          <h1
            className="
              text-[34px]
              md:text-[42px]
              font-semibold
              text-[#161412]
              leading-none
            "
            style={FONT}
          >
            {category.name}
          </h1>

          <div
            className="
              w-[70px]
              h-[4px]
              bg-[#c91f26]
              mt-4
              mb-4
            "
          />

          {/* BREADCRUMBS */}

          <p
            className="
              text-[13px]
              text-[#777]
            "
            style={FONT}
          >
            <Link
              to="/"
              className="
                hover:text-[#161412]
                duration-300
              "
            >
              Home
            </Link>

            {" / "}

            <Link
              to="/categories"
              className="
                hover:text-[#161412]
                duration-300
              "
            >
              Material Portfolio
            </Link>

            {" / "}

            {parentCategory &&
            !sameId(
              parentCategory.id,
              category.id
            ) ? (
              <>
                <Link
                  to={`/product-category/${parentCategory.slug}`}
                  className="
                    hover:text-[#161412]
                    duration-300
                  "
                >
                  {parentCategory.name}
                </Link>

                {" / "}
              </>
            ) : null}

            <span
              className="
                text-[#161412]
              "
            >
              <b>
                {category.name}
              </b>
            </span>
          </p>

          <p
            className="
              text-[13px]
              text-[#777]
              mt-3
            "
            style={FONT}
          >
            Showing all{" "}
            {filteredProducts.length}{" "}
            results
          </p>
        </div>
      </section>

      {/* =================================================
          SUBCATEGORY NAVIGATION

          Only shown when children exist.
          No parent-only filter.
      ================================================= */}

      <SubcategoryNavigation
        childrenCategories={
          childCategories
        }
        selectedId={
          selectedCategory
        }
        onSelect={
          handleCategoryChange
        }
        counts={counts}
      />

      {/* =================================================
          EXISTING FILTERS
      ================================================= */}

      <section
        className="
          max-w-[1650px]
          mx-auto
          px-6
          xl:px-10
          mt-12
        "
      >
        <div
          className="
            flex
            flex-wrap
            items-center
            justify-center
            gap-4
          "
        >
          {/* SEARCH */}

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }
              placeholder={`Search ${category.name}...`}
              className="
                h-[50px]
                w-[230px]
                border
                border-[#d9d9d9]
                px-5
                uppercase
                tracking-[2px]
                text-[11px]
                outline-none
                duration-300
                bg-white
                text-[#777]
                placeholder:text-[#777]
              "
              style={FONT}
            />
          </div>

          {/* COLOR - COMING SOON */}

          <div
            className="
              relative
              group
            "
          >
            <button
              type="button"
              className="
                h-[50px]
                w-[230px]
                border
                border-[#d9d9d9]
                px-5
                uppercase
                tracking-[2px]
                text-[11px]
                flex
                items-center
                justify-between
                bg-white
                text-[#777]
              "
              style={FONT}
            >
              <span>
                Filter By Color (0)
              </span>

              <span className="text-[9px]">
                ▼
              </span>
            </button>

            <div
              className="
                pointer-events-none
                absolute
                left-1/2
                top-[calc(100%+8px)]
                z-50
                -translate-x-1/2
                translate-y-1
                whitespace-nowrap
                bg-[#161412]
                px-4
                py-2
                text-[9px]
                font-semibold
                uppercase
                tracking-[1.5px]
                text-white
                opacity-0
                invisible
                transition-all
                duration-200
                group-hover:opacity-100
                group-hover:visible
                group-hover:translate-y-0
              "
              style={FONT}
            >
              Coming Soon

              <span
                className="
                  absolute
                  left-1/2
                  bottom-full
                  -translate-x-1/2
                  border-[5px]
                  border-transparent
                  border-b-[#161412]
                "
              />
            </div>
          </div>

          {/* PATTERN FILTER */}

          <div className="relative">
            <select
              value={selectedPattern}
              onChange={(event) =>
                setSelectedPattern(
                  event.target.value
                )
              }
              className={`
                h-[50px]
                w-[230px]
                border
                px-5
                pr-10
                uppercase
                tracking-[2px]
                text-[11px]
                appearance-none
                outline-none
                cursor-pointer
                duration-300
                ${
                  selectedPattern
                    ? "bg-black text-white border-black"
                    : "bg-white text-[#777] border-[#d9d9d9]"
                }
              `}
              style={FONT}
            >
              <option value="">
                Sort By
              </option>

              {patternOptions.map(
                (pattern) => (
                  <option
                    key={pattern}
                    value={pattern}
                  >
                    {pattern}
                  </option>
                )
              )}
            </select>

            <span
              className={`
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-[9px]
                pointer-events-none
                ${
                  selectedPattern
                    ? "text-white"
                    : "text-[#777]"
                }
              `}
            >
              ▼
            </span>
          </div>

          {/* GROUP FILTER */}

          <div className="relative">
            <select
              value={selectedGroup}
              onChange={(event) =>
                setSelectedGroup(
                  event.target.value
                )
              }
              className={`
                h-[50px]
                w-[230px]
                border
                px-5
                pr-10
                uppercase
                tracking-[2px]
                text-[11px]
                appearance-none
                outline-none
                cursor-pointer
                duration-300
                ${
                  selectedGroup
                    ? "bg-black text-white border-black"
                    : "bg-white text-[#777] border-[#d9d9d9]"
                }
              `}
              style={FONT}
            >
              <option value="">
                Filter By Group
              </option>

              {groupOptions.map(
                (group) => (
                  <option
                    key={group}
                    value={group}
                  >
                    {group}
                  </option>
                )
              )}
            </select>

            <span
              className={`
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                text-[9px]
                pointer-events-none
                ${
                  selectedGroup
                    ? "text-white"
                    : "text-[#777]"
                }
              `}
            >
              ▼
            </span>
          </div>
        </div>

        {/* ACTIVE FILTERS */}

        {(selectedPattern ||
          selectedGroup) && (
          <div
            className="
              flex
              flex-wrap
              items-center
              justify-between
              gap-4
              mt-8
            "
          >
            <div
              className="
                flex
                flex-wrap
                gap-3
              "
            >
              {[
                {
                  value: selectedPattern,
                  clear: () =>
                    setSelectedPattern(""),
                },
                {
                  value: selectedGroup,
                  clear: () =>
                    setSelectedGroup(""),
                },
              ]
                .filter(
                  (filter) =>
                    filter.value
                )
                .map((filter) => (
                  <div
                    key={filter.value}
                    className="
                      h-[30px]
                      px-3
                      border
                      border-[#ddd]
                      bg-white
                      flex
                      items-center
                      gap-2
                      text-[10px]
                      uppercase
                      tracking-[1px]
                      text-[#777]
                    "
                  >
                    {filter.value}

                    <button
                      type="button"
                      onClick={
                        filter.clear
                      }
                      aria-label={`Remove ${filter.value} filter`}
                    >
                      ×
                    </button>
                  </div>
                ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedPattern("");
                setSelectedGroup("");
              }}
              className="
                text-[11px]
                uppercase
                tracking-[1px]
                text-[#9a9a9a]
                underline
              "
              style={FONT}
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>

      {/* =================================================
          PRODUCTS
      ================================================= */}

      <section
        className="
          max-w-[1650px]
          mx-auto
          px-6
          xl:px-10
          pt-10
          pb-24
        "
      >
        {filteredProducts.length > 0 ? (
          <div
            className="
              grid
              grid-cols-2
              md:grid-cols-3
              xl:grid-cols-4
              gap-x-6
              gap-y-10
            "
          >
            {filteredProducts.map(
              (item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  onNavigate={
                    saveScrollPosition
                  }
                />
              )
            )}
          </div>
        ) : (
          <div
            className="
              py-20
              text-center
            "
          >
            <h2
              className="
                text-[20px]
                font-semibold
                text-[#161412]
              "
              style={FONT}
            >
              No Products Found
            </h2>

            <p
              className="
                mt-3
                text-[13px]
                text-[#888]
              "
              style={FONT}
            >
              No products match the
              selected collection or
              filters.
            </p>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
                setSelectedPattern("");
                setSelectedGroup("");
              }}
              className="
                inline-block
                mt-6
                border-b
                border-[#c91f26]
                pb-1
                text-[12px]
                font-semibold
                uppercase
                tracking-[1px]
              "
              style={FONT}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductCategory;

/* =========================================================
   LOADING SKELETON
========================================================= */

const ProductCategorySkeleton = () => {
  return (
    <main
      className="
        min-h-screen
        pt-[110px]
      "
      aria-busy="true"
      aria-label="Loading products"
    >
      <section>
        <div
          className="
            max-w-[1650px]
            mx-auto
            px-6
            xl:px-10
          "
        >
          <div
            className="
              h-[42px]
              w-[260px]
              bg-[#ececec]
              animate-pulse
            "
          />

          <div
            className="
              w-[70px]
              h-[4px]
              bg-[#c91f26]
              mt-4
              mb-4
            "
          />

          <div
            className="
              h-[14px]
              w-[320px]
              max-w-full
              bg-[#ececec]
              animate-pulse
            "
          />

          <div
            className="
              h-[14px]
              w-[130px]
              bg-[#ececec]
              mt-3
              animate-pulse
            "
          />
        </div>
      </section>

      <section
        className="
          max-w-[1650px]
          mx-auto
          px-6
          xl:px-10
          mt-12
        "
      >
        <div
          className="
            flex
            flex-wrap
            items-center
            justify-center
            gap-4
          "
        >
          {Array.from({
            length: 4,
          }).map((_, index) => (
            <div
              key={index}
              className="
                h-[50px]
                w-[230px]
                bg-[#ececec]
                animate-pulse
              "
            />
          ))}
        </div>
      </section>

      <section
        className="
          max-w-[1650px]
          mx-auto
          px-6
          xl:px-10
          pt-10
          pb-24
        "
      >
        <div
          className="
            grid
            grid-cols-2
            md:grid-cols-3
            xl:grid-cols-4
            gap-x-6
            gap-y-10
          "
        >
          {Array.from({
            length: 12,
          }).map((_, index) => (
            <article key={index}>
              <div
                className="
                  aspect-square
                  bg-[#ececec]
                  animate-pulse
                "
              />

              <div
                className="
                  mt-4
                  h-[20px]
                  w-[65%]
                  bg-[#ececec]
                  animate-pulse
                "
              />

              <div
                className="
                  mt-3
                  space-y-2
                "
              >
                <div
                  className="
                    h-[11px]
                    w-full
                    bg-[#ececec]
                    animate-pulse
                  "
                />

                <div
                  className="
                    h-[11px]
                    w-full
                    bg-[#ececec]
                    animate-pulse
                  "
                />

                <div
                  className="
                    h-[11px]
                    w-[75%]
                    bg-[#ececec]
                    animate-pulse
                  "
                />
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

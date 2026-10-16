import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import { Link } from "react-router-dom";

import Loading from "../../../components/common/Loading";

import {
  getOptimizedImageUrl,
} from "../../../utils/Mediahelper";

import {
  ArrowLeft,
  Download,
  ExternalLink,
  FileText,
} from "lucide-react";

/* =========================================================
   CONFIGURATION
========================================================= */

const API_URL = (
  import.meta.env.VITE_API_URL || ""
).replace(/\/$/, "");

const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

/* =========================================================
   HELPERS
========================================================= */

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0))
    .join("")
    .substring(0, 2)
    .toUpperCase();

/* =========================================================
   FILE URL
========================================================= */

const getFileUrl = (url) => {
  if (!url) return "";

  if (
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {
    return url;
  }

  return `${API_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
};

/* =========================================================
   EXTRACT API ARRAY
========================================================= */

const extractArray = (response) => {
  const candidates = [
    response,
    response?.data,
    response?.data?.data,
    response?.data?.resources,
    response?.data?.data?.resources,
    response?.resources,
  ];

  return candidates.find(Array.isArray) || [];
};

/* =========================================================
   CATEGORY SORTING
========================================================= */

const sortCategories = (a, b) => {
  // Ultra Quartz always first
  if (a.slug === "ultra-quartz") return -1;
  if (b.slug === "ultra-quartz") return 1;

  // Atlas Plan always last
  if (a.slug === "atlas-plan") return 1;
  if (b.slug === "atlas-plan") return -1;

  // Other categories alphabetical
  return a.name.localeCompare(
    b.name,
    undefined,
    {
      sensitivity: "base",
    }
  );
};

/* =========================================================
   RESOURCES PAGE
========================================================= */

export default function Resources() {
  /* =======================================================
     STATES
  ======================================================= */

  const [materials, setMaterials] = useState([]);

  const [resources, setResources] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedCategory, setSelectedCategory] =
    useState(null);

  /* =======================================================
     FETCH CATEGORIES + RESOURCES
  ======================================================= */

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        /* ===============================================
           API CALLS
        =============================================== */

        const [
          categoriesResponse,
          resourcesResponse,
        ] = await Promise.all([
          axios.get(`${API_URL}/stones`, {
            signal: controller.signal,
          }),

          axios.get(
            `${API_URL}/category-resources/public`,
            {
              signal: controller.signal,
            }
          ),
        ]);

        /* ===============================================
           EXTRACT DATA
        =============================================== */

        const categoriesData = extractArray(
          categoriesResponse.data
        );

        const resourcesData = extractArray(
          resourcesResponse.data
        );

        /* ===============================================
           IMPORTANT FIX

           Public API already returns only:
           - Active resources
           - Resources from active categories

           Therefore, DO NOT filter resources
           using item.is_active.

           The public API does not return that
           field.
        =============================================== */

        const activeResources = resourcesData;

        /* ===============================================
           GET CATEGORY IDS WITH RESOURCES
        =============================================== */

        const activeCategoryIds = new Set(
          activeResources.map((item) =>
            String(item.category_id)
          )
        );

        /* ===============================================
           FILTER CATEGORIES

           Show only:
           - Active categories
           - Parent categories
           - Categories with uploaded resources
        =============================================== */

        const filteredCategories = categoriesData
          .filter(
            (item) =>
              item.is_active === true &&
              item.parent_id === null &&
              activeCategoryIds.has(String(item.id))
          )
          .sort(sortCategories);

        /* ===============================================
           UPDATE STATES
        =============================================== */

        if (!controller.signal.aborted) {
          setMaterials(filteredCategories);

          setResources(activeResources);
        }
      } catch (err) {
        if (
          err.code !== "ERR_CANCELED" &&
          err.name !== "CanceledError"
        ) {
          console.error(
            "Resources page error:",
            err
          );

          setError(
            err.response?.data?.message ||
              "Unable to load resources. Please try again."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, []);

  /* =======================================================
     RESOURCE COUNTS BY CATEGORY
  ======================================================= */

  const resourceCounts = useMemo(() => {
    const counts = {};

    resources.forEach((resource) => {
      const categoryId = String(
        resource.category_id
      );

      counts[categoryId] =
        (counts[categoryId] || 0) + 1;
    });

    return counts;
  }, [resources]);

  /* =======================================================
     SELECTED CATEGORY RESOURCES
  ======================================================= */

  const selectedResources = useMemo(() => {
    if (!selectedCategory) return [];

    return resources
      .filter(
        (item) =>
          String(item.category_id) ===
          String(selectedCategory.id)
      )
      .sort(
        (a, b) =>
          Number(a.display_order || 0) -
          Number(b.display_order || 0)
      );
  }, [resources, selectedCategory]);

  /* =======================================================
     CATEGORY SELECTION
  ======================================================= */

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     BACK TO CATEGORIES
  ======================================================= */

  const handleBack = () => {
    setSelectedCategory(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return <Loading />;
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-screen pt-[110px]">

      {/* ===================================================
          PAGE HEADING
      =================================================== */}

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
            style={{
              fontFamily:
                "Montserrat, sans-serif",
            }}
          >
            {selectedCategory
              ? selectedCategory.name
              : "Resources"}
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

          {/* =============================================
              BREADCRUMB
          ============================================= */}

          <p
            className="
              text-[13px]
              text-[#777]
            "
            style={{
              fontFamily:
                "Montserrat, sans-serif",
            }}
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
              to="/"
              className="
                hover:text-[#161412]
                duration-300
              "
            >
              Resource Center
            </Link>

            {" / "}

            {selectedCategory ? (
              <>
                <button
                  type="button"
                  onClick={handleBack}
                  className="
                    hover:text-[#161412]
                    duration-300
                  "
                >
                  Resources
                </button>

                {" / "}

                <span className="text-[#161412]">
                  <b>{selectedCategory.name}</b>
                </span>
              </>
            ) : (
              <span className="text-[#161412]">
                <b>Resources</b>
              </span>
            )}
          </p>

          {/* =============================================
              COUNT
          ============================================= */}

          <p
            className="
              text-[13px]
              text-[#777]
              mt-3
            "
            style={{
              fontFamily:
                "Montserrat, sans-serif",
            }}
          >
            {selectedCategory
              ? `Showing ${selectedResources.length} resources`
              : `Showing ${materials.length} categories`}
          </p>
        </div>
      </section>

      {/* ===================================================
          ERROR
      =================================================== */}

      {error && (
        <section
          className="
            max-w-[1650px]
            mx-auto
            px-6
            xl:px-10
            pt-10
          "
        >
          <div
            className="
              border
              border-red-200
              bg-red-50
              p-5
              text-red-700
            "
          >
            {error}
          </div>
        </section>
      )}

      {/* ===================================================
          CATEGORY GRID
      =================================================== */}

      {!selectedCategory && !error && (
        <section
          className="
            max-w-[1650px]
            mx-auto
            px-6
            xl:px-10
            py-15
          "
        >
          {materials.length === 0 ? (
            <div className="py-20 text-center">
              <p
                className="
                  text-[#777]
                  text-[15px]
                "
              >
                No resources are currently available.
              </p>
            </div>
          ) : (
            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
                gap-8
              "
            >
              {materials.map((item) => {
                /* =======================================
                   CATEGORY IMAGE
                ======================================= */

                const imageUrl =
                  item.thumbnail_url ||
                  item.banner_url ||
                  null;

                const sharpImageUrl = imageUrl
                  ? getOptimizedImageUrl(
                      imageUrl,
                      1600,
                      90
                    )
                  : null;

                /* =======================================
                   RESOURCE COUNT
                ======================================= */

                const resourceCount =
                  resourceCounts[String(item.id)] || 0;

                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() =>
                      handleCategoryClick(item)
                    }
                    className="
                      group
                      cursor-pointer
                      text-left
                      w-full
                    "
                  >
                    {/* =================================
                        IMAGE
                    ================================= */}

                    <div
                      className="
                        relative
                        aspect-[4/5]
                        overflow-hidden
                        bg-[#ececec]
                      "
                    >
                      {sharpImageUrl && (
                        <img
                          src={sharpImageUrl}
                          alt={item.name}
                          loading="lazy"
                          decoding="async"
                          draggable={false}
                          onError={(event) => {
                            event.currentTarget.style.display =
                              "none";

                            const fallback =
                              event.currentTarget.parentElement?.querySelector(
                                "[data-image-fallback]"
                              );

                            if (fallback) {
                              fallback.style.display =
                                "flex";
                            }
                          }}
                          className="
                            absolute
                            inset-0
                            w-full
                            h-full
                            object-cover
                            object-center
                            select-none
                            transition-transform
                            duration-700
                            ease-out
                            group-hover:scale-[1.025]
                          "
                        />
                      )}

                      {/* ===============================
                          IMAGE FALLBACK
                      =============================== */}

                      <div
                        data-image-fallback
                        style={{
                          display: sharpImageUrl
                            ? "none"
                            : "flex",
                        }}
                        className="
                          absolute
                          inset-0
                          items-center
                          justify-center
                          bg-gradient-to-br
                          from-neutral-100
                          to-neutral-300
                          text-[#555]
                          text-6xl
                          font-bold
                          tracking-wider
                          select-none
                        "
                      >
                        {getInitials(item.name)}
                      </div>
                    </div>

                    {/* =================================
                        CONTENT
                    ================================= */}

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-[#e5e5e5]
                        py-5
                      "
                    >
                      <div>
                        <h2
                          className="
                            text-[18px]
                            font-semibold
                            text-[#161412]
                          "
                          style={{
                            fontFamily:
                              "Montserrat, sans-serif",
                          }}
                        >
                          {item.name}
                        </h2>

                        <p
                          className="
                            text-[12px]
                            text-[#888]
                            uppercase
                            tracking-[2px]
                            mt-1
                          "
                        >
                          {resourceCount}{" "}
                          {resourceCount === 1
                            ? "Resource"
                            : "Resources"}{" "}
                          Available
                        </p>
                      </div>

                      <div
                        className="
                          text-[22px]
                          transition-transform
                          duration-300
                          group-hover:translate-x-2
                        "
                      >
                        →
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* ===================================================
          SELECTED CATEGORY RESOURCES
      =================================================== */}

      {selectedCategory && !error && (
        <section
          className="
            max-w-[1650px]
            mx-auto
            px-6
            xl:px-10
            py-12
          "
        >
          {/* =============================================
              BACK BUTTON
          ============================================= */}

          <button
            type="button"
            onClick={handleBack}
            className="
              flex
              items-center
              gap-2
              text-[13px]
              font-medium
              text-[#555]
              hover:text-[#c91f26]
              transition-colors
              mb-10
            "
          >
            <ArrowLeft size={18} />

            Back to All Resources
          </button>

          {/* =================================================
              RESOURCE LIST
          ================================================= */}

          {selectedResources.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-[#777]">
                No resources available for this category.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {selectedResources.map((resource) => {
                const isPdf =
                  resource.resource_type === "PDF";

                const fileUrl = getFileUrl(
                  resource.file_url
                );

                return (
                  <div
                    key={resource.id}
                    className="
                      border
                      border-[#e5e5e5]
                      bg-white
                      p-6
                      md:p-8
                      transition-all
                      duration-300
                      hover:border-[#bbb]
                      hover:shadow-sm
                    "
                  >
                    <div
                      className="
                        flex
                        flex-col
                        md:flex-row
                        md:items-center
                        md:justify-between
                        gap-6
                      "
                    >
                      {/* ===============================
                          RESOURCE DETAILS
                      =============================== */}

                      <div
                        className="
                          flex
                          gap-5
                          items-start
                        "
                      >
                        <div
                          className="
                            w-[55px]
                            h-[65px]
                            bg-[#f5f5f5]
                            flex
                            items-center
                            justify-center
                            shrink-0
                          "
                        >
                          <FileText
                            size={28}
                            strokeWidth={1.5}
                            className="text-[#c91f26]"
                          />
                        </div>

                        <div>
                          <h2
                            className="
                              text-[18px]
                              md:text-[20px]
                              font-semibold
                              text-[#161412]
                            "
                            style={{
                              fontFamily:
                                "Montserrat, sans-serif",
                            }}
                          >
                            {resource.title}
                          </h2>

                          {/* DESCRIPTION */}

                          {resource.description && (
                            <p
                              className="
                                text-[14px]
                                text-[#777]
                                mt-2
                                leading-relaxed
                                max-w-[800px]
                              "
                            >
                              {resource.description}
                            </p>
                          )}

                          {/* RESOURCE TYPE */}

                          <p
                            className="
                              text-[11px]
                              text-[#999]
                              uppercase
                              tracking-[1.5px]
                              mt-3
                            "
                          >
                            {isPdf
                              ? "PDF DOCUMENT"
                              : "RESOURCE ARTICLE"}
                          </p>
                        </div>
                      </div>

                      {/* ===============================
                          PDF ACTIONS
                      =============================== */}

                      {isPdf && fileUrl && (
                        <div
                          className="
                            flex
                            gap-3
                            shrink-0
                          "
                        >
                          {/* VIEW PDF */}

                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                              flex
                              items-center
                              gap-2
                              border
                              border-[#ddd]
                              px-5
                              py-3
                              text-[12px]
                              font-semibold
                              uppercase
                              tracking-[1px]
                              hover:border-[#161412]
                              transition-colors
                            "
                          >
                            <ExternalLink size={16} />
                            View
                          </a>

                          {/* DOWNLOAD PDF */}

                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                              flex
                              items-center
                              gap-2
                              bg-[#161412]
                              text-white
                              px-5
                              py-3
                              text-[12px]
                              font-semibold
                              uppercase
                              tracking-[1px]
                              hover:bg-[#c91f26]
                              transition-colors
                            "
                          >
                            <Download size={16} />
                            Download
                          </a>
                        </div>
                      )}
                    </div>

                    {/* ===============================
                        RICH TEXT CONTENT
                    =============================== */}

                    {!isPdf && resource.content && (
                      <div
                        className="
                          mt-6
                          pt-6
                          border-t
                          border-[#eee]
                          text-[14px]
                          text-[#555]
                          leading-relaxed
                          [&_p]:mb-4
                          [&_ul]:list-disc
                          [&_ol]:list-decimal
                          [&_ul]:pl-6
                          [&_ol]:pl-6
                          [&_a]:text-[#c91f26]
                        "
                        dangerouslySetInnerHTML={{
                          __html: resource.content,
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
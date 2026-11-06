

import { useEffect, useMemo, useState } from "react";

import axios from "axios";

import { Link, useSearchParams } from "react-router-dom";



import Loading from "../../../components/common/Loading";

import { getOptimizedImageUrl } from "../../../utils/Mediahelper";



import {

  ArrowLeft,

  ArrowRight,

  Download,

  ExternalLink,

  FileText,

} from "lucide-react";



/* =========================================================

   CONFIGURATION

========================================================= */



const RAW_API_URL = (

  import.meta.env.VITE_API_URL || ""

).replace(/\/+$/, "");



const API_URL = RAW_API_URL.endsWith("/api")

  ? RAW_API_URL

  : `${RAW_API_URL}/api`;



const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");



const FILTERS = [

  {

    id: "care",

    label: "Care & Maintenance",

  },

  {

    id: "warranty",

    label: "Warranty",

  },

  {

    id: "faq",

    label: "FAQ",

  },

];



/* =========================================================

   HELPERS

========================================================= */



const getInitials = (name = "") =>

  String(name)

    .split(" ")

    .filter(Boolean)

    .map((word) => word.charAt(0))

    .join("")

    .substring(0, 2)

    .toUpperCase();



const getFileUrl = (url) => {

  if (!url || typeof url !== "string") return "";



  if (/^https?:\/\//i.test(url)) {

    return url;

  }



  if (url.startsWith("//")) {

    return `https:${url}`;

  }



  if (/^(javascript|data|blob):/i.test(url)) {

    return "";

  }



  return `${API_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;

};



const extractArray = (response) => {

  const candidates = [

    response,

    response?.data,

    response?.data?.data,

    response?.data?.resources,

    response?.data?.data?.resources,

    response?.resources,

    response?.categories,

    response?.data?.categories,

  ];



  return candidates.find(Array.isArray) || [];

};



const isActiveCategory = (category) =>

  category.is_active === true ||

  category.is_active === 1 ||

  category.is_active === "true";



const isParentCategory = (category) =>

  category.parent_id === null ||

  category.parent_id === undefined;



/* =========================================================

   RESOURCE CLASSIFICATION



   IMPORTANT:

   resource_type is PDF / TEXT, not the filter type.



   Match the actual classification field returned by

   your category-resources/public API.



   If the API does not return classification metadata,

   the backend must be updated to provide it.

========================================================= */



const normalizeFilterType = (value) => {

  if (!value) return null;



  const normalized = String(value)

    .trim()

    .toLowerCase()

    .replace(/[_-]+/g, " ")

    .replace(/\s+/g, " ");



  if (

    normalized === "care" ||

    normalized === "care maintenance" ||

    normalized === "care and maintenance" ||

    normalized === "care & maintenance" ||

    normalized === "maintenance"

  ) {

    return "care";

  }



  if (

    normalized === "warranty" ||

    normalized === "warranties" ||

    normalized === "warrenty"

  ) {

    return "warranty";

  }



  if (

    normalized === "faq" ||

    normalized === "faqs" ||

    normalized === "frequently asked questions"

  ) {

    return "faq";

  }



  return null;

};



const getResourceFilterType = (resource) => {

  const candidates = [

    resource.resource_category,

    resource.resource_category_name,

    resource.document_category,

    resource.document_type,

    resource.resource_group,

    resource.resource_section,

    resource.section,

    resource.category_type,

    resource.type_name,

    resource.filter_type,

    resource.resource_subtype,

  ];



  for (const candidate of candidates) {

    const value =

      candidate && typeof candidate === "object"

        ? candidate.name || candidate.slug || candidate.code

        : candidate;



    const matched = normalizeFilterType(value);



    if (matched) return matched;

  }



  return null;

};



/* =========================================================

   CATEGORY SORTING

========================================================= */



const sortCategories = (a, b) => {

  if (a.slug === "ultra-quartz") return -1;

  if (b.slug === "ultra-quartz") return 1;



  if (a.slug === "atlas-plan") return 1;

  if (b.slug === "atlas-plan") return -1;



  return a.name.localeCompare(b.name, undefined, {

    sensitivity: "base",

  });

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



  // The selected stone category is stored in the URL.



  // URL query parameter is the source of truth for QR-code filters.
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedFilter = searchParams.get("type")?.toLowerCase();
  const activeFilter = FILTERS.some((filter) => filter.id === requestedFilter)
    ? requestedFilter
    : null;

  const setActiveFilter = (nextValue) => {
    const nextFilter = typeof nextValue === "function"
      ? nextValue(activeFilter)
      : nextValue;

    setSearchParams((previous) => {
      const updated = new URLSearchParams(previous);
      if (nextFilter) updated.set("type", nextFilter);
      else updated.delete("type");
      updated.delete("category");
      return updated;
    });
  };



  /* =======================================================

     FETCH CATEGORIES + RESOURCES

  ======================================================= */



  useEffect(() => {

    const controller = new AbortController();



    const fetchData = async () => {

      try {

        setLoading(true);

        setError("");



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



        const categoriesData = extractArray(

          categoriesResponse.data

        );



        const resourcesData = extractArray(

          resourcesResponse.data

        );



        // Public endpoint already filters inactive resources.

        const activeResources = resourcesData;



        const activeCategoryIds = new Set(

          activeResources.map((item) =>

            String(item.category_id)

          )

        );



        const filteredCategories = categoriesData

          .filter(

            (item) =>

              isActiveCategory(item) &&

              isParentCategory(item) &&

              activeCategoryIds.has(String(item.id))

          )

          .sort(sortCategories);



        if (!controller.signal.aborted) {

          setMaterials(filteredCategories);

          setResources(activeResources);

        }

      } catch (err) {

        if (

          err.code !== "ERR_CANCELED" &&

          err.name !== "CanceledError" &&

          !controller.signal.aborted

        ) {

          console.error("Resources page error:", err);



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



    return () => controller.abort();

  }, []);



  /* =======================================================

     FILTER RESOURCES BY SELECTED DOCUMENT TYPE

  ======================================================= */



  const filteredResources = useMemo(() => {

    if (!activeFilter) {

      return resources;

    }



    return resources.filter(

      (resource) =>

        getResourceFilterType(resource) === activeFilter

    );

  }, [resources, activeFilter]);



  /* =======================================================

     FILTER CATEGORIES



     Only categories with matching documents are shown.

  ======================================================= */



  const visibleMaterials = useMemo(() => {

    const categoryIds = new Set(

      filteredResources.map((resource) =>

        String(resource.category_id)

      )

    );



    return materials.filter((material) =>

      categoryIds.has(String(material.id))

    );

  }, [materials, filteredResources]);



  // Restore the selected stone category from the URL.
  const categorySlug = searchParams.get("category");
  const selectedCategory = categorySlug
    ? visibleMaterials.find((item) => item.slug === categorySlug) || null
    : null;

  /* =======================================================

     RESOURCE COUNTS BY CATEGORY

  ======================================================= */



  const resourceCounts = useMemo(() => {

    const counts = {};



    filteredResources.forEach((resource) => {

      const categoryId = String(resource.category_id);



      counts[categoryId] =

        (counts[categoryId] || 0) + 1;

    });



    return counts;

  }, [filteredResources]);



  /* =======================================================

     SELECTED CATEGORY RESOURCES



     Applies both category and document-type filters.

  ======================================================= */



  const selectedResources = useMemo(() => {

    if (!selectedCategory) return [];



    return filteredResources

      .filter(

        (resource) =>

          String(resource.category_id) ===

          String(selectedCategory.id)

      )

      .sort(

        (a, b) =>

          Number(a.display_order || 0) -

          Number(b.display_order || 0)

      );

  }, [filteredResources, selectedCategory]);



  /* =======================================================

     ACTIVE FILTER LABEL

  ======================================================= */



  const activeFilterLabel = useMemo(() => {

    return (

      FILTERS.find((filter) => filter.id === activeFilter)

        ?.label || null

    );

  }, [activeFilter]);



  /* =======================================================

     FILTER BUTTON CLICK

  ======================================================= */



  const handleFilterClick = (filterId) => {

    setActiveFilter((current) =>

      current === filterId ? null : filterId

    );



    // Changing the filter also clears the selected category URL.

  };



  /* =======================================================

     CATEGORY SELECTION

  ======================================================= */



  const handleCategoryClick = (category) => {

    setSearchParams((previous) => {
      const updated = new URLSearchParams(previous);
      updated.set("category", category.slug);
      return updated;
    });



    window.scrollTo({

      top: 0,

      behavior: "smooth",

    });

  };



  /* =======================================================

     BACK TO CATEGORIES

  ======================================================= */



  const handleBack = () => {

    setSearchParams((previous) => {
      const updated = new URLSearchParams(previous);
      updated.delete("category");
      return updated;
    });



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

          PAGE HEADING + BREADCRUMB + FILTERS

      =================================================== */}



      <section>

        <div className="max-w-[1650px] mx-auto px-6 xl:px-10">

          <h1

            className="

              text-[34px]

              md:text-[42px]

              font-semibold

              text-[#161412]

              leading-none

            "

            style={{

              fontFamily: "Montserrat, sans-serif",

            }}

          >

            Resources

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



          {/* ===============================================

              BREADCRUMB

          =============================================== */}



          <nav

            aria-label="Breadcrumb"

            className="

              text-[13px]

              text-[#777]

              flex

              flex-wrap

              items-center

              gap-x-1

              gap-y-1

            "

            style={{

              fontFamily: "Montserrat, sans-serif",

            }}

          >

            <Link

              to="/"

              className="hover:text-[#161412] duration-300"

            >

              Home

            </Link>



            <span>/</span>



            <Link

              to="/resources"



              className="hover:text-[#161412] duration-300"

            >

              Resource Center

            </Link>



            <span>/</span>



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



                {activeFilterLabel && (

                  <>

                    <span>/</span>



                    <button

                      type="button"

                      onClick={handleBack}

                      className="

                        hover:text-[#161412]

                        duration-300

                      "

                    >

                      {activeFilterLabel}

                    </button>

                  </>

                )}



                <span>/</span>



                <span className="text-[#161412] font-semibold">

                  {selectedCategory.name}

                </span>

              </>

            ) : activeFilterLabel ? (

              <>

                <button

                  type="button"

                  onClick={() => setActiveFilter(null)}

                  className="hover:text-[#161412] duration-300"

                >

                  Resources

                </button>



                <span>/</span>



                <span className="text-[#161412] font-semibold">

                  {activeFilterLabel}

                </span>

              </>

            ) : (

              <span className="text-[#161412] font-semibold">

                Resources

              </span>

            )}

          </nav>



          {/* ===============================================

              FILTER BUTTONS



              Always visible on both grid and detail views.

          =============================================== */}



          <div

            className="

              flex

              flex-wrap

              items-center

              gap-3

              mt-5

            "

          >

            {FILTERS.map((filter) => {

              const isSelected =

                activeFilter === filter.id;



              return (

                <button

                  key={filter.id}

                  type="button"

                  onClick={() =>

                    handleFilterClick(filter.id)

                  }

                  aria-pressed={isSelected}

                  className={`

                    inline-flex

                    items-center

                    justify-between

                    gap-4

                    min-h-[36px]

                    px-4

                    py-2

                    border

                    text-[12px]

                    font-medium

                    transition-all

                    duration-300

                    cursor-pointer

                    ${

                      isSelected

                        ? "bg-[#c91f26] border-[#c91f26] text-white"

                        : "bg-white border-[#aaa] text-[#161412] hover:border-[#c91f26] hover:text-[#c91f26]"

                    }

                  `}

                  style={{

                    fontFamily: "Montserrat, sans-serif",

                  }}

                >

                  <span>{filter.label}</span>



                  <ArrowRight

                    size={14}

                    strokeWidth={1.5}

                    className={

                      isSelected

                        ? "text-white"

                        : "text-[#c91f26]"

                    }

                  />

                </button>

              );

            })}

          </div>

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

            pt-10

            pb-16

          "

        >

          {visibleMaterials.length === 0 ? (

            <div className="py-20 text-center">

              <FileText

                size={38}

                strokeWidth={1}

                className="mx-auto text-[#aaa] mb-5"

              />



              <p

                className="

                  text-[#161412]

                  text-[17px]

                  font-semibold

                "

              >

                No Resources Available

              </p>



              <p

                className="

                  text-[#777]

                  text-[14px]

                  mt-2

                "

              >

                {activeFilterLabel

                  ? `No ${activeFilterLabel} documents are currently available.`

                  : "No resources are currently available."}

              </p>



              {activeFilter && (

                <button

                  type="button"

                  onClick={() => setActiveFilter(null)}

                  className="

                    mt-6

                    px-6

                    py-3

                    bg-[#161412]

                    text-white

                    text-[12px]

                    uppercase

                    tracking-[1px]

                    hover:bg-[#c91f26]

                    transition-colors

                  "

                >

                  View All Resources

                </button>

              )}

            </div>

          ) : (

            <div

              className="

                grid

                grid-cols-1

                sm:grid-cols-2

                lg:grid-cols-3

                xl:grid-cols-4

                gap-x-8

                gap-y-8

              "

            >

              {visibleMaterials.map((item) => {

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

                   FILTERED RESOURCE COUNT

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



                      {/* IMAGE FALLBACK */}



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

                        CATEGORY CONTENT

                    ================================= */}



                    <div

                      className="

                        flex

                        items-center

                        justify-between

                        gap-3

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



                      <ArrowRight

                        size={22}

                        strokeWidth={1.5}

                        className="

                          shrink-0

                          text-[#161412]

                          transition-transform

                          duration-300

                          group-hover:translate-x-2

                        "

                      />

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

            pt-10

            pb-16

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



            Back to Resources

          </button>



          {/* =============================================

              CATEGORY HEADING

          ============================================= */}



          <div className="mb-8">

            <h2

              className="

                text-[25px]

                md:text-[30px]

                font-semibold

                text-[#161412]

              "

              style={{

                fontFamily: "Montserrat, sans-serif",

              }}

            >

              {selectedCategory.name}

            </h2>



            <p

              className="

                text-[12px]

                text-[#888]

                uppercase

                tracking-[1.5px]

                mt-2

              "

            >

              {selectedResources.length}{" "}

              {selectedResources.length === 1

                ? "Resource"

                : "Resources"}{" "}

              Available

              {activeFilterLabel

                ? ` · ${activeFilterLabel}`

                : ""}

            </p>

          </div>



          {/* =============================================

              RESOURCE LIST

          ============================================= */}



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

                  String(resource.resource_type).toUpperCase() ===

                  "PDF";



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

                          min-w-0

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



                        <div className="min-w-0">

                          <h3

                            className="

                              text-[18px]

                              md:text-[20px]

                              font-semibold

                              text-[#161412]

                              break-words

                            "

                            style={{

                              fontFamily:

                                "Montserrat, sans-serif",

                            }}

                          >

                            {resource.title}

                          </h3>



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

                            flex-wrap

                            gap-3

                            shrink-0

                          "

                        >

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



                          <a

                            href={fileUrl}

                            download

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



                        Content must be sanitized by

                        the backend before rendering.

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

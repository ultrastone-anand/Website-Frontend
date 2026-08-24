import axios from "axios";

import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";

import { createPortal } from "react-dom";

import {
  useParams,
  useNavigate,
  Link,
} from "react-router-dom";

import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  X,
} from "lucide-react";

import Icons from "../../../assets/icons";
import SEO from "../../../components/common/SEO";

import {
  normalizeProductSeo,
} from "../../../utils/seoNormalizers";

import {
  getOptimizedImageUrl,
} from "../../../utils/Mediahelper";

/* =========================================================
   HELPERS
========================================================= */

const formatStoneSizes = (
  sizes = [],
) => {
  if (
    !Array.isArray(sizes)
  ) {
    return [];
  }

  return sizes.flatMap(
    (size) => {
      if (!size) {
        return [];
      }

      const normalized =
        String(size)
          .trim()
          .replace(
            /×/g,
            "X",
          )
          .replace(
            /x/g,
            "X",
          );

      /*
       * Example:
       *
       * "112 X 75 115 X 78"
       *
       * becomes:
       *
       * [
       *   "112 X 75",
       *   "115 X 78"
       * ]
       */
      const matches =
        normalized.match(
          /\d+(?:\.\d+)?\s*X\s*\d+(?:\.\d+)?/g,
        );

      if (
        matches?.length
      ) {
        return matches.map(
          (item) =>
            item
              .replace(
                /\s*X\s*/g,
                " X ",
              )
              .trim(),
        );
      }

      return [
        normalized,
      ];
    },
  );
};

/* =========================================================
   LAZY COMPONENTS
========================================================= */

const Social = lazy(
  () =>
    import(
      "../../../components/common/Socials"
    ),
);

const ModelViewer = lazy(
  () =>
    import(
      "../../../components/common/ModelViewer"
    ),
);

/* =========================================================
   PRODUCT DETAILS
========================================================= */

const ProductDetails = () => {
  const {
    categorySlug,
    productSlug,
  } = useParams();

  const navigate =
    useNavigate();

  /* =======================================================
     STATE
  ======================================================= */

  const [
    product,
    setProduct,
  ] = useState(null);

  const [
    activeImage,
    setActiveImage,
  ] = useState(0);

  const [
    openFaq,
    setOpenFaq,
  ] = useState(1);

  const [
    expanded,
    setExpanded,
  ] = useState(false);

  const [
    inspirationImages,
    setInspirationImages,
  ] = useState([]);

  const [
    relatedProducts,
    setRelatedProducts,
  ] = useState([]);

  const [
    openPreview,
    setOpenPreview,
  ] = useState(false);

  const [
    shouldLoadModel,
    setShouldLoadModel,
  ] = useState(false);

  const [
    isGeneratingDatasheet,
    setIsGeneratingDatasheet,
  ] = useState(false);

  const [
    modelSectionElement,
    setModelSectionElement,
  ] = useState(null);

  const [
  openSampleDialog,
  setOpenSampleDialog,
] = useState(false);

const [
  sampleForm,
  setSampleForm,
] = useState({
  firstName: "",
  lastName: "",
  companyName: "",
  streetAddress: "",
  city: "",
  county: "",
  state: "",
  zipCode: "",
  email: "",
  phone: "",
  remarks: "",
  quantity: 1,
});

const [
  isSubmittingSample,
  setIsSubmittingSample,
] = useState(false);

  /* =======================================================
     REFS
  ======================================================= */

  const lensRef =
    useRef(null);

  const relatedScrollRef =
    useRef(null);

  /* =======================================================
     DESCRIPTION
  ======================================================= */

  const description =
    product?.long_description ||
    product?.small_description ||
    "";

  const shouldTruncate =
    description.length >
    300;

  /* =======================================================
     FORMATTED SIZES
  ======================================================= */

  const formattedSizes =
    formatStoneSizes(
      product?.average_sizes_inches,
    );

  /* =========================================================
     LOAD PRODUCT PAGE
  ========================================================= */

  useEffect(() => {
    const controller =
      new AbortController();

    const API_URL =
      import.meta.env
        .VITE_API_URL;

    const loadPageData =
      async () => {
        try {
          const [
            productResponse,
            inspirationResponse,
          ] =
            await Promise.allSettled(
              [
                axios.get(
                  `${API_URL}/stones/productdetail/${productSlug}`,
                  {
                    signal:
                      controller.signal,
                  },
                ),

                axios.get(
                  `${API_URL}/inspiration-gallery/images/product/${productSlug}`,
                  {
                    signal:
                      controller.signal,
                  },
                ),
              ],
            );

          /* ===============================================
             PRODUCT
          =============================================== */

          if (
            productResponse.status ===
              "fulfilled" &&
            productResponse.value
              .data?.success
          ) {
            const currentProduct =
              productResponse
                .value.data
                .product;

            console.log(
              "✅ CURRENT PRODUCT:",
              currentProduct,
            );

            setProduct(
              currentProduct,
            );

            const currentCategorySlug =
              currentProduct
                ?.stone_categories
                ?.slug;

            console.log(
              "✅ CATEGORY SLUG:",
              currentCategorySlug,
            );

            /* =============================================
               RELATED PRODUCTS
            ============================================= */

            if (
              currentCategorySlug
            ) {
              try {
                const CATEGORY_PRODUCTS_URL =
                  `${API_URL}/stones/${currentCategorySlug}`;

                console.log(
                  "🔵 RELATED PRODUCTS REQUEST:",
                  CATEGORY_PRODUCTS_URL,
                );

                const categoryResponse =
                  await axios.get(
                    CATEGORY_PRODUCTS_URL,
                    {
                      signal:
                        controller.signal,
                    },
                  );

                console.log(
                  "🔥 CATEGORY RESPONSE:",
                  categoryResponse.data,
                );

                const categoryProducts =
                  categoryResponse
                    .data?.data
                    ?.products ||
                  categoryResponse
                    .data
                    ?.products ||
                  categoryResponse
                    .data?.data
                    ?.data ||
                  categoryResponse
                    .data?.data ||
                  [];

                console.log(
                  "🔥 CATEGORY PRODUCTS:",
                  categoryProducts,
                );

                if (
                  Array.isArray(
                    categoryProducts,
                  )
                ) {
                  const related =
                    categoryProducts
                      .filter(
                        (item) =>
                          Number(item.id,) !== Number(currentProduct.id, ) &&
                          item.slug !==currentProduct.slug &&
                          item.is_active === true &&
                          item.is_published === true
                      )
                      .slice(
                        0,
                        12,
                      );

                  console.log(
                    "✅ FINAL RELATED PRODUCTS:",
                    related,
                  );

                  setRelatedProducts(
                    related,
                  );
                } else {
                  console.error(
                    "❌ CATEGORY PRODUCTS IS NOT AN ARRAY:",
                    categoryProducts,
                  );

                  setRelatedProducts(
                    [],
                  );
                }
              } catch (
                relatedError
              ) {
                if (
                  relatedError.code !==
                    "ERR_CANCELED" &&
                  relatedError.name !==
                    "CanceledError"
                ) {
                  console.error(
                    "❌ RELATED PRODUCTS REQUEST FAILED",
                  );

                  console.error(
                    "URL:",
                    relatedError
                      .config?.url,
                  );

                  console.error(
                    "STATUS:",
                    relatedError
                      .response
                      ?.status,
                  );

                  console.error(
                    "RESPONSE:",
                    relatedError
                      .response
                      ?.data,
                  );
                }

                setRelatedProducts(
                  [],
                );
              }
            }
          }

          /* ===============================================
             INSPIRATION
          =============================================== */

          if (
            inspirationResponse.status ===
            "fulfilled"
          ) {
            const galleryImages =
              inspirationResponse
                .value.data
                ?.data?.images ||
              [];

            setInspirationImages(
              galleryImages.map(
                (image) => ({
                  id: `inspiration-${image.id}`,

                  media_url:
                    image.image_url,

                  media_type:
                    "APPLICATION_IMAGE",

                  media_alt:
                    image.image_alt ||
                    image.title ||
                    productSlug,

                  title:
                    image.title,

                  category:
                    image.inspiration_gallery_categories,
                }),
              ),
            );
          }
        } catch (error) {
          if (
            error.code !==
              "ERR_CANCELED" &&
            error.name !==
              "CanceledError"
          ) {
            console.error(
              "❌ FAILED TO LOAD PRODUCT PAGE:",
              error,
            );
          }
        }
      };

    setProduct(null);

    setInspirationImages(
      [],
    );

    setRelatedProducts(
      [],
    );

    setActiveImage(0);

    setOpenPreview(
      false,
    );

    setExpanded(
      false,
    );

    setShouldLoadModel(
      false,
    );

    setIsGeneratingDatasheet(
      false,
    );

    loadPageData();

    return () => {
      controller.abort();
    };
  }, [productSlug]);

  /* =========================================================
     MODEL VIEWER
  ========================================================= */

  useEffect(() => {
    if (
      !product ||
      !modelSectionElement
    ) {
      return undefined;
    }

    if (
      !(
        "IntersectionObserver" in
        window
      )
    ) {
      setShouldLoadModel(
        true,
      );

      return undefined;
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (
            entry.isIntersecting
          ) {
            setShouldLoadModel(
              true,
            );

            observer.disconnect();
          }
        },
        {
          root: null,

          rootMargin:
            "600px 0px",

          threshold: 0,
        },
      );

    observer.observe(
      modelSectionElement,
    );

    return () => {
      observer.disconnect();
    };
  }, [
    product,
    modelSectionElement,
  ]);

  /* =========================================================
     FULL SCREEN PREVIEW
  ========================================================= */

  useEffect(() => {
    if (!openPreview) {
      return undefined;
    }

    const previousBodyOverflow =
      document.body.style
        .overflow;

    const previousHtmlOverflow =
      document.documentElement
        .style.overflow;

    document.body.style.overflow =
      "hidden";

    document.documentElement.style.overflow =
      "hidden";

    const handleEsc = (
      event,
    ) => {
      if (
        event.key ===
        "Escape"
      ) {
        setOpenPreview(
          false,
        );
      }
    };

    window.addEventListener(
      "keydown",
      handleEsc,
    );

    return () => {
      document.body.style.overflow =
        previousBodyOverflow;

      document.documentElement.style.overflow =
        previousHtmlOverflow;

      window.removeEventListener(
        "keydown",
        handleEsc,
      );
    };
  }, [openPreview]);


  /* =========================================================
   ORDER SAMPLE DIALOG - ESC + BODY SCROLL
========================================================= */

useEffect(() => {
  if (!openSampleDialog) {
    return undefined;
  }

  const previousBodyOverflow =
    document.body.style.overflow;

  const previousHtmlOverflow =
    document.documentElement.style.overflow;

  document.body.style.overflow =
    "hidden";

  document.documentElement.style.overflow =
    "hidden";

  const handleEsc = (event) => {
    if (event.key === "Escape") {
      setOpenSampleDialog(false);
    }
  };

  window.addEventListener(
    "keydown",
    handleEsc,
  );

  return () => {
    document.body.style.overflow =
      previousBodyOverflow;

    document.documentElement.style.overflow =
      previousHtmlOverflow;

    window.removeEventListener(
      "keydown",
      handleEsc,
    );
  };
}, [openSampleDialog]);


  /* =========================================================
     PRELOAD DATASHEET
  ========================================================= */

  useEffect(() => {
    if (!product) {
      return undefined;
    }

    let cancelled =
      false;

    const preloadDatasheet =
      async () => {
        try {
          const {
            preloadDatasheetHero,
          } = await import(
            "../../../utils/generateDatasheet"
          );

          if (
            cancelled
          ) {
            return;
          }

          await preloadDatasheetHero(
            product,
          );
        } catch (error) {
          if (
            !cancelled
          ) {
            console.warn(
              "Datasheet preload failed:",
              error,
            );
          }
        }
      };

    const timeoutId =
      window.setTimeout(
        () => {
          preloadDatasheet();
        },
        100,
      );

    return () => {
      cancelled =
        true;

      window.clearTimeout(
        timeoutId,
      );
    };
  }, [product]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (!product) {
    return (
      <ProductDetailsSkeleton />
    );
  }

  /* =========================================================
     MEDIA
  ========================================================= */

  const closeupImages =
    product.media?.filter(
      (item) =>
        item.media_type ===
        "CLOSEUP_IMAGE",
    ) || [];

  const slabImages =
    product.media?.filter(
      (item) =>
        item.media_type ===
        "SLAB_IMAGE",
    ) || [];

  const productApplicationImages =
    product.media?.filter(
      (item) =>
        item.media_type ===
        "APPLICATION_IMAGE",
    ) || [];

  const applicationImages = [
    ...productApplicationImages,
    ...inspirationImages,
  ];

  const bookmatchslipmatch =
    product.media?.filter(
      (item) =>
        item.media_type ===
        "BOOKMATCH_SLIPMATCH",
    ) || [];

  const featuredvideo =
    product.media?.filter(
      (item) =>
        item.media_type ===
        "FEATURED_VIDEO",
    ) || [];

  const images =
    closeupImages.length >
    0
      ? closeupImages
      : [
          {
            media_url:
              "https://placehold.co/1200x800",
          },
        ];

  const heroMedia = [
    ...slabImages,
    ...closeupImages,
    ...applicationImages,
    ...bookmatchslipmatch,
    ...featuredvideo,
  ];

  const heroImages =
    heroMedia.length >
    0
      ? heroMedia
      : [
          {
            media_url:
              "https://placehold.co/1200x800",

            media_type:
              "IMAGE",
          },
        ];

  const safeActiveIndex =
    Math.min(
      activeImage,
      heroImages.length -
        1,
    );

  const activeMedia =
    heroImages[
      safeActiveIndex
    ];

  /* =========================================================
     APPLICATIONS
  ========================================================= */

  const applicationItems = [
    {
      title:
        "Color Enhancing",

      value:
        product.color_enhancing,

      icon:
        Icons.colourenhancing,
    },

    {
      title:
        "Shower Wall",

      value:
        product.shower_wall,

      icon:
        Icons.showerwall,
    },

    {
      title:
        "Fireplace",

      value:
        product.interior_wall,

      icon:
        Icons.fireplace,
    },

    {
      title:
        "Countertops / Vanities",

      value:
        product.countertops_vanities,

      icon:
        Icons.countertop,
    },

    {
      title:
        "Exterior Floor",

      value:
        product.exterior_floor,

      icon:
        Icons.exetiorfloor,
    },

    {
      title:
        "Pool / Fountain",

      value:
        product.pool_fountain,

      icon:
        Icons.poolfountain,
    },

    {
      title:
        "Interior Floor",

      value:
        product.interior_floor,

      icon:
        Icons.interiorfloor,
    },

    {
      title:
        "Exterior Wall",

      value:
        product.exterior_wall,

      icon:
        Icons.exteriorwall,
    },

    {
      title:
        "Interior Wall",

      value:
        product.interior_wall,

      icon:
        Icons.interiorwall,
    },

    {
      title:
        "Shower Floor",

      value:
        product.shower_floor,

      icon:
        Icons.showerfloor,
    },

    {
      title:
        "Furniture Top",

      value:
        product.furniture_top,

      icon:
        Icons.furnituretop,
    },

    {
      title:
        "Translucent",

      value:
        product.translucent,

      icon:
        Icons.translucent,
    },
  ];

  /* =========================================================
     PERFORMANCE
  ========================================================= */

  const performanceItems = [
    {
      title:
        "Abrasion Resistance",

      value:
        product.abrasion_resistance,
    },

    {
      title:
        "Stain Resistance",

      value:
        product.stain_resistance,
    },

    {
      title:
        "Etching Resistance",

      value:
        product.etching_resistance,
    },

    {
      title:
        "Heat Resistance",

      value:
        product.heat_resistance,
    },

    {
      title:
        "UV Resistance",

      value:
        product.uv_resistance,
    },

    {
      title:
        "Color Range",

      value:
        product.color_range,
    },

    {
      title:
        "Movement Index",

      value:
        product.movement_index,
    },
  ];

  /* =========================================================
     DATASHEET
  ========================================================= */

  const handleDownloadDatasheet =
    async () => {
      if (
        isGeneratingDatasheet
      ) {
        return;
      }

      try {
        setIsGeneratingDatasheet(
          true,
        );

        const {
          generateDatasheet,
        } = await import(
          "../../../utils/generateDatasheet"
        );

        await generateDatasheet({
          product,
        });
      } catch (error) {
        console.error(
          "Failed to generate datasheet:",
          error,
        );
      } finally {
        setIsGeneratingDatasheet(
          false,
        );
      }
    };

  /* =========================================================
     SILICA
  ========================================================= */

  const silicaWarning =
    product.silica_warning ||
    product
      .stone_categories
      ?.silica_warning;

  const silicaMessage =
    product.silica_warning_message ||
    product
      .stone_categories
      ?.silica_warning_message;

  const silicaPdf =
    product.silica_datasheet_url ||
    product
      .stone_categories
      ?.silica_datasheet_url;

  const handleDownloadSafetysheet =
    () => {
      if (!silicaPdf) {
        return;
      }

      const isAbsoluteUrl =
        /^https?:\/\//i.test(
          silicaPdf,
        );

      const apiBaseUrl =
        import.meta.env
          .VITE_API_URL
          .replace(
            /\/api\/?$/,
            "",
          )
          .replace(
            /\/+$/,
            "",
          );

      const normalizedPdfPath =
        String(
          silicaPdf,
        ).startsWith("/")
          ? silicaPdf
          : `/${silicaPdf}`;

      const fileUrl =
        isAbsoluteUrl
          ? silicaPdf
          : `${apiBaseUrl}${normalizedPdfPath}`;

      const fileName =
        decodeURIComponent(
          fileUrl
            .split("?")[0]
            .split("#")[0]
            .split("/")
            .pop(),
        ) ||
        "safety-datasheet.pdf";

      const link =
        document.createElement(
          "a",
        );

      link.href =
        fileUrl;

      link.target =
        "_blank";

      link.rel =
        "noopener noreferrer";

      link.download =
        fileName;

      document.body.appendChild(
        link,
      );

      link.click();

      document.body.removeChild(
        link,
      );
    };

  /* =========================================================
     VARIATION
  ========================================================= */

  const variationPositions = {
    V1: "7.5%",
    V2: "36%",
    V3: "64.5%",
    V4: "92.5%",
  };

  const activeVariation =
    product?.variation_level ||
    "V1";

  /* =========================================================
     CLOSE-UP ZOOM
  ========================================================= */

  const zoomImageUrl =
    getOptimizedImageUrl(
      images[0]?.media_url,
      3200,
      92,
    );

  const handleZoomMove =
    (event) => {
      const lens =
        lensRef.current;

      if (!lens) {
        return;
      }

      const rect =
        event.currentTarget.getBoundingClientRect();

      const x =
        event.clientX -
        rect.left;

      const y =
        event.clientY -
        rect.top;

      const xPercent =
        Math.max(
          0,
          Math.min(
            100,
            (x /
              rect.width) *
              100,
          ),
        );

      const yPercent =
        Math.max(
          0,
          Math.min(
            100,
            (y /
              rect.height) *
              100,
          ),
        );

      lens.style.opacity =
        "1";

      lens.style.transform =
        `translate3d(${x - 75}px, ${y - 75}px, 0)`;

      lens.style.backgroundImage =
        `url("${zoomImageUrl}")`;

      lens.style.backgroundPosition =
        `${xPercent}% ${yPercent}%`;

      lens.style.backgroundSize =
        "1000%";
    };

  const handleZoomLeave =
    () => {
      if (
        lensRef.current
      ) {
        lensRef.current.style.opacity =
          "0";
      }
    };

  /* =========================================================
     HERO CONTROLS
  ========================================================= */

  const showPreviousMedia =
    () => {
      setActiveImage(
        (currentIndex) =>
          currentIndex ===
          0
            ? heroImages.length -
              1
            : currentIndex -
              1,
      );
    };

  const showNextMedia =
    () => {
      setActiveImage(
        (currentIndex) =>
          currentIndex ===
          heroImages.length -
            1
            ? 0
            : currentIndex +
              1,
      );
    };

  /* =========================================================
     RELATED PRODUCTS SCROLL
  ========================================================= */

  const scrollRelatedLeft =
    () => {
      relatedScrollRef.current?.scrollBy(
        {
          left: -700,

          behavior:
            "smooth",
        },
      );
    };

  const scrollRelatedRight =
    () => {
      relatedScrollRef.current?.scrollBy(
        {
          left: 700,

          behavior:
            "smooth",
        },
      );
    };

/* =========================================================
   ORDER SAMPLE
========================================================= */

const handleSampleChange = (
  event,
) => {
  const {
    name,
    value,
  } = event.target;

  setSampleForm(
    (previous) => ({
      ...previous,

      [name]:
        name === "quantity"
          ? Math.max(
              1,
              Number(value),
            )
          : value,
    }),
  );
};

const handleSampleSubmit =
  async (event) => {
    event.preventDefault();

    if (
      !sampleForm.firstName.trim() ||
      !sampleForm.lastName.trim() ||
      !sampleForm.streetAddress.trim() ||
      !sampleForm.city.trim() ||
      !sampleForm.state.trim() ||
      !sampleForm.zipCode.trim() ||
      !sampleForm.email.trim() ||
      !sampleForm.phone.trim()
    ) {
      alert(
        "Please fill all required fields.",
      );

      return;
    }

    try {
      setIsSubmittingSample(
        true,
      );

      const API_URL =
        import.meta.env
          .VITE_API_URL;

      const payload = {
        product_id:
          product.id,

        product_name:
          product.name,

        category_name:
          product
            ?.stone_categories
            ?.name || "",

        first_name:
          sampleForm.firstName.trim(),

        last_name:
          sampleForm.lastName.trim(),

        company_name:
          sampleForm.companyName.trim(),

        street_address:
          sampleForm.streetAddress.trim(),

        city:
          sampleForm.city.trim(),

        county:
          sampleForm.county.trim(),

        state:
          sampleForm.state.trim(),

        zip_code:
          sampleForm.zipCode.trim(),

        email:
          sampleForm.email.trim(),

        phone:
          sampleForm.phone.trim(),

        quantity:
          sampleForm.quantity,

        remarks:
          sampleForm.remarks.trim(),
      };

      console.log(
        "📦 SAMPLE REQUEST PAYLOAD:",
        payload,
      );

      console.log(
        "📡 SAMPLE REQUEST URL:",
        `${API_URL}/sample-requests`,
      );

      const response =
        await axios.post(
          `${API_URL}/sample-requests`,
          payload,
          {
            headers: {
              "Content-Type":
                "application/json",
            },
          },
        );

      console.log(
        "✅ SAMPLE REQUEST RESPONSE:",
        response.data,
      );

      if (
        !response.data?.success
      ) {
        throw new Error(
          response.data?.message ||
            "Failed to submit sample request.",
        );
      }

      alert(
        "Sample request submitted successfully.",
      );

      setOpenSampleDialog(
        false,
      );

      setSampleForm({
        firstName: "",
        lastName: "",
        companyName: "",
        streetAddress: "",
        city: "",
        county: "",
        state: "",
        zipCode: "",
        email: "",
        phone: "",
        remarks: "",
        quantity: 1,
      });
    } catch (error) {
      console.error(
        "❌ SAMPLE REQUEST FAILED:",
        error,
      );

      console.error(
        "STATUS:",
        error.response?.status,
      );

      console.error(
        "BACKEND RESPONSE:",
        error.response?.data,
      );

      console.error(
        "REQUEST URL:",
        error.config?.url,
      );

      alert(
        error.response?.data
          ?.message ||
          error.message ||
          "Unable to submit sample request. Please try again.",
      );
    } finally {
      setIsSubmittingSample(
        false,
      );
    }
  };

  return (
    <>
      <SEO
        {...normalizeProductSeo(
          product,
          categorySlug,
        )}
      />

      <div className="bg-white w-full overflow-hidden">

        {/* ===================================================
            HEADING
        =================================================== */}

        <section>
          <div className="max-w-[2000px] mx-auto px-6 xl:px-10 pt-[120px]">
            <h2
              className="
                text-[34px]
                md:text-[38px]
                font-semibold
                text-[#161412]
                leading-none
              "
              style={{
                fontFamily:
                  "Montserrat, sans-serif",
              }}
            >
              {product
                .stone_categories
                ?.name ||
                "Ultra Stones"}
            </h2>

            <div className="w-[70px] h-[4px] bg-[#c91f26] mt-4 mb-4" />

            <p
              className="text-[13px] text-[#777]"
              style={{
                fontFamily:
                  "Montserrat, sans-serif",
              }}
            >
              <Link
                to="/"
                className="hover:text-[#161412] duration-300"
              >
                Home
              </Link>

              {" / "}

              <Link
                to="/categories"
                className="hover:text-[#161412] duration-300"
              >
                Material
                Portfolio
              </Link>

              {" / "}

              <Link
                to={`/product-category/${product.stone_categories?.slug}`}
                className="hover:text-[#161412] duration-300"
              >
                {product
                  .stone_categories
                  ?.name ||
                  "Ultra Stones"}
              </Link>

              {" / "}

              <span className="text-[#161412]">
                <b>
                  {product.name}
                </b>
              </span>
            </p>
          </div>
        </section>

        {/* ===================================================
            HERO
        =================================================== */}

        <section className="bg-white">
          <div className="max-w-[2000px] mx-auto px-6 xl:px-10 pt-[30px] pb-20">
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.95fr] gap-8 items-start">

              {/* LEFT IMAGE */}

              <div>
                <div className="relative overflow-hidden bg-[#f7f7f7] group min-h-[520px] xl:min-h-[640px]">

                  <div
                    onClick={() =>
                      setOpenPreview(
                        true,
                      )
                    }
                    className="cursor-zoom-in"
                  >
                    {activeMedia?.media_type ===
                    "FEATURED_VIDEO" ? (
                      <video
                        key={
                          activeMedia
                            .media_url
                        }
                        className="w-full h-[520px] xl:h-[640px] object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                      >
                        <source
                          src={
                            activeMedia
                              .media_url
                          }
                          type="video/mp4"
                        />
                      </video>
                    ) : (
<img
  key={activeMedia?.media_url}
  src={getOptimizedImageUrl(
    activeMedia?.media_url,
    1600,
    92,
  )}
  srcSet={`
    ${getOptimizedImageUrl(
      activeMedia?.media_url,
      768,
      88,
    )} 768w,

    ${getOptimizedImageUrl(
      activeMedia?.media_url,
      1200,
      90,
    )} 1200w,

    ${getOptimizedImageUrl(
      activeMedia?.media_url,
      1600,
      92,
    )} 1600w,

    ${getOptimizedImageUrl(
      activeMedia?.media_url,
      2000,
      92,
    )} 2000w
  `}
  sizes="(min-width: 1280px) 50vw, 100vw"
  alt={product.name}
  loading="eager"
  fetchPriority="high"
  decoding="async"
  className="
    w-full
    h-[520px]
    xl:h-[640px]
    object-cover
  "
/>
                    )}
                  </div>

                  {/* COUNTER */}

                  <div className="absolute top-5 left-5 z-20 bg-black/50 backdrop-blur-md border border-white/20 text-white text-[11px] tracking-[1px] px-4 py-2 pointer-events-none">
                    {safeActiveIndex +
                      1}{" "}
                    /{" "}
                    {
                      heroImages.length
                    }
                  </div>

                  {/* HERO ARROWS */}

                  {heroImages.length >
                    1 && (
                    <>
                      <button
                        type="button"
                        aria-label="Previous product image"
                        onClick={(
                          event,
                        ) => {
                          event.stopPropagation();

                          showPreviousMedia();
                        }}
                        className="
                          absolute
                          left-5
                          top-1/2
                          z-30
                          -translate-y-1/2
                          w-12
                          h-12
                          rounded-full
                          bg-black/25
                          backdrop-blur-md
                          border
                          border-white/30
                          text-white
                          flex
                          items-center
                          justify-center
                          hover:bg-white
                          hover:text-black
                          transition-all
                          duration-300
                        "
                      >
                        <ChevronLeft
                          size={
                            22
                          }
                          strokeWidth={
                            1.7
                          }
                        />
                      </button>

                      <button
                        type="button"
                        aria-label="Next product image"
                        onClick={(
                          event,
                        ) => {
                          event.stopPropagation();

                          showNextMedia();
                        }}
                        className="
                          absolute
                          right-5
                          top-1/2
                          z-30
                          -translate-y-1/2
                          w-12
                          h-12
                          rounded-full
                          bg-black/25
                          backdrop-blur-md
                          border
                          border-white/30
                          text-white
                          flex
                          items-center
                          justify-center
                          hover:bg-white
                          hover:text-black
                          transition-all
                          duration-300
                        "
                      >
                        <ChevronRight
                          size={
                            22
                          }
                          strokeWidth={
                            1.7
                          }
                        />
                      </button>
                    </>
                  )}

                  {/* THUMBNAILS */}

                  {heroImages.length >
                    1 && (
                    <div
                      className="absolute bottom-5 left-1/2 z-30 -translate-x-1/2 max-w-[90%]"
                      onClick={(
                        event,
                      ) =>
                        event.stopPropagation()
                      }
                    >
                      <div className="flex items-center gap-2 overflow-x-auto max-w-full p-2 bg-black/30 backdrop-blur-xl border border-white/20 rounded-md scrollbar-hide">
                        {heroImages.map(
                          (
                            media,
                            index,
                          ) => {
                            const isActive =
                              index ===
                              safeActiveIndex;

                            return (
                              <button
                                key={`${media.media_url}-${index}`}
                                type="button"
                                onClick={() =>
                                  setActiveImage(
                                    index,
                                  )
                                }
                                className={`
                                  relative
                                  shrink-0
                                  w-[64px]
                                  h-[48px]
                                  overflow-hidden
                                  bg-black
                                  transition-all
                                  duration-300

                                  ${
                                    isActive
                                      ? "ring-2 ring-white opacity-100 scale-[1.05]"
                                      : "opacity-65 hover:opacity-100"
                                  }
                                `}
                              >
                                {media.media_type ===
                                "FEATURED_VIDEO" ? (
                                  <>
                                    <video
                                      src={
                                        media
                                          .media_url
                                      }
                                      muted
                                      preload="metadata"
                                      className="w-full h-full object-cover pointer-events-none"
                                    />

                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                      <span className="w-5 h-5 rounded-full bg-white/90 text-black text-[9px] flex items-center justify-center">
                                        ▶
                                      </span>
                                    </div>
                                  </>
                                ) : (
                                  <img
                                    src={getOptimizedImageUrl(
                                      media.media_url,
                                      160,
                                      70,
                                    )}
                                    alt=""
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </button>
                            );
                          },
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT CONTENT */}

              <div className="pt-2">
                <h1
                  className="
                    text-[38px]
                    md:text-[34px]
                    leading-[1]
                    tracking-[4px]
                    uppercase
                    text-black
                    font-semibold
                    mb-8
                  "
                  style={{
                    fontFamily:
                      "Montserrat, sans-serif",
                  }}
                >
                  {product.name}
                </h1>

                <p
                  className="text-[18px] leading-[1.6] text-black max-w-[840px] mb-10"
                  style={{
                    fontFamily:
                      "Montserrat, sans-serif",
                  }}
                >
                  {shouldTruncate &&
                  !expanded
                    ? `${description.slice(
                        0,
                        300,
                      )}... `
                    : description}

                  {shouldTruncate && (
                    <button
                      type="button"
                      onClick={() =>
                        setExpanded(
                          !expanded,
                        )
                      }
                      className="ml-1 text-black italic underline hover:no-underline"
                    >
                      {expanded
                        ? "read less"
                        : "read more"}
                    </button>
                  )}
                </p>

                <button
  type="button"
  onClick={() =>
    setOpenSampleDialog(
      true,
    )
  }
  className="
    inline-flex
    items-center
    gap-2
    px-4
    py-2
    border
    border-black
    uppercase
    tracking-[1px]
    text-[13px]
    transition-all
    duration-300
    mb-5
    hover:bg-black
    hover:text-white
    cursor-pointer
  "
>
  Order Samples

  <ShoppingCart
    size={16}
  />
</button>

                {/* CLOSEUP ZOOM */}

                <div
                  className="
                    relative
                    h-[300px]
                    overflow-hidden
                    bg-[#f7f7f7]
                    mb-8
                    group
                    cursor-crosshair
                  "
                  onMouseMove={
                    handleZoomMove
                  }
                  onMouseLeave={
                    handleZoomLeave
                  }
                >
                 <img
  src={getOptimizedImageUrl(
    images[0]?.media_url,
    1200,
    82,
  )}
  srcSet={`
    ${getOptimizedImageUrl(
      images[0]?.media_url,
      480,
      76,
    )} 480w,

    ${getOptimizedImageUrl(
      images[0]?.media_url,
      768,
      78,
    )} 768w,

    ${getOptimizedImageUrl(
      images[0]?.media_url,
      1000,
      80,
    )} 1000w,

    ${getOptimizedImageUrl(
      images[0]?.media_url,
      1200,
      82,
    )} 1200w,

    ${getOptimizedImageUrl(
      images[0]?.media_url,
      1600,
      84,
    )} 1600w
  `}
  sizes="(min-width: 1280px) 48vw, (min-width: 768px) 50vw, 100vw"
  alt={`${product.name} close-up`}
  loading="lazy"
  decoding="async"
  width="1200"
  height="675"
  className="w-full h-[300px] object-cover select-none"
  draggable={false}
/>

                  <div
                    ref={
                      lensRef
                    }
                    aria-hidden="true"
                    className="
                      absolute
                      left-0
                      top-0
                      w-[150px]
                      h-[150px]
                      rounded-full
                      border-[5px]
                      border-white
                      shadow-xl
                      pointer-events-none
                      overflow-hidden
                      opacity-0
                      will-change-transform
                    "
                    style={{
                      backgroundRepeat:
                        "no-repeat",
                    }}
                  />
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <Suspense
                    fallback={
                      <div
                        className="w-[120px] h-[34px] shrink-0"
                        aria-hidden="true"
                      />
                    }
                  >
                    <Social />
                  </Suspense>

<Link
  to={`/product-category/${product?.stone_categories?.slug}`}
  className="
    border
    border-[#d9d9d9]
    px-4
    py-2
    text-[10px]
    uppercase
    tracking-[1.5px]
    text-black
    transition-all
    duration-300

    hover:border-black
    hover:bg-black
    hover:text-white
  "
>
  Category :{" "}
  {product?.stone_categories?.name || "N/A"}
</Link>
                  <div className="border border-[#d9d9d9] px-4 py-2 text-[10px] uppercase tracking-[1.5px] text-black">
                    Pantone :{" "}
                    {product
                      .pantone_colour ||
                      "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            PRODUCT SPECIFICATIONS
        =================================================== */}

        <section>
          <div className="max-w-[2000px] mx-auto px-6 xl:px-10 py-5">
            <h2
              className="text-[30px] md:text-[40px] tracking-[-1px] text-[#161412] mb-12"
              style={{
                fontFamily:
                  "Montserrat, sans-serif",
              }}
            >
              Product
              Specifications
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-10 gap-y-10">
              <SpecificationItem
                title="Size in Inches"
                value={
                  formattedSizes.length >
                  0
                    ? formattedSizes
                    : ["-"]
                }
              />

              <SpecificationItem
                title="Thicknesses"
                value={
                  product.thicknesses_cm ||
                  ["-"]
                }
              />

              <SpecificationItem
                title="Finishes Available"
                value={
                  product.finishes_available ||
                  ["-"]
                }
              />

              <SpecificationItem
                title="Pattern"
                value={
                  product.pattern ||
                  "-"
                }
              />

              <SpecificationItem
                title="Group"
                value={
                  product.stone_group ||
                  "-"
                }
              />

              <SpecificationItem
                title="Sealer"
                value={
                  product.sealer ||
                  "N/A"
                }
              />

              <SpecificationItem
                title="Cut to Size"
                value={
                  product.cut_to_size
                    ? "Yes"
                    : "No"
                }
              />

              <SpecificationItem
                title="Origin"
                value={
                  product.origin_country ||
                  "-"
                }
              />
            </div>
          </div>
        </section>

        {/* ===================================================
            3D MODEL
        =================================================== */}

        <section
          ref={
            setModelSectionElement
          }
        >
          <div className="max-w-[2000px] mx-auto px-6 xl:px-10 py-10">
            <div className="relative h-[270px] overflow-hidden bg-[#f7f7f7]">

              <div className="absolute top-3 left-3 z-10 bg-black/70 text-white text-xs md:text-sm px-3 py-1.5 rounded-full backdrop-blur-sm">
                Click to interact
                with the 3D model
              </div>

              {shouldLoadModel ? (
                <Suspense
                  fallback={
                    <div className="h-[270px] flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full border-2 border-black/20 border-t-black animate-spin" />
                    </div>
                  }
                >
                  <ModelViewer
                    height={
                      270
                    }
                    poster={
                      images[0]
                        ?.media_url
                    }
                    finishes={
                      product?.finishes_available
                    }
                  />
                </Suspense>
              ) : (
                <div className="h-[270px] flex items-center justify-center">
                  <span className="text-sm text-[#777]">
                    3D model
                    loading…
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ===================================================
            APPLICATIONS
        =================================================== */}

        <section className="py-10 bg-white">
          <div className="max-w-[2000px] mx-auto px-6 xl:px-10">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">

              <h2
                className="text-[26px] sm:text-[34px] md:text-[42px] uppercase tracking-[1px] text-[#161412] leading-tight"
                style={{
                  fontFamily:
                    "Montserrat, sans-serif",
                }}
              >
                Applications
              </h2>

              <button
                type="button"
                onClick={
                  handleDownloadDatasheet
                }
                disabled={
                  isGeneratingDatasheet
                }
                className={`
                  px-4
                  py-3
                  bg-[#161412]
                  text-white
                  uppercase
                  tracking-[1px]
                  text-[12px]
                  sm:text-[13px]
                  transition-all
                  duration-300

                  ${
                    isGeneratingDatasheet
                      ? "opacity-60 cursor-wait"
                      : "hover:bg-[#2a2724] cursor-pointer"
                  }
                `}
              >
                {isGeneratingDatasheet
                  ? "Preparing..."
                  : "Download Datasheet"}
              </button>
            </div>

            <div className="border border-black/10 overflow-hidden">

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-y-14 gap-x-8 px-8 py-14">
                {applicationItems.map(
                  (
                    item,
                    index,
                  ) => (
                    <ApplicationCard
                      key={
                        index
                      }
                      title={
                        item.title
                      }
                      value={
                        item.value
                      }
                      Icon={
                        item.icon
                      }
                    />
                  ),
                )}
              </div>

              <div className="bg-[#ececea] px-8 py-12">

                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-8">
                  {performanceItems.map(
                    (
                      item,
                      index,
                    ) => (
                      <PerformanceCard
                        key={
                          index
                        }
                        title={
                          item.title
                        }
                        value={
                          item.value
                        }
                      />
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            SAFETY
        =================================================== */}

        {silicaWarning && (
          <section className="py-8 bg-white">

            <div className="max-w-[2000px] mx-auto px-6 xl:px-10">

              <div className="bg-[#F4F4F4] px-4 sm:px-6 lg:px-10 py-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                <div className="flex items-center gap-3 flex-1">

                  <span className="text-[20px] sm:text-[22px] shrink-0">
                    ⚠️
                  </span>

                  <p
                    className="text-[13px] sm:text-[14px] lg:text-[15px] leading-[1.6] text-[#1A1A1A]"
                    style={{
                      fontFamily:
                        "Montserrat, sans-serif",
                    }}
                  >
                    <span className="font-bold text-[#D62828]">
                      Warning:
                    </span>{" "}

                    {
                      silicaMessage
                    }
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    handleDownloadSafetysheet
                  }
                  className="
                    w-full
                    lg:w-auto
                    lg:shrink-0
                    border
                    border-[#C92B2B]
                    px-5
                    py-3
                    text-[11px]
                    uppercase
                    tracking-[0.5px]
                    bg-white
                    hover:bg-[#C92B2B]
                    hover:text-white
                    transition-all
                    duration-300
                    cursor-pointer
                  "
                >
                  Download Safety
                  Datasheet
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ===================================================
            VARIATION
        =================================================== */}

        <section className="pb-16 md:pb-20 bg-white">

          <div className="max-w-[2000px] mx-auto px-4 sm:px-6 xl:px-10">

            <h2
              className="text-[28px] sm:text-[34px] md:text-[42px] uppercase tracking-[1px] text-[#161412] mb-8 md:mb-10"
              style={{
                fontFamily:
                  "Montserrat, sans-serif",
              }}
            >
              Variation
            </h2>

            <div className="border border-black/10 bg-[#f8f8f8] px-4 md:px-8 py-8">

              <div className="grid grid-cols-4 gap-3 md:gap-8 lg:gap-12 xl:gap-20 mb-8">

                <VariationCard
                  title="V1"
                  level={
                    1
                  }
                  active={
                    activeVariation ===
                    "V1"
                  }
                />

                <VariationCard
                  title="V2"
                  level={
                    2
                  }
                  active={
                    activeVariation ===
                    "V2"
                  }
                />

                <VariationCard
                  title="V3"
                  level={
                    3
                  }
                  active={
                    activeVariation ===
                    "V3"
                  }
                />

                <VariationCard
                  title="V4"
                  level={
                    4
                  }
                  active={
                    activeVariation ===
                    "V4"
                  }
                />
              </div>

              <div className="relative mt-2">

                <div className="relative mx-auto w-[92%]">

                  <div className="h-[1px] bg-[#8f8f8f]" />

                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-[18px] bg-[#8f8f8f]" />

                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-[18px] bg-[#8f8f8f]" />

                  <div
                    className="absolute -translate-x-1/2"
                    style={{
                      left:
                        variationPositions[
                          activeVariation
                        ],

                      top:
                        "-30px",
                    }}
                  >
                    <div className="w-[1px] h-[29px] bg-[#8f8f8f]" />
                  </div>
                </div>

                <div className="w-[92%] mx-auto flex justify-between mt-3">

                  <span className="text-[11px] md:text-[14px] text-[#666]">
                    Low Variation
                  </span>

                  <span className="text-[11px] md:text-[14px] text-[#666]">
                    High Variation
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================
            FAQ
        =================================================== */}

        {product?.faqs?.filter(
          (item) =>
            item.is_active,
        )?.length >
          0 && (
          <section className="pb-20 bg-white">

            <div className="max-w-[2000px] mx-auto px-6 xl:px-10">

              <div className="bg-[#f5f5f5] border border-[#d9d9d9] rounded-sm p-6 lg:p-10">

                <div className="grid lg:grid-cols-[340px_1fr] gap-10">

                  <div className="lg:pr-8">

                    <p className="text-[12px] uppercase tracking-[3px] text-[#9b9b9b] mb-4">
                      FAQ
                    </p>

                    <h2
                      className="text-[42px] leading-[1] font-semibold text-[#161412] mb-6"
                      style={{
                        fontFamily:
                          "Montserrat, sans-serif",
                      }}
                    >
                      Frequently Asked
                      Questions
                    </h2>

                    <div className="w-[60px] h-[3px] bg-[#C91F26] mb-6" />

                    <p className="text-[15px] leading-[1.8] text-[#6b6b6b] max-w-[320px]">
                      Everything you need
                      to know about this
                      material,
                      fabrication
                      requirements,
                      maintenance and
                      recommended
                      applications.
                    </p>
                  </div>

                  <div className="space-y-3">

                    {product.faqs
                      .filter(
                        (item) =>
                          item.is_active,
                      )
                      .sort(
                        (
                          a,
                          b,
                        ) =>
                          a.sort_order -
                          b.sort_order,
                      )
                      .map(
                        (
                          faq,
                          index,
                        ) => {
                          const isOpen =
                            openFaq ===
                            index;

                          return (
                            <div
                              key={
                                faq.id
                              }
                              className="border border-[#cfcfcf] bg-white overflow-hidden"
                            >

                              <button
                                type="button"
                                onClick={() =>
                                  setOpenFaq(
                                    isOpen
                                      ? null
                                      : index,
                                  )
                                }
                                className={`
                                  w-full
                                  flex
                                  items-center
                                  justify-between
                                  px-5
                                  py-4
                                  text-left
                                  transition-all
                                  duration-300

                                  ${
                                    isOpen
                                      ? "bg-[#4a4a4a] text-white"
                                      : "bg-white text-[#161412]"
                                  }
                                `}
                              >
                                <span className="text-[13px] font-medium">
                                  {index +
                                    1}
                                  .{" "}
                                  {
                                    faq.question
                                  }
                                </span>

                                <span className="text-[18px]">
                                  {isOpen
                                    ? "−"
                                    : "+"}
                                </span>
                              </button>

                              <div
                                className={`
                                  overflow-hidden
                                  transition-all
                                  duration-300

                                  ${
                                    isOpen
                                      ? "max-h-[300px]"
                                      : "max-h-0"
                                  }
                                `}
                              >
                                <div className="px-5 py-4 text-[13px] bg-[#4a4a4a] text-white">
                                  {
                                    faq.answer
                                  }
                                </div>
                              </div>
                            </div>
                          );
                        },
                      )}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ===================================================
            RELATED PRODUCTS
        =================================================== */}

        {relatedProducts.length >
          0 && (
          <section className="pb-24 bg-white">

            <div className="max-w-[2000px] mx-auto px-6 xl:px-10">

              <div className="flex items-center justify-between gap-5 mb-10">

                <div className="flex-1">

                  <h2
                    className="text-[20px] text-[#161412] mb-3"
                    style={{
                      fontFamily:
                        "Montserrat, sans-serif",
                    }}
                  >
                    Related Products
                  </h2>

                  <div className="w-full h-[1px] bg-black/10" />
                </div>

                {relatedProducts.length >
                  4 && (
                  <div className="flex items-center gap-3">

                    <button
                      type="button"
                      aria-label="Scroll related products left"
                      onClick={
                        scrollRelatedLeft
                      }
                      className="w-11 h-11 border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
                    >
                      <ChevronLeft
                        size={
                          18
                        }
                        strokeWidth={
                          1.7
                        }
                      />
                    </button>

                    <button
                      type="button"
                      aria-label="Scroll related products right"
                      onClick={
                        scrollRelatedRight
                      }
                      className="w-11 h-11 border border-black/10 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
                    >
                      <ChevronRight
                        size={
                          18
                        }
                        strokeWidth={
                          1.7
                        }
                      />
                    </button>
                  </div>
                )}
              </div>

              <div
                ref={
                  relatedScrollRef
                }
                className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide"
              >
                {relatedProducts.map(
                  (item) => (
                    <RelatedProductCard
                      key={
                        item.id ||
                        item.slug
                      }
                      item={
                        item
                      }
                      navigate={
                        navigate
                      }
                      defaultCategorySlug={
                        product
                          .stone_categories
                          ?.slug ||
                        categorySlug
                      }
                    />
                  ),
                )}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* =====================================================
          FULL SCREEN PREVIEW
      ===================================================== */}

      {openPreview &&
        activeMedia &&
        createPortal(
          <div
            className="
              fixed
              inset-0
              z-[99999]
              bg-black/95
              flex
              items-center
              justify-center
              p-4
              md:p-8
            "
            onClick={() =>
              setOpenPreview(
                false,
              )
            }
          >

            <button
              type="button"
              aria-label="Close preview"
              onClick={() =>
                setOpenPreview(
                  false,
                )
              }
              className="
                absolute
                top-5
                right-5
                z-50
                w-12
                h-12
                rounded-full
                bg-white/10
                text-white
                flex
                items-center
                justify-center
                hover:bg-white
                hover:text-black
                transition
              "
            >
              <X
                size={
                  24
                }
              />
            </button>

            {heroImages.length >
              1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous preview image"
                  onClick={(
                    event,
                  ) => {
                    event.stopPropagation();

                    showPreviousMedia();
                  }}
                  className="
                    absolute
                    left-4
                    md:left-8
                    top-1/2
                    -translate-y-1/2
                    z-50
                    w-12
                    h-12
                    rounded-full
                    bg-white/10
                    text-white
                    flex
                    items-center
                    justify-center
                    hover:bg-white
                    hover:text-black
                    transition
                  "
                >
                  <ChevronLeft
                    size={
                      26
                    }
                  />
                </button>

                <button
                  type="button"
                  aria-label="Next preview image"
                  onClick={(
                    event,
                  ) => {
                    event.stopPropagation();

                    showNextMedia();
                  }}
                  className="
                    absolute
                    right-4
                    md:right-8
                    top-1/2
                    -translate-y-1/2
                    z-50
                    w-12
                    h-12
                    rounded-full
                    bg-white/10
                    text-white
                    flex
                    items-center
                    justify-center
                    hover:bg-white
                    hover:text-black
                    transition
                  "
                >
                  <ChevronRight
                    size={
                      26
                    }
                  />
                </button>
              </>
            )}

            <div
              onClick={(
                event,
              ) =>
                event.stopPropagation()
              }
              className="w-full h-full flex items-center justify-center"
            >
              {activeMedia.media_type ===
              "FEATURED_VIDEO" ? (
                <video
                  key={
                    activeMedia
                      .media_url
                  }
                  src={
                    activeMedia
                      .media_url
                  }
                  controls
                  autoPlay
                  className="max-w-full max-h-[92vh] object-contain"
                />
              ) : (
                <img
                  src={getOptimizedImageUrl(
                    activeMedia
                      .media_url,
                    3200,
                    92,
                  )}
                  alt={
                    activeMedia
                      .media_alt ||
                    product.name
                  }
                  className="max-w-full max-h-[92vh] object-contain select-none"
                  draggable={
                    false
                  }
                />
              )}
            </div>
          </div>,

          document.body,
        )}

        {/* =====================================================
    ORDER SAMPLE DIALOG
===================================================== */}

{openSampleDialog &&
  createPortal(
    <div
      className="
        fixed
        inset-0
        z-[99999]
        bg-black/60
        backdrop-blur-[3px]
        flex
        items-center
        justify-center
        px-4
        py-6
      "
      onClick={() =>
        setOpenSampleDialog(
          false,
        )
      }
    >
      <div
        onClick={(event) =>
          event.stopPropagation()
        }
        className="
          relative
          bg-white
          w-full
          max-w-[760px]
          max-h-[92vh]
          overflow-y-auto
          shadow-2xl
        "
      >
        {/* =========================
            HEADER
        ========================= */}

        <div
          className="
            flex
            items-start
            justify-between
            gap-5
            px-6
            sm:px-8
            pt-7
            pb-5
            border-b
            border-black/10
          "
        >
          <div>
            <p
              className="
                text-[10px]
                sm:text-[11px]
                uppercase
                tracking-[2px]
                text-[#888]
                mb-2
              "
              style={{
                fontFamily:
                  "Montserrat, sans-serif",
              }}
            >
              Ultra Stones
            </p>

            <h2
              className="
                text-[24px]
                sm:text-[30px]
                font-semibold
                text-[#161412]
                leading-tight
              "
              style={{
                fontFamily:
                  "Montserrat, sans-serif",
              }}
            >
              Order a Sample
            </h2>

            <p
              className="
                text-[13px]
                text-[#666]
                mt-2
              "
              style={{
                fontFamily:
                  "Montserrat, sans-serif",
              }}
            >
              {product.name}
            </p>
          </div>

          <button
            type="button"
            aria-label="Close sample dialog"
            onClick={() =>
              setOpenSampleDialog(
                false,
              )
            }
            className="
              w-10
              h-10
              shrink-0
              flex
              items-center
              justify-center
              border
              border-black/10
              hover:bg-black
              hover:text-white
              transition-all
              duration-300
            "
          >
            <X size={19} />
          </button>
        </div>

        {/* =========================
            FORM
        ========================= */}

        <form
          onSubmit={
            handleSampleSubmit
          }
          className="
            px-6
            sm:px-8
            py-7
          "
        >
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-x-5
              gap-y-5
            "
          >
            {/* FIRST NAME */}

            <SampleField
              label="First Name"
              required
            >
              <input
                type="text"
                name="firstName"
                value={
                  sampleForm.firstName
                }
                onChange={
                  handleSampleChange
                }
                placeholder="First name"
                autoComplete="given-name"
                required
                className={
                  sampleInputClass
                }
              />
            </SampleField>

            {/* LAST NAME */}

            <SampleField
              label="Last Name"
              required
            >
              <input
                type="text"
                name="lastName"
                value={
                  sampleForm.lastName
                }
                onChange={
                  handleSampleChange
                }
                placeholder="Last name"
                autoComplete="family-name"
                required
                className={
                  sampleInputClass
                }
              />
            </SampleField>

            {/* COMPANY NAME */}

            <div className="sm:col-span-2">
              <SampleField
                label="Company Name"
              >
                <input
                  type="text"
                  name="companyName"
                  value={
                    sampleForm.companyName
                  }
                  onChange={
                    handleSampleChange
                  }
                  placeholder="Company name"
                  autoComplete="organization"
                  className={
                    sampleInputClass
                  }
                />
              </SampleField>
            </div>

            {/* STREET ADDRESS */}

            <div className="sm:col-span-2">
              <SampleField
                label="Street Address"
                required
              >
                <input
                  type="text"
                  name="streetAddress"
                  value={
                    sampleForm.streetAddress
                  }
                  onChange={
                    handleSampleChange
                  }
                  placeholder="Street address"
                  autoComplete="street-address"
                  required
                  className={
                    sampleInputClass
                  }
                />
              </SampleField>
            </div>

            {/* CITY */}

            <SampleField
              label="City"
              required
            >
              <input
                type="text"
                name="city"
                value={
                  sampleForm.city
                }
                onChange={
                  handleSampleChange
                }
                placeholder="City"
                autoComplete="address-level2"
                required
                className={
                  sampleInputClass
                }
              />
            </SampleField>

            {/* COUNTY */}

            <SampleField
              label="County (Optional)"
            >
              <input
                type="text"
                name="county"
                value={
                  sampleForm.county
                }
                onChange={
                  handleSampleChange
                }
                placeholder="County"
                className={
                  sampleInputClass
                }
              />
            </SampleField>

            {/* STATE */}

            <SampleField
              label="State"
              required
            >
              <input
                type="text"
                name="state"
                value={
                  sampleForm.state
                }
                onChange={
                  handleSampleChange
                }
                placeholder="State"
                autoComplete="address-level1"
                required
                className={
                  sampleInputClass
                }
              />
            </SampleField>

            {/* ZIP CODE */}

            <SampleField
              label="ZIP Code"
              required
            >
              <input
                type="text"
                name="zipCode"
                value={
                  sampleForm.zipCode
                }
                onChange={
                  handleSampleChange
                }
                placeholder="ZIP code"
                autoComplete="postal-code"
                inputMode="numeric"
                required
                className={
                  sampleInputClass
                }
              />
            </SampleField>

            {/* EMAIL */}

            <SampleField
              label="Email"
              required
            >
              <input
                type="email"
                name="email"
                value={
                  sampleForm.email
                }
                onChange={
                  handleSampleChange
                }
                placeholder="Email address"
                autoComplete="email"
                required
                className={
                  sampleInputClass
                }
              />
            </SampleField>

            {/* PHONE */}

            <SampleField
              label="Phone Number"
              required
            >
              <input
                type="tel"
                name="phone"
                value={
                  sampleForm.phone
                }
                onChange={
                  handleSampleChange
                }
                placeholder="Phone number"
                autoComplete="tel"
                required
                className={
                  sampleInputClass
                }
              />
            </SampleField>

            {/* QUANTITY */}

            <SampleField
              label="Number of Samples"
              required
            >
              <div
                className="
                  flex
                  items-center
                  border
                  border-[#d8d8d8]
                  h-[48px]
                  focus-within:border-black
                  transition-colors
                "
              >
                <button
                  type="button"
                  aria-label="Decrease sample quantity"
                  onClick={() =>
                    setSampleForm(
                      (
                        previous,
                      ) => ({
                        ...previous,

                        quantity:
                          Math.max(
                            1,
                            previous.quantity -
                              1,
                          ),
                      }),
                    )
                  }
                  className="
                    w-12
                    h-full
                    shrink-0
                    text-[20px]
                    hover:bg-[#f3f3f3]
                    transition-colors
                  "
                >
                  −
                </button>

                <input
                  type="number"
                  name="quantity"
                  min="1"
                  value={
                    sampleForm.quantity
                  }
                  onChange={
                    handleSampleChange
                  }
                  required
                  className="
                    flex-1
                    min-w-0
                    h-full
                    text-center
                    outline-none
                    text-[14px]
                    appearance-none
                  "
                />

                <button
                  type="button"
                  aria-label="Increase sample quantity"
                  onClick={() =>
                    setSampleForm(
                      (
                        previous,
                      ) => ({
                        ...previous,

                        quantity:
                          previous.quantity +
                          1,
                      }),
                    )
                  }
                  className="
                    w-12
                    h-full
                    shrink-0
                    text-[20px]
                    hover:bg-[#f3f3f3]
                    transition-colors
                  "
                >
                  +
                </button>
              </div>
            </SampleField>

            {/* MATERIAL */}

            <SampleField
              label="Material"
            >
              <div
                className="
                  min-h-[48px]
                  px-4
                  py-3
                  bg-[#f5f5f5]
                  border
                  border-[#e4e4e4]
                  text-[13px]
                  text-[#555]
                  flex
                  items-center
                "
              >
                {product.name}
              </div>
            </SampleField>

            {/* REMARKS */}

            <div className="sm:col-span-2">
              <SampleField
                label="Remarks (Optional)"
              >
                <textarea
                  name="remarks"
                  value={
                    sampleForm.remarks
                  }
                  onChange={
                    handleSampleChange
                  }
                  placeholder="Add any special instructions or additional details..."
                  rows={3}
                  className="
                    w-full
                    border
                    border-[#d8d8d8]
                    px-4
                    py-3
                    text-[14px]
                    text-[#161412]
                    placeholder:text-[#aaa]
                    outline-none
                    resize-none
                    focus:border-black
                    transition-colors
                  "
                />
              </SampleField>
            </div>
          </div>

          {/* =========================
              NOTE
          ========================= */}

          <p
            className="
              text-[11px]
              sm:text-[12px]
              leading-[1.6]
              text-[#888]
              mt-5
            "
            style={{
              fontFamily:
                "Montserrat, sans-serif",
            }}
          >
            Our team will review
            your request and contact
            you regarding sample
            availability and shipping.
          </p>

          {/* =========================
              ACTIONS
          ========================= */}

          <div
            className="
              flex
              flex-col-reverse
              sm:flex-row
              sm:items-center
              sm:justify-end
              gap-3
              mt-7
              pt-6
              border-t
              border-black/10
            "
          >
            <button
              type="button"
              onClick={() =>
                setOpenSampleDialog(
                  false,
                )
              }
              className="
                w-full
                sm:w-auto
                px-6
                py-3
                border
                border-black/20
                text-[12px]
                uppercase
                tracking-[1px]
                text-[#161412]
                hover:border-black
                hover:bg-[#f5f5f5]
                transition-all
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                isSubmittingSample
              }
              className={`
                w-full
                sm:w-auto
                px-7
                py-3
                bg-[#161412]
                text-white
                text-[12px]
                uppercase
                tracking-[1px]
                transition-all

                ${
                  isSubmittingSample
                    ? "opacity-60 cursor-wait"
                    : "hover:bg-[#c91f26] cursor-pointer"
                }
              `}
            >
              {isSubmittingSample
                ? "Submitting..."
                : "Submit Sample Request"}
            </button>
          </div>
        </form>
      </div>
    </div>,

    document.body,
  )}
    </>
  );
};

export default ProductDetails;

/* =========================================================
   SPECIFICATION ITEM
========================================================= */

const SpecificationItem = ({
  title,
  value,
}) => {
  const formattedValue =
    Array.isArray(value)
      ? value
      : typeof value ===
          "string"
        ? value
            .split(",")
            .map(
              (item) =>
                item.trim(),
            )
        : [value];

  return (
    <div>
      <p className="text-[11px] font-medium text-[#161412] uppercase tracking-[1px] mb-3">
        {title}
      </p>

      <div className="w-full h-[1px] bg-black/15 mb-4" />

      <div
        className="text-[16px] text-[#2d2b28] space-y-1"
        style={{
          fontFamily:
            "Montserrat, sans-serif",
        }}
      >
        {formattedValue?.length >
        0 ? (
          formattedValue.map(
            (
              item,
              index,
            ) => (
              <p
                key={
                  index
                }
              >
                {item ||
                  "-"}
              </p>
            ),
          )
        ) : (
          <p>-</p>
        )}
      </div>
    </div>
  );
};

/* =========================================================
   APPLICATION
========================================================= */

const ApplicationCard = ({
  title,
  value,
  Icon,
}) => {
  return (
    <div className="flex items-center gap-5">

      <div className="w-[58px] h-[58px] flex items-center justify-center text-[#161412]">

        <img
          src={
            Icon
          }
          alt=""
          loading="lazy"
          decoding="async"
          width="58"
          height="58"
        />
      </div>

      <div>
        <h3
          className="text-[12px] uppercase tracking-[1px] font-semibold text-[#161412] leading-[1.5]"
          style={{
            fontFamily:
              "Montserrat, sans-serif",
          }}
        >
          {title}
        </h3>

        <p
          className="text-[14px] text-[#666] mt-1"
          style={{
            fontFamily:
              "Montserrat, sans-serif",
          }}
        >
          {value
            ? "Yes"
            : "No"}
        </p>
      </div>
    </div>
  );
};

/* =========================================================
   PERFORMANCE
========================================================= */

const PerformanceCard = ({
  title,
  value,
}) => {
  return (
    <div className="text-center">

      <h3
        className="text-[12px] uppercase tracking-[1px] font-semibold text-[#161412] mb-2"
        style={{
          fontFamily:
            "Montserrat, sans-serif",
        }}
      >
        {title}
      </h3>

      <p
        className="text-[15px] text-[#666] uppercase"
        style={{
          fontFamily:
            "Montserrat, sans-serif",
        }}
      >
        {value ||
          "-"}
      </p>
    </div>
  );
};

/* =========================================================
   VARIATION
========================================================= */

const VariationCard = ({
  title,
  level,
  active,
}) => {
  const getOpacity =
    (index) => {
      if (
        level === 1
      ) {
        return "bg-[#d8d8d8]";
      }

      if (
        level === 2
      ) {
        const shades = [
          "bg-[#aaaaaa]",
          "bg-[#d2d2d2]",
          "bg-[#c5c5c5]",
          "bg-[#c9c9c9]",
          "bg-[#c7c7c7]",
          "bg-[#ababab]",
          "bg-[#aaaaaa]",
          "bg-[#c4c4c4]",
          "bg-[#d0d0d0]",
        ];

        return shades[
          index
        ];
      }

      if (
        level === 3
      ) {
        const shades = [
          "bg-[#a5a5a9]",
          "bg-[#d0d0d0]",
          "bg-[#c7c7c7]",
          "bg-[#c5c5c5]",
          "bg-[#bdbdbd]",
          "bg-[#666666]",
          "bg-[#a7a7ab]",
          "bg-[#bdbdbd]",
          "bg-[#c4c4c4]",
        ];

        return shades[
          index
        ];
      }

      const shades = [
        "bg-[#666666]",
        "bg-[#b4b4b4]",
        "bg-[#bdbdbd]",
        "bg-[#bebebe]",
        "bg-[#c4c4c4]",
        "bg-[#666666]",
        "bg-[#aaaaaa]",
        "bg-[#666666]",
        "bg-[#c4c4c4]",
      ];

      return shades[
        index
      ];
    };

  return (
    <div className="text-center">

      <h3
        className="text-[12px] md:text-[16px] text-[#161412] mb-3"
        style={{
          fontFamily:
            "Montserrat, sans-serif",
        }}
      >
        {title}
      </h3>

      <div
        className={`
          inline-block
          p-[2px]

          ${
            active
              ? "border border-[#6e6e6e]"
              : ""
          }
        `}
      >
        <div className="grid grid-cols-3 gap-[1px] w-[72px] sm:w-[85px] md:w-[95px] lg:w-[110px] xl:w-[125px]">

          {Array.from({
            length: 9,
          }).map(
            (
              _,
              index,
            ) => (
              <div
                key={
                  index
                }
                className={`
                  w-full
                  aspect-square
                  ${getOpacity(
                    index,
                  )}
                `}
              />
            ),
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   RELATED PRODUCT
========================================================= */

const RelatedProductCard = ({
  item,
  navigate,
  defaultCategorySlug,
}) => {
  const itemCategorySlug =
    item
      ?.stone_categories
      ?.slug ||
    item?.category_slug ||
    item?.categorySlug ||
    defaultCategorySlug;

  const closeupMedia =
    item.media?.find(
      (media) =>
        media.media_type ===
        "CLOSEUP_IMAGE",
    );

  const slabMedia =
    item.media?.find(
      (media) =>
        media.media_type ===
        "SLAB_IMAGE",
    );

  const imageUrl =
    item.closeup_image ||
    item.closeup_image_url ||
    item.thumbnail_url ||
    closeupMedia?.media_url ||
    slabMedia?.media_url ||
    null;

  const handleProductClick =
    () => {
      if (
        !item?.slug ||
        !itemCategorySlug
      ) {
        return;
      }

      navigate(
        `/product-category/${itemCategorySlug}/${item.slug}`,
      );
    };

  return (
    <div
      onClick={
        handleProductClick
      }
      className="
        min-w-[280px]
        sm:min-w-[320px]
        sm:max-w-[320px]
        group
        cursor-pointer
      "
    >
      <div className="overflow-hidden bg-[#f5f5f5] mb-4">

        <img
          src={
            imageUrl
              ? getOptimizedImageUrl(
                  imageUrl,
                  480,
                  78,
                )
              : "https://placehold.co/600x600"
          }
          srcSet={
            imageUrl
              ? `
                ${getOptimizedImageUrl(
                  imageUrl,
                  320,
                  72,
                )} 320w,

                ${getOptimizedImageUrl(
                  imageUrl,
                  480,
                  78,
                )} 480w,

                ${getOptimizedImageUrl(
                  imageUrl,
                  640,
                  80,
                )} 640w
              `
              : undefined
          }
          sizes="320px"
          alt={
            item.name ||
            ""
          }
          loading="lazy"
          decoding="async"
          width="320"
          height="320"
          className="
            w-full
            h-[320px]
            object-cover
            group-hover:scale-[1.03]
            transition-all
            duration-700
          "
        />
      </div>

      <p
        className="text-[12px] uppercase tracking-[0.5px] font-semibold text-[#161412] mb-1"
        style={{
          fontFamily:
            "Montserrat, sans-serif",
        }}
      >
        {item.stone_group ||
          item
            .stone_categories
            ?.name ||
          "ULTRA STONES"}
      </p>

      <p
        className="text-[15px] text-[#4b4b4b]"
        style={{
          fontFamily:
            "Montserrat, sans-serif",
        }}
      >
        {item.name}
      </p>
    </div>
  );
};

/* =========================================================
   SKELETON
========================================================= */

const ProductDetailsSkeleton = () => {
    return (
      <main
        className="bg-white min-h-screen"
        aria-busy="true"
        aria-label="Loading product details"
      >

        <section>
          <div className="max-w-[2000px] mx-auto px-6 xl:px-10 pt-[120px]">

            <div className="h-[38px] w-[240px] bg-[#ededed] animate-pulse" />

            <div className="w-[70px] h-[4px] bg-[#c91f26] mt-4 mb-4" />

            <div className="h-[14px] w-[420px] max-w-full bg-[#ededed] animate-pulse" />
          </div>
        </section>

        <section>
          <div className="max-w-[2000px] mx-auto px-6 xl:px-10 pt-[30px] pb-20">

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.95fr] gap-8 items-start">

              <div className="h-[520px] xl:h-[640px] bg-[#ededed] animate-pulse" />

              <div className="pt-2">

                <div className="h-[42px] w-[70%] bg-[#ededed] animate-pulse mb-8" />

                <div className="space-y-3 mb-10">

                  <div className="h-[18px] w-full bg-[#ededed] animate-pulse" />

                  <div className="h-[18px] w-full bg-[#ededed] animate-pulse" />

                  <div className="h-[18px] w-[75%] bg-[#ededed] animate-pulse" />
                </div>

                <div className="h-[42px] w-[160px] bg-[#ededed] animate-pulse mb-5" />

                <div className="h-[300px] bg-[#ededed] animate-pulse mb-8" />

                <div className="flex gap-3">

                  <div className="h-[34px] w-[120px] bg-[#ededed] animate-pulse" />

                  <div className="h-[34px] w-[180px] bg-[#ededed] animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="max-w-[2000px] mx-auto px-6 xl:px-10 py-5">

            <div className="h-[46px] w-[330px] max-w-full bg-[#ededed] animate-pulse mb-12" />

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-10 gap-y-10">

              {Array.from({
                length:
                  8,
              }).map(
                (
                  _,
                  index,
                ) => (
                  <div
                    key={
                      index
                    }
                  >
                    <div className="h-[12px] w-[120px] bg-[#ededed] animate-pulse mb-3" />

                    <div className="w-full h-px bg-black/10 mb-4" />

                    <div className="h-[18px] w-[80%] bg-[#ededed] animate-pulse" />
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        <section>
          <div className="max-w-[2000px] mx-auto px-6 xl:px-10 py-10">

            <div className="h-[270px] bg-[#ededed] animate-pulse" />
          </div>
        </section>
      </main>
    );
  };


  /* =========================================================
   SAMPLE FORM FIELD
========================================================= */

const sampleInputClass = `
  w-full
  h-[48px]
  border
  border-[#d8d8d8]
  bg-white
  px-4
  text-[14px]
  text-[#161412]
  placeholder:text-[#aaa]
  outline-none
  focus:border-black
  transition-colors
`;

const SampleField = ({
  label,
  required = false,
  children,
}) => {
  return (
    <div>
      <label
        className="
          block
          text-[10px]
          sm:text-[11px]
          uppercase
          tracking-[1px]
          font-semibold
          text-[#161412]
          mb-2
        "
        style={{
          fontFamily:
            "Montserrat, sans-serif",
        }}
      >
        {label}

        {required && (
          <span className="text-[#c91f26] ml-1">
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
};
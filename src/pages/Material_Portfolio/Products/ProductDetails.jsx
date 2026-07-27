import axios from "axios";

import { lazy, Suspense, useEffect, useRef, useState } from "react";

import { createPortal } from "react-dom";

import { useParams, useNavigate, Link } from "react-router-dom";

import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";

import Icons from "../../../assets/icons";
import SEO from "../../../components/common/SEO";
import Loading from "../../../components/common/Loading";
import { normalizeProductSeo } from "../../../utils/seoNormalizers";
import { getOptimizedImageUrl } from "../../../utils/Mediahelper";
const Social = lazy(() => import("../../../components/common/Socials"));
const ModelViewer = lazy(() => import("../../../components/common/ModelViewer"),);

const ProductDetails = () => {
  const { categorySlug, productSlug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [openFaq, setOpenFaq] = useState(1);
  const [expanded, setExpanded] = useState(false);
  const [inspirationImages, setInspirationImages] = useState([]);

  const [zoomStyle, setZoomStyle] = useState({
    backgroundImage: "",
    backgroundPosition: "50% 50%",
    backgroundSize: "1000%",
    opacity: 0,
  });

  const [lensPosition, setLensPosition] = useState({
    x: 0,
    y: 0,
    visible: false,
  });

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [openPreview, setOpenPreview] = useState(false);
  const [shouldLoadModel, setShouldLoadModel] = useState(false);

  const [modelSectionElement, setModelSectionElement] = useState(null);
  const relatedScrollRef = useRef(null);

  const description =
    product?.long_description ||
    product?.small_description ||
    "";

  const shouldTruncate = description.length > 300;

  useEffect(() => {
    const controller = new AbortController();

    const loadProduct = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/stones/productdetail/${productSlug}`,
          {
            signal: controller.signal,
          },
        );

        if (response.data.success) {
          setProduct(response.data.product);
        }
      } catch (error) {
        if (
          error.code !== "ERR_CANCELED" &&
          error.name !== "CanceledError"
        ) {
          console.error("Failed to load product:", error);
        }
      }
    };

    setProduct(null);
    setActiveImage(0);
    setOpenPreview(false);
    setExpanded(false);
    setRelatedProducts([]);
    setShouldLoadModel(false);

    loadProduct();

    return () => controller.abort();
  }, [productSlug]);

useEffect(() => {
  const controller = new AbortController();

  const loadInspirationImages = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/inspiration-gallery/images/product/${productSlug}`,
        {
          signal: controller.signal,
        },
      );

      const galleryImages =
        response.data?.data?.images || [];

      const formattedImages = galleryImages.map(
        (image) => ({
          id: `inspiration-${image.id}`,
          media_url: image.image_url,
          media_type: "APPLICATION_IMAGE",
          media_alt:
            image.image_alt ||
            image.title ||
            productSlug,
          title: image.title,
          category:
            image.inspiration_gallery_categories,
        }),
      );

      setInspirationImages(formattedImages);

      console.log(
        "Formatted inspiration images:",
        formattedImages,
      );
    } catch (error) {
      if (
        error.code !== "ERR_CANCELED" &&
        error.name !== "CanceledError"
      ) {
        console.error(
          "Failed to load inspiration gallery images:",
          error,
        );

        setInspirationImages([]);
      }
    }
  };

  setInspirationImages([]);

  if (productSlug) {
    loadInspirationImages();
  }

  return () => controller.abort();
}, [productSlug]);

  useEffect(() => {
    if (!product || !modelSectionElement) {
      return undefined;
    }

    if (!("IntersectionObserver" in window)) {
      setShouldLoadModel(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadModel(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: "600px 0px",
        threshold: 0,
      },
    );

    observer.observe(modelSectionElement);

    return () => {
      observer.disconnect();
    };
  }, [product, modelSectionElement]);

  useEffect(() => {
    if (!openPreview) {
      return undefined;
    }

    const previousBodyOverflow =
      document.body.style.overflow;

    const previousHtmlOverflow =
      document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setOpenPreview(false);
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

  if (!product) {
    return (
      <Loading />
    );
  }


  // All product-derived variables go here.
  const closeupImages =
    product.media?.filter((item) => item.media_type === "CLOSEUP_IMAGE") || [];

  const slabImages =
    product.media?.filter((item) => item.media_type === "SLAB_IMAGE") || [];

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
      (item) => item.media_type === "BOOKMATCH_SLIPMATCH",
    ) || [];

  const featuredvideo =
    product.media?.filter((item) => item.media_type === "FEATURED_VIDEO") || [];

  const images =
    closeupImages.length > 0
      ? closeupImages
      : [
        {
          media_url: "https://placehold.co/1200x800",
        },
      ];
  const heroImages =
    [
      ...slabImages,
      ...closeupImages,
      ...applicationImages,
      ...bookmatchslipmatch,
      ...featuredvideo,
    ].length > 0
      ? [
        ...slabImages,
        ...closeupImages,
        ...applicationImages,
        ...bookmatchslipmatch,
        ...featuredvideo,
      ]
      : [
        {
          media_url: "https://placehold.co/1200x800",
          media_type: "IMAGE",
        },
      ];

  const activeMedia = heroImages[activeImage];

  const applicationItems = [
    {
      title: "Color Enhancing",
      value: product.color_enhancing,
      icon: Icons.colourenhancing,
    },

    {
      title: "Shower Wall",
      value: product.shower_wall,
      icon: Icons.showerwall,
    },

    {
      title: "Fireplace",
      value: product.interior_wall,
      icon: Icons.fireplace,
    },

    {
      title: "Countertops / Vanities",
      value: product.countertops_vanities,
      icon: Icons.countertop,
    },

    {
      title: "Exterior Floor",
      value: product.exterior_floor,
      icon: Icons.exetiorfloor,
    },

    {
      title: "Pool / Fountain",
      value: product.pool_fountain,
      icon: Icons.poolfountain,
    },

    {
      title: "Interior Floor",
      value: product.interior_floor,
      icon: Icons.interiorfloor,
    },

    {
      title: "Exterior Wall",
      value: product.exterior_wall,
      icon: Icons.exteriorwall,
    },

    {
      title: "Interior Wall",
      value: product.interior_wall,
      icon: Icons.interiorwall,
    },

    {
      title: "Shower Floor",
      value: product.shower_floor,
      icon: Icons.showerfloor,
    },

    {
      title: "Furniture Top",
      value: product.furniture_top,
      icon: Icons.furnituretop,
    },

    {
      title: "Translucent",
      value: product.translucent,
      icon: Icons.translucent,
    },
  ];

  const performanceItems = [
    {
      title: "Abrasion Resistance",
      value: product.abrasion_resistance,
    },

    {
      title: "Stain Resistance",
      value: product.stain_resistance,
    },

    {
      title: "Etching Resistance",
      value: product.etching_resistance,
    },

    {
      title: "Heat Resistance",
      value: product.heat_resistance,
    },

    {
      title: "UV Resistance",
      value: product.uv_resistance,
    },

    {
      title: "Color Range",
      value: product.color_range,
    },

    {
      title: "Movement Index",
      value: product.movement_index,
    },
  ];


  const handleDownloadDatasheet = async () => {
    try {
      const { generateDatasheet } =
        await import("../../../utils/generateDatasheet");

      await generateDatasheet({
        product,
        closeupImages,
        images,
      });
    } catch (error) {
      console.error("Failed to generate datasheet:", error);
    }
  };
  const handleDownloadSafetysheet = () => {
    if (!silicaPdf) {
      return;
    }

    const fileUrl = `${import.meta.env.VITE_API_URL.replace("/api", "")}${silicaPdf}`;

    const link = document.createElement("a");

    link.href = fileUrl;

    link.target = "_blank";

    link.download = silicaPdf.split("/").pop();

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  const variationPositions = {
    V1: "7.5%",
    V2: "36%",
    V3: "64.5%",
    V4: "92.5%",
  };

  const activeVariation = product?.variation_level || "V1";

  const silicaWarning =
    product.silica_warning || product.stone_categories?.silica_warning;

  const silicaMessage =
    product.silica_warning_message ||
    product.stone_categories?.silica_warning_message;

  const silicaPdf =
    product.silica_datasheet_url ||
    product.stone_categories?.silica_datasheet_url;

  const zoomImageUrl = getOptimizedImageUrl(
    images[0]?.media_url,
    1800,
    88,
  );

  const showPreviousMedia = () => {
    setActiveImage((currentIndex) =>
      currentIndex === 0
        ? heroImages.length - 1
        : currentIndex - 1,
    );
  };

  const showNextMedia = () => {
    setActiveImage((currentIndex) =>
      currentIndex === heroImages.length - 1
        ? 0
        : currentIndex + 1,
    );
  };


  return (
    <>
      <SEO {...normalizeProductSeo(product, categorySlug)} />

      <div className="bg-white w-full overflow-hidden">
        {/* HEADING */}
        <section>
          <div
            className="
            max-w-[2000px]
            mx-auto
            px-6
            xl:px-10
            pt-[120px]
            "
          >
            {/* MATERIAL TITLE */}

            <h2
              className="
      text-[34px]
      md:text-[38px]
      font-semibold
      text-[#161412]
      leading-none
      "
              style={{
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              {product.stone_categories?.name || "Ultra Stones"}
            </h2>

            {/* RED LINE */}

            <div className="w-[70px] h-[4px] bg-[#c91f26] mt-4 mb-4" />

            {/* BREADCRUMB / STONE NAME */}

            <p
              className="
                text-[13px]
                text-[#777]
                "
              style={{
                fontFamily: "Montserrat, sans-serif",
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
                to="/categories"
                className="
    hover:text-[#161412]
    duration-300
    "
              >
                Material Portfolio
              </Link>

              {" / "}

              <Link
                to={`/product-category/${product.stone_categories?.slug}`}
                className="
    hover:text-[#161412]
    duration-300
    "
              >
                {product.stone_categories?.name || "Ultra Stones"}
              </Link>

              {" / "}

              <span className="text-[#161412]">
                <b>{product.name}</b>
              </span>
            </p>
          </div>
        </section>

        {/* HERO */}
        <section className="bg-white">
          <div
            className="
    max-w-[2000px]
    mx-auto
    px-6
    xl:px-10
    pt-[30px]
    pb-20
    "
          >
            <div
              className="
      grid
      grid-cols-1
      xl:grid-cols-[1fr_0.95fr]
      gap-8
      items-start
      "
            >
              {/* LEFT IMAGE */}

              <div>
                <div
                  className="
      relative
      overflow-hidden
      bg-[#f7f7f7]
      group
      min-h-[520px]
      xl:min-h-[640px]
    "
                >
                  <div onClick={() => setOpenPreview(true)} className="cursor-zoom-in">
                    {openPreview ? null : activeMedia?.media_type === "FEATURED_VIDEO" ? (
                      <video
                        key={activeMedia.media_url}
                        className="w-full h-[520px] xl:h-[640px] object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                      >
                        <source src={activeMedia.media_url} type="video/mp4" />
                      </video>
                    ) : (
                      <img
                        key={activeMedia?.media_url}
                        src={getOptimizedImageUrl(activeMedia?.media_url, 1200, 82)}
                        srcSet={`
    ${getOptimizedImageUrl(activeMedia?.media_url, 640, 76)} 640w,
    ${getOptimizedImageUrl(activeMedia?.media_url, 960, 80)} 960w,
    ${getOptimizedImageUrl(activeMedia?.media_url, 1200, 82)} 1200w,
    ${getOptimizedImageUrl(activeMedia?.media_url, 1600, 84)} 1600w
  `}
                        sizes="(min-width: 1280px) 50vw, 100vw"
                        alt={product.name}
                        loading="eager"
                        fetchPriority={activeImage === 0 ? "high" : "auto"}
                        decoding="async"
                        width="1200"
                        height="800"
                        className="
    w-full
    h-[520px]
    xl:h-[640px]
    object-cover
    transition-transform
    duration-700
    group-hover:scale-[1.015]
  "
                      />
                    )}
                  </div>

                  {/* TOP GLASS BAR */}
                  <div
                    className="
        absolute
        top-5
        left-5
        right-5
        z-20
        flex
        items-center
        justify-between
        pointer-events-none
      "
                  >

                    <div
                      className="
          bg-black/35
          backdrop-blur-xl
          border
          border-white/15
          text-white
          text-[11px]
          tracking-[1px]
          px-4
          py-2
          shadow-lg
        "
                    >
                      {activeImage + 1} / {heroImages.length}
                    </div>
                  </div>

                  {/* NAVIGATION */}
                  {heroImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        aria-label="Show previous product image"
                        title="Previous image"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImage(
                            activeImage === 0
                              ? heroImages.length - 1
                              : activeImage - 1,
                          );
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
    bg-white/20
    backdrop-blur-xl
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
                          size={22}
                          strokeWidth={1.7}
                          aria-hidden="true"
                          focusable="false"
                        />
                      </button>

                      <button
                        type="button"
                        aria-label="Show next product image"
                        title="Next image"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImage(
                            activeImage === heroImages.length - 1
                              ? 0
                              : activeImage + 1,
                          );
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
    bg-white/20
    backdrop-blur-xl
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
                          size={22}
                          strokeWidth={1.7}
                          aria-hidden="true"
                          focusable="false"
                        />
                      </button>
                    </>
                  )}

                </div>

                {openPreview &&
                  createPortal(
                    <div
                      role="dialog"
                      aria-modal="true"
                      aria-label={`${product.name} media preview`}
                      className="
        fixed
        inset-0
        z-[999999]
        w-screen
        h-[100dvh]
        bg-black
        flex
        items-center
        justify-center
        overflow-hidden
        p-4
        sm:p-6
      "
                      onClick={() =>
                        setOpenPreview(false)
                      }
                    >
                      <button
                        type="button"
                        aria-label="Close preview"
                        onClick={(event) => {
                          event.stopPropagation();
                          setOpenPreview(false);
                        }}
                        className="
          fixed
          top-4
          right-4
          sm:top-6
          sm:right-7
          z-[1000000]
          w-12
          h-12
          rounded-full
          border
          border-white/20
          bg-black/50
          text-white
          text-[38px]
          leading-none
          flex
          items-center
          justify-center
          hover:bg-white
          hover:text-black
          transition-colors
          duration-300
        "
                      >
                        ×
                      </button>

                      {activeMedia?.media_type ===
                        "FEATURED_VIDEO" ? (
                        <video
                          key={`preview-${activeMedia.media_url}`}
                          src={activeMedia.media_url}
                          className="
            block
            max-w-[94vw]
            max-h-[90dvh]
            w-auto
            h-auto
            object-contain
            bg-black
          "
                          controls
                          autoPlay
                          muted
                          playsInline
                          preload="metadata"
                          onClick={(event) =>
                            event.stopPropagation()
                          }
                        />
                      ) : (
                        <img
                          src={getOptimizedImageUrl(
                            activeMedia?.media_url,
                            2400,
                            90,
                          )}
                          alt={product.name}
                          className="
            block
            max-w-[94vw]
            max-h-[90dvh]
            w-auto
            h-auto
            object-contain
            select-none
          "
                          decoding="async"
                          onClick={(event) =>
                            event.stopPropagation()
                          }
                        />
                      )}
                    </div>,
                    document.body,
                  )}
              </div>

              {/* RIGHT CONTENT */}

              <div className="pt-2">
                {/* TITLE */}

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
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  {product.name}
                </h1>

                {/* DESCRIPTION */}

                <p
                  className="
    text-[18px]
    leading-[1.6]
    text-black
    max-w-[840px]
    mb-10
  "
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  {shouldTruncate && !expanded
                    ? `${description.slice(0, 300)}... `
                    : description}

                  {shouldTruncate && (
                    <button
                      type="button"
                      onClick={() => setExpanded(!expanded)}
                      className="ml-1 text-black italic underline hover:no-underline"
                    >
                      {expanded ? "read less" : "read more"}
                    </button>
                  )}
                </p>

                {/* PREVIEW IMAGE */}

                <button
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
                  hover:bg-gray-100
                  cursor-pointer
                "
                >
                  Order Samples
                  <ShoppingCart size={16} />
                </button>

                <div
                  className="
  relative
  overflow-hidden
  bg-[#f7f7f7]
  mb-8
  group
  cursor-crosshair
  "
                  onMouseMove={(e) => {
                    const { left, top, width, height } =
                      e.currentTarget.getBoundingClientRect();

                    const x = e.clientX - left;
                    const y = e.clientY - top;

                    const xPercent = (x / width) * 100;
                    const yPercent = (y / height) * 100;

                    setLensPosition({
                      x,
                      y,
                      visible: true,
                    });

                    setZoomStyle({
                      backgroundImage: `url("${zoomImageUrl}")`,
                      backgroundPosition: `${xPercent}% ${yPercent}%`,
                      backgroundSize: "1000%",
                      opacity: 1,
                    });
                  }}
                  onMouseLeave={() => {
                    setLensPosition((prev) => ({
                      ...prev,
                      visible: false,
                    }));

                    setZoomStyle((prev) => ({
                      ...prev,
                      opacity: 0,
                    }));
                  }}
                >
                  {/* IMAGE */}

                  <img
                    src={getOptimizedImageUrl(images[0]?.media_url, 900, 80)}
                    srcSet={`
                    ${getOptimizedImageUrl(images[0]?.media_url, 480, 74)} 480w,
                    ${getOptimizedImageUrl(images[0]?.media_url, 700, 78)} 700w,
                    ${getOptimizedImageUrl(images[0]?.media_url, 900, 80)} 900w
                    `}
                    sizes="(min-width: 1280px) 48vw, 100vw"
                    alt={`${product.name} close-up`}
                    loading="lazy"
                    decoding="async"
                    width="900"
                    height="500"
                    className="
                                w-full
                                h-[300px]
                                object-cover
                                select-none
                              "
                    draggable={false}
                  />

                  {/* MAGNIFIER LENS */}

                  {lensPosition.visible && (
                    <div
                      className="
      absolute
      w-[150px]
      h-[150px]
      rounded-full
      border-[5px]
      border-white
      shadow-xl
      pointer-events-none
      overflow-hidden
      "
                      style={{
                        left: lensPosition.x,
                        top: lensPosition.y,
                        transform: "translate(-50%, -50%)",
                        backgroundImage: zoomStyle.backgroundImage,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: zoomStyle.backgroundSize,
                        backgroundPosition: zoomStyle.backgroundPosition,
                      }}
                    />
                  )}
                </div>

                {/* TAGS */}

                <div className="flex items-center gap-3 flex-wrap">
                  <Suspense fallback={null}>
                    <Social />
                  </Suspense>
                  <div
                    className="
            border
            border-[#d9d9d9]
            px-4
            py-2
            text-[10px]
            uppercase
            tracking-[1.5px]
            text-black
            "
                  >
                    Category :{" "}
                    {product.stone_categories?.name || "ULTRA QUARTZ"}
                  </div>

                  <div
                    className="
            border
            border-[#d9d9d9]
            px-4
            py-2
            text-[10px]
            uppercase
            tracking-[1.5px]
            text-black
            "
                  >
                    Pantone : {product.pantone_colour || "-"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCT SPECIFICATIONS */}
        <section>
          <div
            className="
    max-w-[2000px]
    mx-auto
    px-6
    xl:px-10
    py-5
    "
          >
            {/* HEADING */}

            <h2
              className="
      text-[30px]
      md:text-[40px]
      tracking-[-1px]
      text-[#161412]
      mb-12
      "
              style={{
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Product Specifications
            </h2>

            {/* GRID */}

            <div
              className="
      grid
      grid-cols-1
      sm:grid-cols-2
      xl:grid-cols-4
      gap-x-10
      gap-y-10
      "
            >
              <SpecificationItem
                title="Size in Inches"
                value={product.average_sizes_inches?.join(", ") || "-"}
              />

              <SpecificationItem
                title="Thicknesses"
                value={product.thicknesses_cm?.join(", ") || "-"}
              />

              <SpecificationItem
                title="Finishes Available"
                value={product.finishes_available?.join(", ") || "-"}
              />

              <SpecificationItem
                title="Pattern"
                value={product.pattern || "-"}
              />

              <SpecificationItem
                title="Group"
                value={product.stone_group || "-"}
              />

              <SpecificationItem
                title="Sealer"
                value={product.sealer ? product.sealer : "N/A"}
              />

              <SpecificationItem
                title="Cut to Size"
                value={product.cut_to_size ? "Yes" : "No"}
              />

              <SpecificationItem
                title="Origin"
                value={product.origin_country || "-"}
              />
            </div>
          </div>
        </section>

        {/* 3D Stone */}
        <section ref={setModelSectionElement}>
          <div className="max-w-[2000px] mx-auto px-6 xl:px-10 py-10">
            <div className="relative min-h-[270px] bg-[#f7f7f7]">
              <div className="absolute top-3 left-3 z-10 bg-black/70 text-white text-xs md:text-sm px-3 py-1.5 rounded-full backdrop-blur-sm">
                Click to interact with the 3D model
              </div>

              {shouldLoadModel ? (
                <Suspense
                  fallback={
                    <Loading />
                  }
                >
                  <ModelViewer
                    height={270}
                    poster={images[0]?.media_url}
                    finishes={product?.finishes_available}
                  />
                </Suspense>
              ) : (
                <div className="h-[270px] flex items-center justify-center">
                  <span className="text-sm text-[#777]">
                    3D model loading…
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* APPLICATIONS */}
        <section className="py-10 bg-white">
          <div
            className="
    max-w-[2000px]
    mx-auto
    px-6
    xl:px-10
    "
          >
            {/* HEADER */}

            <div
              className="
    flex
    flex-col
    sm:flex-row
    sm:items-center
    sm:justify-between
    gap-4
    mb-10
  "
            >
              <h2
                className="
    text-[26px]
    sm:text-[34px]
    md:text-[42px]
    uppercase
    tracking-[1px]
    text-[#161412]
    leading-tight
  "
                style={{
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                Applications
              </h2>
              <button
                onClick={handleDownloadDatasheet}
                className="
    px-4
    py-3
    bg-[#161412]
    text-white
    uppercase
    tracking-[1px]
    text-[12px]
    sm:text-[13px]
    hover:bg-[#2a2724]
    transition-all
    duration-300
    cursor-pointer
  "
              >
                Download Datasheet
              </button>
            </div>

            {/* CONTAINER */}

            <div
              className="
      border
      border-black/10
      overflow-hidden
      "
            >
              {/* APPLICATION GRID */}

              <div
                className="
        grid
        grid-cols-2
        md:grid-cols-3
        xl:grid-cols-4
        gap-y-14
        gap-x-8
        px-8
        py-14
        "
              >
                {applicationItems.map((item, index) => (
                  <ApplicationCard
                    key={index}
                    title={item.title}
                    value={item.value}
                    Icon={item.icon}
                  />
                ))}
              </div>

              {/* PERFORMANCE */}

              <div className="bg-[#ececea] px-8 py-12">
                <div
                  className="
          grid
          grid-cols-2
          md:grid-cols-4
          gap-y-10
          gap-x-8
          "
                >
                  {performanceItems.map((item, index) => (
                    <PerformanceCard
                      key={index}
                      title={item.title}
                      value={item.value}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SAFETY WARNING */}
        {silicaWarning && (
          <section className="py-8 bg-white">
            <div className="max-w-[2000px] mx-auto px-6 xl:px-10">
              <div
                className="
        bg-[#F4F4F4]
        px-4
        sm:px-6
        lg:px-10
        py-5
        flex
        flex-col
        lg:flex-row
        lg:items-center
        lg:justify-between
        gap-5
      "
              >
                {/* Warning Content */}
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-[20px] sm:text-[22px] shrink-0">
                    ⚠️
                  </span>

                  <p
                    className="
            text-[13px]
            sm:text-[14px]
            lg:text-[15px]
            leading-[1.6]
            text-[#1A1A1A]
          "
                    style={{
                      fontFamily: "Montserrat, sans-serif",
                    }}
                  >
                    <span className="font-bold text-[#D62828]">Warning:</span>{" "}
                    {silicaMessage}
                  </p>
                </div>

                {/* Download Button */}
                <button
                  // onClick={handleDownloadDatasheet}
                  onClick={handleDownloadSafetysheet}
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
                  Download Safety Datasheet
                </button>
              </div>
            </div>
          </section>
        )}

        {/* VARIATION */}
        <section className="pb-16 md:pb-20 bg-white">
          <div className="max-w-[2000px] mx-auto px-4 sm:px-6 xl:px-10">
            <h2
              className="
        text-[28px]
        sm:text-[34px]
        md:text-[42px]
        uppercase
        tracking-[1px]
        text-[#161412]
        mb-8
        md:mb-10
      "
              style={{
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Variation
            </h2>

            <div
              className="
        border
        border-black/10
        bg-[#f8f8f8]
        px-4
        md:px-8
        py-8
      "
            >
              {/* ALL 4 ALWAYS IN ONE ROW */}

              <div
                className="
          grid grid-cols-4 gap-3 md:gap-8 lg:gap-12 xl:gap-20 mb-8
        "
              >
                <VariationCard
                  title="V1"
                  level={1}
                  active={activeVariation === "V1"}
                />

                <VariationCard
                  title="V2"
                  level={2}
                  active={activeVariation === "V2"}
                />

                <VariationCard
                  title="V3"
                  level={3}
                  active={activeVariation === "V3"}
                />

                <VariationCard
                  title="V4"
                  level={4}
                  active={activeVariation === "V4"}
                />
              </div>

              {/* SCALE */}

              <div className="relative mt-2">
                <div className="relative mx-auto w-[92%]">
                  {/* MAIN LINE */}

                  <div className="h-[1px] bg-[#8f8f8f]" />

                  {/* LEFT END */}

                  <div
                    className="
        absolute
        left-0
        top-1/2
        -translate-y-1/2
        w-[1px]
        h-[18px]
        bg-[#8f8f8f]
      "
                  />

                  {/* RIGHT END */}

                  <div
                    className="
        absolute
        right-0
        top-1/2
        -translate-y-1/2
        w-[1px]
        h-[18px]
        bg-[#8f8f8f]
      "
                  />

                  {/* ACTIVE MARKER */}

                  <div
                    className="absolute -translate-x-1/2"
                    style={{
                      left: variationPositions[activeVariation],
                      top: "-30px",
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

        {/* FAQ */}
        {product?.faqs?.filter((item) => item.is_active)?.length > 0 && (
          <section className="pb-20 bg-white">
            <div className="max-w-[2000px] mx-auto px-6 xl:px-10">

              <div className="bg-[#f5f5f5] border border-[#d9d9d9] rounded-sm p-6 lg:p-10">

                <div className="grid lg:grid-cols-[340px_1fr] gap-10">

                  {/* LEFT */}
                  <div className="lg:pr-8">
                    <p className="text-[12px] uppercase tracking-[3px] text-[#9b9b9b] mb-4">
                      FAQ
                    </p>

                    <h2
                      className="text-[42px] leading-[1] font-semibold text-[#161412] mb-6"
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      Frequently Asked Questions
                    </h2>

                    <div className="w-[60px] h-[3px] bg-[#C91F26] mb-6" />

                    <p className="text-[15px] leading-[1.8] text-[#6b6b6b] max-w-[320px]">
                      Everything you need to know about this material, fabrication
                      requirements, maintenance and recommended applications.
                    </p>
                  </div>


                  {/* RIGHT */}
                  <div className="space-y-3">

                    {product.faqs
                      .filter((item) => item.is_active)
                      .sort((a, b) => a.sort_order - b.sort_order)
                      .map((faq, index) => {

                        const isOpen = openFaq === index;

                        return (
                          <div
                            key={faq.id}
                            className="
                      border
                      border-[#cfcfcf]
                      bg-white
                      overflow-hidden
                    "
                          >

                            <button
                              onClick={() =>
                                setOpenFaq(isOpen ? null : index)
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
                        ${isOpen
                                  ? "bg-[#4a4a4a] text-white"
                                  : "bg-white text-[#161412]"
                                }
                      `}
                            >

                              <span className="text-[13px] font-medium">
                                {index + 1}. {faq.question}
                              </span>

                              <span className="text-[18px]">
                                {isOpen ? "−" : "+"}
                              </span>

                            </button>


                            <div
                              className={`
                        overflow-hidden
                        transition-all
                        duration-300
                        ${isOpen
                                  ? "max-h-[300px]"
                                  : "max-h-0"
                                }
                      `}
                            >

                              <div
                                className="
                          px-5
                          py-4
                          text-[13px]
                          bg-[#4a4a4a]
                          text-white
                        "
                              >
                                {faq.answer}
                              </div>

                            </div>

                          </div>
                        );
                      })}

                  </div>

                </div>

              </div>

            </div>
          </section>
        )}

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && <section className="pb-24 bg-white">
          <div
            className="
    max-w-[2000px]
    mx-auto
    px-6
    xl:px-10
    "
          >
            {/* HEADER */}

            <div
              className="
      flex
      items-center
      justify-between
      gap-5
      mb-10
      "
            >
              <div className="flex-1">
                <h2
                  className="
          text-[20px]
          text-[#161412]
          mb-3
          "
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  Related Products
                </h2>

                <div className="w-full h-[1px] bg-black/10" />
              </div>

              {/* SCROLL BUTTONS */}

              {relatedProducts.length > 4 && (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    aria-label="Scroll related products left"
                    title="Previous related products"
                    onClick={scrollRelatedLeft}
                    className="
                              w-11
                              h-11
                              border
                              border-black/10
                              flex
                              items-center
                              justify-center
                              hover:bg-black
                              hover:text-white
                              transition-all
                              duration-300
                              "
                  >
                    <ChevronLeft size={18} strokeWidth={1.7} />
                  </button>

                  <button
                    type="button"
                    aria-label="Scroll related products right"
                    title="Next related products"
                    onClick={scrollRelatedRight}
                    className="
            w-11
            h-11
            border
            border-black/10
            flex
            items-center
            justify-center
            hover:bg-black
            hover:text-white
            transition-all
            duration-300
            "
                  >
                    <ChevronRight size={18} strokeWidth={1.7} />
                  </button>
                </div>
              )}
            </div>

            {/* SCROLLER */}

            <div
              ref={relatedScrollRef}
              className="
      flex
      gap-6
      overflow-x-auto
      scroll-smooth
      scrollbar-hide
      "
            >
              {relatedProducts.map((item) => (
                <RelatedProductCard
                  key={item.id}
                  item={item}
                  navigate={navigate}
                />
              ))}
            </div>
          </div>
        </section>}

      </div>


    </>
  );
};

export default ProductDetails;

const SpecificationItem = ({ title, value }) => {
  const formattedValue =
    typeof value === "string"
      ? value.split(",").map((item) => item.trim())
      : [value];

  return (
    <div>
      {/* TITLE */}

      <p
        className="
        text-[11px]
        font-medium
        text-[#161412]
        uppercase
        tracking-[1px]
        mb-3
        "
      >
        {title}
      </p>

      {/* LINE */}

      <div className="w-full h-[1px] bg-black/15 mb-4" />

      {/* VALUE */}

      <div
        className="
        text-[16px]
        text-[#2d2b28]
        space-y-1
        "
        style={{
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        {formattedValue?.length > 0 ? (
          formattedValue.map((item, index) => <p key={index}>{item}</p>)
        ) : (
          <p>-</p>
        )}
      </div>
    </div>
  );
};

const ApplicationCard = ({ title, value, Icon }) => {
  return (
    <div className="flex items-center gap-5">
      {/* ICON */}

      <div
        className="
        w-[58px]
        h-[58px]
        flex
        items-center
        justify-center
        text-[#161412]
        "
      >
        <img
          src={Icon}
          alt=""
          loading="lazy"
          decoding="async"
          width="58"
          height="58"
        />
      </div>

      {/* CONTENT */}

      <div>
        <h3
          className="
          text-[12px]
          uppercase
          tracking-[1px]
          font-semibold
          text-[#161412]
          leading-[1.5]
          "
          style={{
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          {title}
        </h3>

        <p
          className="
          text-[14px]
          text-[#666]
          mt-1
          "
          style={{
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          {value ? "Yes" : "No"}
        </p>
      </div>
    </div>
  );
};

const PerformanceCard = ({ title, value }) => {
  return (
    <div className="text-center">
      <h3
        className="
        text-[12px]
        uppercase
        tracking-[1px]
        font-semibold
        text-[#161412]
        mb-2
        "
        style={{
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        {title}
      </h3>

      <p
        className="
        text-[15px]
        text-[#666]
        uppercase
        "
        style={{
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        {value || "-"}
      </p>
    </div>
  );
};

const VariationCard = ({ title, level, active }) => {
  const getOpacity = (index) => {
    if (level === 1) {
      return "bg-[#d8d8d8]";
    }

    if (level === 2) {
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

      return shades[index];
    }

    if (level === 3) {
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

      return shades[index];
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

    return shades[index];
  };

  return (
    <div className="text-center">
      <h3
        className="
          text-[12px]
          md:text-[16px]
          text-[#161412]
          mb-3
        "
        style={{
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        {title}
      </h3>

      <div
        className={`
          inline-block
          p-[2px]
          ${active ? "border border-[#6e6e6e]" : ""}
        `}
      >
        <div className="grid grid-cols-3 gap-[1px] w-[72px] sm:w-[85px] md:w-[95px] lg:w-[110px] xl:w-[125px]">
          {[...Array(9)].map((_, index) => (
            <div
              key={index}
              className={`
                w-full
                aspect-square
                ${getOpacity(index)}
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const RelatedProductCard = ({ item, navigate }) => {
  return (
    <div
      onClick={() => navigate(`/product/${item.slug}`)}
      className="
      min-w-[320px]
      max-w-[320px]
      group
      cursor-pointer
      "
    >
      {/* IMAGE */}

      <div
        className="
        overflow-hidden
        bg-[#f5f5f5]
        mb-4
        "
      >
        <img
          src={
            item.closeup_image
              ? getOptimizedImageUrl(item.closeup_image, 480, 78)
              : "https://placehold.co/600x600"
          }
          srcSet={
            item.closeup_image
              ? `
        ${getOptimizedImageUrl(item.closeup_image, 320, 72)} 320w,
        ${getOptimizedImageUrl(item.closeup_image, 480, 78)} 480w,
        ${getOptimizedImageUrl(item.closeup_image, 640, 80)} 640w
      `
              : undefined
          }
          sizes="320px"
          alt={item.name}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
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

      {/* CATEGORY */}

      <p
        className="
        text-[12px]
        uppercase
        tracking-[0.5px]
        font-semibold
        text-[#161412]
        mb-1
        "
        style={{
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        {item.stone_group || "ULTRA STONES"}
      </p>

      {/* NAME */}

      <p
        className="
        text-[15px]
        text-[#4b4b4b]
        "
        style={{
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        {item.name}
      </p>
    </div>
  );
};

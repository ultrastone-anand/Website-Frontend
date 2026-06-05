import { useEffect, useRef, useState } from "react";

import { useParams , useNavigate } from "react-router-dom";

import axios from "axios";

import {
  ChevronLeft,
  ChevronRight,
  Flame,
  Waves,
  Bath,
  Building2,
  Sparkles,
  Sun,
  Table2,
  LayoutGrid,
  Home,
} from "lucide-react";

import Icons from "../assets/icons";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Loading from "../components/common/Loading";
import { generateDatasheet   } from "../utils/generateDatasheet";
import Social from "../components/common/socials";

const ProductDetails = () => {
  const { productSlug } = useParams();

  const [product, setProduct] = useState(null);

  const [activeImage, setActiveImage] = useState(0);

  const [zoomStyle, setZoomStyle] = useState({
    backgroundImage: "",
    backgroundPosition: "0% 0%",
    opacity: 0,
  });

  const [lensPosition, setLensPosition] = useState({
    x: 0,
    y: 0,
    visible: false,
  });

const navigate = useNavigate();

const [relatedProducts, setRelatedProducts] = useState([]);

const relatedScrollRef = useRef(null);

useEffect(() => {
  fetchProduct();
}, [productSlug]);


 const fetchProduct = async () => {
  try {
    const response = await axios.get(
      `http://localhost:5001/api/stones/productdetail/${productSlug}`,
    );

    const result = response.data;

    if (result.success) {
      setProduct(result.product);

      fetchRelatedProducts(
        result.product?.stone_categories?.slug,
        result.product?.slug,
      );
    }
  } catch (error) {
    console.error(error);
  }
};

const fetchRelatedProducts = async (
  categorySlug,
  currentSlug,
) => {
  try {
    const response = await axios.get(
      `http://localhost:5001/api/stones/${categorySlug}`,
    );

    const result = response.data;

    if (result.success) {
      const filteredProducts =
        result.products?.filter(
          (item) => item.slug !== currentSlug,
        ) || [];

      setRelatedProducts(filteredProducts);
    }
  } catch (error) {
    console.error(error);
  }
};

const scrollRelatedLeft = () => {
  if (relatedScrollRef.current) {
    relatedScrollRef.current.scrollBy({
      left: -420,
      behavior: "smooth",
    });
  }
};

const scrollRelatedRight = () => {
  if (relatedScrollRef.current) {
    relatedScrollRef.current.scrollBy({
      left: 420,
      behavior: "smooth",
    });
  }
};

  if (!product) {
    return (
      <div
        className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-[#ffffff]
        "
      >
        <Loading />
      </div>
    );
  }

  const closeupImages =
    product.media?.filter((item) => item.media_type === "CLOSEUP_IMAGE") || [];

  const slabImages =
    product.media?.filter((item) => item.media_type === "SLAB_IMAGE") || [];

  const applicationImages =
    product.media?.filter((item) => item.media_type === "APPLICATION_IMAGE") || [];

  const bookmatchslipmatch =
    product.media?.filter((item) => item.media_type === "BOOKMATCH_SLIPMATCH") || [];

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
    [ ...slabImages,...closeupImages,...applicationImages,...bookmatchslipmatch,...featuredvideo].length > 0
      ? [ ...slabImages,...closeupImages,...applicationImages,...bookmatchslipmatch,...featuredvideo]
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
      title: "Countertops / Vanities",
      value: product.countertops_vanities,
      icon: Icons.countertop,
    },

    {
      title: "Interior Floor",
      value: product.interior_floor,
      icon: Icons.interiorfloor,
    },

    {
      title: "Shower Wall",
      value: product.shower_wall,
      icon: Icons.showerwall,
    },

    {
      title: "Shower Floor",
      value: product.shower_floor,
      icon: Icons.showerfloor,
    },

    {
      title: "Exterior Floor",
      value: product.exterior_floor,
      icon: Icons.exetiorfloor,
    },

    {
      title: "Exterior Wall",
      value: product.exterior_wall,
      icon: Icons.exteriorwall,
    },

    {
      title: "Pool / Fountain",
      value: product.pool_fountain,
      icon: Icons.poolfountain,
    },

    {
      title: "Fireplace",
      value: product.fireplace,
      icon: Icons.fireplace,
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

  const applications = [
    {
      label: "Countertops",
      value: product.countertops_vanities,
    },

    {
      label: "Interior Floor",
      value: product.interior_floor,
    },

    {
      label: "Fireplace",
      value: product.fireplace,
    },

    {
      label: "Shower Wall",
      value: product.shower_wall,
    },

    {
      label: "Shower Floor",
      value: product.shower_floor,
    },

    {
      label: "Exterior Floor",
      value: product.exterior_floor,
    },

    {
      label: "Exterior Wall",
      value: product.exterior_wall,
    },

    {
      label: "Pool",
      value: product.pool_fountain,
    },

    {
      label: "Furniture",
      value: product.furniture_top,
    },
  ];



  const handleDownloadDatasheet = async () => {
  await generateDatasheet({
    product,
    closeupImages,
    images,
  });
};

  
  return (
    <>
      <Navbar />

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

            <h1
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
            </h1>

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
              Home / Material Portfolio /{" "}
              {product.stone_categories?.name || "Ultra Stones"} /{" "}
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
          "
                >
                  {activeMedia?.media_type === "FEATURED_VIDEO" ? (
                    <video
                      key={activeMedia.media_url}
                      className="
    w-full
    h-[520px]
    xl:h-[640px]
    object-cover
    "
                      autoPlay
                      muted
                      loop
                      controls
                      playsInline
                    >
                      <source src={activeMedia.media_url} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      src={activeMedia?.media_url}
                      alt={product.name}
                      className="
    w-full
    h-[520px]
    xl:h-[640px]
    object-cover
    "
                    />
                  )}

                  {/* ARROWS */}

                  {heroImages.length > 1 && (
                    <div>
                      <button
                        onClick={() =>
                          setActiveImage(
                            activeImage === 0
                              ? heroImages.length - 1
                              : activeImage - 1,
                          )
                        }
                        className="
      absolute
      left-5
      top-1/2
      -translate-y-1/2
      w-11
      h-11
      bg-white/90
      flex
      items-center
      justify-center
      text-black
      hover:bg-white
      transition-all
      duration-300
      "
                      >
                        <ChevronLeft size={20} strokeWidth={1.5} />
                      </button>

                      <button
                        onClick={() =>
                          setActiveImage(
                            activeImage === heroImages.length - 1
                              ? 0
                              : activeImage + 1,
                          )
                        }
                        className="
      absolute
      right-5
      top-1/2
      -translate-y-1/2
      w-11
      h-11
      bg-white/90
      flex
      items-center
      justify-center
      text-black
      hover:bg-white
      transition-all
      duration-300
      "
                      >
                        <ChevronRight size={20} strokeWidth={1.5} />
                      </button>
                    </div>
                  )}
                </div>
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
                  {product.long_description || product.small_description}
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
  "
>
  Order Samples

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
                      backgroundImage: `url(${images[0]?.media_url})`,
                      backgroundPosition: `${xPercent}% ${yPercent}%`,
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
                    src={images[0]?.media_url}
                    alt={product.name}
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
      w-[110px]
      h-[110px]
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
                        backgroundSize: "500%",
                        backgroundPosition: zoomStyle.backgroundPosition,
                      }}
                    />
                  )}
                </div>

                {/* TAGS */}

                <div className="flex items-center gap-3 flex-wrap">

                  <Social/>
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
                title="Translucent"
                value={product.translucent ? "Yes" : "No"}
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

        <section>
          <div
            className="
    max-w-[2000px]
    mx-auto
    px-6
    xl:px-10
    py-10
    "
          >
            <img
              src={images[0]?.media_url}
              alt={product.name}
              className="
            w-full
            h-[260px]
            object-cover
            "
            />
          </div>
        </section>

        {/* APPLICATIONS */}

        <section className="py-20 bg-white">
          <div
            className="
    max-w-[2000px]
    mx-auto
    px-6
    xl:px-10
    "
          >
            {/* HEADER */}

            <div className="flex items-center justify-between mb-10">
              <h2
                className="
        text-[34px]
        md:text-[42px]
        uppercase
        tracking-[1px]
        text-[#161412]
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
      px-3
      py-2
      bg-[#161412]
      text-white
      uppercase
      tracking-[1px]
      text-[13px]
      hover:bg-[#2a2724]
      transition-all
      duration-300
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

<section className="py-8 bg-white">
  <div className="max-w-[2000px] mx-auto px-6 xl:px-10">
    <div
      className="
        bg-[#F4F4F4]
        px-10
        py-5
        flex
        items-center
        justify-between
        gap-6
      "
    >
      {/* Left Content */}
      <div className="flex items-center gap-3 flex-1">
        <span className="text-[22px] shrink-0">
          ⚠️
        </span>

        <p
          className="
            text-[15px]
            leading-[1.45]
            text-[#1A1A1A]
            font-normal
          "
          style={{
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          <span className="font-bold text-[#D62828]">
            Warning:
          </span>{" "}
          {product.stone_categories?.name || "Ultra Quartz"} Surfaces are
          non-hazardous in finished form but can release hazardous dust during
          fabrication, requiring strict dust control and protective measures to
          prevent respiratory and health risks.
        </p>
      </div>

      {/* Right Button */}
      <button
        onClick={handleDownloadDatasheet}
        className="
          shrink-0
          border
          border-[#C92B2B]
          px-5
          py-2
          text-[11px]
          uppercase
          tracking-[0.5px]
          bg-white
          hover:bg-[#C92B2B]
          hover:text-white
          transition-all
        "
      >
        Download Safety Datasheet
      </button>
    </div>
  </div>
</section>

        {/* VARIATION */}

        <section className="pb-20 bg-white">
          <div
            className="
    max-w-[2000px]
    mx-auto
    px-6
    xl:px-10
    "
          >
            {/* HEADING */}

            <h2
              className="
      text-[34px]
      md:text-[42px]
      uppercase
      tracking-[1px]
      text-[#161412]
      mb-10
      "
              style={{
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Variation
            </h2>

            {/* BOX */}

            <div
              className="
      border
      border-black/10
      bg-[#f7f7f5]
      px-8
      py-10
      "
            >
              {/* GRID */}

              <div
                className="
        grid
        grid-cols-2
        md:grid-cols-4
        gap-10
        mb-12
        "
              >
                <VariationCard title="V1" level={1} />

                <VariationCard title="V2" level={2} />

                <VariationCard title="V3" level={3} />

                <VariationCard title="V4" level={4} />
              </div>

              {/* SCALE */}

              <div className="relative">
                {/* LINE */}

                <div className="h-[2px] bg-black/30 w-full" />

                {/* CENTER MARK */}

                <div
                  className="
          absolute
          left-1/2
          top-1/2
          -translate-x-1/2
          -translate-y-1/2
          w-[2px]
          h-[18px]
          bg-black/50
          "
                />

                {/* LABELS */}

                <div className="flex items-center justify-between mt-3">
                  <p
                    className="
            text-[14px]
            text-[#666]
            "
                  >
                    Low Variation
                  </p>

                  <p
                    className="
            text-[14px]
            text-[#666]
            "
                  >
                    High Variation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RELATED PRODUCTS */}

<section className="pb-24 bg-white">
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
</section>
      </div>

      <Footer />
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
          formattedValue.map((item, index) => (
            <p key={index}>
              {item}
            </p>
          ))
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
        <img src={Icon}></img>
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

const VariationCard = ({ title, level }) => {
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
      {/* TITLE */}

      <h3
        className="
        text-[18px]
        text-[#161412]
        mb-5
        "
        style={{
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        {title}
      </h3>

      {/* GRID */}

      <div className="grid grid-cols-3 gap-[2px] w-[154px] mx-auto">
        {[...Array(9)].map((_, index) => (
          <div
            key={index}
            className={`
              aspect-square
              ${getOpacity(index)}
            `}
          />
        ))}
      </div>
    </div>
  );
};

const RelatedProductCard = ({
  item,
  navigate,
}) => {
  return (
    <div
      onClick={() =>
        navigate(`/product/${item.slug}`)
      }
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
            item.closeup_image ||
            "https://placehold.co/600x600"
          }
          alt={item.name}
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

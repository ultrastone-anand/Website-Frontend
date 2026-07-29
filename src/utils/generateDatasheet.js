import jsPDF from "jspdf";
import QRCode from "qrcode";

import origin from "../assets/InfoStrip/origin.png";
import polish from "../assets/InfoStrip/polished.png";
import thickness from "../assets/InfoStrip/thickness.png";
import bookmatch from "../assets/InfoStrip/bookmatch.png";
import size from "../assets/InfoStrip/size.png";

import colourenhancing from "../assets/icons/colourenhancing.png";
import countertop from "../assets/icons/countertop.png";
import exteriorwall from "../assets/icons/exteriorwall.png";
import exteriorfloor from "../assets/icons/extetiorfloor.png";
import fireplace from "../assets/icons/fireplace.png";
import furnituretop from "../assets/icons/furnituretop.png";
import interiorfloor from "../assets/icons/interiorfloor.png";
import poolfountain from "../assets/icons/pool&fountain.png";
import showerfloor from "../assets/icons/showerfloor.png";
import showerwall from "../assets/icons/showerwall.png";

import crown from "../assets/specs/crown.png";
import cut from "../assets/specs/cut.png";
import sealer from "../assets/specs/sealer.png";
import trans from "../assets/specs/translucent.png";

import bleach from "../assets/maintaniance/bleach.png";
import clean from "../assets/maintaniance/clean.png";
import spray from "../assets/maintaniance/spray.png";
import cleanser from "../assets/maintaniance/cleanser.png";
import caution from "../assets/maintaniance/caution.png";

import uslogo from "../assets/uslogo.png";

const API_URL = import.meta.env.VITE_API_URL;

const HERO_MAX_WIDTH = 1400;
const HERO_MAX_HEIGHT = 600;
const HERO_JPEG_QUALITY = 0.72;

const imageCache = new Map();

const getMediaUrl = (product, type) =>
  product?.media?.find((media) => media.media_type === type)?.media_url;

/**
 * Builds a Cloudflare Image Resizing URL.
 *
 * Example:
 * https://cdn.ultrastone.in/image.jpg
 *
 * becomes:
 * https://cdn.ultrastone.in/cdn-cgi/image/width=1400,quality=72,fit=scale-down,format=auto/image.jpg
 */
const getCloudflareImageUrl = (
  originalUrl,
  {
    width = HERO_MAX_WIDTH,
    quality = 72,
    fit = "scale-down",
    format = "auto",
  } = {}
) => {
  if (!originalUrl) {
    return null;
  }

  try {
    const parsedUrl = new URL(originalUrl);

    // Avoid applying Cloudflare transformations more than once.
    if (parsedUrl.pathname.includes("/cdn-cgi/image/")) {
      return originalUrl;
    }

    const transformations = [
      `width=${width}`,
      `quality=${quality}`,
      `fit=${fit}`,
      `format=${format}`,
      "metadata=none",
    ].join(",");

    return `${parsedUrl.origin}/cdn-cgi/image/${transformations}${parsedUrl.pathname}${parsedUrl.search}`;
  } catch (error) {
    console.warn("Invalid media URL:", originalUrl, error);
    return originalUrl;
  }
};

/**
 * Makes sure the response from the backend is a complete data URL.
 */
const normalizeBase64DataUrl = (
  base64,
  contentType = "image/jpeg"
) => {
  if (!base64) {
    throw new Error("Image Base64 data is empty");
  }

  if (base64.startsWith("data:")) {
    return base64;
  }

  return `data:${contentType};base64,${base64}`;
};

/**
 * Loads a remote image through the backend Base64 proxy.
 */
const loadRemoteImageAsBase64 = async (url) => {
  if (!url) {
    throw new Error("Image URL is required");
  }

  const response = await fetch(
    `${API_URL}/stones/media/base64?url=${encodeURIComponent(url)}`
  );

  if (!response.ok) {
    throw new Error(
      `Failed to load image. Status: ${response.status}`
    );
  }

  const data = await response.json();

  return normalizeBase64DataUrl(
    data.base64,
    data.contentType ||
      data.content_type ||
      data.mimeType ||
      data.mime_type ||
      "image/jpeg"
  );
};

/**
 * Loads an image URL into an HTMLImageElement.
 */
const createImageElement = (src) =>
  new Promise((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);

    image.onerror = () => {
      reject(new Error(`Unable to decode image: ${src}`));
    };

    image.src = src;
  });

/**
 * Calculates resized dimensions while preserving aspect ratio.
 */
const calculateImageDimensions = ({
  width,
  height,
  maxWidth,
  maxHeight,
}) => {
  if (!width || !height) {
    return {
      width: maxWidth,
      height: maxHeight,
    };
  }

  const widthRatio = maxWidth / width;
  const heightRatio = maxHeight / height;

  const scale = Math.min(widthRatio, heightRatio, 1);

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
};

/**
 * Resizes and recompresses an image using Canvas.
 *
 * JPEG:
 * - Best for hero/slab photos.
 * - Much smaller PDF size.
 *
 * PNG:
 * - Used for transparent icons and logos.
 */
const optimizeImageDataUrl = async (
  source,
  {
    maxWidth = 1000,
    maxHeight = 1000,
    format = "image/jpeg",
    quality = 0.75,
    backgroundColor = null,
  } = {}
) => {
  if (!source) {
    return null;
  }

  const cacheKey = JSON.stringify({
    source,
    maxWidth,
    maxHeight,
    format,
    quality,
    backgroundColor,
  });

  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey);
  }

  const processingPromise = (async () => {
    const image = await createImageElement(source);

    const dimensions = calculateImageDimensions({
      width: image.naturalWidth || image.width,
      height: image.naturalHeight || image.height,
      maxWidth,
      maxHeight,
    });

    const canvas = document.createElement("canvas");

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const context = canvas.getContext("2d", {
      alpha: format === "image/png",
    });

    if (!context) {
      throw new Error("Could not create Canvas 2D context");
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    if (backgroundColor) {
      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    context.drawImage(
      image,
      0,
      0,
      dimensions.width,
      dimensions.height
    );

    return canvas.toDataURL(format, quality);
  })();

  imageCache.set(cacheKey, processingPromise);

  try {
    return await processingPromise;
  } catch (error) {
    imageCache.delete(cacheKey);
    throw error;
  }
};

/**
 * Loads the Cloudflare-optimized hero image first.
 * Falls back to the original URL when necessary.
 * Finally recompresses it as JPEG for the PDF.
 */
const loadOptimizedHeroImage = async (originalUrl) => {
  if (!originalUrl) {
    return null;
  }

  const optimizedUrl = getCloudflareImageUrl(originalUrl, {
    width: HERO_MAX_WIDTH,
    quality: 72,
    fit: "scale-down",
    format: "auto",
  });

  let sourceDataUrl = null;

  try {
    sourceDataUrl = await loadRemoteImageAsBase64(optimizedUrl);
  } catch (optimizedError) {
    console.warn(
      "Cloudflare optimized image failed. Using original image.",
      optimizedError
    );

    sourceDataUrl = await loadRemoteImageAsBase64(originalUrl);
  }

  return optimizeImageDataUrl(sourceDataUrl, {
    maxWidth: HERO_MAX_WIDTH,
    maxHeight: HERO_MAX_HEIGHT,
    format: "image/jpeg",
    quality: HERO_JPEG_QUALITY,
    backgroundColor: "#ffffff",
  });
};

/**
 * Optimizes local imported images.
 *
 * Transparent PNG is retained for icons.
 */
const optimizeLocalPng = (
  source,
  maxWidth = 96,
  maxHeight = 96
) =>
  optimizeImageDataUrl(source, {
    maxWidth,
    maxHeight,
    format: "image/png",
    quality: 1,
  });

/**
 * Adds an image to jsPDF using FAST compression.
 */
const addPdfImage = (
  pdf,
  image,
  format,
  x,
  y,
  width,
  height,
  alias
) => {
  if (!image) {
    return;
  }

  pdf.addImage(
    image,
    format,
    x,
    y,
    width,
    height,
    alias,
    "FAST"
  );
};

const formatRating = (value) => {
  if (!value) {
    return "-";
  }

  const normalizedValue = String(value).trim();

  return (
    normalizedValue.charAt(0).toUpperCase() +
    normalizedValue.slice(1).toLowerCase()
  );
};

const formatBoolean = (value) => (value ? "Yes" : "No");

const safeValue = (value, fallback = "-") => {
  if (
    value === null ||
    value === undefined ||
    String(value).trim() === ""
  ) {
    return fallback;
  }

  return String(value).trim();
};

export const generateDatasheet = async ({ product }) => {
  if (!product) {
    throw new Error("Product data is required");
  }

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
    putOnlyUsedFonts: true,
    precision: 2,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();

  const heroImageUrl =
    getMediaUrl(product, "CLOSEUP_IMAGE") ||
    getMediaUrl(product, "SLAB_IMAGE");

  /*
   * Prepare all images before drawing the PDF.
   *
   * Large photographic image:
   * JPEG with controlled dimensions and quality.
   *
   * Icons:
   * Small transparent PNGs matching their PDF display size.
   */
  const [
    heroBase64,
    logoImage,

    originIcon,
    polishIcon,
    thicknessIcon,
    bookmatchIcon,
    sizeIcon,

    colourEnhancingIcon,
    countertopIcon,
    furnitureTopIcon,
    fireplaceIcon,
    interiorFloorIcon,
    exteriorFloorIcon,
    exteriorWallIcon,
    poolFountainIcon,
    showerFloorIcon,
    showerWallIcon,

    translucentSpecIcon,
    cutIcon,
    crownIcon,
    sealerIcon,

    sprayIcon,
    cleanIcon,
    bleachIcon,
    cleanserIcon,
    cautionIcon,
  ] = await Promise.all([
    heroImageUrl
      ? loadOptimizedHeroImage(heroImageUrl).catch((error) => {
          console.error("Hero image could not be loaded:", error);
          return null;
        })
      : Promise.resolve(null),

    optimizeLocalPng(uslogo, 500, 180),

    optimizeLocalPng(origin, 72, 72),
    optimizeLocalPng(polish, 72, 72),
    optimizeLocalPng(thickness, 72, 72),
    optimizeLocalPng(bookmatch, 72, 72),
    optimizeLocalPng(size, 72, 72),

    optimizeLocalPng(colourenhancing, 72, 72),
    optimizeLocalPng(countertop, 72, 72),
    optimizeLocalPng(furnituretop, 72, 72),
    optimizeLocalPng(fireplace, 72, 72),
    optimizeLocalPng(interiorfloor, 72, 72),
    optimizeLocalPng(exteriorfloor, 72, 72),
    optimizeLocalPng(exteriorwall, 72, 72),
    optimizeLocalPng(poolfountain, 72, 72),
    optimizeLocalPng(showerfloor, 72, 72),
    optimizeLocalPng(showerwall, 72, 72),

    optimizeLocalPng(trans, 72, 72),
    optimizeLocalPng(cut, 72, 72),
    optimizeLocalPng(crown, 72, 72),
    optimizeLocalPng(sealer, 72, 72),

    optimizeLocalPng(spray, 48, 48),
    optimizeLocalPng(clean, 48, 48),
    optimizeLocalPng(bleach, 48, 48),
    optimizeLocalPng(cleanser, 48, 48),
    optimizeLocalPng(caution, 48, 48),
  ]);

  const categorySlug =
    product?.stone_categories?.slug || "stone";

  const productSlug = product?.slug || "";

  const qrUrl = `${window.location.origin}/product/${categorySlug}/${productSlug}`;

  const qrBase64 = await QRCode.toDataURL(qrUrl, {
    width: 250,
    margin: 1,
    errorCorrectionLevel: "M",
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });

  // =====================================================
  // HEADER
  // =====================================================

  addPdfImage(
    pdf,
    logoImage,
    "PNG",
    10,
    7,
    60,
    22,
    "us-logo"
  );

  pdf.setFillColor(90, 95, 98);
  pdf.rect(pageWidth - 34, 3, 26, 26, "F");

  pdf.setFillColor(255, 255, 255);
  pdf.rect(pageWidth - 32.5, 4.5, 23, 23, "F");

  addPdfImage(
    pdf,
    qrBase64,
    "PNG",
    pageWidth - 31.5,
    5.5,
    21,
    21,
    "product-qr"
  );

  // =====================================================
  // CATEGORY
  // =====================================================

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  pdf.setTextColor(110);

  pdf.text(
    safeValue(product?.stone_categories?.name, "").toUpperCase(),
    pageWidth / 2,
    37,
    {
      align: "center",
    }
  );

  // =====================================================
  // PRODUCT NAME
  // =====================================================

  pdf.setTextColor(0);
  pdf.setFontSize(22);
  pdf.setFont("times", "bold");

  pdf.text(
    safeValue(product.name, "STONE PRODUCT").toUpperCase(),
    pageWidth / 2,
    47,
    {
      align: "center",
      maxWidth: pageWidth - 40,
    }
  );

  // =====================================================
  // HERO IMAGE
  // =====================================================

  if (heroBase64) {
    addPdfImage(
      pdf,
      heroBase64,
      "JPEG",
      10,
      50,
      pageWidth - 20,
      74,
      "hero-image"
    );
  } else {
    pdf.setFillColor(242, 242, 242);
    pdf.rect(10, 50, pageWidth - 20, 74, "F");

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(130);

    pdf.text("IMAGE NOT AVAILABLE", pageWidth / 2, 87, {
      align: "center",
    });
  }

  // =====================================================
  // INFO STRIP
  // =====================================================

  let y = 127;

  pdf.setFillColor(245, 245, 245);
  pdf.rect(10, y, pageWidth - 20, 16, "F");

  const info = [
    {
      label: "Origin",
      value: safeValue(product.origin_country),
      icon: originIcon,
      alias: "info-origin",
    },
    {
      label: "Finish",
      value: safeValue(product.finishes_available?.[0]),
      icon: polishIcon,
      alias: "info-finish",
    },
    {
      label: "Thickness",
      value: safeValue(product.thicknesses_cm?.[0]),
      icon: thicknessIcon,
      alias: "info-thickness",
    },
    {
      label: "Pattern",
      value: safeValue(product.pattern),
      icon: bookmatchIcon,
      alias: "info-pattern",
    },
    {
      label: "Size",
      value: safeValue(product.average_sizes_inches?.[0]),
      icon: sizeIcon,
      alias: "info-size",
    },
  ];

  const stripWidth = pageWidth - 20;
  const itemWidth = stripWidth / info.length;
  const iconSize = 7;

  info.forEach((item, index) => {
    const startX = 10 + itemWidth * index;
    const centerX = startX + itemWidth / 2;

    addPdfImage(
      pdf,
      item.icon,
      "PNG",
      centerX - 18,
      y + 4,
      iconSize,
      iconSize,
      item.alias
    );

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(6);
    pdf.setTextColor(110);

    pdf.text(item.label, centerX - 8, y + 6);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(0);

    const infoValue = pdf.splitTextToSize(
      item.value,
      itemWidth - 12
    );

    pdf.text(infoValue.slice(0, 1), centerX - 8, y + 10);
  });

  // =====================================================
  // APPLICATIONS
  // =====================================================

  const sectionY = 146;
  const applicationsHeight = 55;

  pdf.setFillColor(255, 255, 255);
  pdf.setDrawColor(220, 220, 220);

  pdf.rect(
    10,
    sectionY,
    pageWidth - 20,
    applicationsHeight,
    "FD"
  );

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(0);

  pdf.text("APPLICATIONS", 15, sectionY + 10);

  const applications = [
    [
      "Color Enhancing",
      product.colour_enhancing,
      colourEnhancingIcon,
      "app-color-enhancing",
    ],
    [
      "Countertops / Vanities",
      product.countertops_vanities,
      countertopIcon,
      "app-countertop",
    ],
    [
      "Interior Floor",
      product.interior_floor,
      interiorFloorIcon,
      "app-interior-floor",
    ],
    [
      "Pool / Fountain",
      product.pool_fountain,
      poolFountainIcon,
      "app-pool-fountain",
    ],
    [
      "Shower Wall",
      product.shower_wall,
      showerWallIcon,
      "app-shower-wall",
    ],
    [
      "Furniture Top",
      product.furniture_top,
      furnitureTopIcon,
      "app-furniture-top",
    ],
    [
      "Fireplace / Interior Wall",
      product.fireplace,
      fireplaceIcon,
      "app-fireplace",
    ],
    [
      "Exterior Floor",
      product.exterior_floor,
      exteriorFloorIcon,
      "app-exterior-floor",
    ],
    [
      "Shower Floor",
      product.shower_floor,
      showerFloorIcon,
      "app-shower-floor",
    ],
    [
      "Exterior Wall",
      product.exterior_wall,
      exteriorWallIcon,
      "app-exterior-wall",
    ],
  ];

  const applicationColumns = 5;
  const applicationStartX = 15;
  const applicationStartY = sectionY + 22;
  const applicationContentWidth = pageWidth - 30;
  const applicationColumnWidth =
    applicationContentWidth / applicationColumns;

  applications.forEach(
    ([label, enabled, icon, alias], index) => {
      const row = Math.floor(index / applicationColumns);
      const column = index % applicationColumns;

      const centerX =
        applicationStartX +
        column * applicationColumnWidth +
        applicationColumnWidth / 2;

      const itemY = applicationStartY + row * 18;

      addPdfImage(
        pdf,
        icon,
        "PNG",
        centerX - 12,
        itemY - 4,
        iconSize,
        iconSize,
        alias
      );

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(5.7);
      pdf.setTextColor(70);

      const labelLines = pdf.splitTextToSize(
        label,
        applicationColumnWidth - 13
      );

      pdf.text(labelLines.slice(0, 1), centerX - 2, itemY);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(6.2);
      pdf.setTextColor(0);

      pdf.text(
        formatBoolean(enabled),
        centerX - 2,
        itemY + 4
      );
    }
  );

  // =====================================================
  // PERFORMANCE STRIP
  // =====================================================

  const performanceY = sectionY + applicationsHeight;
  const performanceHeight = 15;

  pdf.setFillColor(34, 49, 73);

  pdf.rect(
    10,
    performanceY,
    pageWidth - 20,
    performanceHeight,
    "F"
  );

  const ratings = [
    [
      "ABRASION RESISTANCE",
      formatRating(product.abrasion_resistance),
    ],
    [
      "HEAT RESISTANCE",
      formatRating(product.heat_resistance),
    ],
    [
      "MOVEMENT INDEX",
      formatRating(product.movement_index),
    ],
    [
      "STAIN RESISTANCE",
      formatRating(product.stain_resistance),
    ],
    [
      "UV RESISTANCE",
      formatRating(product.uv_resistance),
    ],
    [
      "ETCHING RESISTANCE",
      formatRating(product.etching_resistance),
    ],
    [
      "COLOR RANGE",
      formatRating(product.color_range),
    ],
  ];

  const ratingsStartX = 10;
  const ratingsWidth = pageWidth - 20;
  const ratingWidth = ratingsWidth / ratings.length;

  ratings.forEach((_, index) => {
    if (index === 0) {
      return;
    }

    const dividerX = ratingsStartX + index * ratingWidth;

    pdf.setDrawColor(120, 130, 145);
    pdf.setLineWidth(0.15);

    pdf.line(
      dividerX,
      performanceY + 2,
      dividerX,
      performanceY + performanceHeight - 2
    );
  });

  ratings.forEach(([label, value], index) => {
    const centerX =
      ratingsStartX +
      ratingWidth * index +
      ratingWidth / 2;

    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(255);
    pdf.setFontSize(4.8);

    pdf.text(label, centerX, performanceY + 5.5, {
      align: "center",
      maxWidth: ratingWidth - 3,
    });

    pdf.setFontSize(6);

    pdf.text(value, centerX, performanceY + 11, {
      align: "center",
    });
  });

  // =====================================================
  // SPECIFICATION
  // =====================================================

  const specificationY = performanceY + performanceHeight;
  const specificationHeight = 28;

  pdf.setFillColor(255, 255, 255);
  pdf.setDrawColor(220, 220, 220);

  pdf.rect(
    10,
    specificationY,
    pageWidth - 20,
    specificationHeight,
    "FD"
  );

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(11);
  pdf.setTextColor(0);

  pdf.text("SPECIFICATION", 15, specificationY + 10);

  const specifications = [
    [
      "Translucent",
      formatBoolean(product.translucent),
      translucentSpecIcon,
      "spec-translucent",
    ],
    [
      "Cut To Size",
      formatBoolean(product.cut_to_size),
      cutIcon,
      "spec-cut",
    ],
    [
      "Group",
      safeValue(product.stone_group),
      crownIcon,
      "spec-group",
    ],
    [
      "Sealer",
      safeValue(product.sealer),
      sealerIcon,
      "spec-sealer",
    ],
  ];

  const specificationContentWidth = pageWidth - 30;
  const specificationItemWidth =
    specificationContentWidth / specifications.length;

  specifications.forEach(
    ([label, value, icon, alias], index) => {
      const startX =
        15 + index * specificationItemWidth;

      const centerX =
        startX + specificationItemWidth / 2;

      const iconX = centerX - 18;

      addPdfImage(
        pdf,
        icon,
        "PNG",
        iconX,
        specificationY + 15,
        iconSize,
        iconSize,
        alias
      );

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(6);
      pdf.setTextColor(90);

      pdf.text(label, iconX + 12, specificationY + 18);

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(6.5);
      pdf.setTextColor(0);

      const valueLines = pdf.splitTextToSize(
        value,
        specificationItemWidth - 18
      );

      pdf.text(
        valueLines.slice(0, 1),
        iconX + 12,
        specificationY + 22
      );
    }
  );

  y = specificationY + specificationHeight + 3;

  // =====================================================
  // VARIATION AND MAINTENANCE
  // =====================================================

  const bottomY = y;
  const bottomGap = 5;
  const variationWidth = (pageWidth - 25) / 2;
  const maintenanceWidth = variationWidth;
  const cardHeight = 39;

  // =====================================================
  // VARIATION CARD
  // =====================================================

  pdf.setFillColor(255, 255, 255);
  pdf.setDrawColor(220, 220, 220);

  pdf.rect(
    10,
    bottomY,
    variationWidth,
    cardHeight,
    "FD"
  );

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.setTextColor(0);

  pdf.text("VARIATION", 15, bottomY + 8);

  const variationPatterns = {
    V1: [
      216, 216, 216,
      216, 216, 216,
      216, 216, 216,
    ],
    V2: [
      170, 210, 197,
      201, 199, 171,
      170, 196, 208,
    ],
    V3: [
      165, 208, 199,
      197, 189, 102,
      167, 189, 196,
    ],
    V4: [
      102, 180, 189,
      190, 196, 102,
      170, 102, 196,
    ],
  };

  const activeVariation = String(
    product.variation_level || "V1"
  ).toUpperCase();

  const variations = ["V1", "V2", "V3", "V4"];

  const cardInnerX = 15;
  const tileSize = 12;
  const tileGap = 0.3;

  const positions = [
    cardInnerX + 4,
    cardInnerX + 26,
    cardInnerX + 48,
    cardInnerX + 70,
  ];

  variations.forEach((variation, index) => {
    const startX = positions[index];
    const startY = bottomY + 18;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(6);
    pdf.setTextColor(40);

    pdf.text(
      variation,
      startX + tileSize / 2,
      bottomY + 14,
      {
        align: "center",
      }
    );

    if (variation === activeVariation) {
      pdf.setDrawColor(80);
      pdf.setLineWidth(0.4);

      pdf.rect(
        startX - 0.5,
        startY - 0.5,
        tileSize + 0.7,
        tileSize + 0.9
      );
    }

    const shades = variationPatterns[variation];

    shades.forEach((gray, shadeIndex) => {
      const row = Math.floor(shadeIndex / 3);
      const column = shadeIndex % 3;
      const squareSize = tileSize / 3;

      pdf.setFillColor(gray, gray, gray);

      pdf.rect(
        startX + column * squareSize,
        startY + row * squareSize,
        squareSize - tileGap,
        squareSize - tileGap,
        "F"
      );
    });
  });

  const scaleStartX = 20;
  const scaleEndX = variationWidth;
  const scaleY = bottomY + 33;

  pdf.setDrawColor(150);
  pdf.setLineWidth(0.25);

  pdf.line(scaleStartX, scaleY, scaleEndX, scaleY);

  pdf.line(
    scaleStartX,
    scaleY - 0.5,
    scaleStartX,
    scaleY + 0.5
  );

  pdf.line(
    scaleEndX,
    scaleY - 0.5,
    scaleEndX,
    scaleY + 0.5
  );

  const markerMap = {
    V1: scaleStartX,
    V2:
      scaleStartX +
      (scaleEndX - scaleStartX) * 0.33,
    V3:
      scaleStartX +
      (scaleEndX - scaleStartX) * 0.66,
    V4: scaleEndX,
  };

  const markerX =
    markerMap[activeVariation] || markerMap.V1;

  pdf.setFillColor(34, 49, 73);

  pdf.circle(markerX, scaleY, 1, "F");

  pdf.setFontSize(5);
  pdf.setTextColor(110);

  pdf.text("Low Variation", scaleStartX, scaleY + 5);

  pdf.text("High Variation", scaleEndX, scaleY + 5, {
    align: "right",
  });

  // =====================================================
  // MAINTENANCE CARD
  // =====================================================

  const maintenanceX =
    10 + variationWidth + bottomGap;

  pdf.setFillColor(34, 49, 73);

  pdf.rect(
    maintenanceX,
    bottomY,
    maintenanceWidth,
    cardHeight,
    "F"
  );

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(255);

  pdf.text(
    "MAINTENANCE & CARE",
    maintenanceX + 4,
    bottomY + 8
  );

  const maintenanceTips = [
    {
      icon: sprayIcon,
      alias: "care-spray",
      text:
        "For cleaning, use a neutral cleanser to scrub tile and grout.",
    },
    {
      icon: cleanIcon,
      alias: "care-clean",
      text:
        "Wipe up spills immediately. Dry with a soft towel or cloth.",
    },
    {
      icon: bleachIcon,
      alias: "care-bleach",
      text:
        "Do not use bleach, ammonia, acidic, citrus or harsh chemicals.",
    },
    {
      icon: cleanserIcon,
      alias: "care-cleanser",
      text:
        "Do not use gritty cleansers, abrasive scrubs or rough pads.",
    },
  ];

  maintenanceTips.forEach((tip, index) => {
    const itemY = bottomY + 14 + index * 6.5;

    addPdfImage(
      pdf,
      tip.icon,
      "PNG",
      maintenanceX + 4,
      itemY - 2,
      4,
      4,
      tip.alias
    );

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(4.6);
    pdf.setTextColor(255);

    const textLines = pdf.splitTextToSize(
      tip.text,
      maintenanceWidth - 16
    );

    pdf.text(
      textLines.slice(0, 2),
      maintenanceX + 10,
      itemY
    );
  });

  // =====================================================
  // WARNING STRIP
  // =====================================================

  const silicaWarning =
    product.silica_warning ??
    product.stone_categories?.silica_warning;

  const silicaMessage =
    product.silica_warning_message ||
    product.stone_categories?.silica_warning_message;

  if (silicaWarning && silicaMessage) {
    const warningY = bottomY + cardHeight + 5;

    addPdfImage(
      pdf,
      cautionIcon,
      "PNG",
      10,
      warningY - 2.8,
      4,
      4,
      "warning-caution"
    );

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(5.5);
    pdf.setTextColor(0);

    pdf.text("WARNING:", 16, warningY);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(5.2);

    const warningLines = pdf.splitTextToSize(
      String(silicaMessage).toUpperCase(),
      pageWidth - 40
    );

    pdf.text(
      warningLines.slice(0, 2),
      28,
      warningY
    );
  }

  const safeFileName = safeValue(
    product.name,
    "product"
  )
    .replace(/[<>:"/\\|?*]+/g, "")
    .replace(/\s+/g, "-");

  pdf.save(`${safeFileName}-datasheet.pdf`);
};
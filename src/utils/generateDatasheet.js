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

const API_URL =
  import.meta.env.VITE_API_URL;

/* =========================================================
   HERO CONFIG
========================================================= */

const HERO_RATIO =
  190 / 74;

const HERO_WIDTH =
  3200;

const HERO_HEIGHT =
  Math.round(
    HERO_WIDTH /
      HERO_RATIO,
  );

const HERO_QUALITY =
  92;

/* =========================================================
   CACHE
========================================================= */

const localImageCache =
  new Map();

const heroPromiseCache =
  new Map();

const qrPromiseCache =
  new Map();

/* =========================================================
   MEDIA
========================================================= */

const getMediaUrl = (
  product,
  type,
) =>
  product?.media?.find(
    (media) =>
      media.media_type ===
      type,
  )?.media_url;

/* =========================================================
   CLOUDFLARE
========================================================= */

const getCloudflareImageUrl = (
  originalUrl,
  {
    width,
    height,
    quality = 92,
    fit = "cover",
    format = "jpeg",
  } = {},
) => {
  if (!originalUrl) {
    return null;
  }

  try {
    const parsedUrl =
      new URL(
        originalUrl,
      );

    /*
     * Avoid transforming a URL
     * that has already gone through
     * Cloudflare image resizing.
     */
    if (
      parsedUrl.pathname.includes(
        "/cdn-cgi/image/",
      )
    ) {
      return originalUrl;
    }

    const transformations = [
      width &&
        `width=${width}`,

      height &&
        `height=${height}`,

      `quality=${quality}`,
      `fit=${fit}`,
      `format=${format}`,
      "metadata=none",
    ]
      .filter(Boolean)
      .join(",");

    return `${parsedUrl.origin}/cdn-cgi/image/${transformations}${parsedUrl.pathname}${parsedUrl.search}`;
  } catch (error) {
    console.warn(
      "Invalid media URL:",
      originalUrl,
      error,
    );

    return originalUrl;
  }
};

/* =========================================================
   BASE64
========================================================= */

const normalizeBase64DataUrl = (
  base64,
  contentType = "image/jpeg",
) => {
  if (!base64) {
    throw new Error(
      "Image Base64 data is empty",
    );
  }

  if (
    base64.startsWith(
      "data:",
    )
  ) {
    return base64;
  }

  return `data:${contentType};base64,${base64}`;
};

/* =========================================================
   REMOTE IMAGE
========================================================= */

const loadRemoteImageAsBase64 =
  async (url) => {
    if (!url) {
      throw new Error(
        "Image URL is required",
      );
    }

    const response =
      await fetch(
        `${API_URL}/stones/media/base64?url=${encodeURIComponent(
          url,
        )}`,
      );

    if (!response.ok) {
      throw new Error(
        `Failed to load image. Status: ${response.status}`,
      );
    }

    const data =
      await response.json();

    return normalizeBase64DataUrl(
      data.base64,

      data.contentType ||
        data.content_type ||
        data.mimeType ||
        data.mime_type ||
        "image/jpeg",
    );
  };

/* =========================================================
   LOCAL IMAGE LOADER

   IMPORTANT:
   No resizing.

   The original PNG resolution is preserved
   so icons remain sharp when the PDF is zoomed.
========================================================= */

const loadLocalImageAsDataUrl =
  async (source) => {
    if (!source) {
      return null;
    }

    if (
      localImageCache.has(
        source,
      )
    ) {
      return localImageCache.get(
        source,
      );
    }

    const promise =
      (async () => {
        const response =
          await fetch(
            source,
          );

        if (!response.ok) {
          throw new Error(
            `Unable to load local image. Status: ${response.status}`,
          );
        }

        const blob =
          await response.blob();

        return new Promise(
          (
            resolve,
            reject,
          ) => {
            const reader =
              new FileReader();

            reader.onload =
              () => {
                resolve(
                  reader.result,
                );
              };

            reader.onerror =
              () => {
                reject(
                  new Error(
                    "Unable to read local image",
                  ),
                );
              };

            reader.readAsDataURL(
              blob,
            );
          },
        );
      })();

    localImageCache.set(
      source,
      promise,
    );

    try {
      return await promise;
    } catch (error) {
      localImageCache.delete(
        source,
      );

      throw error;
    }
  };

/* =========================================================
   HERO IMAGE
========================================================= */

const loadOptimizedHeroImage =
  async (
    originalUrl,
  ) => {
    if (!originalUrl) {
      return null;
    }

    if (
      heroPromiseCache.has(
        originalUrl,
      )
    ) {
      return heroPromiseCache.get(
        originalUrl,
      );
    }

    const promise =
      (async () => {
        const optimizedUrl =
          getCloudflareImageUrl(
            originalUrl,
            {
              width:
                HERO_WIDTH,

              height:
                HERO_HEIGHT,

              quality:
                HERO_QUALITY,

              fit:
                "cover",

              format:
                "jpeg",
            },
          );

        try {
          return await loadRemoteImageAsBase64(
            optimizedUrl,
          );
        } catch (
          optimizedError
        ) {
          console.warn(
            "Optimized hero failed. Falling back to original:",
            optimizedError,
          );

          return await loadRemoteImageAsBase64(
            originalUrl,
          );
        }
      })();

    heroPromiseCache.set(
      originalUrl,
      promise,
    );

    try {
      return await promise;
    } catch (error) {
      heroPromiseCache.delete(
        originalUrl,
      );

      throw error;
    }
  };

/* =========================================================
   MULTI VALUE HELPERS
========================================================= */

const normalizeArrayValues = (
  values,
) => {
  if (
    values === null ||
    values === undefined
  ) {
    return ["-"];
  }

  const array =
    Array.isArray(values)
      ? values
      : [values];

  const cleaned =
    array.flatMap(
      (value) => {
        if (
          value === null ||
          value === undefined
        ) {
          return [];
        }

        const text =
          String(
            value,
          ).trim();

        if (!text) {
          return [];
        }

        return [text];
      },
    );

  return cleaned.length
    ? cleaned
    : ["-"];
};

/* =========================================================
   SIZE FORMATTER

   Handles:

   [
     "112 X 75 115 X 78"
   ]

   and converts it to:

   [
     "112 X 75",
     "115 X 78"
   ]
========================================================= */

const formatStoneSizes = (
  values,
) => {
  const sizes =
    normalizeArrayValues(
      values,
    );

  if (
    sizes.length === 1 &&
    sizes[0] === "-"
  ) {
    return sizes;
  }

  return sizes.flatMap(
    (value) => {
      const normalized =
        String(value)
          .replace(
            /×/g,
            "X",
          )
          .replace(
            /x/g,
            "X",
          )
          .trim();

      const matches =
        normalized.match(
          /\d+(?:\.\d+)?\s*X\s*\d+(?:\.\d+)?/g,
        );

      if (
        matches?.length
      ) {
        return matches.map(
          (matchedSize) =>
            matchedSize
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
   FIT TEXT TO WIDTH

   Keeps values such as:

   DUAL HONED/LEATHER

   on a single line without cutting them off.
========================================================= */

const getFittedFontSize = (
  pdf,
  text,
  maxWidth,
  {
    preferredSize = 8,
    minimumSize = 4.5,
  } = {},
) => {
  let fontSize =
    preferredSize;

  pdf.setFontSize(
    fontSize,
  );

  while (
    fontSize >
      minimumSize &&
    pdf.getTextWidth(
      String(text),
    ) > maxWidth
  ) {
    fontSize -=
      0.25;

    pdf.setFontSize(
      fontSize,
    );
  }

  return fontSize;
};

/* =========================================================
   FORMAT HELPERS
========================================================= */

const formatRating = (
  value,
) => {
  if (!value) {
    return "-";
  }

  const normalized =
    String(
      value,
    ).trim();

  return (
    normalized
      .charAt(0)
      .toUpperCase() +
    normalized
      .slice(1)
      .toLowerCase()
  );
};

const formatBoolean = (
  value,
) =>
  value
    ? "Yes"
    : "No";

const safeValue = (
  value,
  fallback = "-",
) => {
  if (
    value === null ||
    value === undefined ||
    String(
      value,
    ).trim() === ""
  ) {
    return fallback;
  }

  return String(
    value,
  ).trim();
};

/* =========================================================
   QR CODE
========================================================= */

const getQrCode =
  async (product) => {
    const categorySlug =
      product
        ?.stone_categories
        ?.slug ||
      "stone";

    const productSlug =
      product?.slug ||
      "";

    const qrUrl =
      `${window.location.origin}/product/${categorySlug}/${productSlug}`;

    if (
      qrPromiseCache.has(
        qrUrl,
      )
    ) {
      return qrPromiseCache.get(
        qrUrl,
      );
    }

    const promise =
      QRCode.toDataURL(
        qrUrl,
        {
          width: 300,

          margin: 1,

          errorCorrectionLevel:
            "M",

          color: {
            dark:
              "#000000",

            light:
              "#ffffff",
          },
        },
      );

    qrPromiseCache.set(
      qrUrl,
      promise,
    );

    try {
      return await promise;
    } catch (error) {
      qrPromiseCache.delete(
        qrUrl,
      );

      throw error;
    }
  };

/* =========================================================
   STATIC PDF ASSETS

   ORIGINAL RESOLUTION IS PRESERVED.
========================================================= */

const staticPdfAssetsPromise =
  Promise.all([
    /* LOGO */

    loadLocalImageAsDataUrl(
      uslogo,
    ),

    /* INFO */

    loadLocalImageAsDataUrl(
      origin,
    ),

    loadLocalImageAsDataUrl(
      polish,
    ),

    loadLocalImageAsDataUrl(
      thickness,
    ),

    loadLocalImageAsDataUrl(
      bookmatch,
    ),

    loadLocalImageAsDataUrl(
      size,
    ),

    /* APPLICATIONS */

    loadLocalImageAsDataUrl(
      colourenhancing,
    ),

    loadLocalImageAsDataUrl(
      countertop,
    ),

    loadLocalImageAsDataUrl(
      furnituretop,
    ),

    loadLocalImageAsDataUrl(
      fireplace,
    ),

    loadLocalImageAsDataUrl(
      interiorfloor,
    ),

    loadLocalImageAsDataUrl(
      exteriorfloor,
    ),

    loadLocalImageAsDataUrl(
      exteriorwall,
    ),

    loadLocalImageAsDataUrl(
      poolfountain,
    ),

    loadLocalImageAsDataUrl(
      showerfloor,
    ),

    loadLocalImageAsDataUrl(
      showerwall,
    ),

    /* SPECIFICATION */

    loadLocalImageAsDataUrl(
      trans,
    ),

    loadLocalImageAsDataUrl(
      cut,
    ),

    loadLocalImageAsDataUrl(
      crown,
    ),

    loadLocalImageAsDataUrl(
      sealer,
    ),

    /* MAINTENANCE */

    loadLocalImageAsDataUrl(
      spray,
    ),

    loadLocalImageAsDataUrl(
      clean,
    ),

    loadLocalImageAsDataUrl(
      bleach,
    ),

    loadLocalImageAsDataUrl(
      cleanser,
    ),

    loadLocalImageAsDataUrl(
      caution,
    ),
  ]);

/* =========================================================
   PRELOAD DATASHEET ASSETS
========================================================= */

export const preloadDatasheetHero =
  async (product) => {
    if (!product) {
      return null;
    }

    const heroImageUrl =
      getMediaUrl(
        product,
        "CLOSEUP_IMAGE",
      ) ||
      getMediaUrl(
        product,
        "SLAB_IMAGE",
      );

    try {
      await Promise.all([
        heroImageUrl
          ? loadOptimizedHeroImage(
              heroImageUrl,
            )
          : Promise.resolve(
              null,
            ),

        staticPdfAssetsPromise,

        getQrCode(
          product,
        ),
      ]);

      return true;
    } catch (error) {
      console.warn(
        "Datasheet preload failed:",
        error,
      );

      return null;
    }
  };

/* =========================================================
   PDF IMAGE
========================================================= */

const addPdfImage = (
  pdf,
  image,
  format,
  x,
  y,
  width,
  height,
  alias,
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

    /*
     * Preserve image quality.
     *
     * Especially important for
     * small line-art PNG icons.
     */
    "NONE",
  );
};

/* =========================================================
   GENERATE DATASHEET
========================================================= */

export const generateDatasheet =
  async ({ product }) => {
    if (!product) {
      throw new Error(
        "Product data is required",
      );
    }

    /* =====================================================
       START ALL ASSETS
    ===================================================== */

    const heroImageUrl =
      getMediaUrl(
        product,
        "CLOSEUP_IMAGE",
      ) ||
      getMediaUrl(
        product,
        "SLAB_IMAGE",
      );

    const [
      heroBase64,
      staticAssets,
      qrBase64,
    ] =
      await Promise.all([
        heroImageUrl
          ? loadOptimizedHeroImage(
              heroImageUrl,
            ).catch(
              (error) => {
                console.error(
                  "Hero image could not be loaded:",
                  error,
                );

                return null;
              },
            )
          : Promise.resolve(
              null,
            ),

        staticPdfAssetsPromise,

        getQrCode(
          product,
        ),
      ]);

    /* =====================================================
       PDF
    ===================================================== */

    const pdf =
      new jsPDF({
        orientation:
          "portrait",

        unit: "mm",

        format: "a4",

        compress: true,

        putOnlyUsedFonts:
          true,

        precision: 2,
      });

    const pageWidth =
      pdf.internal.pageSize.getWidth();

    const [
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
    ] =
      staticAssets;

    /* =====================================================
       HEADER
    ===================================================== */

    addPdfImage(
      pdf,
      logoImage,
      "PNG",

      10,
      7,

      60,
      22,

      "us-logo",
    );

    pdf.setFillColor(
      90,
      95,
      98,
    );

    pdf.rect(
      pageWidth -
        34,

      3,

      26,
      26,

      "F",
    );

    pdf.setFillColor(
      255,
      255,
      255,
    );

    pdf.rect(
      pageWidth -
        32.5,

      4.5,

      23,
      23,

      "F",
    );

    addPdfImage(
      pdf,
      qrBase64,
      "PNG",

      pageWidth -
        31.5,

      5.5,

      21,
      21,

      "product-qr",
    );

    /* =====================================================
       CATEGORY
    ===================================================== */

    pdf.setFont(
      "helvetica",
      "normal",
    );

    pdf.setFontSize(
      12,
    );

    pdf.setTextColor(
      110,
    );

    pdf.text(
      safeValue(
        product
          ?.stone_categories
          ?.name,
        "",
      ).toUpperCase(),

      pageWidth / 2,

      37,

      {
        align:
          "center",
      },
    );

    /* =====================================================
       PRODUCT NAME
    ===================================================== */

    pdf.setTextColor(
      0,
    );

    pdf.setFontSize(
      22,
    );

    pdf.setFont(
      "times",
      "bold",
    );

    pdf.text(
      safeValue(
        product.name,
        "STONE PRODUCT",
      ).toUpperCase(),

      pageWidth / 2,

      47,

      {
        align:
          "center",

        maxWidth:
          pageWidth -
          40,
      },
    );

    /* =====================================================
       HERO IMAGE
    ===================================================== */

    if (heroBase64) {
      addPdfImage(
        pdf,
        heroBase64,
        "JPEG",

        10,
        50,

        pageWidth -
          20,

        74,

        "hero-image",
      );
    } else {
      pdf.setFillColor(
        242,
        242,
        242,
      );

      pdf.rect(
        10,
        50,

        pageWidth -
          20,

        74,

        "F",
      );

      pdf.setFont(
        "helvetica",
        "normal",
      );

      pdf.setFontSize(
        10,
      );

      pdf.setTextColor(
        130,
      );

      pdf.text(
        "IMAGE NOT AVAILABLE",

        pageWidth / 2,

        87,

        {
          align:
            "center",
        },
      );
    }

    /* =====================================================
       INFO STRIP
    ===================================================== */

    let y = 127;

    pdf.setFillColor(
      245,
      245,
      245,
    );

    pdf.rect(
      10,
      y,

      pageWidth -
        20,

      16,

      "F",
    );

    const info = [
      {
        label:
          "Origin",

        values:
          normalizeArrayValues(
            product.origin_country,
          ),

        icon:
          originIcon,

        alias:
          "info-origin",
      },

      {
        label:
          "Finish",

        values:
          normalizeArrayValues(
            product.finishes_available,
          ),

        icon:
          polishIcon,

        alias:
          "info-finish",
      },

      {
        label:
          "Thickness",

        values:
          normalizeArrayValues(
            product.thicknesses_cm,
          ),

        icon:
          thicknessIcon,

        alias:
          "info-thickness",
      },

      {
        label:
          "Pattern",

        values:
          normalizeArrayValues(
            product.pattern,
          ),

        icon:
          bookmatchIcon,

        alias:
          "info-pattern",
      },

      {
        label:
          "Size",

        values:
          formatStoneSizes(
            product.average_sizes_inches,
          ),

        icon:
          sizeIcon,

        alias:
          "info-size",
      },
    ];

    const stripWidth =
      pageWidth -
      20;

    const itemWidth =
      stripWidth /
      info.length;

    const iconSize =
      7.5;

    info.forEach(
      (
        item,
        index,
      ) => {
        const startX =
          10 +
          itemWidth *
            index;

        const centerX =
          startX +
          itemWidth /
            2;

        const iconX =
          centerX -
          18;

        const textX =
          centerX -
          8;

        /* ===============================================
           ICON
        =============================================== */

        addPdfImage(
          pdf,
          item.icon,
          "PNG",

          iconX,

          y + 4.2,

          iconSize,
          iconSize,

          item.alias,
        );

        /* ===============================================
           LABEL
        =============================================== */

        pdf.setFont(
          "helvetica",
          "normal",
        );

        pdf.setFontSize(
          5.7,
        );

        pdf.setTextColor(
          110,
        );

        pdf.text(
          item.label,

          textX,

          y + 5.2,
        );

        /* ===============================================
           VALUES
        =============================================== */

        const values =
          item.values?.length
            ? item.values
            : ["-"];

        /*
         * Existing info bar comfortably
         * supports up to 3 values.
         */
        const visibleValues =
          values.slice(
            0,
            3,
          );

        let preferredFontSize =
          8.4;

        let lineHeight =
          3.3;

        if (
          visibleValues.length ===
          2
        ) {
          preferredFontSize =
            7.2;

          lineHeight =
            3.15;
        }

        if (
          visibleValues.length >=
          3
        ) {
          preferredFontSize =
            6.2;

          lineHeight =
            2.75;
        }

        const valueStartY =
          y + 9.6;

        const maxTextWidth =
          itemWidth -
          11;

        pdf.setFont(
          "helvetica",
          "bold",
        );

        pdf.setTextColor(
          0,
        );

        visibleValues.forEach(
          (
            value,
            valueIndex,
          ) => {
            const fittedSize =
              getFittedFontSize(
                pdf,

                String(
                  value,
                ),

                maxTextWidth,

                {
                  preferredSize:
                    preferredFontSize,

                  minimumSize:
                    4.4,
                },
              );

            pdf.setFontSize(
              fittedSize,
            );

            pdf.text(
              String(
                value,
              ),

              textX,

              valueStartY +
                valueIndex *
                  lineHeight,
            );
          },
        );
      },
    );

    /* =====================================================
       APPLICATIONS
    ===================================================== */

    const sectionY =
      146;

    const applicationsHeight =
      55;

    pdf.setFillColor(
      255,
      255,
      255,
    );

    pdf.setDrawColor(
      220,
      220,
      220,
    );

    pdf.rect(
      10,
      sectionY,

      pageWidth -
        20,

      applicationsHeight,

      "FD",
    );

    pdf.setFont(
      "helvetica",
      "bold",
    );

    pdf.setFontSize(
      11,
    );

    pdf.setTextColor(
      0,
    );

    pdf.text(
      "APPLICATIONS",

      15,

      sectionY +
        10,
    );

    const applications = [
      [
        "Color Enhancing",

        product.colour_enhancing ??
          product.color_enhancing,

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

        product.fireplace ??
          product.interior_wall,

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

    const applicationColumns =
      5;

    const applicationStartX =
      15;

    const applicationStartY =
      sectionY +
      22;

    const applicationContentWidth =
      pageWidth -
      30;

    const applicationColumnWidth =
      applicationContentWidth /
      applicationColumns;

    applications.forEach(
      (
        [
          label,
          enabled,
          icon,
          alias,
        ],

        index,
      ) => {
        const row =
          Math.floor(
            index /
              applicationColumns,
          );

        const column =
          index %
          applicationColumns;

        const centerX =
          applicationStartX +
          column *
            applicationColumnWidth +
          applicationColumnWidth /
            2;

        const itemY =
          applicationStartY +
          row * 18;

        addPdfImage(
          pdf,
          icon,
          "PNG",

          centerX -
            12,

          itemY -
            4,

          iconSize,
          iconSize,

          alias,
        );

        pdf.setFont(
          "helvetica",
          "normal",
        );

        pdf.setFontSize(
          5.7,
        );

        pdf.setTextColor(
          70,
        );

        const labelLines =
          pdf.splitTextToSize(
            label,

            applicationColumnWidth -
              13,
          );

        pdf.text(
          labelLines.slice(
            0,
            1,
          ),

          centerX -
            2,

          itemY,
        );

        pdf.setFont(
          "helvetica",
          "bold",
        );

        pdf.setFontSize(
          6.2,
        );

        pdf.setTextColor(
          0,
        );

        pdf.text(
          formatBoolean(
            enabled,
          ),

          centerX -
            2,

          itemY +
            4,
        );
      },
    );

    /* =====================================================
       PERFORMANCE
    ===================================================== */

    const performanceY =
      sectionY +
      applicationsHeight;

    const performanceHeight =
      15;

    pdf.setFillColor(
      34,
      49,
      73,
    );

    pdf.rect(
      10,
      performanceY,

      pageWidth -
        20,

      performanceHeight,

      "F",
    );

    const ratings = [
      [
        "ABRASION RESISTANCE",

        formatRating(
          product.abrasion_resistance,
        ),
      ],

      [
        "HEAT RESISTANCE",

        formatRating(
          product.heat_resistance,
        ),
      ],

      [
        "MOVEMENT INDEX",

        formatRating(
          product.movement_index,
        ),
      ],

      [
        "STAIN RESISTANCE",

        formatRating(
          product.stain_resistance,
        ),
      ],

      [
        "UV RESISTANCE",

        formatRating(
          product.uv_resistance,
        ),
      ],

      [
        "ETCHING RESISTANCE",

        formatRating(
          product.etching_resistance,
        ),
      ],

      [
        "COLOR RANGE",

        formatRating(
          product.color_range,
        ),
      ],
    ];

    const ratingsStartX =
      10;

    const ratingsWidth =
      pageWidth -
      20;

    const ratingWidth =
      ratingsWidth /
      ratings.length;

    ratings.forEach(
      (
        _,
        index,
      ) => {
        if (
          index === 0
        ) {
          return;
        }

        const dividerX =
          ratingsStartX +
          index *
            ratingWidth;

        pdf.setDrawColor(
          120,
          130,
          145,
        );

        pdf.setLineWidth(
          0.15,
        );

        pdf.line(
          dividerX,

          performanceY +
            2,

          dividerX,

          performanceY +
            performanceHeight -
            2,
        );
      },
    );

    ratings.forEach(
      (
        [
          label,
          value,
        ],

        index,
      ) => {
        const centerX =
          ratingsStartX +
          ratingWidth *
            index +
          ratingWidth /
            2;

        pdf.setFont(
          "helvetica",
          "bold",
        );

        pdf.setTextColor(
          255,
        );

        pdf.setFontSize(
          4.8,
        );

        pdf.text(
          label,

          centerX,

          performanceY +
            5.5,

          {
            align:
              "center",

            maxWidth:
              ratingWidth -
              3,
          },
        );

        pdf.setFontSize(
          6,
        );

        pdf.text(
          value,

          centerX,

          performanceY +
            11,

          {
            align:
              "center",
          },
        );
      },
    );

    /* =====================================================
       SPECIFICATION
    ===================================================== */

    const specificationY =
      performanceY +
      performanceHeight;

    const specificationHeight =
      28;

    pdf.setFillColor(
      255,
      255,
      255,
    );

    pdf.setDrawColor(
      220,
      220,
      220,
    );

    pdf.rect(
      10,
      specificationY,

      pageWidth -
        20,

      specificationHeight,

      "FD",
    );

    pdf.setFont(
      "helvetica",
      "bold",
    );

    pdf.setFontSize(
      11,
    );

    pdf.setTextColor(
      0,
    );

    pdf.text(
      "SPECIFICATION",

      15,

      specificationY +
        10,
    );

    const specifications = [
      [
        "Translucent",

        formatBoolean(
          product.translucent,
        ),

        translucentSpecIcon,

        "spec-translucent",
      ],

      [
        "Cut To Size",

        formatBoolean(
          product.cut_to_size,
        ),

        cutIcon,

        "spec-cut",
      ],

      [
        "Group",

        safeValue(
          product.stone_group,
        ),

        crownIcon,

        "spec-group",
      ],

      [
        "Sealer",

        safeValue(
          product.sealer,
        ),

        sealerIcon,

        "spec-sealer",
      ],
    ];

    const specificationContentWidth =
      pageWidth -
      30;

    const specificationItemWidth =
      specificationContentWidth /
      specifications.length;

    specifications.forEach(
      (
        [
          label,
          value,
          icon,
          alias,
        ],

        index,
      ) => {
        const startX =
          15 +
          index *
            specificationItemWidth;

        const centerX =
          startX +
          specificationItemWidth /
            2;

        const iconX =
          centerX -
          18;

        addPdfImage(
          pdf,
          icon,
          "PNG",

          iconX,

          specificationY +
            15,

          iconSize,
          iconSize,

          alias,
        );

        pdf.setFont(
          "helvetica",
          "normal",
        );

        pdf.setFontSize(
          6,
        );

        pdf.setTextColor(
          90,
        );

        pdf.text(
          label,

          iconX +
            12,

          specificationY +
            18,
        );

        pdf.setFont(
          "helvetica",
          "bold",
        );

        pdf.setFontSize(
          6.5,
        );

        pdf.setTextColor(
          0,
        );

        const valueLines =
          pdf.splitTextToSize(
            value,

            specificationItemWidth -
              18,
          );

        pdf.text(
          valueLines.slice(
            0,
            1,
          ),

          iconX +
            12,

          specificationY +
            22,
        );
      },
    );

    y =
      specificationY +
      specificationHeight +
      3;

    /* =====================================================
       BOTTOM
    ===================================================== */

    const bottomY = y;

    const bottomGap =
      5;

    const variationWidth =
      (pageWidth -
        25) /
      2;

    const maintenanceWidth =
      variationWidth;

    const cardHeight =
      39;

    /* =====================================================
       VARIATION
    ===================================================== */

    pdf.setFillColor(
      255,
      255,
      255,
    );

    pdf.setDrawColor(
      220,
      220,
      220,
    );

    pdf.rect(
      10,
      bottomY,

      variationWidth,
      cardHeight,

      "FD",
    );

    pdf.setFont(
      "helvetica",
      "bold",
    );

    pdf.setFontSize(
      10,
    );

    pdf.setTextColor(
      0,
    );

    pdf.text(
      "VARIATION",

      15,

      bottomY +
        8,
    );

    const variationPatterns = {
      V1: [
        216,
        216,
        216,

        216,
        216,
        216,

        216,
        216,
        216,
      ],

      V2: [
        170,
        210,
        197,

        201,
        199,
        171,

        170,
        196,
        208,
      ],

      V3: [
        165,
        208,
        199,

        197,
        189,
        102,

        167,
        189,
        196,
      ],

      V4: [
        102,
        180,
        189,

        190,
        196,
        102,

        170,
        102,
        196,
      ],
    };

    const activeVariation =
      String(
        product.variation_level ||
          "V1",
      ).toUpperCase();

    const variations = [
      "V1",
      "V2",
      "V3",
      "V4",
    ];

    const cardInnerX =
      15;

    const tileSize =
      12;

    const tileGap =
      0.3;

    const positions = [
      cardInnerX +
        4,

      cardInnerX +
        26,

      cardInnerX +
        48,

      cardInnerX +
        70,
    ];

    variations.forEach(
      (
        variation,
        index,
      ) => {
        const startX =
          positions[
            index
          ];

        const startY =
          bottomY +
          18;

        pdf.setFont(
          "helvetica",
          "normal",
        );

        pdf.setFontSize(
          6,
        );

        pdf.setTextColor(
          40,
        );

        pdf.text(
          variation,

          startX +
            tileSize /
              2,

          bottomY +
            14,

          {
            align:
              "center",
          },
        );

        if (
          variation ===
          activeVariation
        ) {
          pdf.setDrawColor(
            80,
          );

          pdf.setLineWidth(
            0.4,
          );

          pdf.rect(
            startX -
              0.5,

            startY -
              0.5,

            tileSize +
              0.7,

            tileSize +
              0.9,
          );
        }

        const shades =
          variationPatterns[
            variation
          ];

        shades.forEach(
          (
            gray,
            shadeIndex,
          ) => {
            const row =
              Math.floor(
                shadeIndex /
                  3,
              );

            const column =
              shadeIndex %
              3;

            const squareSize =
              tileSize /
              3;

            pdf.setFillColor(
              gray,
              gray,
              gray,
            );

            pdf.rect(
              startX +
                column *
                  squareSize,

              startY +
                row *
                  squareSize,

              squareSize -
                tileGap,

              squareSize -
                tileGap,

              "F",
            );
          },
        );
      },
    );

    const scaleStartX =
      20;

    const scaleEndX =
      variationWidth;

    const scaleY =
      bottomY +
      33;

    pdf.setDrawColor(
      150,
    );

    pdf.setLineWidth(
      0.25,
    );

    pdf.line(
      scaleStartX,
      scaleY,
      scaleEndX,
      scaleY,
    );

    pdf.line(
      scaleStartX,

      scaleY -
        0.5,

      scaleStartX,

      scaleY +
        0.5,
    );

    pdf.line(
      scaleEndX,

      scaleY -
        0.5,

      scaleEndX,

      scaleY +
        0.5,
    );

    const markerMap = {
      V1:
        scaleStartX,

      V2:
        scaleStartX +
        (scaleEndX -
          scaleStartX) *
          0.33,

      V3:
        scaleStartX +
        (scaleEndX -
          scaleStartX) *
          0.66,

      V4:
        scaleEndX,
    };

    const markerX =
      markerMap[
        activeVariation
      ] ||
      markerMap.V1;

    pdf.setFillColor(
      34,
      49,
      73,
    );

    pdf.circle(
      markerX,
      scaleY,
      1,
      "F",
    );

    pdf.setFontSize(
      5,
    );

    pdf.setTextColor(
      110,
    );

    pdf.text(
      "Low Variation",

      scaleStartX,

      scaleY +
        5,
    );

    pdf.text(
      "High Variation",

      scaleEndX,

      scaleY +
        5,

      {
        align:
          "right",
      },
    );

    /* =====================================================
       MAINTENANCE
    ===================================================== */

    const maintenanceX =
      10 +
      variationWidth +
      bottomGap;

    pdf.setFillColor(
      34,
      49,
      73,
    );

    pdf.rect(
      maintenanceX,
      bottomY,

      maintenanceWidth,
      cardHeight,

      "F",
    );

    pdf.setFont(
      "helvetica",
      "bold",
    );

    pdf.setFontSize(
      9,
    );

    pdf.setTextColor(
      255,
    );

    pdf.text(
      "MAINTENANCE & CARE",

      maintenanceX +
        4,

      bottomY +
        8,
    );

    const maintenanceTips = [
      {
        icon:
          sprayIcon,

        alias:
          "care-spray",

        text:
          "For cleaning, use a neutral cleanser to scrub tile and grout.",
      },

      {
        icon:
          cleanIcon,

        alias:
          "care-clean",

        text:
          "Wipe up spills immediately. Dry with a soft towel or cloth.",
      },

      {
        icon:
          bleachIcon,

        alias:
          "care-bleach",

        text:
          "Do not use bleach, ammonia, acidic, citrus or harsh chemicals.",
      },

      {
        icon:
          cleanserIcon,

        alias:
          "care-cleanser",

        text:
          "Do not use gritty cleansers, abrasive scrubs or rough pads.",
      },
    ];

    maintenanceTips.forEach(
      (
        tip,
        index,
      ) => {
        const itemY =
          bottomY +
          14 +
          index *
            6.5;

        addPdfImage(
          pdf,
          tip.icon,
          "PNG",

          maintenanceX +
            4,

          itemY -
            2,

          4,
          4,

          tip.alias,
        );

        pdf.setFont(
          "helvetica",
          "normal",
        );

        pdf.setFontSize(
          4.6,
        );

        pdf.setTextColor(
          255,
        );

        const textLines =
          pdf.splitTextToSize(
            tip.text,

            maintenanceWidth -
              16,
          );

        pdf.text(
          textLines.slice(
            0,
            2,
          ),

          maintenanceX +
            10,

          itemY,
        );
      },
    );

    /* =====================================================
       WARNING
    ===================================================== */

    const silicaWarning =
      product.silica_warning ??
      product
        .stone_categories
        ?.silica_warning;

    const silicaMessage =
      product
        .silica_warning_message ||
      product
        .stone_categories
        ?.silica_warning_message;

    if (
      silicaWarning &&
      silicaMessage
    ) {
      const warningY =
        bottomY +
        cardHeight +
        5;

      addPdfImage(
        pdf,
        cautionIcon,
        "PNG",

        10,

        warningY -
          2.8,

        4,
        4,

        "warning-caution",
      );

      pdf.setFont(
        "helvetica",
        "bold",
      );

      pdf.setFontSize(
        5.5,
      );

      pdf.setTextColor(
        0,
      );

      pdf.text(
        "WARNING:",

        16,

        warningY,
      );

      pdf.setFont(
        "helvetica",
        "normal",
      );

      pdf.setFontSize(
        5.2,
      );

      const warningLines =
        pdf.splitTextToSize(
          String(
            silicaMessage,
          ).toUpperCase(),

          pageWidth -
            40,
        );

      pdf.text(
        warningLines.slice(
          0,
          2,
        ),

        28,

        warningY,
      );
    }

    /* =====================================================
       SAVE
    ===================================================== */

    const safeFileName =
      safeValue(
        product.name,
        "product",
      )
        .replace(
          /[<>:"/\\|?*]+/g,
          "",
        )
        .replace(
          /\s+/g,
          "-",
        );

    pdf.save(
      `${safeFileName}-datasheet.pdf`,
    );
  };
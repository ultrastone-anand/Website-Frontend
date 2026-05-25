// src/utils/generateDatasheet.js

import jsPDF from "jspdf";

// --------------------------------------------------
// CONVERT IMAGE URL TO BASE64
// --------------------------------------------------

const toDataURL = async (url) => {
  try {
    const response = await fetch(url);

    const blob = await response.blob();

    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        resolve(reader.result);
      };

      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.log("IMAGE CONVERSION ERROR:", error);

    return null;
  }
};

// --------------------------------------------------
// TRAFFIC LIGHT INDICATOR
// --------------------------------------------------

const drawGauge = (
  doc,
  x,
  y,
  label,
  level = "medium"
) => {
  // CARD BG
  doc.setFillColor(232, 232, 232);

  doc.rect(x, y, 44, 18, "F");

  // TITLE
  doc.setTextColor(20, 20, 20);

  doc.setFont("helvetica", "bold");

  doc.setFontSize(6.8);

  doc.text(label, x + 22, y + 4.5, {
    align: "center",
    maxWidth: 38,
  });

  // LIGHTS
  const cy = y + 13;

  const redX = x + 12;
  const yellowX = x + 22;
  const greenX = x + 32;

  // DIM COLORS
  let red = [248, 200, 200];
  let yellow = [250, 235, 180];
  let green = [210, 235, 190];

  // ACTIVE
  if (level === "low") {
    red = [239, 68, 68];
  }

  if (level === "medium") {
    yellow = [245, 190, 40];
  }

  if (level === "high") {
    green = [140, 190, 60];
  }

  // RED
  doc.setFillColor(...red);

  doc.circle(redX, cy, 3.2, "F");

  // YELLOW
  doc.setFillColor(...yellow);

  doc.circle(yellowX, cy, 3.2, "F");

  // GREEN
  doc.setFillColor(...green);

  doc.circle(greenX, cy, 3.2, "F");

  // BORDER
  doc.setDrawColor(180, 180, 180);

  doc.setLineWidth(0.3);

  doc.circle(redX, cy, 3.2);
  doc.circle(yellowX, cy, 3.2);
  doc.circle(greenX, cy, 3.2);
};

// --------------------------------------------------
// MAIN FUNCTION
// --------------------------------------------------

export const generateDatasheet = async ({
  product,
  featuredImages,
}) => {
  const doc = new jsPDF("p", "mm", "a4");

  // --------------------------------------------------
  // COLORS
  // --------------------------------------------------

  const LIGHT = [245, 245, 245];

  const GRAY = [225, 225, 225];

  const BLACK = [20, 20, 20];

  const RED = [220, 45, 45];

  // --------------------------------------------------
  // PAGE BG
  // --------------------------------------------------

  doc.setFillColor(...LIGHT);

  doc.rect(0, 0, 210, 297, "F");

  // --------------------------------------------------
  // HEADER
  // --------------------------------------------------

  // LOGO BOX
//   doc.setFillColor(...RED);

//   doc.rect(8, 8, 18, 18, "F");

//   doc.setTextColor(255, 255, 255);

//   doc.setFont("helvetica", "bold");

//   doc.setFontSize(18);

//   doc.text("US", 12, 20);

//   // BRAND
//   doc.setTextColor(...BLACK);

//   doc.setFontSize(18);

//   doc.text("ULTRA", 30, 15);

//   doc.text("STONES", 30, 22);

//   doc.setFontSize(7);

//   doc.text("LUXURY SURFACES", 30, 27);

  // PRODUCT NAME
  doc.setFont("helvetica", "bold");

  doc.setFontSize(22);

  doc.text(
    product?.name?.toUpperCase() || "",
    32,
    45
  );

  doc.setFont("helvetica", "normal");

  doc.setFontSize(11);

  doc.text(
    `SKU - UQ${product?.id || ""}`,
    60,
    53
  );

  // DIVIDER
  doc.setDrawColor(...RED);

  doc.setLineWidth(1);

  doc.line(100, 8, 100, 55);

  // --------------------------------------------------
  // FEATURE IMAGE
  // --------------------------------------------------

  /*
    YES — downloading CDN image and embedding
    into PDF is exactly what we are doing here.

    We fetch image
    -> convert to base64
    -> embed inside PDF

    So PDF becomes self-contained.
  */

  const featureImage =
    featuredImages?.[0]?.media_url ||
    product?.media?.find(
      (m) => m.media_type === "FEATURED_IMAGE"
    )?.media_url;

  if (featureImage) {
    try {
      const imageData = await toDataURL(featureImage);

      if (imageData) {
        doc.addImage(
          imageData,
          "JPEG",
          106,
          8,
          92,
          47
        );
      }
    } catch (err) {
      console.log("IMAGE ERROR:", err);
    }
  }

  // --------------------------------------------------
  // SECTION HEADERS
  // --------------------------------------------------

  doc.setFillColor(...BLACK);

  doc.rect(6, 58, 122, 10, "F");

  doc.rect(130, 58, 74, 10, "F");

  doc.setTextColor(255, 255, 255);

  doc.setFont("helvetica", "bold");

  doc.setFontSize(16);

  doc.text("APPLICATION", 46, 65);

  doc.text("SPECIFICATION", 145, 65);

  // --------------------------------------------------
  // RATINGS
  // --------------------------------------------------

  const getLevel = (value) => {
    if (!value) return "medium";

    const normalized =
      value.toString().toLowerCase();

    if (normalized === "high") return "high";

    if (normalized === "medium")
      return "medium";

    if (normalized === "low") return "low";

    return "medium";
  };

  const gauges = [
    {
      label: "ABRASION RESISTANCE",
      level: getLevel(
        product?.abrasion_resistance
      ),
    },

    {
      label: "STAIN RESISTANCE",
      level: getLevel(product?.stain_resistance),
    },

    {
      label: "ETCHING RESISTANCE",
      level: getLevel(
        product?.etching_resistance
      ),
    },

    {
      label: "HEAT RESISTANCE",
      level: getLevel(product?.heat_resistance),
    },

    {
      label: "UV RESISTANCE",
      level: getLevel(product?.uv_resistance),
    },

    {
      label: "COLOR RANGE",
      level: getLevel(product?.color_range),
    },

    {
      label: "MOVEMENT INDEX",
      level: getLevel(product?.movement_index),
    },
  ];

  let gy = 72;

  gauges.forEach((item) => {
    drawGauge(
      doc,
      6,
      gy,
      item.label,
      item.level
    );

    gy += 20;
  });

  // --------------------------------------------------
  // APPLICATION DATA
  // --------------------------------------------------

  const applicationRows = [
    [
      "COLOR ENHANCING",
      product?.color_enhancing ? "Yes" : "No",
    ],

    [
      "COUNTERTOPS / VANITIES",
      product?.countertops_vanities
        ? "Yes"
        : "No",
    ],

    [
      "INTERIOR FLOOR",
      product?.interior_floor ? "Yes" : "No",
    ],

    [
      "FIREPLACE / INTERIOR WALL",
      product?.fireplace
        ? "Yes"
        : "No",
    ],

    [
      "SHOWER WALL",
      product?.shower_wall ? "Yes" : "No",
    ],

    [
      "SHOWER FLOOR",
      product?.shower_floor ? "Yes" : "No",
    ],

    [
      "EXTERIOR FLOOR",
      product?.exterior_floor ? "Yes" : "No",
    ],

    [
      "EXTERIOR WALL",
      product?.exterior_wall ? "Yes" : "No",
    ],

    [
      "POOL / FOUNTAIN",
      product?.pool_fountain ? "Yes" : "No",
    ],

    [
      "FURNITURE TOP",
      product?.furniture_top ? "Yes" : "No",
    ],
  ];

  let ay = 72;

  applicationRows.forEach((item) => {
    // TITLE
    doc.setFillColor(...GRAY);

    doc.rect(52, ay, 72, 8, "F");

    doc.setTextColor(...BLACK);

    doc.setFont("helvetica", "bold");

    doc.setFontSize(8.2);

    doc.text(item[0], 88, ay + 5.3, {
      align: "center",
      maxWidth: 65,
    });

    // VALUE
    doc.setFillColor(...LIGHT);

    doc.rect(52, ay + 8, 72, 8, "F");

    doc.setFont("helvetica", "normal");

    doc.text(item[1], 88, ay + 13.3, {
      align: "center",
    });

    ay += 16;
  });

  // --------------------------------------------------
  // SPECIFICATIONS
  // --------------------------------------------------

  const specificationRows = [
    [
      "CATEGORY",
      product?.stone_categories?.name || "-",
    ],

    [
      "THICKNESS",
      product?.thicknesses_cm?.join(", ") ||
        "-",
    ],

    [
      "FINISH",
      product?.finishes_available?.join(
        ", "
      ) || "-",
    ],

    [
      "AVERAGE SIZE",
      product?.average_sizes_inches?.join(
        ", "
      ) || "-",
    ],

    [
      "GROUP",
      product?.stone_group || "-",
    ],

    [
      "TRANSLUCENT",
      product?.translucent ? "Yes" : "No",
    ],

    [
      "PATTERN",
      product?.pattern || "-",
    ],

    [
      "CUT TO SIZE",
      product?.cut_to_size ? "Yes" : "No",
    ],

    [
      "ORIGIN",
      product?.origin_country || "-",
    ],
  ];

  let sy = 72;

  specificationRows.forEach((item) => {
    // TITLE
    doc.setFillColor(...GRAY);

    doc.rect(132, sy, 68, 8, "F");

    doc.setTextColor(...BLACK);

    doc.setFont("helvetica", "bold");

    doc.setFontSize(8);

    doc.text(item[0], 166, sy + 5.3, {
      align: "center",
      maxWidth: 60,
    });

    // VALUE
    doc.setFillColor(...LIGHT);

    doc.rect(132, sy + 8, 68, 8, "F");

    doc.setFont("helvetica", "normal");

    doc.text(
      String(item[1]),
      166,
      sy + 13.3,
      {
        align: "center",
        maxWidth: 60,
      }
    );

    sy += 16;
  });

  // --------------------------------------------------
  // MAINTENANCE
  // --------------------------------------------------

  doc.setDrawColor(190, 190, 190);

  doc.rect(6, 255, 194, 35);

  doc.setTextColor(...RED);

  doc.setFont("helvetica", "bold");

  doc.setFontSize(10);

  doc.text(
    "• MAINTENANCE AND CARE",
    10,
    262
  );

  doc.setTextColor(...BLACK);

  doc.setFont("helvetica", "normal");

  doc.setFontSize(8);

  const maintenance = [
    "• For cleaning, use a neutral cleanser to scrub tile and grout.",

    "• Wipe up spills immediately. Dry with a second soft towel or cloth.",

    "• Do not use bleach, ammonia-based cleaners, acidic, citrus or harsh chemicals.",

    "• Do not use gritty cleansers or abrasive rough scouring pads.",
  ];

  let my = 270;

  maintenance.forEach((line) => {
    doc.text(line, 10, my);

    my += 6;
  });

  // --------------------------------------------------
  // SAVE
  // --------------------------------------------------

  doc.save(
    `${product?.slug || product?.name || "datasheet"}.pdf`
  );
};
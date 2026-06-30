import jsPDF from 'jspdf';
import QRCode from 'qrcode';

import origin from '../assets/InfoStrip/origin.png';
import polish from '../assets/InfoStrip/polished.png';
import thickness from '../assets/InfoStrip/thickness.png';
import bookmtach from '../assets/InfoStrip/bookmatch.png';
import size from '../assets/InfoStrip/size.png';

import colourenhancing from '../assets/icons/colourenhancing.png';
import countertop from '../assets/icons/countertop.png';
import exteriorwall from '../assets/icons/exteriorwall.png';
import exteriorfloor from '../assets/icons/extetiorfloor.png';
import fireplace from '../assets/icons/fireplace.png';
import furnituretop from '../assets/icons/furnituretop.png';
import interiorfloor from '../assets/icons/interiorfloor.png';
import interiorwall from '../assets/icons/interiorwall.png';
import poolfountain from '../assets/icons/pool&fountain.png';
import showerfloor from '../assets/icons/showerfloor.png';
import showerwall from '../assets/icons/showerwall.png';
import translucent from '../assets/icons/translucent.png';

import crown from '../assets/specs/crown.png';
import cut from '../assets/specs/cut.png';
import sealer from '../assets/specs/sealer.png';
import trans from '../assets/specs/translucent.png';

import bleach from '../assets/maintaniance/bleach.png';
import clean from '../assets/maintaniance/clean.png';
import spray from '../assets/maintaniance/spray.png';
import cleanser from '../assets/maintaniance/cleanser.png';
import caution from '../assets/maintaniance/caution.png';

import uslogo from '../assets/uslogo.png';
import { color } from 'framer-motion';

const getMediaUrl = (product, type) =>
  product?.media?.find((m) => m.media_type === type)?.media_url;

const loadImageAsBase64 = async (url) => {
  try {
    const response = await fetch(url, {
      mode: "cors",
      cache: "force-cache",
    });

    if (!response.ok) {
      throw new Error(`Image fetch failed: ${response.status}`);
    }

    const blob = await response.blob();

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Datasheet image failed:", error);
    return null;
  }
};

const formatRating = (value) => {
  if (!value) return '-';

  return value.charAt(0) + value.slice(1).toLowerCase();
};

const variationPatterns = {
  V1: [1,1,1,1,1,1,1,1,1],
  V2: [0.6,1,1,1,1,0.7,0.8,1,0.6],
  V3: [0.5,1,0.8,1,0.7,0.3,0.5,0.7,0.8],
  V4: [0.3,0.7,0.8,0.8,0.8,0.3,0.6,0.3,0.8]
};

export const generateDatasheet = async ({ product }) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();

  // ======================
  // IMAGES
  // ======================

  const heroImage =
    getMediaUrl(product, 'CLOSEUP_IMAGE') ||
    getMediaUrl(product, 'SLAB_IMAGE');

  const heroBase64 = heroImage
    ? await loadImageAsBase64(heroImage)
    : null;

  const qrUrl = `${window.location.origin}/product/${product.stone_categories.slug}/${product.slug}`;

  const qrBase64 = await QRCode.toDataURL(qrUrl, {
    width: 330,
    margin: 1,
  });


  // ======================
  // HEADER
  // ======================

pdf.addImage(
  uslogo,
  'PNG',
  10,
  7,
  60,
  22
);

// Outer frame

pdf.setFillColor(90, 95, 98);

pdf.rect(
  pageWidth - 34,
  3,
  26,
  26,
  'F'
);

// Inner white area

pdf.setFillColor(255, 255, 255);

pdf.rect(
  pageWidth - 32.5,
  4.5,
  23,
  23,
  'F'
);

// QR

pdf.addImage(
  qrBase64,
  'PNG',
  pageWidth - 31.5,
  5.5,
  21,
  21
);
  // ======================
  // CATEGORY
  // ======================

pdf.setFont('helvetica', 'normal');
pdf.setFontSize(12);
pdf.setTextColor(110);

pdf.text(
  product?.stone_categories?.name?.toUpperCase() || '',
  pageWidth / 2,
  37,
  {
    align: 'center',
  }
);

  // ======================
  // PRODUCT NAME
  // ======================

  pdf.setTextColor(0);

  pdf.setFontSize(22);
  pdf.setFont('times', 'bold');

  pdf.text(
    product.name.toUpperCase(),
    pageWidth / 2,
    47,
    {
      align: 'center',
    }
  );

  // ======================
  // HERO IMAGE
  // ======================

  if (heroBase64) {
    pdf.addImage(
      heroBase64,
      'JPEG',
      10,
      50,
      pageWidth - 20,
      74
    );
  }

  // ======================
  // INFO STRIP
  // ======================

  let y = 127;

pdf.setFillColor(245, 245, 245);
pdf.rect(10, y, pageWidth - 20, 16, 'F');

const info = [
  {
    label: 'Origin',
    value: product.origin_country || '-',
    icon: origin,
  },
  {
    label: 'Finish',
    value: product.finishes_available?.[0]?.trim() || '-',
    icon: polish,
  },
  {
    label: 'Thickness',
    value: product.thicknesses_cm?.[0]?.trim() || '-',
    icon:  thickness,
  },
  {
    label: 'Pattern',
    value: product.pattern || '-',
    icon: bookmtach,
  },
  {
    label: 'Size',
    value: product.average_sizes_inches?.[0]?.trim() || '-',
    icon: size,
  },
];

const stripWidth = pageWidth - 20;
const itemWidth = stripWidth / info.length;

const iconSize = 7;

for (const [index, item] of info.entries()) {
  const startX = 10 + itemWidth * index;

  // Center point of each column
  const centerX = startX + itemWidth / 2;

  // Icon
  pdf.addImage(
    item.icon,
    'PNG',
    centerX - 18, // same offset for all
    y + 4,
    iconSize,
    iconSize
  );

  // Label
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(6);
  pdf.setTextColor(110);

  pdf.text(
    item.label,
    centerX - 8,
    y + 6
  );

  // Value
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(0);

  pdf.text(
    item.value,
    centerX - 8,
    y + 10
  );
}
  
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
  'FD'
);

pdf.setFont('helvetica', 'bold');
pdf.setFontSize(11);
pdf.setTextColor(0);

pdf.text(
  'APPLICATIONS',
  15,
  sectionY + 10
);

const applications = [
  ['Color Enhancing', product.colour_enhancing, colourenhancing],
  ['Countertops / Vanities', product.countertops_vanities, countertop],
  ['Interior Floor', product.interior_floor, interiorfloor],
  ['Pool / Fountain', product.pool_fountain, poolfountain],
  ['Shower Wall', product.shower_wall, showerwall],

  ['Furniture Top', product.furniture_top, furnituretop],
  ['Fireplace / Interior Wall', product.fireplace, fireplace],
  ['Exterior Floor', product.exterior_floor, exteriorfloor],
  ['Shower Floor', product.shower_floor, showerfloor],
  ['Exterior Wall', product.exterior_wall, exteriorwall],
];

const cols = 5;

const appStartX = 15;
const appStartY = sectionY + 22;

const appContentWidth =
  pageWidth - 30;

const appColumnWidth =
  appContentWidth / cols;

// const iconSize = 8;

applications.forEach(
  ([label, enabled, icon], index) => {

    const row =
      Math.floor(index / cols);

    const col =
      index % cols;

    const centerX =
      appStartX +
      col * appColumnWidth +
      appColumnWidth / 2;

    const yy =
      appStartY +
      row * 18;

    // icon

    pdf.addImage(
      icon,
      'PNG',
      centerX - 12,
      yy - 4,
      iconSize,
      iconSize
    );

    // label

    pdf.setFont(
      'helvetica',
      'normal'
    );

    pdf.setFontSize(6);

    pdf.setTextColor(70);

    pdf.text(
      label,
      centerX - 2,
      yy
    );

    // value

    pdf.setFont(
      'helvetica',
      'bold'
    );

    pdf.setTextColor(0);

    pdf.text(
      enabled ? 'Yes' : 'No',
      centerX - 2,
      yy + 4
    );
  }
);

// =====================================================
// PERFORMANCE STRIP
// =====================================================

const performanceY =
  sectionY +
  applicationsHeight;

const stripHeight = 15;

pdf.setFillColor(
  34,
  49,
  73
);

pdf.rect(
  10,
  performanceY,
  pageWidth - 20,
  stripHeight,
  'F'
);



const ratings = [
  [
    'ABRASION RESISTANCE',
    formatRating(
      product.abrasion_resistance
    ),
  ],
  [
    'HEAT RESISTANCE',
    formatRating(
      product.heat_resistance
    ),
  ],
  [
    'MOVEMENT INDEX',
    formatRating(
      product.movement_index
    ),
  ],
  [
    'STAIN RESISTANCE',
    formatRating(
      product.stain_resistance
    ),
  ],
  [
    'UV RESISTANCE',
    formatRating(
      product.uv_resistance
    ),
  ],
  [
    'ETCHING RESISTANCE',
    formatRating(
      product.etching_resistance
    ),
  ],
  [
    'COLOR RANGE',
    formatRating(
      product.color_range
    ),
  ],
];

const ratingsStartX = 10;
const ratingsWidth =
  pageWidth - 20;

const ratingWidth =
  ratingsWidth / ratings.length;

  ratings.forEach((_, idx) => {
  if (idx === 0) return;

  const x =
    ratingsStartX +
    idx * ratingWidth;

  pdf.setDrawColor(
    255,
    255,
    255,
    0.2
  );

  pdf.line(
    x,
    performanceY + 2,
    x,
    performanceY + stripHeight - 2
  );
});

ratings.forEach(
  ([label, value], idx) => {
const centerX =
  ratingsStartX +
  ratingWidth * idx +
  ratingWidth / 2;

    pdf.setFont(
      'helvetica',
      'bold'
    );


    pdf.setTextColor(255);

pdf.setFontSize(4.8);

pdf.text(
  label,
  centerX,
  performanceY + 5.5,
  {
    align: 'center',
    maxWidth: ratingWidth - 3
  }
);

pdf.setFont('helvetica', 'bold');
pdf.setFontSize(6);

pdf.text(
  value || '-',
  centerX,
  performanceY + 11,
  {
    align: 'center'
  }
);
  }
);

// =====================================================
// SPECIFICATION
// =====================================================

const specY =
  performanceY +
  stripHeight;

const specHeight = 28;

pdf.setFillColor(
  255,
  255,
  255
);

pdf.setDrawColor(
  220,
  220,
  220
);

pdf.rect(
  10,
  specY,
  pageWidth - 20,
  specHeight,
  'FD'
);

pdf.setFont(
  'helvetica',
  'bold'
);

pdf.setFontSize(11);

pdf.setTextColor(0);

pdf.text(
  'SPECIFICATION',
  15,
  specY + 10
);

const specs = [
  [
    'Translucent',
    product.translucent
      ? 'Yes'
      : 'No',
    trans,
  ],
  [
    'Cut To Size',
    product.cut_to_size
      ? 'Yes'
      : 'No',
    cut,
  ],
  [
    'Group',
    product.stone_group ||
      '-',
    crown,
  ],
  [
    'Sealer',
    product.sealer ||
      '-',
    sealer,
  ],
];

const specContentWidth =
  pageWidth - 30;

const specItemWidth =
  specContentWidth / specs.length;


specs.forEach(
  ([label, value, icon], idx) => {

const startX =
  15 +
  idx * specItemWidth;

const centerX =
  startX +
  specItemWidth / 2;

const iconX = centerX - 18;

pdf.addImage(
  icon,
  'PNG',
  iconX,
  specY + 15,
  iconSize,
  iconSize
);

pdf.setFont('helvetica', 'normal');
pdf.setFontSize(6);
pdf.setTextColor(90);

pdf.text(
  label,
  iconX + 12,
  specY + 18
);

pdf.setFont('helvetica', 'bold');
pdf.setFontSize(6.5);
pdf.setTextColor(0);

pdf.text(
  value || '-',
  iconX + 12,
  specY + 22
);
  }
);

// Next section starts from:
y = specY + specHeight + 3;

  // ======================
// VARIATION + MAINTENANCE
// ======================

const bottomY = y;

const bottomGap = 5;

const variationWidth =
  (pageWidth - 25) / 2;

const maintenanceWidth =
  variationWidth;

const cardHeight = 39;

// ======================
// VARIATION CARD
// ======================

pdf.setFillColor(255, 255, 255);
pdf.setDrawColor(220, 220, 220);

pdf.rect(
  10,
  bottomY,
  variationWidth,
  cardHeight,
  'FD'
);

pdf.setFont('helvetica', 'bold');
pdf.setFontSize(10);
pdf.setTextColor(0);

pdf.text(
  'VARIATION',
  15,
  bottomY + 8
);

// variation patterns

const variationPatterns = {
  V1: [
    216,216,216,
    216,216,216,
    216,216,216,
  ],

  V2: [
    170,210,197,
    201,199,171,
    170,196,208,
  ],

  V3: [
    165,208,199,
    197,189,102,
    167,189,196,
  ],

  V4: [
    102,180,189,
    190,196,102,
    170,102,196,
  ],
};

const activeVariation =
  product.variation_level || 'V1';

const variations = ['V1', 'V2', 'V3', 'V4'];

const cardInnerX = 15;
const cardInnerWidth = variationWidth - 10;

const tileSize = 12;
const tileGap = 0.3;


const positions = [
  cardInnerX + 4,
  cardInnerX + 26,
  cardInnerX + 48,
  cardInnerX + 70,
];

variations.forEach((variation, idx) => {

  const startX = positions[idx];
  const startY = bottomY + 18;

  // Title

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(6);
  pdf.setTextColor(40);

  pdf.text(
    variation,
    startX + tileSize / 2,
    bottomY + 14,
    { align: 'center' }
  );

  // Active border

  if (variation === activeVariation) {

    pdf.setDrawColor(110);
    pdf.setLineWidth(0.4);

pdf.rect(
  startX - 0.5,
  startY - 0.5,
  tileSize + 0.7,
  tileSize + 0.9
);
  }

  // Pattern

  const shades =
    variationPatterns[variation];

  shades.forEach((gray, index) => {

    const row =
      Math.floor(index / 3);

    const col =
      index % 3;

    const square =
      tileSize / 3;


    pdf.setFillColor(
      gray,
      gray,
      gray
    );

    pdf.rect(
      startX + col * square,
      startY + row * square,
      square - tileGap,
      square - tileGap,
      'F'
    );
  });
});


// ======================
// SCALE
// ======================

const scaleStartX = 20;
const scaleEndX =
  variationWidth ;

const scaleY =
  bottomY + 33;

pdf.setDrawColor(150);
pdf.setLineWidth(0.25);

// horizontal line

pdf.line(
  scaleStartX,
  scaleY,
  scaleEndX,
  scaleY
);

// left tick

pdf.line(
  scaleStartX,
  scaleY - 0.5,
  scaleStartX,
  scaleY + 0.5
);

// right tick

pdf.line(
  scaleEndX,
  scaleY - 0.5,
  scaleEndX,
  scaleY + 0.5
);

// marker

const markerMap = {
  V1: scaleStartX,
  V2: scaleStartX + (scaleEndX - scaleStartX) * 0.33,
  V3: scaleStartX + (scaleEndX - scaleStartX) * 0.66,
  V4: scaleEndX,
};

pdf.setLineWidth(0.6);


// labels

pdf.setFontSize(5);
pdf.setTextColor(110);

pdf.text(
  'Low Variation',
  scaleStartX,
  scaleY + 5
);

pdf.text(
  'High Variation',
  scaleEndX,
  scaleY + 5,
  { align: 'right' }
);
// ======================
// MAINTENANCE CARD
// ======================

const maintenanceX =
  10 +
  variationWidth +
  bottomGap;

pdf.setFillColor(
  34,
  49,
  73
);

pdf.rect(
  maintenanceX,
  bottomY,
  maintenanceWidth,
  cardHeight,
  'F'
);

pdf.setFont(
  'helvetica',
  'bold'
);

pdf.setFontSize(9);

pdf.setTextColor(255);

pdf.text(
  'MAINTENANCE & CARE',
  maintenanceX + 4,
  bottomY + 8
);

const tips = [
  {
    icon: spray,
    text:
      'For cleaning, as needed, use a neutral cleanser to scrub tile and grout.',
  },
  {
    icon: clean,
    text:
      'Wipe up spills immediately. Dry with a second soft towel or cloth.',
  },
  {
    icon: bleach,
    text:
      'Do not use bleach, ammonia - based cleansers, acidic, citrus or other harsh chemicals.',
  },
  {
    icon: cleanser,
    text:
      'Do not use gritty cleansers of soft scrubs that are abrasive and rough scouring pads.',
  },
];

tips.forEach(
  (tip, index) => {

    const yy =
      bottomY +
      14 +
      index * 6.5;

    pdf.addImage(
      tip.icon,
      'PNG',
      maintenanceX + 4,
      yy - 2,
      4,
      4
    );

    pdf.setFont(
      'helvetica',
      'normal'
    );

    pdf.setFontSize(5);

    pdf.setTextColor(255);

pdf.text(
  tip.text,
  maintenanceX + 10,
  yy + 0.5
);
  }
);

// ======================
// WARNING STRIP
// ======================

const silicaWarning =
  product.silica_warning ||
  product.stone_categories?.silica_warning;

const silicaMessage =
  product.silica_warning_message ||
  product.stone_categories?.silica_warning_message;

if (silicaWarning && silicaMessage) {

  const warningY =
    bottomY + cardHeight + 5;

  pdf.addImage(
    caution,
    'PNG',
    10,
    warningY - 2.8,
    4,
    4
  );

  pdf.setFont(
    'helvetica',
    'bold'
  );

  pdf.setFontSize(5.5);

  pdf.setTextColor(0);

  pdf.text(
    'WARNING:',
    16,
    warningY
  );

  pdf.setFont(
    'helvetica',
    'normal'
  );

  pdf.text(
    silicaMessage.toUpperCase(),
    28,
    warningY,
    {
      maxWidth:
        pageWidth - 35,
    }
  );

}



  pdf.save(`${product.name}-datasheet.pdf`);
};
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

import uslogo from '../assets/uslogo.png';

const getMediaUrl = (product, type) =>
  product?.media?.find((m) => m.media_type === type)?.media_url;

const loadImageAsBase64 = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
};

const formatRating = (value) => {
  if (!value) return '-';

  return value.charAt(0) + value.slice(1).toLowerCase();
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

  const qrUrl = `${window.location.origin}/products/${product.stone_categories.slug}/${product.slug}`;

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

  // ======================
  // CATEGORY
  // ======================

pdf.setFont('helvetica', 'normal');
pdf.setFontSize(12);
pdf.setTextColor(110);

pdf.text(
  product?.stone_categories?.name?.toUpperCase() || '',
  pageWidth / 2,
  40,
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
    51,
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
      56,
      pageWidth - 20,
      70
    );
  }

  // ======================
  // INFO STRIP
  // ======================

  let y = 132;

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

for (const [index, item] of info.entries()) {
  const startX = 10 + itemWidth * index;

  // icon
pdf.addImage(
  item.icon,
  'PNG',
  startX + 4,
  y + 4,
  7,
  7
);


  // label
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(6);
  pdf.setTextColor(110);

  pdf.text(
    item.label,
    startX + 14,
    y + 6
  );

  // value
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(0);

  pdf.text(
    item.value,
    startX + 14,
    y + 10
  );
}
  
// =====================================================
// APPLICATIONS + SPECIFICATION + QR SECTION
// =====================================================

const sectionY = 152;
const gap = 3;

// widths
const appWidth = 86;
const specWidth = 52;
const qrWidth = 48;
const cardHeight = 72;

const appX = 10;
const specX = appX + appWidth + gap;
const qrX = specX + specWidth + gap;

// -----------------------------------------------------
// CARD BACKGROUNDS
// -----------------------------------------------------
// -----------------------------------------------------
// APPLICATIONS CARD
// -----------------------------------------------------

pdf.setFillColor(255, 255, 255);
pdf.setDrawColor(220, 220, 220);

pdf.rect(
  appX,
  sectionY,
  appWidth,
  cardHeight,
  'FD'
);

// -----------------------------------------------------
// SPECIFICATION CARD
// -----------------------------------------------------

pdf.setFillColor(245, 245, 245);

// Fill only (no border)
pdf.rect(
  specX,
  sectionY,
  specWidth,
  cardHeight,
  'F'
);

// -----------------------------------------------------
// APPLICATIONS
// -----------------------------------------------------

pdf.setFont('helvetica', 'bold');
pdf.setFontSize(10);
pdf.setTextColor(0);

pdf.text(
  'APPLICATIONS',
  appX + 6,
  sectionY + 9
);

const applications = [
  ['Color Enhancing', product.colour_enhancing, colourenhancing],
  ['Countertops / Vanities', product.countertops_vanities, countertop],
  ['Interior Floor', product.interior_floor, interiorfloor],
  ['Fireplace / Interior Wall', product.fireplace, fireplace],
  ['Pool / Fountain', product.pool_fountain, poolfountain],

  ['Shower Wall', product.shower_wall, showerwall],
  ['Shower Floor', product.shower_floor, showerfloor],
  ['Exterior Floor', product.exterior_floor, exteriorfloor],
  ['Exterior Wall', product.exterior_wall, exteriorwall],
  ['Furniture Top', product.furniture_top, furnituretop],
];

const leftX = appX + 6;
const rightX = appX + 45;

const startY = sectionY + 18;
const rowGap = 11;

applications.forEach(([label, enabled, icon], index) => {
  const col = index < 5 ? 0 : 1;
  const row = index % 5;

  const x = col === 0 ? leftX : rightX;
  const yy = startY + row * rowGap;

  pdf.addImage(
    icon,
    'PNG',
    x,
    yy - 4,
    8,
    8
  );

  pdf.setFontSize(6);
  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(60);

  pdf.text(
    label,
    x + 10,
    yy
  );

  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(0);

  pdf.text(
    enabled ? 'Yes' : 'No',
    x + 11,
    yy + 3
  );
});

// -----------------------------------------------------
// SPECIFICATION
// -----------------------------------------------------

pdf.setFont('helvetica', 'bold');
pdf.setFontSize(10);
pdf.setTextColor(0);

pdf.text(
  'SPECIFICATION',
  specX + 6,
  sectionY + 9
);

const specs = [
  ['Group', product.stone_group, crown],
  ['Translucent', product.translucent ? 'Yes' : 'No', trans],
  ['Variation', product.variation_level, sealer],
  ['Cut To Size', product.cut_to_size ? 'Yes' : 'No', cut],
];

const specStartY = sectionY + 18;

specs.forEach(([label, value, icon], index) => {
  const yy = specStartY + index * 14;

  // icon
  pdf.addImage(
    icon,
    'PNG',
    specX + 6,
    yy - 4,
    8,
    8
  );

  // label
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(5.5);
  pdf.setTextColor(90);

  pdf.text(
    label,
    specX + 17,
    yy
  );

  // value
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(6.5);
  pdf.setTextColor(0);

  pdf.text(
    value || '-',
    specX + 17,
    yy + 4
  );
});

// -----------------------------------------------------
// QR CARD
// -----------------------------------------------------

pdf.setFillColor(70, 75, 80);

const qrCardSize = 48;

pdf.rect(
  qrX,
  sectionY,
  qrCardSize,
  qrCardSize,
  'F'
);

const qrSize = 34;

pdf.addImage(
  qrBase64,
  'PNG',
  qrX + (qrWidth - qrSize) / 2,
  sectionY + 6,
  qrSize,
  qrSize
);

pdf.setFontSize(5.5);
pdf.setFont('helvetica', 'bold');
pdf.setTextColor(255);

pdf.text(
  'SCAN TO OPEN WEB PAGE',
  qrX + qrWidth / 2,
  sectionY + 45,
  {
    align: 'center',
  }
);
  // ======================
// PERFORMANCE STRIP
// ======================

y = cardHeight + sectionY + 8;

const stripHeight = 15;

pdf.setFillColor(245, 245, 245);

pdf.rect(
  10,
  y,
  pageWidth - 20,
  stripHeight,
  'F'
);

const ratings = [
  ['ABRASION RESISTANCE', formatRating(product.abrasion_resistance)],
  ['HEAT RESISTANCE', formatRating(product.heat_resistance)],
  ['MOVEMENT INDEX', formatRating(product.movement_index)],
  ['STAIN RESISTANCE', formatRating(product.stain_resistance)],
  ['UV RESISTANCE', formatRating(product.uv_resistance)],
  ['ETCHING RESISTANCE', formatRating(product.etching_resistance)],
  ['COLOR RANGE', formatRating(product.color_range)],
];

const ratingWidth = (pageWidth - 20) / ratings.length;

ratings.forEach(([label, value], idx) => {
  const centerX =
    10 + idx * ratingWidth + ratingWidth / 2;

  // Title
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(5.5);
  pdf.setTextColor(0);

  pdf.text(
    label,
    centerX,
    y + 7,
    {
      align: 'center',
      maxWidth: ratingWidth - 2,
    }
  );

  // Value
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(6);
  pdf.setTextColor(40);

  pdf.text(
    value || '-',
    centerX,
    y + 11,
    {
      align: 'center',
    }
  );
});

  // ======================
// MAINTENANCE & CARE
// ======================

y = y + stripHeight + 5;

const maintenanceHeight = 37;

pdf.setFillColor(245, 245, 245);

pdf.rect(
  10,
  y,
  pageWidth - 20,
  maintenanceHeight,
  'F'
);

// Title
pdf.setFont('helvetica', 'bold');
pdf.setFontSize(10);
pdf.setTextColor(0);

pdf.text(
  'MAINTENANCE AND CARE',
  pageWidth / 2,
  y + 8,
  {
    align: 'center',
  }
);

const tips = [
  {
    icon: spray,
    text: 'For cleaning, as needed, use a neutral cleanser to scrub tile and grout.',
  },
  {
    icon: clean,
    text: 'Wipe up spills immediately. Dry with a second soft towel or cloth.',
  },
  {
    icon: bleach,
    text: 'Do not use bleach, ammonia-based cleansers, acidic, citrus or other harsh chemicals.',
  },
  {
    icon: cleanser,
    text: 'Do not use gritty cleansers of soft scrubs that are abrasive and rough scouring pads.',
  },
];

const contentY = y + 12;
const colWidth = (pageWidth - 20) / 4;

tips.forEach((item, index) => {
  const centerX =
    10 + index * colWidth + colWidth / 2;

  // icon
  pdf.addImage(
    item.icon,
    'PNG',
    centerX - 6,
    contentY,
    10,
    10
  );

  // text
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(5.5);
  pdf.setTextColor(50);

  const lines = pdf.splitTextToSize(
    item.text,
    colWidth - 10
  );

  pdf.text(
    lines,
    centerX,
    contentY + 18,
    {
      align: 'center',
      maxWidth: colWidth - 10,
    }
  );
});

  pdf.save(`${product.name}-datasheet.pdf`);
};
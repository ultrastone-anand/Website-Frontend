
const SITE_URL = "https://www.ultrastones.com";
const PRODUCT_BASE_PATH = "/product";

const DEFAULT_DESCRIPTION =
  "Explore premium natural and engineered stone surfaces by Ultra Stones.";

// ============================================================
// COMMON HELPERS
// ============================================================

function isValidValue(value) {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value !== "string") {
    return Boolean(value);
  }

  const normalized = value.trim().toLowerCase();

  return (
    normalized !== "" &&
    normalized !== "test" &&
    normalized !== "{}" &&
    normalized !== "null" &&
    normalized !== "undefined"
  );
}

function cleanText(value, maxLength = 160) {
  if (!isValidValue(value)) return "";

  return String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function safeUrl(value) {
  if (!isValidValue(value)) return "";

  try {
    const url = new URL(String(value).trim(), SITE_URL);

    if (
      url.protocol !== "https:" &&
      url.protocol !== "http:"
    ) {
      return "";
    }

    return url.href;
  } catch {
    return "";
  }
}

function cleanCanonical(value) {
  const url = safeUrl(value);

  if (!url) return "";

  const parsed = new URL(url);

  parsed.search = "";
  parsed.hash = "";

  return parsed.href;
}

function parseSchema(schemaMarkup) {
  if (!isValidValue(schemaMarkup)) return null;

  try {
    const parsed =
      typeof schemaMarkup === "string"
        ? JSON.parse(schemaMarkup)
        : schemaMarkup;

    if (
      !parsed ||
      typeof parsed !== "object" ||
      Object.keys(parsed).length === 0
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function containsSchemaType(schema, targetType) {
  if (!schema || typeof schema !== "object") {
    return false;
  }

  if (Array.isArray(schema)) {
    return schema.some((item) =>
      containsSchemaType(item, targetType)
    );
  }

  const types = Array.isArray(schema["@type"])
    ? schema["@type"]
    : [schema["@type"]];

  if (
    types.some(
      (type) =>
        type === targetType ||
        type === `https://schema.org/${targetType}`
    )
  ) {
    return true;
  }

  return Object.values(schema).some((value) =>
    containsSchemaType(value, targetType)
  );
}

function getProductCanonical(
  product,
  routeCategorySlug = ""
) {
  const databaseCanonical = cleanCanonical(
    product?.seo?.canonical_url
  );

  if (databaseCanonical) {
    return databaseCanonical;
  }

  // Match backend canonical precedence.
  const categorySlug =
    product?.stone_categories?.slug ||
    product?.category_slug ||
    routeCategorySlug;

  const productSlug = product?.slug;

  if (
    isValidValue(categorySlug) &&
    isValidValue(productSlug)
  ) {
    return (
      `${SITE_URL}${PRODUCT_BASE_PATH}/` +
      `${encodeURIComponent(String(categorySlug).trim())}/` +
      encodeURIComponent(String(productSlug).trim())
    );
  }

  // Let SEO.jsx use the current route as fallback.
  return "";
}

function getProductImage(product) {
  const media = Array.isArray(product?.media)
    ? product.media
    : [];

  const closeup = media.find(
    (item) =>
      item?.media_type === "CLOSEUP_IMAGE" &&
      safeUrl(item.media_url)
  );

  const slab = media.find(
    (item) =>
      item?.media_type === "SLAB_IMAGE" &&
      safeUrl(item.media_url)
  );

  const fallback = media.find((item) =>
    safeUrl(item?.media_url)
  );

  return (
    safeUrl(product?.seo?.og_image) ||
    safeUrl(closeup?.media_url) ||
    safeUrl(slab?.media_url) ||
    safeUrl(fallback?.media_url) ||
    ""
  );
}

function normalizeStringList(value) {
  if (Array.isArray(value)) {
    return value
      .filter(isValidValue)
      .map((item) => String(item).trim())
      .join(", ");
  }

  return isValidValue(value)
    ? String(value).trim()
    : "";
}

// ============================================================
// PRODUCT SEO
// ============================================================

export function normalizeProductSeo(
  product,
  routeCategorySlug = ""
) {
  if (!product) return {};

  const seo = product.seo || {};

  const productName = isValidValue(product.name)
    ? String(product.name).trim()
    : "Natural Stone";

  const title = isValidValue(seo.meta_title)
    ? String(seo.meta_title).trim()
    : `${productName} | Ultra Stones`;

  const description = isValidValue(
    seo.meta_description
  )
    ? cleanText(seo.meta_description, 300)
    : cleanText(product.small_description) ||
      cleanText(product.long_description) ||
      DEFAULT_DESCRIPTION;

  const canonical = getProductCanonical(
    product,
    routeCategorySlug
  );

  const image = getProductImage(product);

  const customSchema = parseSchema(
    seo.schema_markup
  );

  const category =
    product.stone_categories?.name ||
    product.stone_categories?.category_name ||
    product.stone_categories?.slug ||
    product.stone_group ||
    "";

  const sku =
    product.product_code ||
    product.sku ||
    product.code ||
    "";

  // Match the backend's automatically generated Product schema.
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    ...(canonical
      ? {
          "@id": `${canonical}#product`,
          url: canonical,
        }
      : {}),
    name: productName,
    description,
    brand: {
      "@type": "Brand",
      name: "Ultra Stones",
    },
    ...(image ? { image: [image] } : {}),
    ...(isValidValue(category)
      ? { category: String(category).trim() }
      : {}),
    ...(isValidValue(sku)
      ? { sku: String(sku).trim() }
      : {}),
  };

  // Preserve useful product attributes.
  const additionalProperty = [
    {
      "@type": "PropertyValue",
      name: "Pattern",
      value: product.pattern,
    },
    {
      "@type": "PropertyValue",
      name: "Finish",
      value: normalizeStringList(
        product.finishes_available
      ),
    },
    {
      "@type": "PropertyValue",
      name: "Thickness",
      value: normalizeStringList(
        product.thicknesses_cm
      ),
    },
    {
      "@type": "PropertyValue",
      name: "Origin",
      value: product.origin_country,
    },
  ].filter((item) => isValidValue(item.value));

  if (additionalProperty.length > 0) {
    productSchema.additionalProperty =
      additionalProperty;
  }

  const schemaList = [];

  if (customSchema) {
    schemaList.push(customSchema);
  }

  if (
    !containsSchemaType(customSchema, "Product")
  ) {
    schemaList.push(productSchema);
  }

  // Preserve existing FAQ schema behavior.
  const activeFaqs = Array.isArray(product.faqs)
    ? product.faqs.filter(
        (faq) =>
          faq?.is_active === true &&
          isValidValue(faq.question) &&
          isValidValue(faq.answer)
      )
    : [];

  if (
    activeFaqs.length > 0 &&
    !containsSchemaType(customSchema, "FAQPage")
  ) {
    schemaList.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: activeFaqs.map((faq) => ({
        "@type": "Question",
        name: String(faq.question).trim(),
        acceptedAnswer: {
          "@type": "Answer",
          text: String(faq.answer).trim(),
        },
      })),
    });
  }

  return {
    title,
    description,
    canonical,
    image,
    robotsIndex: seo.robots_index !== false,
    robotsFollow: seo.robots_follow !== false,
    ogType: "product",
    schema: schemaList,
  };
}

// ============================================================
// GENERAL PAGE SEO
// ============================================================

export function normalizePageSeo(pageData) {
  if (!pageData) return {};

  const seo = pageData.seo || pageData;

  const title =
    seo.meta_title ||
    seo.seo_title ||
    seo.title ||
    "";

  const description =
    seo.meta_description ||
    seo.seo_description ||
    seo.description ||
    "";

  const canonical =
    cleanCanonical(seo.canonical_url) ||
    cleanCanonical(seo.canonical) ||
    cleanCanonical(seo.url) ||
    "";

  const image =
    safeUrl(seo.og_image) ||
    safeUrl(seo.image) ||
    safeUrl(seo.featured_image) ||
    "";

  return {
    title: isValidValue(title)
      ? String(title).trim()
      : "",
    description: cleanText(description, 300),
    canonical,
    image,
    robotsIndex:
      seo.robots_index !== false &&
      seo.index !== false,
    robotsFollow:
      seo.robots_follow !== false &&
      seo.follow !== false,
    ogType: "website",
    schema: parseSchema(seo.schema_markup),
  };
}

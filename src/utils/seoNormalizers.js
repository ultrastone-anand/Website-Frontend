const SITE_URL = "https://www.ultrastones.com";
const PRODUCT_BASE_PATH = "/product";

function isValidValue(value) {
  return value && value !== "test" && value !== "{}";
}

function cleanText(value, maxLength = 160) {
  if (!value) return "";

  return String(value)
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function parseSchema(schemaMarkup) {
  if (!schemaMarkup) return null;

  try {
    const parsed = JSON.parse(schemaMarkup);

    if (!parsed || Object.keys(parsed).length === 0) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function normalizeProductSeo(product, routeCategorySlug = "") {
  if (!product) return {};

  const seo = product.seo || {};

  const title =
    seo.meta_title ||
    `${product.name} ${product.stone_group || ""} | Ultra Stones`;

  const description =
    seo.meta_description ||
    product.small_description ||
    cleanText(product.long_description) ||
    `Explore ${product.name} by Ultra Stones.`;

const categorySlug =
  routeCategorySlug ||
  product.stone_categories?.slug ||
  product.category_slug ||
  "";

const productSlug = product.slug || "";

const canonical = isValidValue(seo.canonical_url)
  ? seo.canonical_url
  : `${SITE_URL}${PRODUCT_BASE_PATH}/${categorySlug}/${productSlug}`;

  const image = isValidValue(seo.og_image)
    ? seo.og_image
    : product.media?.[0]?.media_url || "";

  const backendSchema = parseSchema(seo.schema_markup);

  const productSchema =
    backendSchema || {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description,
      image: product.media?.map((item) => item.media_url) || [],
      brand: {
        "@type": "Brand",
        name: "Ultra Stones",
      },
      category: product.stone_group,
      material: product.stone_group,
      additionalProperty: [
        {
          "@type": "PropertyValue",
          name: "Pattern",
          value: product.pattern,
        },
        {
          "@type": "PropertyValue",
          name: "Finish",
          value: product.finishes_available?.join(", "),
        },
        {
          "@type": "PropertyValue",
          name: "Thickness",
          value: product.thicknesses_cm?.join(", "),
        },
        {
          "@type": "PropertyValue",
          name: "Origin",
          value: product.origin_country,
        },
      ].filter((item) => item.value),
    };

  const faqSchema =
    product.faqs?.filter((faq) => faq.is_active)?.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: product.faqs
            .filter((faq) => faq.is_active)
            .map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
        }
      : null;

  return {
    title,
    description,
    canonical,
    image,
    robotsIndex: seo.robots_index !== false,
    robotsFollow: seo.robots_follow !== false,
    ogType: "product",
    schema: [productSchema, faqSchema].filter(Boolean),
  };
}

export function normalizePageSeo(pageData) {
  if (!pageData) return {};

  const seo = pageData.seo || pageData;

  return {
    title: seo.meta_title || seo.seo_title || seo.title,
    description:
      seo.meta_description || seo.seo_description || seo.description,
    canonical: seo.canonical_url || seo.canonical || seo.url,
    image: seo.og_image || seo.image || seo.featured_image,
    robotsIndex: seo.robots_index !== false && seo.index !== false,
    robotsFollow: seo.robots_follow !== false && seo.follow !== false,
    ogType: "website",
    schema: parseSchema(seo.schema_markup),
  };
}
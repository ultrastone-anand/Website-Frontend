
import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const SITE_NAME = "Ultra Stones";
const SITE_URL = "https://www.ultrastones.com";

const DEFAULT_TITLE =
  `Luxury Granite, Marble & Quartz Countertops - ${SITE_NAME}`;

const DEFAULT_DESCRIPTION =
  "Explore premium granite, marble, quartzite, quartz, porcelain and natural stone surfaces by Ultra Stones.";

const SEO_ATTRIBUTES = [
  ["name", "description"],
  ["name", "robots"],
  ["property", "og:type"],
  ["property", "og:title"],
  ["property", "og:description"],
  ["property", "og:url"],
  ["property", "og:image"],
  ["name", "twitter:card"],
  ["name", "twitter:title"],
  ["name", "twitter:description"],
  ["name", "twitter:image"],
];

function isValid(value) {
  if (typeof value !== "string") return false;

  const normalized = value.trim().toLowerCase();

  return (
    normalized !== "" &&
    normalized !== "test" &&
    normalized !== "{}" &&
    normalized !== "null" &&
    normalized !== "undefined"
  );
}

function absoluteUrl(value) {
  if (!isValid(value)) return "";

  try {
    const url = new URL(value.trim(), SITE_URL);

    if (!["https:", "http:"].includes(url.protocol)) {
      return "";
    }

    return url.href;
  } catch {
    return "";
  }
}

function normalizeCanonical(value, pathname) {
  const fallback = `${SITE_URL}${pathname || "/"}`;

  const url = absoluteUrl(value) || fallback;

  try {
    const parsed = new URL(url);

    parsed.search = "";
    parsed.hash = "";

    return parsed.href;
  } catch {
    return fallback;
  }
}

function normalizeSchema(schema) {
  const values = Array.isArray(schema)
    ? schema
    : schema
      ? [schema]
      : [];

  return values.flatMap((item) => {
    try {
      const parsed =
        typeof item === "string"
          ? JSON.parse(item)
          : item;

      if (!parsed || typeof parsed !== "object") {
        return [];
      }

      if (Object.keys(parsed).length === 0) {
        return [];
      }

      return [parsed];
    } catch {
      return [];
    }
  });
}

function isHelmetManaged(element) {
  return (
    element.hasAttribute("data-rh") ||
    element.hasAttribute("data-react-helmet")
  );
}

function removeDuplicateSeoTags() {
  const head = document.head;

  // Retain Helmet-managed tags when available.
  // Otherwise retain the latest matching tag.
  const canonicalTags = [
    ...head.querySelectorAll('link[rel~="canonical"]'),
  ];

  if (canonicalTags.length > 1) {
    const preferred =
      [...canonicalTags]
        .reverse()
        .find(isHelmetManaged) ||
      canonicalTags[canonicalTags.length - 1];

    canonicalTags.forEach((element) => {
      if (element !== preferred) {
        element.remove();
      }
    });
  }

  SEO_ATTRIBUTES.forEach(([attribute, value]) => {
    const selector = `meta[${attribute}="${value}"]`;

    const elements = [
      ...head.querySelectorAll(selector),
    ];

    if (elements.length <= 1) return;

    const preferred =
      [...elements]
        .reverse()
        .find(isHelmetManaged) ||
      elements[elements.length - 1];

    elements.forEach((element) => {
      if (element !== preferred) {
        element.remove();
      }
    });
  });
}

function synchronizeSeo({
  title,
  description,
  canonical,
  image,
  robots,
  ogType,
}) {
  const head = document.head;

  function updateMeta(attribute, key, content) {
    const selector = `meta[${attribute}="${key}"]`;

    const elements = [
      ...head.querySelectorAll(selector),
    ];

    if (!content) {
      elements.forEach((element) => element.remove());
      return;
    }

    const preferred =
      elements.find(isHelmetManaged) ||
      elements[elements.length - 1];

    if (preferred) {
      preferred.setAttribute("content", content);
    } else {
      const meta = document.createElement("meta");

      meta.setAttribute(attribute, key);
      meta.setAttribute("content", content);
      meta.setAttribute("data-ultra-seo", "true");

      head.appendChild(meta);
    }
  }

  // Update document title.
  document.title = title;

  // Synchronize canonical URL.
  const canonicalTags = [
    ...head.querySelectorAll('link[rel~="canonical"]'),
  ];

  const preferredCanonical =
    canonicalTags.find(isHelmetManaged) ||
    canonicalTags[canonicalTags.length - 1];

  if (preferredCanonical) {
    preferredCanonical.setAttribute("href", canonical);
  } else {
    const link = document.createElement("link");

    link.setAttribute("rel", "canonical");
    link.setAttribute("href", canonical);
    link.setAttribute("data-ultra-seo", "true");

    head.appendChild(link);
  }

  // Standard metadata.
  updateMeta("name", "description", description);
  updateMeta("name", "robots", robots);

  // Open Graph.
  updateMeta("property", "og:type", ogType);
  updateMeta("property", "og:title", title);
  updateMeta("property", "og:description", description);
  updateMeta("property", "og:url", canonical);
  updateMeta("property", "og:image", image);

  // Twitter / X.
  updateMeta(
    "name",
    "twitter:card",
    image ? "summary_large_image" : "summary"
  );

  updateMeta("name", "twitter:title", title);
  updateMeta(
    "name",
    "twitter:description",
    description
  );
  updateMeta("name", "twitter:image", image);

  removeDuplicateSeoTags();
}

export default function SEO({
  title,
  description,
  canonical,
  image,
  robotsIndex = true,
  robotsFollow = true,
  ogType = "website",
  schema,
}) {
  const { pathname } = useLocation();

  const finalTitle = isValid(title)
    ? title.trim()
    : DEFAULT_TITLE;

  const finalDescription = isValid(description)
    ? description.trim()
    : DEFAULT_DESCRIPTION;

  const finalCanonical = normalizeCanonical(
    canonical,
    pathname
  );

  const finalImage = absoluteUrl(image);

  const robots = `${
    robotsIndex ? "index" : "noindex"
  }, ${
    robotsFollow ? "follow" : "nofollow"
  }`;

  const schemaList = useMemo(
    () => normalizeSchema(schema),
    [schema]
  );

  useEffect(() => {
    synchronizeSeo({
      title: finalTitle,
      description: finalDescription,
      canonical: finalCanonical,
      image: finalImage,
      robots,
      ogType,
    });
  }, [
    pathname,
    finalTitle,
    finalDescription,
    finalCanonical,
    finalImage,
    robots,
    ogType,
  ]);

  return (
    <Helmet prioritizeSeoTags>
      <title>{finalTitle}</title>

      <meta
        name="description"
        content={finalDescription}
      />

      <meta name="robots" content={robots} />

      <link
        rel="canonical"
        href={finalCanonical}
      />

      <meta property="og:type" content={ogType} />

      <meta
        property="og:title"
        content={finalTitle}
      />

      <meta
        property="og:description"
        content={finalDescription}
      />

      <meta
        property="og:url"
        content={finalCanonical}
      />

      {finalImage && (
        <meta
          property="og:image"
          content={finalImage}
        />
      )}

      <meta
        name="twitter:card"
        content={
          finalImage
            ? "summary_large_image"
            : "summary"
        }
      />

      <meta
        name="twitter:title"
        content={finalTitle}
      />

      <meta
        name="twitter:description"
        content={finalDescription}
      />

      {finalImage && (
        <meta
          name="twitter:image"
          content={finalImage}
        />
      )}

      {schemaList.map((schemaItem, index) => (
        <script
          key={index}
          type="application/ld+json"
        >
          {JSON.stringify(schemaItem).replace(
            /</g,
            "\\u003c"
          )}
        </script>
      ))}
    </Helmet>
  );
}

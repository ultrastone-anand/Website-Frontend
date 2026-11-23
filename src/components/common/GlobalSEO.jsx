
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const SITE_URL = "https://www.ultrastones.com";

const SEO_BACKEND =
  import.meta.env.VITE_SEO_URL ||
  "https://backend.ultrastones.com";

const MANAGED_ATTRIBUTES = [
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

const GLOBAL_SCHEMA_TYPES = new Set([
  "Organization",
  "WebSite",
]);

function getSchemaTypes(schema) {
  const items = Array.isArray(schema)
    ? schema
    : schema?.["@graph"]
      ? schema["@graph"]
      : [schema];

  return items.flatMap((item) => {
    const type = item?.["@type"];

    return Array.isArray(type)
      ? type
      : type
        ? [type]
        : [];
  });
}

function getMeta(head, attribute, name) {
  return head.querySelector(
    `meta[${attribute}="${name}"]`
  )?.getAttribute("content") || "";
}

function extractSeo(html) {
  const documentObject = new DOMParser().parseFromString(
    html,
    "text/html"
  );

  const head = documentObject.head;

  const schemas = [];

  head.querySelectorAll(
    'script[type="application/ld+json"]'
  ).forEach((script) => {
    try {
      const parsed = JSON.parse(script.textContent);

      const types = getSchemaTypes(parsed);

      if (
        !types.length ||
        !types.every((type) =>
          GLOBAL_SCHEMA_TYPES.has(type)
        )
      ) {
        schemas.push(parsed);
      }
    } catch {
      // Ignore invalid schema.
    }
  });

  return {
    title:
      head.querySelector("title")?.textContent || "",
    canonical:
      head.querySelector('link[rel="canonical"]')
        ?.getAttribute("href") || "",
    description: getMeta(
      head,
      "name",
      "description"
    ),
    robots: getMeta(head, "name", "robots"),
    ogType: getMeta(head, "property", "og:type"),
    ogTitle: getMeta(head, "property", "og:title"),
    ogDescription: getMeta(
      head,
      "property",
      "og:description"
    ),
    ogUrl: getMeta(head, "property", "og:url"),
    ogImage: getMeta(head, "property", "og:image"),
    twitterCard: getMeta(
      head,
      "name",
      "twitter:card"
    ),
    twitterTitle: getMeta(
      head,
      "name",
      "twitter:title"
    ),
    twitterDescription: getMeta(
      head,
      "name",
      "twitter:description"
    ),
    twitterImage: getMeta(
      head,
      "name",
      "twitter:image"
    ),
    schemas,
  };
}

function setMeta(attribute, name, value) {
  const selector = `meta[${attribute}="${name}"]`;

  const elements = [
    ...document.head.querySelectorAll(selector),
  ];

  if (!value) {
    elements.forEach((element) => element.remove());
    return;
  }

  const preferred =
    elements.find((element) =>
      element.hasAttribute("data-rh")
    ) ||
    elements[0];

  const meta =
    preferred || document.createElement("meta");

  meta.setAttribute(attribute, name);
  meta.setAttribute("content", value);

  if (!preferred) {
    meta.setAttribute("data-ultra-global-seo", "true");
    document.head.appendChild(meta);
  }

  elements.forEach((element) => {
    if (element !== meta) element.remove();
  });
}

function setCanonical(value) {
  const elements = [
    ...document.head.querySelectorAll(
      'link[rel~="canonical"]'
    ),
  ];

  const preferred =
    elements.find((element) =>
      element.hasAttribute("data-rh")
    ) ||
    elements[0];

  const link =
    preferred || document.createElement("link");

  link.setAttribute("rel", "canonical");
  link.setAttribute("href", value);

  if (!preferred) {
    link.setAttribute(
      "data-ultra-global-seo",
      "true"
    );
    document.head.appendChild(link);
  }

  elements.forEach((element) => {
    if (element !== link) element.remove();
  });
}

function synchronizeSchemas(schemas) {
  document.head.querySelectorAll(
    'script[data-ultra-global-schema="true"]'
  ).forEach((element) => element.remove());

  // Preserve Organization and WebSite schemas.
  // Remove page-specific schemas from previous routes.
  document.head.querySelectorAll(
    'script[type="application/ld+json"]'
  ).forEach((element) => {
    try {
      const parsed = JSON.parse(element.textContent);
      const types = getSchemaTypes(parsed);

      if (
        types.length &&
        types.every((type) =>
          GLOBAL_SCHEMA_TYPES.has(type)
        )
      ) {
        return;
      }

      element.remove();
    } catch {
      // Preserve unrelated scripts.
    }
  });

  schemas.forEach((schema) => {
    const script = document.createElement("script");

    script.type = "application/ld+json";
    script.setAttribute(
      "data-ultra-global-schema",
      "true"
    );

    script.textContent = JSON.stringify(schema)
      .replace(/</g, "\\u003c");

    document.head.appendChild(script);
  });
}

function applySeo(seo, pathname) {
  const canonical =
    seo.canonical ||
    `${SITE_URL}${pathname}`;

  if (seo.title) {
    document.title = seo.title;
  }

  setCanonical(canonical);

  const metadata = [
    ["name", "description", seo.description],
    ["name", "robots", seo.robots],
    ["property", "og:type", seo.ogType],
    ["property", "og:title", seo.ogTitle],
    [
      "property",
      "og:description",
      seo.ogDescription,
    ],
    ["property", "og:url", seo.ogUrl || canonical],
    ["property", "og:image", seo.ogImage],
    ["name", "twitter:card", seo.twitterCard],
    ["name", "twitter:title", seo.twitterTitle],
    [
      "name",
      "twitter:description",
      seo.twitterDescription,
    ],
    ["name", "twitter:image", seo.twitterImage],
  ];

  metadata.forEach(([attribute, name, value]) => {
    setMeta(attribute, name, value);
  });

  synchronizeSchemas(seo.schemas);
}

function isProductRoute(pathname) {
  return /^\/product\/[^/]+\/[^/]+\/?$/.test(
    pathname
  );
}

export default function GlobalSEO() {
  const location = useLocation();
  const requestId = useRef(0);

  useEffect(() => {
    const pathname = location.pathname;
    const currentRequest = ++requestId.current;
    const controller = new AbortController();

    // ProductDetails already has its own SEO component.
    // Avoid competing with its React Helmet updates.
    if (isProductRoute(pathname)) {
      return () => controller.abort();
    }

    const loadSeo = async () => {
      try {
        const response = await fetch(
          `${SEO_BACKEND}${pathname}`,
          {
            signal: controller.signal,
            headers: {
              Accept: "text/html",
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `SEO request failed: ${response.status}`
          );
        }

        const html = await response.text();

        if (
          controller.signal.aborted ||
          currentRequest !== requestId.current
        ) {
          return;
        }

        const seo = extractSeo(html);

        // Do not overwrite metadata with an
        // incomplete or unavailable SSR response.
        if (!seo.title || !seo.canonical) {
          return;
        }

        applySeo(seo, pathname);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(
            "[GlobalSEO] Unable to synchronize SEO:",
            error
          );
        }
      }
    };

    loadSeo();

    return () => {
      controller.abort();
    };
  }, [location.pathname]);

  return null;
}

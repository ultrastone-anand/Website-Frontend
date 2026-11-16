
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Download,
  ExternalLink,
  FileText,
  FolderOpen,
} from "lucide-react";

import Loading from "../../../components/common/Loading";
import { getOptimizedImageUrl } from "../../../utils/Mediahelper";

// ============================================================
// CONFIGURATION
// ============================================================

const RAW_API_URL = (
  import.meta.env.VITE_API_URL || ""
).replace(/\/+$/, "");

const API_URL = RAW_API_URL.endsWith("/api")
  ? RAW_API_URL
  : `${RAW_API_URL}/api`;

const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

const FILTERS = [
  { id: "all", label: "All Resources" },
  { id: "care", label: "Care & Maintenance" },
  { id: "warranty", label: "Warranty" },
  { id: "faq", label: "FAQ" },
];

// ============================================================
// GENERAL HELPERS
// ============================================================

const extractArray = (response) => {
  const candidates = [
    response,
    response?.data,
    response?.data?.data,
    response?.data?.resources,
    response?.data?.data?.resources,
    response?.resources,
    response?.categories,
    response?.data?.categories,
  ];

  return candidates.find(Array.isArray) || [];
};

const isActive = (value) =>
  value === true ||
  value === 1 ||
  value === "1" ||
  value === "true";

const getInitials = (name = "") =>
  String(name)
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

const getFileUrl = (url) => {
  if (!url || typeof url !== "string") return "";

  const clean = url.trim();

  if (/^https?:\/\//i.test(clean)) return clean;

  if (clean.startsWith("//")) {
    return `https:${clean}`;
  }

  if (/^[a-z][a-z0-9+.-]*:/i.test(clean)) {
    return "";
  }

  return `${API_ORIGIN}${
    clean.startsWith("/") ? "" : "/"
  }${clean}`;
};

const normalizeFilterType = (value) => {
  if (!value) return null;

  const normalized = String(value)
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");

  if (
    [
      "care",
      "care maintenance",
      "care and maintenance",
      "care & maintenance",
      "maintenance",
    ].includes(normalized)
  ) {
    return "care";
  }

  if (
    ["warranty", "warranties", "warrenty"].includes(
      normalized
    )
  ) {
    return "warranty";
  }

  if (
    ["faq", "faqs", "frequently asked questions"].includes(
      normalized
    )
  ) {
    return "faq";
  }

  return null;
};

const getResourceFilterType = (resource) => {
  const candidates = [
    resource.resource_category,
    resource.resource_category_name,
    resource.document_category,
    resource.document_type,
    resource.resource_group,
    resource.resource_section,
    resource.section,
    resource.category_type,
    resource.type_name,
    resource.filter_type,
    resource.resource_subtype,
  ];

  for (const candidate of candidates) {
    const value =
      candidate && typeof candidate === "object"
        ? candidate.name ||
          candidate.slug ||
          candidate.code
        : candidate;

    const match = normalizeFilterType(value);

    if (match) return match;
  }

  return null;
};

const getResourceLabel = (resource) =>
  FILTERS.find(
    (filter) =>
      filter.id === getResourceFilterType(resource)
  )?.label || "Other Documents";

const sortCategories = (a, b) => {
  if (a.slug === "ultra-quartz") return -1;
  if (b.slug === "ultra-quartz") return 1;

  if (a.slug === "atlas-plan") return 1;
  if (b.slug === "atlas-plan") return -1;

  return String(a.name).localeCompare(
    String(b.name),
    undefined,
    { sensitivity: "base" }
  );
};

const sortResources = (a, b) =>
  Number(a.display_order || 0) -
    Number(b.display_order || 0) ||
  String(a.title || "").localeCompare(
    String(b.title || "")
  );

// ============================================================
// PDF GENERATION HELPERS
// ============================================================

const getSafeFilename = (title = "Ultra-Stones-Resource") =>
  String(title)
    .trim()
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 100) || "Ultra-Stones-Resource";

const sanitizeResourceHtml = (html = "") =>
  DOMPurify.sanitize(String(html || ""), {
    USE_PROFILES: { html: true },
  });

const createTextElement = (
  tag,
  value,
  styles = ""
) => {
  const element = document.createElement(tag);
  element.textContent = String(value || "");
  element.style.cssText = styles;
  return element;
};

// ============================================================
// GENERATE PDF FROM TEXT RESOURCE
// ============================================================

const downloadTextResourcePdf = async (resource) => {
  const html2pdf = (await import("html2pdf.js")).default;

  const container = document.createElement("div");

  container.style.cssText = `
    width: 720px;
    padding: 42px;
    box-sizing: border-box;
    background: #ffffff;
    color: #222222;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 13px;
    line-height: 1.75;
    overflow-wrap: anywhere;
  `;

  // ----------------------------------------------------------
  // BRAND HEADER
  // ----------------------------------------------------------

  const header = document.createElement("div");

  header.style.cssText = `
    border-bottom: 3px solid #c91f26;
    padding-bottom: 20px;
    margin-bottom: 32px;
  `;

  const brand = createTextElement(
    "div",
    "ULTRA STONES",
    `
      font-size: 25px;
      font-weight: 700;
      letter-spacing: 1px;
      color: #181818;
    `
  );

  const subtitle = createTextElement(
    "div",
    "RESOURCE CENTER",
    `
      margin-top: 5px;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 2px;
      color: #777777;
    `
  );

  header.append(brand, subtitle);

  // ----------------------------------------------------------
  // RESOURCE CATEGORY
  // ----------------------------------------------------------

  const category = createTextElement(
    "div",
    getResourceLabel(resource).toUpperCase(),
    `
      margin-bottom: 12px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1.4px;
      color: #c91f26;
    `
  );

  // ----------------------------------------------------------
  // RESOURCE TITLE
  // ----------------------------------------------------------

  const title = createTextElement(
    "h1",
    resource.title || "Resource Document",
    `
      margin: 0 0 18px;
      font-size: 26px;
      font-weight: 700;
      line-height: 1.3;
      color: #181818;
    `
  );

  // ----------------------------------------------------------
  // DESCRIPTION
  // ----------------------------------------------------------

  const description = createTextElement(
    "p",
    resource.description || "",
    `
      margin: 0 0 26px;
      font-size: 13px;
      line-height: 1.8;
      color: #666666;
    `
  );

  // ----------------------------------------------------------
  // FULL RESOURCE CONTENT
  // ----------------------------------------------------------

  const content = document.createElement("div");

  content.innerHTML = sanitizeResourceHtml(
    resource.content || ""
  );

  content.style.cssText = `
    font-size: 13px;
    line-height: 1.85;
    color: #333333;
    overflow-wrap: anywhere;
  `;

  // ----------------------------------------------------------
  // DOCUMENT FOOTER
  // ----------------------------------------------------------

  const footer = createTextElement(
    "div",
    "ULTRA STONES  |  www.ultrastones.com",
    `
      margin-top: 40px;
      padding-top: 15px;
      border-top: 1px solid #dddddd;
      font-size: 10px;
      color: #888888;
      letter-spacing: 0.4px;
    `
  );

  container.append(
    header,
    category,
    title
  );

  if (resource.description) {
    container.appendChild(description);
  }

  container.append(content, footer);

  // ----------------------------------------------------------
  // PDF PRINT STYLES
  // ----------------------------------------------------------

  const style = document.createElement("style");

  style.textContent = `
    .ultra-resource-pdf h1,
    .ultra-resource-pdf h2,
    .ultra-resource-pdf h3,
    .ultra-resource-pdf h4 {
      color: #222222;
      font-weight: 700;
      line-height: 1.4;
      break-after: avoid;
      page-break-after: avoid;
    }

    .ultra-resource-pdf h2 {
      font-size: 19px;
      margin: 24px 0 12px;
    }

    .ultra-resource-pdf h3 {
      font-size: 16px;
      margin: 20px 0 10px;
    }

    .ultra-resource-pdf p {
      margin: 0 0 14px;
    }

    .ultra-resource-pdf ul,
    .ultra-resource-pdf ol {
      margin: 10px 0 18px;
      padding-left: 25px;
    }

    .ultra-resource-pdf li {
      margin-bottom: 8px;
    }

    .ultra-resource-pdf strong,
    .ultra-resource-pdf b {
      font-weight: 700;
    }

    .ultra-resource-pdf a {
      color: #c91f26;
      text-decoration: underline;
    }

    .ultra-resource-pdf table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 12px;
    }

    .ultra-resource-pdf th,
    .ultra-resource-pdf td {
      border: 1px solid #dddddd;
      padding: 9px;
      text-align: left;
    }

    .ultra-resource-pdf th {
      background: #f2f2f2;
      font-weight: 700;
    }

    .ultra-resource-pdf img {
      max-width: 100%;
      height: auto;
    }

    .ultra-resource-pdf tr,
    .ultra-resource-pdf img {
      break-inside: avoid;
      page-break-inside: avoid;
    }
  `;

  container.className = "ultra-resource-pdf";

  // ----------------------------------------------------------
  // MOUNT PDF CONTENT
  // ----------------------------------------------------------

  const mount = document.createElement("div");

  mount.style.cssText = `
    position: fixed;
    left: -10000px;
    top: 0;
    width: 720px;
    z-index: -1;
    pointer-events: none;
  `;

  mount.append(style, container);

  document.body.appendChild(mount);

  // ----------------------------------------------------------
  // PDF OPTIONS
  // ----------------------------------------------------------

  const options = {
    margin: [12, 12, 12, 12],

    filename: `${getSafeFilename(
      resource.title
    )}.pdf`,

    image: {
      type: "jpeg",
      quality: 0.98,
    },

    html2canvas: {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      windowWidth: 900,
    },

    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },

    pagebreak: {
      mode: ["css", "legacy"],
      avoid: [
        "tr",
        "img",
        "h2",
        "h3",
      ],
    },
  };

  // ----------------------------------------------------------
  // GENERATE AND DOWNLOAD
  // ----------------------------------------------------------

  try {
    await document.fonts.ready;

    await html2pdf()
      .set(options)
      .from(container)
      .save();
  } finally {
    mount.remove();
  }
};

// ============================================================
// DOWNLOAD EXISTING PDF
// ============================================================

const downloadExistingPdf = async (resource) => {
  const fileUrl = getFileUrl(resource.file_url);

  if (!fileUrl) {
    throw new Error("PDF file is unavailable.");
  }

  const response = await fetch(fileUrl);

  if (!response.ok) {
    throw new Error("Unable to download PDF.");
  }

  const blob = await response.blob();

  const blobUrl = URL.createObjectURL(blob);

  try {
    const link = document.createElement("a");

    link.href = blobUrl;

    link.download = `${getSafeFilename(
      resource.title
    )}.pdf`;

    document.body.appendChild(link);

    link.click();

    link.remove();
  } finally {
    setTimeout(() => {
      URL.revokeObjectURL(blobUrl);
    }, 1000);
  }
};

// ============================================================
// CATEGORY IMAGE
// ============================================================

function CategoryImage({ category }) {
  const imageUrl =
    category.thumbnail_url ||
    category.banner_url ||
    null;

  const optimizedUrl = imageUrl
    ? getOptimizedImageUrl(imageUrl, 1200, 85)
    : null;

  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [optimizedUrl]);

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#efefef]">
      {optimizedUrl && !failed ? (
        <img
          src={optimizedUrl}
          alt={category.name}
          loading="lazy"
          decoding="async"
          draggable={false}
          onError={() => setFailed(true)}
          className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.035]"
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-neutral-200 text-5xl font-semibold text-[#777]">
          {getInitials(category.name)}
        </div>
      )}
    </div>
  );
}

// ============================================================
// CATEGORY RESOURCE BADGES
// ============================================================

function ResourceBadges({ resources }) {
  const types = FILTERS.filter(
    (filter) =>
      filter.id !== "all" &&
      resources.some(
        (resource) =>
          getResourceFilterType(resource) === filter.id
      )
  );

  const hasOther = resources.some(
    (resource) => !getResourceFilterType(resource)
  );

  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {types.map((filter) => (
        <span
          key={filter.id}
          className="border border-[#dedede] bg-white px-2 py-[5px] text-[10px] font-medium leading-tight text-[#555] transition-colors group-hover:border-[#c91f26]"
        >
          {filter.label}
        </span>
      ))}

      {hasOther && (
        <span className="border border-[#dedede] bg-white px-2 py-[5px] text-[10px] font-medium text-[#555]">
          Other Documents
        </span>
      )}
    </div>
  );
}

// ============================================================
// CATEGORY CARD - OUTSIDE PAGE
// ============================================================

function CategoryCard({
  category,
  categoryResources,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full cursor-pointer text-left"
    >
      <CategoryImage category={category} />

      <div className="border-b border-[#e5e5e5] py-5 transition-colors group-hover:border-[#c91f26]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[18px] font-semibold text-[#161412]">
            {category.name}
          </h2>

          <ArrowRight
            size={20}
            strokeWidth={1.5}
            className="shrink-0 transition-transform duration-300 group-hover:translate-x-1.5"
          />
        </div>

        <ResourceBadges resources={categoryResources} />
      </div>
    </button>
  );
}

// ============================================================
// DOCUMENT CARD - INSIDE PAGE
// ============================================================

function DocumentCard({
  resource,
  expanded,
  onToggle,
}) {
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  const isPdf =
    String(resource.resource_type || "").toUpperCase() ===
    "PDF";

  const fileUrl = getFileUrl(resource.file_url);

  const label = getResourceLabel(resource);

  const panelId = `resource-panel-${resource.id}`;

  // ----------------------------------------------------------
  // DOWNLOAD HANDLER
  // ----------------------------------------------------------

  const handleDownload = async () => {
    if (downloading) return;

    setDownloading(true);
    setDownloadError("");

    try {
      if (isPdf) {
        await downloadExistingPdf(resource);
      } else {
        await downloadTextResourcePdf(resource);
      }
    } catch (error) {
      console.error(
        "Resource PDF download failed:",
        error
      );

      setDownloadError(
        "Unable to download PDF. Please try again."
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <article
      className={`
        flex min-w-0 flex-col overflow-hidden
        rounded-[5px] border
        transition-all duration-300
        ${
          expanded
            ? "border-[#bcbcbc] bg-white shadow-sm"
            : "border-[#e5e5e5] bg-[#f8f8f8] hover:border-[#bbb]"
        }
      `}
    >
      {/* DOCUMENT HEADER */}

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={panelId}
        className="flex w-full flex-1 flex-col px-5 pb-5 pt-5 text-left md:px-6"
      >
        <div className="mb-5 flex w-full items-center justify-between">
          <FileText
            size={19}
            strokeWidth={1.5}
            className="text-[#c91f26]"
          />

          <ChevronDown
            size={17}
            strokeWidth={1.4}
            className={`text-[#777] transition-transform duration-300 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>

        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[1.1px] text-[#c91f26]">
          {label}
        </p>

        <h3 className="text-[16px] font-semibold leading-snug text-[#222] md:text-[17px]">
          {resource.title}
        </h3>

        {resource.description && (
          <p className="mt-2 line-clamp-2 text-[12px] leading-[1.7] text-[#858585]">
            {resource.description}
          </p>
        )}
      </button>

      {/* DOCUMENT FOOTER */}

      <div className="mx-5 flex min-h-[52px] items-center justify-between gap-3 border-t border-[#e5e5e5] md:mx-6">
        <button
          type="button"
          onClick={onToggle}
          className="text-[10px] font-semibold uppercase tracking-[0.6px] text-[#555] transition-colors hover:text-[#c91f26]"
        >
          {expanded ? "Close Document" : "View Document"}
        </button>

        <button
          type="button"
          onClick={handleDownload}
          disabled={
            downloading ||
            (isPdf
              ? !fileUrl
              : !resource.content)
          }
          className="
            inline-flex items-center gap-1.5
            border border-[#e6b2b4]
            px-2.5 py-1.5
            text-[10px] font-medium
            text-[#c91f26]
            transition-colors
            hover:border-[#c91f26]
            hover:bg-[#c91f26]
            hover:text-white
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          {downloading
            ? "Preparing..."
            : "Download PDF"}

          <Download size={12} />
        </button>
      </div>

      {/* DOWNLOAD ERROR */}

      {downloadError && (
        <p
          role="alert"
          className="px-5 pb-3 text-[11px] text-red-600 md:px-6"
        >
          {downloadError}
        </p>
      )}

      {/* EXPANDED CONTENT */}

      {expanded && (
        <div
          id={panelId}
          className="min-w-0 border-t border-[#e5e5e5] bg-white px-5 pb-6 pt-5 md:px-6"
        >
          {resource.description && (
            <p className="mb-4 text-[13px] leading-6 text-[#666]">
              {resource.description}
            </p>
          )}

          {isPdf ? (
            fileUrl ? (
              <>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mb-4 inline-flex items-center gap-2 text-[12px] font-semibold text-[#c91f26] hover:underline"
                >
                  <ExternalLink size={15} />
                  Open Full PDF
                </a>

                <div className="overflow-hidden border border-[#e5e5e5] bg-[#f5f5f5]">
                  <iframe
                    src={`${fileUrl}#toolbar=1`}
                    title={`${resource.title} PDF Preview`}
                    loading="lazy"
                    className="h-[400px] w-full"
                  />
                </div>
              </>
            ) : (
              <p className="text-[12px] text-[#888]">
                This PDF is currently unavailable.
              </p>
            )
          ) : resource.content ? (
            <div
              className="
                min-w-0 break-words
                text-[13px] leading-7 text-[#555]
                [&_p]:mb-4
                [&_h2]:mb-3
                [&_h2]:mt-5
                [&_h2]:text-lg
                [&_h2]:font-semibold
                [&_h3]:mb-2
                [&_h3]:mt-4
                [&_h3]:font-semibold
                [&_ul]:list-disc
                [&_ul]:pl-5
                [&_ol]:list-decimal
                [&_ol]:pl-5
                [&_li]:mb-2
                [&_a]:text-[#c91f26]
                [&_a]:underline
                [&_img]:max-w-full
                [&_table]:block
                [&_table]:max-w-full
                [&_table]:overflow-x-auto
              "
              dangerouslySetInnerHTML={{
                __html: sanitizeResourceHtml(
                  resource.content
                ),
              }}
            />
          ) : (
            <p className="text-[12px] text-[#888]">
              No additional content available.
            </p>
          )}
        </div>
      )}
    </article>
  );
}

// ============================================================
// FILTER BAR
// ============================================================

function ResourceFilterBar({
  activeFilter,
  onChange,
}) {
  return (
    <div className="grid grid-cols-2 gap-1 rounded-[5px] border border-[#aaa] bg-[#e8e8e8] p-1 md:grid-cols-4">
      {FILTERS.map((filter) => {
        const selected =
          filter.id === "all"
            ? !activeFilter
            : activeFilter === filter.id;

        return (
          <button
            key={filter.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(filter.id)}
            className={`
              min-h-[38px] rounded-[3px]
              px-3 py-2
              text-center text-[12px]
              font-medium transition-colors
              ${
                selected
                  ? "bg-[#171717] text-white"
                  : "text-[#333] hover:bg-white"
              }
            `}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}

// ============================================================
// MAIN RESOURCES PAGE
// ============================================================

export default function Resources() {
  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------

  const [materials, setMaterials] = useState([]);
  const [resources, setResources] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [expandedId, setExpandedId] = useState(null);

  const [searchParams, setSearchParams] =
    useSearchParams();

  // ----------------------------------------------------------
  // URL PARAMETERS
  // ----------------------------------------------------------

  const requestedFilter = searchParams
    .get("type")
    ?.toLowerCase();

  const activeFilter = FILTERS.some(
    (filter) =>
      filter.id !== "all" &&
      filter.id === requestedFilter
  )
    ? requestedFilter
    : null;

  const categorySlug = searchParams.get("category");

  // ----------------------------------------------------------
  // FETCH API DATA
  // ----------------------------------------------------------

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          categoriesResponse,
          resourcesResponse,
        ] = await Promise.all([
          axios.get(`${API_URL}/stones`, {
            signal: controller.signal,
          }),

          axios.get(
            `${API_URL}/category-resources/public`,
            {
              signal: controller.signal,
            }
          ),
        ]);

        const categoriesData = extractArray(
          categoriesResponse.data
        );

        const resourcesData = extractArray(
          resourcesResponse.data
        );

        const activeResources = resourcesData.filter(
          (resource) =>
            resource.is_active === undefined ||
            resource.is_active === null ||
            isActive(resource.is_active)
        );

        const activeCategoryIds = new Set(
          activeResources.map((resource) =>
            String(resource.category_id)
          )
        );

        const filteredCategories = categoriesData
          .filter(
            (category) =>
              isActive(category.is_active) &&
              (category.parent_id === null ||
                category.parent_id === undefined) &&
              activeCategoryIds.has(String(category.id))
          )
          .sort(sortCategories);

        if (!controller.signal.aborted) {
          setMaterials(filteredCategories);
          setResources(activeResources);
        }
      } catch (err) {
        if (
          err.code !== "ERR_CANCELED" &&
          err.name !== "CanceledError" &&
          !controller.signal.aborted
        ) {
          console.error(
            "Resources page error:",
            err
          );

          setError(
            err.response?.data?.message ||
              "Unable to load resources. Please try again."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => controller.abort();
  }, []);

  // ----------------------------------------------------------
  // FILTER RESOURCES
  // ----------------------------------------------------------

  const filteredResources = useMemo(() => {
    if (!activeFilter) return resources;

    return resources.filter(
      (resource) =>
        getResourceFilterType(resource) === activeFilter
    );
  }, [resources, activeFilter]);

  // ----------------------------------------------------------
  // VISIBLE CATEGORIES
  // ----------------------------------------------------------

  const visibleMaterials = useMemo(() => {
    const categoryIds = new Set(
      filteredResources.map((resource) =>
        String(resource.category_id)
      )
    );

    return materials.filter((category) =>
      categoryIds.has(String(category.id))
    );
  }, [materials, filteredResources]);

  // ----------------------------------------------------------
  // SELECTED CATEGORY
  // ----------------------------------------------------------

  const selectedCategory = useMemo(() => {
    if (!categorySlug) return null;

    return (
      materials.find(
        (category) =>
          category.slug === categorySlug
      ) || null
    );
  }, [materials, categorySlug]);

  // ----------------------------------------------------------
  // SELECTED CATEGORY RESOURCES
  // ----------------------------------------------------------

  const selectedResources = useMemo(() => {
    if (!selectedCategory) return [];

    return filteredResources
      .filter(
        (resource) =>
          String(resource.category_id) ===
          String(selectedCategory.id)
      )
      .sort(sortResources);
  }, [filteredResources, selectedCategory]);

  // ----------------------------------------------------------
  // NAVIGATION
  // ----------------------------------------------------------

  const updateParams = ({ type, category }) => {
    setExpandedId(null);

    setSearchParams((previous) => {
      const updated = new URLSearchParams(previous);

      if (type === null) {
        updated.delete("type");
      } else if (type !== undefined) {
        updated.set("type", type);
      }

      if (category === null) {
        updated.delete("category");
      } else if (category !== undefined) {
        updated.set("category", category);
      }

      return updated;
    });
  };

  const handleFilterClick = (filterId) => {
    updateParams({
      type: filterId === "all" ? null : filterId,
      category: selectedCategory
        ? selectedCategory.slug
        : null,
    });
  };

  const handleCategoryClick = (category) => {
    updateParams({
      category: category.slug,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleBack = () => {
    updateParams({
      category: null,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    setExpandedId(null);
  }, [categorySlug, activeFilter]);

  // ----------------------------------------------------------
  // LOADING
  // ----------------------------------------------------------

  if (loading) {
    return <Loading />;
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <main
      className="min-h-screen bg-white pt-[110px]"
      style={{
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      {/* ERROR */}

      {error && (
        <section className="mx-auto max-w-[1650px] px-6 py-10 xl:px-10">
          <div className="border border-red-200 bg-red-50 p-5 text-[14px] text-red-700">
            {error}
          </div>
        </section>
      )}

      {/* =====================================================
          OUTSIDE PAGE - CATEGORY GRID
      ===================================================== */}

      {!selectedCategory && !error && (
        <>
          <section className="mx-auto max-w-[1650px] px-6 xl:px-10">
            <h1 className="text-[34px] font-semibold leading-none text-[#161412] md:text-[42px]">
              Resources
            </h1>

            <div className="mb-4 mt-4 h-[4px] w-[70px] bg-[#c91f26]" />

            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-[12px] text-[#777]"
            >
              <Link
                to="/"
                className="hover:text-[#c91f26]"
              >
                Home
              </Link>

              <span>/</span>

              <span className="font-semibold text-[#161412]">
                Resources
              </span>
            </nav>

            <div className="mt-7">
              <ResourceFilterBar
                activeFilter={activeFilter}
                onChange={handleFilterClick}
              />
            </div>
          </section>

          <section className="mx-auto max-w-[1650px] px-6 pb-20 pt-10 xl:px-10">
            {visibleMaterials.length === 0 ? (
              <div className="py-20 text-center">
                <FolderOpen
                  size={38}
                  strokeWidth={1}
                  className="mx-auto mb-5 text-[#aaa]"
                />

                <h2 className="text-[18px] font-semibold">
                  No Resources Available
                </h2>

                <p className="mt-2 text-[13px] text-[#777]">
                  No resources match the selected filter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {visibleMaterials.map((category) => {
                  const categoryResources =
                    filteredResources.filter(
                      (resource) =>
                        String(resource.category_id) ===
                        String(category.id)
                    );

                  return (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      categoryResources={categoryResources}
                      onClick={() =>
                        handleCategoryClick(category)
                      }
                    />
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}

      {/* =====================================================
          INSIDE PAGE - RESOURCE CENTER
      ===================================================== */}

      {selectedCategory && !error && (
        <>
          {/* DARK HERO */}

          <section className="bg-[#242424] text-white">
            <div className="mx-auto max-w-[1650px] px-6 py-10 md:py-12 xl:px-10">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-[1.6px] text-[#e5393f]">
                Resource Center —{" "}
                {selectedCategory.name}
              </p>

              <h1 className="max-w-[1050px] text-[28px] font-semibold leading-tight md:text-[40px]">
                Everything you need to know about your
                surface.
              </h1>

              <p className="mt-3 max-w-[850px] text-[13px] leading-6 text-[#bdbdbd] md:text-[14px]">
                Care instructions, warranty information,
                and expert guidance — organized in one
                place.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-4">
                <span className="text-[11px] text-[#bdbdbd]">
                  {selectedCategory.name}
                </span>

                <span className="h-1 w-1 rounded-full bg-[#777]" />

                <span className="text-[11px] text-[#bdbdbd]">
                  {selectedResources.length}{" "}
                  {selectedResources.length === 1
                    ? "Document"
                    : "Documents"}
                </span>

                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 text-[11px] font-medium text-white hover:text-[#f05a60]"
                >
                  <ArrowLeft size={13} />
                  All Categories
                </button>
              </div>
            </div>
          </section>

          {/* LIGHT GRAY CONTENT */}

          <section className="bg-[#e9e9e9]">
            <div className="mx-auto max-w-[1650px] px-6 pb-16 pt-9 xl:px-10">
              {/* FILTER HEADER */}

              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-[16px] font-semibold text-[#222]">
                  Explore Resources
                </h2>

                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 text-[11px] text-[#888] transition-colors hover:text-[#c91f26]"
                >
                  Back to all categories
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* FILTER BAR */}

              <ResourceFilterBar
                activeFilter={activeFilter}
                onChange={handleFilterClick}
              />

              {/* DOCUMENT SECTION HEADER */}

              <div className="mb-5 mt-10 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-[16px] font-semibold text-[#222]">
                  Available Documents
                </h2>

                <span className="text-[12px] text-[#999]">
                  {selectedResources.length}{" "}
                  {selectedResources.length === 1
                    ? "document"
                    : "documents"}
                </span>
              </div>

              {/* TWO-COLUMN DOCUMENT GRID */}

              {selectedResources.length === 0 ? (
                <div className="rounded-[5px] bg-white px-6 py-16 text-center">
                  <FileText
                    size={35}
                    strokeWidth={1}
                    className="mx-auto mb-4 text-[#aaa]"
                  />

                  <p className="text-[14px] text-[#777]">
                    No documents are available for this
                    selection.
                  </p>

                  {activeFilter && (
                    <button
                      type="button"
                      onClick={() =>
                        handleFilterClick("all")
                      }
                      className="mt-5 text-[12px] font-semibold text-[#c91f26] hover:underline"
                    >
                      View All Resources
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
                  {selectedResources.map((resource) => (
                    <DocumentCard
                      key={resource.id}
                      resource={resource}
                      expanded={
                        String(expandedId) ===
                        String(resource.id)
                      }
                      onToggle={() =>
                        setExpandedId((current) =>
                          String(current) ===
                          String(resource.id)
                            ? null
                            : resource.id
                        )
                      }
                    />
                  ))}
                </div>
              )}

              {/* ASSISTANCE SECTION */}

              <div className="mt-10 rounded-[5px] border border-[#e3e3e3] bg-[#f7f7f7] px-6 py-7 md:px-8 md:py-8">
                <h2 className="text-[19px] font-semibold text-[#222]">
                  Need additional assistance?
                </h2>

                <p className="mt-2 text-[13px] leading-6 text-[#888]">
                  Our team can help you find the right
                  information for your project.
                </p>

                <Link
                  to="/contact"
                  className="mt-5 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.8px] text-[#333] transition-colors hover:text-[#c91f26]"
                >
                  Contact Our Team

                  <ArrowRight
                    size={15}
                    strokeWidth={1.5}
                  />
                </Link>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

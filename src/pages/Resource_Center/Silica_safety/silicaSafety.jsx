import PropTypes from "prop-types";
import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Check,
  ChevronDown,
  Download,
  ExternalLink,
  FileText,
  Languages,
  Mail,
  Phone,
  Search,
  ShieldCheck,
} from "lucide-react";


const PAGE_SLUG = "silica-first";

const API_URL = import.meta.env.VITE_API_URL;

const getHeaders = () => {
  const token = sessionStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token && {
      Authorization: `Bearer ${token}`,
    }),
  };
};

const parseResponse = async (
  response,
  fallbackMessage
) => {
  let data;

  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message || fallbackMessage
    );
  }

  return data;
};

const getPageBySlug = async (slug) => {
  const response = await fetch(
    `${API_URL}/pages/${slug}`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  return parseResponse(
    response,
    "Failed to fetch page"
  );
};

const DEFAULT_CONTENT = {
  pageHeader: {
    heading: "Silica Safety First",
    breadcrumbLabel: "Silica Safety",
    parentBreadcrumbLabel: "Resource Center",
    parentBreadcrumbLink: "/resource-center",
  },

  hero: {
    image:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=2400&q=90",
    imageAlt:
      "Industrial workplace and fabrication safety",
    title: "Safety begins with knowledge.",
    description:
      "Access silica hazard information, official safety resources, Safety Data Sheets, good-practice guides, warning labels, and compliance information for the stone industry.",
    primaryButtonText:
      "Explore Safety Resources",
    primaryButtonLink: "#resources",
    secondaryButtonText:
      "View Safety Data Sheets",
    secondaryButtonLink:
      "#safety-data-sheets",
  },

  aboutSection: {
    eyebrow: "About This Page",
    paragraphs: [],
  },

  hazardAwareness: {
    eyebrow: "Silica Hazard Awareness",
    title:
      "Questions every stone professional should understand.",
    description:
      "Review essential information about crystalline silica, occupational exposure, health risks, final-user safety, and Ultra Stones' commitment.",
    questions: [],
  },

  resourcesSection: {
    eyebrow: "Official Information",
    title:
      "Safety resources and downloads.",
    description:
      "Access documents and guidance from recognized government agencies, occupational-health organizations, and stone-industry authorities.",
    items: [],
  },

  safetyDataSheetsSection: {
    eyebrow: "Document Library",
    title: "Safety Data Sheets",
    description:
      "Search and download Safety Data Sheets for Ultra Stones product categories and specialty surfaces.",
    searchPlaceholder:
      "Search by product or material type...",
    initialVisibleCount: 6,
    items: [],
  },

  guidesSection: {
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=2200&q=88",
    imageAlt:
      "Professional fabrication and workplace safety",
    eyebrow: "Best Practices",
    title:
      "Practical guidance for safer work.",
    description:
      "Download recommended fabrication and installation guidance covering dust-control methods, engineering controls, workplace procedures, and worker protection.",
    primaryButtonText:
      "Good Practice Guide",
    primaryPdfUrl: "",
    secondaryButtonText:
      "Installer Guide",
    secondaryPdfUrl: "",
    points: [],
  },

  labelsSection: {
    eyebrow: "Product Documentation",
    title: "Safety Labels",
    description:
      "Download product-specific warning labels communicating the presence of crystalline silica and important workplace precautions.",
    items: [],
  },

  certificationsSection: {
    eyebrow: "Product Standards",
    title: "Certifications",
    description:
      "Selected products may carry recognized certifications related to indoor air quality, material performance, and food-contact applications. Certification availability can vary by product.",
    footerText:
      "Contact Ultra Stones to confirm certification availability for a specific product.",
    items: [],
  },

  noticeSection: {
    title:
      "Safety & Compliance Notice",
    paragraphs: [],
  },

  contactSection: {
    eyebrow:
      "Need Additional Information?",
    title:
      "Speak with the Ultra Stones team.",
    description:
      "Contact us for available Safety Data Sheets, product documentation, warning labels, certification information, and other technical resources.",
    phone: "631-873-4747",
    phoneLink: "+16318734747",
    email: "info@ultrastones.com",
  },
};

const mergeContent = (saved = {}) => ({
  ...DEFAULT_CONTENT,
  ...saved,

  pageHeader: {
    ...DEFAULT_CONTENT.pageHeader,
    ...saved.pageHeader,
  },

  hero: {
    ...DEFAULT_CONTENT.hero,
    ...saved.hero,
  },

  aboutSection: {
    ...DEFAULT_CONTENT.aboutSection,
    ...saved.aboutSection,
    paragraphs: Array.isArray(
      saved.aboutSection?.paragraphs
    )
      ? saved.aboutSection.paragraphs
      : DEFAULT_CONTENT.aboutSection
          .paragraphs,
  },

  hazardAwareness: {
    ...DEFAULT_CONTENT.hazardAwareness,
    ...saved.hazardAwareness,
    questions: Array.isArray(
      saved.hazardAwareness?.questions
    )
      ? saved.hazardAwareness.questions
      : DEFAULT_CONTENT.hazardAwareness
          .questions,
  },

  resourcesSection: {
    ...DEFAULT_CONTENT.resourcesSection,
    ...saved.resourcesSection,
    items: Array.isArray(
      saved.resourcesSection?.items
    )
      ? saved.resourcesSection.items
      : DEFAULT_CONTENT.resourcesSection
          .items,
  },

  safetyDataSheetsSection: {
    ...DEFAULT_CONTENT
      .safetyDataSheetsSection,
    ...saved.safetyDataSheetsSection,
    items: Array.isArray(
      saved.safetyDataSheetsSection?.items
    )
      ? saved.safetyDataSheetsSection
          .items
      : DEFAULT_CONTENT
          .safetyDataSheetsSection.items,
  },

  guidesSection: {
    ...DEFAULT_CONTENT.guidesSection,
    ...saved.guidesSection,
    points: Array.isArray(
      saved.guidesSection?.points
    )
      ? saved.guidesSection.points
      : DEFAULT_CONTENT.guidesSection
          .points,
  },

  labelsSection: {
    ...DEFAULT_CONTENT.labelsSection,
    ...saved.labelsSection,
    items: Array.isArray(
      saved.labelsSection?.items
    )
      ? saved.labelsSection.items
      : DEFAULT_CONTENT.labelsSection
          .items,
  },

  certificationsSection: {
    ...DEFAULT_CONTENT
      .certificationsSection,
    ...saved.certificationsSection,
    items: Array.isArray(
      saved.certificationsSection?.items
    )
      ? saved.certificationsSection
          .items
      : DEFAULT_CONTENT
          .certificationsSection.items,
  },

  noticeSection: {
    ...DEFAULT_CONTENT.noticeSection,
    ...saved.noticeSection,
    paragraphs: Array.isArray(
      saved.noticeSection?.paragraphs
    )
      ? saved.noticeSection.paragraphs
      : DEFAULT_CONTENT.noticeSection
          .paragraphs,
  },

  contactSection: {
    ...DEFAULT_CONTENT.contactSection,
    ...saved.contactSection,
  },
});

const SectionIntro = ({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
}) => {
  const isCentered =
    align === "center";

  return (
    <div
      className={
        isCentered
          ? "text-center"
          : "text-left"
      }
    >
      {eyebrow && (
        <p
          className={`
            text-[11px]
            uppercase
            tracking-[0.24em]
            font-semibold
            ${
              light
                ? "text-white/65"
                : "text-[#c91f26]"
            }
          `}
          style={{
            fontFamily:
              "Montserrat, sans-serif",
          }}
        >
          {eyebrow}
        </p>
      )}

      <h2
        className={`
          mt-3
          text-[34px]
          sm:text-[40px]
          lg:text-[48px]
          leading-[1.08]
          ${
            light
              ? "text-white"
              : "text-[#171513]"
          }
        `}
        style={{
          fontFamily:
            '"Cormorant Garamond", serif',
        }}
      >
        {title}
      </h2>

      <div
        className={`
          mt-5
          h-[2px]
          w-[52px]
          bg-[#c91f26]
          ${isCentered ? "mx-auto" : ""}
        `}
      />

      {description && (
        <p
          className={`
            mt-6
            text-[14px]
            sm:text-[15px]
            leading-[1.9]
            ${
              isCentered
                ? "max-w-[760px] mx-auto"
                : "max-w-[650px]"
            }
            ${
              light
                ? "text-white/70"
                : "text-[#686868]"
            }
          `}
          style={{
            fontFamily:
              "Montserrat, sans-serif",
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
};

SectionIntro.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  align: PropTypes.oneOf([
    "center",
    "left",
  ]),
  light: PropTypes.bool,
};

SectionIntro.defaultProps = {
  eyebrow: "",
  description: "",
  align: "center",
  light: false,
};

const ResourceButton = ({
  url,
  children,
  variant = "outline",
  icon: Icon = Download,
}) => {
  const disabled =
    !url || url === "#";

  const handleClick = () => {
    if (disabled) {
      return;
    }

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const buttonClass =
    variant === "solid"
      ? "bg-[#c91f26] text-white hover:bg-[#aa1a20]"
      : "border border-[#c91f26] text-[#c91f26] hover:bg-[#c91f26] hover:text-white";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        px-5
        py-3
        text-[12px]
        font-semibold
        tracking-[0.02em]
        duration-300
        ${buttonClass}
        disabled:opacity-45
        disabled:cursor-not-allowed
        disabled:hover:bg-transparent
        disabled:hover:text-[#c91f26]
      `}
      style={{
        fontFamily:
          "Montserrat, sans-serif",
      }}
    >
      <Icon
        size={15}
        strokeWidth={1.8}
      />
      {children}
    </button>
  );
};

ResourceButton.propTypes = {
  url: PropTypes.string,
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    "outline",
    "solid",
  ]),
  icon: PropTypes.elementType,
};

ResourceButton.defaultProps = {
  url: "",
  variant: "outline",
  icon: Download,
};

const SafetyFirst = () => {
  const [content, setContent] =
    useState(DEFAULT_CONTENT);

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [
    activeQuestion,
    setActiveQuestion,
  ] = useState(0);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [
    showAllSheets,
    setShowAllSheets,
  ] = useState(false);

  const fetchPage =
    useCallback(async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const response =
          await getPageBySlug(
            PAGE_SLUG
          );

        const page =
          response?.data || response;

        if (!page?.id) {
          throw new Error(
            "Silica Safety page was not found."
          );
        }

        setContent(
          mergeContent(
            page.content || {}
          )
        );
      } catch (error) {
        console.error(error);

        setErrorMessage(
          error?.message ||
            "Failed to load Silica Safety page."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  const safetyDataSheets =
    content.safetyDataSheetsSection
      .items || [];

  const initialVisibleCount =
    Number(
      content
        .safetyDataSheetsSection
        .initialVisibleCount
    ) || 6;

  const filteredSheets = useMemo(() => {
    const value = searchTerm
      .trim()
      .toLowerCase();

    if (!value) {
      return safetyDataSheets;
    }

    return safetyDataSheets.filter(
      (sheet) =>
        `${sheet.name || ""} ${
          sheet.category || ""
        } ${
          sheet.description || ""
        }`
          .toLowerCase()
          .includes(value)
    );
  }, [
    searchTerm,
    safetyDataSheets,
  ]);

  const displayedSheets =
    showAllSheets
      ? filteredSheets
      : filteredSheets.slice(
          0,
          initialVisibleCount
        );

  if (loading) {
    return (
      <main className="min-h-screen pt-[110px] bg-white">
        <div className="min-h-[520px] flex items-center justify-center">
          <div className="w-11 h-11 rounded-full border-2 border-[#c91f26]/20 border-t-[#c91f26] animate-spin" />
        </div>
      </main>
    );
  }

  if (errorMessage) {
    return (
      <main className="min-h-screen pt-[110px] bg-white">
        <div className="max-w-[900px] mx-auto px-6 py-24">
          <div className="border border-[#ead8d9] bg-[#fcf7f7] p-8">
            <AlertTriangle
              size={28}
              className="text-[#c91f26]"
            />

            <h1
              className="mt-4 text-[28px] text-[#171513]"
              style={{
                fontFamily:
                  '"Cormorant Garamond", serif',
              }}
            >
              Unable to load this page
            </h1>

            <p
              className="mt-3 text-[14px] leading-[1.8] text-[#686868]"
              style={{
                fontFamily:
                  "Montserrat, sans-serif",
              }}
            >
              {errorMessage}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-[110px] bg-white">
      {/* HEADER */}
      <section>
        <div className="max-w-[1650px] mx-auto px-6 xl:px-10">
          <h1
            className="text-[34px] md:text-[42px] font-semibold text-[#161412]"
            style={{
              fontFamily:
                "Montserrat, sans-serif",
            }}
          >
            {content.pageHeader.heading}
          </h1>

          <div className="w-[70px] h-[4px] bg-[#c91f26] mt-3 mb-5" />

          <p className="text-[13px] text-[#777]">
            <Link
              to="/"
              className="hover:text-[#161412] duration-300"
            >
              Home
            </Link>

            {" / "}

            <Link
              to={
                content.pageHeader
                  .parentBreadcrumbLink
              }
              className="hover:text-[#161412] duration-300"
            >
              {
                content.pageHeader
                  .parentBreadcrumbLabel
              }
            </Link>

            {" / "}

            <span className="text-[#161412] font-semibold">
              {
                content.pageHeader
                  .breadcrumbLabel
              }
            </span>
          </p>
        </div>
      </section>

      {/* HERO */}
      <section className="relative min-h-[650px] lg:min-h-[720px] overflow-hidden mt-10">
        <img
          src={content.hero.image}
          alt={
            content.hero.imageAlt ||
            content.hero.title
          }
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />

        <div className="relative max-w-[1500px] mx-auto px-6 xl:px-10 min-h-[650px] lg:min-h-[720px] flex items-center">
          <div className="max-w-[850px] pt-10">
            <h1
              className="
                mt-7
                text-white
                text-[46px]
                sm:text-[60px]
                lg:text-[78px]
                xl:text-[88px]
                leading-[0.98]
                max-w-[850px]
              "
              style={{
                fontFamily:
                  '"Cormorant Garamond", serif',
              }}
            >
              {content.hero.title}
            </h1>

            <p
              className="
                max-w-[760px]
                mt-7
                text-white/78
                text-[15px]
                sm:text-[17px]
                leading-[1.85]
              "
              style={{
                fontFamily:
                  "Montserrat, sans-serif",
              }}
            >
              {content.hero.description}
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <a
                href={
                  content.hero
                    .primaryButtonLink
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  bg-[#c91f26]
                  text-white
                  px-7
                  py-4
                  text-[13px]
                  font-semibold
                  hover:bg-[#aa1a20]
                  duration-300
                "
                style={{
                  fontFamily:
                    "Montserrat, sans-serif",
                }}
              >
                {
                  content.hero
                    .primaryButtonText
                }
                <ArrowRight size={16} />
              </a>

              <a
                href={
                  content.hero
                    .secondaryButtonLink
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  border
                  border-white/40
                  bg-white/5
                  backdrop-blur-sm
                  text-white
                  px-7
                  py-4
                  text-[13px]
                  font-semibold
                  hover:bg-white
                  hover:text-[#171513]
                  duration-300
                "
                style={{
                  fontFamily:
                    "Montserrat, sans-serif",
                }}
              >
                <Download size={16} />

                {
                  content.hero
                    .secondaryButtonText
                }
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT THIS PAGE */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-[780px] mx-auto px-6">
          <div className="text-center">
            <p
              className="
                text-[14px]
                sm:text-[16px]
                uppercase
                tracking-[0.18em]
                font-medium
                text-[#c91f26]
              "
              style={{
                fontFamily:
                  "Montserrat, sans-serif",
              }}
            >
              {
                content.aboutSection
                  .eyebrow
              }
            </p>

            <div className="w-[32px] h-[3px] bg-[#c91f26] mx-auto mt-4" />
          </div>

          <div className="mt-7 space-y-4">
            {content.aboutSection.paragraphs.map(
              (paragraph, index) => (
                <p
                  key={`about-${index + 1}`}
                  className="
                    text-[15px]
                    sm:text-[16px]
                    lg:text-[17px]
                    leading-[2.15]
                    text-[#595959]
                  "
                  style={{
                    fontFamily:
                      "Montserrat, sans-serif",
                  }}
                >
                  {paragraph}
                </p>
              )
            )}
          </div>
        </div>
      </section>

      {/* HAZARD AWARENESS */}
      <section
        id="hazard-awareness"
        className="py-20 lg:py-28 bg-[#f7f5f3] scroll-mt-[180px]"
      >
        <div className="max-w-[1250px] mx-auto px-6">
          <SectionIntro
            eyebrow={
              content.hazardAwareness
                .eyebrow
            }
            title={
              content.hazardAwareness
                .title
            }
            description={
              content.hazardAwareness
                .description
            }
          />

          <div className="mt-14 max-w-[1050px] mx-auto">
            {content.hazardAwareness.questions.map(
              (item, index) => {
                const isActive =
                  activeQuestion === index;

                return (
                  <article
                    key={
                      item.id ||
                      `question-${index + 1}`
                    }
                    className={`
                      border-b
                      transition-colors
                      ${
                        isActive
                          ? "border-[#c91f26] bg-white"
                          : "border-[#ddd8d4] bg-transparent"
                      }
                    `}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setActiveQuestion(
                          isActive
                            ? null
                            : index
                        )
                      }
                      aria-expanded={
                        isActive
                      }
                      className="
                        w-full
                        flex
                        items-center
                        justify-between
                        gap-6
                        px-5
                        sm:px-7
                        py-6
                        text-left
                      "
                    >
                      <div className="flex items-start gap-5">
                        <span
                          className={`
                            text-[12px]
                            font-semibold
                            pt-1
                            ${
                              isActive
                                ? "text-[#c91f26]"
                                : "text-[#9a9692]"
                            }
                          `}
                          style={{
                            fontFamily:
                              "Montserrat, sans-serif",
                          }}
                        >
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </span>

                        <span
                          className="
                            text-[20px]
                            sm:text-[24px]
                            leading-[1.25]
                            text-[#171513]
                          "
                          style={{
                            fontFamily:
                              '"Cormorant Garamond", serif',
                          }}
                        >
                          {item.question}
                        </span>
                      </div>

                      <span
                        className={`
                          w-10
                          h-10
                          shrink-0
                          rounded-full
                          flex
                          items-center
                          justify-center
                          duration-300
                          ${
                            isActive
                              ? "bg-[#c91f26] text-white rotate-180"
                              : "bg-white text-[#171513]"
                          }
                        `}
                      >
                        <ChevronDown
                          size={18}
                        />
                      </span>
                    </button>

                    <div
                      className={`
                        grid
                        transition-all
                        duration-300
                        ${
                          isActive
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }
                      `}
                    >
                      <div className="overflow-hidden">
                        <p
                          className="
                            px-5
                            sm:px-[76px]
                            pb-7
                            max-w-[920px]
                            text-[14px]
                            sm:text-[15px]
                            leading-[1.9]
                            text-[#686868]
                          "
                          style={{
                            fontFamily:
                              "Montserrat, sans-serif",
                          }}
                        >
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        </div>
      </section>

      {/* RESOURCES */}
      <section
        id="resources"
        className="py-20 lg:py-28 scroll-mt-[180px]"
      >
        <div className="max-w-[1450px] mx-auto px-6">
          <SectionIntro
            eyebrow={
              content.resourcesSection
                .eyebrow
            }
            title={
              content.resourcesSection
                .title
            }
            description={
              content.resourcesSection
                .description
            }
          />

          <div className="mt-14 grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {content.resourcesSection.items.map(
              (resource, index) => {
                const isExternal =
                  resource.type ===
                  "external";

                return (
                  <article
                    key={
                      resource.id ||
                      `resource-${index + 1}`
                    }
                    className="
                      group
                      relative
                      overflow-hidden
                      border
                      border-[#e7e3df]
                      bg-white
                      p-7
                      min-h-[325px]
                      flex
                      flex-col
                      hover:-translate-y-1
                      hover:border-[#c91f26]
                      hover:shadow-[0_22px_55px_rgba(0,0,0,0.07)]
                      duration-300
                    "
                  >
                    <span
                      className="
                        absolute
                        top-5
                        right-6
                        text-[54px]
                        leading-none
                        text-[#f1eeeb]
                        group-hover:text-[#f8e9ea]
                        duration-300
                      "
                      style={{
                        fontFamily:
                          '"Cormorant Garamond", serif',
                      }}
                    >
                      {String(
                        index + 1
                      ).padStart(2, "0")}
                    </span>

                    <div className="w-12 h-12 bg-[#f8e9ea] text-[#c91f26] flex items-center justify-center">
                      {isExternal ? (
                        <ExternalLink
                          size={21}
                          strokeWidth={
                            1.7
                          }
                        />
                      ) : (
                        <FileText
                          size={21}
                          strokeWidth={
                            1.7
                          }
                        />
                      )}
                    </div>

                    <p
                      className="
                        mt-7
                        text-[10px]
                        uppercase
                        tracking-[0.21em]
                        font-semibold
                        text-[#c91f26]
                      "
                      style={{
                        fontFamily:
                          "Montserrat, sans-serif",
                      }}
                    >
                      {
                        resource.organization
                      }
                    </p>

                    <h3
                      className="
                        mt-3
                        pr-12
                        text-[27px]
                        leading-[1.15]
                        text-[#171513]
                      "
                      style={{
                        fontFamily:
                          '"Cormorant Garamond", serif',
                      }}
                    >
                      {resource.title}
                    </h3>

                    <p
                      className="
                        mt-4
                        text-[13px]
                        leading-[1.8]
                        text-[#747474]
                        flex-1
                      "
                      style={{
                        fontFamily:
                          "Montserrat, sans-serif",
                      }}
                    >
                      {
                        resource.description
                      }
                    </p>

                    <div className="mt-7">
                      <ResourceButton
                        url={resource.url}
                        icon={
                          isExternal
                            ? ExternalLink
                            : Download
                        }
                      >
                        {
                          resource.buttonText
                        }
                      </ResourceButton>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        </div>
      </section>

      {/* SDS */}
      <section
        id="safety-data-sheets"
        className="py-20 lg:py-28 bg-[#171513] scroll-mt-[180px]"
      >
        <div className="max-w-[1450px] mx-auto px-6">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-20 items-end">
            <SectionIntro
              eyebrow={
                content
                  .safetyDataSheetsSection
                  .eyebrow
              }
              title={
                content
                  .safetyDataSheetsSection
                  .title
              }
              description={
                content
                  .safetyDataSheetsSection
                  .description
              }
              align="left"
              light
            />

            <div className="relative">
              <Search
                size={19}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-white/45"
              />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(
                    event.target.value
                  );

                  setShowAllSheets(true);
                }}
                placeholder={
                  content
                    .safetyDataSheetsSection
                    .searchPlaceholder
                }
                className="
                  w-full
                  h-[58px]
                  bg-white/8
                  border
                  border-white/18
                  text-white
                  placeholder:text-white/40
                  pl-14
                  pr-5
                  outline-none
                  focus:border-[#c91f26]
                  duration-300
                "
                style={{
                  fontFamily:
                    "Montserrat, sans-serif",
                }}
              />
            </div>
          </div>

          <div className="mt-14 grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {displayedSheets.map(
              (sheet, index) => (
                <article
                  key={
                    sheet.id ||
                    `sheet-${index + 1}`
                  }
                  className="
                    group
                    bg-white/[0.055]
                    border
                    border-white/12
                    p-6
                    min-h-[245px]
                    flex
                    flex-col
                    hover:bg-white/[0.09]
                    hover:border-[#c91f26]
                    duration-300
                  "
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-11 h-11 bg-[#c91f26] text-white flex items-center justify-center">
                      <FileText
                        size={20}
                        strokeWidth={1.7}
                      />
                    </div>

                    <span
                      className="
                        border
                        border-white/15
                        text-white/55
                        px-3
                        py-1.5
                        text-[9px]
                        uppercase
                        tracking-[0.15em]
                      "
                      style={{
                        fontFamily:
                          "Montserrat, sans-serif",
                      }}
                    >
                      {sheet.category}
                    </span>
                  </div>

                  <h3
                    className="mt-6 text-[25px] leading-[1.15] text-white"
                    style={{
                      fontFamily:
                        '"Cormorant Garamond", serif',
                    }}
                  >
                    {sheet.name}
                  </h3>

                  <p
                    className="mt-3 text-[12px] leading-[1.75] text-white/55 flex-1"
                    style={{
                      fontFamily:
                        "Montserrat, sans-serif",
                    }}
                  >
                    {sheet.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <ResourceButton
                      url={
                        sheet.englishUrl
                      }
                      variant="solid"
                      icon={Download}
                    >
                      English
                    </ResourceButton>

                    <ResourceButton
                      url={
                        sheet.spanishUrl
                      }
                      icon={Languages}
                    >
                      Español
                    </ResourceButton>
                  </div>
                </article>
              )
            )}
          </div>

          {displayedSheets.length === 0 && (
            <div className="mt-12 border border-white/15 p-10 text-center">
              <Search
                size={28}
                className="text-white/35 mx-auto"
              />

              <p
                className="mt-4 text-white/65 text-sm"
                style={{
                  fontFamily:
                    "Montserrat, sans-serif",
                }}
              >
                No Safety Data Sheets
                match your search.
              </p>
            </div>
          )}

          {!searchTerm &&
            filteredSheets.length >
              initialVisibleCount && (
              <div className="mt-10 text-center">
                <button
                  type="button"
                  onClick={() =>
                    setShowAllSheets(
                      (current) =>
                        !current
                    )
                  }
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    border
                    border-white/25
                    text-white
                    px-7
                    py-3.5
                    text-[12px]
                    font-semibold
                    hover:bg-white
                    hover:text-[#171513]
                    duration-300
                  "
                  style={{
                    fontFamily:
                      "Montserrat, sans-serif",
                  }}
                >
                  {showAllSheets
                    ? "Show Fewer Documents"
                    : `View All ${safetyDataSheets.length} Documents`}

                  <ChevronDown
                    size={16}
                    className={
                      showAllSheets
                        ? "rotate-180"
                        : ""
                    }
                  />
                </button>
              </div>
            )}
        </div>
      </section>

      {/* GUIDES */}
      <section
        id="guides"
        className="relative min-h-[620px] overflow-hidden scroll-mt-[180px]"
      >
        <img
          src={
            content.guidesSection.image
          }
          alt={
            content.guidesSection
              .imageAlt ||
            content.guidesSection.title
          }
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/65 to-black/20" />

        <div className="relative max-w-[1450px] mx-auto px-6 py-24 lg:py-32">
          <div className="max-w-[720px]">
            <div className="w-14 h-14 bg-[#c91f26] text-white flex items-center justify-center">
              <BookOpen
                size={25}
                strokeWidth={1.7}
              />
            </div>

            <SectionIntro
              eyebrow={
                content.guidesSection
                  .eyebrow
              }
              title={
                content.guidesSection
                  .title
              }
              description={
                content.guidesSection
                  .description
              }
              align="left"
              light
            />

            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <ResourceButton
                url={
                  content.guidesSection
                    .primaryPdfUrl
                }
                variant="solid"
                icon={Download}
              >
                {
                  content.guidesSection
                    .primaryButtonText
                }
              </ResourceButton>

              <ResourceButton
                url={
                  content.guidesSection
                    .secondaryPdfUrl
                }
                icon={Download}
              >
                {
                  content.guidesSection
                    .secondaryButtonText
                }
              </ResourceButton>
            </div>

            <div className="mt-10 grid sm:grid-cols-3 gap-3">
              {content.guidesSection.points.map(
                (item, index) => {
                  const text =
                    typeof item ===
                    "string"
                      ? item
                      : item.text;

                  return (
                    <div
                      key={
                        item.id ||
                        `guide-point-${index + 1}`
                      }
                      className="
                        flex
                        items-start
                        gap-3
                        border
                        border-white/15
                        bg-white/8
                        backdrop-blur-sm
                        p-4
                      "
                    >
                      <Check
                        size={17}
                        className="text-[#ee3b43] shrink-0 mt-0.5"
                      />

                      <p
                        className="text-[11px] leading-[1.6] text-white/75"
                        style={{
                          fontFamily:
                            "Montserrat, sans-serif",
                        }}
                      >
                        {text}
                      </p>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </section>

      {/* LABELS & CERTIFICATIONS */}
      <section
        id="labels"
        className="py-20 lg:py-28 bg-[#f7f5f3] scroll-mt-[180px]"
      >
        <div className="max-w-[1450px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <article className="bg-white border border-[#e6e1dd] p-7 sm:p-10">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p
                    className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[#c91f26]"
                    style={{
                      fontFamily:
                        "Montserrat, sans-serif",
                    }}
                  >
                    {
                      content.labelsSection
                        .eyebrow
                    }
                  </p>

                  <h2
                    className="mt-3 text-[36px] sm:text-[43px] leading-[1.08] text-[#171513]"
                    style={{
                      fontFamily:
                        '"Cormorant Garamond", serif',
                    }}
                  >
                    {
                      content.labelsSection
                        .title
                    }
                  </h2>
                </div>

                <div className="w-12 h-12 bg-[#f8e9ea] text-[#c91f26] flex items-center justify-center shrink-0">
                  <AlertTriangle
                    size={22}
                    strokeWidth={1.7}
                  />
                </div>
              </div>

              <p
                className="mt-6 text-[13px] leading-[1.85] text-[#707070]"
                style={{
                  fontFamily:
                    "Montserrat, sans-serif",
                }}
              >
                {
                  content.labelsSection
                    .description
                }
              </p>

              <div className="mt-8 grid sm:grid-cols-2 gap-2.5">
                {content.labelsSection.items.map(
                  (label, index) => {
                    const disabled =
                      !label.url ||
                      label.url === "#";

                    return (
                      <button
                        key={
                          label.id ||
                          `label-${index + 1}`
                        }
                        type="button"
                        disabled={disabled}
                        onClick={() => {
                          if (disabled) {
                            return;
                          }

                          window.open(
                            label.url,
                            "_blank",
                            "noopener,noreferrer"
                          );
                        }}
                        className="
                          flex
                          items-center
                          justify-between
                          gap-4
                          border
                          border-[#e6e1dd]
                          px-4
                          py-3.5
                          text-left
                          hover:border-[#c91f26]
                          hover:bg-[#fcf7f7]
                          duration-300
                          disabled:opacity-55
                          disabled:cursor-not-allowed
                        "
                      >
                        <span
                          className="text-[11px] text-[#353230]"
                          style={{
                            fontFamily:
                              "Montserrat, sans-serif",
                          }}
                        >
                          {label.name}
                        </span>

                        <Download
                          size={14}
                          className="text-[#c91f26] shrink-0"
                        />
                      </button>
                    );
                  }
                )}
              </div>
            </article>

            <article className="bg-[#171513] p-7 sm:p-10 text-white">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p
                    className="text-[10px] uppercase tracking-[0.22em] font-semibold text-white/55"
                    style={{
                      fontFamily:
                        "Montserrat, sans-serif",
                    }}
                  >
                    {
                      content
                        .certificationsSection
                        .eyebrow
                    }
                  </p>

                  <h2
                    className="mt-3 text-[36px] sm:text-[43px] leading-[1.08] text-white"
                    style={{
                      fontFamily:
                        '"Cormorant Garamond", serif',
                    }}
                  >
                    {
                      content
                        .certificationsSection
                        .title
                    }
                  </h2>
                </div>

                <div className="w-12 h-12 bg-white/10 text-[#ee3b43] flex items-center justify-center shrink-0">
                  <BadgeCheck
                    size={23}
                    strokeWidth={1.7}
                  />
                </div>
              </div>

              <p
                className="mt-6 text-[13px] leading-[1.85] text-white/62"
                style={{
                  fontFamily:
                    "Montserrat, sans-serif",
                }}
              >
                {
                  content
                    .certificationsSection
                    .description
                }
              </p>

              <div className="mt-9 grid sm:grid-cols-2 gap-4">
                {content.certificationsSection.items.map(
                  (item, index) => (
                    <div
                      key={
                        item.id ||
                        `certification-${index + 1}`
                      }
                      className="border border-white/15 bg-white/[0.055] p-6 min-h-[190px]"
                    >
                      <div className="w-11 h-11 rounded-full bg-white text-[#171513] flex items-center justify-center font-bold text-[10px] px-1 text-center">
                        {item.shortName ||
                          (
                            <ShieldCheck
                              size={21}
                            />
                          )}
                      </div>

                      <h3
                        className="mt-6 text-[25px]"
                        style={{
                          fontFamily:
                            '"Cormorant Garamond", serif',
                        }}
                      >
                        {item.title}
                      </h3>

                      <p
                        className="mt-3 text-[11px] leading-[1.7] text-white/50"
                        style={{
                          fontFamily:
                            "Montserrat, sans-serif",
                        }}
                      >
                        {
                          item.description
                        }
                      </p>
                    </div>
                  )
                )}
              </div>

              <div className="mt-6 border-t border-white/12 pt-6">
                <p
                  className="text-[11px] leading-[1.75] text-white/45"
                  style={{
                    fontFamily:
                      "Montserrat, sans-serif",
                  }}
                >
                  {
                    content
                      .certificationsSection
                      .footerText
                  }
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* NOTICE */}
      <section className="py-16 lg:py-20">
        <div className="max-w-[1250px] mx-auto px-6">
          <div className="border border-[#ead8d9] bg-[#fcf7f7] p-7 sm:p-10">
            <div className="grid lg:grid-cols-[auto_1fr] gap-6 lg:gap-8">
              <div className="w-12 h-12 bg-[#c91f26] text-white flex items-center justify-center">
                <AlertTriangle
                  size={22}
                  strokeWidth={1.8}
                />
              </div>

              <div>
                <h2
                  className="text-[25px] sm:text-[29px] text-[#171513]"
                  style={{
                    fontFamily:
                      '"Cormorant Garamond", serif',
                  }}
                >
                  {
                    content.noticeSection
                      .title
                  }
                </h2>

                <div
                  className="mt-5 space-y-4 text-[12px] sm:text-[13px] leading-[1.85] text-[#696969]"
                  style={{
                    fontFamily:
                      "Montserrat, sans-serif",
                  }}
                >
                  {content.noticeSection.paragraphs.map(
                    (paragraph, index) => (
                      <p
                        key={`notice-${index + 1}`}
                      >
                        {paragraph}
                      </p>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="bg-[#c91f26] mb-20">
        <div className="max-w-[1450px] mx-auto px-6 py-16 lg:py-20">
          <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-center">
            <div>
              <p
                className="text-[10px] uppercase tracking-[0.22em] font-semibold text-white/65"
                style={{
                  fontFamily:
                    "Montserrat, sans-serif",
                }}
              >
                {
                  content.contactSection
                    .eyebrow
                }
              </p>

              <h2
                className="mt-3 text-[38px] sm:text-[48px] leading-[1.08] text-white"
                style={{
                  fontFamily:
                    '"Cormorant Garamond", serif',
                }}
              >
                {
                  content.contactSection
                    .title
                }
              </h2>

              <p
                className="mt-5 max-w-[740px] text-[13px] sm:text-[14px] leading-[1.8] text-white/75"
                style={{
                  fontFamily:
                    "Montserrat, sans-serif",
                }}
              >
                {
                  content.contactSection
                    .description
                }
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3">
              <a
                href={`tel:${content.contactSection.phoneLink}`}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-3
                  min-w-[220px]
                  bg-white
                  text-[#171513]
                  px-6
                  py-4
                  text-[12px]
                  font-semibold
                  hover:bg-[#171513]
                  hover:text-white
                  duration-300
                "
                style={{
                  fontFamily:
                    "Montserrat, sans-serif",
                }}
              >
                <Phone size={17} />

                {
                  content.contactSection
                    .phone
                }
              </a>

              <a
                href={`mailto:${content.contactSection.email}`}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-3
                  min-w-[240px]
                  border
                  border-white/50
                  text-white
                  px-6
                  py-4
                  text-[12px]
                  font-semibold
                  hover:bg-white
                  hover:text-[#171513]
                  duration-300
                "
                style={{
                  fontFamily:
                    "Montserrat, sans-serif",
                }}
              >
                <Mail size={17} />

                {
                  content.contactSection
                    .email
                }
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SafetyFirst;

import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Check,
  ChevronDown,
  Download,
  Droplets,
  ExternalLink,
  FileText,
  HardHat,
  Languages,
  Mail,
  Phone,
  Search,
  ShieldCheck,
  Wind,
} from "lucide-react";


const HERO_IMAGE =
  "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=2400&q=90";

const GUIDE_IMAGE =
  "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=2200&q=88";

  
const SAFETY_QUESTIONS = [
  {
    id: 1,
    question: "What is crystalline silica?",
    answer:
      "Crystalline silica is a naturally occurring mineral found in materials such as sand, stone, granite, quartzite, and engineered quartz surfaces. Cutting, grinding, drilling, polishing, or otherwise mechanically altering these materials may release very small respirable silica particles into the air.",
  },
  {
    id: 2,
    question:
      "What are the risks in the fabrication and installation industry?",
    answer:
      "Workers involved in cutting, grinding, polishing, drilling, and installing stone products may be exposed to respirable crystalline silica. Exposure risks increase when dry fabrication methods are used without suitable water suppression, dust collection, ventilation, air monitoring, and respiratory protection.",
  },
  {
    id: 3,
    question: "What are the potential health implications?",
    answer:
      "Long-term or excessive exposure to respirable crystalline silica may cause serious occupational illnesses, including silicosis, chronic obstructive pulmonary disease, kidney disease, and lung cancer. Employers and workers should follow all applicable OSHA requirements and qualified safety guidance.",
  },
  {
    id: 4,
    question: "What should the final user be aware of?",
    answer:
      "Finished and installed stone surfaces do not normally present a silica inhalation risk during ordinary use. The primary risk occurs during fabrication activities that generate airborne dust, including cutting, grinding, drilling, and polishing.",
  },
  {
    id: 5,
    question: "What is Ultra Stones' commitment to safety?",
    answer:
      "Ultra Stones is committed to promoting responsible fabrication and installation practices. We provide access to Safety Data Sheets, warning labels, industry resources, and best-practice documents to help customers support safer workplaces.",
  },
];

const SAFETY_RESOURCES = [
  {
    id: 1,
    organization: "OSHA / NIOSH",
    title: "Hazard Alert",
    description:
      "Official hazard information addressing respirable crystalline silica in the stone fabrication and installation industry.",
    buttonText: "Download PDF",
    url: "#",
    type: "download",
  },
  {
    id: 2,
    organization: "OSHA",
    title: "Hazard Analysis",
    description:
      "Hazard analysis and recommended workplace controls for crystalline silica exposure.",
    buttonText: "Download PDF",
    url: "#",
    type: "download",
  },
  {
    id: 3,
    organization: "OSHA",
    title: "Respiratory Protection",
    description:
      "Official respiratory protection requirements and guidance for occupational health and safety compliance.",
    buttonText: "Download PDF",
    url: "#",
    type: "download",
  },
  {
    id: 4,
    organization: "Consultation",
    title: "On-Site Consultation Program",
    description:
      "A confidential occupational safety and health consultation program available to eligible employers.",
    buttonText: "Visit Program",
    url: "https://www.osha.gov/consultation",
    type: "external",
  },
  {
    id: 5,
    organization: "OSHA Standard",
    title: "Crystalline Silica Resources",
    description:
      "OSHA standards, compliance assistance, enforcement guidance, and educational resources.",
    buttonText: "Visit OSHA",
    url: "https://www.osha.gov/silica-crystalline",
    type: "external",
  },
  {
    id: 6,
    organization: "CDC / NIOSH",
    title: "Silica Research & Guidance",
    description:
      "Occupational health research, workplace recommendations, and silica-related safety guidance.",
    buttonText: "Visit CDC",
    url: "https://www.cdc.gov/niosh/silica/",
    type: "external",
  },
  {
    id: 7,
    organization: "OSHA Inspection",
    title: "Silica Inspection Guidance",
    description:
      "Information concerning focused inspections and workplace compliance for respirable crystalline silica.",
    buttonText: "View Guidance",
    url: "#",
    type: "external",
  },
  {
    id: 8,
    organization: "Natural Stone Institute",
    title: "Stone Industry Safety",
    description:
      "Industry-specific silica safety information, training resources, and fabrication guidance.",
    buttonText: "Visit NSI",
    url: "https://www.naturalstoneinstitute.org/",
    type: "external",
  },
  {
    id: 9,
    organization: "Certification",
    title: "Silica & Slab Safety Certificate",
    description:
      "Access industry safety training and certification information for stone professionals.",
    buttonText: "Get Certified",
    url: "#",
    type: "external",
  },
  {
    id: 10,
    organization: "California",
    title: "Cal/OSHA Silica Resources",
    description:
      "California-specific occupational safety standards, FAQs, and silica compliance resources.",
    buttonText: "Visit Cal/OSHA",
    url: "https://www.dir.ca.gov/dosh/",
    type: "external",
  },
];

const SAFETY_DATA_SHEETS = [
  {
    id: 1,
    name: "Quartz",
    category: "Engineered Surface",
    description: "Safety Data Sheet for engineered quartz surfaces.",
    englishUrl: "#",
    spanishUrl: "#",
  },
  {
    id: 2,
    name: "Quartzite",
    category: "Natural Stone",
    description: "Safety Data Sheet for natural quartzite surfaces.",
    englishUrl: "#",
    spanishUrl: "#",
  },
  {
    id: 3,
    name: "Natural Stones",
    category: "Natural Stone",
    description:
      "Safety information for granite, marble, quartzite, and other natural stones.",
    englishUrl: "#",
    spanishUrl: "#",
  },
  {
    id: 4,
    name: "Porcelain",
    category: "Porcelain",
    description: "Safety Data Sheet for porcelain tiles and slabs.",
    englishUrl: "#",
    spanishUrl: "#",
  },
  {
    id: 5,
    name: "Blue Tiger Eye",
    category: "Specialty Surface",
    description: "Safety Data Sheet for Blue Tiger Eye surfaces.",
    englishUrl: "#",
    spanishUrl: "#",
  },
  {
    id: 6,
    name: "White Gold Crystal Agate",
    category: "Specialty Surface",
    description: "Safety Data Sheet for White Gold Crystal Agate.",
    englishUrl: "#",
    spanishUrl: "#",
  },
  {
    id: 7,
    name: "Blue Agate",
    category: "Specialty Surface",
    description: "Safety Data Sheet for Blue Agate surfaces.",
    englishUrl: "#",
    spanishUrl: "#",
  },
  {
    id: 8,
    name: "Grey Agate",
    category: "Specialty Surface",
    description: "Safety Data Sheet for Grey Agate surfaces.",
    englishUrl: "#",
    spanishUrl: "#",
  },
  {
    id: 9,
    name: "White Mother of Pearl",
    category: "Specialty Surface",
    description: "Safety Data Sheet for White Mother of Pearl.",
    englishUrl: "#",
    spanishUrl: "#",
  },
  {
    id: 10,
    name: "Retro Petrified Wood Black",
    category: "Specialty Surface",
    description: "Safety information for Retro Petrified Wood Black.",
    englishUrl: "#",
    spanishUrl: "#",
  },
  {
    id: 11,
    name: "Black Mother of Pearl",
    category: "Specialty Surface",
    description: "Safety Data Sheet for Black Mother of Pearl.",
    englishUrl: "#",
    spanishUrl: "#",
  },
  {
    id: 12,
    name: "Golden Pyrite",
    category: "Specialty Surface",
    description: "Safety Data Sheet for Golden Pyrite surfaces.",
    englishUrl: "#",
    spanishUrl: "#",
  },
  {
    id: 13,
    name: "Round Petrified Wood Brown",
    category: "Specialty Surface",
    description: "Safety information for Round Petrified Wood Brown.",
    englishUrl: "#",
    spanishUrl: "#",
  },
  {
    id: 14,
    name: "White Beauty",
    category: "Specialty Surface",
    description: "Safety Data Sheet for White Beauty surfaces.",
    englishUrl: "#",
    spanishUrl: "#",
  },
  {
    id: 15,
    name: "Crystal White Quartz",
    category: "Specialty Surface",
    description: "Safety Data Sheet for Crystal White Quartz.",
    englishUrl: "#",
    spanishUrl: "#",
  },
];

const SAFETY_LABELS = [
  { id: 1, name: "Quartz", url: "#" },
  { id: 2, name: "Natural Stones", url: "#" },
  { id: 3, name: "Porcelain", url: "#" },
  { id: 4, name: "Quartzite", url: "#" },
  { id: 5, name: "Amethyst Wild", url: "#" },
  { id: 6, name: "Blue Agate", url: "#" },
  { id: 7, name: "Crystal White Quartz", url: "#" },
  { id: 8, name: "Blue Tiger Eye", url: "#" },
  { id: 9, name: "Black Mother of Pearl", url: "#" },
  { id: 10, name: "Golden Pyrite", url: "#" },
  { id: 11, name: "Grey Agate", url: "#" },
  { id: 12, name: "Retro Petrified Wood", url: "#" },
  { id: 13, name: "Rose Quartz", url: "#" },
  { id: 14, name: "White Gold Crystal Agate", url: "#" },
  { id: 15, name: "White Mother of Pearl", url: "#" },
  { id: 16, name: "White Beauty", url: "#" },
];

/* -------------------------------------------------------------------------- */
/*                              HELPER COMPONENTS                             */
/* -------------------------------------------------------------------------- */

const SectionIntro = ({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
}) => {
  const isCentered = align === "center";

  return (
    <div className={isCentered ? "text-center" : "text-left"}>
      {eyebrow && (
        <p
          className={`
            text-[11px]
            uppercase
            tracking-[0.24em]
            font-semibold
            ${light ? "text-white/65" : "text-[#c91f26]"}
          `}
          style={{ fontFamily: "Montserrat, sans-serif" }}
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
          ${light ? "text-white" : "text-[#171513]"}
        `}
        style={{ fontFamily: '"Cormorant Garamond", serif' }}
      >
        {title}
      </h2>

      <div
        className={`
          mt-5 h-[2px] w-[52px] bg-[#c91f26]
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
            ${isCentered ? "max-w-[760px] mx-auto" : "max-w-[650px]"}
            ${light ? "text-white/70" : "text-[#686868]"}
          `}
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          {description}
        </p>
      )}
    </div>
  );
};

const ResourceButton = ({
  url,
  children,
  variant = "outline",
  icon: Icon = Download,
}) => {
  const disabled = !url || url === "#";

  const handleClick = () => {
    if (disabled) return;
    window.open(url, "_blank", "noopener,noreferrer");
  };

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
        ${
          variant === "solid"
            ? "bg-[#c91f26] text-white hover:bg-[#aa1a20]"
            : "border border-[#c91f26] text-[#c91f26] hover:bg-[#c91f26] hover:text-white"
        }
        disabled:opacity-45
        disabled:cursor-not-allowed
        disabled:hover:bg-transparent
        disabled:hover:text-[#c91f26]
      `}
      style={{ fontFamily: "Montserrat, sans-serif" }}
    >
      <Icon size={15} strokeWidth={1.8} />
      {children}
    </button>
  );
};

/* -------------------------------------------------------------------------- */
/*                                 PAGE                                       */
/* -------------------------------------------------------------------------- */

const SafetyFirst = () => {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAllSheets, setShowAllSheets] = useState(false);

  const filteredSheets = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();

    if (!value) {
      return SAFETY_DATA_SHEETS;
    }

    return SAFETY_DATA_SHEETS.filter((sheet) =>
      `${sheet.name} ${sheet.category} ${sheet.description}`
        .toLowerCase()
        .includes(value)
    );
  }, [searchTerm]);

  const displayedSheets = showAllSheets
    ? filteredSheets
    : filteredSheets.slice(0, 6);

  return (
    <main className="min-h-screen pt-[110px] bg-white">
        {/* Header */}
        <section>
          <div className="max-w-[1650px] mx-auto px-6 xl:px-10">
            <h1
              className="text-[34px] md:text-[42px] font-semibold text-[#161412]"
              style={{
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Silica Safety First
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
                to="/resource-center"
                className="hover:text-[#161412] duration-300"
              >
                Resource Center
              </Link>

              {" / "}

              <span className="text-[#161412] font-semibold">
                Silica Safety
              </span>
            </p>
          </div>
        </section>

      {/* HERO */}
      <section className="relative min-h-[650px] lg:min-h-[720px] overflow-hidden mt-10">
        <img
          src={HERO_IMAGE}
          alt="Industrial workplace and fabrication safety"
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
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              Safety begins with knowledge.
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
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Access silica hazard information, official safety resources,
              Safety Data Sheets, good-practice guides, warning labels, and
              compliance information for the stone industry.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <a
                href="#resources"
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
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Explore Safety Resources
                <ArrowRight size={16} />
              </a>

              <a
                href="#safety-data-sheets"
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
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                <Download size={16} />
                View Safety Data Sheets
              </a>
            </div>
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
            eyebrow="Silica Hazard Awareness"
            title="Questions every stone professional should understand."
            description="Review essential information about crystalline silica, occupational exposure, health risks, final-user safety, and Ultra Stones' commitment."
          />

          <div className="mt-14 max-w-[1050px] mx-auto">
            {SAFETY_QUESTIONS.map((item, index) => {
              const isActive = activeQuestion === index;

              return (
                <article
                  key={item.id}
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
                      setActiveQuestion(isActive ? null : index)
                    }
                    aria-expanded={isActive}
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
                          ${isActive ? "text-[#c91f26]" : "text-[#9a9692]"}
                        `}
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        0{item.id}
                      </span>

                      <span
                        className="
                          text-[20px]
                          sm:text-[24px]
                          leading-[1.25]
                          text-[#171513]
                        "
                        style={{
                          fontFamily: '"Cormorant Garamond", serif',
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
                      <ChevronDown size={18} />
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
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
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
            eyebrow="Official Information"
            title="Safety resources and downloads."
            description="Access documents and guidance from recognized government agencies, occupational-health organizations, and stone-industry authorities."
          />

          <div className="mt-14 grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {SAFETY_RESOURCES.map((resource, index) => {
              const isExternal = resource.type === "external";

              return (
                <article
                  key={resource.id}
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
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="w-12 h-12 bg-[#f8e9ea] text-[#c91f26] flex items-center justify-center">
                    {isExternal ? (
                      <ExternalLink size={21} strokeWidth={1.7} />
                    ) : (
                      <FileText size={21} strokeWidth={1.7} />
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
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {resource.organization}
                  </p>

                  <h3
                    className="
                      mt-3
                      pr-12
                      text-[27px]
                      leading-[1.15]
                      text-[#171513]
                    "
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
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
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {resource.description}
                  </p>

                  <div className="mt-7">
                    <ResourceButton
                      url={resource.url}
                      icon={isExternal ? ExternalLink : Download}
                    >
                      {resource.buttonText}
                    </ResourceButton>
                  </div>
                </article>
              );
            })}
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
              eyebrow="Document Library"
              title="Safety Data Sheets"
              description="Search and download Safety Data Sheets for Ultra Stones product categories and specialty surfaces."
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
                  setSearchTerm(event.target.value);
                  setShowAllSheets(true);
                }}
                placeholder="Search by product or material type..."
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
                style={{ fontFamily: "Montserrat, sans-serif" }}
              />
            </div>
          </div>

          <div className="mt-14 grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {displayedSheets.map((sheet) => (
              <article
                key={sheet.id}
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
                    <FileText size={20} strokeWidth={1.7} />
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
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {sheet.category}
                  </span>
                </div>

                <h3
                  className="mt-6 text-[25px] leading-[1.15] text-white"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  {sheet.name}
                </h3>

                <p
                  className="mt-3 text-[12px] leading-[1.75] text-white/55 flex-1"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {sheet.description}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <ResourceButton
                    url={sheet.englishUrl}
                    variant="solid"
                    icon={Download}
                  >
                    English
                  </ResourceButton>

                  <ResourceButton
                    url={sheet.spanishUrl}
                    icon={Languages}
                  >
                    Español
                  </ResourceButton>
                </div>
              </article>
            ))}
          </div>

          {displayedSheets.length === 0 && (
            <div className="mt-12 border border-white/15 p-10 text-center">
              <Search size={28} className="text-white/35 mx-auto" />

              <p
                className="mt-4 text-white/65 text-sm"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                No Safety Data Sheets match your search.
              </p>
            </div>
          )}

          {!searchTerm &&
            filteredSheets.length > 6 && (
              <div className="mt-10 text-center">
                <button
                  type="button"
                  onClick={() => setShowAllSheets((current) => !current)}
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
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {showAllSheets
                    ? "Show Fewer Documents"
                    : `View All ${SAFETY_DATA_SHEETS.length} Documents`}

                  <ChevronDown
                    size={16}
                    className={showAllSheets ? "rotate-180" : ""}
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
          src={GUIDE_IMAGE}
          alt="Professional fabrication and workplace safety"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/65 to-black/20" />

        <div className="relative max-w-[1450px] mx-auto px-6 py-24 lg:py-32">
          <div className="max-w-[720px]">
            <div className="w-14 h-14 bg-[#c91f26] text-white flex items-center justify-center">
              <BookOpen size={25} strokeWidth={1.7} />
            </div>

            <SectionIntro
              eyebrow="Best Practices"
              title="Practical guidance for safer work."
              description="Download recommended fabrication and installation guidance covering dust-control methods, engineering controls, workplace procedures, and worker protection."
              align="left"
              light
            />

            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <ResourceButton url="#" variant="solid" icon={Download}>
                Good Practice Guide
              </ResourceButton>

              <button
                type="button"
                disabled
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  border
                  border-white/45
                  text-white
                  px-5
                  py-3
                  text-[12px]
                  font-semibold
                  disabled:opacity-45
                  disabled:cursor-not-allowed
                "
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                <Download size={15} />
                Installer Guide
              </button>
            </div>

            <div className="mt-10 grid sm:grid-cols-3 gap-3">
              {[
                "Dust-control procedures",
                "Recommended worker protection",
                "Installation safety guidance",
              ].map((item) => (
                <div
                  key={item}
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
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {item}
                  </p>
                </div>
              ))}
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
            {/* LABELS */}
            <article className="bg-white border border-[#e6e1dd] p-7 sm:p-10">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p
                    className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[#c91f26]"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Product Documentation
                  </p>

                  <h2
                    className="mt-3 text-[36px] sm:text-[43px] leading-[1.08] text-[#171513]"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    Safety Labels
                  </h2>
                </div>

                <div className="w-12 h-12 bg-[#f8e9ea] text-[#c91f26] flex items-center justify-center shrink-0">
                  <AlertTriangle size={22} strokeWidth={1.7} />
                </div>
              </div>

              <p
                className="mt-6 text-[13px] leading-[1.85] text-[#707070]"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Download product-specific warning labels communicating the
                presence of crystalline silica and important workplace
                precautions.
              </p>

              <div className="mt-8 grid sm:grid-cols-2 gap-2.5">
                {SAFETY_LABELS.map((label) => (
                  <button
                    key={label.id}
                    type="button"
                    disabled={!label.url || label.url === "#"}
                    onClick={() => {
                      if (!label.url || label.url === "#") return;

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
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {label.name}
                    </span>

                    <Download
                      size={14}
                      className="text-[#c91f26] shrink-0"
                    />
                  </button>
                ))}
              </div>
            </article>

            {/* CERTIFICATIONS */}
            <article className="bg-[#171513] p-7 sm:p-10 text-white">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p
                    className="text-[10px] uppercase tracking-[0.22em] font-semibold text-white/55"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Product Standards
                  </p>

                  <h2
                    className="mt-3 text-[36px] sm:text-[43px] leading-[1.08] text-white"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    Certifications
                  </h2>
                </div>

                <div className="w-12 h-12 bg-white/10 text-[#ee3b43] flex items-center justify-center shrink-0">
                  <BadgeCheck size={23} strokeWidth={1.7} />
                </div>
              </div>

              <p
                className="mt-6 text-[13px] leading-[1.85] text-white/62"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Selected products may carry recognized certifications related
                to indoor air quality, material performance, and food-contact
                applications. Certification availability can vary by product.
              </p>

              <div className="mt-9 grid sm:grid-cols-2 gap-4">
                <div className="border border-white/15 bg-white/[0.055] p-6 min-h-[190px]">
                  <div className="w-11 h-11 rounded-full bg-white text-[#171513] flex items-center justify-center font-bold text-[12px]">
                    NSF
                  </div>

                  <h3
                    className="mt-6 text-[25px]"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    NSF Certification
                  </h3>

                  <p
                    className="mt-3 text-[11px] leading-[1.7] text-white/50"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Certification may apply to selected surfaces intended for
                    suitable food-zone applications.
                  </p>
                </div>

                <div className="border border-white/15 bg-white/[0.055] p-6 min-h-[190px]">
                  <div className="w-11 h-11 rounded-full bg-white text-[#171513] flex items-center justify-center">
                    <ShieldCheck size={21} />
                  </div>

                  <h3
                    className="mt-6 text-[25px]"
                    style={{ fontFamily: '"Cormorant Garamond", serif' }}
                  >
                    GREENGUARD
                  </h3>

                  <p
                    className="mt-3 text-[11px] leading-[1.7] text-white/50"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Selected materials may meet recognized standards for low
                    chemical emissions and indoor environments.
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-white/12 pt-6">
                <p
                  className="text-[11px] leading-[1.75] text-white/45"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Contact Ultra Stones to confirm certification availability
                  for a specific product.
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
                <AlertTriangle size={22} strokeWidth={1.8} />
              </div>

              <div>
                <h2
                  className="text-[25px] sm:text-[29px] text-[#171513]"
                  style={{ fontFamily: '"Cormorant Garamond", serif' }}
                >
                  Safety & Compliance Notice
                </h2>

                <div
                  className="mt-5 space-y-4 text-[12px] sm:text-[13px] leading-[1.85] text-[#696969]"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  <p>
                    Information and recommendations provided by Ultra Stones
                    regarding occupational health and safety are intended for
                    general guidance only and should not replace compliance
                    with applicable local, state, or federal requirements.
                  </p>

                  <p>
                    Safety requirements may vary according to workplace
                    conditions, materials, equipment, and fabrication
                    processes. Employers remain responsible for evaluating
                    hazards and maintaining a compliant workplace.
                  </p>

                  <p>
                    Ultra Stones recommends consulting qualified occupational
                    health and safety professionals when assessing workplace
                    conditions and implementing protective measures.
                  </p>
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
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Need Additional Information?
              </p>

              <h2
                className="mt-3 text-[38px] sm:text-[48px] leading-[1.08] text-white"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                Speak with the Ultra Stones team.
              </h2>

              <p
                className="mt-5 max-w-[740px] text-[13px] sm:text-[14px] leading-[1.8] text-white/75"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Contact us for available Safety Data Sheets, product
                documentation, warning labels, certification information, and
                other technical resources.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3">
              <a
                href="tel:+16318734747"
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
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                <Phone size={17} />
                631-873-4747
              </a>

              <a
                href="mailto:info@ultrastones.com"
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
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                <Mail size={17} />
                info@ultrastones.com
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SafetyFirst;
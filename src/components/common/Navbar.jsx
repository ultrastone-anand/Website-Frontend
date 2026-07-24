import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronDown, Menu, X } from "lucide-react";

import GlobalSearch from "./GlobalSearch";
import { getOptimizedImageUrl } from "../../utils/Mediahelper";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [scrolled, setScrolled] = useState(false);

  const dropdownTimeout = useRef(null);

  const isLightNavbar = !isHomePage && !scrolled;
  const isBlackNavbar = scrolled;

  /*
   * Navbar background on scroll
   */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /*
   * Fetch material categories
   */
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/stones`
        );

        const result = response.data;

        if (result.success) {
          setMaterials(
            result.data.filter((item) => item.is_active === true)
          );
        }
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
    };

    fetchMaterials();
  }, []);

  /*
   * Close menus after route changes
   */
  useEffect(() => {
    setMobileMenu(false);
    setMobileDropdown(null);
    setActiveDropdown(null);
  }, [location.pathname]);

  /*
   * Prevent page scrolling while mobile menu is open
   */
  useEffect(() => {
    if (!mobileMenu) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenu]);

  /*
   * Clear desktop dropdown timeout
   */
  useEffect(() => {
    return () => {
      clearTimeout(dropdownTimeout.current);
    };
  }, []);

  const openDropdown = (menu) => {
    clearTimeout(dropdownTimeout.current);
    setActiveDropdown(menu);
  };

  const closeDropdown = () => {
    dropdownTimeout.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 120);
  };

  const closeMobileMenu = () => {
    setMobileMenu(false);
    setMobileDropdown(null);
  };

  const experience = [
    {
      label: "About Us",
      path: "/aboutus",
    },
    {
      label: "Our Process",
      path: "/ourprocess",
    },
  ];

  const resources = [
    {
      label: "Merchandising Displays",
      path: "/merchandising-displays",
    },
    {
      label: "Portfolio",
      path: "/gallery",
    },
        {
      label: "Silica Safety First",
      path: "/safety-first",
    },
    {
      label: "Our Blogs",
      path: "/blogs",
    },
    {
      label: "Career",
      path: "/career",
    },
  ];

  const locations = [
    {
      label: "New York",
      path: "/locations/new-york",
    },
    {
      label: "Philadelphia",
      path: "/locations/philadelphia",
    },
  ];

  return (
    <header
      className={`
        fixed left-0 top-0 z-50 w-full pt-1
        transition-all duration-500
        ${
          isBlackNavbar
            ? "bg-black/65 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-md"
            : isLightNavbar
              ? "bg-white"
              : "bg-transparent"
        }
      `}
    >
      <div className="mx-auto max-w-[1850px] px-4 sm:px-6 xl:px-8 2xl:px-10">
        <div className="flex h-[88px] items-center justify-between gap-4 2xl:gap-8">
          {/* Logo */}

          <button
            type="button"
            aria-label="Go to Ultra Stones home page"
            className="shrink-0"
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });

              navigate("/");
            }}
          >
            <div
              className="
                relative h-[54px] w-[180px]
                sm:h-[58px] sm:w-[195px]
                2xl:h-[64px] 2xl:w-[220px]
              "
            >
              <img
                src="/logo_white.svg"
                alt="Ultra Stones"
                className={`
                  absolute inset-0 h-full w-auto object-contain
                  transition-all duration-500 ease-in-out
                  ${isLightNavbar ? "opacity-0" : "opacity-100"}
                `}
              />

              <img
                src="/logo1.svg"
                alt="Ultra Stones"
                className={`
                  absolute inset-0 h-full w-auto object-contain
                  transition-all duration-500 ease-in-out
                  ${isLightNavbar ? "opacity-100" : "opacity-0"}
                `}
              />
            </div>
          </button>

          {/* Desktop Navigation */}

          <nav
            className="
              hidden min-w-0 flex-1 items-center justify-end
              gap-3 xl:flex
              min-[1360px]:gap-4
              2xl:gap-8
            "
          >
            <Dropdown
              title="Ultra Experience"
              items={experience}
              activeDropdown={activeDropdown}
              dropdownKey="experience"
              openDropdown={openDropdown}
              closeDropdown={closeDropdown}
              navigate={navigate}
              isLightNavbar={isLightNavbar}
            />

            <NavLink
              title="Online Inventory"
              onClick={() => {
                window.open(
                  "https://ultrastones.stoneprofitsweb.com/",
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
              isLightNavbar={isLightNavbar}
            />

            <MegaMenu
              title="Material Portfolio"
              path="/categories"
              materials={materials}
              activeDropdown={activeDropdown}
              dropdownKey="materials"
              openDropdown={openDropdown}
              closeDropdown={closeDropdown}
              navigate={navigate}
              isLightNavbar={isLightNavbar}
            />

            <Dropdown
              title="Resource Center"
              items={resources}
              activeDropdown={activeDropdown}
              dropdownKey="resources"
              openDropdown={openDropdown}
              closeDropdown={closeDropdown}
              navigate={navigate}
              isLightNavbar={isLightNavbar}
            />

            <Dropdown
              title="Locations"
              items={locations}
              activeDropdown={activeDropdown}
              dropdownKey="locations"
              openDropdown={openDropdown}
              closeDropdown={closeDropdown}
              navigate={navigate}
              isLightNavbar={isLightNavbar}
            />

            <NavLink
              title="Contact"
              onClick={() => navigate("/contact")}
              isLightNavbar={isLightNavbar}
            />

            {/* Desktop Search — visible on 13-inch MacBook */}

            <div
              className="
                hidden w-[150px] shrink-0 xl:block
                min-[1360px]:w-[180px]
                min-[1500px]:w-[220px]
                2xl:w-[260px]
              "
            >
              <GlobalSearch
                materials={materials}
                isLightNavbar={isLightNavbar}
              />
            </div>
          </nav>

          {/* Mobile Menu Toggle */}

          <button
            type="button"
            aria-label={
              mobileMenu
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={mobileMenu}
            className={`
              z-[60] flex h-11 w-11 shrink-0
              items-center justify-center rounded-full
              transition-all duration-300 xl:hidden
              ${
                isLightNavbar && !mobileMenu
                  ? "text-black hover:bg-black/5"
                  : "text-white hover:bg-white/10"
              }
            `}
            onClick={() => {
              setMobileMenu((current) => !current);
              setMobileDropdown(null);
            }}
          >
            {mobileMenu ? (
              <X size={25} strokeWidth={1.5} />
            ) : (
              <Menu size={25} strokeWidth={1.5} />
            )}
          </button>

          {/* Mobile Side Navigation */}

          <div
            className={`
              fixed left-0 top-[88px] z-50
              h-[calc(100dvh-88px)] w-full
              overflow-y-auto overscroll-contain
              bg-[#050B18] text-white
              transition-all duration-500 xl:hidden
              ${
                mobileMenu
                  ? "pointer-events-auto translate-x-0 opacity-100"
                  : "pointer-events-none translate-x-full opacity-0"
              }
            `}
          >
            <div
              className="
                px-[clamp(20px,5vw,40px)]
                py-[clamp(24px,5vw,40px)]
              "
            >
              {/* Mobile Search */}

              <div className="mb-[clamp(24px,5vw,40px)]">
                <GlobalSearch
                  materials={materials}
                  mobile
                  onResultClick={closeMobileMenu}
                />
              </div>

              <MobileDropdown
                title="Ultra Experience"
                dropdownKey="experience"
                activeDropdown={mobileDropdown}
                setActiveDropdown={setMobileDropdown}
                items={experience}
                navigate={navigate}
                closeMobileMenu={closeMobileMenu}
              />

              <MobileNavButton
                title="Online Inventory"
                onClick={() => {
                  window.open(
                    "https://ultrastones.stoneprofitsweb.com/",
                    "_blank",
                    "noopener,noreferrer"
                  );

                  closeMobileMenu();
                }}
              />

              {/* Mobile Material Portfolio */}

              <div className="border-b border-white/10">
                <div className="flex w-full items-stretch">
                  <button
                    type="button"
                    onClick={() => {
                      navigate("/categories");
                      closeMobileMenu();
                    }}
                    className="
                      flex flex-1 items-center
                      py-[clamp(16px,4vw,22px)]
                      text-left
                      text-[clamp(12px,2.8vw,14px)]
                      font-medium uppercase
                      leading-[1.4]
                      tracking-[clamp(1.4px,0.4vw,2px)]
                      text-white
                      transition-colors duration-300
                      hover:text-white/75
                    "
                  >
                    Material Portfolio
                  </button>

                  <button
                    type="button"
                    aria-label="Toggle Material Portfolio menu"
                    aria-expanded={mobileDropdown === "materials"}
                    onClick={() => {
                      setMobileDropdown((current) =>
                        current === "materials" ? null : "materials"
                      );
                    }}
                    className="
                      flex w-[clamp(38px,10vw,48px)]
                      shrink-0 items-center justify-end
                      py-[clamp(16px,4vw,22px)]
                      text-white
                    "
                  >
                    <ChevronDown
                      size={18}
                      className={`
                        shrink-0 transition-transform duration-300
                        ${
                          mobileDropdown === "materials"
                            ? "rotate-180"
                            : ""
                        }
                      `}
                    />
                  </button>
                </div>

                <div
                  className={`
                    grid transition-all duration-300
                    ${
                      mobileDropdown === "materials"
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }
                  `}
                >
                  <div className="overflow-hidden">
                    <div
                      className="
                        space-y-[clamp(14px,3vw,20px)]
                        pb-[clamp(18px,4vw,24px)]
                        pl-[clamp(8px,2vw,16px)]
                      "
                    >
                      {materials
                        .filter(
                          (item) =>
                            item.parent_id === null && item.is_active
                        )
                        .sort((a, b) => {
                          const orderA = a.display_order ?? 999;
                          const orderB = b.display_order ?? 999;

                          return orderA - orderB;
                        })
                        .map((item) => (
                          <button
                            type="button"
                            key={item.id}
                            onClick={() => {
                              navigate(
                                `/product-category/${item.slug}`
                              );

                              closeMobileMenu();
                            }}
                            className="
                              block w-full text-left
                              text-[clamp(14px,3.4vw,16px)]
                              leading-[1.45] text-white/70
                              transition-colors duration-300
                              hover:text-white
                            "
                          >
                            {item.name}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              <MobileDropdown
                title="Resource Center"
                dropdownKey="resources"
                activeDropdown={mobileDropdown}
                setActiveDropdown={setMobileDropdown}
                items={resources}
                navigate={navigate}
                closeMobileMenu={closeMobileMenu}
              />

              <MobileDropdown
                title="Locations"
                dropdownKey="locations"
                activeDropdown={mobileDropdown}
                setActiveDropdown={setMobileDropdown}
                items={locations}
                navigate={navigate}
                closeMobileMenu={closeMobileMenu}
              />

              <MobileNavButton
                title="Contact"
                onClick={() => {
                  navigate("/contact");
                  closeMobileMenu();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

/*
 * Desktop standard navigation link
 */
const NavLink = ({ title, onClick, isLightNavbar }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        relative shrink-0 whitespace-nowrap
        text-[10px] uppercase tracking-[0.8px]
        transition-colors duration-300
        min-[1500px]:text-[11px]
        min-[1500px]:tracking-[1px]
        ${
          isLightNavbar
            ? "text-[#444] hover:text-black"
            : "text-white/85 hover:text-white"
        }
      `}
    >
      {title}
    </button>
  );
};

/*
 * Mobile standard navigation button
 */
const MobileNavButton = ({ title, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full border-b border-white/10
        py-[clamp(16px,4vw,22px)]
        text-left
        text-[clamp(12px,2.8vw,14px)]
        font-medium uppercase
        leading-[1.4]
        tracking-[clamp(1.4px,0.4vw,2px)]
        text-white
        transition-colors duration-300
        hover:text-white/75
      "
    >
      {title}
    </button>
  );
};

/*
 * Mobile expandable dropdown
 */
const MobileDropdown = ({
  title,
  dropdownKey,
  activeDropdown,
  setActiveDropdown,
  items,
  navigate,
  closeMobileMenu,
}) => {
  const isOpen = activeDropdown === dropdownKey;

  return (
    <div className="border-b border-white/10">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => {
          setActiveDropdown(isOpen ? null : dropdownKey);
        }}
        className="
          flex w-full items-center justify-between gap-4
          py-[clamp(16px,4vw,22px)]
          text-left
          text-[clamp(12px,2.8vw,14px)]
          font-medium uppercase
          leading-[1.4]
          tracking-[clamp(1.4px,0.4vw,2px)]
          text-white
        "
      >
        <span>{title}</span>

        <ChevronDown
          size={18}
          className={`
            shrink-0 transition-transform duration-300
            ${isOpen ? "rotate-180" : ""}
          `}
        />
      </button>

      <div
        className={`
          grid transition-all duration-300
          ${
            isOpen
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }
        `}
      >
        <div className="overflow-hidden">
          <div
            className="
              space-y-[clamp(14px,3vw,20px)]
              pb-[clamp(18px,4vw,24px)]
              pl-[clamp(8px,2vw,16px)]
            "
          >
            {items.map((item) => (
              <button
                type="button"
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  closeMobileMenu();
                }}
                className="
                  block w-full text-left
                  text-[clamp(14px,3.4vw,16px)]
                  leading-[1.45] text-white/70
                  transition-colors duration-300
                  hover:text-white
                "
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/*
 * Desktop standard dropdown
 */
const Dropdown = ({
  title,
  items,
  activeDropdown,
  dropdownKey,
  openDropdown,
  closeDropdown,
  navigate,
  isLightNavbar,
}) => {
  const isActive = activeDropdown === dropdownKey;

  return (
    <div
      className="relative shrink-0"
      onMouseEnter={() => openDropdown(dropdownKey)}
      onMouseLeave={closeDropdown}
    >
      <button
        type="button"
        className={`
          flex items-center whitespace-nowrap
          text-[10px] uppercase tracking-[0.8px]
          transition-colors duration-300
          min-[1500px]:text-[11px]
          min-[1500px]:tracking-[1px]
          ${
            isLightNavbar
              ? "text-[#444] hover:text-black"
              : "text-white/85 hover:text-white"
          }
        `}
      >
        {title}
      </button>

      <div
        className={`
          absolute left-0 top-[45px] z-50
          w-[280px] rounded-2xl
          border border-black/5 bg-white p-5
          shadow-[0_20px_60px_rgba(0,0,0,0.12)]
          transition-all duration-300
          ${
            isActive
              ? "visible translate-y-0 opacity-100"
              : "invisible translate-y-3 opacity-0"
          }
        `}
      >
        <div className="space-y-2">
          {items.map((item) => (
            <button
              type="button"
              key={item.path}
              onClick={() => {
                if (item.path) {
                  navigate(item.path);
                }
              }}
              className="
                group flex w-full items-center justify-between
                rounded-xl p-3 text-left
                transition-colors duration-300
                hover:bg-[#f7f7f7]
              "
            >
              <span
                className="
                  text-[14px] text-[#666]
                  transition-colors duration-300
                  group-hover:text-black
                "
              >
                {item.label}
              </span>

              <span
                className="
                  -translate-x-2 text-black opacity-0
                  transition-all duration-300
                  group-hover:translate-x-0
                  group-hover:opacity-100
                "
              >
                →
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/*
 * Desktop Material Portfolio mega menu
 */
const MegaMenu = ({
  title,
  path,
  materials,
  activeDropdown,
  dropdownKey,
  openDropdown,
  closeDropdown,
  navigate,
  isLightNavbar,
}) => {
  const isActive = activeDropdown === dropdownKey;
  const [hoveredParent, setHoveredParent] = useState(null);

  const parentCategories = useMemo(() => {
    return materials
      .filter((item) => item.parent_id === null && item.is_active)
      .sort((a, b) => {
        const orderA = a.display_order ?? 999;
        const orderB = b.display_order ?? 999;

        return orderA - orderB;
      });
  }, [materials]);

  useEffect(() => {
    if (parentCategories.length === 0) {
      setHoveredParent(null);
      return;
    }

    const selectedParentStillExists = parentCategories.some(
      (parent) => parent.id === hoveredParent
    );

    if (!selectedParentStillExists) {
      setHoveredParent(parentCategories[0].id);
    }
  }, [parentCategories, hoveredParent]);

  const activeParent = parentCategories.find(
    (parent) => parent.id === hoveredParent
  );

  const children = useMemo(() => {
    return materials
      .filter(
        (item) =>
          item.parent_id === hoveredParent && item.is_active
      )
      .sort((a, b) => {
        const orderA = a.display_order ?? 999;
        const orderB = b.display_order ?? 999;

        return orderA - orderB;
      });
  }, [materials, hoveredParent]);

  const getThumbnailUrl = (url, width = 220, quality = 68) => {
    return getOptimizedImageUrl(
      url || "/placeholder.jpg",
      width,
      quality
    );
  };

  return (
    <div
      className="relative shrink-0"
      onMouseEnter={() => openDropdown(dropdownKey)}
      onMouseLeave={closeDropdown}
    >
      <button
        type="button"
        onClick={() => {
          if (path) {
            navigate(path);
          }
        }}
        className={`
          flex items-center whitespace-nowrap
          text-[10px] uppercase tracking-[0.8px]
          transition-colors duration-300
          min-[1500px]:text-[11px]
          min-[1500px]:tracking-[1px]
          ${
            isLightNavbar
              ? "text-[#444] hover:text-black"
              : "text-white/85 hover:text-white"
          }
        `}
      >
        {title}
      </button>

      <div
        className={`
          absolute left-[-250px] top-[48px] z-50
          w-[min(980px,calc(100vw-64px))]
          rounded-2xl border border-black/5
          bg-white p-8
          shadow-[0_25px_80px_rgba(0,0,0,0.12)]
          transition-all duration-300
          ${
            isActive
              ? "visible translate-y-0 opacity-100"
              : "invisible translate-y-4 opacity-0"
          }
        `}
      >
        <div className="grid h-[600px] grid-cols-[320px_1fr] gap-8">
          {/* Parent Categories */}

          <div
            className="
              scrollbar-thin h-full overflow-y-auto
              border-r border-black/10 pr-5
            "
          >
            <div className="space-y-2">
              {parentCategories.map((parent) => {
                const thumbnailUrl = getThumbnailUrl(
                  parent.thumbnail_url,
                  240,
                  65
                );

                return (
                  <button
                    type="button"
                    key={parent.id}
                    onMouseEnter={() => {
                      setHoveredParent(parent.id);
                    }}
                    onFocus={() => {
                      setHoveredParent(parent.id);
                    }}
                    onClick={() => {
                      navigate(`/product-category/${parent.slug}`);
                    }}
                    className={`
                      flex w-full items-center gap-3
                      rounded-xl p-3
                      transition-all duration-300
                      ${
                        hoveredParent === parent.id
                          ? "bg-[#f5f5f5] shadow-sm"
                          : "hover:bg-[#fafafa]"
                      }
                    `}
                  >
                    <div
                      className="
                        h-12 w-24 min-w-[96px] shrink-0
                        overflow-hidden rounded-lg bg-black/5
                      "
                    >
                      <img
                        src={thumbnailUrl}
                        srcSet={`
                          ${getThumbnailUrl(
                            parent.thumbnail_url,
                            160,
                            62
                          )} 160w,
                          ${getThumbnailUrl(
                            parent.thumbnail_url,
                            240,
                            65
                          )} 240w
                        `}
                        sizes="96px"
                        alt={parent.name}
                        loading="lazy"
                        decoding="async"
                        fetchPriority="low"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <span
                      className={`
                        text-left text-[14px]
                        ${
                          hoveredParent === parent.id
                            ? "font-semibold text-black"
                            : "text-[#666]"
                        }
                      `}
                    >
                      {parent.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Category */}

          <div className="min-w-0">
            {activeParent && (
              <>
                <div className="overflow-hidden rounded-2xl bg-black/5">
                  <img
                    key={activeParent.id}
                    src={getThumbnailUrl(
                      activeParent.thumbnail_url,
                      900,
                      72
                    )}
                    srcSet={`
                      ${getThumbnailUrl(
                        activeParent.thumbnail_url,
                        640,
                        68
                      )} 640w,
                      ${getThumbnailUrl(
                        activeParent.thumbnail_url,
                        900,
                        72
                      )} 900w,
                      ${getThumbnailUrl(
                        activeParent.thumbnail_url,
                        1200,
                        74
                      )} 1200w
                    `}
                    sizes="600px"
                    alt={activeParent.name}
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    className="
                      h-[280px] w-full object-cover
                      transition-transform duration-500
                      hover:scale-105
                    "
                  />
                </div>

                <h3 className="mt-5 text-[22px] font-semibold text-black">
                  {activeParent.name}
                </h3>

                <p className="mt-2 text-[14px] leading-relaxed text-black/60">
                  {activeParent.description ||
                    "Explore our premium collection."}
                </p>

                <button
                  type="button"
                  onClick={() => {
                    navigate(
                      `/product-category/${activeParent.slug}`
                    );
                  }}
                  className="
                    mt-5 text-[14px] font-medium
                    text-black hover:underline
                  "
                >
                  View All →
                </button>

                {children.length > 0 && (
                  <div className="mt-8 border-t border-black/10 pt-7">
                    <h3
                      className="
                        mb-4 text-sm font-semibold uppercase
                        tracking-wider text-black
                      "
                    >
                      Collections
                    </h3>

                    <div className="grid grid-cols-3 gap-3">
                      {children.map((child) => (
                        <button
                          type="button"
                          key={child.id}
                          onClick={() => {
                            navigate(
                              `/product-category/${child.slug}`
                            );
                          }}
                          className="
                            rounded-xl bg-black/[0.03] p-4
                            text-left text-black/65
                            transition-all duration-300
                            hover:bg-black/[0.07]
                            hover:text-black
                          "
                        >
                          {child.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
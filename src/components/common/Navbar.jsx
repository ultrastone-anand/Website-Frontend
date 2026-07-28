import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  ChevronDown,
  Menu,
  Search,
  X,
} from "lucide-react";

import axios from "axios";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import GlobalSearch from "./GlobalSearch";

import {
  getOptimizedImageUrl,
} from "../../utils/Mediahelper";

const INVENTORY_URL =
  "https://ultrastones.stoneprofitsweb.com/";

const DESKTOP_BREAKPOINT = 1180;

const alphabeticalSort = (a, b) =>
  String(a.name || "").localeCompare(
    String(b.name || ""),
    undefined,
    {
      sensitivity: "base",
      numeric: true,
    }
  );

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const [mobileDropdown, setMobileDropdown] =
    useState(null);

  const [activeDropdown, setActiveDropdown] =
    useState(null);

  const [materials, setMaterials] = useState([]);
  const [scrolled, setScrolled] = useState(false);

  const [desktopSearchOpen, setDesktopSearchOpen] =
    useState(false);

  const dropdownTimeout = useRef(null);

  const isLightNavbar =
    !isHomePage &&
    !scrolled &&
    !mobileMenu &&
    !desktopSearchOpen;

  /*
   * Detect page scroll
   */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      }
    );

    handleScroll();

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
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
            result.data.filter(
              (item) => item.is_active === true
            )
          );
        }
      } catch (error) {
        console.error(
          "Error fetching materials:",
          error
        );
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
    setDesktopSearchOpen(false);
  }, [location.pathname]);

  /*
   * Close desktop UI when viewport changes to mobile/tablet
   */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < DESKTOP_BREAKPOINT) {
        setDesktopSearchOpen(false);
        setActiveDropdown(null);
      } else {
        setMobileMenu(false);
        setMobileDropdown(null);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  /*
   * Prevent body scrolling while overlays are open
   */
  useEffect(() => {
    if (!mobileMenu && !desktopSearchOpen) {
      return undefined;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow =
        previousOverflow;
    };
  }, [mobileMenu, desktopSearchOpen]);

  /*
   * Close menus with Escape
   */
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== "Escape") {
        return;
      }

      setMobileMenu(false);
      setMobileDropdown(null);
      setActiveDropdown(null);
      setDesktopSearchOpen(false);
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, []);

  /*
   * Clear dropdown timeout
   */
  useEffect(() => {
    return () => {
      clearTimeout(dropdownTimeout.current);
    };
  }, []);

  const openDropdown = (menu) => {
    clearTimeout(dropdownTimeout.current);

    setDesktopSearchOpen(false);
    setActiveDropdown(menu);
  };

  const closeDropdown = () => {
    dropdownTimeout.current =
      window.setTimeout(() => {
        setActiveDropdown(null);
      }, 180);
  };

  const closeMobileMenu = () => {
    setMobileMenu(false);
    setMobileDropdown(null);
  };

  const handleNavigate = (path) => {
    setActiveDropdown(null);
    setDesktopSearchOpen(false);
    setMobileMenu(false);
    setMobileDropdown(null);

    navigate(path);
  };

  const openInventory = () => {
    window.open(
      INVENTORY_URL,
      "_blank",
      "noopener,noreferrer"
    );

    setActiveDropdown(null);
    setDesktopSearchOpen(false);
    closeMobileMenu();
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

  const mobileParentMaterials = useMemo(() => {
    return materials
      .filter(
        (item) =>
          item.parent_id === null &&
          item.is_active
      )
      .sort(alphabeticalSort);
  }, [materials]);

  return (
    <>
      <header
        className="
          pointer-events-none
          fixed inset-x-0 top-0
          z-[100] w-full
        "
      >
        <div
          className="
            relative mx-auto
            h-[112px]
            w-full
            max-w-[2200px]
            px-4
            sm:h-[124px]
            sm:px-6
            lg:px-7
            min-[1180px]:h-[128px]
            min-[1440px]:px-8
            min-[1700px]:px-12
          "
        >
          {/* Logo */}

          <button
            type="button"
            aria-label="Go to Ultra Stones home page"
            className={`
              pointer-events-auto
              absolute
              left-4 top-[22px]
              z-[110]
              transition-all duration-500
              sm:left-6 sm:top-[24px]
              lg:left-7
              min-[1440px]:left-8
              min-[1700px]:left-12
              ${
                scrolled
                  ? `
                    pointer-events-none
                    invisible
                    -translate-y-3
                    opacity-0
                  `
                  : `
                    visible
                    translate-y-0
                    opacity-100
                  `
              }
            `}
            onClick={() => {
              if (location.pathname === "/") {
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });

                return;
              }

              handleNavigate("/");
            }}
          >
            <div
              className="
                relative
                h-[46px] w-[150px]
                sm:h-[52px] sm:w-[174px]
                min-[1180px]:h-[48px]
                min-[1180px]:w-[150px]
                min-[1360px]:h-[52px]
                min-[1360px]:w-[170px]
                min-[1600px]:h-[58px]
                min-[1600px]:w-[195px]
                min-[1900px]:h-[62px]
                min-[1900px]:w-[210px]
              "
            >
              <img
                src="/logo_white.svg"
                alt="Ultra Stones"
                className={`
                  absolute inset-0
                  h-full w-auto
                  object-contain
                  transition-opacity duration-500
                  ${
                    isLightNavbar
                      ? "opacity-0"
                      : "opacity-100"
                  }
                `}
              />

              <img
                src="/logo1.svg"
                alt="Ultra Stones"
                className={`
                  absolute inset-0
                  h-full w-auto
                  object-contain
                  transition-opacity duration-500
                  ${
                    isLightNavbar
                      ? "opacity-100"
                      : "opacity-0"
                  }
                `}
              />
            </div>
          </button>

          {/* Desktop navigation */}

          <nav
            aria-label="Primary navigation"
            className={`
              pointer-events-auto
              absolute left-1/2 top-[24px]
              z-[105]
              hidden
              -translate-x-1/2
              items-center
              whitespace-nowrap
              rounded-full
              p-[5px]
              backdrop-blur-2xl
              transition-all duration-500
              min-[1180px]:flex
              min-[1360px]:p-[6px]
              min-[1600px]:top-[27px]
              min-[1600px]:p-[7px]
              ${
                scrolled
                  ? `
                    bg-black/80
                    shadow-[0_18px_55px_rgba(0,0,0,0.30)]
                    ring-1 ring-white/10
                  `
                  : `
                    bg-black/80
                    shadow-[0_16px_50px_rgba(0,0,0,0.24)]
                    ring-1 ring-white/[0.08]
                  `
              }
            `}
          >
            <Dropdown
              title="Ultra Experience"
              items={experience}
              activeDropdown={activeDropdown}
              dropdownKey="experience"
              openDropdown={openDropdown}
              closeDropdown={closeDropdown}
              navigate={handleNavigate}
            />

            <NavLink
              title="Online Inventory"
              onClick={openInventory}
            />

            <MegaMenu
              title="Material Portfolio"
              path="/categories"
              materials={materials}
              activeDropdown={activeDropdown}
              dropdownKey="materials"
              openDropdown={openDropdown}
              closeDropdown={closeDropdown}
              navigate={handleNavigate}
            />

            <Dropdown
              title="Resource Center"
              items={resources}
              activeDropdown={activeDropdown}
              dropdownKey="resources"
              openDropdown={openDropdown}
              closeDropdown={closeDropdown}
              navigate={handleNavigate}
            />

            <Dropdown
              title="Locations"
              items={locations}
              activeDropdown={activeDropdown}
              dropdownKey="locations"
              openDropdown={openDropdown}
              closeDropdown={closeDropdown}
              navigate={handleNavigate}
            />

            <NavLink
              title="Contact"
              onClick={() =>
                handleNavigate("/contact")
              }
            />

            <span
              className="
                mx-[2px]
                h-6 w-px
                shrink-0
                bg-white/15
                min-[1440px]:mx-1
                min-[1440px]:h-7
              "
            />

            <button
              type="button"
              aria-label={
                desktopSearchOpen
                  ? "Close website search"
                  : "Open website search"
              }
              aria-expanded={desktopSearchOpen}
              onClick={() => {
                setActiveDropdown(null);

                setDesktopSearchOpen(
                  (current) => !current
                );
              }}
              className={`
                ml-[2px]
                flex h-9
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#e8a556]
                px-3
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.55px]
                text-[#17130e]
                transition-all duration-300
                hover:bg-[#f0af63]
                min-[1360px]:h-10
                min-[1360px]:px-4
                min-[1500px]:px-5
                min-[1500px]:text-[10px]
                min-[1700px]:px-6
                min-[1700px]:text-[11px]
                ${
                  desktopSearchOpen
                    ? "bg-[#f0af63]"
                    : ""
                }
              `}
            >
              {desktopSearchOpen ? (
                <X
                  size={16}
                  strokeWidth={1.8}
                />
              ) : (
                <Search
                  size={16}
                  strokeWidth={1.8}
                />
              )}

              <span
                className="
                  hidden
                  min-[1320px]:inline
                "
              >
                {desktopSearchOpen
                  ? "Close"
                  : "Search"}
              </span>
            </button>
          </nav>

          {/* Mobile/tablet menu button */}

          <button
            type="button"
            aria-label={
              mobileMenu
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={mobileMenu}
            className={`
              pointer-events-auto
              absolute
              right-4 top-[23px]
              z-[110]
              flex h-11 w-11
              items-center justify-center
              rounded-full
              transition-all duration-300
              sm:right-6 sm:top-[28px]
              lg:right-7
              min-[1180px]:hidden
              ${
                mobileMenu
                  ? "bg-white text-black"
                  : isLightNavbar
                    ? `
                      bg-black text-white
                      shadow-lg
                    `
                    : `
                      bg-black/45 text-white
                      shadow-lg
                      backdrop-blur-xl
                      ring-1 ring-white/15
                    `
              }
            `}
            onClick={() => {
              setDesktopSearchOpen(false);

              setMobileMenu(
                (current) => !current
              );

              setMobileDropdown(null);
            }}
          >
            {mobileMenu ? (
              <X
                size={23}
                strokeWidth={1.6}
              />
            ) : (
              <Menu
                size={23}
                strokeWidth={1.6}
              />
            )}
          </button>
        </div>
      </header>

      {/* Desktop search overlay */}

      <div
        className={`
          fixed inset-0
          z-[90]
          hidden
          bg-black/65
          backdrop-blur-md
          transition-all duration-500
          min-[1180px]:block
          ${
            desktopSearchOpen
              ? `
                visible
                pointer-events-auto
                opacity-100
              `
              : `
                invisible
                pointer-events-none
                opacity-0
              `
          }
        `}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            setDesktopSearchOpen(false);
          }
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Search Ultra Stones"
          className={`
            relative mx-auto
            mt-[96px]
            w-[min(760px,calc(100vw-40px))]
            overflow-visible
            rounded-[22px]
            border border-black/[0.06]
            bg-white
            px-5 py-5
            text-black
            shadow-[0_30px_90px_rgba(0,0,0,0.28)]
            transition-all duration-500
            min-[1360px]:mt-[106px]
            min-[1360px]:rounded-[24px]
            min-[1360px]:px-7
            min-[1360px]:py-6
            min-[1600px]:mt-[112px]
            ${
              desktopSearchOpen
                ? `
                  translate-y-0
                  scale-100
                  opacity-100
                `
                : `
                  -translate-y-4
                  scale-[0.98]
                  opacity-0
                `
            }
          `}
        >
          <div
            className="
              mb-5
              flex items-start
              justify-between
              gap-5
            "
          >
            <div className="min-w-0">
              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[2px]
                  text-black/40
                "
              >
                Search Ultra Stones
              </p>

              <h2
                className="
                  mt-2
                  text-[23px]
                  font-medium
                  leading-tight
                  tracking-[-0.7px]
                  text-black
                  sm:text-[27px]
                "
              >
                Find your perfect material
              </h2>

              <p
                className="
                  mt-2
                  max-w-[540px]
                  text-[13px]
                  leading-relaxed
                  text-black/45
                "
              >
                Search across materials, categories,
                and product collections.
              </p>
            </div>

            <button
              type="button"
              aria-label="Close search"
              onClick={() =>
                setDesktopSearchOpen(false)
              }
              className="
                flex h-10 w-10
                shrink-0
                items-center justify-center
                rounded-full
                border border-black/[0.08]
                bg-black/[0.04]
                text-black
                transition-all duration-300
                hover:rotate-90
                hover:border-black
                hover:bg-black
                hover:text-white
              "
            >
              <X
                size={18}
                strokeWidth={1.7}
              />
            </button>
          </div>

          <div
            className="
              relative w-full
              [&>div]:!w-full
              [&>div]:!max-w-none
            "
          >
            <GlobalSearch
              materials={materials}
              isLightNavbar
              expanded
              desktopModal
              onResultClick={() => {
                setDesktopSearchOpen(false);
              }}
            />
          </div>
        </div>
      </div>

      {/* Mobile/tablet navigation */}

      <div
        className={`
          fixed inset-0
          z-[95]
          h-[100dvh]
          w-full
          overflow-y-auto
          overscroll-contain
          bg-[#050b18]
          pt-[96px]
          text-white
          transition-all duration-500
          sm:pt-[108px]
          min-[1180px]:hidden
          ${
            mobileMenu
              ? `
                pointer-events-auto
                translate-x-0
                opacity-100
              `
              : `
                pointer-events-none
                translate-x-full
                opacity-0
              `
          }
        `}
      >
        <div
          className="
            mx-auto
            w-full
            max-w-[820px]
            px-[clamp(20px,5vw,48px)]
            pb-12
            pt-[clamp(22px,4vw,36px)]
          "
        >
          <div
            className="
              mb-[clamp(24px,5vw,40px)]
            "
          >
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
            setActiveDropdown={
              setMobileDropdown
            }
            items={experience}
            navigate={handleNavigate}
            closeMobileMenu={
              closeMobileMenu
            }
          />

          <MobileNavButton
            title="Online Inventory"
            onClick={openInventory}
          />

          {/* Mobile Material Portfolio */}

          <div className="border-b border-white/10">
            <div className="flex w-full items-stretch">
              <button
                type="button"
                onClick={() =>
                  handleNavigate("/categories")
                }
                className="
                  flex flex-1
                  items-center
                  py-[clamp(17px,3vw,22px)]
                  text-left
                  text-[clamp(12px,2vw,14px)]
                  font-medium
                  uppercase
                  leading-[1.4]
                  tracking-[clamp(1.3px,0.25vw,2px)]
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
                aria-expanded={
                  mobileDropdown === "materials"
                }
                onClick={() => {
                  setMobileDropdown((current) =>
                    current === "materials"
                      ? null
                      : "materials"
                  );
                }}
                className="
                  flex w-12
                  shrink-0
                  items-center
                  justify-end
                  py-[clamp(17px,3vw,22px)]
                  text-white
                "
              >
                <ChevronDown
                  size={18}
                  className={`
                    shrink-0
                    transition-transform duration-300
                    ${
                      mobileDropdown ===
                      "materials"
                        ? "rotate-180"
                        : ""
                    }
                  `}
                />
              </button>
            </div>

            <div
              className={`
                grid
                transition-all duration-300
                ${
                  mobileDropdown === "materials"
                    ? `
                      grid-rows-[1fr]
                      opacity-100
                    `
                    : `
                      grid-rows-[0fr]
                      opacity-0
                    `
                }
              `}
            >
              <div className="overflow-hidden">
                <div
                  className="
                    grid grid-cols-1
                    gap-x-8
                    gap-y-[clamp(14px,2.5vw,20px)]
                    pb-[clamp(20px,4vw,28px)]
                    pl-2
                    sm:grid-cols-2
                  "
                >
                  {mobileParentMaterials.map(
                    (item) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() =>
                          handleNavigate(
                            `/product-category/${item.slug}`
                          )
                        }
                        className="
                          block w-full
                          text-left
                          text-[clamp(14px,2vw,16px)]
                          leading-[1.45]
                          text-white/70
                          transition-colors duration-300
                          hover:text-white
                        "
                      >
                        {item.name}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          <MobileDropdown
            title="Resource Center"
            dropdownKey="resources"
            activeDropdown={mobileDropdown}
            setActiveDropdown={
              setMobileDropdown
            }
            items={resources}
            navigate={handleNavigate}
            closeMobileMenu={
              closeMobileMenu
            }
          />

          <MobileDropdown
            title="Locations"
            dropdownKey="locations"
            activeDropdown={mobileDropdown}
            setActiveDropdown={
              setMobileDropdown
            }
            items={locations}
            navigate={handleNavigate}
            closeMobileMenu={
              closeMobileMenu
            }
          />

          <MobileNavButton
            title="Contact"
            onClick={() =>
              handleNavigate("/contact")
            }
          />
        </div>
      </div>
    </>
  );
};

export default Navbar;

/*
 * Desktop navigation link
 */
const NavLink = ({ title, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        relative
        shrink-0
        whitespace-nowrap
        rounded-full
        px-[clamp(8px,0.72vw,15px)]
        py-[11px]
        text-[9px]
        font-medium
        uppercase
        tracking-[0.48px]
        text-white/90
        transition-all duration-300
        hover:bg-white/10
        hover:text-white
        min-[1360px]:text-[9.5px]
        min-[1500px]:py-3
        min-[1500px]:text-[10px]
        min-[1500px]:tracking-[0.65px]
        min-[1700px]:px-4
        min-[1700px]:text-[11px]
        min-[1700px]:tracking-[0.8px]
      "
    >
      {title}
    </button>
  );
};

/*
 * Mobile navigation link
 */
const MobileNavButton = ({
  title,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        w-full
        border-b border-white/10
        py-[clamp(17px,3vw,22px)]
        text-left
        text-[clamp(12px,2vw,14px)]
        font-medium
        uppercase
        leading-[1.4]
        tracking-[clamp(1.3px,0.25vw,2px)]
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
  const isOpen =
    activeDropdown === dropdownKey;

  return (
    <div className="border-b border-white/10">
      <button
        type="button"
        aria-expanded={isOpen}
        onClick={() => {
          setActiveDropdown(
            isOpen ? null : dropdownKey
          );
        }}
        className="
          flex w-full
          items-center
          justify-between
          gap-4
          py-[clamp(17px,3vw,22px)]
          text-left
          text-[clamp(12px,2vw,14px)]
          font-medium
          uppercase
          leading-[1.4]
          tracking-[clamp(1.3px,0.25vw,2px)]
          text-white
        "
      >
        <span>{title}</span>

        <ChevronDown
          size={18}
          className={`
            shrink-0
            transition-transform duration-300
            ${isOpen ? "rotate-180" : ""}
          `}
        />
      </button>

      <div
        className={`
          grid
          transition-all duration-300
          ${
            isOpen
              ? `
                grid-rows-[1fr]
                opacity-100
              `
              : `
                grid-rows-[0fr]
                opacity-0
              `
          }
        `}
      >
        <div className="overflow-hidden">
          <div
            className="
              grid grid-cols-1
              gap-x-8
              gap-y-[clamp(14px,2.5vw,20px)]
              pb-[clamp(20px,4vw,28px)]
              pl-2
              sm:grid-cols-2
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
                  block w-full
                  text-left
                  text-[clamp(14px,2vw,16px)]
                  leading-[1.45]
                  text-white/70
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
 * Desktop dropdown
 */
const Dropdown = ({
  title,
  items,
  activeDropdown,
  dropdownKey,
  openDropdown,
  closeDropdown,
  navigate,
}) => {
  const isActive =
    activeDropdown === dropdownKey;

  return (
    <div
      className="relative shrink-0"
      onMouseEnter={() =>
        openDropdown(dropdownKey)
      }
      onMouseLeave={closeDropdown}
    >
      <button
        type="button"
        aria-expanded={isActive}
        className={`
          flex items-center
          gap-[3px]
          whitespace-nowrap
          rounded-full
          px-[clamp(8px,0.72vw,15px)]
          py-[11px]
          text-[9px]
          font-medium
          uppercase
          tracking-[0.48px]
          text-white/90
          transition-all duration-300
          hover:bg-white/10
          hover:text-white
          min-[1360px]:gap-1
          min-[1360px]:text-[9.5px]
          min-[1500px]:py-3
          min-[1500px]:text-[10px]
          min-[1500px]:tracking-[0.65px]
          min-[1700px]:px-4
          min-[1700px]:text-[11px]
          min-[1700px]:tracking-[0.8px]
          ${
            isActive
              ? "bg-white/10 text-white"
              : ""
          }
        `}
      >
        {title}

        <ChevronDown
          size={12}
          strokeWidth={1.8}
          className={`
            transition-transform duration-300
            min-[1500px]:h-[13px]
            min-[1500px]:w-[13px]
            ${isActive ? "rotate-180" : ""}
          `}
        />
      </button>

      <div
        className={`
          absolute left-1/2
          top-[52px]
          z-[120]
          w-[270px]
          -translate-x-1/2
          rounded-[20px]
          border border-black/[0.06]
          bg-white
          p-3
          shadow-[0_26px_75px_rgba(0,0,0,0.18)]
          transition-all duration-300
          min-[1500px]:top-[56px]
          min-[1500px]:w-[290px]
          min-[1500px]:rounded-[22px]
          min-[1500px]:p-4
          ${
            isActive
              ? `
                visible
                translate-y-0
                opacity-100
              `
              : `
                invisible
                translate-y-3
                opacity-0
              `
          }
        `}
      >
        <div className="space-y-1">
          {items.map((item) => (
            <button
              type="button"
              key={item.path}
              onClick={() =>
                navigate(item.path)
              }
              className="
                group
                flex w-full
                items-center
                justify-between
                rounded-xl
                px-4 py-3
                text-left
                transition-colors duration-300
                hover:bg-[#f3f4f2]
                min-[1500px]:py-3.5
              "
            >
              <span
                className="
                  text-[13px]
                  text-[#5d5d5d]
                  transition-colors duration-300
                  group-hover:text-black
                  min-[1500px]:text-[14px]
                "
              >
                {item.label}
              </span>

              <span
                className="
                  -translate-x-2
                  text-black
                  opacity-0
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
    scrolled,
  }) => {
    const isActive =
      activeDropdown === dropdownKey;

    const [hoveredParent, setHoveredParent] =
      useState(null);

    const parentCategories = useMemo(() => {
      return materials
        .filter(
          (item) =>
            item.parent_id === null &&
            item.is_active
        )
        .sort(alphabeticalSort);
    }, [materials]);

    useEffect(() => {
      if (parentCategories.length === 0) {
        setHoveredParent(null);
        return;
      }

      const selectedParentStillExists =
        parentCategories.some(
          (parent) =>
            parent.id === hoveredParent
        );

      if (!selectedParentStillExists) {
        setHoveredParent(
          parentCategories[0].id
        );
      }
    }, [
      parentCategories,
      hoveredParent,
    ]);

    const activeParent =
      parentCategories.find(
        (parent) =>
          parent.id === hoveredParent
      );

    const getThumbnailUrl = (
      url,
      width = 220,
      quality = 68
    ) => {
      return getOptimizedImageUrl(
        url || "/placeholder.jpg",
        width,
        quality
      );
    };

    return (
      <div
        className="relative shrink-0"
        onMouseEnter={() =>
          openDropdown(dropdownKey)
        }
        onMouseLeave={closeDropdown}
      >
        <button
          type="button"
          aria-expanded={isActive}
          onClick={() => {
            if (path) {
              navigate(path);
            }
          }}
          className={`
            flex items-center gap-1
            whitespace-nowrap rounded-full
            px-3 py-3
            text-[10px] font-medium
            uppercase tracking-[0.65px]
            text-white/90
            transition-all duration-300
            hover:bg-white/10
            hover:text-white
            min-[1500px]:px-4
            min-[1500px]:text-[11px]
            min-[1500px]:tracking-[0.8px]
            ${
              isActive
                ? "bg-white/10 text-white"
                : ""
            }
          `}
        >
          {title}

          <ChevronDown
            size={13}
            strokeWidth={1.8}
            className={`
              transition-transform duration-300
              ${isActive ? "rotate-180" : ""}
            `}
          />
        </button>

        <div
          className={`
            fixed left-1/2 z-[120]
            w-[min(980px,calc(100vw-48px))]
            -translate-x-1/2
            rounded-[26px]
            border border-black/[0.06]
            bg-white p-6
            shadow-[0_32px_100px_rgba(0,0,0,0.23)]
            transition-all duration-300
            ${
              scrolled
                ? "top-[66px]"
                : "top-[66px]"
            }
            ${
              isActive
                ? `
                  visible translate-y-0
                  opacity-100
                `
                : `
                  invisible translate-y-4
                  opacity-0
                `
            }
          `}
        >
          <div
            className="
              grid h-[520px]
              grid-cols-[280px_minmax(0,1fr)]
              gap-6
            "
          >
            {/* Parent categories */}

            <div
              className="
                scrollbar-thin h-full
                overflow-y-auto
                border-r border-black/10
                pr-4
              "
            >
              <div className="mb-4 px-2">
                <p
                  className="
                    text-[10px] font-semibold
                    uppercase tracking-[1.8px]
                    text-black/35
                  "
                >
                  Explore Materials
                </p>

                <h2
                  className="
                    mt-2 text-[23px]
                    font-medium
                    tracking-[-0.7px]
                    text-black
                  "
                >
                  Material Portfolio
                </h2>
              </div>

              <div className="space-y-1">
                {parentCategories.map(
                  (parent) => {
                    const thumbnailUrl =
                      getThumbnailUrl(
                        parent.thumbnail_url,
                        220,
                        65
                      );

                    const isSelected =
                      hoveredParent === parent.id;

                    return (
                      <button
                        type="button"
                        key={parent.id}
                        onMouseEnter={() => {
                          setHoveredParent(
                            parent.id
                          );
                        }}
                        onFocus={() => {
                          setHoveredParent(
                            parent.id
                          );
                        }}
                        onClick={() =>
                          navigate(
                            `/product-category/${parent.slug}`
                          )
                        }
                        className={`
                          flex w-full items-center
                          gap-3 rounded-xl
                          px-2.5 py-2.5
                          text-left
                          transition-all duration-300
                          ${
                            isSelected
                              ? `
                                bg-[#f1f3f1]
                                shadow-sm
                              `
                              : `
                                hover:bg-[#f7f7f6]
                              `
                          }
                        `}
                      >
                        <div
                          className="
                            h-11 w-20 min-w-[80px]
                            shrink-0 overflow-hidden
                            rounded-lg bg-black/5
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
                                220,
                                65
                              )} 220w
                            `}
                            sizes="80px"
                            alt={parent.name}
                            loading="lazy"
                            decoding="async"
                            fetchPriority="low"
                            className="
                              h-full w-full object-cover
                              transition-transform duration-500
                            "
                          />
                        </div>

                        <span
                          className={`
                            text-[13px]
                            ${
                              isSelected
                                ? `
                                  font-semibold
                                  text-black
                                `
                                : "text-[#666]"
                            }
                          `}
                        >
                          {parent.name}
                        </span>
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Active category */}

            <div className="min-w-0">
              {activeParent && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/product-category/${activeParent.slug}`
                      )
                    }
                    className="
                      group relative block
                      h-[385px] w-full
                      overflow-hidden
                      rounded-[20px]
                      bg-black/5 text-left
                    "
                  >
                    <img
                      key={activeParent.id}
                      src={getThumbnailUrl(
                        activeParent.thumbnail_url,
                        1000,
                        74
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
                          75
                        )} 1200w
                      `}
                      sizes="650px"
                      alt={activeParent.name}
                      loading="eager"
                      decoding="async"
                      fetchPriority="high"
                      className="
                        h-full w-full object-cover
                        transition-transform
                        duration-[1000ms]
                        ease-out
                        group-hover:scale-[1.04]
                      "
                    />

                    <div
                      className="
                        absolute inset-0
                        bg-gradient-to-t
                        from-black/75
                        via-black/5
                        to-transparent
                      "
                    />

                    <div
                      className="
                        absolute inset-x-0
                        bottom-0 p-6
                      "
                    >
                      <p
                        className="
                          text-[10px] font-semibold
                          uppercase tracking-[1.8px]
                          text-white/60
                        "
                      >
                        Featured Material
                      </p>

                      <h3
                        className="
                          mt-2 text-[34px]
                          font-medium
                          tracking-[-1.2px]
                          text-white
                        "
                      >
                        {activeParent.name}
                      </h3>
                    </div>
                  </button>

                  <div
                    className="
                      mt-4 flex items-start
                      justify-between gap-6
                    "
                  >
                    <p
                      className="
                        line-clamp-3
                        max-w-[540px]
                        text-[13px]
                        leading-relaxed
                        text-black/55
                      "
                    >
                      {activeParent.description ||
                        "Explore our premium collection of distinctive surfaces for residential and commercial applications."}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/product-category/${activeParent.slug}`
                        )
                      }
                      className="
                        shrink-0 text-[11px]
                        font-semibold uppercase
                        tracking-[1px]
                        text-black
                        hover:underline
                      "
                    >
                      View all →
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
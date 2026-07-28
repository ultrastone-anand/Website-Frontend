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
   * Close navigation after route changes
   */
  useEffect(() => {
    setMobileMenu(false);
    setMobileDropdown(null);
    setActiveDropdown(null);
    setDesktopSearchOpen(false);
  }, [location.pathname]);

  /*
   * Lock body while overlays are open
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
  }, [
    mobileMenu,
    desktopSearchOpen,
  ]);

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
   * Clear dropdown timer
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
      }, 160);
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
            h-[140px] w-full
            max-w-[1920px]
            px-5 sm:px-7
            xl:px-7 2xl:px-12
          "
        >
          {/* Logo */}

          <button
            type="button"
            aria-label="Go to Ultra Stones home page"
            className={`
              pointer-events-auto
              absolute left-5 top-[22px]
              z-[110] shrink-0
              transition-all duration-500
              sm:left-7
              xl:left-7
              2xl:left-12
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
                h-[52px] w-[170px]
                sm:h-[57px] sm:w-[190px]
                xl:h-[46px] xl:w-[138px]
                min-[1360px]:h-[49px]
                min-[1360px]:w-[150px]
                min-[1450px]:h-[53px]
                min-[1450px]:w-[170px]
                2xl:h-[62px]
                2xl:w-[210px]
              "
            >
              <img
                src="/logo_white.svg"
                alt="Ultra Stones"
                className={`
                  absolute inset-0
                  h-full w-auto object-contain
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
                  h-full w-auto object-contain
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

          {/* Centered liquid-glass navigation */}

          <nav
            className={`
              pointer-events-auto
              absolute left-1/2 top-[25px]
              hidden -translate-x-1/2
              items-center overflow-visible
              rounded-full
              p-[5px]
              transition-all duration-500
              xl:flex
              min-[1400px]:p-[6px]
              min-[1536px]:p-[7px]

              before:pointer-events-none
              before:absolute
              before:inset-[1px]
              before:rounded-full
              before:bg-gradient-to-b
              before:from-white/[0.22]
              before:via-white/[0.055]
              before:to-white/[0.025]

              after:pointer-events-none
              after:absolute
              after:inset-x-[12%]
              after:top-[2px]
              after:h-[42%]
              after:rounded-full
              after:bg-gradient-to-b
              after:from-white/[0.20]
              after:to-transparent
              after:blur-[1px]

              ${
                scrolled
                  ? `
                    bg-[linear-gradient(135deg,rgba(10,18,22,0.78),rgba(4,35,43,0.60))]
                    shadow-[0_22px_60px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.22),inset_0_-1px_0_rgba(255,255,255,0.06)]
                    ring-1 ring-white/[0.16]
                    backdrop-blur-[26px]
                    backdrop-saturate-[180%]
                  `
                  : `
                    bg-[linear-gradient(135deg,rgba(4,75,91,0.58),rgba(5,37,47,0.46))]
                    shadow-[0_20px_65px_rgba(0,18,26,0.25),0_8px_30px_rgba(30,193,210,0.08),inset_0_1px_0_rgba(255,255,255,0.28),inset_0_-1px_0_rgba(255,255,255,0.07)]
                    ring-1 ring-white/[0.20]
                    backdrop-blur-[28px]
                    backdrop-saturate-[185%]
                  `
              }
            `}
          >
            {/* Liquid glow */}

            <span
              aria-hidden="true"
              className="
                pointer-events-none
                absolute -bottom-3 left-1/2
                h-7 w-[72%]
                -translate-x-1/2
                rounded-full
                bg-cyan-300/[0.11]
                blur-2xl
              "
            />

            {/* Glass reflection */}

            <span
              aria-hidden="true"
              className="
                pointer-events-none
                absolute left-[9%] top-[4px]
                h-[1px] w-[48%]
                rounded-full
                bg-gradient-to-r
                from-transparent
                via-white/65
                to-transparent
              "
            />

            <div
              className="
                relative z-10
                flex items-center
              "
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
                  mx-0.5 h-6 w-px
                  shrink-0
                  bg-gradient-to-b
                  from-transparent
                  via-white/30
                  to-transparent
                  min-[1450px]:mx-1
                  min-[1450px]:h-7
                "
              />

              {/* Search button */}

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
                  group/search
                  relative ml-0.5
                  flex h-9 w-9 shrink-0
                  items-center justify-center
                  overflow-hidden rounded-full
                  border border-white/20
                  bg-[linear-gradient(145deg,rgba(255,205,137,0.98),rgba(224,145,66,0.93))]
                  text-[#21170e]
                  shadow-[0_6px_18px_rgba(204,122,42,0.27),inset_0_1px_0_rgba(255,255,255,0.58)]
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:shadow-[0_10px_25px_rgba(204,122,42,0.36),inset_0_1px_0_rgba(255,255,255,0.68)]
                  min-[1400px]:h-10
                  min-[1400px]:w-10
                  min-[1500px]:w-auto
                  min-[1500px]:gap-2
                  min-[1500px]:px-5
                  ${
                    desktopSearchOpen
                      ? `
                        bg-[linear-gradient(145deg,rgba(255,215,157,1),rgba(236,157,75,0.96))]
                      `
                      : ""
                  }
                `}
              >
                <span
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute inset-x-1 top-0
                    h-1/2 rounded-full
                    bg-gradient-to-b
                    from-white/40
                    to-transparent
                  "
                />

                <span className="relative z-10">
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
                </span>

                <span
                  className="
                    relative z-10
                    hidden text-[10px]
                    font-semibold uppercase
                    tracking-[0.7px]
                    min-[1500px]:inline
                    min-[1536px]:text-[11px]
                  "
                >
                  {desktopSearchOpen
                    ? "Close"
                    : "Search"}
                </span>
              </button>
            </div>
          </nav>

          {/* Mobile menu button */}

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
              absolute right-5 top-[30px]
              z-[110]
              flex h-11 w-11
              shrink-0 items-center
              justify-center overflow-hidden
              rounded-full
              border border-white/[0.16]
              transition-all duration-300
              sm:right-7
              xl:hidden
              ${
                mobileMenu
                  ? `
                    bg-white text-black
                    shadow-xl
                  `
                  : isLightNavbar
                    ? `
                      bg-black/80 text-white
                      shadow-lg
                      backdrop-blur-xl
                    `
                    : `
                      bg-white/[0.12] text-white
                      shadow-lg
                      backdrop-blur-[22px]
                      ring-1 ring-white/[0.10]
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
          fixed inset-0 z-[90]
          hidden overflow-y-auto
          bg-black/60
          px-5
          backdrop-blur-[12px]
          transition-all duration-500
          xl:block
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
            mt-[103px]
            w-full max-w-[760px]
            overflow-visible
            rounded-[28px]
            border border-white/35
            bg-white/[0.88]
            px-6 py-6
            text-black
            shadow-[0_35px_100px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.9)]
            backdrop-blur-[30px]
            backdrop-saturate-[170%]
            transition-all duration-500
            sm:px-8 sm:py-7
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
            aria-hidden="true"
            className="
              pointer-events-none
              absolute inset-x-[8%] top-[1px]
              h-[2px] rounded-full
              bg-gradient-to-r
              from-transparent
              via-white
              to-transparent
            "
          />

          <div
            className="
              mb-5 flex items-start
              justify-between gap-5
            "
          >
            <div className="min-w-0">
              <p
                className="
                  text-[10px] font-semibold
                  uppercase tracking-[2px]
                  text-black/40
                "
              >
                Search Ultra Stones
              </p>

              <h2
                className="
                  mt-2 text-[24px]
                  font-medium leading-tight
                  tracking-[-0.7px]
                  text-black
                  sm:text-[28px]
                "
              >
                Find your perfect material
              </h2>

              <p
                className="
                  mt-2 max-w-[540px]
                  text-[13px] leading-relaxed
                  text-black/45
                "
              >
                Search across materials,
                categories, and product
                collections.
              </p>
            </div>

            <button
              type="button"
              aria-label="Close search"
              onClick={() =>
                setDesktopSearchOpen(false)
              }
              className="
                flex h-10 w-10 shrink-0
                items-center justify-center
                rounded-full
                border border-black/[0.08]
                bg-white/60
                text-black
                shadow-sm
                backdrop-blur-xl
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
              relative w-full max-w-none
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

      {/* Mobile navigation */}

      <div
        className={`
          fixed left-0 top-0 z-[95]
          h-[100dvh] w-full
          overflow-y-auto overscroll-contain
          bg-[radial-gradient(circle_at_top_left,rgba(12,80,94,0.30),transparent_40%),linear-gradient(145deg,#050b18,#06141b)]
          pt-[104px]
          text-white
          transition-all duration-500
          xl:hidden
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
            px-[clamp(20px,5vw,40px)]
            py-[clamp(24px,5vw,40px)]
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
                  flex w-[clamp(38px,10vw,48px)]
                  shrink-0 items-center
                  justify-end
                  py-[clamp(16px,4vw,22px)]
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
                grid transition-all duration-300
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
                    space-y-[clamp(14px,3vw,20px)]
                    pb-[clamp(18px,4vw,24px)]
                    pl-[clamp(8px,2vw,16px)]
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
                          block w-full text-left
                          text-[clamp(14px,3.4vw,16px)]
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
const NavLink = ({
  title,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        relative shrink-0
        whitespace-nowrap rounded-full
        px-2 py-2.5
        text-[8px] font-medium
        uppercase tracking-[0.38px]
        text-white/90
        transition-all duration-300
        hover:bg-white/[0.12]
        hover:text-white
        hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]
        min-[1320px]:px-2.5
        min-[1320px]:text-[9px]
        min-[1400px]:px-3
        min-[1400px]:py-3
        min-[1400px]:text-[10px]
        min-[1400px]:tracking-[0.6px]
        min-[1500px]:px-4
        min-[1500px]:text-[11px]
        min-[1500px]:tracking-[0.8px]
      "
    >
      {title}
    </button>
  );
};

/*
 * Mobile navigation button
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
 * Mobile dropdown
 */
const MobileDropdown = ({
  title,
  dropdownKey,
  activeDropdown,
  setActiveDropdown,
  items,
  navigate,
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
          flex w-full items-center
          justify-between gap-4
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
            shrink-0
            transition-transform duration-300
            ${isOpen ? "rotate-180" : ""}
          `}
        />
      </button>

      <div
        className={`
          grid transition-all duration-300
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
              space-y-[clamp(14px,3vw,20px)]
              pb-[clamp(18px,4vw,24px)]
              pl-[clamp(8px,2vw,16px)]
            "
          >
            {items.map((item) => (
              <button
                type="button"
                key={item.path}
                onClick={() =>
                  navigate(item.path)
                }
                className="
                  block w-full text-left
                  text-[clamp(14px,3.4vw,16px)]
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
          flex items-center gap-0.5
          whitespace-nowrap rounded-full
          px-2 py-2.5
          text-[8px] font-medium
          uppercase tracking-[0.38px]
          text-white/90
          transition-all duration-300
          hover:bg-white/[0.12]
          hover:text-white
          hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]
          min-[1320px]:px-2.5
          min-[1320px]:text-[9px]
          min-[1400px]:gap-1
          min-[1400px]:px-3
          min-[1400px]:py-3
          min-[1400px]:text-[10px]
          min-[1400px]:tracking-[0.6px]
          min-[1500px]:px-4
          min-[1500px]:text-[11px]
          min-[1500px]:tracking-[0.8px]
          ${
            isActive
              ? `
                bg-white/[0.14]
                text-white
                shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]
              `
              : ""
          }
        `}
      >
        {title}

        <ChevronDown
          size={11}
          strokeWidth={1.8}
          className={`
            transition-transform duration-300
            min-[1400px]:h-[13px]
            min-[1400px]:w-[13px]
            ${isActive ? "rotate-180" : ""}
          `}
        />
      </button>

      <div
        className={`
          absolute left-1/2 top-[51px]
          z-[120]
          w-[270px]
          -translate-x-1/2
          overflow-hidden
          rounded-[22px]
          border border-white/60
          bg-white/[0.88]
          p-3
          text-black
          shadow-[0_30px_90px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.95)]
          backdrop-blur-[30px]
          backdrop-saturate-[180%]
          transition-all duration-300
          min-[1400px]:top-[56px]
          min-[1400px]:w-[290px]
          min-[1400px]:p-4
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
        <span
          aria-hidden="true"
          className="
            pointer-events-none
            absolute inset-x-[12%] top-0
            h-[1px]
            bg-gradient-to-r
            from-transparent via-white to-transparent
          "
        />

        <div className="relative z-10 space-y-1">
          {items.map((item) => (
            <button
              type="button"
              key={item.path}
              onClick={() =>
                navigate(item.path)
              }
              className="
                group flex w-full
                items-center justify-between
                rounded-xl px-4 py-3
                text-left
                transition-all duration-300
                hover:bg-white/80
                hover:shadow-[0_5px_20px_rgba(0,0,0,0.06)]
                min-[1400px]:py-3.5
              "
            >
              <span
                className="
                  text-[13px] text-[#5d5d5d]
                  transition-colors duration-300
                  group-hover:text-black
                  min-[1400px]:text-[14px]
                "
              >
                {item.label}
              </span>

              <span
                className="
                  -translate-x-2
                  text-black opacity-0
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
 * Material Portfolio mega menu
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
          flex items-center gap-0.5
          whitespace-nowrap rounded-full
          px-2 py-2.5
          text-[8px] font-medium
          uppercase tracking-[0.38px]
          text-white/90
          transition-all duration-300
          hover:bg-white/[0.12]
          hover:text-white
          hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]
          min-[1320px]:px-2.5
          min-[1320px]:text-[9px]
          min-[1400px]:gap-1
          min-[1400px]:px-3
          min-[1400px]:py-3
          min-[1400px]:text-[10px]
          min-[1400px]:tracking-[0.6px]
          min-[1500px]:px-4
          min-[1500px]:text-[11px]
          min-[1500px]:tracking-[0.8px]
          ${
            isActive
              ? `
                bg-white/[0.14]
                text-white
                shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]
              `
              : ""
          }
        `}
      >
        {title}

        <ChevronDown
          size={11}
          strokeWidth={1.8}
          className={`
            transition-transform duration-300
            min-[1400px]:h-[13px]
            min-[1400px]:w-[13px]
            ${isActive ? "rotate-180" : ""}
          `}
        />
      </button>

      <div
        className={`
          fixed left-1/2 top-[65px]
          z-[120]
          w-[calc(100vw-32px)]
          max-w-[1060px]
          -translate-x-1/2
          overflow-hidden
          rounded-[28px]
          border border-white/60
          bg-white/[0.88]
          p-4
          text-black
          shadow-[0_35px_110px_rgba(0,0,0,0.27),inset_0_1px_0_rgba(255,255,255,0.96)]
          backdrop-blur-[34px]
          backdrop-saturate-[180%]
          transition-all duration-300
          min-[1400px]:w-[calc(100vw-64px)]
          min-[1400px]:p-5
          min-[1500px]:max-w-[1120px]
          min-[1500px]:p-6
          ${
            isActive
              ? `
                visible
                translate-y-0
                opacity-100
              `
              : `
                invisible
                translate-y-4
                opacity-0
              `
          }
        `}
      >
        <span
          aria-hidden="true"
          className="
            pointer-events-none
            absolute inset-x-[9%] top-0
            h-[2px]
            bg-gradient-to-r
            from-transparent via-white to-transparent
          "
        />

        <div
          className="
            relative z-10
            grid
            h-[min(500px,calc(100vh-95px))]
            min-h-[400px]
            grid-cols-[220px_minmax(0,1fr)]
            gap-4
            min-[1400px]:grid-cols-[250px_minmax(0,1fr)]
            min-[1400px]:gap-5
            min-[1500px]:h-[520px]
            min-[1500px]:grid-cols-[280px_minmax(0,1fr)]
            min-[1500px]:gap-6
          "
        >
          {/* Categories */}

          <div
            className="
              scrollbar-thin
              h-full overflow-y-auto
              border-r border-black/10
              pr-3
              min-[1400px]:pr-4
            "
          >
            <div
              className="
                mb-3 px-1
                min-[1400px]:mb-4
                min-[1400px]:px-2
              "
            >
              <p
                className="
                  text-[9px] font-semibold
                  uppercase tracking-[1.5px]
                  text-black/35
                  min-[1400px]:text-[10px]
                  min-[1400px]:tracking-[1.8px]
                "
              >
                Explore Materials
              </p>

              <h2
                className="
                  mt-1.5 text-[19px]
                  font-medium
                  tracking-[-0.5px]
                  text-black
                  min-[1400px]:mt-2
                  min-[1400px]:text-[22px]
                  min-[1500px]:text-[23px]
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
                      onMouseEnter={() =>
                        setHoveredParent(
                          parent.id
                        )
                      }
                      onFocus={() =>
                        setHoveredParent(
                          parent.id
                        )
                      }
                      onClick={() =>
                        navigate(
                          `/product-category/${parent.slug}`
                        )
                      }
                      className={`
                        flex w-full items-center
                        gap-2 rounded-xl
                        px-2 py-2
                        text-left
                        transition-all duration-300
                        min-[1400px]:gap-3
                        min-[1400px]:px-2.5
                        min-[1400px]:py-2.5
                        ${
                          isSelected
                            ? `
                              bg-white/85
                              shadow-[0_6px_18px_rgba(0,0,0,0.07)]
                              ring-1 ring-black/[0.035]
                            `
                            : `
                              hover:bg-white/65
                            `
                        }
                      `}
                    >
                      <div
                        className="
                          h-10 w-16 min-w-[64px]
                          shrink-0 overflow-hidden
                          rounded-lg bg-black/5
                          min-[1400px]:h-11
                          min-[1400px]:w-20
                          min-[1400px]:min-w-[80px]
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
                          min-w-0 truncate
                          text-[12px]
                          min-[1400px]:text-[13px]
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

          {/* Active material */}

          <div className="min-w-0">
            {activeParent ? (
              <div
                className="
                  flex h-full min-h-0
                  flex-col
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/product-category/${activeParent.slug}`
                    )
                  }
                  className="
                    group relative block
                    min-h-0 flex-1
                    overflow-hidden
                    rounded-[22px]
                    bg-black/5 text-left
                    shadow-[0_12px_35px_rgba(0,0,0,0.12)]
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
                    sizes="(max-width: 1400px) 720px, 800px"
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
                      from-black/80
                      via-black/5
                      to-transparent
                    "
                  />

                  <div
                    className="
                      absolute inset-x-0 bottom-0
                      p-4
                      min-[1400px]:p-5
                      min-[1500px]:p-6
                    "
                  >
                    <p
                      className="
                        text-[9px] font-semibold
                        uppercase tracking-[1.5px]
                        text-white/60
                        min-[1400px]:text-[10px]
                        min-[1400px]:tracking-[1.8px]
                      "
                    >
                      Featured Material
                    </p>

                    <h3
                      className="
                        mt-1.5 text-[27px]
                        font-medium
                        tracking-[-0.9px]
                        text-white
                        min-[1400px]:mt-2
                        min-[1400px]:text-[31px]
                        min-[1500px]:text-[34px]
                        min-[1500px]:tracking-[-1.2px]
                      "
                    >
                      {activeParent.name}
                    </h3>
                  </div>
                </button>

                <div
                  className="
                    mt-3 flex shrink-0
                    items-start justify-between
                    gap-4
                    min-[1400px]:mt-4
                    min-[1400px]:gap-6
                  "
                >
                  <p
                    className="
                      line-clamp-2
                      max-w-[540px]
                      text-[12px]
                      leading-relaxed
                      text-black/55
                      min-[1400px]:line-clamp-3
                      min-[1400px]:text-[13px]
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
                      shrink-0 whitespace-nowrap
                      text-[10px] font-semibold
                      uppercase tracking-[0.8px]
                      text-black
                      hover:underline
                      min-[1400px]:text-[11px]
                      min-[1400px]:tracking-[1px]
                    "
                  >
                    View all →
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="
                  flex h-full items-center
                  justify-center rounded-[22px]
                  bg-white/40
                  text-[14px] text-black/45
                "
              >
                No material categories available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
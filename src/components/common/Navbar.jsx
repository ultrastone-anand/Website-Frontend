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

/* =========================================================
   SORT
========================================================= */

const alphabeticalSort = (
  a,
  b,
) =>
  String(
    a.name || "",
  ).localeCompare(
    String(
      b.name || "",
    ),
    undefined,
    {
      sensitivity:
        "base",

      numeric:
        true,
    },
  );

/* =========================================================
   NAVBAR
========================================================= */

const Navbar = () => {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const isHomePage =
    location.pathname ===
    "/";

  /* =======================================================
     STATE
  ======================================================= */

  const [
    mobileMenu,
    setMobileMenu,
  ] = useState(false);

  const [
    mobileDropdown,
    setMobileDropdown,
  ] = useState(null);

  const [
    activeDropdown,
    setActiveDropdown,
  ] = useState(null);

  const [
    materials,
    setMaterials,
  ] = useState([]);

  const [
    scrolled,
    setScrolled,
  ] = useState(false);

  const [
    desktopSearchOpen,
    setDesktopSearchOpen,
  ] = useState(false);

  /* =======================================================
     REFS
  ======================================================= */

  const dropdownTimeout =
    useRef(null);

  const scrollFrameRef =
    useRef(null);

  /* =======================================================
     NAVBAR STYLE
  ======================================================= */

  const isLightNavbar =
    !isHomePage &&
    !scrolled &&
    !mobileMenu &&
    !desktopSearchOpen;

  /* =========================================================
     SCROLL DETECTION

     requestAnimationFrame keeps scroll work synced
     with browser paint and avoids excessive updates.
  ========================================================= */

  useEffect(() => {
    const updateScrollState =
      () => {
        const nextScrolled =
          window.scrollY >
          40;

        setScrolled(
          (current) =>
            current ===
            nextScrolled
              ? current
              : nextScrolled,
        );

        scrollFrameRef.current =
          null;
      };

    const handleScroll =
      () => {
        if (
          scrollFrameRef.current !==
          null
        ) {
          return;
        }

        scrollFrameRef.current =
          window.requestAnimationFrame(
            updateScrollState,
          );
      };

    updateScrollState();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      },
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
      );

      if (
        scrollFrameRef.current !==
        null
      ) {
        window.cancelAnimationFrame(
          scrollFrameRef.current,
        );

        scrollFrameRef.current =
          null;
      }
    };
  }, []);

  /* =========================================================
     FETCH MATERIAL CATEGORIES
  ========================================================= */

  useEffect(() => {
    const controller =
      new AbortController();

    const fetchMaterials =
      async () => {
        try {
          const response =
            await axios.get(
              `${import.meta.env.VITE_API_URL}/stones`,
              {
                signal:
                  controller.signal,
              },
            );

          const result =
            response.data;

          if (
            result.success
          ) {
            setMaterials(
              (
                result.data ||
                []
              ).filter(
                (item) =>
                  item.is_active ===
                  true,
              ),
            );
          }
        } catch (error) {
          if (
            error.code !==
              "ERR_CANCELED" &&
            error.name !==
              "CanceledError"
          ) {
            console.error(
              "Error fetching materials:",
              error,
            );
          }
        }
      };

    fetchMaterials();

    return () => {
      controller.abort();
    };
  }, []);

  /* =========================================================
     CLOSE UI AFTER ROUTE CHANGE
  ========================================================= */

  useEffect(() => {
    setMobileMenu(
      false,
    );

    setMobileDropdown(
      null,
    );

    setActiveDropdown(
      null,
    );

    setDesktopSearchOpen(
      false,
    );
  }, [
    location.pathname,
  ]);

  /* =========================================================
     BREAKPOINT WATCH

     Better than listening to every resize event.
     Only reacts when crossing 1180px.
  ========================================================= */

  useEffect(() => {
    const mediaQuery =
      window.matchMedia(
        `(min-width: ${DESKTOP_BREAKPOINT}px)`,
      );

    const handleBreakpointChange =
      (event) => {
        if (
          event.matches
        ) {
          /*
           * Desktop
           */
          setMobileMenu(
            false,
          );

          setMobileDropdown(
            null,
          );
        } else {
          /*
           * Tablet / Mobile
           */
          setDesktopSearchOpen(
            false,
          );

          setActiveDropdown(
            null,
          );
        }
      };

    handleBreakpointChange(
      mediaQuery,
    );

    mediaQuery.addEventListener(
      "change",
      handleBreakpointChange,
    );

    return () => {
      mediaQuery.removeEventListener(
        "change",
        handleBreakpointChange,
      );
    };
  }, []);

  /* =========================================================
     BODY SCROLL LOCK

     Locks both body and html.
     Helps prevent Safari/iPad getting stuck.
  ========================================================= */

  useEffect(() => {
    const shouldLock =
      mobileMenu ||
      desktopSearchOpen;

    if (
      !shouldLock
    ) {
      return undefined;
    }

    const body =
      document.body;

    const html =
      document.documentElement;

    const previousBodyOverflow =
      body.style.overflow;

    const previousHtmlOverflow =
      html.style.overflow;

    const previousBodyTouchAction =
      body.style.touchAction;

    const previousHtmlTouchAction =
      html.style.touchAction;

    body.style.overflow =
      "hidden";

    html.style.overflow =
      "hidden";

    body.style.touchAction =
      "none";

    html.style.touchAction =
      "none";

    return () => {
      body.style.overflow =
        previousBodyOverflow;

      html.style.overflow =
        previousHtmlOverflow;

      body.style.touchAction =
        previousBodyTouchAction;

      html.style.touchAction =
        previousHtmlTouchAction;
    };
  }, [
    mobileMenu,
    desktopSearchOpen,
  ]);

  /* =========================================================
     ESCAPE KEY
  ========================================================= */

  useEffect(() => {
    const handleKeyDown =
      (event) => {
        if (
          event.key !==
          "Escape"
        ) {
          return;
        }

        setMobileMenu(
          false,
        );

        setMobileDropdown(
          null,
        );

        setActiveDropdown(
          null,
        );

        setDesktopSearchOpen(
          false,
        );
      };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, []);

  /* =========================================================
     CLEAR DROPDOWN TIMER
  ========================================================= */

  useEffect(() => {
    return () => {
      if (
        dropdownTimeout.current
      ) {
        window.clearTimeout(
          dropdownTimeout.current,
        );
      }
    };
  }, []);

  /* =========================================================
     DROPDOWN
  ========================================================= */

  const openDropdown =
    (menu) => {
      if (
        dropdownTimeout.current
      ) {
        window.clearTimeout(
          dropdownTimeout.current,
        );
      }

      setDesktopSearchOpen(
        false,
      );

      setActiveDropdown(
        menu,
      );
    };

  const closeDropdown =
    () => {
      if (
        dropdownTimeout.current
      ) {
        window.clearTimeout(
          dropdownTimeout.current,
        );
      }

      dropdownTimeout.current =
        window.setTimeout(
          () => {
            setActiveDropdown(
              null,
            );
          },
          180,
        );
    };

  /* =========================================================
     CLOSE MOBILE
  ========================================================= */

  const closeMobileMenu =
    () => {
      setMobileMenu(
        false,
      );

      setMobileDropdown(
        null,
      );
    };

  /* =========================================================
     NAVIGATE
  ========================================================= */

  const handleNavigate =
    (path) => {
      setActiveDropdown(
        null,
      );

      setDesktopSearchOpen(
        false,
      );

      setMobileMenu(
        false,
      );

      setMobileDropdown(
        null,
      );

      navigate(path);
    };

  /* =========================================================
     INVENTORY
  ========================================================= */

  const openInventory =
    () => {
      window.open(
        INVENTORY_URL,
        "_blank",
        "noopener,noreferrer",
      );

      setActiveDropdown(
        null,
      );

      setDesktopSearchOpen(
        false,
      );

      closeMobileMenu();
    };

  /* =========================================================
     SEARCH
  ========================================================= */

  const toggleDesktopSearch =
    () => {
      setActiveDropdown(
        null,
      );

      setDesktopSearchOpen(
        (current) =>
          !current,
      );
    };

  /* =========================================================
     LOGO
  ========================================================= */

  const handleLogoClick =
    () => {
      if (
        location.pathname ===
        "/"
      ) {
        window.scrollTo({
          top: 0,

          behavior:
            "smooth",
        });

        return;
      }

      handleNavigate(
        "/",
      );
    };

  /* =========================================================
     MENU DATA
  ========================================================= */

  const experience = [
    {
      label:
        "About Us",

      path:
        "/aboutus",
    },

    {
      label:
        "Our Process",

      path:
        "/ourprocess",
    },
  ];

  const resources = [
    {
      label:
        "Merchandising Displays",

      path:
        "/merchandising-displays",
    },

    {
      label:
        "Portfolio",

      path:
        "/gallery",
    },

    {
      label:
        "Silica Safety First",

      path:
        "/safety-first",
    },
    {
      label:
        "CEU",

      path:
        "/ceu",
    },

    {
      label:
        "Our Blogs",

      path:
        "/blogs",
    },

    {
      label:
        "Career",

      path:
        "/career",
    },
  ];

  const locations = [
    {
      label:
        "New York",

      path:
        "/locations/new-york",
    },

    {
      label:
        "Philadelphia",

      path:
        "/locations/philadelphia",
    },
  ];

  /* =========================================================
     MOBILE MATERIALS
  ========================================================= */

  const mobileParentMaterials =
    useMemo(() => {
      return materials
        .filter(
          (item) =>
            item.parent_id ===
              null &&
            item.is_active,
        )
        .sort(
          alphabeticalSort,
        );
    }, [
      materials,
    ]);

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        className="
          pointer-events-none
          fixed
          inset-x-0
          top-0
          z-[100]
          w-full
        "
      >
        <div
          className="
            relative
            mx-auto
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

          {/* =================================================
              FULL LOGO
          ================================================= */}

          <button
            type="button"
            aria-label="Go to Ultra Stones home page"
            className={`
              pointer-events-auto
              absolute
              left-4
              top-[22px]
              z-[110]

              transition-all
              duration-700
              ease-[cubic-bezier(0.22,1,0.36,1)]

              sm:left-6
              sm:top-[24px]

              lg:left-7

              min-[1440px]:left-8

              min-[1700px]:left-12

              ${
                scrolled
                  ? `
                    pointer-events-none
                    invisible
                    -translate-y-1
                    scale-[0.94]
                    opacity-0
                  `
                  : `
                    visible
                    translate-y-0
                    scale-100
                    opacity-100
                  `
              }
            `}
            onClick={
              handleLogoClick
            }
          >
            <div
              className="
                relative
                h-[46px]
                w-[150px]

                sm:h-[52px]
                sm:w-[174px]

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
                draggable={
                  false
                }
                className={`
                  absolute
                  inset-0
                  h-full
                  w-auto
                  object-contain

                  transition-opacity
                  duration-500

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
                draggable={
                  false
                }
                className={`
                  absolute
                  inset-0
                  h-full
                  w-auto
                  object-contain

                  transition-opacity
                  duration-500

                  ${
                    isLightNavbar
                      ? "opacity-100"
                      : "opacity-0"
                  }
                `}
              />
            </div>
          </button>

          {/* =================================================
              SEARCH BEFORE SCROLL
          ================================================= */}

          <div
            className={`
              pointer-events-auto
              absolute
              right-7
              top-[24px]
              z-[108]
              hidden

              transition-all
              duration-500
              ease-[cubic-bezier(0.22,1,0.36,1)]

              min-[1180px]:block

              min-[1440px]:right-8

              min-[1600px]:top-[27px]

              min-[1700px]:right-12

              ${
                scrolled
                  ? `
                    pointer-events-none
                    invisible
                    translate-x-4
                    opacity-0
                  `
                  : `
                    visible
                    translate-x-0
                    opacity-100
                  `
              }
            `}
          >
            <DesktopSearchButton
              isOpen={
                desktopSearchOpen
              }
              onClick={
                toggleDesktopSearch
              }
            />
          </div>

          {/* =================================================
              DESKTOP NAV
          ================================================= */}

          <nav
            aria-label="Primary navigation"
            className={`
              pointer-events-auto
              absolute
              left-1/2
              z-[105]

              hidden
              -translate-x-1/2
              items-center
              whitespace-nowrap
              rounded-full

              transition-[top,background-color,box-shadow,padding]
              duration-500
              ease-[cubic-bezier(0.22,1,0.36,1)]

              min-[1180px]:flex

              ${
                scrolled
                  ? `
                    top-[18px]
                    bg-black/90
                    p-[6px]
                    shadow-[0_18px_55px_rgba(0,0,0,0.30)]
                    ring-1
                    ring-white/10

                    min-[1600px]:top-[21px]
                    min-[1600px]:p-[7px]
                  `
                  : `
                    top-[24px]
                    bg-black/85
                    p-[5px]
                    shadow-[0_16px_50px_rgba(0,0,0,0.24)]
                    ring-1
                    ring-white/[0.08]

                    min-[1360px]:p-[6px]

                    min-[1600px]:top-[27px]
                    min-[1600px]:p-[7px]
                  `
              }
            `}
          >

            {/* ===============================================
                FAVICON AFTER SCROLL
            =============================================== */}

            <div
              className={`
                overflow-hidden

                transition-[width,margin,opacity]
                duration-500
                ease-[cubic-bezier(0.22,1,0.36,1)]

                ${
                  scrolled
                    ? `
                      ml-0
                      mr-1
                      w-[42px]
                      opacity-100

                      min-[1360px]:w-[46px]

                      min-[1700px]:mr-2
                    `
                    : `
                      pointer-events-none
                      -mr-1
                      w-0
                      opacity-0
                    `
                }
              `}
            >
              <button
                type="button"
                aria-label="Go to Ultra Stones home page"
                onClick={
                  handleLogoClick
                }
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center

                  min-[1360px]:h-11
                  min-[1360px]:w-11
                "
              >
                <img
                  src="/favicon.svg"
                  alt="Ultra Stones"
                  width="30"
                  height="30"
                  draggable={
                    false
                  }
                  className="
                    block
                    h-[30px]
                    w-[30px]
                    shrink-0
                    object-contain

                    min-[1360px]:h-[32px]
                    min-[1360px]:w-[32px]
                  "
                />
              </button>
            </div>

            <Dropdown
              title="Ultra Experience"
              items={
                experience
              }
              activeDropdown={
                activeDropdown
              }
              dropdownKey="experience"
              openDropdown={
                openDropdown
              }
              closeDropdown={
                closeDropdown
              }
              navigate={
                handleNavigate
              }
            />

            <NavLink
              title="Online Inventory"
              onClick={
                openInventory
              }
            />

            <MegaMenu
              title="Material Portfolio"
              path="/categories"
              materials={
                materials
              }
              activeDropdown={
                activeDropdown
              }
              dropdownKey="materials"
              openDropdown={
                openDropdown
              }
              closeDropdown={
                closeDropdown
              }
              navigate={
                handleNavigate
              }
              scrolled={
                scrolled
              }
            />

            <Dropdown
              title="Resource Center"
              items={
                resources
              }
              activeDropdown={
                activeDropdown
              }
              dropdownKey="resources"
              openDropdown={
                openDropdown
              }
              closeDropdown={
                closeDropdown
              }
              navigate={
                handleNavigate
              }
            />

            <Dropdown
              title="Locations"
              items={
                locations
              }
              activeDropdown={
                activeDropdown
              }
              dropdownKey="locations"
              openDropdown={
                openDropdown
              }
              closeDropdown={
                closeDropdown
              }
              navigate={
                handleNavigate
              }
            />

            <NavLink
              title="Contact"
              onClick={() =>
                handleNavigate(
                  "/contact",
                )
              }
            />

            {/* ===============================================
                SEARCH AFTER SCROLL
            =============================================== */}

            <div
              className={`
                flex
                items-center
                overflow-hidden

                transition-[max-width,margin,opacity]
                duration-500
                ease-[cubic-bezier(0.22,1,0.36,1)]

                ${
                  scrolled
                    ? `
                      ml-[2px]
                      max-w-[190px]
                      opacity-100

                      min-[1440px]:ml-1
                    `
                    : `
                      pointer-events-none
                      ml-0
                      max-w-0
                      opacity-0
                    `
                }
              `}
            >
              <span
                className="
                  mx-[2px]
                  h-6
                  w-px
                  shrink-0
                  bg-white/15

                  min-[1440px]:mx-1
                  min-[1440px]:h-7
                "
              />

              <DesktopSearchButton
                compact
                isOpen={
                  desktopSearchOpen
                }
                onClick={
                  toggleDesktopSearch
                }
              />
            </div>
          </nav>

          {/* =================================================
              MOBILE BUTTON
          ================================================= */}

          <button
            type="button"
            aria-label={
              mobileMenu
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={
              mobileMenu
            }
            className={`
              pointer-events-auto
              absolute
              right-4
              top-[23px]
              z-[110]

              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full

              transition-colors
              duration-300

              sm:right-6
              sm:top-[28px]

              lg:right-7

              min-[1180px]:hidden

              ${
                mobileMenu
                  ? `
                    bg-white
                    text-black
                  `
                  : isLightNavbar
                    ? `
                      bg-black
                      text-white
                      shadow-lg
                    `
                    : `
                      bg-black/55
                      text-white
                      shadow-lg
                      ring-1
                      ring-white/15
                    `
              }
            `}
            onClick={() => {
              setDesktopSearchOpen(
                false,
              );

              setMobileMenu(
                (current) =>
                  !current,
              );

              setMobileDropdown(
                null,
              );
            }}
          >
            {mobileMenu ? (
              <X
                size={23}
                strokeWidth={
                  1.6
                }
              />
            ) : (
              <Menu
                size={23}
                strokeWidth={
                  1.6
                }
              />
            )}
          </button>
        </div>
      </header>

      {/* =====================================================
          DESKTOP SEARCH OVERLAY

          Mount only while open.
      ===================================================== */}

      {desktopSearchOpen && (
        <div
          className="
            fixed
            inset-0
            z-[90]
            hidden
            bg-black/65
            backdrop-blur-sm

            min-[1180px]:block
          "
          onMouseDown={(
            event,
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setDesktopSearchOpen(
                false,
              );
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search Ultra Stones"
            className="
              relative
              mx-auto
              mt-[96px]
              w-[min(760px,calc(100vw-40px))]
              overflow-visible
              rounded-[22px]
              border
              border-black/[0.06]
              bg-white
              px-5
              py-5
              text-black
              shadow-[0_30px_90px_rgba(0,0,0,0.28)]

              min-[1360px]:mt-[106px]
              min-[1360px]:rounded-[24px]
              min-[1360px]:px-7
              min-[1360px]:py-6

              min-[1600px]:mt-[112px]
            "
          >
            <div
              className="
                mb-5
                flex
                items-start
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
                  Search Ultra
                  Stones
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
                  Find your
                  perfect material
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
                  Search across
                  materials,
                  categories, and
                  product
                  collections.
                </p>
              </div>

              <button
                type="button"
                aria-label="Close search"
                onClick={() =>
                  setDesktopSearchOpen(
                    false,
                  )
                }
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-black/[0.08]
                  bg-black/[0.04]
                  text-black

                  transition-colors
                  duration-300

                  hover:border-black
                  hover:bg-black
                  hover:text-white
                "
              >
                <X
                  size={
                    18
                  }
                  strokeWidth={
                    1.7
                  }
                />
              </button>
            </div>

            <div
              className="
                relative
                w-full

                [&>div]:!w-full
                [&>div]:!max-w-none
              "
            >
              <GlobalSearch
                materials={
                  materials
                }
                isLightNavbar
                expanded
                desktopModal
                onResultClick={() => {
                  setDesktopSearchOpen(
                    false,
                  );
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          MOBILE / TABLET MENU

          IMPORTANT:
          This element DOES NOT EXIST while menu is closed.
          Prevents invisible fixed overlay issues on Safari.
      ===================================================== */}

      {mobileMenu && (
        <div
          className="
            fixed
            inset-0
            z-[95]
            h-[100dvh]
            w-full
            overflow-y-auto
            overscroll-contain
            bg-[#050b18]
            pt-[96px]
            text-white

            sm:pt-[108px]

            min-[1180px]:hidden
          "
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

            {/* SEARCH */}

            <div
              className="
                mb-[clamp(24px,5vw,40px)]
              "
            >
              <GlobalSearch
                materials={
                  materials
                }
                mobile
                onResultClick={
                  closeMobileMenu
                }
              />
            </div>

            {/* EXPERIENCE */}

            <MobileDropdown
              title="Ultra Experience"
              dropdownKey="experience"
              activeDropdown={
                mobileDropdown
              }
              setActiveDropdown={
                setMobileDropdown
              }
              items={
                experience
              }
              navigate={
                handleNavigate
              }
              closeMobileMenu={
                closeMobileMenu
              }
            />

            {/* INVENTORY */}

            <MobileNavButton
              title="Online Inventory"
              onClick={
                openInventory
              }
            />

            {/* MATERIAL PORTFOLIO */}

            <div className="border-b border-white/10">
              <div className="flex w-full items-stretch">

                <button
                  type="button"
                  onClick={() =>
                    handleNavigate(
                      "/categories",
                    )
                  }
                  className="
                    flex
                    flex-1
                    items-center
                    py-[clamp(17px,3vw,22px)]
                    text-left
                    text-[clamp(12px,2vw,14px)]
                    font-medium
                    uppercase
                    leading-[1.4]
                    tracking-[clamp(1.3px,0.25vw,2px)]
                    text-white

                    transition-colors
                    duration-300

                    hover:text-white/75
                  "
                >
                  Material
                  Portfolio
                </button>

                <button
                  type="button"
                  aria-label="Toggle Material Portfolio menu"
                  aria-expanded={
                    mobileDropdown ===
                    "materials"
                  }
                  onClick={() => {
                    setMobileDropdown(
                      (current) =>
                        current ===
                        "materials"
                          ? null
                          : "materials",
                    );
                  }}
                  className="
                    flex
                    w-12
                    shrink-0
                    items-center
                    justify-end
                    py-[clamp(17px,3vw,22px)]
                    text-white
                  "
                >
                  <ChevronDown
                    size={
                      18
                    }
                    className={`
                      shrink-0
                      transition-transform
                      duration-300

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
                  transition-[grid-template-rows,opacity]
                  duration-300

                  ${
                    mobileDropdown ===
                    "materials"
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
                      grid
                      grid-cols-1
                      gap-x-8
                      gap-y-[clamp(14px,2.5vw,20px)]
                      pb-[clamp(20px,4vw,28px)]
                      pl-2

                      sm:grid-cols-2
                    "
                  >
                    {mobileParentMaterials.map(
                      (
                        item,
                      ) => (
                        <button
                          type="button"
                          key={
                            item.id
                          }
                          onClick={() =>
                            handleNavigate(
                              `/product-category/${item.slug}`,
                            )
                          }
                          className="
                            block
                            w-full
                            text-left
                            text-[clamp(14px,2vw,16px)]
                            leading-[1.45]
                            text-white/70

                            transition-colors
                            duration-300

                            hover:text-white
                          "
                        >
                          {
                            item.name
                          }
                        </button>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* RESOURCES */}

            <MobileDropdown
              title="Resource Center"
              dropdownKey="resources"
              activeDropdown={
                mobileDropdown
              }
              setActiveDropdown={
                setMobileDropdown
              }
              items={
                resources
              }
              navigate={
                handleNavigate
              }
              closeMobileMenu={
                closeMobileMenu
              }
            />

            {/* LOCATIONS */}

            <MobileDropdown
              title="Locations"
              dropdownKey="locations"
              activeDropdown={
                mobileDropdown
              }
              setActiveDropdown={
                setMobileDropdown
              }
              items={
                locations
              }
              navigate={
                handleNavigate
              }
              closeMobileMenu={
                closeMobileMenu
              }
            />

            {/* CONTACT */}

            <MobileNavButton
              title="Contact"
              onClick={() =>
                handleNavigate(
                  "/contact",
                )
              }
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;

/* =========================================================
   DESKTOP SEARCH BUTTON
========================================================= */

const DesktopSearchButton = ({
  isOpen,
  onClick,
  compact = false,
}) => {
  return (
    <button
      type="button"
      aria-label={
        isOpen
          ? "Close website search"
          : "Open website search"
      }
      aria-expanded={
        isOpen
      }
      onClick={
        onClick
      }
      className={`
        flex
        shrink-0
        items-center
        justify-center
        gap-2
        rounded-full
        font-semibold
        uppercase
        text-[#17130e]

        transition-[transform,background-color]
        duration-300

        hover:-translate-y-[1px]
        hover:bg-[#f0af63]

        ${
          compact
            ? `
              h-9
              px-3
              text-[9px]
              tracking-[0.55px]

              min-[1360px]:h-10
              min-[1360px]:px-4

              min-[1500px]:px-5
              min-[1500px]:text-[10px]

              min-[1700px]:px-6
              min-[1700px]:text-[11px]
            `
            : `
              h-11
              px-5
              text-[10px]
              tracking-[0.7px]
              shadow-[0_10px_30px_rgba(0,0,0,0.12)]

              min-[1500px]:h-12
              min-[1500px]:px-6

              min-[1700px]:text-[11px]
            `
        }

        ${
          isOpen
            ? "bg-[#f0af63]"
            : "bg-[#e8a556]"
        }
      `}
    >
      {isOpen ? (
        <X
          size={
            16
          }
          strokeWidth={
            1.8
          }
        />
      ) : (
        <Search
          size={
            16
          }
          strokeWidth={
            1.8
          }
        />
      )}

      <span>
        {isOpen
          ? "Close"
          : "Search"}
      </span>
    </button>
  );
};

/* =========================================================
   NAV LINK
========================================================= */

const NavLink = ({
  title,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
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

        transition-colors
        duration-300

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

/* =========================================================
   MOBILE NAV BUTTON
========================================================= */

const MobileNavButton = ({
  title,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className="
        w-full
        border-b
        border-white/10
        py-[clamp(17px,3vw,22px)]
        text-left
        text-[clamp(12px,2vw,14px)]
        font-medium
        uppercase
        leading-[1.4]
        tracking-[clamp(1.3px,0.25vw,2px)]
        text-white

        transition-colors
        duration-300

        hover:text-white/75
      "
    >
      {title}
    </button>
  );
};

/* =========================================================
   MOBILE DROPDOWN
========================================================= */

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
    activeDropdown ===
    dropdownKey;

  return (
    <div className="border-b border-white/10">
      <button
        type="button"
        aria-expanded={
          isOpen
        }
        onClick={() => {
          setActiveDropdown(
            isOpen
              ? null
              : dropdownKey,
          );
        }}
        className="
          flex
          w-full
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
        <span>
          {title}
        </span>

        <ChevronDown
          size={
            18
          }
          className={`
            shrink-0
            transition-transform
            duration-300

            ${
              isOpen
                ? "rotate-180"
                : ""
            }
          `}
        />
      </button>

      <div
        className={`
          grid

          transition-[grid-template-rows,opacity]
          duration-300

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
              grid
              grid-cols-1
              gap-x-8
              gap-y-[clamp(14px,2.5vw,20px)]
              pb-[clamp(20px,4vw,28px)]
              pl-2

              sm:grid-cols-2
            "
          >
            {items.map(
              (item) => (
                <button
                  type="button"
                  key={
                    item.path
                  }
                  onClick={() => {
                    navigate(
                      item.path,
                    );

                    closeMobileMenu();
                  }}
                  className="
                    block
                    w-full
                    text-left
                    text-[clamp(14px,2vw,16px)]
                    leading-[1.45]
                    text-white/70

                    transition-colors
                    duration-300

                    hover:text-white
                  "
                >
                  {
                    item.label
                  }
                </button>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   DESKTOP DROPDOWN
========================================================= */

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
    activeDropdown ===
    dropdownKey;

  return (
    <div
      className="relative shrink-0"
      onMouseEnter={() =>
        openDropdown(
          dropdownKey,
        )
      }
      onMouseLeave={
        closeDropdown
      }
    >
      <button
        type="button"
        aria-expanded={
          isActive
        }
        className={`
          flex
          items-center
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

          transition-colors
          duration-300

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
          size={
            12
          }
          strokeWidth={
            1.8
          }
          className={`
            transition-transform
            duration-300

            min-[1500px]:h-[13px]
            min-[1500px]:w-[13px]

            ${
              isActive
                ? "rotate-180"
                : ""
            }
          `}
        />
      </button>

      <div
        className={`
          absolute
          left-1/2
          top-[52px]
          z-[120]
          w-[270px]
          -translate-x-1/2
          rounded-[20px]
          border
          border-black/[0.06]
          bg-white
          p-3
          shadow-[0_26px_75px_rgba(0,0,0,0.18)]

          transition-[opacity,transform,visibility]
          duration-300

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
          {items.map(
            (item) => (
              <button
                type="button"
                key={
                  item.path
                }
                onClick={() =>
                  navigate(
                    item.path,
                  )
                }
                className="
                  group
                  flex
                  w-full
                  items-center
                  justify-between
                  rounded-xl
                  px-4
                  py-3
                  text-left

                  transition-colors
                  duration-300

                  hover:bg-[#f3f4f2]

                  min-[1500px]:py-3.5
                "
              >
                <span
                  className="
                    text-[13px]
                    text-[#5d5d5d]

                    transition-colors
                    duration-300

                    group-hover:text-black

                    min-[1500px]:text-[14px]
                  "
                >
                  {
                    item.label
                  }
                </span>

                <span
                  className="
                    -translate-x-2
                    text-black
                    opacity-0

                    transition-[transform,opacity]
                    duration-300

                    group-hover:translate-x-0
                    group-hover:opacity-100
                  "
                >
                  →
                </span>
              </button>
            ),
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   MEGA MENU
========================================================= */

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
    activeDropdown ===
    dropdownKey;

  const [
    hoveredParent,
    setHoveredParent,
  ] = useState(null);

  /* =======================================================
     PARENT CATEGORIES
  ======================================================= */

  const parentCategories =
    useMemo(() => {
      return materials
        .filter(
          (item) =>
            item.parent_id ===
              null &&
            item.is_active,
        )
        .sort(
          alphabeticalSort,
        );
    }, [
      materials,
    ]);

  /* =======================================================
     ACTIVE PARENT
  ======================================================= */

  useEffect(() => {
    if (
      parentCategories.length ===
      0
    ) {
      setHoveredParent(
        null,
      );

      return;
    }

    const exists =
      parentCategories.some(
        (parent) =>
          parent.id ===
          hoveredParent,
      );

    if (
      !exists
    ) {
      setHoveredParent(
        parentCategories[0]
          .id,
      );
    }
  }, [
    parentCategories,
    hoveredParent,
  ]);

  const activeParent =
    parentCategories.find(
      (parent) =>
        parent.id ===
        hoveredParent,
    );

  /* =======================================================
     THUMBNAIL
  ======================================================= */

  const getThumbnailUrl =
    (
      url,
      width = 220,
      quality = 72,
    ) => {
      return getOptimizedImageUrl(
        url ||
          "/placeholder.jpg",

        width,

        quality,
      );
    };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className="relative shrink-0"
      onMouseEnter={() =>
        openDropdown(
          dropdownKey,
        )
      }
      onMouseLeave={
        closeDropdown
      }
    >
      <button
        type="button"
        aria-expanded={
          isActive
        }
        onClick={() => {
          if (
            path
          ) {
            navigate(
              path,
            );
          }
        }}
        className={`
          flex
          items-center
          gap-1
          whitespace-nowrap
          rounded-full
          px-[clamp(8px,0.72vw,15px)]
          py-[11px]
          text-[9px]
          font-medium
          uppercase
          tracking-[0.48px]
          text-white/90

          transition-colors
          duration-300

          hover:bg-white/10
          hover:text-white

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
          size={
            13
          }
          strokeWidth={
            1.8
          }
          className={`
            transition-transform
            duration-300

            ${
              isActive
                ? "rotate-180"
                : ""
            }
          `}
        />
      </button>

      <div
        className={`
          fixed
          left-1/2
          z-[120]
          w-[min(980px,calc(100vw-48px))]
          -translate-x-1/2
          rounded-[26px]
          border
          border-black/[0.06]
          bg-white
          p-6
          shadow-[0_32px_100px_rgba(0,0,0,0.23)]

          transition-[opacity,transform,visibility]
          duration-300

          ${
            scrolled
              ? "top-[76px]"
              : "top-[82px]"
          }

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
        <div
          className="
            grid
            h-[520px]
            grid-cols-[280px_minmax(0,1fr)]
            gap-6
          "
        >

          {/* =============================================
              PARENT LIST
          ============================================= */}

          <div
            className="
              scrollbar-thin
              h-full
              overflow-y-auto
              border-r
              border-black/10
              pr-4
            "
          >
            <div className="mb-4 px-2">
              <p
                className="
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[1.8px]
                  text-black/35
                "
              >
                Explore
                Materials
              </p>

              <h2
                className="
                  mt-2
                  text-[23px]
                  font-medium
                  tracking-[-0.7px]
                  text-black
                "
              >
                Material
                Portfolio
              </h2>
            </div>

            <div className="space-y-1">
              {parentCategories.map(
                (
                  parent,
                ) => {
                  const thumbnailUrl =
                    getThumbnailUrl(
                      parent.thumbnail_url,

                      280,

                      78,
                    );

                  const isSelected =
                    hoveredParent ===
                    parent.id;

                  return (
                    <button
                      type="button"
                      key={
                        parent.id
                      }
                      onMouseEnter={() => {
                        setHoveredParent(
                          parent.id,
                        );
                      }}
                      onFocus={() => {
                        setHoveredParent(
                          parent.id,
                        );
                      }}
                      onClick={() =>
                        navigate(
                          `/product-category/${parent.slug}`,
                        )
                      }
                      className={`
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-xl
                        px-2.5
                        py-2.5
                        text-left

                        transition-colors
                        duration-300

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
                          h-11
                          w-20
                          min-w-[80px]
                          shrink-0
                          overflow-hidden
                          rounded-lg
                          bg-black/5
                        "
                      >
                        <img
                          src={
                            thumbnailUrl
                          }
                          srcSet={`
                            ${getThumbnailUrl(
                              parent.thumbnail_url,
                              160,
                              72,
                            )} 160w,

                            ${getThumbnailUrl(
                              parent.thumbnail_url,
                              240,
                              76,
                            )} 240w,

                            ${getThumbnailUrl(
                              parent.thumbnail_url,
                              320,
                              80,
                            )} 320w
                          `}
                          sizes="80px"
                          alt={
                            parent.name
                          }
                          loading="lazy"
                          decoding="async"
                          draggable={
                            false
                          }
                          className="
                            h-full
                            w-full
                            object-cover
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
                              : `
                                text-[#666]
                              `
                          }
                        `}
                      >
                        {
                          parent.name
                        }
                      </span>
                    </button>
                  );
                },
              )}
            </div>
          </div>

          {/* =============================================
              ACTIVE CATEGORY
          ============================================= */}

          <div className="min-w-0">
            {activeParent && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/product-category/${activeParent.slug}`,
                    )
                  }
                  className="
                    group
                    relative
                    block
                    h-[385px]
                    w-full
                    overflow-hidden
                    rounded-[20px]
                    bg-black/5
                    text-left
                  "
                >
                  <img
                    key={
                      activeParent.id
                    }
                    src={getThumbnailUrl(
                      activeParent.thumbnail_url,

                      1200,

                      82,
                    )}
                    srcSet={`
                      ${getThumbnailUrl(
                        activeParent.thumbnail_url,
                        700,
                        76,
                      )} 700w,

                      ${getThumbnailUrl(
                        activeParent.thumbnail_url,
                        1000,
                        80,
                      )} 1000w,

                      ${getThumbnailUrl(
                        activeParent.thumbnail_url,
                        1400,
                        84,
                      )} 1400w
                    `}
                    sizes="650px"
                    alt={
                      activeParent.name
                    }
                    loading="eager"
                    decoding="async"
                    draggable={
                      false
                    }
                    className="
                      h-full
                      w-full
                      object-cover

                      transition-transform
                      duration-[900ms]
                      ease-out

                      group-hover:scale-[1.03]
                    "
                  />

                  <div
                    className="
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/75
                      via-black/5
                      to-transparent
                    "
                  />

                  <div
                    className="
                      absolute
                      inset-x-0
                      bottom-0
                      p-6
                    "
                  >
                    <p
                      className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[1.8px]
                        text-white/60
                      "
                    >
                      Featured
                      Material
                    </p>

                    <h3
                      className="
                        mt-2
                        text-[34px]
                        font-medium
                        tracking-[-1.2px]
                        text-white
                      "
                    >
                      {
                        activeParent.name
                      }
                    </h3>
                  </div>
                </button>

                <div
                  className="
                    mt-4
                    flex
                    items-start
                    justify-between
                    gap-6
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
                        `/product-category/${activeParent.slug}`,
                      )
                    }
                    className="
                      shrink-0
                      text-[11px]
                      font-semibold
                      uppercase
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
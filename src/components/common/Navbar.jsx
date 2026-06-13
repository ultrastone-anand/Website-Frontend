import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import axios from "axios";

import {
  ChevronDown,
  Menu,
  Search,
  X,
} from "lucide-react";


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

  const [materials, setMaterials] = useState(
    [],
  );
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  const dropdownTimeout = useRef(null);

  const useDarkNavbar = scrolled || !isHomePage;

  // ================= FETCH CATEGORIES =================

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/stones`,
        );

        const result = response.data;

        if (result.success) {
          const activeCategories =
            result.data.filter(
              (item) =>
                item.is_active === true,
            );

          setMaterials(activeCategories);
        }
      } catch (error) {
        console.error(
          "Error fetching materials:",
          error,
        );
      }
    };

    fetchMaterials();
  }, []);

  // ================= DROPDOWN =================

  const openDropdown = (menu) => {
    clearTimeout(dropdownTimeout.current);

    setActiveDropdown(menu);
  };

  const closeDropdown = () => {
    dropdownTimeout.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 120);
  };

  // ================= STATIC DATA =================

  const experience = [
    {
      label: "About Us",
      path: "/aboutus",
    },
    {
      label: "Showrooms",
      path: "/showrooms",
    },
    {
      label: "The Slab Pavilion",
      path: "/slab-pavilion",
    },
    {
      label: "Our Process",
      path: "/ourprocess",
    },
  ];

  const resources = [
    {
      label: "Resource Library",
      path: "/resource-library",
    },
    {
      label: "Merchandising Displays",
      path: "/merchandising-displays",
    },
    {
      label: "Silica Safety First",
      path: "/silica-safety-first",
    },
    {
      label: "Videos",
      path: "/videos",
    },
    {
      label: "Our Blogs",
      path: "/blogs",
    },
    {
      label: "CEU",
      path: "/ceu",
    },
    {
      label: "Career",
      path: "/career",
    },
  ];

  return (
    <header
      className={`
    fixed
    top-0
    left-0
    w-full
    z-50
    transition-all
    duration-500
    ${scrolled
          ? `
          bg-white/75
          backdrop-blur-md
          shadow-md
        `
          : `
          bg-transparent
        `
        }
  `}
    >
      <div
        className="
        max-w-[1850px]
        mx-auto
        px-6
        xl:px-10
        "
      >
        <div
          className="
          h-[88px]
          flex
          items-center
          justify-between
          gap-8
          "
        >
          {/* LOGO */}

          <div
            className="shrink-0 cursor-pointer"
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });

              navigate("/");
            }}
          >
            <div className="relative h-[64px] w-[220px]">

              {/* WHITE LOGO */}
              <img
                src="/logo_white.png"
                alt="Ultra Stones"
                className={`
absolute inset-0 h-full w-auto object-contain
transition-all duration-500 ease-in-out
${useDarkNavbar ? "opacity-0" : "opacity-100"}
`}
              />

              {/* DARK LOGO */}
              <img
                src="/logo1.svg"
                alt="Ultra Stones"
                className={`
absolute inset-0 h-full w-auto object-contain
transition-all duration-500 ease-in-out
${useDarkNavbar ? "opacity-100" : "opacity-0"}
`}
              />
            </div>
          </div>



          {/* DESKTOP MENU */}

          <nav
            className="
            hidden
            xl:flex
            items-center
            gap-10
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
              scrolled={useDarkNavbar}
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
              scrolled={useDarkNavbar}
            />

            <Dropdown
              title="Resource Center"
              items={resources}
              activeDropdown={activeDropdown}
              dropdownKey="resources"
              openDropdown={openDropdown}
              closeDropdown={closeDropdown}
              navigate={navigate}
              scrolled={useDarkNavbar}
            />

            <NavLink
              title="Location"
              onClick={() => navigate("/locations")}
              scrolled={useDarkNavbar}
            />

            <NavLink
              title="Contact"
              onClick={() => navigate("/contacts")}
              scrolled={useDarkNavbar}
            />

            {/* SEARCH */}

            <div
              className="
    hidden
    lg:flex
    flex-1
    max-w-[320px]
    relative
  "
            >
              <input
                type="text"
                placeholder="Search Material"
                className={`
      w-full
      h-[34px]
      rounded-md
      px-4
      pr-10
      text-[12px]
      outline-none
      transition-all
      duration-300
      ${useDarkNavbar
                    ? `
            bg-[#f5f5f5]
            border
            border-gray-300
            text-black
            placeholder:text-gray-500
          `
                    : `
            bg-white/10
            border
            border-white/30
            text-white
            placeholder:text-white/70
          `
                  }
    `}
              />

              <button
                className="
      absolute
      right-3
      top-1/2
      -translate-y-1/2
    "
              >
                <Search
                  size={14}
                  color={
                    scrolled
                      ? "#555"
                      : "#fff"
                  }
                />
              </button>
            </div>

          </nav>

          {/* MOBILE TOGGLE */}

          <button
            className={`
    xl:hidden
    transition-all
    duration-300
    z-[60]
    ${useDarkNavbar
                ? "text-black"
                : "text-white"
              }
  `}
            onClick={() =>
              setMobileMenu(!mobileMenu)
            }
          >
            {mobileMenu ? (
              <X size={24} strokeWidth={1.5} />
            ) : (
              <Menu size={24} strokeWidth={1.5} />
            )}
          </button>

          {/* MOBILE MENU */}

          <div
            className={`
    xl:hidden
    fixed
    top-[88px]
    left-0
    w-full
    h-[calc(100vh-88px)]
    bg-white/75
    backdrop-blur-md
    text-black
    z-50
    overflow-y-auto
    transition-all
    duration-500
    ${mobileMenu
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0 pointer-events-none"
              }
  `}
          >
            <div className="px-6 py-8">

              {/* SEARCH */}

              <div className="mb-8" >
                <div className="relative" bord>
                  <input
                    type="text"
                    placeholder="Search Material"
                    className="
            w-full
            h-[48px]
            bg-black/5
            border
            border-black/10
            rounded-md
            px-4
            pr-12
            text-sm
            outline-none
            placeholder:text-black/50
          "
                  />

                  <Search
                    size={18}
                    className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-black/50
          "
                  />
                </div>
              </div>

              {/* ULTRA EXPERIENCE */}

              <div className="border-b border-black/10">
                <button
                  onClick={() =>
                    setMobileDropdown(
                      mobileDropdown === "experience"
                        ? null
                        : "experience"
                    )
                  }
                  className="
          flex
          items-center
          justify-between
          w-full
          py-5
          uppercase
          tracking-[2px]
          text-[13px]
        "
                >
                  Ultra Experience

                  <ChevronDown
                    size={18}
                    className={`transition-transform ${mobileDropdown === "experience"
                      ? "rotate-180"
                      : ""
                      }`}
                  />
                </button>

                {mobileDropdown ===
                  "experience" && (
                    <div className="pb-5 pl-3 space-y-4">
                      {experience.map((item) => (
                        <button
                          key={item.path}
                          onClick={() => {
                            navigate(item.path);
                            setMobileMenu(false);
                          }}
                          className="
                block
                text-left
                text-black/70
                hover:text-black
                duration-300
              "
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
              </div>

              {/* MATERIAL PORTFOLIO */}

              <div className="border-b border-black/10">
                <button
                  onClick={() =>
                    setMobileDropdown(
                      mobileDropdown === "materials"
                        ? null
                        : "materials"
                    )
                  }
                  className="
          flex
          items-center
          justify-between
          w-full
          py-5
          uppercase
          tracking-[2px]
          text-[13px]
        "
                >
                  Material Portfolio

                  <ChevronDown
                    size={18}
                    className={`transition-transform ${mobileDropdown === "materials"
                      ? "rotate-180"
                      : ""
                      }`}
                  />
                </button>

                {mobileDropdown ===
                  "materials" && (
                    <div className="pb-5 pl-3 space-y-4">
                      {materials
                        .filter(
                          (item) =>
                            item.parent_id === null
                        )
                        .map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              navigate(
                                `/product-category/${item.slug}`
                              );
                              setMobileMenu(false);
                            }}
                            className="
                  block
                  text-left
                  text-black/70
                  hover:text-black
                  duration-300
                "
                          >
                            {item.name}
                          </button>
                        ))}
                    </div>
                  )}
              </div>

              {/* RESOURCE CENTER */}

              <div className="border-b border-black/10">
                <button
                  onClick={() =>
                    setMobileDropdown(
                      mobileDropdown === "resources"
                        ? null
                        : "resources"
                    )
                  }
                  className="
          flex
          items-center
          justify-between
          w-full
          py-5
          uppercase
          tracking-[2px]
          text-[13px]
        "
                >
                  Resource Center

                  <ChevronDown
                    size={18}
                    className={`transition-transform ${mobileDropdown === "resources"
                      ? "rotate-180"
                      : ""
                      }`}
                  />
                </button>

                {mobileDropdown ===
                  "resources" && (
                    <div className="pb-5 pl-3 space-y-4">
                      {resources.map((item) => (
                        <button
                          key={item.path}
                          onClick={() => {
                            navigate(item.path);
                            setMobileMenu(false);
                          }}
                          className="
                block
                text-left
                text-black/70
                hover:text-black
                duration-300
              "
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
              </div>

              {/* DIRECT LINKS */}

              <button
                onClick={() => {
                  navigate("/locations");
                  setMobileMenu(false);
                }}
                className="
        w-full
        text-left
        py-5
        uppercase
        tracking-[2px]
        text-[13px]
        border-b
        border-black/10
      "
              >
                Locations
              </button>

              <button
                onClick={() => {
                  navigate("/contacts");
                  setMobileMenu(false);
                }}
                className="
        w-full
        text-left
        py-5
        uppercase
        tracking-[2px]
        text-[13px]
      "
              >
                Contact
              </button>

            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

// ================= NAV LINK =================

const NavLink = ({
  title,
  onClick,
  scrolled,
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative
        text-[11px]
        uppercase
        tracking-[1px]
        duration-300
        ${scrolled
          ? "text-[#555] hover:text-black"
          : "text-white hover:text-white"
        }
      `}
    >
      {title}
    </button>
  );
};

// ================= NORMAL DROPDOWN =================

const Dropdown = ({
  title,
  items,
  activeDropdown,
  dropdownKey,
  openDropdown,
  closeDropdown,
  navigate,
  scrolled,
}) => {
  const isActive =
    activeDropdown === dropdownKey;

  return (
    <div
      className="relative"
      onMouseEnter={() =>
        openDropdown(dropdownKey)
      }
      onMouseLeave={closeDropdown}
    >
      <button
        className={`
    flex
    items-center
    gap-1
    text-[11px]
    uppercase
    tracking-[1px]
    duration-300
    ${scrolled
            ? "text-[#555]"
            : "text-white"
          }
  `}
      >
        {title}

      </button>

      {/* DROPDOWN */}

      <div
        className={`
        absolute
        top-[45px]
        left-0
        w-[240px]
        bg-white
        border
        border-black/5
        shadow-[0_15px_40px_rgba(0,0,0,0.08)]
        p-6
        duration-300
        ${isActive
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible translate-y-3"
          }
        `}
      >
        <div className="space-y-4">


          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => item.path && navigate(item.path)}
              className="
      block
      text-left
      text-[14px]
      text-[#666]
      hover:text-black
      duration-300
    "
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ================= MEGA MENU =================

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

  // ================= PARENT CATEGORIES =================

  const parentCategories = materials
    .filter(
      (item) =>
        item.parent_id === null &&
        item.is_active
    )
    .sort(
      (a, b) =>
        a.display_order -
        b.display_order
    );

  // ================= DEFAULT ACTIVE =================

  useEffect(() => {
    if (
      parentCategories.length > 0 &&
      !hoveredParent
    ) {
      setHoveredParent(
        parentCategories[0].id
      );
    }
  }, [parentCategories, hoveredParent]);

  const activeParent =
    parentCategories.find(
      (parent) =>
        parent.id === hoveredParent
    );

  const children = materials
    .filter(
      (item) =>
        item.parent_id === hoveredParent
    )
    .sort(
      (a, b) =>
        a.display_order -
        b.display_order
    );

  return (
    <div
      className="relative"
      onMouseEnter={() =>
        openDropdown(dropdownKey)
      }
      onMouseLeave={closeDropdown}
    >
      {/* NAV ITEM */}

      <button
        onClick={() =>
          path && navigate(path)
        }
        className={`
          flex
          items-center
          gap-1
          text-[11px]
          uppercase
          tracking-[1px]
          duration-300
          ${scrolled
            ? "text-[#555]"
            : "text-white"
          }
        `}
      >
        {title}
      </button>

      {/* MEGA MENU */}

      <div
        className={`
          absolute
          top-[48px]
          left-[-250px]
          w-[980px]
          bg-white
          shadow-[0_25px_80px_rgba(0,0,0,0.12)]
          border
          border-black/5
          rounded-2xl
          p-8
          duration-300
          z-50
          ${isActive
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible translate-y-4"
          }
        `}
      >
        <div
          className="
  grid
  grid-cols-[320px_1fr]
  gap-8
  h-[600px]
"
        >
          {/* =====================================
              LEFT SIDE
          ===================================== */}

          <div
            className="
            border-r
            border-black/10
            pr-5
            wid
            h-full
            overflow-y-auto
            scrollbar-thin
          "
          >
            <div className="space-y-2">
              {parentCategories.map(
                (parent) => (
                  <button
                    key={parent.id}
                    onMouseEnter={() =>
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
                      flex
                      items-center
                      gap-3
                      w-full
                      p-3
                      width-200
                      rounded-xl
                      duration-300
                      ${hoveredParent ===
                        parent.id
                        ? "bg-[#f5f5f5] shadow-sm"
                        : "hover:bg-[#f8f8f8]"
                      }
                    `}
                  >
                    <img
                      src={
                        parent.thumbnail_url ||
                        "/placeholder.jpg"
                      }
                      alt={parent.name}
                      className="
                        w-12
                        h-12
                        rounded-lg
                        object-cover
                      "
                    />

                    <span
                      className={`
                        text-[14px]
                        ${hoveredParent ===
                          parent.id
                          ? "font-semibold text-black"
                          : "text-[#666]"
                        }
                      `}
                    >
                      {parent.name}
                    </span>
                  </button>
                )
              )}
            </div>
          </div>

          {/* =====================================
              CENTER IMAGE
          ===================================== */}

          <div>
            {activeParent && (
              <>
                <div
                  className="
                    overflow-hidden
                    rounded-2xl
                    bg-[#f5f5f5]
                  "
                >
                  <img
                    src={
                      activeParent.thumbnail_url ||
                      "/placeholder.jpg"
                    }
                    alt={activeParent.name}
                    className="
                      w-full
                      h-[280px]
                      object-cover
                      hover:scale-105
                      duration-500
                    "
                  />
                </div>

                <h3
                  className="
                    mt-5
                    text-[22px]
                    font-semibold
                    text-black
                  "
                >
                  {activeParent.name}
                </h3>

                <p
                  className="
                    mt-2
                    text-[14px]
                    leading-relaxed
                    text-[#777]
                  "
                >
                  {activeParent.description ||
                    "Explore our premium collection."}
                </p>

                <button
                  onClick={() =>
                    navigate(
                      `/product-category/${activeParent.slug}`
                    )
                  }
                  className="
                    mt-5
                    text-[14px]
                    font-medium
                    hover:underline
                  "
                >
                  View All →
                </button>

                <div className="border-t pt-9">
                  <h3
                    className="
    text-sm
    font-semibold
    uppercase
    tracking-wider
    mb-4
  "
                  >
                    Collections
                  </h3>

                  <div className="grid grid-cols-3 gap-3">
                    {children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() =>
                          navigate(
                            `/product-category/${child.slug}`
                          )
                        }
                        className="
          text-left
          p-4
          rounded-xl
          bg-[#fafafa]
          hover:bg-[#f5f5f5]
        "
                      >
                        {child.name}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
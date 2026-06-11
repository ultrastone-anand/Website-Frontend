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
      path: "/our-process",
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
          bg-white/95
          backdrop-blur-md
          shadow-md
          border-b
          border-black/5
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
  onClick={() => navigate("/")}
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

          {/* MOBILE */}

          <button
            className={`
  xl:hidden
  transition-all
  duration-300
  ${
    scrolled
      ? "text-black"
      : "text-white"
  }
`}
            onClick={() =>
              setMobileMenu(!mobileMenu)
            }
          >
            {mobileMenu ? (
              <X strokeWidth={1.5} />
            ) : (
              <Menu strokeWidth={1.5} />
            )}
          </button>


          {/* MOBILE MENU */}

          {mobileMenu && (
            <div
              className="
      xl:hidden
      absolute
      top-[88px]
      left-0
      w-full
      bg-white
      z-50
      shadow-lg
      max-h-[calc(100vh-88px)]
      overflow-y-auto
    "
            >
              <div className="p-6">

                {/* Ultra Experience */}

                <div className="border-b pb-4 mb-4">
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
            justify-between
            w-full
            font-medium
          "
                  >
                    Ultra Experience
                    <ChevronDown size={18} />
                  </button>

                  {mobileDropdown === "experience" && (
                    <div className="mt-3 pl-4 space-y-3">
                      {experience.map((item) => (
                        <button
                          key={item}
                          className="block text-left"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Material Portfolio */}

                <div className="border-b pb-4 mb-4">
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
            justify-between
            w-full
            font-medium
          "
                  >
                    Material Portfolio
                    <ChevronDown size={18} />
                  </button>

                  {mobileDropdown === "materials" && (
                    <div className="mt-3 pl-4 space-y-3">
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
                            className="block text-left"
                          >
                            {item.name}
                          </button>
                        ))}
                    </div>
                  )}
                </div>

                {/* Resource Center */}

                <div className="border-b pb-4 mb-4">
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
            justify-between
            w-full
            font-medium
          "
                  >
                    Resource Center
                    <ChevronDown size={18} />
                  </button>

                  {mobileDropdown === "resources" && (
                    <div className="mt-3 pl-4 space-y-3">
                      {resources.map((item) => (
                        <button
                          key={item}
                          className="block text-left"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Locations */}

                <div className="border-b pb-4 mb-4">
                  <button
                    onClick={() =>
                      setMobileDropdown(
                        mobileDropdown === "locations"
                          ? null
                          : "locations"
                      )
                    }
                    className="
            flex
            justify-between
            w-full
            font-medium
          "
                  >
                    Locations
                    <ChevronDown size={18} />
                  </button>

                  {mobileDropdown === "locations" && (
                    <div className="mt-3 pl-4 space-y-3">
                      {locations.map((item) => (
                        <button
                          key={item}
                          className="block text-left"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button className="font-medium">
                  Contact
                </button>

              </div>
            </div>
          )}
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

  // ================= DEFAULT ACTIVE =================

  useEffect(() => {
    const parents = materials.filter(
      (item) => item.parent_id === null,
    );

    if (
      parents.length > 0 &&
      !hoveredParent
    ) {
      setHoveredParent(parents[0].id);
    }
  }, [materials, hoveredParent]);

  const parentCategories = materials
    .filter(
      (parent) =>
        parent.parent_id === null,
    )
    .sort(
      (a, b) =>
        a.display_order -
        b.display_order,
    );

  return (
    <div
      className="relative"
      onMouseEnter={() =>
        openDropdown(dropdownKey)
      }
      onMouseLeave={closeDropdown}
    >
      <button
        onClick={() => path && navigate(path)}
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
    left-[-140px]
    w-[620px]
    max-h-[75vh]
    overflow-y-auto
    bg-[#f5f5f5]
    border
    border-black/5
    shadow-[0_20px_60px_rgba(0,0,0,0.08)]
    p-7
    duration-300
    ${isActive
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible translate-y-3"
          }
  `}
      >
        <div
          className="
          grid
          grid-cols-[190px_1fr]
          gap-6
          "
        >
          {/* LEFT SIDE */}

          <div
            className="
            border-r
            border-black/10
            pr-5
            "
          >
            {parentCategories.map(
              (parent) => (
                <button
                  key={parent.id}
                  onMouseEnter={() =>
                    setHoveredParent(
                      parent.id,
                    )
                  }
                  onClick={() =>
                    navigate(
                      `/product-category/${parent.slug}`,
                    )
                  }
                  className={`
                  w-full
                  text-left
                  py-3
                  border-b
                  border-black/8
                  text-[15px]
                  duration-300
                  ${hoveredParent ===
                      parent.id
                      ? "text-black font-medium"
                      : "text-[#6f6f6f] hover:text-black"
                    }
                  `}
                >
                  {parent.name}
                </button>
              ),
            )}
          </div>

          {/* RIGHT SIDE */}

          <div className="pl-1">
            {parentCategories
              .filter(
                (parent) =>
                  parent.id ===
                  hoveredParent,
              )
              .map((parent) => {
                const children =
                  materials
                    .filter(
                      (child) =>
                        child.parent_id ===
                        parent.id,
                    )
                    .sort(
                      (a, b) =>
                        a.display_order -
                        b.display_order,
                    );

                return (
                  <div key={parent.id}>
                    <h3
                      className="
                      text-[15px]
                      font-semibold
                      uppercase
                      mb-5
                      "
                    >
                      {parent.name}
                    </h3>

                    {children.length >
                      0 ? (
                      <div className="space-y-4">
                        {children.map(
                          (child) => (
                            <button
                              key={child.id}
                              onClick={() =>
                                navigate(
                                  `/product-category/${child.slug}`,
                                )
                              }
                              className="
                              block
                              text-left
                              text-[15px]
                              text-[#666]
                              hover:text-black
                              duration-300
                              "
                            >
                              {child.name}
                            </button>
                          ),
                        )}
                      </div>
                    ) : (
                      <p
                        className="
                        text-[14px]
                        text-[#888]
                        "
                      >
                        No subcategories
                      </p>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
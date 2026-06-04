import { useEffect, useRef, useState } from "react";

import axios from "axios";

import {
  ChevronDown,
  Menu,
  Search,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const [activeDropdown, setActiveDropdown] =
    useState(null);

  const [materials, setMaterials] = useState(
    [],
  );

  const dropdownTimeout = useRef(null);

  // ================= FETCH CATEGORIES =================

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/stones",
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
    "About Us",
    "Showrooms",
    "The Slab Pavilion",
    "Our Process",
  ];

  const resources = [
    "Resource Library",
    "Merchandising Displays",
    "Silica Safety First",
    "Videos",
    "Our Blogs",
    "CEU",
    "Career",
  ];

  const locations = [
    "New York",
    "Philadelphia",
  ];

  return (
    <header
      className="
      fixed
      top-0
      left-0
      w-full
      z-50
      bg-[#f5f5f5]
      border-b
      border-black/5
      "
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
            className="
            shrink-0
            cursor-pointer
            "
            onClick={() => navigate("/")}
          >
            <img
              src="/logo1.svg"
              alt="Ultra Stones"
              className="
              h-[72px]
              w-auto
              object-contain
              "
            />
          </div>

          {/* SEARCH */}

          <div
            className="
            hidden
            lg:flex
            flex-1
            max-w-[600px]
            relative
            "
          >
            <input
              type="text"
              placeholder="Search Material"
              className="
              w-full
              h-[46px]
              rounded-full
              bg-[#d9d6d3]
              px-7
              pr-14
              text-[14px]
              text-[#3f3f3f]
              placeholder:text-[#8f8f8f]
              outline-none
              "
            />

            <button
              className="
              absolute
              right-5
              top-1/2
              -translate-y-1/2
              text-[#8d8d8d]
              "
            >
              <Search
                size={18}
                strokeWidth={1.7}
              />
            </button>
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
            />

            <MegaMenu
              title="Material Portfolio"
              materials={materials}
              activeDropdown={activeDropdown}
              dropdownKey="materials"
              openDropdown={openDropdown}
              closeDropdown={closeDropdown}
              navigate={navigate}
            />

            <Dropdown
              title="Resource Center"
              items={resources}
              activeDropdown={activeDropdown}
              dropdownKey="resources"
              openDropdown={openDropdown}
              closeDropdown={closeDropdown}
            />

            <Dropdown
              title="Locations"
              items={locations}
              activeDropdown={activeDropdown}
              dropdownKey="locations"
              openDropdown={openDropdown}
              closeDropdown={closeDropdown}
            />

            <NavLink title="Contact" />
          </nav>

          {/* MOBILE */}

          <button
            className="
            xl:hidden
            text-black
            "
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
        </div>
      </div>
    </header>
  );
};

export default Navbar;

// ================= NAV LINK =================

const NavLink = ({ title }) => {
  return (
    <button
      className="
      relative
      text-[12px]
      uppercase
      tracking-[2px]
      text-[#8b8b8b]
      hover:text-black
      duration-300
      after:absolute
      after:left-0
      after:-bottom-[8px]
      after:h-[1px]
      after:w-0
      after:bg-black
      after:duration-300
      hover:after:w-full
      "
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
        className="
        flex
        items-center
        gap-1
        text-[12px]
        uppercase
        tracking-[2px]
        text-[#8b8b8b]
        hover:text-black
        duration-300
        "
      >
        {title}

        <ChevronDown
          size={13}
          strokeWidth={1.5}
        />
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
        ${
          isActive
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible translate-y-3"
        }
        `}
      >
        <div className="space-y-4">
          {items.map((item, index) => (
            <button
              key={index}
              className="
              block
              text-left
              text-[14px]
              text-[#666]
              hover:text-black
              duration-300
              "
            >
              {item}
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
        className="
        flex
        items-center
        gap-1
        text-[12px]
        uppercase
        tracking-[2px]
        text-[#8b8b8b]
        hover:text-black
        duration-300
        "
      >
        {title}

        <ChevronDown
          size={13}
          strokeWidth={1.5}
        />
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
    ${
      isActive
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
                  ${
                    hoveredParent ===
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
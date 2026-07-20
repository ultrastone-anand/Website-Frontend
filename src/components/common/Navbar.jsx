import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

  const isTransparentNavbar = isHomePage && !scrolled;
  const isLightNavbar = !isHomePage && !scrolled;
  const isBlackNavbar = scrolled;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/stones`
        );

        const result = response.data;

        if (result.success) {
          setMaterials(result.data.filter((item) => item.is_active === true));
        }
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
    };

    fetchMaterials();
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

  const experience = [
    { label: "About Us", path: "/aboutus" },
    { label: "Our Process", path: "/ourprocess" },
  ];

  const resources = [
    { label: "Merchandising Displays", path: "/merchandising-displays" },
    { label: "Portfolio", path: "/gallery" },
    { label: "Our Blogs", path: "/blogs" },
    { label: "CEU", path: "/ceu" },
    { label: "Career", path: "/career" },
  ];

  const locations = [
    { label: "New York", path: "/locations/new-york" },
    { label: "Philadelphia", path: "/locations/philadelphia" },
  ];

  return (
    <header
      className={`
        fixed left-0 top-0 z-50 w-full pt-1 transition-all duration-500
        ${isBlackNavbar
          ? "bg-black/65 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
          : isLightNavbar
            ? "bg-white "
            : "bg-transparent"
        }
      `}
    >
      <div className="mx-auto max-w-[1850px] px-6 xl:px-10">
        <div className="flex h-[88px] items-center justify-between gap-8">
          {/* LOGO */}

          <div
            className="shrink-0 cursor-pointer"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              navigate("/");
            }}
          >
            <div className="relative h-[64px] w-[220px]">
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
          </div>

          {/* DESKTOP MENU */}

          <nav className="hidden items-center gap-10 xl:flex">
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
              onClick={() =>
                window.open(
                  "https://ultrastones.stoneprofitsweb.com/",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
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

            {/* SEARCH */}

<div className="hidden min-w-[260px] max-w-[320px] flex-1 lg:block">
  <GlobalSearch
    materials={materials}
    isLightNavbar={isLightNavbar}
  />
</div>
          </nav>

          {/* MOBILE TOGGLE */}

          <button
            className={`
              z-[60] transition-all duration-300 xl:hidden
              ${isLightNavbar ? "text-black" : "text-white"}
            `}
            onClick={() => setMobileMenu(!mobileMenu)}
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
              fixed left-0 top-[88px] z-50 h-[calc(100vh-88px)] w-full
              overflow-y-auto bg-[#050B18] text-white backdrop-blur-md
              transition-all duration-500 xl:hidden
              ${mobileMenu
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0 pointer-events-none"
              }
            `}
          >
            <div className="px-6 py-8">
<div className="mb-8">
  <GlobalSearch
    materials={materials}
    mobile
    onResultClick={() => {
      setMobileMenu(false);
      setMobileDropdown(null);
    }}
  />
</div>

              <MobileDropdown
                title="Ultra Experience"
                dropdownKey="experience"
                activeDropdown={mobileDropdown}
                setActiveDropdown={setMobileDropdown}
                items={experience}
                navigate={navigate}
                setMobileMenu={setMobileMenu}
              />

              <button
                type="button"
                onClick={() => {
                  window.open(
                    "https://ultrastones.stoneprofitsweb.com/",
                    "_blank",
                    "noopener,noreferrer"
                  );

                  setMobileMenu(false);
                }}
                className="
                          w-full border-b border-white/10 py-5 text-left
                          text-[13px] uppercase tracking-[2px] text-white
                        "
              >
                Online Inventory
              </button>

              <div className="border-b border-white/10">
                <div className="flex w-full items-stretch">
                  <button
                    type="button"
                    onClick={() => {
                      navigate("/categories");
                      setMobileMenu(false);
                      setMobileDropdown(null);
                    }}
                    className="
        flex flex-1 items-center py-5 text-left
        text-[13px] uppercase tracking-[2px] text-white
      "
                  >
                    Material Portfolio
                  </button>

                  <button
                    type="button"
                    aria-label="Toggle Material Portfolio menu"
                    aria-expanded={mobileDropdown === "materials"}
                    onClick={() =>
                      setMobileDropdown((current) =>
                        current === "materials" ? null : "materials"
                      )
                    }
                    className="
        flex w-10 shrink-0 items-center justify-end
        py-5 text-white
      "
                  >
                    <ChevronDown
                      size={18}
                      className={`
          transition-transform duration-300
          ${mobileDropdown === "materials" ? "rotate-180" : ""}
        `}
                    />
                  </button>
                </div>

                <div
                  className={`
      grid transition-all duration-300
      ${mobileDropdown === "materials"
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                    }
    `}
                >
                  <div className="overflow-hidden">
                    <div className="space-y-4 pb-5 pl-3">
                      {materials
                        .filter((item) => item.parent_id === null)
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
                              navigate(`/product-category/${item.slug}`);
                              setMobileMenu(false);
                              setMobileDropdown(null);
                            }}
                            className="
                block w-full text-left text-white/70
                duration-300 hover:text-white
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
                setMobileMenu={setMobileMenu}
              />

              <MobileDropdown
                title="Locations"
                dropdownKey="locations"
                activeDropdown={mobileDropdown}
                setActiveDropdown={setMobileDropdown}
                items={locations}
                navigate={navigate}
                setMobileMenu={setMobileMenu}
              />

              <button
                onClick={() => {
                  navigate("/contact");
                  setMobileMenu(false);
                }}
                className="w-full border-b border-white/10 py-5 text-left text-[13px] uppercase tracking-[2px] text-white"
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

const NavLink = ({ title, onClick, isLightNavbar }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative text-[11px] uppercase tracking-[1px] duration-300
        ${isLightNavbar
          ? "text-[#444] hover:text-black"
          : "text-white/85 hover:text-white"
        }
      `}
    >
      {title}
    </button>
  );
};

const MobileDropdown = ({
  title,
  dropdownKey,
  activeDropdown,
  setActiveDropdown,
  items,
  navigate,
  setMobileMenu,
}) => {
  return (
    <div className="border-b border-white/10">
      <button
        onClick={() =>
          setActiveDropdown(activeDropdown === dropdownKey ? null : dropdownKey)
        }
        className="flex w-full items-center justify-between py-5 text-[13px] uppercase tracking-[2px] text-white"
      >
        {title}
        <ChevronDown
          size={18}
          className={`transition-transform ${activeDropdown === dropdownKey ? "rotate-180" : ""
            }`}
        />
      </button>

      {activeDropdown === dropdownKey && (
        <div className="space-y-4 pb-5 pl-3">
          {items.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setMobileMenu(false);
              }}
              className="block text-left text-white/70 duration-300 hover:text-white"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

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
      className="relative"
      onMouseEnter={() => openDropdown(dropdownKey)}
      onMouseLeave={closeDropdown}
    >
      <button
        className={`
          flex items-center gap-1 text-[11px] uppercase tracking-[1px] duration-300
          ${isLightNavbar
            ? "text-[#444] hover:text-black"
            : "text-white/85 hover:text-white"
          }
        `}
      >
        {title}
      </button>

      <div
        className={`
          absolute left-0 top-[45px] z-50 w-[280px] rounded-2xl
          border border-black/5 bg-white p-5
          shadow-[0_20px_60px_rgba(0,0,0,0.12)] duration-300
          ${isActive
            ? "visible translate-y-0 opacity-100"
            : "invisible translate-y-3 opacity-0"
          }
        `}
      >
        <div className="space-y-2">
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => item.path && navigate(item.path)}
              className="
                group flex w-full items-center justify-between rounded-xl p-3
                text-left duration-300 hover:bg-[#f7f7f7]
              "
            >
              <span className="text-[14px] text-[#666] duration-300 group-hover:text-black">
                {item.label}
              </span>

              <span className="translate-x-[-8px] text-black opacity-0 duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                →
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

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

  const parentCategories = useMemo(
    () =>
      materials
        .filter(
          (item) =>
            item.parent_id === null &&
            item.is_active
        )
        .sort((a, b) => {
          const orderA =
            a.display_order ?? 999;

          const orderB =
            b.display_order ?? 999;

          return orderA - orderB;
        }),
    [materials]
  );

  useEffect(() => {
    if (
      parentCategories.length > 0 &&
      !hoveredParent
    ) {
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

  const children = useMemo(
    () =>
      materials
        .filter(
          (item) =>
            item.parent_id ===
            hoveredParent
        )
        .sort((a, b) => {
          const orderA =
            a.display_order ?? 999;

          const orderB =
            b.display_order ?? 999;

          return orderA - orderB;
        }),
    [materials, hoveredParent]
  );

  const getThumbnailUrl = (
    url,
    width = 220,
    quality = 68
  ) =>
    getOptimizedImageUrl(
      url || "/placeholder.jpg",
      width,
      quality
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
        type="button"
        onClick={() =>
          path && navigate(path)
        }
        className={`
          flex items-center gap-1 text-[11px] uppercase tracking-[1px] duration-300
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
          absolute left-[-250px] top-[48px] z-50 w-[980px] rounded-2xl
          border border-black/5 bg-white p-8
          shadow-[0_25px_80px_rgba(0,0,0,0.12)] duration-300
          ${
            isActive
              ? "visible translate-y-0 opacity-100"
              : "invisible translate-y-4 opacity-0"
          }
        `}
      >
        <div className="grid h-[600px] grid-cols-[320px_1fr] gap-8">
          <div className="h-full overflow-y-auto border-r border-black/10 pr-5 scrollbar-thin">
            <div className="space-y-2">
              {parentCategories.map(
                (parent) => {
                  const thumbnailUrl =
                    getThumbnailUrl(
                      parent.thumbnail_url,
                      240,
                      65
                    );

                  return (
                    <button
                      type="button"
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
                        flex w-full items-center gap-3 rounded-xl p-3 duration-300
                        ${
                          hoveredParent ===
                          parent.id
                            ? "bg-[#f5f5f5] shadow-sm"
                            : "hover:bg-[#fafafa]"
                        }
                      `}
                    >
                      <div className="h-12 w-24 min-w-[96px] flex-shrink-0 overflow-hidden rounded-lg bg-black/5">
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
                          text-[14px]
                          ${
                            hoveredParent ===
                            parent.id
                              ? "font-semibold text-black"
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

          <div>
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
                    className="h-[280px] w-full object-cover duration-500 hover:scale-105"
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
                  onClick={() =>
                    navigate(
                      `/product-category/${activeParent.slug}`
                    )
                  }
                  className="mt-5 text-[14px] font-medium text-black hover:underline"
                >
                  View All →
                </button>

                <div className="mt-8 border-t border-black/10 pt-7">
                  <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-black">
                    Collections
                  </h3>

                  <div className="grid grid-cols-3 gap-3">
                    {children.map(
                      (child) => (
                        <button
                          type="button"
                          key={child.id}
                          onClick={() =>
                            navigate(
                              `/product-category/${child.slug}`
                            )
                          }
                          className="
                            rounded-xl bg-black/[0.03] p-4 text-left text-black/65
                            duration-300 hover:bg-black/[0.07] hover:text-black
                          "
                        >
                          {child.name}
                        </button>
                      )
                    )}
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
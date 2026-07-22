// src/components/common/Footer.jsx

import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clock3, Mail, Phone } from "lucide-react";

import {
  FaFacebookF,
  FaHouzz,
  FaInstagram,
  FaPinterestP,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

import { getOptimizedImageUrl } from "../../utils/Mediahelper";

const EXPLORE_LINKS = [
  {
    label: "Browse Products",
    path: "/categories",
  },
  {
    label: "Inspiration Gallery",
    path: "/inspiration",
  },
];

const COMPANY_LINKS = [
  {
    label: "About Us",
    path: "/aboutus",
  },
  {
    label: "Our Process",
    path: "/ourprocess",
  },
  {
    label: "Blog",
    path: "/blogs",
  },
  {
    label: "Careers",
    path: "/career",
  },
  {
    label: "Privacy Policy",
    path: "/privacy-policy",
  },
];

const SHOWROOM_LINKS = [
  {
    label: "New York",
    path: "/locations/new-york",
  },
  {
    label: "Philadelphia",
    path: "/locations/philadelphia",
  },
];

const SOCIAL_ICONS = {
  youtube: FaYoutube,
  facebook: FaFacebookF,
  instagram: FaInstagram,
  twitter: FaXTwitter,
  x: FaXTwitter,
  pinterest: FaPinterestP,
  houzz: FaHouzz,
};

const Footer = () => {
  const navigate = useNavigate();

  const [socials, setSocials] = useState([]);
  const [showrooms, setShowrooms] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchFooterData = async () => {
      try {
        const [socialResponse, companyResponse] =
          await Promise.allSettled([
            axios.get(
              `${import.meta.env.VITE_API_URL}/company/socialmedia`
            ),
            axios.get(
              `${import.meta.env.VITE_API_URL}/company`
            ),
          ]);

        if (
          isMounted &&
          socialResponse.status === "fulfilled" &&
          socialResponse.value.data?.success
        ) {
          const socialData = Array.isArray(
            socialResponse.value.data.data
          )
            ? socialResponse.value.data.data
            : [];

          const activeSocials = socialData
            .filter((item) => item?.is_active)
            .sort(
              (firstItem, secondItem) =>
                Number(firstItem?.display_order || 0) -
                Number(secondItem?.display_order || 0)
            );

          setSocials(activeSocials);
        }

        if (
          isMounted &&
          companyResponse.status === "fulfilled" &&
          companyResponse.value.data?.success
        ) {
          const companyData = Array.isArray(
            companyResponse.value.data.data
          )
            ? companyResponse.value.data.data
            : [];

          setShowrooms(companyData);
        }
      } catch (error) {
        console.error("Unable to load footer data:", error);
      }
    };

    fetchFooterData();

    return () => {
      isMounted = false;
    };
  }, []);

  const office = showrooms?.[0];

  const phoneNumber =
    office?.primary_phone || "631-873-4747";

  const emailAddress = "info@ultrastones.com";  

  const weekdayHours =
    office?.business_hours_mon_fri ||
    "8:00 AM to 5:00 PM";

  const saturdayHours =
    office?.business_hours_saturday ||
    "9:00 AM to 1:00 PM";

  return (
    <footer className="relative isolate block w-full shrink-0 overflow-hidden bg-black text-white">
      {/* Background image */}
      <img
        src={getOptimizedImageUrl(
          "https://cdn.ultrastone.in/footer_main.png",
          1920,
          72
        )}
        srcSet={`
          ${getOptimizedImageUrl(
            "https://cdn.ultrastone.in/footer_main.png",
            768,
            68
          )} 768w,
          ${getOptimizedImageUrl(
            "https://cdn.ultrastone.in/footer_main.png",
            1280,
            70
          )} 1280w,
          ${getOptimizedImageUrl(
            "https://cdn.ultrastone.in/footer_main.png",
            1600,
            72
          )} 1600w,
          ${getOptimizedImageUrl(
            "https://cdn.ultrastone.in/footer_main.png",
            1920,
            72
          )} 1920w
        `}
        sizes="100vw"
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 -z-30 block h-full w-full object-cover object-center"
      />

      {/* Background overlays */}
      <div className="absolute inset-0 -z-20 bg-black/60" />

      <div className="absolute inset-0 -z-20 bg-gradient-to-r from-black/25 via-transparent to-black/20" />

      {/* Large Ultra Stones watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-[48px] -z-10 hidden overflow-hidden lg:block"
      >
        <p className="whitespace-nowrap text-center text-[clamp(110px,14vw,220px)] font-semibold leading-[0.7] tracking-[-0.065em] text-white/[0.055]">
          Ultra Stones
        </p>
      </div>

      {/* Footer content */}
      <div className="mx-auto w-full max-w-[1850px] px-6 pb-4 pt-8 sm:px-8 lg:px-10 lg:pb-5 lg:pt-10 xl:px-12 2xl:px-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1fr_0.82fr_1.35fr] lg:gap-0">
          {/* Logo and heading */}
          <div className="lg:border-r lg:border-white/15 lg:pr-8 xl:pr-10">
            <button
              type="button"
              onClick={() => navigate("/")}
              aria-label="Go to Ultra Stones homepage"
              className="block cursor-pointer border-0 bg-transparent p-0"
            >
              <img
                src="/logo_white.svg"
                alt="Ultra Stones"
                className="mb-8 block h-[68px] w-auto object-contain sm:h-[72px] lg:h-[70px]"
              />
            </button>

            <h2 className="max-w-[300px] font-serif text-[30px] uppercase leading-[1.1] tracking-[6px] text-white sm:text-[34px] lg:text-[31px] xl:text-[35px] xl:tracking-[7px]">
              Let&apos;s Create
              <br />
              Timeless
              <br />
              Spaces
            </h2>
          </div>

          {/* Company intro */}
          <div className="lg:border-r lg:border-white/15 lg:px-6 xl:px-8">
            <p className="mb-3 text-center text-[14px] font-medium leading-[1.5] text-white/90 xl:text-[16px]">
              500+ Premium Surfaces
            </p>

            <p className="mb-6 mx-auto max-w-[170px] text-center text-[12px] leading-[1.55] text-white/75 xl:text-[14px]">
  Premium natural stone and engineered
  surfaces for extraordinary projects.
</p>

            <FooterAction
              label="View Collection"
              onClick={() => navigate("/categories")}
            />

            <hr className="my-3 border-white/15" />

            <FooterAction
              label="Contact Us"
              onClick={() => navigate("/contact")}
            />
          </div>

          {/* Explore */}
          <FooterColumn
            title="Explore"
            links={EXPLORE_LINKS}
          />

          {/* Company */}
          <FooterColumn
            title="Company"
            links={COMPANY_LINKS}
          />

          {/* Showrooms */}
          <FooterColumn
            title="Showrooms"
            links={SHOWROOM_LINKS}
          />

          {/* Contact */}
<div className="text-center lg:pl-6 xl:pl-8">
  <h3 className="mb-4 text-[16px] font-semibold uppercase tracking-[1.4px] text-white">
    Get In Touch
  </h3>

  <div className="flex flex-col items-center">
    <ContactRow
      icon={<Phone size={11} />}
      text={phoneNumber}
      href={`tel:${phoneNumber.replace(/[^\d+]/g, "")}`}
    />

    <ContactRow
      icon={<Mail size={11} />}
      text={emailAddress}
      href={`mailto:${emailAddress}`}
    />

    <ContactRow
      icon={<Clock3 size={11} />}
      text={`Mon - Fri: ${weekdayHours}`}
    />

    <ContactRow
      icon={<Clock3 size={11} />}
      text={`Sat - ${saturdayHours}`}
    />
  </div>

  <div className="mt-5 flex justify-center gap-2">
    {socials.map((social) => {
      const platform =
        social?.platform?.toLowerCase().trim() || "";

      const Icon = SOCIAL_ICONS[platform];

      if (!Icon || !social?.url) return null;

      return (
        <a
          key={social.id || `${platform}-${social.url}`}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit Ultra Stones on ${social.platform}`}
          title={social.platform}
          className="inline-flex h-8 w-8 items-center justify-center text-white/85 transition-colors duration-200 hover:text-white"
        >
          <Icon size={18} aria-hidden="true" focusable="false" />
        </a>
      );
    })}
  </div>
</div>
        </div>

        {/* Bottom information */}
        <div className="mt-8 flex flex-col gap-3 border-t border-white/15 pt-4 text-[10px] leading-relaxed text-white/65 sm:text-[10px] md:flex-row md:items-center md:justify-between lg:mt-7">
          <p>
            Trusted by Architects • Interior Designers •
            Builders • Fabricators • Dealers • Homeowners
          </p>

          <p className="shrink-0">
            © {new Date().getFullYear()} Ultra Stones
            LLC. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

const FooterColumn = ({ title, links }) => {
  return (
    <div className="text-center lg:border-r lg:border-white/15 lg:px-6 xl:px-8">
      <h3 className="mb-2 text-[16px] font-semibold uppercase tracking-[1.4px] text-white">
        {title}
      </h3>

      <nav aria-label={`${title} footer navigation`}>
        <ul className="space-y-[3px]">
          {links.map((item) => (
            <li key={item.label}>
              <Link
                to={item.path}
                className="inline-block text-[13px] leading-[1.5] text-white/75 transition-colors duration-200 hover:text-white lg:text-[13px] xl:text-[14px]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
const FooterAction = ({ label, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-4 mx-auto flex items-center justify-center gap-2 border-0 bg-transparent p-0 text-[12px] font-medium uppercase tracking-[0.8px] text-white transition-colors duration-200 hover:text-white/70"
    >
      <span>{label}</span>

      <span
        aria-hidden="true"
        className="text-[#d9a441]"
      >
        →
      </span>
    </button>
  );
};

const ContactRow = ({ icon, text, href }) => {
  const content = (
    <>
      <span className="mt-[1px] shrink-0 text-white/80">
        {icon}
      </span>

      <span>{text}</span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="mb-[7px] flex items-start gap-2 text-[12px] leading-[1.4] text-white/75 transition-colors duration-200 hover:text-white xl:text-[14px]"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="mb-[7px] flex items-start gap-2 text-[12px] leading-[1.4] text-white/75 xl:text-[14px]">
      {content}
    </div>
  );
};

FooterColumn.propTypes = {
  title: PropTypes.string.isRequired,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })
  ).isRequired,
};

FooterAction.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

ContactRow.propTypes = {
  icon: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
  href: PropTypes.string,
};

ContactRow.defaultProps = {
  href: undefined,
};

export default Footer;
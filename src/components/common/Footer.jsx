// src/components/common/Footer.jsx

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Mail, Clock3 } from "lucide-react";

import {
  FaHouzz,
  FaYoutube,
  FaXTwitter,
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
} from "react-icons/fa6";

const Footer = () => {
  const navigate = useNavigate();

  const [socials, setSocials] = useState([]);
  const [showrooms, setShowrooms] = useState([]);

  const exploreLinks = [
    { label: "Browse Products", path: "/categories" },
    { label: "Featured Stones", path: "/products" },
    { label: "Applications", path: "/applications" },
    { label: "Inspiration Gallery", path: "/inspiration" },
  ];

  const companyLinks = [
    { label: "About Us", path: "/aboutus" },
    { label: "Our Story", path: "/ourprocess" },
    { label: "Resources", path: "/resource-library" },
    { label: "Care & Maintenance", path: "/care-maintenance" },
    { label: "Blog", path: "/blogs" },
    { label: "Career", path: "/career" },
  ];

  const showroomLinks = [
    { label: "New York", path: "/locations/new-york" },
    { label: "Philadelphia", path: "/locations/philadelphia" },
  ];

  const socialIcons = {
    youtube: FaYoutube,
    facebook: FaFacebookF,
    instagram: FaInstagram,
    twitter: FaXTwitter,
    x: FaXTwitter,
    pinterest: FaPinterestP,
    houzz: FaHouzz,
  };

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const [socialRes, companyRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/company/socialmedia`),
          axios.get(`${import.meta.env.VITE_API_URL}/company`),
        ]);

        if (socialRes.data.success) {
          setSocials(
            socialRes.data.data
              .filter((item) => item.is_active)
              .sort((a, b) => a.display_order - b.display_order)
          );
        }

        if (companyRes.data.success) {
          setShowrooms(companyRes.data.data || []);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchFooterData();
  }, []);

  const office = showrooms?.[0];

  return (
    <footer className="relative overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-[url('https://cdn.ultrastone.in/footer.png')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-black/70" />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <h2 className="select-none text-[80px] md:text-[150px] xl:text-[230px] font-semibold tracking-[-10px] text-white/[0.06] mt-24">
          Ultra Stones
        </h2>
      </div>

      <div className="relative z-10 mx-auto max-w-[1650px] px-6 py-8 xl:px-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-[0.95fr_0.8fr_0.85fr_0.85fr_0.65fr_1fr]">

          <div className="xl:border-r xl:border-white/15 xl:pr-10">
            <img
              src="/logo_white.svg"
              alt="Ultra Stones"
              onClick={() => navigate("/")}
              className="mb-7 h-[72px] w-auto object-contain -translate-x-5 cursor-pointer" />

            <h2 className="max-w-[320px] font-serif text-[32px] uppercase leading-[1.08] tracking-[7px] md:text-[38px]">
              Lets Create Timeless Spaces
            </h2>
          </div>

          <div className="xl:border-r xl:border-white/15 xl:px-8">
            <p className="mb-5 max-w-[170px] text-[12px] leading-[1.55] text-white/80">
              500+ Premium Surfaces
              <br />
              Premium natural stone and engineered surfaces for extraordinary projects.
            </p>

            <FooterAction label="View Collection" onClick={() => navigate("/categories")} />
            <FooterAction label="Contact Us" onClick={() => navigate("/contact")} />
          </div>

          <FooterColumn title="Explore" links={exploreLinks} />
          <FooterColumn title="Company" links={companyLinks} />
          <FooterColumn title="Showrooms" links={showroomLinks} />
          <div className="xl:pl-8">
  <h4 className="mb-4 text-[12px] font-semibold uppercase tracking-[1.5px]">
    Get In Touch
  </h4>

  <ContactRow
    icon={<Phone size={12} />}
    text={office?.primary_phone || "631-873-4747"}
  />

  <ContactRow
    icon={<Mail size={12} />}
    text={office?.email || "info@ultrastones.com"}
  />

  <ContactRow
    icon={<Clock3 size={12} />}
    text={`Mon - Fri ${
      office?.business_hours_mon_fri || "8:00 AM to 5:00 PM"
    }`}
  />

  <ContactRow
    icon={<Clock3 size={12} />}
    text={`Sat - ${
      office?.business_hours_saturday || "8:00 AM to 1:00 PM"
    }`}
  />

  <div className="mt-5 flex items-center gap-4">
    {socials.map((social) => {
      const Icon = socialIcons[social.platform?.toLowerCase()];
      if (!Icon) return null;

      return (
        <a
          key={social.id}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/85 transition hover:text-white"
        >
          <Icon size={15} />
        </a>
      );
    })}
  </div>
</div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/15 pt-4 text-[10px] text-white/70 md:flex-row md:items-center md:justify-between">
          <p>
            Trusted By Architects • Interior Designers • Builders • Fabricators • Dealers • Homeowners
          </p>

          <p>
            © {new Date().getFullYear()} Ultra Stones LLC. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

const FooterColumn = ({ title, links, noBorder }) => {
  const navigate = useNavigate();

  return (
    <div className={!noBorder ? "xl:border-r xl:border-white/15 xl:px-8" : ""}>
      <h4 className="mb-4 text-[12px] font-semibold uppercase tracking-[1.5px]">
        {title}
      </h4>

      <div className="space-y-1.5">
        {links.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className="block text-left text-[12px] leading-tight text-white/75 transition hover:text-white"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

const FooterAction = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="mb-3 block text-[10px] uppercase tracking-[1px] text-white transition hover:text-white/70"
    >
      {label} <span className="ml-1 text-[#d9a441]">→</span>
    </button>
  );
};

const ContactRow = ({ icon, text }) => {
  return (
    <div className="mb-2 flex items-start gap-2 text-[11px] leading-[1.35] text-white/75">
      <span className="mt-[2px] text-white/80">{icon}</span>
      <span>{text}</span>
    </div>
  );
};
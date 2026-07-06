// src/components/common/Footer.jsx

import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone, Clock3, Home, Building2 } from "lucide-react";

import {
  FaHouzz,
  FaYoutube,
  FaXTwitter,
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
} from "react-icons/fa6";
import { PiOfficeChairBold } from "react-icons/pi";



const Footer = () => {
  const [socials, setSocials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showrooms, setShowrooms] = useState([]);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  const navigate = useNavigate();

  const companyLinks = [
    { label: "About Us", path: "/aboutus" },
    { label: "The Experience", path: "/ourprocess" },
    { label: "Material Portfolio", path: "/categories" },
    { label: "CEU", path: "/ceu" },
    { label: "Blog", path: "/blogs" },
    { label: "Resource Library", path: "/resource-library" },
    { label: "Contact", path: "/contact" },
    // { label: "Privacy Policy", path: "/privacy-policy" },
  ];

  const fetchSocials = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/company/socialmedia`
      );

      if (response.data.success) {
        setSocials(
          response.data.data
            .filter((item) => item.is_active)
            .sort(
              (a, b) =>
                a.display_order - b.display_order
            )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchShowrooms = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/company`
      );

      if (response.data.success) {
        setShowrooms(response.data.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShowrooms();
    fetchSocials();
  }, []);

  const officeHours = showrooms?.[0];

  const socialIcons = {
    youtube: FaYoutube,
    facebook: FaFacebookF,
    instagram: FaInstagram,
    twitter: FaXTwitter,
    x: FaXTwitter,
    pinterest: FaPinterestP,
    houzz: FaHouzz,
  };


  const handleSubscribe = async () => {

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!newsletterEmail.trim()) {

      alert("Please enter email");

      return;

    }

    if (
      !emailRegex.test(
        newsletterEmail
      )
    ) {

      alert(
        "Please enter a valid email address"
      );

      return;

    }

    try {

      setNewsletterLoading(true);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/newsletter/subscribe`,
        {
          email: newsletterEmail
        }
      );

      alert(
        "Successfully subscribed"
      );

      setNewsletterEmail("");

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );

    } finally {

      setNewsletterLoading(false);

    }

  };

  return (
    <footer className="relative overflow-hidden text-white">
      {/* BACKGROUND IMAGE */}

      <div
        className="
  absolute
  inset-0
  bg-[url('/footer.jpg')]
  bg-cover
  bg-center
  "
      />

      {/* DARK OVERLAY */}

      <div className="absolute inset-0 bg-black/70" />

      {/* CONTENT */}

      <div
        className="
        relative
        z-10
        max-w-[1650px]
        mx-auto
        px-6
        xl:px-10
        py-10
        "
      >
        {/* TOP GRID */}

        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-8
          border-b
          border-white/10
          pb-8
          "
        >
          {/* COMPANY */}

          <div>
            <h3
              className="
              text-[20px]
              md:text-[22px]
              leading-none
              mb-5
              "
              style={{
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Company
            </h3>

            <div className="space-y-2">
              {companyLinks.map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className="
        block
        text-left
        text-[13px]
        text-white/80
        hover:text-white
        transition-all
        duration-300
      "
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {showrooms.map((showroom) => (
            <FooterLocation
              key={showroom.id}
              title={showroom.name}
              address={`${showroom.address}, ${showroom.state} ${showroom.zip_code}`}
              phone1={showroom.primary_phone}
              phone2={showroom.secondary_phone}
              fax={showroom.company_phone}
            />
          ))}

          {/* HOURS */}

          <div>
            <div className="flex items-center gap-3 mb-5">
              <Clock3 size={16} className="text-white" />

              <h3
                className="
                text-[20px]
                md:text-[22px]
                leading-none
                "
                style={{
                  fontFamily: "Montserrat, sans-serif",
                }}
              >
                Office Hours
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-[14px] font-medium text-white">
                  Monday-Friday
                </p>

                <p className="text-[13px] text-white/75">
                  {officeHours?.business_hours_mon_fri || "8:00 AM to 5:00 PM"}
                </p>

              </div>

              <div>
                <p className="text-[14px] font-medium text-white">
                  Saturday
                </p>


                <p className="text-[13px] text-white/75">
                  {officeHours?.business_hours_saturday || "9:00 AM to 1:00 PM"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}

        <div
          className="
          pt-6
          flex
          flex-col
          xl:flex-row
          items-center
          justify-between
          gap-6
          "
        >
          {/* LOGO */}

          <div className="flex items-center gap-5 cursor-pointer"
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });

              navigate("/");
            }}>
            <img
              src="/logo_white.png"
              alt="Ultra Stones"
              className="h-[64px] w-auto object-contain"
            />
          </div>

          {/* NEWSLETTER */}

          <div className="w-full max-w-[520px]">
            <h3
              className="
              text-center
              text-[22px]
              mb-4
              "
              style={{
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Get Updates
            </h3>

            <div className="flex">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) =>
                  setNewsletterEmail(
                    e.target.value
                  )
                }
                placeholder="Your Email Address"
                className="
                          flex-1
                          h-[42px]
                          bg-transparent
                          border
                          border-white/30
                          px-4
                          text-[13px]
                          text-white
                          placeholder:text-white/45
                          outline-none
                        "
              />

              <button
                onClick={handleSubscribe}
                disabled={newsletterLoading}
                className="
                            h-[42px]
                            px-5
                            border
                            border-l-0
                            border-white/30
                            text-[11px]
                            uppercase
                            tracking-[1px]
                            hover:bg-white
                            hover:text-black
                            transition-all
                            duration-300
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                          "
              >
                {newsletterLoading
                  ? "Signing Up..."
                  : "Sign Up"}
              </button>
            </div>
          </div>

          {/* SOCIALS */}

          {/* SOCIALS + COPYRIGHT */}

          <div className="flex flex-col items-center xl:items-end gap-3">
            <div className="flex items-center gap-2">
              {socials.map((social) => {
                const Icon =
                  socialIcons[
                  social.platform?.toLowerCase()
                  ];

                if (!Icon) return null;

                return (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SocialButton
                      icon={<Icon size={16} />}
                    />
                  </a>
                );
              })}
            </div>

            <p className="text-[12px] text-white/60 text-center xl:text-right">
              Copyright {new Date().getFullYear()} © ULTRA STONES.
              All Rights Reserved.
            </p>
          </div>


        </div>
      </div>
    </footer>
  );
};

export default Footer;

/* -------------------------------- */
/* LOCATION BLOCK */
/* -------------------------------- */

const FooterLocation = ({ title, address, phone1, phone2, fax }) => {
  return (
    <div>
      {/* TITLE */}

      <div className="flex items-center gap-3 mb-5">
        <MapPin size={16} className="text-white" />

        <h3
          className="
          text-[20px]
          md:text-[22px]
          leading-none
          "
          style={{
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          {title}
        </h3>
      </div>

      {/* CONTENT */}

      <div className="space-y-4">
        <InfoRow
  icon={<Home size={13} />}
  text={address}
  type="address"
/>

        <InfoRow
  icon={<Phone size={13} />}
  text={`${phone1}\n${phone2}`}
  type="phone"
/>

       <InfoRow
  icon={<Building2 size={13} />}
  text={fax}
  type="phone"
/>
      </div>
    </div>
  );
};

/* -------------------------------- */
/* INFO ROW */
/* -------------------------------- */

const InfoRow = ({ icon, text, type }) => {
  const renderContent = () => {
    if (!text) return null;

    if (type === "phone") {
      return text.split("\n").map((number, index) => (
        <a
          key={index}
          href={`tel:${number.replace(/\s+/g, "")}`}
          className="block hover:text-white transition-colors"
        >
          {number}
        </a>
      ));
    }

    if (type === "email") {
      return (
        <a
          href={`mailto:${text}`}
          className="hover:text-white transition-colors"
        >
          {text}
        </a>
      );
    }

    if (type === "address") {
      return (
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            text
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors"
        >
          {text}
        </a>
      );
    }

    return text;
  };

  return (
    <div className="flex gap-3">
      <div className="mt-1 text-white/80">{icon}</div>

      <div
        className="
          text-[13px]
          leading-[1.4]
          text-white/80
          whitespace-pre-line
        "
      >
        {renderContent()}
      </div>
    </div>
  );
};

/* -------------------------------- */
/* SOCIAL BUTTON */
/* -------------------------------- */

const SocialButton = ({ icon }) => {
  return (
    <button
      className="
      w-[30px]
      h-[30px]
      rounded-full
      border
      border-white/20
      flex
      items-center
      justify-center
      text-white/75
      hover:bg-white
      hover:text-black
      transition-all
      duration-300
      "
    >
      {icon}
    </button>
  );
};
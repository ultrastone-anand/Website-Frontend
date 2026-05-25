// src/components/common/Footer.jsx

import { MapPin, Phone, Clock3, Home } from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaPinterestP,
  FaXTwitter,
} from "react-icons/fa6";

const Footer = () => {
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
              {[
                "About Us",
                "The Experience",
                "Material Portfolio",
                "CEU",
                "Blog",
                "Resource Library",
                "Contact",
                "Privacy Policy",
              ].map((item) => (
                <button
                  key={item}
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
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* NEW YORK */}

          <FooterLocation
            title="New York Showroom"
            address="55 Central Drive, Farmingdale, NY 11735"
            phone1="631-873-4747"
            phone2="631-873-4748"
            fax="631-873-4749"
          />

          {/* PHILADELPHIA */}

          <FooterLocation
            title="Philadelphia Showroom"
            address="3907 Nebraska St, Levittown, PA 19056"
            phone1="215-647-3972"
            phone2="215-647-3974"
            fax="215-647-3977"
          />

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
                  8:00 AM to 5:00 PM
                </p>
              </div>

              <div>
                <p className="text-[14px] font-medium text-white">
                  Saturday
                </p>

                <p className="text-[13px] text-white/75">
                  9:00 AM to 1:00 PM
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

          <div className="flex items-center gap-5">
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
                "
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* SOCIALS */}

          <div className="flex items-center gap-2">
            <SocialButton icon={<FaYoutube size={16} />} />
            <SocialButton icon={<FaFacebookF size={16} />} />
            <SocialButton icon={<FaInstagram size={16} />} />
            <SocialButton icon={<FaPinterestP size={16} />} />
            <SocialButton icon={<FaXTwitter size={16} />} />
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
        <InfoRow icon={<Home size={13} />} text={address} />

        <InfoRow icon={<Phone size={13} />} text={`${phone1}\n${phone2}`} />

        <InfoRow icon={<Phone size={13} />} text={fax} />
      </div>
    </div>
  );
};

/* -------------------------------- */
/* INFO ROW */
/* -------------------------------- */

const InfoRow = ({ icon, text }) => {
  return (
    <div className="flex gap-3">
      <div className="mt-1 text-white/80">{icon}</div>

      <p
        className="
        text-[13px]
        leading-[1.4]
        text-white/80
        whitespace-pre-line
        "
      >
        {text}
      </p>
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
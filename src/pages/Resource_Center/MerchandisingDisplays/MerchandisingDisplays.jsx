import React from "react";
import Navbar from "../../../components/common/Navbar";
import Footer from "../../../components/common/Footer";
import { Link } from "react-router-dom";

const displays = [
  {
    id: 1,
    name: "Kaolin Display",
    size: '15"W x 10"H x 16.5"W',
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea7?w=800",
  },
  {
    id: 2,
    name: "Ultra Quartz Tower",
    size: '21"W x 70"H x 24"W',
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
  },
  {
    id: 3,
    name: "Semi Precious Stone",
    size: '16"W x 12"H x 28"W',
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800",
  },
  {
    id: 4,
    name: "Ultra Quartz Table Display",
    size: '26"W x 33"H x 14"W',
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
  },
];

export const Merchandise = () => {
  return (
    <>
      <Navbar />

      <div className="bg-[#f3f3f3] min-h-screen pt-[110px]">
        {/* HEADER */}
        <section className="py-10">
          <div className="max-w-[1650px] mx-auto px-6 xl:px-10">
            <h1
              className="text-[34px] md:text-[42px] font-semibold text-[#161412]"
              style={{
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Merchandising Displays
            </h1>

            <div className="w-[70px] h-[4px] bg-[#c91f26] mt-3 mb-5" />

            <p className="text-[13px] text-[#777]">
              <Link
                to="/"
                className="hover:text-[#161412] duration-300"
              >
                Home
              </Link>

              {" / "}

              <Link
                to="/resource-center"
                className="hover:text-[#161412] duration-300"
              >
                Resource Center
              </Link>

              {" / "}

              <span className="text-[#161412] font-semibold">
                Merchandising Displays
              </span>
            </p>

            <p className="mt-4 text-[#777] text-sm">
              Showing all 4 results
            </p>
          </div>
        </section>

        {/* HERO */}
        <section>
          <div className="grid lg:grid-cols-2">
            <div className="bg-[#edf1f6] flex items-center justify-center p-10">
              <img
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea7"
                alt=""
                className="
                  w-full
                  max-w-[650px]
                  h-[450px]
                  object-cover
                "
              />
            </div>

<div
  className="
    bg-[#edf1f6]
    flex
    flex-col
    justify-center
    items-center
    text-center
    p-10
  "
>
  <h2
    className="
      text-[30px]
      md:text-[42px]
      text-[#161412]
      mb-6
    "
    style={{
      fontFamily:
        '"Cormorant Garamond", serif',
    }}
  >
    Merchandising Displays
  </h2>

<img
  src="/logo.png"
  alt="Ultra Stones"
  className="
    w-[280px]
    max-w-[280px]
    h-auto
    object-contain
  "
/>
</div>
          </div>
        </section>

        {/* OUR DISPLAYS */}
        <section className="py-20">
          <div className="max-w-[1500px] mx-auto px-6">
            <h2
              className="
                text-center
                text-[42px]
                text-[#161412]
                mb-14
              "
              style={{
                fontFamily:
                  '"Cormorant Garamond", serif',
              }}
            >
              Our Displays
            </h2>

            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
              {displays.map((item) => (
                <div
                  key={item.id}
                  className="text-center"
                >
                  <div
                    className="
                      bg-white
                      border
                      border-[#e5e5e5]
                      p-5
                    "
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="
                        w-full
                        h-[220px]
                        object-cover
                      "
                    />
                  </div>

                  <h3
                    className="
                      mt-4
                      text-[22px]
                      text-[#161412]
                    "
                    style={{
                      fontFamily:
                        '"Cormorant Garamond", serif',
                    }}
                  >
                    {item.name}
                  </h3>

                  <p className="text-[#777] text-sm mt-1">
                    {item.size}
                  </p>

                  <button
                    className="
                      mt-4
                      border
                      border-[#c91f26]
                      text-[#c91f26]
                      px-5
                      py-2
                      text-sm
                      hover:bg-[#c91f26]
                      hover:text-white
                      duration-300
                    "
                  >
                    Download PDF
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* QUOTE SECTION */}
        <section
          className="
            py-16
            bg-cover
            bg-center
            relative
          "
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=1600)",
          }}
        >
          <div className="absolute inset-0 bg-black/75" />

          <div className="relative max-w-[1200px] mx-auto px-6">
            <p
              className="
                text-center
                text-white
                text-[24px]
                leading-[1.8]
              "
              style={{
                fontFamily:
                  '"Cormorant Garamond", serif',
              }}
            >
              Explore our premium tower and table
              displays, designed to beautifully
              showcase our quartz, porcelain and
              precious stone collections. Our sleek,
              space-efficient merchandising displays
              help interior designers and homeowners
              better understand colors, finishes and
              textures.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-20">
          <img
            src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1800"
            alt=""
            className="
              w-full
              h-[500px]
              object-cover
            "
          />

          <div
            className="
              absolute
              inset-0
              flex
              items-center
              justify-center
            "
          >
            <div className="text-center">
              <h2
                className="
                  text-white
                  text-[42px]
                  md:text-[56px]
                  mb-5
                "
                style={{
                  fontFamily:
                    '"Cormorant Garamond", serif',
                }}
              >
                Request Your Display
              </h2>

              <button
                className="
                  bg-[#c91f26]
                  text-white
                  px-8
                  py-3
                  hover:bg-[#aa1a20]
                  duration-300
                "
              >
                Click Here
              </button>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Merchandise;
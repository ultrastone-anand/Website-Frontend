import Navbar from "../../../components/common/Navbar";
import Footer from "../../../components/common/Footer";

import uslogo from '../../../assets/uslogo.png';


const Aboutus = () => {
  return (
    <>
      <Navbar />

      <div className="bg-[#f3f3f3] min-h-screen pt-[110px]">
        {/* HEADING */}
        <section>
          <div className="max-w-[1650px] mx-auto px-6 xl:px-10">
            <h1
              className="text-[34px] md:text-[42px] font-semibold text-[#161412]"
              style={{
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              About Us
            </h1>

            <div className="w-[70px] h-[4px] bg-[#c91f26] mt-4 mb-4" />

            <p
              className="text-[13px] text-[#777]"
              style={{
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Home / Ultra Experience /{" "}
              <span className="text-[#161412] font-semibold">
                About Us
              </span>
            </p>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="py-14">
          <div className="max-w-[1650px] mx-auto px-6 xl:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* LEFT IMAGE */}
              <div>
                <img
                  src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop"

                  alt="Ultra Stones Interior"
                  className="
                    w-full
                    h-[350px]
                    sm:h-[450px]
                    lg:h-[650px]
                    object-cover
                  "
                />
              </div>

              {/* RIGHT CONTENT */}
              <div className="pt-4">
                <h2
                  className="
                    text-[26px]
                    sm:text-[32px]
                    lg:text-[42px]
                    leading-[1.15]
                    font-semibold
                    text-[#161412]
                    mb-8
                  "
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  “From Quarry to Luxury—
                  <br />
                  The Journey of Ultra Stones”
                </h2>

                <div
                  className="
                    space-y-6
                    text-[14px]
                    sm:text-[15px]
                    leading-[26px]
                    sm:leading-[30px]
                    text-[#5e5e5e]
                  "
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  <p>
                    In 2013, driven by a deep-rooted love for natural
                    stone, we opened our doors to a global world of
                    luxury surfaces. At Ultra Stones, every slab tells
                    a story of craftsmanship, elegance, and timeless
                    beauty.
                  </p>

                  <p>
                    Our commitment goes beyond providing premium stone.
                    We strive to inspire architects, interior
                    designers, and homeowners with unique materials
                    that elevate every space.
                  </p>

                  <p>
                    Whether it is for a residential retreat or a
                    commercial masterpiece, Ultra Stones delivers
                    carefully curated collections sourced from the
                    world’s finest quarries.
                  </p>

                  <p>
                    We believe luxury should feel personal. That is why
                    every product is selected with attention to detail,
                    texture, movement, and long-term durability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM BANNER */}
        <section className="pb-16">
          <div className="relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2000&auto=format&fit=crop"
              alt="Ultra Stones"
              className="
  w-full
  h-[180px]
  sm:h-[250px]
  lg:h-[320px]
  object-cover
"
            />

            <div className="absolute inset-0 bg-black/10" />

            {/* Logo Right Side */}
            <div
              className="
    absolute
    right-4
    sm:right-8
    md:right-12
    lg:right-16
    top-1/2
    -translate-y-1/2
  "
            >
              <img
                src={uslogo}
                alt="Ultra Stones"
                className="
      h-[40px]
      sm:h-[55px]
      md:h-[70px]
      lg:h-[90px]
      w-auto
    "
              />
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Aboutus;
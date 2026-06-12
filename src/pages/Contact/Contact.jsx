import axios from "axios";
import { useState, useEffect } from "react";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

export default function Contact() {
const [showrooms, setShowrooms] = useState([]);

useEffect(() => {
  fetchShowrooms();
}, []);

const fetchShowrooms = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/company`
    );

    if (response.data.success) {
      setShowrooms(
        response.data.data
          .filter((item) => item.is_active)
          .sort(
            (a, b) =>
              (a.display_order || 0) -
              (b.display_order || 0)
          )
      );
    }
  } catch (error) {
    console.error(error);
  }
};

  return (
    <>
      <Navbar />

      <div
        className="
          bg-[#f3f3f3]
          min-h-screen
          pt-[110px]
        "
      >
        {/* HEADING */}

        <section>
          <div
            className="
              max-w-[1650px]
              mx-auto
              px-6
              xl:px-10
            "
          >
            <h1
              className="
                text-[34px]
                md:text-[42px]
                font-semibold
                text-[#161412]
                leading-none
              "
              style={{
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Contact Us
            </h1>

            <div
              className="
                w-[70px]
                h-[4px]
                bg-[#c91f26]
                mt-4
                mb-4
              "
            />

            <p
              className="
                text-[13px]
                text-[#777]
              "
              style={{
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Home /{" "}
              <span className="text-[#161412]">
                <b>Contact Us</b>
              </span>
            </p>
          </div>
        </section>

        {/* CONTACT SECTION */}

        <section
          className="
            max-w-[1650px]
            mx-auto
            px-6
            xl:px-10
            pt-16
            pb-24
          "
        >
          <div
            className="
              grid
              lg:grid-cols-[520px_1fr]
              gap-[120px]
            "
          >
            {/* LEFT SIDE */}

            <div>
              <h2
                className="
                  text-[28px]
                  font-light
                  text-[#161412]
                  mb-8
                "
              >
                Get in touch
              </h2>

              <p
                className="
                  text-[13px]
                  leading-[24px]
                  text-[#666]
                  mb-10
                "
              >
                Thank you for your interest in our services! If you have any
                questions or would like to discuss a project, please don't
                hesitate to contact us. Our team is dedicated to providing you
                with the highest level of service and support, and we are
                committed to working with you to meet your business objectives.
              </p>

              <div className="grid grid-cols-2 gap-12">
                <div>
                  <h3
                    className="
                      text-[#c91f26]
                      text-[13px]
                      font-semibold
                      mb-4
                    "
                  >
                    Visit Us
                  </h3>

<div className="space-y-8">
  {showrooms.map((showroom) => (
    <div key={showroom.id}>
      <p className="text-[13px] font-medium text-[#222]">
        {showroom.name}
      </p>

      <p className="text-[12px] text-[#666] leading-5">
        {showroom.address}
        <br />
        {showroom.city}, {showroom.state}{" "}
        {showroom.zip_code}
      </p>
    </div>
  ))}
</div>
                </div>

                <div>
                  <h3
                    className="
                      text-[#c91f26]
                      text-[13px]
                      font-semibold
                      mb-4
                    "
                  >
                    Office Hours
                  </h3>

<div className="space-y-6">
  {showrooms.length > 0 && (
    <div>
      <p className="text-[12px] text-[#666]">
        Monday - Friday
      </p>

      <p className="text-[12px] text-[#666] mb-2">
        {showrooms[0].business_hours_mon_fri}
      </p>

      <p className="text-[12px] text-[#666]">
        Saturday
      </p>

      <p className="text-[12px] text-[#666] mb-2">
        {showrooms[0].business_hours_saturday}
      </p>

      <p className="text-[12px] text-[#666]">
        Sunday
      </p>

      <p className="text-[12px] text-[#666]">
        {showrooms[0].business_hours_sunday}
      </p>
    </div>
  )}
</div>
                </div>
              </div>
            </div>

            {/* FORM */}

            <div>
              <form>
                <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <label className="block text-[12px] mb-2 text-[#222]">
                      Your Name*
                    </label>

                    <input
                      type="text"
                      className="
                        w-full
                        h-[42px]
                        bg-[#ece9e5]
                        border
                        border-[#e1ddd8]
                        px-4
                        text-[13px]
                        outline-none
                      "
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] mb-2 text-[#222]">
                      Subject*
                    </label>

                    <input
                      type="text"
                      className="
                        w-full
                        h-[42px]
                        bg-[#ece9e5]
                        border
                        border-[#e1ddd8]
                        px-4
                        text-[13px]
                        outline-none
                      "
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] mb-2 text-[#222]">
                      Your E-mail*
                    </label>

                    <input
                      type="email"
                      className="
                        w-full
                        h-[42px]
                        bg-[#ece9e5]
                        border
                        border-[#e1ddd8]
                        px-4
                        text-[13px]
                        outline-none
                      "
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] mb-2 text-[#222]">
                      Your Phone*
                    </label>

                    <input
                      type="text"
                      className="
                        w-full
                        h-[42px]
                        bg-[#ece9e5]
                        border
                        border-[#e1ddd8]
                        px-4
                        text-[13px]
                        outline-none
                      "
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-[12px] mb-2 text-[#222]">
                    Message (Optional)
                  </label>

                  <textarea
                    rows={7}
                    className="
                      w-full
                      bg-[#ece9e5]
                      border
                      border-[#e1ddd8]
                      p-4
                      text-[13px]
                      resize-none
                      outline-none
                    "
                  />
                </div>

                <button
                  type="submit"
                  className="
                    mt-6
                    w-[90px]
                    h-[32px]
                    bg-[#0c5562]
                    text-white
                    text-[11px]
                    uppercase
                    tracking-wider
                    hover:bg-[#08414b]
                    transition-all
                  "
                >
                  Submit
                </button>
              </form>
            </div>
          </div>

          {/* SHOWROOMS */}

          <section className="mt-28">
            <h2
              className="
                text-[30px]
                font-light
                text-[#161412]
                mb-10
              "
            >
              Our Slab Galleries
            </h2>

<div className="grid lg:grid-cols-2 gap-14">
  {showrooms.map((showroom) => (
    <div key={showroom.id}>
      <div className="border">
        <iframe
          title={showroom.name}
          src={`https://maps.google.com/maps?q=${encodeURIComponent(
            `${showroom.address} ${showroom.city} ${showroom.state}`
          )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
          className="w-full h-[300px] border-0"
        />
      </div>

      <h3 className="mt-5 text-[32px] font-light text-[#c91f26]">
        {showroom.name}
      </h3>

      <p className="text-[13px] text-[#555] mt-2">
        {showroom.address}
        <br />
        {showroom.city}, {showroom.state}{" "}
        {showroom.zip_code}
      </p>

      <p className="text-[12px] text-[#555] mt-3">
        Monday - Friday :{" "}
        {showroom.business_hours_mon_fri}
        <br />
        Saturday :{" "}
        {showroom.business_hours_saturday}
        <br />
        Sunday :{" "}
        {showroom.business_hours_sunday}
      </p>

      <div className="mt-4">
        <a
          href={showroom.google_maps_url}
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-block
            border
            border-[#c91f26]
            px-5
            py-2
            text-[12px]
            uppercase
            tracking-wider
            hover:bg-[#c91f26]
            hover:text-white
            transition-all
          "
        >
          Get Directions
        </a>
      </div>
    </div>
  ))}
</div>
          </section>
        </section>
      </div>

      <Footer />
    </>
  );
}
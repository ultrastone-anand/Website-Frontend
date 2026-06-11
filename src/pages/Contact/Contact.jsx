import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

export default function Contact() {
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
                    <div>
                      <p className="text-[13px] font-medium text-[#222]">
                        New York
                      </p>

                      <p className="text-[12px] text-[#666] leading-5">
                        55 Central Drive,
                        <br />
                        Farmingdale NY 11735
                      </p>
                    </div>

                    <div>
                      <p className="text-[13px] font-medium text-[#222]">
                        Philadelphia
                      </p>

                      <p className="text-[12px] text-[#666] leading-5">
                        2301 Hornig Rd,
                        <br />
                        Philadelphia, PA 19116
                      </p>
                    </div>
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
                    <div>
                      <p className="text-[12px] text-[#666]">
                        Monday - Friday
                      </p>
                      <p className="text-[12px] text-[#666]">
                        8:00 AM to 5:00 PM
                      </p>
                    </div>

                    <div>
                      <p className="text-[12px] text-[#666]">Saturday</p>
                      <p className="text-[12px] text-[#666]">
                        9:00 AM to 1:00 PM
                      </p>
                    </div>

                    <div>
                      <p className="text-[12px] text-[#666]">Sunday</p>
                      <p className="text-[12px] text-[#666]">Closed</p>
                    </div>
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
              <div>
                <div className=" border-1">
                <iframe
                  title="New York"
                  src="https://maps.google.com/maps?q=55%20Central%20Drive%20Farmingdale&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-[300px] border-0"
                />
                </div>

                <h3 className="mt-5 text-[32px] font-light text-[#c91f26]">
                  New York
                </h3>

                <p className="text-[13px] text-[#555] mt-2">
                  55 Central Drive,
                  <br />
                  Farmingdale NY 11735
                </p>

                <p className="text-[12px] text-[#555] mt-3">
                  Monday - Friday : 8:00 AM to 5:00 PM
                  <br />
                  Saturday : 9:00 AM to 1:00 PM
                </p>
              </div>

              <div>
                <div className=" border-1">
                <iframe
                  title="Philadelphia"
                  src="https://maps.google.com/maps?q=2301%20Hornig%20Road%20Philadelphia&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-[300px] border-0"
                /></div>

                <h3 className="mt-5 text-[32px] font-light text-[#c91f26]">
                  Philadelphia
                </h3>

                <p className="text-[13px] text-[#555] mt-2">
                  2301 Hornig Rd,
                  <br />
                  Philadelphia, PA 19116
                </p>

                <p className="text-[12px] text-[#555] mt-3">
                  Monday - Friday : 8:00 AM to 5:00 PM
                  <br />
                  Saturday : 9:00 AM to 1:00 PM
                </p>
              </div>
            </div>
          </section>
        </section>
      </div>

      <Footer />
    </>
  );
}
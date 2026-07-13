import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Navbar from "../../../components/common/Navbar";
import Footer from "../../../components/common/Footer";
import Loading from "../../../components/common/Loading";

const OurProcess = () => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/pages/our-process`
        );

        const result = response.data;

        if (result.success) {
          setPage(result.data);
        }
      } catch (error) {
        console.error("Error fetching Our Process page:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className=" min-h-screen pt-[110px] flex items-center justify-center">
          <Loading />
        </div>
        <Footer />
      </>
    );
  }

  if (!page) {
    return (
      <>
        <Navbar />
        <div className=" min-h-screen pt-[110px] flex items-center justify-center">
          Page not found
        </div>
        <Footer />
      </>
    );
  }

  const content = page.content || {};
  const processSteps = content.processSteps || [];

  return (
    <>
      <Navbar />

      <div className=" min-h-screen pt-[110px]">
        {/* HEADING */}
        <section>
          <div className="max-w-[1650px] mx-auto px-6 xl:px-10">
            <h1
              className="text-[34px] md:text-[42px] font-semibold text-[#161412]"
              style={{
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              {content.pageHeader?.heading || page.title || "Our Process"}
            </h1>

            <div className="w-[70px] h-[4px] bg-[#c91f26] mt-4 mb-4" />

            <p
              className="text-[13px] text-[#777]"
              style={{
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              <Link
                to="/"
                className="hover:text-[#161412] duration-300"
              >
                Home
              </Link>

              {" / "}

              <Link
                to="/"
                className="hover:text-[#161412] duration-300"
              >
                Ultra Experience
              </Link>

              {" / "}

              <span className="text-[#161412] font-semibold">
                {content.pageHeader?.heading || "Our Process"}
              </span>
            </p>
          </div>
        </section>

        {/* PROCESS STEPS */}
        <section className="py-5">
          <div className="max-w-[1650px] mx-auto px-3 xl:px-5">
            <div className="space-y-12 mt-16">
              {processSteps.map((step, index) => (
                <div
                  key={step.id || index}
                  className="
                    flex
                    flex-col
                    lg:flex-row
                    items-start
                    gap-0
                  "
                >
                  {/* IMAGE */}
                  <div
                    className="
                      w-full
                      lg:w-[500px]
                      xl:w-[600px]
                      shrink-0
                    "
                  >
                    <img
                      src={step.image}
                      alt={step.imageAlt || step.title}
                      className="
                        w-full
                        h-[320px]
                        xl:h-[380px]
                        object-cover
                      "
                    />
                  </div>

                  {/* CONTENT */}
                  <div
                    className="
                      flex-1
                      bg-transparent
                      relative
                    "
                  >
                    {/* RED STRIP */}
                    <div
                      className="
                        h-[42px]
                        w-[340px]
                        bg-gradient-to-r
                        from-[#d71920]
                        to-[#f5e4e4]
                        flex
                        items-center
                        px-5
                        text-white
                        text-[24px]
                        font-semibold
                      "
                    >
                      {step.title}
                    </div>

                    <div className="pt-12 px-12 flex-1">
                      <p
                        className="
                          text-[20px]
                          leading-[26px]
                          text-[#555]
                          mb-8
                        "
                      >
                        {step.description}
                      </p>

                      {step.buttonText && (
                        <button
                          className="
                            border
                            border-[#d71920]
                            text-[#d71920]
                            text-[14px]
                            uppercase
                            tracking-[1px]
                            px-4
                            py-2
                            hover:bg-[#d71920]
                            hover:text-white
                            transition
                          "
                          onClick={() => {
                            if (step.buttonLink) {
                              window.location.href = step.buttonLink;
                            }
                          }}
                        >
                          {step.buttonText}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {processSteps.length === 0 && (
                <div className="text-center text-gray-500 py-16">
                  No process steps found.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default OurProcess;
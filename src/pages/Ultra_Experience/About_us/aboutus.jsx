import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";
import { Link } from "react-router-dom";
import Loading from "../../../components/common/Loading";

const Aboutus = () => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/pages/about-us`
        );

        const result = response.data;

        if (result.success) {
          setPage(result.data);
        }
      } catch (error) {
        console.error("Error fetching About Us page:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, []);

  if (loading) {
    return (
      <>
        <div className=" min-h-screen pt-[110px] flex items-center justify-center">
          <Loading />
        </div>
      </>
    );
  }

  if (!page) {
    return (
      <>
        <div className=" min-h-screen pt-[110px] flex items-center justify-center">
          Page not found
        </div>
      </>
    );
  }

  const content = page.content || {};

  return (
    <>

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
              {content.pageHeader?.heading || page.title || "About Us"}
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
                {content.pageHeader?.heading || "About Us"}
              </span>
            </p>
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section className="py-14">
          <div className="max-w-[1650px] mx-auto px-6 xl:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              <div>
                <img
                  src={content.aboutSection?.image}
                  alt={content.aboutSection?.imageAlt || "Ultra Stones Interior"}
                  className="
                    w-full
                    h-[350px]
                    sm:h-[450px]
                    lg:h-[650px]
                    object-cover
                  "
                />
              </div>

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
                  {content.aboutSection?.title}
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
                  {content.aboutSection?.paragraphs?.map(
                    (paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM BANNER */}
        <section className="pb-16">
          <div className="relative overflow-hidden">
            <img
              src={content.bottomBanner?.image}
              alt={content.bottomBanner?.imageAlt || "Ultra Stones"}
              className="
                w-full
                h-[180px]
                sm:h-[250px]
                lg:h-[320px]
                object-cover
              "
            />

            <div className="absolute inset-0 bg-black/10" />
          </div>
        </section>
      </div>
    </>
  );
};

export default Aboutus;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Loading from "../../../components/common/Loading";

const Merchandise = () => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/pages/merchandising-displays`
        );

        const result = response.data;

        if (result.success) {
          setPage(result.data);
        }
      } catch (error) {
        console.error(
          "Error fetching Merchandising Displays page:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, []);

  // if (loading) {
  //   return (
  //     <>

  //       <div className="min-h-screen pt-[110px] flex items-center justify-center">
  //         <Loading />
  //       </div>

  //     </>
  //   );
  // }

  if (!page) {
    return (
      <>

        <div className="min-h-screen pt-[110px] flex items-center justify-center">
          Page not found
        </div>

      </>
    );
  }

  const content = page.content || {};
  const displays = content.displaySection?.items || [];

  const handlePdfDownload = (pdfUrl) => {
    if (!pdfUrl || pdfUrl === "#") {
      return;
    }

    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>

      <main className="min-h-screen pt-[110px]">
        {/* PAGE HEADER */}
        <section className="py-10">
          <div className="max-w-[1650px] mx-auto px-6 xl:px-10">
            <h1
              className="text-[34px] md:text-[42px] font-semibold text-[#161412]"
              style={{
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              {content.pageHeader?.heading ||
                page.title ||
                "Merchandising Displays"}
            </h1>

            <div className="w-[70px] h-[4px] bg-[#c91f26] mt-3 mb-5" />

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
                to="/resource-center"
                className="hover:text-[#161412] duration-300"
              >
                Resource Center
              </Link>

              {" / "}

              <span className="text-[#161412] font-semibold">
                {content.pageHeader?.heading ||
                  page.title ||
                  "Merchandising Displays"}
              </span>
            </p>

            <p
              className="mt-4 text-[#777] text-sm"
              style={{
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              Showing all {displays.length}{" "}
              {displays.length === 1 ? "result" : "results"}
            </p>
          </div>
        </section>

        {/* HERO — COMPLETE IMAGE, NO LOGO */}
        {content.hero?.image && (
          <section>
            <div className="relative overflow-hidden">
              <img
                src={content.hero.image}
                alt={
                  content.hero.imageAlt ||
                  content.hero.title ||
                  "Merchandising Displays"
                }
                className="
                  w-full
                  h-[350px]
                  sm:h-[450px]
                  lg:h-[600px]
                  object-cover
                "
              />

              <div className="absolute inset-0 bg-black/25" />

              {content.hero?.title && (
                <div className="absolute inset-0 flex items-center justify-center px-6">
                  <h2
                    className="
                      text-center
                      text-white
                      text-[36px]
                      sm:text-[46px]
                      lg:text-[60px]
                      leading-[1.1]
                    "
                    style={{
                      fontFamily: '"Cormorant Garamond", serif',
                    }}
                  >
                    {content.hero.title}
                  </h2>
                </div>
              )}
            </div>
          </section>
        )}

        {/* DISPLAY SECTION */}
        <section className="py-16 lg:py-20">
          <div className="max-w-[1500px] mx-auto px-6">
            <h2
              className="
                text-center
                text-[34px]
                md:text-[42px]
                text-[#161412]
                mb-12
                lg:mb-14
              "
              style={{
                fontFamily: '"Cormorant Garamond", serif',
              }}
            >
              {content.displaySection?.heading || "Our Displays"}
            </h2>

            {displays.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-8">
                {displays.map((item, index) => (
                  <article
                    key={item.id || `${item.name}-${index}`}
                    className="text-center"
                  >
                    <div
                      className="
                        bg-white
                        border
                        border-[#e5e5e5]
                        p-5
                        overflow-hidden
                      "
                    >
                      <img
                        src={item.image}
                        alt={item.imageAlt || item.name || "Display"}
                        loading="lazy"
                        className="
                          w-full
                          h-[220px]
                          object-cover
                          duration-500
                          hover:scale-[1.03]
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
                        fontFamily: '"Cormorant Garamond", serif',
                      }}
                    >
                      {item.name}
                    </h3>

                    {item.size && (
                      <p
                        className="text-[#777] text-sm mt-1"
                        style={{
                          fontFamily: "Montserrat, sans-serif",
                        }}
                      >
                        {item.size}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() => handlePdfDownload(item.pdfUrl)}
                      disabled={!item.pdfUrl || item.pdfUrl === "#"}
                      className="
                        mt-4
                        border
                        border-[#c91f26]
                        text-[#c91f26]
                        px-5
                        py-2
                        text-sm
                        duration-300
                        hover:bg-[#c91f26]
                        hover:text-white
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                        disabled:hover:bg-transparent
                        disabled:hover:text-[#c91f26]
                      "
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                      }}
                    >
                      {item.buttonText || "Download PDF"}
                    </button>
                  </article>
                ))}
              </div>
            ) : (
              <p className="text-center text-[#777]">
                No merchandising displays found.
              </p>
            )}
          </div>
        </section>

  {/* QUOTE SECTION */}
{content.quoteSection?.description && (
  <section
    className="
      relative
      py-16
      mb-10
      lg:mb-16
      bg-cover
      bg-center
    "
    style={{
      backgroundImage: content.quoteSection?.backgroundImage
        ? `url(${content.quoteSection.backgroundImage})`
        : undefined,
      backgroundColor: content.quoteSection?.backgroundImage
        ? undefined
        : "#161412",
    }}
  >
    <div className="absolute inset-0 bg-black/75" />

    <div className="relative max-w-[1200px] mx-auto px-6">
      <p
        className="
          text-center
          text-white
          text-[22px]
          sm:text-[24px]
          leading-[1.8]
        "
        style={{
          fontFamily: '"Cormorant Garamond", serif',
        }}
      >
        {content.quoteSection.description}
      </p>
    </div>
  </section>
)}

{/* CTA SECTION */}
{content.cta?.image && (
  <section className="relative mb-12 lg:mb-20">
    <img
      src={content.cta.image}
      alt={
        content.cta.imageAlt ||
        content.cta.title ||
        "Request Your Display"
      }
      className="
        w-full
        h-[400px]
        sm:h-[500px]
        object-cover
      "
    />

    <div className="absolute inset-0 bg-black/30" />

    <div className="absolute inset-0 flex items-center justify-center px-6">
      <div className="text-center">
        <h2
          className="
            text-white
            text-[38px]
            sm:text-[46px]
            md:text-[56px]
            leading-[1.1]
            mb-6
          "
          style={{
            fontFamily: '"Cormorant Garamond", serif',
          }}
        >
          {content.cta.title || "Request Your Display"}
        </h2>

        {content.cta.buttonLink &&
        content.cta.buttonLink !== "#" ? (
          <Link
            to={content.cta.buttonLink}
            className="
              inline-block
              bg-[#c91f26]
              text-white
              px-8
              py-3
              hover:bg-[#aa1a20]
              duration-300
            "
            style={{
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            {content.cta.buttonText || "Click Here"}
          </Link>
        ) : (
          <button
            type="button"
            disabled
            className="
              bg-[#c91f26]
              text-white
              px-8
              py-3
              opacity-60
              cursor-not-allowed
            "
            style={{
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            {content.cta.buttonText || "Click Here"}
          </button>
        )}
      </div>
    </div>
  </section>
)}
      </main>

    </>
  );
};

export default Merchandise;
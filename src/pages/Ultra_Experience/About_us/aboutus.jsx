import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Loading from "../../../components/common/Loading";

/* =========================================================
   EYEBROW
========================================================= */

const Eyebrow = ({
  children,
  light = false,
}) => {
  return (
    <div
      className={`
        flex
        items-center
        gap-3

        text-[10px]
        font-semibold
        uppercase
        tracking-[0.08em]

        ${
          light
            ? "text-white/90"
            : "text-[#262320]"
        }
      `}
      style={{
        fontFamily:
          "Montserrat, sans-serif",
      }}
    >
      <span>{children}</span>

      <span
        className="
          text-[#c91f26]
          text-[14px]
          leading-none
        "
      >
        →
      </span>
    </div>
  );
};

/* =========================================================
   BUTTON
========================================================= */

const OutlineButton = ({
  children,
  to = "/",
  light = false,
}) => {
  return (
    <Link
      to={to}
      className={`
        inline-flex
        items-center
        justify-between
        gap-8

        h-[38px]
        px-5

        border

        text-[9px]
        font-semibold
        uppercase
        tracking-[0.05em]

        transition-all
        duration-300

        ${
          light
            ? `
              border-white/35
              text-white

              hover:bg-white
              hover:text-[#161412]
            `
            : `
              border-[#aaa6a1]
              text-[#161412]

              hover:bg-[#161412]
              hover:border-[#161412]
              hover:text-white
            `
        }
      `}
      style={{
        fontFamily:
          "Montserrat, sans-serif",
      }}
    >
      <span>{children}</span>

      <span className="text-[#c91f26]">
        →
      </span>
    </Link>
  );
};

/* =========================================================
   ABOUT US
========================================================= */

const Aboutus = () => {
  const [page, setPage] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  /* =======================================================
     FETCH PAGE
  ======================================================= */

  useEffect(() => {
    const fetchPage =
      async () => {
        try {
          const response =
            await axios.get(
              `${
                import.meta.env
                  .VITE_API_URL
              }/pages/about-us`
            );

          const result =
            response.data;

          if (result.success) {
            setPage(
              result.data
            );
          }
        } catch (error) {
          console.error(
            "Error fetching About Us page:",
            error
          );
        } finally {
          setLoading(false);
        }
      };

    fetchPage();
  }, []);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return <Loading />;
  }

  /* =======================================================
     PAGE NOT FOUND
  ======================================================= */

  if (!page) {
    return (
      <div
        className="
          min-h-screen
          pt-[110px]

          flex
          items-center
          justify-center
        "
      >
        Page not found
      </div>
    );
  }

  /* =======================================================
     CONTENT
  ======================================================= */

  const content =
    page.content || {};

  const hero =
    content.hero || {};

  const whoWeAre =
    content.whoWeAre || {};

  const stats =
    content.stats || [];

  const journey =
    content.journey || {};

  const journeyItems =
    journey.items || [];

  const processSection =
    content.processSection || {};

  const processItems =
    processSection.items || [];

  const visitUs =
    content.visitUs || {};

  const locations =
    visitUs.locations || [];

  return (
    <div className="min-h-screen pt-[110px]">

      {/* =================================================
          HERO
      ================================================= */}

      <section>
        <div
          className="
            relative

            h-[560px]
            md:h-[650px]
            xl:h-[720px]

            overflow-hidden

            bg-[#161412]
          "
        >
          {hero.image && (
            <img
              src={hero.image}
              alt={
                hero.imageAlt ||
                "Ultra Stones natural stone quarry"
              }
              className="
                absolute
                inset-0

                w-full
                h-full

                object-cover
              "
            />
          )}

          {/* DARK LEFT OVERLAY */}

          <div
            className="
              absolute
              inset-0

              bg-gradient-to-r
              from-black/90
              via-black/45
              to-transparent
            "
          />

          {/* HERO CONTENT */}

          <div
            className="
              absolute
              inset-0

              flex
              items-center

              px-7
              sm:px-10
              md:px-14
              lg:px-16
            "
          >
            <div
              className="
                max-w-[600px]
                text-white
              "
            >
              <Eyebrow light>
                {hero.eyebrow ||
                  "About Ultra Stones"}
              </Eyebrow>

              <h1
                className="
                  mt-8

                  text-[40px]
                  sm:text-[48px]
                  md:text-[57px]
                  xl:text-[64px]

                  leading-[1]

                  tracking-[-0.035em]

                  font-normal
                "
                style={{
                  fontFamily:
                    "Georgia, 'Times New Roman', serif",
                }}
              >
                {hero.headingLine1}

                {hero.headingLine2 && (
                  <>
                    <br />
                    {
                      hero.headingLine2
                    }
                  </>
                )}

                {hero.headingLine3 && (
                  <>
                    <br />
                    {
                      hero.headingLine3
                    }
                  </>
                )}
              </h1>

              {hero.description && (
                <p
                  className="
                    mt-8

                    max-w-[430px]

                    text-[11px]
                    sm:text-[12px]

                    leading-[1.8]

                    text-white/75
                  "
                  style={{
                    fontFamily:
                      "Montserrat, sans-serif",
                  }}
                >
                  {
                    hero.description
                  }
                </p>
              )}

              {hero.meta && (
                <p
                  className="
                    mt-10

                    text-[9px]

                    font-medium

                    tracking-[0.1em]

                    text-white
                  "
                  style={{
                    fontFamily:
                      "Montserrat, sans-serif",
                  }}
                >
                  {hero.meta}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          WHO WE ARE
      ================================================= */}

      <section className="py-14 lg:py-16">
        <div
          className="
            max-w-[1750px]
            mx-auto

            px-6
            xl:px-10
          "
        >
          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-2
            "
          >
            {/* IMAGE */}

            <div
              className="
                p-6
                sm:p-8
                lg:p-10
              "
            >
              {whoWeAre.image ? (
                <img
                  src={
                    whoWeAre.image
                  }
                  alt={
                    whoWeAre.imageAlt ||
                    "Ultra Stones warehouse"
                  }
                  loading="lazy"
                  className="
                    w-full

                    h-[380px]
                    sm:h-[480px]
                    lg:h-[560px]

                    object-cover
                  "
                />
              ) : (
                <div
                  className="
                    w-full

                    h-[380px]
                    sm:h-[480px]
                    lg:h-[560px]

                    bg-[#efedea]
                  "
                />
              )}
            </div>

            {/* TEXT */}

            <div
              className="
                flex
                items-center

                px-7
                sm:px-10
                lg:px-14
                xl:px-16

                py-12
                lg:py-16
              "
            >
              <div className="max-w-[550px]">
                <Eyebrow>
                  {whoWeAre.eyebrow ||
                    "Who We Are"}
                </Eyebrow>

                <h2
                  className="
                    mt-7

                    text-[34px]
                    sm:text-[40px]
                    lg:text-[47px]

                    leading-[1.06]

                    tracking-[-0.03em]

                    text-[#161412]
                  "
                  style={{
                    fontFamily:
                      "Georgia, 'Times New Roman', serif",
                  }}
                >
                  {
                    whoWeAre.titleLine1
                  }

                  {whoWeAre.titleLine2 && (
                    <>
                      <br />
                      {
                        whoWeAre.titleLine2
                      }
                    </>
                  )}
                </h2>

                <div
                  className="
                    mt-7

                    space-y-5

                    text-[12px]
                    sm:text-[13px]

                    leading-[1.8]

                    text-[#5e5955]
                  "
                  style={{
                    fontFamily:
                      "Montserrat, sans-serif",
                  }}
                >
                  {whoWeAre.paragraphs
                    ?.filter(Boolean)
                    .map(
                      (
                        paragraph,
                        index
                      ) => (
                        <p
                          key={
                            index
                          }
                        >
                          {
                            paragraph
                          }
                        </p>
                      )
                    )}
                </div>

                {whoWeAre.buttonLabel && (
                  <div className="mt-8">
                    <OutlineButton
                      to={
                        whoWeAre.buttonLink ||
                        "/material-portfolio"
                      }
                    >
                      {
                        whoWeAre.buttonLabel
                      }
                    </OutlineButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          STATS
      ================================================= */}

      {stats.length > 0 && (
        <section>
          <div
            className="
              max-w-[1750px]
              mx-auto

              px-6
              xl:px-10
            "
          >
            <div
              className="
                bg-[#efedea]

                grid
                grid-cols-2
                lg:grid-cols-4
              "
            >
              {stats.map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={
                      `${item.label}-${index}`
                    }
                    className={`
                      text-center

                      py-10
                      md:py-12

                      px-4

                      ${
                        index % 2 ===
                        1
                          ? "border-l border-[#d2ceca]"
                          : ""
                      }

                      ${
                        index > 1
                          ? "border-t lg:border-t-0"
                          : ""
                      }

                      ${
                        index > 0
                          ? "lg:border-l lg:border-[#d2ceca]"
                          : ""
                      }
                    `}
                  >
                    <div
                      className="
                        text-[28px]
                        sm:text-[34px]
                        lg:text-[38px]

                        text-[#171513]
                      "
                      style={{
                        fontFamily:
                          "Georgia, 'Times New Roman', serif",
                      }}
                    >
                      {
                        item.value
                      }
                    </div>

                    <div
                      className="
                        mt-3

                        text-[7px]
                        sm:text-[8px]

                        font-semibold

                        uppercase

                        tracking-[0.1em]

                        text-[#69645f]
                      "
                      style={{
                        fontFamily:
                          "Montserrat, sans-serif",
                      }}
                    >
                      {
                        item.label
                      }
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* =================================================
          OUR JOURNEY
      ================================================= */}

      <section className="py-16 lg:py-20">
        <div
          className="
            max-w-[1750px]
            mx-auto

            px-6
            xl:px-10
          "
        >
          <Eyebrow>
            {journey.eyebrow ||
              "Our Journey"}
          </Eyebrow>

          <div
            className="
              mt-10

              grid
              grid-cols-1
              xl:grid-cols-[0.8fr_2.2fr]

              gap-12
              xl:gap-20
            "
          >
            {/* LEFT */}

            <div>
              <h2
                className="
                  text-[32px]
                  sm:text-[38px]
                  lg:text-[41px]

                  leading-[1.08]

                  tracking-[-0.03em]

                  text-[#161412]
                "
                style={{
                  fontFamily:
                    "Georgia, 'Times New Roman', serif",
                }}
              >
                {
                  journey.titleLine1
                }

                {journey.titleLine2 && (
                  <>
                    <br />
                    {
                      journey.titleLine2
                    }
                  </>
                )}
              </h2>
            </div>

            {/* TIMELINE */}

            <div
              className="
                relative

                grid
                grid-cols-1
                md:grid-cols-4

                gap-9
                md:gap-0
              "
            >
              {journeyItems.length >
                0 && (
                <div
                  className="
                    hidden
                    md:block

                    absolute

                    left-0
                    right-0
                    top-[4px]

                    h-px

                    bg-[#aaa6a1]
                  "
                />
              )}

              {journeyItems.map(
                (
                  item,
                  index
                ) => (
                  <div
                    key={
                      `${item.year}-${index}`
                    }
                    className="
                      relative
                      md:pr-8
                    "
                  >
                    <div
                      className="
                        relative
                        z-10

                        w-[7px]
                        h-[7px]

                        mb-5

                        rounded-full

                        bg-[#161412]
                      "
                    />

                    <div
                      className="
                        text-[7px]

                        font-bold

                        uppercase

                        tracking-[0.08em]

                        text-[#312d29]
                      "
                      style={{
                        fontFamily:
                          "Montserrat, sans-serif",
                      }}
                    >
                      {
                        item.year
                      }
                    </div>

                    <h3
                      className="
                        mt-2

                        text-[13px]

                        font-medium

                        text-[#1c1917]
                      "
                      style={{
                        fontFamily:
                          "Montserrat, sans-serif",
                      }}
                    >
                      {
                        item.title
                      }
                    </h3>

                    <p
                      className="
                        mt-3

                        max-w-[180px]

                        text-[9px]
                        sm:text-[10px]

                        leading-[1.6]

                        text-[#8b8681]
                      "
                      style={{
                        fontFamily:
                          "Montserrat, sans-serif",
                      }}
                    >
                      {
                        item.description
                      }
                    </p>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          SOURCE TO SPACE
      ================================================= */}

      <section>
        <div
          className="
            max-w-[1750px]
            mx-auto

            px-6
            xl:px-10
          "
        >
          <div
            className="
              bg-[#151515]

              px-7
              sm:px-10
              lg:px-14
              xl:px-16

              py-14
              lg:py-16
            "
          >
            <Eyebrow light>
              {processSection.eyebrow ||
                "From Source To Space"}
            </Eyebrow>

            <div
              className="
                mt-10

                grid
                grid-cols-1
                lg:grid-cols-[0.7fr_2.3fr]

                gap-12
                lg:gap-14
              "
            >
              {/* LEFT */}

              <div>
                <h2
                  className="
                    text-[34px]
                    sm:text-[40px]
                    lg:text-[44px]

                    leading-[1.05]

                    tracking-[-0.03em]

                    text-white
                  "
                  style={{
                    fontFamily:
                      "Georgia, 'Times New Roman', serif",
                  }}
                >
                  {
                    processSection.titleLine1
                  }

                  {processSection.titleLine2 && (
                    <>
                      <br />
                      {
                        processSection.titleLine2
                      }
                    </>
                  )}
                </h2>

                {processSection.description && (
                  <p
                    className="
                      mt-6

                      max-w-[280px]

                      text-[10px]
                      sm:text-[11px]

                      leading-[1.7]

                      text-white/55
                    "
                    style={{
                      fontFamily:
                        "Montserrat, sans-serif",
                    }}
                  >
                    {
                      processSection.description
                    }
                  </p>
                )}

                {processSection.buttonLabel && (
                  <div className="mt-7">
                    <OutlineButton
                      light
                      to={
                        processSection.buttonLink ||
                        "/our-process"
                      }
                    >
                      {
                        processSection.buttonLabel
                      }
                    </OutlineButton>
                  </div>
                )}
              </div>

              {/* CARDS */}

              <div
                className="
                  grid
                  grid-cols-1
                  md:grid-cols-3

                  gap-4
                "
              >
                {processItems.map(
                  (
                    item,
                    index
                  ) => (
                    <article
                      key={
                        `${item.title}-${index}`
                      }
                    >
                      <div
                        className="
                          relative

                          h-[350px]
                          md:h-[390px]
                          xl:h-[430px]

                          overflow-hidden

                          group

                          bg-[#242424]
                        "
                      >
                        {item.image ? (
                          <img
                            src={
                              item.image
                            }
                            alt={
                              item.imageAlt ||
                              item.title
                            }
                            loading="lazy"
                            className="
                              w-full
                              h-full

                              object-cover

                              transition-transform
                              duration-700

                              group-hover:scale-[1.04]
                            "
                          />
                        ) : (
                          <div
                            className="
                              w-full
                              h-full

                              flex
                              items-center
                              justify-center

                              bg-[#242424]

                              text-white/20

                              text-[10px]

                              uppercase

                              tracking-[0.1em]
                            "
                            style={{
                              fontFamily:
                                "Montserrat, sans-serif",
                            }}
                          >
                            {
                              item.title
                            }
                          </div>
                        )}

                        {/* IMAGE OVERLAY */}

                        <div
                          className="
                            absolute
                            inset-0

                            bg-gradient-to-t

                            from-black/50
                            via-transparent
                            to-black/10
                          "
                        />

                        {/* NUMBER */}

                        <span
                          className="
                            absolute

                            top-4
                            left-4

                            text-[8px]

                            text-white/70
                          "
                          style={{
                            fontFamily:
                              "Montserrat, sans-serif",
                          }}
                        >
                          {item.number ||
                            String(
                              index + 1
                            ).padStart(
                              2,
                              "0"
                            )}
                        </span>
                      </div>

                      {/* CARD TEXT */}

                      <div
                        className="
                          pt-4

                          text-center
                        "
                      >
                        <h3
                          className="
                            text-[10px]

                            font-semibold

                            uppercase

                            tracking-[0.09em]

                            text-white
                          "
                          style={{
                            fontFamily:
                              "Montserrat, sans-serif",
                          }}
                        >
                          {
                            item.title
                          }
                        </h3>

                        <p
                          className="
                            mt-2

                            mx-auto

                            max-w-[200px]

                            text-[8px]
                            sm:text-[9px]

                            leading-[1.55]

                            text-white/45
                          "
                          style={{
                            fontFamily:
                              "Montserrat, sans-serif",
                          }}
                        >
                          {
                            item.description
                          }
                        </p>
                      </div>
                    </article>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          VISIT US
      ================================================= */}

      <section className="py-16">
        <div
          className="
            max-w-[1750px]
            mx-auto

            px-6
            xl:px-10
          "
        >
          <div
            className="
              px-7
              sm:px-10
              lg:px-14
              xl:px-16

              py-14
              lg:py-16
            "
          >
            <Eyebrow>
              {visitUs.eyebrow ||
                "Visit Us"}
            </Eyebrow>

            <h2
              className="
                mt-7

                text-[35px]
                sm:text-[41px]
                lg:text-[46px]

                leading-[1.05]

                tracking-[-0.03em]

                text-[#161412]
              "
              style={{
                fontFamily:
                  "Georgia, 'Times New Roman', serif",
              }}
            >
              {
                visitUs.titleLine1
              }

              {visitUs.titleLine2 && (
                <>
                  <br />
                  {
                    visitUs.titleLine2
                  }
                </>
              )}
            </h2>

            <div
              className="
                mt-14

                grid
                grid-cols-1
                md:grid-cols-2

                gap-16
                lg:gap-24
              "
            >
              {locations.map(
                (
                  location,
                  index
                ) => (
                  <div
                    key={
                      `${location.name}-${index}`
                    }
                    className="
                      flex
                      flex-col
                      items-center

                      text-center
                    "
                  >
                    {/* LOCATION IMAGE */}

                    <div
                      className="
                        w-full

                        h-[230px]
                        lg:h-[270px]

                        flex
                        items-end
                        justify-center
                      "
                    >
                      {location.image ? (
                        <img
                          src={
                            location.image
                          }
                          alt={
                            location.imageAlt ||
                            location.name
                          }
                          loading="lazy"
                          className="
                            w-full

                            max-w-[520px]

                            h-full

                            object-contain
                            object-bottom
                          "
                        />
                      ) : (
                        <div
                          className="
                            w-full

                            max-w-[520px]

                            h-full

                            flex
                            items-center
                            justify-center

                            bg-[#efedea]

                            text-[10px]

                            uppercase

                            tracking-[0.08em]

                            text-[#999]
                          "
                          style={{
                            fontFamily:
                              "Montserrat, sans-serif",
                          }}
                        >
                          {
                            location.name
                          }
                        </div>
                      )}
                    </div>

                    {/* LOCATION NAME */}

                    <h3
                      className="
                        mt-6

                        text-[12px]

                        font-bold

                        uppercase

                        tracking-[0.07em]

                        text-[#161412]
                      "
                      style={{
                        fontFamily:
                          "Montserrat, sans-serif",
                      }}
                    >
                      {
                        location.name
                      }
                    </h3>

                    {/* CITY */}

                    <p
                      className="
                        mt-1

                        text-[12px]

                        text-[#393531]
                      "
                      style={{
                        fontFamily:
                          "Montserrat, sans-serif",
                      }}
                    >
                      {
                        location.city
                      }
                    </p>

                    {/* BUTTON */}

                    {location.buttonLabel && (
                      <div className="mt-5">
                        <OutlineButton
                          to={
                            location.buttonLink ||
                            "/contact-us"
                          }
                        >
                          {
                            location.buttonLabel
                          }
                        </OutlineButton>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Aboutus;
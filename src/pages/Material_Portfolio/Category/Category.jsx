import { useEffect, useState } from "react";
import axios from "axios";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import Loading from "../../../components/common/Loading";

import {
  getOptimizedImageUrl,
} from "../../../utils/Mediahelper";

/* =========================================================
   HELPERS
========================================================= */

const getInitials = (
  name = "",
) => {
  return name
    .split(" ")
    .map(
      (word) =>
        word.charAt(0),
    )
    .join("")
    .substring(0, 2)
    .toUpperCase();
};

/* =========================================================
   CATEGORY
========================================================= */

export default function Category() {
  const navigate =
    useNavigate();

  const [
    materials,
    setMaterials,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  /* =======================================================
     LOAD MATERIALS
  ======================================================= */

  useEffect(() => {
    const controller =
      new AbortController();

    const fetchMaterials =
      async () => {
        try {
          const response =
            await axios.get(
              `${
                import.meta.env
                  .VITE_API_URL
              }/stones`,
              {
                signal:
                  controller.signal,
              },
            );

          const result =
            response.data;

          if (
            result.success
          ) {
const activeCategories =
  result.data
    .filter(
      (item) =>
        item.is_active === true &&
        item.parent_id === null,
    )
    .sort((a, b) => {
      // Ultra Quartz always first
      if (
        a.slug ===
        "ultra-quartz"
      )
        return -1;

      if (
        b.slug ===
        "ultra-quartz"
      )
        return 1;

      // Atlas Plan always last
      if (
        a.slug ===
        "atlas-plan"
      )
        return 1;

      if (
        b.slug ===
        "atlas-plan"
      )
        return -1;

      // All other categories alphabetical
      return a.name.localeCompare(
        b.name,
        undefined,
        {
          sensitivity:
            "base",
        },
      );
    });

setMaterials(
  activeCategories,
);

            setMaterials(
              activeCategories,
            );
          }
        } catch (error) {
          if (
            error.code !==
              "ERR_CANCELED" &&
            error.name !==
              "CanceledError"
          ) {
            console.error(
              "Error fetching materials:",
              error,
            );
          }
        } finally {
          setLoading(
            false,
          );
        }
      };

    fetchMaterials();

    return () => {
      controller.abort();
    };
  }, []);

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return <Loading />;
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      <div
        className="
          min-h-screen
          pt-[110px]
        "
      >
        {/* =================================================
            HEADING
        ================================================= */}

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
                fontFamily:
                  "Montserrat, sans-serif",
              }}
            >
              Material Portfolio
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
                fontFamily:
                  "Montserrat, sans-serif",
              }}
            >
              <Link
                to="/"
                className="
                  hover:text-[#161412]
                  duration-300
                "
              >
                Home
              </Link>

              {" / "}

              <span className="text-[#161412]">
                <b>
                  Material
                  Portfolio
                </b>
              </span>
            </p>

            <p
              className="
                text-[13px]
                text-[#777]
                mt-3
              "
              style={{
                fontFamily:
                  "Montserrat, sans-serif",
              }}
            >
              Showing all{" "}
              {
                materials.length
              }{" "}
              categories
            </p>
          </div>
        </section>

        {/* =================================================
            CATEGORIES
        ================================================= */}

        <section
          className="
            max-w-[1650px]
            mx-auto
            px-6
            xl:px-10
            py-15
          "
        >
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
              gap-8
            "
          >
            {materials.map(
              (item) => {
                const imageUrl =
                  item.thumbnail_url ||
                  item.banner_url ||
                  null;

                /*
                 * IMPORTANT
                 *
                 * Use a larger source for every card.
                 * No srcSet here, because browser/DPR
                 * selection was causing inconsistent
                 * sharpness between cards.
                 */
                const sharpImageUrl =
                  imageUrl
                    ? getOptimizedImageUrl(
                        imageUrl,
                        1600,
                        90,
                      )
                    : null;

                return (
                  <div
                    key={
                      item.id
                    }
                    onClick={() =>
                      navigate(
                        `/product-category/${item.slug}`,
                      )
                    }
                    className="
                      group
                      cursor-pointer
                    "
                  >
                    {/* =====================================
                        IMAGE
                    ===================================== */}

                    <div
                      className="
                        relative
                        aspect-[4/5]
                        overflow-hidden
                        bg-[#ececec]
                      "
                    >
                      {sharpImageUrl && (
                        <img
                          src={
                            sharpImageUrl
                          }
                          alt={
                            item.name
                          }
                          loading="lazy"
                          decoding="async"
                          draggable={
                            false
                          }
                          onError={(
                            event,
                          ) => {
                            event.currentTarget.style.display =
                              "none";

                            const fallback =
                              event.currentTarget.parentElement?.querySelector(
                                "[data-image-fallback]",
                              );

                            if (
                              fallback
                            ) {
                              fallback.style.display =
                                "flex";
                            }
                          }}
                          className="
                            absolute
                            inset-0
                            w-full
                            h-full
                            object-cover
                            object-center
                            select-none

                            transition-transform
                            duration-700
                            ease-out

                            group-hover:scale-[1.025]
                          "
                        />
                      )}

                      {/* ===================================
                          FALLBACK
                      =================================== */}

                      <div
                        data-image-fallback
                        style={{
                          display:
                            sharpImageUrl
                              ? "none"
                              : "flex",
                        }}
                        className="
                          absolute
                          inset-0
                          items-center
                          justify-center

                          bg-gradient-to-br
                          from-neutral-100
                          to-neutral-300

                          text-[#555]
                          text-6xl
                          font-bold
                          tracking-wider
                          select-none
                        "
                      >
                        {getInitials(
                          item.name,
                        )}
                      </div>
                    </div>

                    {/* =====================================
                        CONTENT
                    ===================================== */}

                    <div
                      className="
                        flex
                        items-center
                        justify-between

                        border-b
                        border-[#e5e5e5]

                        py-5
                      "
                    >
                      <div>
                        <h2
                          className="
                            text-[18px]
                            font-semibold
                            text-[#161412]
                          "
                          style={{
                            fontFamily:
                              "Montserrat, sans-serif",
                          }}
                        >
                          {
                            item.name
                          }
                        </h2>

                        <p
                          className="
                            text-[12px]
                            text-[#888]
                            uppercase
                            tracking-[2px]
                            mt-1
                          "
                        >
                          Explore
                          Collection
                        </p>
                      </div>

                      <div
                        className="
                          text-[22px]

                          transition-transform
                          duration-300

                          group-hover:translate-x-2
                        "
                      >
                        →
                      </div>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </section>
      </div>
    </>
  );
}
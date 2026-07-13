import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

import Navbar from '../../../components/common/Navbar';
import Footer from '../../../components/common/Footer';
import Loading from '../../../components/common/Loading';
import { getOptimizedImageUrl } from '../../../utils/Mediahelper';

export default function Category() {
  const navigate = useNavigate();

  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/stones`
        );

        const result = response.data;

        if (result.success) {
          const activeCategories = result.data
            .filter(
              (item) =>
                item.is_active === true &&
                item.parent_id === null
            )
            .sort((a, b) =>
              a.name.localeCompare(b.name, undefined, {
                sensitivity: "base",
              })
            );

          setMaterials(activeCategories);
        }
      } catch (error) {
        console.error(
          'Error fetching materials:',
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  if (loading) {
    return (
      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          
        "
      >
        <Loading />
      </div>
    );
  }

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <>
      <Navbar />

      <div
        className="
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
                fontFamily:
                  'Montserrat, sans-serif',
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
                <b>Material Portfolio</b>
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
                  'Montserrat, sans-serif',
              }}
            >
              Showing all{' '}
              {materials.length} categories
            </p>
          </div>
        </section>

        {/* CATEGORIES */}

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
            {materials.map((item) => (
              <div
                key={item.id}
                onClick={() =>
                  navigate(`/product-category/${item.slug}`)
                }
                className="
          group
          cursor-pointer
        "
              >
                {/* Image */}

<div
  className="
    relative
    aspect-[4/5]
    overflow-hidden
    bg-[#ececec]
  "
>
  {item.thumbnail_url || item.banner_url ? (
    <img
      src={getOptimizedImageUrl(
        item.thumbnail_url || item.banner_url,
        700,
        72
      )}
      srcSet={`
        ${getOptimizedImageUrl(
          item.thumbnail_url || item.banner_url,
          360,
          68
        )} 360w,
        ${getOptimizedImageUrl(
          item.thumbnail_url || item.banner_url,
          520,
          70
        )} 520w,
        ${getOptimizedImageUrl(
          item.thumbnail_url || item.banner_url,
          700,
          72
        )} 700w,
        ${getOptimizedImageUrl(
          item.thumbnail_url || item.banner_url,
          900,
          74
        )} 900w
      `}
      sizes="
        (max-width: 639px) calc(100vw - 48px),
        (max-width: 1023px) calc(50vw - 40px),
        (max-width: 1279px) calc(33vw - 32px),
        390px
      "
      width="700"
      height="875"
      alt={item.name}
      loading="lazy"
      decoding="async"
      fetchPriority="low"
      draggable="false"
      onError={(event) => {
        event.currentTarget.style.display = "none";

        const fallback =
          event.currentTarget.parentElement?.querySelector(
            "[data-image-fallback]"
          );

        if (fallback) {
          fallback.style.display = "flex";
        }
      }}
      className="
        h-full
        w-full
        object-cover
        transition-transform
        duration-700
        group-hover:scale-105
      "
    />
  ) : null}

  <div
    data-image-fallback
    style={{
      display:
        item.thumbnail_url || item.banner_url
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
    {getInitials(item.name)}
  </div>
</div>

                {/* Content */}

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
                      {item.name}
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
                      Explore Collection
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
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { getOptimizedImageUrl } from "../../utils/Mediahelper";

const API_URL = import.meta.env.VITE_API_URL;

const applications = [
  {
    title: "BATHROOM",
    desc: "Luxury Vanities",
    categoryNames: ["Bathroom", "Bathrooms"],
  },
  {
    title: "KITCHENS",
    desc: "Statement Countertops",
    categoryNames: ["Kitchen", "Kitchens"],
  },
  {
    title: "EXTERIORS",
    desc: "Architectural Facades",
    categoryNames: [
      "Outdoors",
      "Outdoor",
      "Facades",
      "Exteriors",
    ],
  },
];

const fallbackImages = [
  "https://cdn.ultrastone.in/Home%20Page/inspiration%20galleries/bathroom/1783518137508-32b313c4-3b86-43c5-81d6-24b3d075c486-1783518137466-c234cb81-8026-4796-83a1-921ff406afea-bathroom.jpg",
  "https://cdn.ultrastone.in/Home%20Page/inspiration%20galleries/kitchen/1783529992231-043802ea-cef7-4817-996d-a3e3fa4b0240-cipollino-verde-2cm-hon.jpg",
  "https://cdn.ultrastone.in/Home%20Page/inspiration%20galleries/outdoors/1783530312160-6c2d96f4-be10-4825-bd02-0eaeebb4997b-pool-deck-scene.jpg",
];

const getRandomImage = (images) => {
  if (!images.length) {
    return null;
  }

  const randomIndex = Math.floor(
    Math.random() * images.length
  );

  return images[randomIndex];
};

const ApplicationSection = () => {
  const [galleryImages, setGalleryImages] =
    useState([]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchGalleryImages = async () => {
      try {
        const response = await fetch(
          `${API_URL}/inspiration-gallery/images?limit=30`,
          {
            signal: controller.signal,
          }
        );

        const data = await response.json();

        setGalleryImages(data.data || []);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error(
            "Failed to fetch inspiration gallery images:",
            error
          );
        }
      }
    };

    fetchGalleryImages();

    return () => controller.abort();
  }, []);

  const applicationImages = useMemo(
    () =>
      applications.map((application, index) => {
        const matchedImages =
          galleryImages.filter((image) => {
            const categoryName =
              image.inspiration_gallery_categories?.name
                ?.trim()
                .toLowerCase();

            return application.categoryNames.some(
              (name) =>
                name.toLowerCase() === categoryName
            );
          });

        const usableImages =
          matchedImages.filter((image) => {
            if (!image.width || !image.height) {
              return true;
            }

            return (
              image.width >= 1000 &&
              image.height >= 1200
            );
          });

        const imagePool = usableImages.length
          ? usableImages
          : matchedImages;

        const selectedImage =
          getRandomImage(imagePool);

        return {
          ...application,
          image:
            selectedImage?.image_url ||
            fallbackImages[index],
        };
      }),
    [galleryImages]
  );

  return (
    <section className="mb-10 bg-[#222221] py-9 sm:mb-14 sm:py-12 md:py-16 xl:mb-[70px] xl:py-[70px]">
      <div
        className="
          mx-auto
          flex
          max-w-[1850px]
          flex-col
          gap-9
          px-5
          sm:px-6
          md:px-8
          xl:flex-row
          xl:items-center
          xl:justify-between
          xl:gap-12
          xl:px-[70px]
        "
      >
        {/* LEFT CONTENT */}
        <div className="w-full xl:w-[430px] xl:shrink-0">
          <p
            className="
              flex
              items-center
              gap-3
              text-[14px]
              font-bold
              uppercase
              text-white
              sm:text-[16px]
              md:text-[18px]
            "
            style={{
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            APPLICATIONS

            <span className="text-[18px] font-normal text-[#D67A1C] sm:text-[20px]">
              →
            </span>
          </p>

          <h2
            className="
              mt-4
              uppercase
              leading-[1.35]
              tracking-[0.14em]
              text-white
              text-[20px]
              sm:mt-5
              sm:text-[22px]
              sm:tracking-[0.18em]
              xl:text-[24px]
              xl:tracking-[0.2em]
            "
            style={{
              fontFamily:
                '"BBH Bartle", sans-serif',
              fontWeight: 400,
            }}
          >
            ONE STONE.
            <br />
            ENDLESS
            <br />
            POSSIBILITIES
          </h2>

          <p
            className="
              mt-4
              max-w-[360px]
              text-[12px]
              leading-[1.6]
              text-white/85
              sm:mt-5
              sm:text-[13px]
              md:mt-6
            "
            style={{
              fontFamily: "Inter, sans-serif",
            }}
          >
            From elegant interiors to grand exteriors,
            Ultra Stones elevates every space with
            natural perfection.
          </p>

          <Link
            to="/categories"
            className="
              mt-6
              inline-flex
              w-fit
              items-center
              border
              border-white/70
              px-4
              py-2.5
              text-[10px]
              font-bold
              uppercase
              text-white
              transition
              hover:bg-white
              hover:text-black
              sm:mt-7
              sm:px-5
              sm:py-3
              sm:text-[11px]
              md:mt-8
              md:px-6
            "
            style={{
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            VIEW ALL COLLECTION

            <span className="ml-4 text-[16px] font-normal text-[#D67A1C] sm:ml-5 sm:text-[18px]">
              →
            </span>
          </Link>
        </div>

        {/* APPLICATION CARDS */}
        <div className="w-full min-w-0 xl:ml-auto xl:max-w-[980px] 2xl:max-w-[1080px]">
          <div
            className="
              -mx-5
              flex
              snap-x
              snap-mandatory
              gap-4
              overflow-x-auto
              px-5
              pb-3
              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden
              sm:mx-0
              sm:grid
              sm:grid-cols-3
              sm:gap-4
              sm:overflow-visible
              sm:px-0
              sm:pb-0
              xl:gap-5
            "
          >
            {applicationImages.map((item) => (
              <Link
                key={item.title}
                to="/categories"
                className="
                  group
                  w-[78vw]
                  max-w-[300px]
                  shrink-0
                  snap-start
                  text-center
                  sm:w-auto
                  sm:max-w-none
                  sm:shrink
                "
              >
                <div
                  className="
                    aspect-[4/5]
                    overflow-hidden
                    bg-black
                    sm:aspect-[3/5]
                  "
                >
                  <img
                    src={getOptimizedImageUrl(
                      item.image,
                      1600,
                      90
                    )}
                    srcSet={[
                      `${getOptimizedImageUrl(
                        item.image,
                        600,
                        84
                      )} 600w`,
                      `${getOptimizedImageUrl(
                        item.image,
                        900,
                        86
                      )} 900w`,
                      `${getOptimizedImageUrl(
                        item.image,
                        1200,
                        88
                      )} 1200w`,
                      `${getOptimizedImageUrl(
                        item.image,
                        1600,
                        90
                      )} 1600w`,
                    ].join(", ")}
                    sizes="
                      (max-width: 639px) 78vw,
                      (max-width: 1279px) calc((100vw - 80px) / 3),
                      360px
                    "
                    width="1200"
                    height="2000"
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                    className="
                      h-full
                      w-full
                      object-cover
                      transition-transform
                      duration-700
                      ease-out
                      group-hover:scale-[1.03]
                    "
                    onError={(event) => {
                      event.currentTarget.src =
                        item.image;

                      event.currentTarget.srcset =
                        "";
                    }}
                  />
                </div>

                <h3
                  className="
                    mt-3
                    text-[11px]
                    font-medium
                    uppercase
                    text-white
                    sm:mt-4
                    sm:text-[12px]
                  "
                  style={{
                    fontFamily:
                      "Montserrat, sans-serif",
                  }}
                >
                  {item.title}
                </h3>

                <p
                  className="
                    mt-1.5
                    text-[11px]
                    text-white/75
                    sm:mt-2
                    sm:text-[12px]
                  "
                  style={{
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {item.desc}
                </p>
              </Link>
            ))}
          </div>

          <p
            className="
              mt-3
              text-center
              text-[10px]
              uppercase
              tracking-[0.12em]
              text-white/55
              sm:hidden
            "
            style={{
              fontFamily: "Montserrat, sans-serif",
            }}
          >
            Swipe to explore
          </p>
        </div>
      </div>
    </section>
  );
};

export default ApplicationSection;
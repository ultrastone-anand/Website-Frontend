import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

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
    categoryNames: ["Outdoors", "Outdoor", "Facades", "Exteriors"],
  },
];

const fallbackImages = [
  "https://cdn.ultrastone.in/Home%20Page/inspiration%20galleries/bathroom/1783518137508-32b313c4-3b86-43c5-81d6-24b3d075c486-1783518137466-c234cb81-8026-4796-83a1-921ff406afea-bathroom.jpg",
  "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1200&auto=format&fit=crop",
];

const getRandomImage = (images) => {
  if (!images.length) return null;

  const randomIndex = Math.floor(Math.random() * images.length);

  return images[randomIndex];
};

const PreciousStoneSection = () => {
  const [galleryImages, setGalleryImages] = useState([]);

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
        console.error("Failed to fetch inspiration gallery images:", error);
      }
    }
  };

  fetchGalleryImages();

  return () => controller.abort();
}, []);

  const applicationImages = useMemo(
    () =>
      applications.map((application, index) => {
        const matchedImages = galleryImages.filter((image) =>
          application.categoryNames.includes(
            image.inspiration_gallery_categories?.name
          )
        );

        const randomImage = getRandomImage(matchedImages);

        return {
          ...application,
          image: randomImage?.image_url || fallbackImages[index],
        };
      }),
    [galleryImages]
  );

  return (
    <section className="bg-[#222221] py-12 md:py-16 xl:py-[70px] mb-[70px]">
      <div className="mx-auto flex max-w-[1850px] flex-col gap-12 px-5 sm:px-6 md:px-8 xl:flex-row xl:items-center xl:justify-between xl:px-[70px]">
        <div className="w-full xl:w-[430px] xl:shrink-0">
          <p
            className="flex items-center gap-4 text-[18px] font-bold uppercase text-white md:text-[18px]"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            APPLICATIONS
            <span className="text-[20px] font-normal text-[#D67A1C]">→</span>
          </p>

          <h2
            className="mt-5 text-[25px] uppercase leading-[1.45] tracking-[0.18em] text-white sm:text-[20px] md:text-[20px] xl:text-[24px]"
            style={{
              fontFamily: '"BBH Bartle", sans-serif',
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
            className="mt-6 max-w-[360px] text-[13px] leading-[1.6] text-white/85 md:mt-8"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            From elegant interiors to grand exteriors, Ultra Stones elevates
            every space with natural perfection.
          </p>

          <Link
            to="/categories"
            className="mt-7 inline-flex w-fit items-center border border-white/70 px-5 py-3 text-[11px] font-bold uppercase text-white transition hover:bg-white hover:text-black md:mt-8 md:px-6"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            VIEW ALL COLLECTION
            <span className="ml-5 text-[18px] font-normal text-[#D67A1C]">
              →
            </span>
          </Link>
        </div>

        <div className="w-full xl:ml-auto xl:max-w-[980px] 2xl:max-w-[1080px]">
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-3 sm:gap-4 xl:gap-5">
            {applicationImages.map((item) => (
              <Link
                key={item.title}
                to="/categories"
                className="group text-center"
              >
                <div className="overflow-hidden bg-black aspect-[3/5]">
  <img
    src={item.image}
    alt={item.title}
    className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
  />
</div>

                <h3
                  className="mt-4 text-[12px] font-medium uppercase text-white"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {item.title}
                </h3>

                <p
                  className="mt-2 text-[12px] text-white/45"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {item.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreciousStoneSection;
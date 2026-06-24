import React, {
  useEffect,
  useState,
} from "react";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

const slides = [
  {
    id: 1,

    background:
      "linear-gradient(90deg,#050505 0%,#0b0b0b 100%)",

    title:
      "INSPIRATION GALLERY",

    subtitle:
      "Discover Latest Trends",

    hero:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1400",

    center:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200",

    right:
      "https://images.unsplash.com/photo-1616594039964-3e4f6f4a3f30?q=80&w=1200",

    bottom:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200",

    leftTitle:
      "Luxury Marble Interiors",

    leftDescription:
      "Experience timeless elegance with natural stone surfaces crafted to elevate residential and commercial spaces.",

    bottomTitle:
      "Modern Living",

    bottomDescription:
      "Create luxurious environments with curated premium stone collections.",
  },

  {
    id: 2,

    background:
      "linear-gradient(90deg,#201103 0%,#61350f 100%)",

    title:
      "INSPIRATION GALLERY",

    subtitle:
      "Explore New Designs",

    hero:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1400",

    center:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200",

    right:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200",

    bottom:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200",

    leftTitle:
      "Quartz Luxury",

    leftDescription:
      "Sophisticated quartz surfaces designed for modern kitchens and luxury interiors.",

    bottomTitle:
      "Architectural Excellence",

    bottomDescription:
      "Combining durability and elegance to create remarkable spaces.",
  },

  {
    id: 3,

    background:
      "linear-gradient(90deg,#041727 0%,#0b4f7c 100%)",

    title:
      "INSPIRATION GALLERY",

    subtitle:
      "Contemporary Luxury",

    hero:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1400",

    center:
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=1200",

    right:
      "https://images.unsplash.com/photo-1616137466211-f939a420be84?q=80&w=1200",

    bottom:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200",

    leftTitle:
      "Natural Quartzite",

    leftDescription:
      "Distinctive patterns and textures crafted by nature for extraordinary interiors.",

    bottomTitle:
      "Elegant Spaces",

    bottomDescription:
      "Premium surfaces bringing character and luxury into every room.",
  },
];

const InspirationGallery = () => {
  const [current, setCurrent] =
    useState(0);

  const slide = slides[current];

  const nextSlide = () => {
    setCurrent(
      (prev) =>
        (prev + 1) %
        slides.length
    );
  };

  const prevSlide = () => {
    setCurrent(
      (prev) =>
        prev === 0
          ? slides.length - 1
          : prev - 1
    );
  };

  useEffect(() => {
    const timer = setInterval(
      nextSlide,
      6000
    );

    return () =>
      clearInterval(timer);
  }, []);

  return (
    <section
      className="
        py-10
        transition-all
        duration-1000
      "
      style={{
        background:
          slide.background,
      }}
    >
      <div className="max-w-[1650px] mx-auto px-6 xl:px-5">
        {/* Header */}

        <div className="text-center mb-12">
          <h2
            className="
              text-white
              text-[34px]
              md:text-[56px]
              tracking-[10px]
            "
          >
            {slide.title}
          </h2>

          <p className="text-white/80 mt-3 text-lg">
            {slide.subtitle}
          </p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="
              grid
              lg:grid-cols-[1.7fr_0.7fr_0.7fr]
              gap-5
            "
          >
            {/* LEFT COLUMN */}

            <div className="space-y-5">
              <motion.img
                initial={{
                  x: -80,
                  opacity: 0,
                }}
                animate={{
                  x: 0,
                  opacity: 1,
                }}
                src={slide.hero}
                alt=""
                className="
                  h-[350px]
                  md:h-[500px]
                  w-full
                  object-cover
                  rounded-xl
                "
              />

              <div className="grid md:grid-cols-2 gap-5">
                <motion.div
                  initial={{
                    y: 80,
                    opacity: 0,
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                  }}
                  className="
                    rounded-xl
                    p-8
                    text-white
                    bg-gradient-to-r
                    from-amber-900
                    to-amber-700
                  "
                >
                  <h3 className="text-4xl tracking-[4px] mb-5">
                    HEADLINE
                  </h3>

                  <p className="leading-7 text-white/90">
                    {
                      slide.leftDescription
                    }
                  </p>
                </motion.div>

                <motion.img
                  initial={{
                    y: 80,
                    opacity: 0,
                  }}
                  animate={{
                    y: 0,
                    opacity: 1,
                  }}
                  src={slide.bottom}
                  alt=""
                  className="
                    h-[250px]
                    w-full
                    object-cover
                    rounded-xl
                  "
                />
              </div>

              <div className="grid grid-cols-3 gap-5">
                <button
                  className="
                    bg-gradient-to-r
                    from-amber-900
                    to-amber-700
                    text-white
                    py-5
                    rounded-xl
                    tracking-[4px]
                  "
                >
                  DISCOVER
                </button>

                <button
                  onClick={prevSlide}
                  className="
                    bg-gradient-to-r
                    from-amber-900
                    to-amber-700
                    text-white
                    py-5
                    rounded-xl
                    tracking-[4px]
                  "
                >
                  PREVIOUS
                </button>

                <button
                  onClick={nextSlide}
                  className="
                    bg-gradient-to-r
                    from-amber-900
                    to-amber-700
                    text-white
                    py-5
                    rounded-xl
                    tracking-[4px]
                  "
                >
                  NEXT
                </button>
              </div>
            </div>

            {/* CENTER */}

            <div className="space-y-5">
              <div
                className="
                  bg-gradient-to-r
                  from-amber-900
                  to-amber-700
                  p-6
                  rounded-xl
                  text-white
                "
              >
                <h3 className="text-3xl tracking-[4px]">
                  HEADLINE
                </h3>

                <p className="mt-3">
                  {slide.leftTitle}
                </p>
              </div>

              <motion.img
                initial={{
                  y: 100,
                  opacity: 0,
                }}
                animate={{
                  y: 0,
                  opacity: 1,
                }}
                src={slide.center}
                alt=""
                className="
                  h-[520px]
                  w-full
                  object-cover
                  rounded-xl
                "
              />

              <div
                className="
                  bg-gradient-to-r
                  from-amber-900
                  to-amber-700
                  p-6
                  rounded-xl
                  text-white
                "
              >
                <h3 className="text-3xl tracking-[4px] mb-4">
                  HEADLINE
                </h3>

                <p>
                  {
                    slide.bottomDescription
                  }
                </p>
              </div>
            </div>

            {/* RIGHT */}

            <div className="space-y-5">
              <motion.img
                initial={{
                  x: 80,
                  opacity: 0,
                }}
                animate={{
                  x: 0,
                  opacity: 1,
                }}
                src={slide.right}
                alt=""
                className="
                  h-[380px]
                  w-full
                  object-cover
                  rounded-xl
                "
              />

              <motion.img
                initial={{
                  x: 80,
                  opacity: 0,
                }}
                animate={{
                  x: 0,
                  opacity: 1,
                }}
                src={slide.hero}
                alt=""
                className="
                  h-[320px]
                  w-full
                  object-cover
                  rounded-xl
                "
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default InspirationGallery;
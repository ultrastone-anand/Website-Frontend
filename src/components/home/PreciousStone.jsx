import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

const stones = [
  {
    id: 1,
    category: "PRECIOUS STONE",
    title: "PETRIFIED WOOD",
    image:
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?q=80&w=1200&auto=format&fit=crop",
    description:
      "Petrified Wood is a grounding and stabilizing stone that promotes patience, strength, and ancient wisdom. It enhances resilience, emotional balance, and connection to nature.",
    gradient:
      "linear-gradient(90deg,#2f1405 0%, #7a5730 35%, #c8a06a 100%)",
  },
  {
    id: 2,
    category: "PRECIOUS STONE",
    title: "AMETHYST",
    image:
      "https://images.unsplash.com/photo-1518066000714-58c45f1a2c0a?q=80&w=1200&auto=format&fit=crop",
    description:
      "Amethyst is known for spiritual protection, clarity, and inner peace. Its luxurious purple tones bring elegance and sophistication to any space.",
    gradient:
      "linear-gradient(90deg,#18052e 0%, #52238f 40%, #9c79e6 100%)",
  },
  {
    id: 3,
    category: "PRECIOUS STONE",
    title: "BLUE AGATE",
    image:
      "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=1200&auto=format&fit=crop",
    description:
      "Blue Agate is admired for its calming appearance and distinctive natural patterns. It creates a luxurious focal point in modern interiors.",
    gradient:
      "linear-gradient(90deg,#06263b 0%, #0d5b85 40%, #67b9e0 100%)",
  },
];

const PreciousStoneSection = () => {
  const [current, setCurrent] =
    useState(0);

  const navigate = useNavigate();

  const nextSlide = () => {
    setCurrent(
      (prev) =>
        (prev + 1) % stones.length
    );
  };

  useEffect(() => {
    const interval = setInterval(
      nextSlide,
      5000
    );

    return () =>
      clearInterval(interval);
  }, []);

  return (
    <section className="bg-[#f5f5f5] py-12 lg:py-20">
      {/* Heading */}
      <div className="max-w-[900px] mx-auto px-6 mb-10 lg:mb-14">
        <div className="text-center">
          <h2
            className="
              text-[32px]
              sm:text-[40px]
              md:text-[52px]
              text-[#161412]
              inline-block
              relative
              leading-tight
            "
            style={{
              fontFamily:
                '"Cormorant Garamond", serif',
            }}
          >
            The Luxury of{" "}
            <span className="relative inline-block">
              Precious Stones

              <span
                className="
                  absolute
                  left-0
                  bottom-[-8px]
                  h-[4px]
                  w-full
                  bg-[#c91f26]
                "
              />
            </span>
          </h2>
        </div>
      </div>

      {/* Slider */}
      <div
        className="
          relative
          overflow-hidden
          transition-all
          duration-700
        "
        style={{
          background:
            stones[current].gradient,
        }}
      >
        <div className="max-w-[1650px] mx-auto px-6 xl:px-10 py-10 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            {/* Content */}
            <div
              key={`content-${current}`}
              className="animate-contentFade order-2 lg:order-1"
            >
              <p
                className="
                  text-white/80
                  uppercase
                  tracking-[5px]
                  text-[11px]
                  mb-4
                "
              >
                {stones[current].category}
              </p>

              <h3
                className="
                  text-white
                  text-[40px]
                  sm:text-[55px]
                  md:text-[70px]
                  leading-[0.95]
                  mb-5
                "
                style={{
                  fontFamily:
                    '"Cormorant Garamond", serif',
                }}
              >
                {stones[current].title}
              </h3>

              <p
                className="
                  text-white/90
                  text-[14px]
                  md:text-[15px]
                  leading-[1.9]
                  mb-8
                  max-w-[650px]
                "
              >
                {
                  stones[current]
                    .description
                }
              </p>

              <button
                onClick={() =>
                  navigate("/categories")
                }
                className="
                  border
                  border-white
                  px-8
                  py-3
                  text-white
                  hover:bg-white
                  hover:text-black
                  duration-300
                "
              >
                Explore More
              </button>
            </div>

            {/* Image */}
            <div className="order-1 lg:order-2">
              <img
                key={`image-${current}`}
                src={
                  stones[current].image
                }
                alt={
                  stones[current].title
                }
                className="
                  w-full
                  h-[260px]
                  sm:h-[350px]
                  md:h-[450px]
                  object-cover
                  animate-imageSlide
                  shadow-2xl
                "
              />
            </div>
          </div>
        </div>

        {/* Dots */}
        <div
          className="
            absolute
            bottom-5
            left-1/2
            -translate-x-1/2
            flex
            gap-3
          "
        >
          {stones.map(
            (_, index) => (
              <button
                key={index}
                onClick={() =>
                  setCurrent(index)
                }
                className={`
                  rounded-full
                  duration-500
                  ${
                    current === index
                      ? "w-10 h-2 bg-white"
                      : "w-2 h-2 bg-white/40"
                  }
                `}
              />
            )
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="flex justify-center mt-10 lg:mt-12 px-6">
        <Link
          to="/categories"
          className="
            border
            border-[#c91f26]
            px-8
            py-3
            text-sm
            text-[#161412]
            hover:bg-[#c91f26]
            hover:text-white
            duration-300
          "
        >
          Explore More
        </Link>
      </div>

      <style>
        {`
          @keyframes contentFade {
            0% {
              opacity: 0;
              transform: translateX(-40px);
            }

            100% {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes imageSlide {
            0% {
              opacity: 0;
              transform: translateX(60px) scale(.95);
            }

            100% {
              opacity: 1;
              transform: translateX(0) scale(1);
            }
          }

          .animate-contentFade {
            animation: contentFade .7s ease;
          }

          .animate-imageSlide {
            animation: imageSlide .8s ease;
          }
        `}
      </style>
    </section>
  );
};

export default PreciousStoneSection;
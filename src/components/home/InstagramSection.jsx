import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const posts = [
  {
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80",
    caption:
      "🤍 Elegance carved in stone! Discover the subtle charm of Pearl White quartzite.",
  },

  {
    image:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80",
    caption:
      "✨ Why settle for ordinary? Ariston Quartz brings timeless elegance.",
  },

  {
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80",
    caption:
      "🔥 Transform your space with luxury natural stone surfaces.",
  },

  {
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=1200&q=80",
    caption:
      "🏡 Luxury interiors crafted with premium stone materials.",
  },

  {
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
    caption:
      "✨ Inspired by nature, designed for modern living.",
  },

  {
    image:
      "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=1200&q=80",
    caption:
      "💎 Natural beauty meets timeless craftsmanship.",
  },
];

const InstagramSection = () => {
  const [index, setIndex] = useState(0);

  const nextSlide = () => {
    setIndex((prev) =>
      prev + 3 >= posts.length
        ? 0
        : prev + 3
    );
  };

  const prevSlide = () => {
    setIndex((prev) =>
      prev - 3 < 0
        ? posts.length - 3
        : prev - 3
    );
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1650px] mx-auto px-6 xl:px-10">
        <div className="text-center mb-16">
          <h2
            className="
              flex
              items-center
              justify-center
              gap-3
              text-[38px]
              md:text-[52px]
              font-semibold
              text-[#161412]
            "
          >
            Instagram
          </h2>
        </div>

        <div className="relative">
          <button
            onClick={prevSlide}
            className="
              absolute
              left-[-20px]
              top-1/2
              -translate-y-1/2
              z-10
            "
          >
            <ChevronLeft size={36} />
          </button>

          <button
            onClick={nextSlide}
            className="
              absolute
              right-[-20px]
              top-1/2
              -translate-y-1/2
              z-10
            "
          >
            <ChevronRight size={36} />
          </button>

          <div className="grid md:grid-cols-3 gap-8">
            {posts
              .slice(index, index + 3)
              .map((post, i) => (
                <div
                  key={i}
                  className="
                    border
                    border-[#e5e5e5]
                    p-4
                  "
                >
                  <img
                    src={post.image}
                    alt=""
                    className="
                      w-full
                      h-[420px]
                      object-cover
                    "
                  />

                  <p
                    className="
                      mt-5
                      text-[16px]
                      leading-relaxed
                      text-[#161412]
                    "
                  >
                    {post.caption}
                  </p>
                </div>
              ))}
          </div>
        </div>

        <div className="flex justify-center mt-14">
          <button
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
          </button>
        </div>
      </div>
    </section>
  );
};

export default InstagramSection;
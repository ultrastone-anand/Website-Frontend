import { ChevronLeft, ChevronRight } from "lucide-react";

const stones = [
  {
    title: "PETRIFIED WOOD",
    category: "PRECIOUS STONE",
    image:
      "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1200&q=80",
    description:
      "Petrified Wood is a grounding and stabilizing stone that promotes patience, strength, and ancient wisdom. It enhances resilience, emotional balance, and connection to nature.",
  },
];

export default function PreciousStoneSection() {
  const stone = stones[0];

  return (
    <section className="bg-[#f5f5f5]">
      {/* Heading */}
      <div className="max-w-[1500px] mx-auto px-8 py-8">
        <h2 className="text-5xl font-bold inline-block relative">
          The Luxury of Precious Stones

          <span className="absolute left-1/2 -translate-x-1/2 -bottom-3 h-1.5 w-24 bg-red-600" />
        </h2>
      </div>

      {/* Hero */}
      <div
        className="
          relative
          overflow-hidden
          min-h-[650px]
          flex
          items-center
        "
        style={{
          background:
            "linear-gradient(90deg,#2f1405 0%, #7a5730 35%, #c8a06a 100%)",
        }}
      >
        <div className="max-w-[1500px] mx-auto px-8 w-full">
          <div className="grid lg:grid-cols-2 items-center">

            {/* Left Content */}
            <div className="max-w-[500px] z-10">
              <p className="text-white/80 tracking-[4px] text-sm mb-4">
                {stone.category}
              </p>

              <h3 className="text-white text-6xl font-bold tracking-[4px] mb-6">
                {stone.title}
              </h3>

              <p className="text-white/90 text-xl leading-relaxed mb-8">
                {stone.description}
              </p>

              <button className="border border-white text-white px-8 py-3 hover:bg-white hover:text-black transition">
                Explore More
              </button>
            </div>

            {/* Stone Image */}
            <div className="relative flex justify-center">
              <img
                src={stone.image}
                alt={stone.title}
                className="
                  max-h-[520px]
                  object-contain
                  drop-shadow-2xl
                "
              />
            </div>

          </div>
        </div>

        {/* Navigation */}
        <div
          className="
            absolute
            right-10
            top-1/2
            -translate-y-1/2
            text-white
            uppercase
            tracking-[3px]
            text-sm
            space-y-4
          "
        >
          <button className="block">Next</button>
          <button className="block">Previous</button>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="flex justify-center py-12">
        <button
          className="
            border
            border-red-400
            px-10
            py-3
            rounded
            hover:bg-red-500
            hover:text-white
            transition
          "
        >
          Explore More
        </button>
      </div>
    </section>
  );
}
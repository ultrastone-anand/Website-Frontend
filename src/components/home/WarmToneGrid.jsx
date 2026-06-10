import { Link } from "react-router-dom";

const collections = [
  {
    title: "MARBLE",
    slug: "marble",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80",
  },
  {
    title: "ULTRA QUARTZ",
    slug: "ultra-quartz",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80",
  },
  {
    title: "QUARTZITE",
    slug: "quartzite",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80",
  },
];

const WarmToneGrid = () => {
  return (
    <section className="bg-[#f5f5f5] py-16 lg:py-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">

        {/* Heading */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold inline-block relative">
            Material Portfolio

            <span
              className="
                absolute
                left-1/2
                -translate-x-1/2
                bottom-[-12px]
                w-[160px]
                h-[6px]
                bg-red-600
              "
            />
          </h2>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
          {collections.map((item) => (
            <Link
              key={item.slug}
              to={`/category/${item.slug}`}
              className="group"
            >
              <div className="overflow-hidden rounded-md">
                <img
                  src={item.image}
                  alt={item.title}
                  className="
                    w-full
                    h-[420px]
                    lg:h-[500px]
                    object-cover
                    transition-transform
                    duration-700
                    group-hover:scale-105
                  "
                />
              </div>

              <h3 className="mt-4 text-[22px] font-medium tracking-wide">
                {item.title}
              </h3>
            </Link>
          ))}
        </div>

        {/* Button */}
        <div className="flex justify-center mt-16">
          <button
            className="
              px-10
              py-3
              border
              border-red-400
              rounded
              text-black
              hover:bg-red-500
              hover:text-white
              transition-all
            "
          >
            Explore More
          </button>
        </div>

      </div>
    </section>
  );
};

export default WarmToneGrid;
import { Link, useNavigate } from "react-router-dom";

const collections = [
  {
    title: "MARBLE",
    slug: "marble",
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "ULTRA QUARTZ",
    slug: "ultra-quartz",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "QUARTZITE",
    slug: "quartzite",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
  },
];

const WarmToneGrid = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-[#f5f5f5] py-20">
      <div className="max-w-[1650px] mx-auto px-6 xl:px-10">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2
            className="
              text-[38px]
              md:text-[52px]
              text-[#161412]
              inline-block
              relative
            "
            style={{
              fontFamily:
                '"Cormorant Garamond", serif',
            }}
          >
            Material{" "}
            <span className="relative inline-block">
              Portfolio
              <span
                className="
                  absolute
                  left-0
                  bottom-[-8px]
                  w-full
                  h-[4px]
                  bg-[#c91f26]
                "
              />
            </span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8 xl:gap-12">
          {collections.map((item) => (
            <Link
              key={item.slug}
              to={`/product-category/${item.slug}`}
              className="group"
            >
              <div className="overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="
                    w-full
                    h-[350px]
                    md:h-[450px]
                    object-cover
                    duration-700
                    group-hover:scale-105
                  "
                />
              </div>

              <h3
                className="
                  mt-5
                  text-[20px]
                  tracking-wide
                  text-[#161412]
                "
                style={{
                  fontFamily:
                    "Montserrat, sans-serif",
                }}
              >
                {item.title}
              </h3>
            </Link>
          ))}
        </div>

        {/* Button */}
        <div className="flex justify-center mt-16">
          <button
            onClick={() => navigate("/categories")}
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

export default WarmToneGrid;
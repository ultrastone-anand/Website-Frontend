const categories = [
  {
    title: "MARBLE",
    desc: "Timeless. Elegant.",
    image:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "GRANITE",
    desc: "Strong. Enduring.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "QUARTZ",
    desc: "Engineered. Exceptional.",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "ONYX",
    desc: "Translucent. Luxurious.",
    image:
      "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?q=80&w=1200&auto=format&fit=crop",
  },
];

const IntroSection = () => {
  return (
    <section className="bg-white py-[110px]">
      <div className="mx-auto max-w-[1650px] px-6 xl:px-12">
        <div className="flex flex-col justify-between gap-10 lg:flex-row">
          <div>
            <p
              className="flex items-center gap-5 text-[24px] font-bold uppercase tracking-[0.02em] text-[#111]"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              OUR COLLECTION
              <span className="text-[32px] font-normal text-[#D67A1C]">
                →
              </span>
            </p>

            <h2
              className="mt-8 text-[65px] leading-[1.05] text-[#111]"
              style={{
                fontFamily: '"Cormorant Garamond", serif',
              }}
            >
              curated by nature.
              <br />
              chosen for you.
            </h2>
          </div>

          <div className="flex flex-col items-start lg:items-end">
            <p
              className="max-w-[390px] text-left text-[20px] leading-[1.45] text-[#555] lg:text-right"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Explore our exclusive range of natural and engineered stones, each
              piece a masterpiece.
            </p>

            <button
              className="mt-8 border border-[#777] px-10 py-4 text-[18px] font-medium tracking-[0.02em] text-[#222] transition-all duration-300 hover:bg-black hover:text-white"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              DISCOVER SPACES{" "}
              <span className="ml-3 text-[#D67A1C]">→</span>
            </button>
          </div>
        </div>

        <div className="mt-[90px] grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((item) => (
            <div key={item.title} className="group text-center">
              <div className="overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>

              <h3
                className="mt-7 text-[24px] font-semibold tracking-[0.03em] text-[#111]"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {item.title}
              </h3>

              <p
                className="mt-3 text-[20px] text-[#666]"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
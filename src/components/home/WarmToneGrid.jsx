import { Link } from "react-router-dom";

const products = [
  {
    title: "AFRICAN LAPIS LAZULI",
    meta: "Marble • Polished • 2CM",
    slug: "african-lapis-lazuli",
    image:
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "AMAZONITE",
    meta: "Quartzite • Polished • 3CM",
    slug: "amazonite",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "AYRES BROWN",
    meta: "Granite • Polished • 2CM",
    slug: "ayres-brown",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "ARISTON LEATHER",
    meta: "Quartz • Polished • 2CM",
    slug: "ariston-leather",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
  },
];

const stoneTypes = [
  "Browse",
  "Marble",
  "Quartz",
  "Granite",
  "Quartzite",
  "Onyx",
  "Travertine",
  "Limestone",
  "Dolomite",
  "Soapstone",
  "Precious Stone",
  "Slate",
  "Stoneglass",
];

const WarmToneGrid = () => {
  return (
    <section className="bg-white py-[24px]">
      <div className="mx-auto max-w-[1650px] px-6 xl:px-[52px]">
        {/* Header */}
        <div className="mb-[44px] flex items-center justify-between">
          <h2
            className="flex items-center gap-7 text-[28px] font-bold uppercase tracking-[0.01em] text-[#111]"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            FEATURED STONES
            <span className="text-[28px] font-normal text-[#d97918]">→</span>
          </h2>

          <div className="flex items-center gap-7 text-[34px] text-[#4a4a4a]">
            <button className="leading-none transition hover:text-black">←</button>
            <button className="leading-none transition hover:text-black">→</button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[170px_1fr] xl:grid-cols-[180px_1fr]">
          {/* Sidebar */}
          <aside className="hidden border-r border-[#d0d0d0] pr-6 lg:block">
            <h3
              className="mb-5 text-[20px] font-bold uppercase tracking-[0.02em] text-[#111]"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              STONE TYPE
            </h3>

            <div className="space-y-[9px]">
              {stoneTypes.map((item, index) => (
                <button
                  key={item}
                  className={`block text-left text-[14px] ${
                    index === 0
                      ? "border-l-2 border-[#d97918] pl-3 font-semibold text-[#111]"
                      : "pl-3 text-[#5f5f5f]"
                  }`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mt-6 border-t border-[#bdbdbd] pt-4">
              <h4
                className="mb-3 text-[14px] font-bold uppercase text-[#111]"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                FILTER BY
              </h4>

              {["Color", "Finish", "Application"].map((item) => (
                <button
                  key={item}
                  className="flex w-full items-center justify-between py-[5px] pl-3 text-left text-[14px] text-[#5f5f5f]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {item}
                  <span className="text-[16px]">⌄</span>
                </button>
              ))}
            </div>
          </aside>

          {/* Product Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {products.map((item) => (
              <Link
                key={item.slug}
                to={`/product/${item.slug}`}
                className="group text-center"
              >
                <div className="overflow-hidden bg-[#f1f1f1]">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="aspect-[4/5.7] w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>

                <h3
                  className="mt-5 text-[22px] font-bold uppercase leading-tight text-[#111]"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {item.title}
                </h3>

                <p
                  className="mt-2 text-[14px] text-[#5f5f5f]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {item.meta}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WarmToneGrid;
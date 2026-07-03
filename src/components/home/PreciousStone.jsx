import { Link } from "react-router-dom";

const applications = [
  {
    title: "BATHROOM",
    desc: "Luxury Vanities",
    image:
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "KITCHENS",
    desc: "Statement Countertops",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "EXTERIORS",
    desc: "Architectural Facades",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1200&auto=format&fit=crop",
  },
];

const PreciousStoneSection = () => {
  return (
    <section className="bg-[#222221] py-[72px]">
      <div className="mx-auto grid max-w-[1650px] grid-cols-1 gap-14 px-6 xl:px-[52px] lg:grid-cols-[420px_1fr]">
        {/* Left Content */}
        <div className="flex flex-col justify-center">
          <p
            className="flex items-center gap-7 text-[22px] font-bold uppercase tracking-[0.01em] text-white"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            APPLICATIONS
            <span className="text-[26px] font-normal text-[#D67A1C]">→</span>
          </p>

          <h2
            className="mt-9 text-[42px] font-black uppercase leading-[1.35] tracking-[0.18em] text-white md:text-[50px]"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            ONE STONE.
            <br />
            ENDLESS
            <br />
            POSSIBILITIES
          </h2>

          <p
            className="mt-11 max-w-[430px] text-[16px] leading-[1.45] text-white/85"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            From elegant interiors to grand exteriors, Ultra Stones elevates
            every space with natural perfection.
          </p>

          <Link
            to="/categories"
            className="mt-10 inline-flex w-fit items-center border border-white/80 px-8 py-4 text-[14px] font-bold uppercase tracking-[0.01em] text-white transition duration-300 hover:bg-white hover:text-black"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            VIEW ALL COLLECTION
            <span className="ml-8 text-[22px] font-normal text-[#D67A1C]">
              →
            </span>
          </Link>
        </div>

        {/* Application Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {applications.map((item) => (
            <Link
              key={item.title}
              to="/categories"
              className="group text-center"
            >
              <div className="overflow-hidden bg-black">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-[420px] w-full object-cover transition duration-700 group-hover:scale-105 lg:h-[520px]"
                />
              </div>

              <h3
                className="mt-4 text-[15px] font-medium uppercase text-white"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {item.title}
              </h3>

              <p
                className="mt-2 text-[16px] text-white/45"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {item.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PreciousStoneSection;
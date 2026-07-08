import premiumIcon from "../../assets/home/premium.png";
import inventoryIcon from "../../assets/home/inventory.png";
import qualityIcon from "../../assets/home/quality.png";
import industrialIcon from "../../assets/home/industrial.png";
import supportIcon from "../../assets/home/support.png";

const features = [
  {
    title: "PREMIUM SELECTION",
    desc: "Handpicked natural stone and engineered surfaces from around the world.",
    icon: premiumIcon,
  },
  {
    title: "LARGE INVENTORY",
    desc: "Extensive range of colors, patterns, and finishes ready to explore.",
    icon: inventoryIcon,
  },
  {
    title: "QUALITY CHECKED",
    desc: "Every slab is inspected for color, finish, and consistency at every step.",
    icon: qualityIcon,
  },
  {
    title: "FOR EVERY PROJECT",
    desc: "Perfect for residential and commercial spaces, inside and out.",
    icon: industrialIcon,
  },
  {
    title: "EXPERT CHOICE",
    desc: "Our team is here to help you choose the right surface with confidence.",
    icon: supportIcon,
  },
];

const LatestBlogsSection = () => {
  return (
    <section className="bg-white py-[40px]">
      <div className="mx-auto max-w-[1850px] px-6">
        <div className="bg-white px-10 py-10 shadow-[0_8px_14px_rgba(0,0,0,0.22)]">
          <div className="text-center">
<p
  className="text-[18px] font-bold uppercase tracking-[0.03em] text-[#111]"
  style={{ fontFamily: "Montserrat, sans-serif" }}
>
  WHY CHOOSE <span className="text-[#FF7F00]">ULTRA STONES</span>
</p>

            <h2
              className="mt-5 text-[40px] leading-none text-[#111]"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              Quality. Selection. Service.
            </h2>

            <p
              className="mt-5 text-[27px] italic leading-none text-[#FF7F00]"
              style={{ fontFamily: '"Cormorant Garamond", serif' }}
            >
              Selected with Care. Supplied with Confidence.
            </p>

            <p
              className="mx-auto mt-6 max-w-[620px] text-[14px] leading-[1.25] text-[#555]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              We are committed to providing premium stones surfaces and an
              exceptional experience from start to finish
            </p>
          </div>

          <div className="mt-[80px] grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
            {features.map((item) => (
              <div key={item.title} className="text-center">
              <div className="mx-auto flex h-[110px] w-[110px] items-center justify-center rounded-full border-[3px] border-[#FFAD50]">
  <img
    src={item.icon}
    alt={item.title}
    className="h-[48px] w-[48px] object-contain"
  />
</div>

                <h3
                  className="mt-8 text-[17px] font-bold uppercase text-[#111]"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {item.title}
                </h3>

                <p
                  className="mx-auto mt-5 max-w-[190px] text-[12px] leading-[1.25] text-[#555]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {item.desc}
                </p>

<div className="mt-8 cursor-pointer text-[22px] text-[#FF8000] transition-colors duration-300 hover:text-[#8D8D8D]">
  →
</div>              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestBlogsSection;
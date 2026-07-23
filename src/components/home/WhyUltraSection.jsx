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

const WhyUltraSection = () => {
  return (
    <section className="bg-white py-6 sm:py-10">
      <div className="mx-auto max-w-[1850px] px-4 sm:px-6">
        <div
          className="
            bg-white
            px-4
            py-7
            shadow-[0_6px_16px_rgba(0,0,0,0.16)]
            sm:px-8
            sm:py-10
            lg:px-10
          "
        >
          <div className="text-center">
            <p
              className="
                text-[14px]
                font-bold
                uppercase
                tracking-[0.03em]
                text-[#111]
                sm:text-[16px]
                lg:text-[18px]
              "
              style={{
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              WHY CHOOSE{" "}
              <span className="text-[#B45309]">
                ULTRA STONES
              </span>
            </p>

            <h2
              className="
                mt-3
                text-[28px]
                leading-[1.05]
                text-[#111]
                sm:mt-4
                sm:text-[34px]
                lg:mt-5
                lg:text-[40px]
              "
              style={{
                fontFamily: '"Cormorant Garamond", serif',
              }}
            >
              Quality. Selection. Service.
            </h2>

            <p
              className="
                mt-3
                text-[18px]
                italic
                leading-[1.1]
                text-[#B45309]
                sm:mt-4
                sm:text-[22px]
                lg:mt-5
                lg:text-[27px]
              "
              style={{
                fontFamily: '"Cormorant Garamond", serif',
              }}
            >
              Selected with Care. Supplied with Confidence.
            </p>

            <p
              className="
                mx-auto
                mt-4
                max-w-[620px]
                text-[12px]
                leading-[1.5]
                text-[#555]
                sm:mt-5
                sm:text-[13px]
                lg:mt-6
                lg:text-[14px]
              "
              style={{
                fontFamily: "Inter, sans-serif",
              }}
            >
              We are committed to providing premium stone surfaces and an
              exceptional experience from start to finish.
            </p>
          </div>

          <div
            className="
              mt-9
              grid
              grid-cols-2
              gap-x-4
              gap-y-8
              sm:mt-12
              sm:grid-cols-2
              sm:gap-10
              md:grid-cols-3
              lg:mt-[70px]
              lg:grid-cols-5
              lg:gap-8
            "
          >
            {features.map((item, index) => (
              <div
                key={item.title}
                className={`
                  text-center
                  ${
                    index === features.length - 1
                      ? "col-span-2 mx-auto max-w-[220px] md:col-span-1 md:max-w-none"
                      : ""
                  }
                `}
              >
                <div
                  className="
                    mx-auto
                    flex
                    h-[76px]
                    w-[76px]
                    items-center
                    justify-center
                    rounded-full
                    border-2
                    border-[#FFAD50]
                    sm:h-[90px]
                    sm:w-[90px]
                    lg:h-[110px]
                    lg:w-[110px]
                    lg:border-[3px]
                  "
                >
                  <img
                    src={item.icon}
                    alt={item.title}
                    className="
                      h-[34px]
                      w-[34px]
                      object-contain
                      sm:h-[40px]
                      sm:w-[40px]
                      lg:h-[48px]
                      lg:w-[48px]
                    "
                  />
                </div>

                <h3
                  className="
                    mt-4
                    text-[12px]
                    font-bold
                    uppercase
                    leading-[1.2]
                    text-[#111]
                    sm:mt-5
                    sm:text-[14px]
                    lg:mt-8
                    lg:text-[17px]
                  "
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  {item.title}
                </h3>

                <p
                  className="
                    mx-auto
                    mt-2
                    max-w-[165px]
                    text-[10px]
                    leading-[1.4]
                    text-[#555]
                    sm:mt-3
                    sm:max-w-[190px]
                    sm:text-[11px]
                    lg:mt-5
                    lg:text-[12px]
                    lg:leading-[1.25]
                  "
                  style={{
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {item.desc}
                </p>

                {/* <div
                  className="
                    mt-3
                    hidden
                    cursor-pointer
                    text-[22px]
                    text-[#FF8000]
                    transition-colors
                    duration-300
                    hover:text-[#8D8D8D]
                    lg:block
                  "
                >
                  →
                </div> */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUltraSection;
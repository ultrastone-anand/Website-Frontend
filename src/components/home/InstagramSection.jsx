import { useNavigate } from "react-router-dom";
import { getOptimizedImageUrl } from "../../utils/Mediahelper";

const InstagramSection = () => {
  const navigate = useNavigate();

  const contactImage =
    "https://cdn.ultrastone.in/Home%20Page/contact_home.jpg";

  return (
    <section className="mb-[70px] bg-white py-[48px]">
      <div className="mx-auto">
        <div className="relative overflow-hidden">
          <img
            src={getOptimizedImageUrl(contactImage, 1600, 72)}
            srcSet={`
              ${getOptimizedImageUrl(contactImage, 640, 68)} 640w,
              ${getOptimizedImageUrl(contactImage, 1024, 70)} 1024w,
              ${getOptimizedImageUrl(contactImage, 1600, 72)} 1600w,
              ${getOptimizedImageUrl(contactImage, 1920, 74)} 1920w
            `}
            sizes="100vw"
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,1)_0%,rgba(0,0,0,0.70)_33%,rgba(0,0,0,0.20)_100%)]" />

          <div className="relative z-10 min-h-[520px] px-10 py-20 lg:px-[70px]">
            <div className="max-w-[520px]">
              <p
                className="text-[16px] font-bold uppercase text-[#FF8000]"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                READY TO BEGIN?
              </p>

              <h2
                className="mt-10 text-[44px] leading-[1.08] text-white md:text-[52px]"
                style={{ fontFamily: '"Cormorant Garamond", serif' }}
              >
                Find the perfect surface
                <br />
                for your next project.
              </h2>

              <div className="mt-9 h-[2px] w-[78px] bg-[#B45309]" />

              <p
                className="mt-9 max-w-[380px] text-[14px] leading-[1.35] text-white/85"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Explore our curated collection of natural stone and engineered
                surfaces, crafted to inspire and built to last.
              </p>

              <div className="mt-9 flex flex-wrap gap-14">
                <button
                  className="cursor-pointer bg-[#B45309] px-7 py-4 text-[13px] font-bold uppercase text-white transition-all duration-300 hover:bg-white hover:text-[#B45309]"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                  onClick={() => navigate("/contact")}
                >
                  CONTACT OUR TEAM
                  <span className="ml-4">→</span>
                </button>

                <button
                  className="cursor-pointer border border-white/70 px-7 py-4 text-[13px] font-bold uppercase text-white transition-all duration-300 hover:bg-white hover:text-[#161412]"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                  onClick={() => navigate("/categories")}
                >
                  VIEW COLLECTIONS
                  <span className="ml-4 text-[#FF8000]">→</span>
                </button>
              </div>

              <p
                className="mt-10 text-[14px] leading-[1.35] text-white/45"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Established 2013 • 500+ Stones
                <br />
                Trusted by Designers, Fabricators & Builders
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstagramSection;
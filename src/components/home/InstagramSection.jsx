import { useNavigate } from "react-router-dom";

const InstagramSection = () => {

  const navigate = useNavigate();

  return (
    <section className="bg-white py-[48px]">
      <div className="mx-auto">
        <div
          className="relative overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(0,0,0,.88) 0%, rgba(0,0,0,.70) 33%, rgba(0,0,0,.20) 100%), url('https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1800&auto=format&fit=crop')",
          }}
        >
          <div className="min-h-[520px] px-10 py-20 lg:px-[70px]">
            <div className="max-w-[520px]">
              <p
                className="text-[16px] font-bold uppercase text-[#ff8a00]"
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

              <div className="mt-9 h-[2px] w-[78px] bg-[#ff8a00]" />

              <p
                className="mt-9 max-w-[380px] text-[14px] leading-[1.35] text-white/85"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Explore our curated collection of natural stone and engineered
                surfaces, crafted to inspire and built to last.
              </p>

              <div className="mt-9 flex flex-wrap gap-14">
                <button
                  className="bg-[#ff8a00] px-7 py-4 text-[13px] font-bold uppercase text-white hover:bg-white hover:text-[#ff8a00] cursor-pointer transition-all duration-300"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                  onClick={() => navigate("/contact")}
                >
                  CONTACT OUR TEAM
                  <span className="ml-4">→</span>
                </button>

                <button
                  className="border border-white/70 px-7 py-4 text-[13px] font-bold uppercase text-white cursor-pointer transition-all duration-300 hover:bg-white hover:text-[#161412]"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                  onClick={() => navigate("/categories")}
                >
                  VIEW COLLECTIONS
                  <span className="ml-4 text-[#ff8a00]">→</span>
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
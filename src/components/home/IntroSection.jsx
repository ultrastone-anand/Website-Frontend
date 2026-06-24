const IntroSection = () => {
  return (
    <section className="bg-[#f5f5f5] py-24">
      <div className="max-w-[1650px] mx-auto px-6 xl:px-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left Content */}
          <div className="max-w-[650px]">
            <h2
              className="
                text-[70px]
                md:text-[90px]
                font-bold
                text-[#c91f26]
                leading-none
                mb-3
              "
              style={{
                fontFamily: "Montserrat, sans-serif",
              }}
            >
              500+
            </h2>

            <h3
              className="
                text-[34px]
                md:text-[42px]
                text-[#161412]
                leading-tight
                mb-6
              "
              style={{
                fontFamily:
                  '"Cormorant Garamond", serif',
              }}
            >
              Finest Natural and Engineered{" "}
              <span className="relative inline-block">
                Stones
                <span
                  className="
                    absolute
                    left-0
                    bottom-[-6px]
                    w-full
                    h-[4px]
                    bg-[#c91f26]
                  "
                />
              </span>
            </h3>

            <p className="text-[#555] leading-[1.9] text-[15px] mb-10">
              As a leading distributor across the United States,
              we pride ourselves on offering an extensive
              selection of the highest quality materials to meet
              your design and construction needs. We are
              dedicated to bringing the timeless beauty of
              natural and engineered stones to your projects.
            </p>

            <button
              className="
                border
                border-[#c91f26]
                text-[#161412]
                px-8
                py-3
                text-sm
                hover:bg-[#c91f26]
                hover:text-white
                duration-300
              "
            >
              Read More
            </button>
          </div>

          {/* Right Image */}
          <div className="flex justify-center lg:justify-end">
            <img
              src="https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=1400&auto=format&fit=crop"
              alt="Luxury Kitchen"
              className="
                w-full
                max-w-[720px]
                h-[500px]
                object-cover
              "
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
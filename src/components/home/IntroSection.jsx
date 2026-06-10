const IntroSection = () => {
  return (
    <section className="bg-[#f5f5f5] py-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <div className="max-w-[600px]">
            <h2 className="text-[80px] md:text-[100px] font-bold text-red-600 leading-none mb-6">
              500+
            </h2>

            <h3 className="text-3xl md:text-4xl font-bold text-black mb-8">
              Finest Natural and Engineered Stones
            </h3>

            <p className="text-lg leading-relaxed text-gray-800 mb-10">
              As a leading distributor across the United States, we pride
              ourselves on offering an extensive selection of the highest
              quality materials to meet your design and construction needs.
              We are dedicated to bringing the timeless beauty of natural and
              engineered stones to your projects.
            </p>

            <button
              className="
                border border-red-500
                text-black
                px-8 py-3
                rounded-md
                hover:bg-red-500
                hover:text-white
                transition-all
              "
            >
              Read More
            </button>
          </div>

          {/* Right Image */}
          <div className="flex justify-center lg:justify-end">
            <div >
              <img
                src="https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80"
                alt="Luxury Kitchen"
                className="
                  w-full
                  max-w-[650px]
                  h-[420px]
                  object-cover
                "
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default IntroSection;
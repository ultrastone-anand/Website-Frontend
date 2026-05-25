const FeaturedStone = ({ title, reverse }) => {
  return (
    <section className="section-space">

      <div className={`container-custom grid lg:grid-cols-2 gap-20 items-center ${reverse ? "lg:flex-row-reverse" : ""}`}>

        <div className={`${reverse ? "lg:order-2" : ""}`}>

          <img
            src="https://images.unsplash.com/photo-1494526585095-c41746248156"
            alt=""
            className="w-full h-[700px] object-cover"
          />

        </div>

        <div className={`${reverse ? "lg:order-1" : ""}`}>

          <p className="tracking-[4px] uppercase text-sm mb-6 text-[#8b7355]">
            Featured Stone
          </p>

          <h2
            className="text-6xl mb-8"
            style={{
              fontFamily: "Cormorant Garamond"
            }}
          >
            {title}
          </h2>

          <p className="leading-8 text-gray-700 mb-10">
            Elegant warm stone textures crafted to create
            timeless luxurious spaces with modern aesthetics.
          </p>

          <button className="border border-black px-10 py-4 tracking-[3px] text-sm hover:bg-black hover:text-white duration-500">
            EXPLORE
          </button>

        </div>

      </div>

    </section>
  )
}

export default FeaturedStone
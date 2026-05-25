const CollectionsSlider = () => {
  return (
    <section className="section-space bg-[#ece7e1]">

      <div className="container-custom">

        <h2
          className="text-6xl mb-16"
          style={{
            fontFamily: "Cormorant Garamond"
          }}
        >
          More Collections
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {[1,2,3].map((item) => (

            <div key={item}>

              <img
                src="https://images.unsplash.com/photo-1494526585095-c41746248156"
                alt=""
                className="h-[500px] object-cover"
              />

            </div>

          ))}

        </div>

      </div>

    </section>
  )
}

export default CollectionsSlider
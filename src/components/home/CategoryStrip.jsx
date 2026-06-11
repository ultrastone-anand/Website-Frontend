const CategoryStrip = () => {
  return (
    <section className="bg-[#1d1d1d] text-white">

      <div className="grid grid-cols-2 md:grid-cols-4">

        {[
          "ABOUT WARM TONES",
          "WARM TONES COLLECTION",
          "INSTAGRAM",
          "MORE COLLECTIONS"
        ].map((item, index) => (

          <div
            key={index}
            className="border border-white/10 py-10 text-center tracking-[3px] text-xs md:text-sm"
          >
            {item}
          </div>

        ))}

      </div>

    </section>
  )
}

export default CategoryStrip
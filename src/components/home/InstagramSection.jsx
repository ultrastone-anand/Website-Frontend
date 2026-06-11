const InstagramSection = () => {

  const posts = [1,2,3,4]

  return (
    <section
      id="instagram"
      className="section-space"
    >

      <div className="container-custom">

        <div className="grid md:grid-cols-4 gap-6">

          {posts.map((item) => (

            <a
              key={item}
              href="https://www.instagram.com/ultrastones/?hl=en"
              target="_blank"
              className="relative group overflow-hidden"
            >

              <img
                src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
                alt=""
                className="h-[300px] object-cover group-hover:scale-110 duration-700"
              />

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 duration-500 flex items-center justify-center text-white tracking-[4px]">

                VIEW

              </div>

            </a>

          ))}

        </div>

      </div>

    </section>
  )
}

export default InstagramSection
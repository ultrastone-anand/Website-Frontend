import { motion } from "framer-motion"

const HeroSection = () => {

  const scrollToCollections = () => {

    document
      .getElementById("collections")
      ?.scrollIntoView({
        behavior: "smooth"
      })

  }

  return (
    <section className="relative h-screen overflow-hidden">

      <motion.img
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2 }}
        src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 h-full flex items-center">

        <div className="container-custom">

          <motion.div
            initial={{
              opacity: 0,
              y: 60
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 1
            }}
            className="max-w-4xl"
          >

            <p className="text-white tracking-[5px] uppercase mb-5">
              Luxury Stone Collection
            </p>

            <h1
              className="text-white text-7xl md:text-[120px] leading-none mb-8"
              style={{
                fontFamily:
                  "Cormorant Garamond"
              }}
            >
              Ultra Warm
              <br />
              Tones
            </h1>

            <button
              onClick={scrollToCollections}
              className="border border-white text-white px-10 py-4 tracking-[4px] hover:bg-white hover:text-black duration-500"
            >
              EXPLORE COLLECTION
            </button>

          </motion.div>

        </div>

      </div>

    </section>
  )
}

export default HeroSection
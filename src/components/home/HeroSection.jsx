import { motion } from "framer-motion";

const HeroSection = () => {
  const scrollToCollections = () => {
    document
      .getElementById("collections")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  };

  return (
    <section className="relative h-[90vh] overflow-hidden pt-[110px]">
      {/* Background Video */}
      <motion.video
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2 }}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover "
      >
        <source
          src="https://res.cloudinary.com/dx0u8csf4/video/upload/v1780602872/lv_0_20240514200655_vjgxsa.mp4"
          type="video/mp4"
        />
      </motion.video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Content */}
      <div className="relative z-10 flex items-center h-full">
        <div className="max-w-7xl mx-auto w-full px-6 lg:px-16">
          <motion.div
            initial={{
              opacity: 0,
              y: 60,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 1,
            }}
            className="max-w-4xl"
          >


            {/* Main Heading */}
            <h1 className="text-white font-light leading-[1] text-3xl md:text-4xl lg:text-6xl mb-8">
              Elevate Your Space
              <br />
              with Timeless Marble & Stones
            </h1>

            {/* Description */}
            <p className="text-white/90 text-lg md:text-xl leading-relaxed max-w-3xl mb-10">
              Transform any space into a masterpiece with our luxurious marble
              and stone selection. Whether it's for countertops, flooring, or
              statement accents, we have what you need.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
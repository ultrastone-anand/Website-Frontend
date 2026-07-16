import { lazy } from "react";

import Navbar from "../components/common/Navbar";
import HeroSection from "../components/home/HeroSection";
import LazySection from "../components/common/LazySection";

const OurCollectionSection = lazy(() =>
  import("../components/home/OurCollectionSection")
);

const FeaturedStones = lazy(() =>
  import("../components/home/FeaturedStones")
);

const ApplicationSection = lazy(() =>
  import("../components/home/ApplicationSection")
);

const InspirationGallery = lazy(() =>
  import("../components/home/InspirationGallery")
);

const WhyUltraSection = lazy(() =>
  import("../components/home/WhyUltraSection")
);

const ContactusSection = lazy(() =>
  import("../components/home/ContactusSection")
);

const Footer = lazy(() =>
  import("../components/common/Footer")
);

const Home = () => {
  return (
    <main className="overflow-hidden">
      {/* Above the fold: load immediately */}
      <Navbar />
      <HeroSection />

      {/* Below the fold: load only near the viewport */}
      <LazySection
        minHeight="950px"
        rootMargin="500px"
      >
        <OurCollectionSection />
      </LazySection>

      <LazySection
        minHeight="850px"
        rootMargin="400px"
      >
        <FeaturedStones />
      </LazySection>

      <LazySection
        minHeight="760px"
        rootMargin="350px"
      >
        <ApplicationSection />
      </LazySection>

      <LazySection
        minHeight="900px"
        rootMargin="300px"
      >
        <InspirationGallery />
      </LazySection>

      <LazySection
        minHeight="650px"
        rootMargin="250px"
      >
        <WhyUltraSection />
      </LazySection>

      <LazySection
        minHeight="620px"
        rootMargin="250px"
      >
        <ContactusSection />
      </LazySection>

      <LazySection
        minHeight="450px"
        rootMargin="200px"
      >
        <Footer />
      </LazySection>
    </main>
  );
};

export default Home;
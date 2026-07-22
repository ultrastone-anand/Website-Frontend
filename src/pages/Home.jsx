// src/pages/Home.jsx

import { lazy, Suspense } from "react";

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

const InstagramSection = lazy(() =>
  import("../components/home/InstagramSection")
);

const ContactusSection = lazy(() =>
  import("../components/home/ContactusSection")
);

const Footer = lazy(() =>
  import("../components/common/Footer")
);

const Home = () => {
  return (
    <main className="w-full overflow-x-hidden">
      {/* Above the fold */}
      <Navbar />
      <HeroSection />

      {/* Below-the-fold sections */}
      <LazySection
        minHeight="950px"
        rootMargin="500px"
      >
        <OurCollectionSection />
      </LazySection>

      <LazySection
        minHeight="800px"
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
        minHeight="350px"
        rootMargin="200px"
      >
        <InstagramSection />
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

      {/* Footer must not use LazySection minHeight */}
      <Suspense
        fallback={
          <div
            className="h-[320px] w-full bg-black"
            aria-hidden="true"
          />
        }
      >
        <Footer />
      </Suspense>
    </main>
  );
};

export default Home;
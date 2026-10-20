// src/pages/Home.jsx

import { lazy } from "react";

import HeroSection from "../components/home/HeroSection";
import LazySection from "../components/common/LazySection";

/* =========================================================
   LAZY LOADED SECTIONS
========================================================= */

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

/* =========================================================
   HOME PAGE
========================================================= */

const Home = () => {
  return (
    <main className="w-full overflow-x-hidden">

      {/* =================================================
          HERO SECTION

          Critical above-the-fold content.
          Load immediately.
      ================================================= */}

      <HeroSection />

      {/* =================================================
          OUR COLLECTION
      ================================================= */}

      <LazySection
        minHeight="850px"
        rootMargin="200px"
      >
        <OurCollectionSection />
      </LazySection>

      {/* =================================================
          FEATURED STONES
      ================================================= */}

      <LazySection
        minHeight="750px"
        rootMargin="200px"
      >
        <FeaturedStones />
      </LazySection>

      {/* =================================================
          APPLICATIONS
      ================================================= */}

      <LazySection
        minHeight="760px"
        rootMargin="150px"
      >
        <ApplicationSection />
      </LazySection>

      {/* =================================================
          INSPIRATION GALLERY
      ================================================= */}

      <LazySection
        minHeight="900px"
        rootMargin="150px"
      >
        <InspirationGallery />
      </LazySection>

      {/* =================================================
          INSTAGRAM
      ================================================= */}

      <LazySection
        minHeight="350px"
        rootMargin="100px"
      >
        <InstagramSection />
      </LazySection>

      {/* =================================================
          WHY ULTRA STONES
      ================================================= */}

      <LazySection
        minHeight="650px"
        rootMargin="150px"
      >
        <WhyUltraSection />
      </LazySection>

      {/* =================================================
          CONTACT
      ================================================= */}

      <LazySection
        minHeight="620px"
        rootMargin="150px"
      >
        <ContactusSection />
      </LazySection>

    </main>
  );
};

export default Home;
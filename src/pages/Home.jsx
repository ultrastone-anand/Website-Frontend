import { lazy } from "react";

import Navbar from "../components/common/Navbar";
import HeroSection from "../components/home/HeroSection";
import LazySection from "../components/common/LazySection";

const IntroSection = lazy(() =>
  import("../components/home/IntroSection")
);

const WarmToneGrid = lazy(() =>
  import("../components/home/WarmToneGrid")
);

const PreciousStoneSection = lazy(() =>
  import("../components/home/PreciousStone")
);

const InspirationGallery = lazy(() =>
  import("../components/home/InspirationGallery")
);

const LatestBlogsSection = lazy(() =>
  import("../components/home/LatestBlogsSection")
);

const InstagramSection = lazy(() =>
  import("../components/home/InstagramSection")
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
        <IntroSection />
      </LazySection>

      <LazySection
        minHeight="850px"
        rootMargin="400px"
      >
        <WarmToneGrid />
      </LazySection>

      <LazySection
        minHeight="760px"
        rootMargin="350px"
      >
        <PreciousStoneSection />
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
        <LatestBlogsSection />
      </LazySection>

      <LazySection
        minHeight="620px"
        rootMargin="250px"
      >
        <InstagramSection />
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
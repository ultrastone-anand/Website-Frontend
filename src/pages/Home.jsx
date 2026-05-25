import Navbar from "../components/common/Navbar"
import HeroSection from "../components/home/HeroSection"
import CategoryStrip from "../components/home/CategoryStrip"
import IntroSection from "../components/home/IntroSection"
import WarmToneGrid from "../components/home/WarmToneGrid"
import FeaturedStone from "../components/home/FeaturedStone"
import InstagramSection from "../components/home/InstagramSection"
import CollectionsSlider from "../components/home/CollectionsSlider"
import Footer from "../components/common/Footer"

const Home = () => {
  return (
    <main className="bg-[#f7f3ee] overflow-hidden">

      <Navbar />

      <HeroSection />

      <CategoryStrip />

      <IntroSection />

      <WarmToneGrid />

      <FeaturedStone
        title="ARABESQUE GOLD"
        reverse={false}
      />

      <FeaturedStone
        title="LUCCICOSO GOLD"
        reverse={true}
      />

      <FeaturedStone
        title="CREMA TAJ"
        reverse={false}
      />

      <InstagramSection />

      <CollectionsSlider />

      <Footer />

    </main>
  )
}

export default Home
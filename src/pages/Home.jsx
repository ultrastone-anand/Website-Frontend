import Navbar from "../components/common/Navbar"
import Footer from "../components/common/Footer"
import HeroSection from "../components/home/HeroSection"
import IntroSection from "../components/home/IntroSection"
import WarmToneGrid from "../components/home/WarmToneGrid"
import PreciousStoneSection from "../components/home/PreciousStone"
import InspirationGallery from "../components/home/InspirationGallery"
import InstagramSection from "../components/home/InstagramSection"
import LatestBlogsSection from "../components/home/LatestBlogsSection"

const Home = () => {
  return (
    <main className="overflow-hidden">

      <Navbar />

      <HeroSection />

      <IntroSection />

      <WarmToneGrid />

      <PreciousStoneSection/>

      <InspirationGallery />

      <LatestBlogsSection />

      <InstagramSection />

      <Footer />

    </main>
  )
}

export default Home
import Navbar from "../components/common/Navbar"
import HeroSection from "../components/home/HeroSection"
import IntroSection from "../components/home/IntroSection"
import WarmToneGrid from "../components/home/WarmToneGrid"
import Footer from "../components/common/Footer"
import { NewsletterSection } from "../components/home/Newsletter"
import CommitmentSection from "../components/home/Commitement"
import PreciousStoneSection from "../components/home/PreciousStone"

const Home = () => {
  return (
    <main className="bg-[#f7f3ee] overflow-hidden">

      <Navbar />

      <HeroSection />

      <IntroSection />

      <WarmToneGrid />

      <PreciousStoneSection/>

      <CommitmentSection />

      <NewsletterSection />

      <Footer />

    </main>
  )
}

export default Home
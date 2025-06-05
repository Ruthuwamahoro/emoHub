import { FinalCTASection } from "@/components/landingPage/CTASection";
import { WhyEmoHubSection } from "@/components/landingPage/EmoHubSection";
import { FAQContactSection } from "@/components/landingPage/FaqSection";
import { FeaturesSection } from "@/components/landingPage/FeatureSection";
import { Footer } from "@/components/landingPage/Footer";
import { EmoHubHero } from "@/components/landingPage/HeroSection";
import { Navbar } from "@/components/landingPage/NavigationBar";

const EmoHubLanding = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <EmoHubHero />
      <WhyEmoHubSection />
      <FeaturesSection />
      {/* <TestimonialsSection /> */}
      <FAQContactSection/>
      <FinalCTASection />
      <Footer />
    </div>
  );
};

export default EmoHubLanding;
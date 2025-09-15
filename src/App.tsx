import { useEffect } from "react";
import { AnimatedHeader } from "./components/AnimatedHeader";
import { AnimatedHeroSection } from "./components/AnimatedHeroSection";
import { AnimatedFeaturesSection } from "./components/AnimatedFeaturesSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { VulnerabilityCategories } from "./components/VulnerabilityCategories";
import { AnimatedTechSpecsSection } from "./components/AnimatedTechSpecsSection";
import { AnimatedCTASection } from "./components/AnimatedCTASection";
import { Footer } from "./components/Footer";
import { useDynamicFavicon } from "./hooks/useDynamicFavicon";

export default function App() {
  useDynamicFavicon();

  // Add smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen">
      <AnimatedHeader />
      <AnimatedHeroSection />
      <AnimatedFeaturesSection />
      <div id="how-it-works">
        <HowItWorksSection />
      </div>
      <VulnerabilityCategories />
      <AnimatedTechSpecsSection />
      <AnimatedCTASection />
      <Footer />
    </div>
  );
}
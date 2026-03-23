/**
 * ALL IN MEDIA - Cinematic Dark Luxury Design
 * Design: Deep black (#050507) base, indigo-to-violet gradient accents
 * Typography: Syne (display) + DM Sans (body)
 * Animation: Framer Motion spring physics, scroll-linked reveals
 */

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import CollaborationSection from "@/components/CollaborationSection";
import ResultsSection from "@/components/ResultsSection";
import VideoSection from "@/components/VideoSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import LoadingScreen from "@/components/LoadingScreen";
import { useState, useEffect } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-[#050507] text-white overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <CollaborationSection />
      <ResultsSection />
      <VideoSection />
      <CTASection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

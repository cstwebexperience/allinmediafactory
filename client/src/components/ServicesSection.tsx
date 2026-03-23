/*
 * Services: Arrogant-Elegant. Short. No fluff descriptions.
 */

import AnimatedSection from "./AnimatedSection";
import { Share2, Video, PenTool, TrendingUp, Search } from "lucide-react";

const services = [
  {
    icon: Share2,
    title: "Social Media",
    tagline: "Noi postăm. Tu crești.",
    gradient: "from-[#6366f1] to-[#7B2FBE]",
  },
  {
    icon: Video,
    title: "Conținut Video",
    tagline: "Filmăm ce vinde.",
    gradient: "from-[#7B2FBE] to-[#a855f7]",
  },
  {
    icon: PenTool,
    title: "Scenarii",
    tagline: "Concepte care convertesc.",
    gradient: "from-[#a855f7] to-[#ec4899]",
  },
  {
    icon: TrendingUp,
    title: "Strategie",
    tagline: "Date, nu presupuneri.",
    gradient: "from-[#ec4899] to-[#7B2FBE]",
  },
  {
    icon: Search,
    title: "SEO",
    tagline: "Pagina 1. Mereu.",
    gradient: "from-[#2D1B69] to-[#6366f1]",
  },
];

export default function ServicesSection() {
  return (
    <section id="servicii" className="relative py-28 md:py-36">
      <div className="container">
        <AnimatedSection>
          <div className="mb-16">
            <div className="w-8 h-[1px] bg-white/15 mb-12" />
            <h2 className="font-['Syne'] font-bold text-3xl md:text-4xl lg:text-5xl leading-[1.1]">
              Ce facem?
              <br />
              <span className="text-white/30">Tot.</span>
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {services.map((service, i) => (
            <AnimatedSection key={service.title} delay={i * 0.08}>
              <div className="group relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.12] transition-all duration-500 hover:bg-white/[0.04] h-full">
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "radial-gradient(ellipse at center, rgba(123,47,190,0.05) 0%, transparent 70%)" }}
                />
                <div className="relative">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon size={18} className="text-white" />
                  </div>
                  <h3 className="font-['Syne'] font-bold text-lg mb-2 text-white">
                    {service.title}
                  </h3>
                  <p className="text-white/30 text-sm font-light italic">
                    {service.tagline}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

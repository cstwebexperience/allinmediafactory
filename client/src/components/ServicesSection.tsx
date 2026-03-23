import AnimatedSection from "./AnimatedSection";
import { Share2, Video, PenTool, TrendingUp, Search } from "lucide-react";

const services = [
  {
    icon: Share2,
    title: "Social Media Management",
    description: "Gestionăm complet prezența ta pe rețelele sociale, de la strategie la postare și interacțiune cu comunitatea.",
    gradient: "from-[#6366f1] to-[#7B2FBE]",
  },
  {
    icon: Video,
    title: "Creare Conținut Video",
    description: "Filmări profesionale și editare video care captează atenția și generează engagement organic masiv.",
    gradient: "from-[#7B2FBE] to-[#a855f7]",
  },
  {
    icon: PenTool,
    title: "Scenarii de Marketing",
    description: "Scenarii creative care convertesc — de la concepte virale la campanii care aduc rezultate concrete.",
    gradient: "from-[#a855f7] to-[#ec4899]",
  },
  {
    icon: TrendingUp,
    title: "Strategie de Creștere",
    description: "Strategii personalizate de creștere online, bazate pe date și optimizate continuu pentru performanță maximă.",
    gradient: "from-[#ec4899] to-[#7B2FBE]",
  },
  {
    icon: Search,
    title: "SEO",
    description: "Optimizare pentru motoarele de căutare în colaborare cu BeeZ Pixel, pentru vizibilitate maximă pe Google.",
    gradient: "from-[#2D1B69] to-[#6366f1]",
  },
];

export default function ServicesSection() {
  return (
    <section
      id="servicii"
      className="relative py-24 md:py-32"
    >
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663467826404/BAAaAcGTQZunD92h83RUvR/services-bg-NcpeNz6tufGu9q5NXw8noh.webp)`,
        }}
      />
      <div className="absolute inset-0 bg-[#050507]/75" />

      <div className="relative container">
        <AnimatedSection>
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full border border-[#7B2FBE]/30 bg-[#7B2FBE]/5 text-[#c4a0f0] text-xs font-medium tracking-widest uppercase mb-6">
              Servicii
            </span>
            <h2 className="font-['Syne'] font-bold text-3xl md:text-4xl lg:text-5xl mb-4">
              Ce facem{" "}
              <span className="bg-gradient-to-r from-[#7B2FBE] to-[#a855f7] bg-clip-text text-transparent">
                pentru tine
              </span>
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              Soluții complete de marketing digital, de la strategie la execuție
            </p>
          </div>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => (
            <AnimatedSection key={service.title} delay={i * 0.1}>
              <div className="group relative p-7 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-[#7B2FBE]/30 transition-all duration-500 hover:bg-white/[0.05] h-full backdrop-blur-sm">
                {/* Glow on hover */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: "radial-gradient(ellipse at center, rgba(123,47,190,0.06) 0%, transparent 70%)",
                  }}
                />

                <div className="relative">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(123,47,190,0.3)] transition-all duration-300`}>
                    <service.icon size={22} className="text-white" />
                  </div>

                  <h3 className="font-['Syne'] font-bold text-xl mb-3 text-white">
                    {service.title}
                  </h3>

                  <p className="text-white/40 leading-relaxed text-sm">
                    {service.description}
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

import AnimatedSection from "./AnimatedSection";
import { MessageCircle } from "lucide-react";

export default function CTASection() {
  return (
    <section
      className="relative py-24 md:py-32"
      style={{
        backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663467826404/BAAaAcGTQZunD92h83RUvR/cta-bg-oCFdY7wPqTpVVaau7aYFvA.webp)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[#050507]/50" />

      <div className="relative container text-center">
        <AnimatedSection>
          <h2 className="font-['Syne'] font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight max-w-3xl mx-auto">
            Vrei mai mulți{" "}
            <span className="bg-gradient-to-r from-[#7B2FBE] via-[#a855f7] to-[#6366f1] bg-clip-text text-transparent">
              clienți
            </span>
            ?
            <br />
            Hai să lucrăm împreună.
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <p className="text-white/50 text-lg md:text-xl max-w-xl mx-auto mb-10">
            Contactează-ne acum și hai să discutăm cum putem crește afacerea ta
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <a
            href="https://wa.me/40743391581"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-[#2D1B69] to-[#7B2FBE] text-white font-bold text-lg hover:shadow-[0_0_60px_rgba(123,47,190,0.5)] transition-all duration-300 hover:scale-105"
          >
            <MessageCircle size={22} />
            Scrie-ne pe WhatsApp
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}

/*
 * CTA: Arrogant-Elegant. One line. One button.
 */

import AnimatedSection from "./AnimatedSection";
import { MessageCircle } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative py-32 md:py-44">
      <div className="relative container text-center">
        <AnimatedSection>
          <h2 className="font-['Syne'] font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] mb-10 max-w-2xl mx-auto">
            Vrei să crești în vânzări sau clienți?
            <br />
            <span className="text-white/30">Sună-ne.</span>
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <a
            href="https://wa.me/40743391581"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-full text-white font-semibold text-base transition-all duration-300 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #1e90ff, #0891b2, #6d28d9)",
              boxShadow: "0 0 40px rgba(30,144,255,0.3), 0 0 80px rgba(30,144,255,0.1)",
            }}
          >
            <MessageCircle size={18} />
            WhatsApp
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}

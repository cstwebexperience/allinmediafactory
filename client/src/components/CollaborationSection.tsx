import AnimatedSection from "./AnimatedSection";
import { Handshake } from "lucide-react";

export default function CollaborationSection() {
  return (
    <section className="relative py-20 md:py-28">
      <div className="container">
        <AnimatedSection>
          <a href="http://agentieseo.net/" target="_blank" rel="noopener noreferrer" className="block group">
            <div className="relative max-w-4xl mx-auto p-8 md:p-12 rounded-3xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] overflow-hidden hover:border-white/[0.12] hover:from-white/[0.06] hover:to-white/[0.02] transition-all duration-300 cursor-pointer">
            {/* Glow accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#7B2FBE]/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#2D1B69]/10 rounded-full blur-[80px]" />

            <div className="relative flex flex-col md:flex-row items-start gap-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2D1B69] to-[#7B2FBE] flex items-center justify-center shrink-0">
                <Handshake size={26} className="text-white" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full border border-[#7B2FBE]/30 bg-[#7B2FBE]/5 text-[#c4a0f0] text-xs font-medium tracking-widest uppercase mb-4">
                  Parteneriat
                </span>
                <h3 className="font-['Syne'] font-bold text-2xl md:text-3xl mb-4">
                  Colaborare cu{" "}
                  <span className="bg-gradient-to-r from-[#7B2FBE] to-[#a855f7] bg-clip-text text-transparent group-hover:from-[#9d4edd] group-hover:to-[#c77dff] transition-all">
                    BeeZ Pixel
                  </span>
                </h3>
                <p className="text-white/50 text-lg leading-relaxed">
                  Colaborăm cu agenția BeeZ Pixel pentru servicii avansate de SEO, astfel încât clienții noștri să beneficieze de vizibilitate maximă pe Google. Împreună, acoperim tot spectrul de marketing digital.
                </p>
              </div>
            </div>
          </div>
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}

/*
 * Collaboration: Arrogant-Elegant. Short statement.
 */

import AnimatedSection from "./AnimatedSection";
import { Handshake } from "lucide-react";

export default function CollaborationSection() {
  return (
    <section className="relative py-16 md:py-20">
      <div className="container">
        <AnimatedSection>
          <a href="http://agentieseo.net/" target="_blank" rel="noopener noreferrer" className="block group">
            <div className="relative max-w-3xl mx-auto p-8 md:p-10 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.12] transition-all duration-300 cursor-pointer overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#7B2FBE]/8 rounded-full blur-[80px]" />

              <div className="relative flex items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2D1B69] to-[#7B2FBE] flex items-center justify-center shrink-0">
                  <Handshake size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-['Syne'] font-bold text-xl md:text-2xl text-white">
                    SEO cu{" "}
                    <span className="bg-gradient-to-r from-[#7B2FBE] to-[#a855f7] bg-clip-text text-transparent group-hover:from-[#9d4edd] group-hover:to-[#c77dff] transition-all">
                      BeeZ Pixel
                    </span>
                  </h3>
                  <p className="text-white/30 text-sm font-light mt-1">
                    Pagina 1 pe Google. Noi ne ocupăm de restul.
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

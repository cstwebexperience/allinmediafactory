/*
 * Video: Arrogant-Elegant. Let the work speak.
 */

import AnimatedSection from "./AnimatedSection";
import { Play } from "lucide-react";
import { useState } from "react";

const shorts = [
  { id: "6QoeHnucqUs", title: "Electroterapie" },
  { id: "9EshKr4zksI", title: "26 ianuarie 2026" },
  { id: "hW5BLJl37Qs", title: "26 ianuarie 2026" },
];

function ShortEmbed({ id, title }: { id: string; title: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative group">
      <div className="aspect-[9/16] rounded-2xl overflow-hidden border border-white/[0.04] hover:border-white/[0.15] transition-all duration-500 bg-[#0a0a12]">
        {!loaded ? (
          <button onClick={() => setLoaded(true)} className="w-full h-full relative">
            <img src={`https://img.youtube.com/vi/${id}/0.jpg`} alt={title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/30 transition-colors duration-300">
              <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-white/20">
                <Play size={24} className="text-white ml-0.5" fill="white" />
              </div>
            </div>
          </button>
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        )}
      </div>
    </div>
  );
}

export default function VideoSection() {
  return (
    <section id="video" className="relative py-28 md:py-36">
      <div className="container">
        <AnimatedSection>
          <div className="mb-16">
            <div className="w-8 h-[1px] bg-white/15 mb-12" />
            <h2 className="font-['Syne'] font-bold text-3xl md:text-4xl lg:text-5xl leading-[1.1]">
              Apasă play.
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto mb-10">
          {shorts.map((short, i) => (
            <AnimatedSection key={short.id} delay={i * 0.1}>
              <ShortEmbed id={short.id} title={short.title} />
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.3}>
          <div className="text-center">
            <a
              href="https://youtube.com/@liviucontsecret"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 text-xs tracking-[0.15em] uppercase font-light transition-colors duration-300"
            >
              <Play size={12} />
              Mai multe pe YouTube
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

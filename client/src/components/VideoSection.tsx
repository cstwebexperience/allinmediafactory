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
      <div className="aspect-[9/16] rounded-2xl overflow-hidden border border-white/[0.06] hover:border-[#7B2FBE]/30 transition-all duration-500 bg-[#0a0a12]">
        {!loaded ? (
          <button
            onClick={() => setLoaded(true)}
            className="w-full h-full relative"
          >
            <img
              src={`https://img.youtube.com/vi/${id}/0.jpg`}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors duration-300">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#2D1B69] to-[#7B2FBE] flex items-center justify-center shadow-[0_0_30px_rgba(123,47,190,0.5)] group-hover:scale-110 transition-transform duration-300">
                <Play size={28} className="text-white ml-1" fill="white" />
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
      <p className="text-center text-white/40 text-sm mt-3 font-medium">
        {title}
      </p>
    </div>
  );
}

export default function VideoSection() {
  return (
    <section id="video" className="relative py-24 md:py-32">
      <div className="container">
        <AnimatedSection>
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full border border-[#7B2FBE]/30 bg-[#7B2FBE]/5 text-[#c4a0f0] text-xs font-medium tracking-widest uppercase mb-6">
              Video
            </span>
            <h2 className="font-['Syne'] font-bold text-3xl md:text-4xl lg:text-5xl mb-4">
              Vezi cum{" "}
              <span className="bg-gradient-to-r from-[#7B2FBE] to-[#a855f7] bg-clip-text text-transparent">
                lucrăm
              </span>
            </h2>
            <p className="text-white/40 text-lg max-w-xl mx-auto">
              Conținut video care captează atenția și generează milioane de vizualizări
            </p>
          </div>
        </AnimatedSection>

        {/* YouTube Shorts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          {shorts.map((short, i) => (
            <AnimatedSection key={short.id} delay={i * 0.15}>
              <ShortEmbed id={short.id} title={short.title} />
            </AnimatedSection>
          ))}
        </div>

        {/* YouTube Channel Link */}
        <AnimatedSection delay={0.3}>
          <div className="text-center">
            <a
              href="https://youtube.com/@liviucontsecret"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-[#7B2FBE]/30 hover:bg-white/[0.03] transition-all duration-300"
            >
              <Play size={16} />
              Vezi toate videoclipurile pe YouTube
            </a>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

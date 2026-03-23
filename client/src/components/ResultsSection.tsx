/*
 * Results: Arrogant-Elegant. Let screenshots do the talking.
 */

import AnimatedSection from "./AnimatedSection";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

const CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663467826404/BAAaAcGTQZunD92h83RUvR";

const results = [
  { src: `${CDN}/766aab24-170e-459c-bb6c-c8b1d54802ad_41461e55.jpg`, label: "+49% vizualizări", category: "Instagram" },
  { src: `${CDN}/82efae06-1241-47e0-8775-1b9f3baac0cb_1cdbb7d0.jpg`, label: "+256% vizualizări", category: "Facebook" },
  { src: `${CDN}/3264dfc0-5c3e-45cc-a88c-64b4f872efc2_d84c16a4.jpg`, label: "1.6M vizualizări", category: "TikTok" },
  { src: `${CDN}/80c213d6-a3f2-451e-9f34-1e5f766b22ea_7b39eb4b.jpg`, label: "7.488 urmăritori", category: "Client" },
  { src: `${CDN}/02883aa0-43fc-43c4-885a-21c2d062293b_c50d8174.jpg`, label: "Campanii active", category: "Ads" },
  { src: `${CDN}/5a1d9355-da2f-41cc-a97d-4caee6da9016_054faa9e.jpg`, label: "1.3M vizualizări", category: "Viral" },
  { src: `${CDN}/2732a66f-77e8-44ae-9e57-5d51fcf2968d_05c50749.jpg`, label: "1.1M + 48.4K", category: "Viral" },
  { src: `${CDN}/98ab02a6-2a0f-4ca3-85df-6a6f4e313019_59bada64.jpg`, label: "288K + 329K", category: "Viral" },
  { src: `${CDN}/d2fdd268-1970-4bb5-ba74-47d9eaa35225_d6034b1c.jpg`, label: "193K vizualizări", category: "Viral" },
  { src: `${CDN}/03f74dfe-abfd-4e78-a841-beb661cb0d4a_f09d84a7.jpg`, label: "202K vizualizări", category: "Viral" },
  { src: `${CDN}/5d5256cc-beac-486a-8688-e452cb3a4252_161e53ae.jpg`, label: "70.7K + 206K", category: "Viral" },
  { src: `${CDN}/4ac9d72b-37d5-44e6-a649-aea3e4a25d70_3b751881.jpg`, label: "453K + 347K", category: "YouTube" },
];

export default function ResultsSection() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section id="rezultate" className="relative py-28 md:py-36">
      <div className="container">
        <AnimatedSection>
          <div className="mb-16">
            <div className="w-8 h-[1px] bg-white/15 mb-12" />
            <h2 className="font-['Syne'] font-bold text-3xl md:text-4xl lg:text-5xl leading-[1.1]">
              Dovezi.
              <br />
              <span className="text-white/30">Nu vorbe.</span>
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3">
          {results.map((item, i) => (
            <AnimatedSection key={i} delay={i * 0.04}>
              <button
                onClick={() => setSelected(i)}
                className="group relative w-full aspect-[4/5] rounded-xl overflow-hidden border border-white/[0.04] hover:border-white/[0.15] transition-all duration-500"
              >
                <img
                  src={item.src}
                  alt={item.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                  <ZoomIn size={12} className="text-white" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-white/50 text-[10px] tracking-[0.1em] uppercase">{item.category}</span>
                  <p className="text-white text-xs font-semibold">{item.label}</p>
                </div>
              </button>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative max-w-3xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all"
              >
                <X size={20} />
              </button>
              <img
                src={results[selected].src}
                alt={results[selected].label}
                className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

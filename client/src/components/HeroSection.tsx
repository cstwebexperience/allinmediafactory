import { motion } from "framer-motion";
import { ArrowDown, MessageCircle } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663467826404/BAAaAcGTQZunD92h83RUvR/hero-bg-KtqoVZ4FP9Zegcjh4xSznW.webp)`,
        }}
      />
      {/* Stronger dark overlay for text readability */}
      <div className="absolute inset-0 bg-[#050507]/55" />

      {/* Animated gradient orb */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-15 blur-[120px]"
        style={{
          background: "radial-gradient(circle, #7B2FBE 0%, #2D1B69 50%, transparent 70%)",
        }}
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -80, 60, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Film grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 container text-center max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-[#7B2FBE]/50 bg-[#7B2FBE]/15 text-[#d4b5f7] text-sm font-medium tracking-wider mb-8 backdrop-blur-sm">
            AGENȚIE DE MARKETING DIGITAL
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="font-['Syne'] font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-6 drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)]"
        >
          Creștem vizibilitatea{" "}
          <span className="bg-gradient-to-r from-[#9333ea] via-[#a855f7] to-[#7c3aed] bg-clip-text text-transparent">
            afacerii tale
          </span>{" "}
          și îți aducem{" "}
          <span className="bg-gradient-to-r from-[#7c3aed] to-[#9333ea] bg-clip-text text-transparent">
            clienți reali
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-[0_1px_10px_rgba(0,0,0,0.3)]"
        >
          Social media, video marketing și strategii care convertesc.
          Transformăm prezența ta online în rezultate concrete.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href="https://wa.me/40743391581"
            target="_blank"
            rel="noopener noreferrer"
            className="group px-8 py-4 rounded-full bg-gradient-to-r from-[#2D1B69] to-[#7B2FBE] text-white font-semibold text-base flex items-center gap-2 hover:shadow-[0_0_40px_rgba(123,47,190,0.5)] transition-all duration-300 hover:scale-105"
          >
            <MessageCircle size={18} />
            Contactează-ne
          </a>
          <a
            href="#rezultate"
            className="px-8 py-4 rounded-full border border-white/25 text-white/90 font-medium text-base hover:bg-white/10 hover:border-white/40 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm"
          >
            Vezi rezultate
            <ArrowDown size={16} />
          </a>
        </motion.div>
      </div>


    </section>
  );
}

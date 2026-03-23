/*
 * Hero: Arrogant-Elegant. Minimal. Direct.
 * Fluid marble background + synced icon/text colors.
 */

import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Camera, Megaphone, Zap, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";

const icons = [
  { Icon: Camera, label: "Content", color: "#1e90ff", accentColor: "#00d4aa" },
  { Icon: Zap, label: "Marketing", color: "#00d4aa", accentColor: "#8b5cf6" },
  { Icon: Megaphone, label: "Advertising", color: "#8b5cf6", accentColor: "#f97316" },
  { Icon: DollarSign, label: "Revenue", color: "#f97316", accentColor: "#1e90ff" },
];

function FluidBlob({
  className,
  color1,
  color2,
  delay = 0,
  duration = 20,
  size = 400,
}: {
  className?: string;
  color1: string;
  color2: string;
  delay?: number;
  duration?: number;
  size?: number;
}) {
  return (
    <motion.div
      className={`absolute rounded-full blur-[80px] ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(ellipse at 30% 40%, ${color1} 0%, ${color2} 50%, transparent 70%)`,
      }}
      animate={{
        x: [0, 80, -60, 40, 0],
        y: [0, -60, 40, -30, 0],
        scale: [1, 1.3, 0.8, 1.15, 1],
        rotate: [0, 45, -30, 60, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

function FloatingIcon({ index }: { index: number }) {
  const { Icon } = icons[index];
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ scale: 0, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 0.06, rotate: 0 }}
          exit={{ scale: 1.5, opacity: 0, rotate: 20 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <Icon size={320} strokeWidth={0.4} className="text-white" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function HeroSection() {
  const [iconIndex, setIconIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIconIndex((prev) => (prev + 1) % icons.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const currentColor = icons[iconIndex].color;
  const currentAccent = icons[iconIndex].accentColor;

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050507]"
    >
      {/* Fluid marble blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <FluidBlob color1="#1e90ff" color2="#0047ab" size={600} className="top-[10%] left-[-5%] opacity-40" duration={18} delay={0} />
        <FluidBlob color1="#00d4aa" color2="#0891b2" size={500} className="top-[-10%] right-[-5%] opacity-35" duration={22} delay={1} />
        <FluidBlob color1="#8b5cf6" color2="#6d28d9" size={450} className="bottom-[-5%] left-[30%] opacity-35" duration={20} delay={2} />
        <FluidBlob color1="#10b981" color2="#059669" size={350} className="top-[40%] left-[10%] opacity-25" duration={16} delay={3} />
        <FluidBlob color1="#f97316" color2="#ea580c" size={300} className="top-[30%] right-[10%] opacity-20" duration={24} delay={1.5} />
        <FluidBlob color1="#3b82f6" color2="#1d4ed8" size={500} className="bottom-[10%] right-[-10%] opacity-30" duration={19} delay={0.5} />
        <FluidBlob color1="#c084fc" color2="#7c3aed" size={250} className="top-[20%] left-[50%] opacity-20" duration={14} delay={4} />
      </div>

      <FloatingIcon index={iconIndex} />

      {/* Noise grain */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 40%, #050507 85%)" }} />

      {/* Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 rounded-full bg-white"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ opacity: [0, 0.5, 0], scale: [0, 1, 0] }}
            transition={{ duration: 2 + Math.random() * 3, delay: Math.random() * 5, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Content — arrogant, minimal */}
      <div className="relative z-10 container text-center max-w-3xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="font-['Syne'] font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[1.15] mb-6 tracking-tight"
        >
          <span className="text-white">
            Nu promitem.
          </span>
          <br />
          <motion.span
            key={`text-${iconIndex}`}
            className="bg-clip-text text-transparent font-extrabold inline-block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{
              backgroundImage: `linear-gradient(135deg, ${currentColor}, ${currentAccent}, #8b5cf6, ${currentColor})`,
              backgroundSize: "300% 300%",
              animation: "fluidGradient 6s ease infinite",
            }}
          >
            Livrăm.
          </motion.span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="w-12 h-[1px] bg-white/20 mx-auto mb-6"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-[11px] md:text-xs text-white/30 max-w-md mx-auto mb-12 tracking-[0.2em] uppercase font-light"
        >
          Social Media &bull; Video &bull; Strategie &bull; Rezultate
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <a
            href="https://wa.me/40743391581"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold text-sm transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            style={{
              background: "linear-gradient(135deg, #1e90ff, #0891b2, #6d28d9)",
              boxShadow: "0 0 30px rgba(30,144,255,0.3), 0 0 60px rgba(30,144,255,0.1)",
            }}
          >
            <MessageCircle size={16} />
            Hai la treabă
          </a>
        </motion.div>
      </div>

      <style>{`
        @keyframes fluidGradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  );
}

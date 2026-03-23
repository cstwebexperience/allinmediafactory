/*
 * Design: Fluid Marble / Liquid Chrome hero inspired by video
 * - Swirling iridescent fluid blobs (blue, cyan, green, purple, orange accents)
 * - Floating marketing icons cycling through (camera, megaphone, bolt, dollar)
 * - Dark background with colorful organic motion
 * - Glassmorphism text overlay
 */

import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, MessageCircle, Camera, Megaphone, Zap, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";

const icons = [
  { Icon: Camera, label: "Content" },
  { Icon: Zap, label: "Marketing" },
  { Icon: Megaphone, label: "Advertising" },
  { Icon: DollarSign, label: "Revenue" },
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

function FloatingIcon() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % icons.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const { Icon } = icons[index];

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ scale: 0, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 0.08, rotate: 0 }}
          exit={{ scale: 1.5, opacity: 0, rotate: 20 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <Icon size={280} strokeWidth={0.5} className="text-white" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050507]"
    >
      {/* Fluid marble blobs - inspired by the swirling paint video */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Main large blue blob - center left */}
        <FluidBlob
          color1="#1e90ff"
          color2="#0047ab"
          size={600}
          className="top-[10%] left-[-5%] opacity-40"
          duration={18}
          delay={0}
        />
        {/* Cyan/teal blob - top right */}
        <FluidBlob
          color1="#00d4aa"
          color2="#0891b2"
          size={500}
          className="top-[-10%] right-[-5%] opacity-35"
          duration={22}
          delay={1}
        />
        {/* Purple/violet blob - bottom center */}
        <FluidBlob
          color1="#8b5cf6"
          color2="#6d28d9"
          size={450}
          className="bottom-[-5%] left-[30%] opacity-35"
          duration={20}
          delay={2}
        />
        {/* Green accent blob - left */}
        <FluidBlob
          color1="#10b981"
          color2="#059669"
          size={350}
          className="top-[40%] left-[10%] opacity-25"
          duration={16}
          delay={3}
        />
        {/* Orange/coral accent - right side */}
        <FluidBlob
          color1="#f97316"
          color2="#ea580c"
          size={300}
          className="top-[30%] right-[10%] opacity-20"
          duration={24}
          delay={1.5}
        />
        {/* Deep blue blob - bottom right */}
        <FluidBlob
          color1="#3b82f6"
          color2="#1d4ed8"
          size={500}
          className="bottom-[10%] right-[-10%] opacity-30"
          duration={19}
          delay={0.5}
        />
        {/* Small iridescent accent */}
        <FluidBlob
          color1="#c084fc"
          color2="#7c3aed"
          size={250}
          className="top-[20%] left-[50%] opacity-20"
          duration={14}
          delay={4}
        />
      </div>

      {/* Floating marketing icons (subtle, large, background) */}
      <FloatingIcon />

      {/* Subtle noise/grain overlay for texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, #050507 85%)",
        }}
      />

      {/* Animated sparkle particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              delay: Math.random() * 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container text-center max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-white/60 text-xs font-medium tracking-widest mb-6 backdrop-blur-xl shadow-[0_0_20px_rgba(30,144,255,0.08)] uppercase">
            Marketing Digital Premium
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="font-['Syne'] font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[1.2] mb-6 tracking-tight"
        >
          <span className="text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.6)]">
            Transformăm prezența ta online în
          </span>
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(135deg, #1e90ff, #00d4aa, #8b5cf6, #1e90ff)",
              backgroundSize: "300% 300%",
              animation: "fluidGradient 6s ease infinite",
            }}
          >
            rezultate concrete
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-sm md:text-base text-white/50 max-w-xl mx-auto mb-12 leading-relaxed font-light"
        >
          Strategii de social media, video marketing și campanii care convertesc
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
            className="group px-8 py-4 rounded-full text-white font-semibold text-base flex items-center gap-2 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            style={{
              background: "linear-gradient(135deg, #1e90ff, #0891b2, #6d28d9)",
              boxShadow: "0 0 30px rgba(30,144,255,0.3), 0 0 60px rgba(30,144,255,0.1)",
            }}
          >
            <MessageCircle size={18} />
            Contactează-ne
          </a>
          <a
            href="#rezultate"
            className="px-8 py-4 rounded-full border border-white/20 text-white/80 font-medium text-base hover:bg-white/[0.08] hover:border-white/30 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm"
          >
            Vezi rezultate
            <ArrowDown size={16} />
          </a>
        </motion.div>
      </div>

      {/* CSS keyframes for fluid gradient animation */}
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

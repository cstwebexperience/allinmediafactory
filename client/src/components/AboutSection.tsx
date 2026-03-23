/*
 * About: Arrogant-Elegant. Numbers speak. No fluff.
 */

import AnimatedSection from "./AnimatedSection";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

function AnimatedCounter({ target, suffix = "" }: { target: string; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  const numericValue = parseFloat(target.replace(/[^0-9.]/g, ""));

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const steps = 60;
    const increment = numericValue / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= numericValue) {
        setCount(numericValue);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, numericValue]);

  const unitMatch = target.match(/[A-Za-z]+/);
  const unit = unitMatch ? unitMatch[0] : "";
  const hasDecimal = target.includes(".");
  const formatted = hasDecimal ? count.toFixed(1) : Math.floor(count).toString();

  return (
    <span ref={ref}>
      {formatted}{unit}{suffix}
    </span>
  );
}

export default function AboutSection() {
  return (
    <section id="despre" className="relative py-28 md:py-36">
      <div className="container">
        {/* Thin separator line */}
        <div className="w-8 h-[1px] bg-white/15 mb-12" />

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left: Statement */}
          <div>
            <AnimatedSection>
              <h2 className="font-['Syne'] font-bold text-3xl md:text-4xl lg:text-5xl leading-[1.1] mb-8">
                Noi nu explicăm.
                <br />
                <span className="text-white/30">Demonstrăm.</span>
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <p className="text-white/35 text-base leading-relaxed max-w-md">
                Strategii. Filmări. Scenarii. Rezultate.
                Restul e zgomot.
              </p>
            </AnimatedSection>
          </div>

          {/* Right: Stats — the proof */}
          <AnimatedSection delay={0.2}>
            <div className="grid grid-cols-2 gap-x-12 gap-y-10">
              {[
                { target: "2.3M", suffix: "+", label: "Facebook" },
                { target: "304K", suffix: "+", label: "Instagram" },
                { target: "1.6M", suffix: "+", label: "TikTok" },
                { target: "125K", suffix: "+", label: "Aprecieri" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl md:text-4xl font-['Syne'] font-bold text-white mb-1">
                    <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                  </div>
                  <div className="text-white/25 text-xs tracking-[0.15em] uppercase font-light">{stat.label}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

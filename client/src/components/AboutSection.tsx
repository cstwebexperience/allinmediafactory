import AnimatedSection from "./AnimatedSection";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

function AnimatedCounter({ target, suffix = "" }: { target: string; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  // Parse number from target string like "2.3M" -> 2.3
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

  // Format the number to match the target format
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
    <section id="despre" className="relative py-24 md:py-32">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Text */}
          <div>
            <AnimatedSection>
              <span className="inline-block px-3 py-1 rounded-full border border-[#7B2FBE]/30 bg-[#7B2FBE]/5 text-[#c4a0f0] text-xs font-medium tracking-widest uppercase mb-6">
                Despre noi
              </span>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <h2 className="font-['Syne'] font-bold text-3xl md:text-4xl lg:text-5xl mb-6 leading-tight">
                Transformăm{" "}
                <span className="bg-gradient-to-r from-[#7B2FBE] to-[#a855f7] bg-clip-text text-transparent">
                  ideile
                </span>{" "}
                în rezultate
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <p className="text-white/50 text-lg leading-relaxed mb-6">
                All In Media este o agenție de marketing care ajută afacerile să crească în vizibilitate și să atragă clienți reali. Ne ocupăm de strategii de social media, filmări profesionale și scenarii care generează rezultate concrete.
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <div className="grid grid-cols-2 gap-6 mt-10">
                {[
                  { target: "2.3M", suffix: "+", label: "Vizualizări Facebook" },
                  { target: "304K", suffix: "+", label: "Vizualizări Instagram" },
                  { target: "1.6M", suffix: "+", label: "Vizualizări TikTok" },
                  { target: "125K", suffix: "+", label: "Aprecieri" },
                ].map((stat) => (
                  <div key={stat.label} className="group">
                    <div className="text-2xl md:text-3xl font-['Syne'] font-bold bg-gradient-to-r from-[#7B2FBE] to-[#a855f7] bg-clip-text text-transparent">
                      <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                    </div>
                    <div className="text-white/40 text-sm mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>

          {/* Right: Visual */}
          <AnimatedSection delay={0.3}>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-[#2D1B69]/20 to-[#7B2FBE]/10 rounded-3xl blur-2xl" />
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663467826404/BAAaAcGTQZunD92h83RUvR/about-visual-GYjxqQr6jwtrRfPNujZvHJ.webp"
                alt="Digital Marketing Visualization"
                className="relative rounded-2xl w-full object-cover border border-white/[0.06]"
              />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

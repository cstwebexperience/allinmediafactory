/*
 * Navbar: Minimal. Clean. No noise.
 */

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Despre", href: "#despre" },
  { label: "Servicii", href: "#servicii" },
  { label: "Rezultate", href: "#rezultate" },
  { label: "Video", href: "#video" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#050507]/95 backdrop-blur-xl border-b border-white/[0.04]"
          : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16">
        <a href="#hero" className="flex items-center gap-3 group">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663467826404/BAAaAcGTQZunD92h83RUvR/logoallin_84c09792.PNG"
            alt="ALL IN MEDIA"
            className="w-9 h-9 rounded-lg object-cover"
          />
          <span className="font-['Syne'] font-bold text-sm tracking-[0.1em] text-white uppercase">
            All In Media
          </span>
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[11px] text-white/30 hover:text-white transition-colors duration-300 tracking-[0.15em] uppercase font-light"
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://wa.me/40743391581"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-full border border-white/15 text-white text-[11px] tracking-[0.1em] uppercase font-medium hover:bg-white/[0.06] hover:border-white/25 transition-all duration-300"
          >
            Contact
          </a>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white/60 p-2">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-[#050507]/98 backdrop-blur-xl border-t border-white/[0.04] pb-6"
        >
          <div className="container flex flex-col gap-3 pt-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-white/40 hover:text-white transition-colors py-2 text-sm tracking-[0.1em] uppercase font-light"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://wa.me/40743391581"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 px-5 py-3 rounded-full border border-white/15 text-white text-center text-sm tracking-[0.1em] uppercase font-medium"
            >
              Contact
            </a>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

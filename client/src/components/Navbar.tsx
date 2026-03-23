import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Acasă", href: "#hero" },
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
          ? "bg-[#050507]/95 backdrop-blur-xl border-b border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
          : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-20">
        <a href="#hero" className="flex items-center gap-3 group">
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663467826404/BAAaAcGTQZunD92h83RUvR/logoallin_84c09792.PNG"
            alt="ALL IN MEDIA"
            className="w-10 h-10 rounded-lg object-cover group-hover:shadow-[0_0_15px_rgba(123,47,190,0.3)] transition-shadow duration-300"
          />
          <span className="font-['Syne'] font-bold text-lg tracking-wide text-white">
            ALL IN MEDIA
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative text-sm text-white/50 hover:text-white transition-colors duration-300 font-medium tracking-wide group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-[#7B2FBE] to-[#a855f7] group-hover:w-full transition-all duration-300" />
            </a>
          ))}
          <a
            href="https://wa.me/40743391581"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#2D1B69] to-[#7B2FBE] text-white text-sm font-semibold hover:shadow-[0_0_30px_rgba(123,47,190,0.4)] transition-all duration-300 hover:scale-105"
          >
            Contactează-ne
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white p-2"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-[#050507]/98 backdrop-blur-xl border-t border-white/[0.06] pb-6"
        >
          <div className="container flex flex-col gap-4 pt-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-white/60 hover:text-white transition-colors py-2 font-medium"
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://wa.me/40743391581"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#2D1B69] to-[#7B2FBE] text-white text-center font-semibold"
            >
              Contactează-ne
            </a>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

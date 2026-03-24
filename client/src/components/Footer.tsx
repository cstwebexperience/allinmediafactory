/*
 * Footer: Minimal. Clean.
 */

import { Youtube, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.04] py-10">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663467826404/BAAaAcGTQZunD92h83RUvR/logoallin_84c09792.PNG"
              alt="ALL IN MEDIA"
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="font-['Syne'] font-bold text-sm tracking-[0.1em] text-white/60 uppercase">
              All In Media Factory
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://youtube.com/@liviucontsecret"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-white/[0.06] flex items-center justify-center text-white/25 hover:text-white/60 hover:border-white/15 transition-all duration-300"
            >
              <Youtube size={16} />
            </a>
            <a
              href="https://wa.me/40743391581"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-white/[0.06] flex items-center justify-center text-white/25 hover:text-white/60 hover:border-white/15 transition-all duration-300"
            >
              <MessageCircle size={16} />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/[0.03] text-center">
          <p className="text-white/15 text-[10px] tracking-[0.15em] uppercase">
            all in media factory
          </p>
        </div>
      </div>
    </footer>
  );
}

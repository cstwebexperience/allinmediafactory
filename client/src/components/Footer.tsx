import { Instagram, Facebook, Youtube, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] py-12">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663467826404/BAAaAcGTQZunD92h83RUvR/logoallin_84c09792.PNG"
              alt="ALL IN MEDIA"
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div>
              <span className="font-['Syne'] font-bold text-white tracking-wide">
                ALL IN MEDIA
              </span>
              <p className="text-white/30 text-xs">Agenție de Marketing Digital</p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://youtube.com/@liviucontsecret"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-[#7B2FBE]/40 hover:bg-[#7B2FBE]/10 transition-all duration-300"
            >
              <Youtube size={18} />
            </a>
            <a
              href="https://wa.me/40743391581"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-[#7B2FBE]/40 hover:bg-[#7B2FBE]/10 transition-all duration-300"
            >
              <MessageCircle size={18} />
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-white/[0.04] text-center">
          <p className="text-white/20 text-sm">
            &copy; {new Date().getFullYear()} All In Media. Toate drepturile rezervate.
          </p>
        </div>
      </div>
    </footer>
  );
}

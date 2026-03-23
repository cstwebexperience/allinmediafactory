import { motion } from "framer-motion";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] bg-[#050507] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center gap-6"
      >
        <motion.img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663467826404/BAAaAcGTQZunD92h83RUvR/logoallin_84c09792.PNG"
          alt="ALL IN MEDIA"
          className="w-32 h-32 rounded-2xl object-cover"
          animate={{ 
            boxShadow: [
              "0 0 20px rgba(123, 47, 190, 0.3)",
              "0 0 60px rgba(123, 47, 190, 0.6)",
              "0 0 20px rgba(123, 47, 190, 0.3)"
            ]
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="w-48 h-1 rounded-full bg-gradient-to-r from-transparent via-[#7B2FBE] to-transparent overflow-hidden"
        >
          <motion.div
            className="h-full w-1/3 bg-white/60 rounded-full"
            animate={{ x: ["-100%", "300%"] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

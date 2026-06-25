"use client";

import { useBranch, Branch } from "@/lib/BranchContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

export default function BranchGate({ children }: { children: React.ReactNode }) {
  const { branch, setBranch, isHydrated } = useBranch();
  const [isHovering, setIsHovering] = useState<Branch>(null);

  if (!isHydrated) {
    return <div className="min-h-screen bg-background" />; // wait for hydration prevent flicker
  }

  // If a branch is selected, render the actual app
  if (branch) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col md:flex-row overflow-hidden bg-transparent">
      {/* Background for Branch Gate */}
      <div 
        className="absolute inset-0 pointer-events-none z-0" 
        style={{ 
          backgroundImage: 'url(/image.png)', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
        }} 
      />

      {/* Right Side: Studio */}
      <motion.div 
        className="flex-1 relative z-10 flex flex-col items-center justify-center cursor-pointer group border-b md:border-b-0 md:border-l border-border/20 backdrop-blur-sm transition-all duration-500 hover:bg-black/40 bg-black/60 md:bg-black/50"
        onMouseEnter={() => setIsHovering("studio")}
        onMouseLeave={() => setIsHovering(null)}
        onClick={() => setBranch("studio")}
        animate={{ flex: isHovering === "studio" ? 1.1 : isHovering === "design" ? 0.9 : 1 }}
      >
        <motion.div 
          className="flex flex-col items-center"
          animate={{ scale: isHovering === "studio" ? 1.05 : 1 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/logo studio.webp" 
            alt="Tuwaiq Studio" 
            className="w-48 h-48 md:w-64 md:h-64 object-contain mb-8 drop-shadow-[0_0_15px_rgba(240,192,64,0.3)] transition-all duration-500 group-hover:drop-shadow-[0_0_30px_rgba(240,192,64,0.6)]" 
          />
          <h2 className="text-3xl md:text-5xl font-black text-brand-gold mb-4 tracking-tight">Tuwaiq Studio</h2>
          <span className="px-8 py-3 rounded-full border border-brand-gold text-brand-gold uppercase tracking-[0.2em] font-bold text-sm bg-brand-gold/5 group-hover:bg-brand-gold group-hover:text-black transition-all duration-300">
            اختيار فرع الأستوديو
          </span>
        </motion.div>
      </motion.div>

      {/* Left Side: Design */}
      <motion.div 
        className="flex-1 relative z-10 flex flex-col items-center justify-center cursor-pointer group backdrop-blur-sm transition-all duration-500 hover:bg-black/40 bg-black/60 md:bg-black/50"
        onMouseEnter={() => setIsHovering("design")}
        onMouseLeave={() => setIsHovering(null)}
        onClick={() => setBranch("design")}
        animate={{ flex: isHovering === "design" ? 1.1 : isHovering === "studio" ? 0.9 : 1 }}
      >
        <motion.div 
          className="flex flex-col items-center"
          animate={{ scale: isHovering === "design" ? 1.05 : 1 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/logo design.webp" 
            alt="Tuwaiq Design" 
            className="w-48 h-48 md:w-64 md:h-64 object-contain mb-8 rounded-full shadow-[0_0_15px_rgba(240,192,64,0.3)] transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(240,192,64,0.6)]" 
          />
          <h2 className="text-3xl md:text-5xl font-black text-brand-gold mb-4 tracking-tight">Tuwaiq Design</h2>
          <span className="px-8 py-3 rounded-full border border-brand-gold text-brand-gold uppercase tracking-[0.2em] font-bold text-sm bg-brand-gold/5 group-hover:bg-brand-gold group-hover:text-black transition-all duration-300">
            اختيار فرع التصميم
          </span>
        </motion.div>
      </motion.div>
      
      {/* Central VS Badge (optional) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
        <div className="bg-brand-gold text-brand-brown w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center font-black text-lg md:text-xl shadow-2xl border-4 border-[#1c1411]">
          أو
        </div>
      </div>
    </div>
  );
}

"use client";

import { useBranch, Branch } from "@/lib/BranchContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Headphones, User, MessageCircle, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react";

export default function BranchGate({ children }: { children: React.ReactNode }) {
  const { branch, setBranch, isHydrated } = useBranch();
  const [isHovering, setIsHovering] = useState<Branch>(null);
  
  // Intro Video States
  const [showIntro, setShowIntro] = useState(false);
  const [introIsFading, setIntroIsFading] = useState(false);
  const soundRef = useRef<HTMLAudioElement | null>(null);
  const soundTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingSoundRef = useRef(false); // tracks if sound is waiting for user interaction

  // ─────────────────────────────────────────────────────────────
  // ⏱️  لتغيير وقت بدء الصوت، عدّل الرقم بالأسفل (بالميلي ثانية)
  //     2000 = ثانيتين | 3000 = 3 ثواني | 5000 = 5 ثواني
  const SOUND_DELAY_MS = 2000;
  // ─────────────────────────────────────────────────────────────
  const SOUND_VOLUME = 1.2; // لتغيير الصوت: 1.0 = 100٪ | 1.2 = 120٪
  // ─────────────────────────────────────────────────────────────

  useEffect(() => {
    // Only play intro once per session
    if (sessionStorage.getItem("twaq_intro_played")) {
      setShowIntro(false);
    }

    // Handle browsers that block autoplay: play on first user interaction
    const unlockAudio = () => {
      if (pendingSoundRef.current && soundRef.current) {
        soundRef.current.play().catch(() => {});
        pendingSoundRef.current = false;
      }
      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("touchend", unlockAudio);
    };
    document.addEventListener("click", unlockAudio);
    document.addEventListener("touchend", unlockAudio);
    return () => {
      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("touchend", unlockAudio);
    };
  }, []);

  const handleVideoPlay = () => {
    // Play sound effect after SOUND_DELAY_MS from video start
    soundTimerRef.current = setTimeout(() => {
      if (!soundRef.current) {
        soundRef.current = new Audio("/sound effect.mp3");
        soundRef.current.volume = Math.min(SOUND_VOLUME, 1); // clamp to 1.0 for Web Audio API
      }
      const playPromise = soundRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay blocked: mark as pending, will play on first click
          pendingSoundRef.current = true;
        });
      }
    }, SOUND_DELAY_MS);
  };

  const handleVideoEnd = () => {
    // Clear sound timer if video was skipped before sound played
    if (soundTimerRef.current) clearTimeout(soundTimerRef.current);
    setIntroIsFading(true);
    setTimeout(() => {
      setShowIntro(false);
      sessionStorage.setItem("twaq_intro_played", "true");
    }, 1500);
  };

  if (!isHydrated) {
    return <div className="min-h-screen bg-black" />;
  }

  if (branch) {
    return <>{children}</>;
  }

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className={`fixed inset-0 z-[200] bg-black flex items-center justify-center ${introIsFading ? 'pointer-events-none' : ''}`}
          >
            <video 
              src="/entry site.mov" 
              autoPlay 
              muted 
              playsInline
              onPlay={handleVideoPlay}
              onEnded={handleVideoEnd}
              className="w-[95vw] h-[95vh] md:w-[85vw] md:h-[85vh] max-w-[1400px] object-contain mx-auto"
            />
            {/* Skip Button */}
            <button 
              onClick={handleVideoEnd}
              className="absolute bottom-8 right-10 text-white/40 hover:text-white text-xs tracking-[0.2em] transition-colors border border-white/20 px-4 py-2 rounded-full cursor-pointer hover:bg-white/10 z-50 backdrop-blur-sm"
            >
              تخطي العرض
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Selection Screen */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: showIntro ? 0 : 1, scale: showIntro ? 0.98 : 1 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: showIntro ? 0 : 0.3 }}
        className="fixed inset-0 z-[100] flex flex-col md:flex-row overflow-x-hidden overflow-y-auto md:overflow-hidden bg-[#0A0A0A]"
      >
        
        {/* --- Overlay UI Elements --- */}



      {/* Center Top: Tuwaiq Logo & Titles */}
      <div className="absolute top-20 md:top-12 w-full flex flex-col items-center z-[110] pointer-events-none drop-shadow-2xl">
        <div className="text-center text-[#b39b60]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/title of twaq.png" alt="Tuwaiq Logo" className="h-16 md:h-24 object-contain mb-3 mx-auto opacity-100 drop-shadow-md" />
          
          <h2 className="text-sm md:text-lg tracking-[0.7em] font-medium mb-1 ml-2 drop-shadow-sm" style={{ fontFamily: "Georgia, serif" }}>T U W A I Q</h2>
          <h3 className="text-[0.65rem] md:text-xs tracking-[0.5em] md:tracking-[0.6em] mb-7 font-light opacity-90 ml-1">C R E A T I V E &nbsp; G R O U P</h3>
          
          <p className="text-sm md:text-base font-medium tracking-wide">اختر القسم الذي ترغب بالانتقال إليه</p>
          <div className="flex items-center justify-center mt-3 gap-2 opacity-60">
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#b39b60]"></div>
            <div className="w-2 h-2 rotate-45 border border-[#b39b60]"></div>
            <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#b39b60]"></div>
          </div>
        </div>
      </div>

      {/* Center Divider & "Or" (Desktop vertical) */}
      <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-[1px] bg-gradient-to-b from-transparent via-[#b39b60]/50 to-transparent -translate-x-1/2 z-30" />
      <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 items-center gap-4 drop-shadow-[0_0_10px_rgba(0,0,0,1)]">
        <ChevronLeft size={16} className="text-[#b39b60]/70" />
        <div className="bg-[#0b0b0b] text-[#b39b60] w-12 h-12 rounded-full flex items-center justify-center font-bold border border-[#b39b60]/40 text-sm">
          أو
        </div>
        <ChevronRight size={16} className="text-[#b39b60]/70" />
      </div>

      {/* Bottom Footer Quote */}
      <div className="hidden md:flex absolute bottom-0 w-full h-20 bg-transparent z-[120] items-center justify-center pointer-events-none">
        <div className="tracking-widest text-[#b39b60] text-[13px] font-black drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] opacity-90">
         
        </div>
      </div>

      {/* --- The Two Halves --- */}

      {/* Studio Side (Right on Desktop, Top on Mobile) */}
      <motion.div 
        className="min-h-[100svh] md:min-h-0 flex-1 relative z-10 flex flex-col items-center justify-center cursor-pointer group transition-all duration-700 w-full pb-16 md:pb-0"
        onMouseEnter={() => setIsHovering("studio")}
        onMouseLeave={() => setIsHovering(null)}
        onClick={() => setBranch("studio")}
        animate={{ flex: isHovering === "studio" ? 1.05 : isHovering === "design" ? 0.95 : 1 }}
      >
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000"
          style={{ backgroundImage: "url('/bgright.png')" }}
        />
        {/* Overlay gradient to boost contrast */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t md:bg-gradient-to-b from-black/80 via-black/40 to-black/80 group-hover:bg-black/20 transition-all duration-700"></div>

        <motion.div 
          className="relative z-10 flex flex-col items-center text-center mt-56 md:mt-20"
          animate={{ scale: isHovering === "studio" ? 1.05 : 1 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/logo studio.webp" 
            alt="Tuwaiq Studio" 
            className="w-48 h-48 md:w-64 md:h-64 object-contain mb-4 drop-shadow-[0_0_20px_rgba(179,155,96,0.3)]" 
          />
          <h2 className="text-3xl md:text-5xl font-black text-[#b39b60] mb-3 tracking-tight" style={{ fontFamily: "Georgia, serif" }}>Tuwaiq Studio</h2>
          <div className="text-[#b3b3b3] font-medium text-sm md:text-base mb-8 max-w-[250px] leading-relaxed">
            تصوير سينمائي<br/>جرافيكس وتحسين الأداء
          </div>
          <button className="flex items-center gap-3 px-8 py-3.5 rounded-full border border-[#b39b60] text-[#b39b60] bg-black/20 font-bold text-sm backdrop-blur-sm group-hover:bg-[#b39b60] group-hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(179,155,96,0.1)]">
            دخول طويق ستوديو
            <ArrowLeft size={16} />
          </button>
          <div className="flex gap-4 text-[0.65rem] md:text-xs font-bold text-[#b3b3b3]/60 mt-8 tracking-wide">
            <span>تصوير سينمائي</span>
            <span>•</span>
            <span>جرافيكس</span>
            <span>•</span>
            <span>تحسين الأداء</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Mobile Center Divider (Horizontal) */}
      <div className="md:hidden relative w-full h-0 z-40 flex items-center justify-center">
        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#b39b60]/50 to-transparent -translate-y-1/2 z-30" />
        <div className="relative z-40 flex flex-col items-center gap-2 drop-shadow-[0_0_10px_rgba(0,0,0,1)]">
          <ChevronLeft size={16} className="text-[#b39b60]/70 rotate-90" />
          <div className="bg-[#0b0b0b] text-[#b39b60] w-12 h-12 rounded-full flex items-center justify-center font-bold border border-[#b39b60]/40 text-sm">
            أو
          </div>
          <ChevronRight size={16} className="text-[#b39b60]/70 rotate-90" />
        </div>
      </div>

      {/* Design Side (Left on Desktop, Bottom on Mobile) */}
      <motion.div 
        className="min-h-[100svh] md:min-h-0 flex-1 relative z-10 flex flex-col items-center justify-center cursor-pointer group transition-all duration-700 w-full pt-16 pb-24 md:pt-0 md:pb-0"
        onMouseEnter={() => setIsHovering("design")}
        onMouseLeave={() => setIsHovering(null)}
        onClick={() => setBranch("design")}
        animate={{ flex: isHovering === "design" ? 1.05 : isHovering === "studio" ? 0.95 : 1 }}
      >
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000"
          style={{ backgroundImage: "url('/bgleft.png')" }}
        />
        {/* Warm overlay */}
        <div className="absolute inset-0 z-0 bg-[#D1C2A3]/10 group-hover:bg-transparent mix-blend-multiply transition-all duration-700"></div>

        <motion.div 
          className="relative z-10 flex flex-col items-center text-center mt-20"
          animate={{ scale: isHovering === "design" ? 1.05 : 1 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/logo design.webp" 
            alt="Tuwaiq Design" 
            className="w-48 h-48 md:w-64 md:h-64 object-contain mb-4 rounded-full drop-shadow-2xl opacity-90" 
          />
          <h2 className="text-3xl md:text-5xl font-black text-[#5c1a16] mb-3 tracking-tight" style={{ fontFamily: "Georgia, serif" }}>Tuwaiq Design</h2>
          <div className="text-[#4a3f35] font-bold text-sm md:text-base mb-8 max-w-[280px] leading-relaxed">
            تصميم الهويات البصرية<br/>والشعارات والمواد الإبداعية
          </div>
          <button className="flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#4a1515] text-[#f0e6d2] font-bold text-sm hover:bg-[#3D0A0C] transition-all shadow-xl">
            دخول طويق ديزاين
            <ArrowLeft size={16} />
          </button>
          <div className="flex gap-4 text-[0.65rem] md:text-xs font-bold text-[#4a3f35]/60 mt-8 tracking-wide">
            <span>هوية بصرية</span>
            <span>•</span>
            <span>شعارات</span>
            <span>•</span>
            <span>تصاميم إبداعية</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Mobile Footer (Inline at the very bottom of scroll) */}
      <div className="md:hidden w-full bg-[#0A0A0A] border-t border-[#D4AF37]/20 z-[120] flex flex-col items-center gap-4 py-8 px-6 text-[#8c8c8c] text-xs font-medium relative mt-auto">
        {/* Center Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo design.webp" className="w-10 h-10 opacity-30 grayscale sepia rounded-full mb-2" alt="Tuwaiq" />
        
        {/* Socials */}
        <div className="flex items-center justify-center w-full gap-6 border-b border-[#D4AF37]/10 pb-6 mb-2">
          <a href="#" className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors"><MessageCircle size={14} /> واتس</a>
          <a href="#" className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors"><MessageSquare size={14} /> ديسكورد</a>
          <a href="#" className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors font-sans text-sm pb-0.5">𝕏</a>
          <a href="#" className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors"><span className="text-sm">إنستقرام</span></a>
        </div>

        {/* Text */}
        <div className="tracking-wide text-center text-[#8c8c8c]/70 px-4 leading-relaxed">
          طويق.. حيث تتحول الأفكار إلى هوية، والمحتوى إلى تجربة خالدة.
        </div>
      </div>

      </motion.div>
    </>
  );
}

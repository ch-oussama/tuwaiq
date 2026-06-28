"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Project } from "@/lib/db";
import { useBranch } from "@/lib/BranchContext";
import { useLang } from "@/lib/LanguageContext";
import { t } from "@/lib/translations";

export default function HorizontalProjects({ projects }: { projects: Project[] }) {
  const { branch } = useBranch();
  const { lang } = useLang();
  const displayProjects = projects.slice(0, 4);
  const containerRef = useRef<HTMLDivElement>(null);

  // We track the scroll of the entire tall container.
  // When top of container hits top of viewport -> progress 0
  // When bottom of container hits bottom of viewport -> progress 1
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollRange, setScrollRange] = useState(0);

  useEffect(() => {
    // Calculate the exactly required translation distance
    const updateRange = () => {
      if (trackRef.current) {
        // Scroll width of the track minus the viewport width gives the exact max distance to scroll
        const maxScroll = trackRef.current.scrollWidth - window.innerWidth;
        setScrollRange(maxScroll > 0 ? maxScroll : 0);
      }
    };
    updateRange();
    window.addEventListener("resize", updateRange);
    return () => window.removeEventListener("resize", updateRange);
  }, [projects]);

  const rawX = useTransform(scrollYProgress, [0, 1], [0, -scrollRange]);
  // Use a spring to smooth out the translation
  const xTransform = useSpring(rawX, { stiffness: 400, damping: 90, mass: 0.1 });

  const opacityTransform = useTransform(scrollYProgress, [0.9, 1], [1, 0]);

  if (!displayProjects || displayProjects.length === 0) return null;

  return (
    // The wrapper height dictates how long the user scrolls to get through the cards.
    // 100vh for the initial view + 100vh per extra card.
    <section 
      ref={containerRef} 
      className="relative z-30"
      style={{ height: `calc(100vh + ${displayProjects.length * 80}vh)` }}
    >
      <div dir="ltr" className={`sticky top-0 h-screen w-full overflow-hidden flex items-center ${branch === 'studio' ? 'bg-black/80 border-y border-[#D4AF37]/20' : 'bg-[#f5ecd8] border-y border-[#5c1a16]/10'} relative`}>
        
        {/* Title pinned in the background/top */}
        <motion.div 
          style={{ opacity: opacityTransform }}
          className="absolute top-6 md:top-12 left-0 right-0 text-center px-6 pointer-events-none z-50"
        >
          <h2 className={`text-4xl md:text-5xl font-black ${branch === 'studio' ? 'text-[#111]' : 'text-[#2d1a12]'}`}>{t(lang, 'projects.horizontal_title')}</h2>
          <p className={`mt-3 text-lg ${branch === 'studio' ? 'text-[#333]/70' : 'text-[#4a3530]/70'}`}>{t(lang, 'projects.horizontal_subtitle')}</p>
        </motion.div>

        {/* The Horizontal Track */}
        <motion.div 
          ref={trackRef}
          style={{ x: xTransform }} 
          className="flex h-full items-center gap-6 md:gap-14 px-[5vw] md:px-[10vw]"
        >
          {displayProjects.map((project, index) => {
            // Sequential numbering: 01, 02, etc.
            const num = (index + 1).toString().padStart(2, '0');

            return (
              <motion.div
                key={project.id}
                // whileInView triggers when the horizontal transform drags this into the screen
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.3 }}
                dir="rtl"
                className={`relative flex-shrink-0 w-[90vw] md:w-[75vw] lg:w-[65vw] max-w-5xl h-[55vh] md:h-[60vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row group ${
                  branch === 'studio' ? 'bg-[#0a0a0a] border border-[#D4AF37]/30' : 'bg-[#5c1a16]'
                }`}
              >
                {/* Number overlay */}
                <motion.div 
                  variants={{ hidden: { opacity: 0, scale: 0.5 }, visible: { opacity: 0.1, scale: 1 } }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className={`absolute top-4 right-6 text-8xl md:text-9xl font-black pointer-events-none z-0 ${
                    branch === 'studio' ? 'text-white' : 'text-[#f5ecd8]'
                  }`}
                >
                  {num}
                </motion.div>

                {/* Left Side: Image (appearing second) */}
                <motion.div 
                  variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0 } }}
                  transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                  className="w-full md:w-[55%] h-1/2 md:h-full relative overflow-hidden z-10 bg-[#2d1a12]/20"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={project.imageUrl || project.images?.[0] || 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2574&auto=format&fit=crop'} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 max-w-[none]" 
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t opacity-80 md:hidden ${
                    branch === 'studio' ? 'from-[#0a0a0a] to-transparent' : 'from-[#5c1a16] to-transparent'
                  }`} />
                </motion.div>

                {/* Right Side: Content (Title first, then Description) */}
                <div className={`w-full md:w-[45%] p-8 md:p-12 flex flex-col justify-center z-10 text-[#f5ecd8] bg-gradient-to-t md:bg-gradient-to-r ${
                  branch === 'studio' ? 'from-[#0a0a0a] to-[#1a1a1a]' : 'from-[#5c1a16] to-[#6a211b]'
                }`}>
                  
                  {/* Title (appears first) */}
                  <motion.div
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                  >
                    <div className={`text-sm font-bold tracking-widest uppercase mb-2 ${
                      branch === 'studio' ? 'text-[#D4AF37]' : 'text-[#f5ecd8]/60'
                    }`}>
                      {project.category || (branch === 'studio' ? t(lang, 'projects.coding') : t(lang, 'globe.branding'))}
                    </div>
                    <h3 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
                      {project.title}
                    </h3>
                  </motion.div>

                  {/* Description & Link (appears third) */}
                  <motion.div
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
                  >
                    <p className={`text-base md:text-lg leading-relaxed mb-8 line-clamp-3 md:line-clamp-4 ${
                      branch === 'studio' ? 'text-[#f5ecd8]/70' : 'text-[#f5ecd8]/80'
                    }`}>
                      {project.description}
                    </p>
                    
                    <Link href={`/projects/${project.id}`}>
                      <button className={`flex items-center gap-3 px-6 py-3 rounded-full font-bold transition-all hover:gap-4 hover:shadow-lg ${
                        branch === 'studio' 
                          ? 'bg-[#D4AF37] text-black hover:bg-[#c9a334]' 
                          : 'bg-[#f5ecd8] text-[#5c1a16]'
                      }`}>
                        {t(lang, 'projects.view_project')} <ArrowLeft size={18} />
                      </button>
                    </Link>
                  </motion.div>

                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}

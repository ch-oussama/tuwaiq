"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import CountUp from 'react-countup';
import Link from 'next/link';
import { Package, Project } from '@/lib/db';
import { DUMMY_PACKAGES, DUMMY_REVIEWS, PROJECTS as DUMMY_PROJECTS } from '@/lib/dummyData';
import { useBranch } from '@/lib/BranchContext';
import { Star, ArrowLeft, ArrowUpLeft, Layers, Target, Diamond, Infinity as InfinityIcon, Play, Quote } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

import TimelineSection from '@/components/TimelineSection';
import DesignGlobe from '@/components/DesignGlobe';
import HorizontalProjects from '@/components/HorizontalProjects';

const fadeUp: any = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.9, ease: 'easeOut' }
  })
};

const features = [
  { icon: <Layers size={26} />,   title: 'هوية فريدة',       desc: 'تصميم يعبر عن جوهرك الحقيقي' },
  { icon: <InfinityIcon size={26} />, title: 'إبداع لا محدود',   desc: 'أفكار مبتكرة بحلول احترافية' },
  { icon: <Target size={26} />,   title: 'دقة & احترافية',   desc: 'نهتم بأدق التفاصيل للأفضل النتائج' },
  { icon: <Diamond size={26} />,  title: 'قيم تدوم',          desc: 'تصميم هوية تبقى وتصنع فرقا' },
];

export default function HomeClient({ packages, projects }: { packages: Package[], projects: Project[] }) {
  const { setBranch } = useBranch();
  const allPackages = packages.length > 0 ? packages : DUMMY_PACKAGES;
  const displayPackages = allPackages.filter(p => !p.branch || p.branch === 'studio');
  
  // Filter projects for the design branch
  const studioProjects = projects.filter(p => !p.branch || p.branch === 'studio');

  const branchReviews = displayPackages.flatMap(p => p.reviews || []);
  const activeReviews = branchReviews.length > 0 ? branchReviews : DUMMY_REVIEWS;
  const [activeReview, setActiveReview] = useState(0);
  const [hoveredSection, setHoveredSection] = useState<'dev' | 'des' | null>(null);

  // ─── Sticky Scroll Setup ───
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 1. Hero Out (0 - 0.12)
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.12], ["0vh", "-10vh"]);
  const heroDisplay = useTransform(scrollYProgress, (v) => v > 0.14 ? 'none' : 'flex') as any;


  // 2. Logo Transforms
  const logoX = useTransform(scrollYProgress, (v) => {
    if (isMobile) return '0px';
    if (v < 0.12) return '0px';
    if (v < 0.25) {
      const t = (v - 0.12) / 0.13;
      return `${t * 16}vw`; 
    }
    if (v < 0.60) return '16vw'; // Hold during About Us
    if (v < 0.75) {
      const t = (v - 0.60) / 0.15;
      return `${16 - t * 16}vw`; // Smooth return to center for services
    }
    return '0px';
  });

  const logoY = useTransform(scrollYProgress, (v) => {
    if (isMobile) return '0px';
    if (v < 0.12) return '-22vh'; 
    if (v < 0.25) {
      const t = (v - 0.12) / 0.13;
      return `${-22 + t * 22}vh`; 
    }
    if (v < 0.60) return '0vh'; 
    if (v < 0.75) {
      const t = (v - 0.60) / 0.15;
      return `${-t * 5}vh`; 
    }
    return '-5vh'; 
  });

  const logoScale = useTransform(scrollYProgress, [0, 0.60, 0.75], [1, 1, 1.45]); 
  const logoFilter = useTransform(scrollYProgress, [0.70, 0.85], ["drop-shadow(0px 0px 0px rgba(92,26,22,0))", "drop-shadow(0px 20px 40px rgba(92,26,22,0.3))"]);

  // 3. About Text
  const aboutOpacity = useTransform(scrollYProgress, [0.15, 0.25, 0.60, 0.70], [0, 1, 1, 0]);
  const aboutX = useTransform(scrollYProgress, [0.15, 0.25, 0.60, 0.70], ['-3vw', '0vw', '0vw', '-5vw']);
  const aboutY = useTransform(scrollYProgress, [0.15, 0.25], ['5vh', '0vh']);

  // 4. Services Text Reveal
  const servicesReveal = useTransform(scrollYProgress, [0.72, 0.85], [0, 1]);
  const servicesOpacity = useTransform(servicesReveal, [0, 1], [0, 1]);
  const servicesTracking = useTransform(servicesReveal, [0, 1], ["0.5em", "0em"]);
  const servicesScale = useTransform(servicesReveal, [0, 1], [0.95, 1]);

  // 5. Tech Box Reveal
  const boxY = useTransform(scrollYProgress, [0.72, 0.85], ["50vh", "0vh"]);
  const boxOpacity = useTransform(scrollYProgress, [0.72, 0.85], [0, 1]);
  const boxGlow = useTransform(scrollYProgress, [0.85, 0.95], ["0px 0px 0px rgba(92,26,22,0)", "0px 0px 30px rgba(92,26,22,0.15)"]);
  
  // 6. Box Inner Components Reveal
  const developOpacity = useTransform(scrollYProgress, [0.78, 0.88], [0, 1]);
  const developY = useTransform(scrollYProgress, [0.78, 0.88], [20, 0]);
  
  const designOpacity = useTransform(scrollYProgress, [0.82, 0.92], [0, 1]);
  const designY = useTransform(scrollYProgress, [0.82, 0.92], [20, 0]);

  // 7. Fade out box when timeline enters view
  const servicesEndRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: endSectionProgress } = useScroll({
    target: servicesEndRef,
    offset: ["start 100vh", "start 60vh"]  // faster fade-out
  });
  const boxFinalOpacity = useTransform(
    [boxOpacity, endSectionProgress] as const,
    ([bOp, eP]: number[]) => (bOp as number) * Math.max(0, 1 - (eP as number))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveReview(prev => (prev + 1) % activeReviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeReviews.length]);

  return (
    <div
      className="flex flex-col w-full min-h-screen relative overflow-clip bg-noise"
    >
      {/* Fixed Background */}
      <div
        className="fixed inset-0 bg-cover bg-center -z-10"
        aria-hidden
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/bg studio.png')" }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/65 pointer-events-none" />
      </div>

      {/* Ambient glow */}
      <div className="fixed top-[-30%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[#D4AF37]/10 blur-[120px] pointer-events-none -z-[5]" />

      {/* Dynamic Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, -8, 0] }}
        transition={{ 
          opacity: { delay: 1.5, duration: 1 },
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" } 
        }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex flex-col items-center pointer-events-none"
      >
        <div className="w-5 h-8 border-[1.5px] border-[#D4AF37] rounded-full flex justify-center pt-1 mb-1 relative">
          <motion.div
            animate={{
              y: [0, 8, 0],
              opacity: [1, 0, 1]
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-1 h-2 rounded-full bg-[#D4AF37]"
          />
        </div>
        <div className="w-[1px] h-6 bg-gradient-to-b from-[#D4AF37]/60 to-transparent" />
        <span className="text-[11px] font-bold tracking-widest text-[#D4AF37] mt-2">اسحب للأسفل</span>
      </motion.div>

      {/* ─── Hero + About + Services Cinematic Scroll Sequence ─── */}
      <section ref={containerRef} className="relative z-10 w-full" style={{ height: "300vh" }}>
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex items-center justify-center">
          
          {/* About Text (Fades in and stays WIDE horizontally) */}
          <motion.div 
            style={{ opacity: aboutOpacity, x: aboutX, y: aboutY }}
            className="absolute left-[8%] lg:left-[15%] top-1/2 -translate-y-1/2 flex flex-col items-center lg:items-start text-center lg:text-right max-w-[95vw] lg:max-w-4xl px-6 z-10"
          >
            <h2 className="text-xs font-black text-[#D4AF37] tracking-[0.3em] uppercase mb-4 w-full">من نحن</h2>
            <h3 className="text-4xl md:text-5xl lg:text-[54px] font-black text-white leading-[1.3] mb-6 lg:whitespace-nowrap white-glow">
              لسنا مجرد مصورين،
              <br className="hidden md:block"/>
              نحن
              <br className="hidden md:block"/>
              <span className="italic text-[#D4AF37]">مهندسو أحلامك الرقمية.</span>
            </h3>
            <p className="text-lg text-white/70 leading-relaxed mb-8 max-w-2xl drop-cap">
              في أستوديو طويق، نؤمن أن الإبداع الحقيقي يكتمل بالقوة التصوير والهندسة الصوتية. ندمج بين الجماليات الفاخرة وأحدث التقنيات لتقديم شيء تسطر قصة نجاحك وتلبي طموحاتك.
            </p>
            <div className="flex gap-10 pt-4 border-t border-[#D4AF37]/30">
              <div>
                <h4 className="text-4xl font-black text-white"><CountUp end={50} suffix="+" /></h4>
                <p className="text-sm font-bold text-white/50 mt-1">مشروع منجز</p>
              </div>
              <div>
                <h4 className="text-4xl font-black text-white gradient-gold">Premium</h4>
                <p className="text-sm font-bold text-white/50 mt-1">جودة لا تُضاهى</p>
              </div>
            </div>
          </motion.div>

          {/* الكود بعد التعديل لرفع اللوجو */}
          <motion.div 
            style={{ x: logoX, y: logoY, scale: logoScale, filter: logoFilter }}
            className="absolute top-[43%] -translate-y-1/2 flex items-center justify-center z-20 pointer-events-none"
          >   
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo studio.webp"
              alt="أستوديو طويق"
              fetchPriority="high"
              className="h-40 sm:h-48 md:h-[14rem] lg:h-[18rem] object-contain relative z-10"
            />
          </motion.div>

          {/* Hero Content (Fades out quickly on scroll) */}
          <motion.div 
            style={{ opacity: heroOpacity, y: heroY, display: heroDisplay }}
            className="absolute top-[45%] md:top-[42%] flex flex-col items-center w-full z-30 px-6"
          >
            {/* TUWAIQ DESIGN subtitle */}
            <p className="text-[10px] sm:text-xs md:text-sm tracking-[0.5em] font-medium text-[#D4AF37]/70 mb-6 lg:mb-8">
              T U W A I Q &nbsp; S T U D I O
            </p>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white leading-tight mb-4 lg:mb-5 text-center gold-glow-strong">
              تصوير ومونتاج احترافي
              <br />
              <span className="text-[#D4AF37]">وهندسة صوتية</span>
            </h1>

            {/* Subtext */}
            <p className="text-base lg:text-lg text-white/70 font-medium mb-10 max-w-md text-center">
              نحو منصات تعكس رؤيتك وتعزز نجاحك
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-5">
              <Link
                href="/projects"
                className="flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#D4AF37] text-[#f5ecd8] font-black text-sm sm:text-base shadow-xl hover:bg-[#3D0A0C] transition-all hover:scale-105 box-gold-glow"
              >
                استكشف أعمالنا
                <ArrowLeft size={18} />
              </Link>
              <button className="flex items-center gap-3 text-[#D4AF37] font-bold text-sm sm:text-base hover:opacity-70 transition-opacity">
                <div className="w-10 h-10 rounded-full border-2 border-[#D4AF37] flex items-center justify-center">
                  <Play size={14} fill="#D4AF37" />
                </div>
                شاهد الفيديو
              </button>
            </div>

            {/* Feature Icons Row */}
            <div className="mt-14 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 w-full max-w-4xl">
              {features.map((f, i) => (
                <div key={i} className="flex flex-col items-center gap-2 text-center group">
                  <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] transition-all">
                    {f.icon}
                  </div>
                  <h4 className="font-black text-white text-xs lg:text-sm">{f.title}</h4>
                  <p className="text-[10px] lg:text-[11px] text-white/50 max-w-[100px] leading-relaxed hidden sm:block">{f.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ─── New Services Section (Left Text & Right Box) ─── */}
          
          {/* Left Text: "خدماتنا" */}
          <motion.div
            style={{ opacity: servicesOpacity, letterSpacing: servicesTracking, scale: servicesScale }}
            className="absolute left-[5%] lg:left-[10%] top-[58%] lg:top-[46%] text-center lg:text-right z-30 pointer-events-none"
          >
            <h2 className="text-5xl md:text-7xl lg:text-7xl font-black text-[#D4AF37] uppercase drop-shadow-xl gold-glow-strong">
              خدماتنا
            </h2>
            <p className="text-white/60 text-base md:text-lg font-bold mt-3 tracking-widest hidden lg:block">
              نحن نصنع التميز
            </p>
          </motion.div>

          {/* OLD TECH BOX REMOVED - now rendered as fixed element below */}

        </div>
      </section>

      {/* ─── Fixed Services Tech Box ─── Persists beyond sticky section ─── */}
      <motion.div
        style={{ opacity: boxFinalOpacity, y: boxY, boxShadow: boxGlow }}
        className="fixed right-[5%] lg:right-[8%] top-[25%] w-[88vw] lg:w-[380px] border-[2px] border-dashed border-[#D4AF37]/50 bg-black/70 backdrop-blur-lg rounded-lg z-[90] pointer-events-auto box-gold-glow"
      >
        {/* Corner Markers */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37] -mt-1 -ml-1 rounded-tl" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#D4AF37] -mt-1 -mr-1 rounded-tr" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#D4AF37] -mb-1 -ml-1 rounded-bl" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37] -mb-1 -mr-1 rounded-br" />

        {/* Develop */}
        <motion.div style={{ opacity: developOpacity, y: developY }}>
          <div
            onMouseEnter={() => setHoveredSection('dev')}
            onMouseLeave={() => setHoveredSection(null)}
            style={{ 
              opacity: hoveredSection === 'des' ? 0.4 : 1,
              backgroundColor: hoveredSection === 'dev' ? 'rgba(212,175,55,0.08)' : 'transparent',
              boxShadow: hoveredSection === 'dev' ? '0 10px 30px -10px rgba(212,175,55,0.2)' : 'none'
            }}
            className="p-7 rounded-t-lg cursor-default transition-all duration-500"
          >
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-2xl font-black tracking-wide" style={{ color: hoveredSection === 'dev' ? '#D4AF37' : 'white' }}>تصوير وانتاج</h3>
              <div className="p-2 rounded-md transition-all duration-300" style={{ background: hoveredSection === 'dev' ? 'rgba(212,175,55,0.3)' : 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
              </div>
            </div>
            <p className="text-sm font-bold leading-relaxed border-r-2 pr-3 mb-4 transition-all duration-300" style={{ color: 'rgba(255,255,255,0.7)', borderColor: hoveredSection === 'dev' ? '#D4AF37' : 'rgba(212,175,55,0.2)' }}>
            نخلّد لحظاتك ونصنع محتوى مرئي احترافي، من التصوير السينمائي إلى المونتاج وإخراج الفيديو بأعلى جودة.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Cinematic", "Photography", "Videography", "Montage", "Editing"].map(tag => (
                <span key={tag} className="px-2.5 py-1 border text-[10px] font-bold rounded-full transition-all duration-300" style={{ background: 'rgba(212,175,55,0.08)', borderColor: hoveredSection === 'dev' ? 'rgba(212,175,55,0.6)' : 'rgba(212,175,55,0.2)', color: '#D4AF37' }}>{tag}</span>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="mx-6 border-t-2 border-dashed border-[#D4AF37]/25" />

        {/* Design */}
        <motion.div style={{ opacity: designOpacity, y: designY }}>
          <div
            onMouseEnter={() => setHoveredSection('des')}
            onMouseLeave={() => setHoveredSection(null)}
            style={{ 
              opacity: hoveredSection === 'dev' ? 0.4 : 1,
              backgroundColor: hoveredSection === 'des' ? 'rgba(212,175,55,0.08)' : 'transparent',
              boxShadow: hoveredSection === 'des' ? '0 -10px 30px -10px rgba(212,175,55,0.2)' : 'none'
            }}
            className="p-7 rounded-b-lg cursor-default transition-all duration-500"
          >
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-2xl font-black tracking-wide" style={{ color: hoveredSection === 'des' ? '#D4AF37' : 'white' }}>تحسين أداء الألعاب</h3>
              <div className="p-2 rounded-md transition-all duration-300" style={{ background: hoveredSection === 'des' ? 'rgba(212,175,55,0.3)' : 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
            </div>
            <p className="text-sm font-bold leading-relaxed border-r-2 pr-3 mb-4 transition-all duration-300" style={{ color: 'rgba(255,255,255,0.7)', borderColor: hoveredSection === 'des' ? '#D4AF37' : 'rgba(212,175,55,0.2)' }}>
            نرفع كفاءة جهازك للحد الأقصى، للتخلص من الـ Lag والـ FPS Drop وضمان تجربة لعب سلسة واستجابة فائقة.
            </p>
            <div className="flex flex-wrap gap-2">
              {["FPS Boost", "PC Tweaks", "Low Latency", "Ping Fix", "Windows Opt"].map(tag => (
                <span key={tag} className="px-2.5 py-1 border text-[10px] font-bold rounded-full transition-all duration-300" style={{ background: 'rgba(212,175,55,0.08)', borderColor: hoveredSection === 'des' ? 'rgba(212,175,55,0.6)' : 'rgba(212,175,55,0.2)', color: '#D4AF37' }}>{tag}</span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ─── Glowing Experience Timeline ─── */}
      <div ref={servicesEndRef} />

      {/* Glass Divider */}
      <div className="glass-divider w-3/4 max-w-2xl" />
      <TimelineSection />

      {/* Glass Divider */}
      <div className="glass-divider w-3/4 max-w-2xl" />

      {/* ─── Design Skills Globe ─── */}
      <DesignGlobe />

      {/* ─── Projects Grid (Horizontal Scroll Hijack) ─── */}
      <HorizontalProjects projects={studioProjects} />

      {/* Glass Divider */}
      <div className="glass-divider w-3/4 max-w-2xl" />

      {/* ─── Reviews ─── */}
      <section id="reviews" className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black text-white mb-14 gold-glow">ماذا يقولون عنّا</h2>
          <div className="relative bg-black/50 backdrop-blur-md border border-[#D4AF37]/30 rounded-3xl p-10 shadow-2xl box-gold-glow">
            <Quote size={36} className="text-[#D4AF37]/40 mx-auto mb-4" />
            <p className="text-xl text-white/85 font-medium leading-relaxed mb-8">
              "{activeReviews[activeReview]?.content}"
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center justify-center font-black text-[#D4AF37]">
                {activeReviews[activeReview]?.author?.[0]}
              </div>
              <div className="text-right">
                <p className="font-black text-white">{activeReviews[activeReview]?.author}</p>
                <div className="flex gap-0.5">
                  {[...Array(activeReviews[activeReview]?.rating || 5)].map((_, i) => (
                    <Star key={i} size={12} fill="#D4AF37" className="text-[#D4AF37]" />
                  ))}
                </div>
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {activeReviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveReview(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === activeReview ? 'w-6 bg-[#D4AF37]' : 'bg-[#D4AF37]/30'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="relative z-10 border-t border-[#D4AF37]/20 py-10 px-6 text-center">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo studio.webp" className="w-10 h-10 rounded-full opacity-70" alt="Tuwaiq Studio" />
          <p className="text-sm text-white/50 font-medium">أستوديو طويق — إبداع لا حدود له &copy; {new Date().getFullYear()}</p>
          <div className="flex gap-5 text-sm font-bold text-[#D4AF37]/60">
            <a href="#" className="hover:text-[#D4AF37] transition-colors">واتساب</a>
            <a href="#" className="hover:text-[#D4AF37] transition-colors">إنستقرام</a>
            <a href="#" className="hover:text-[#D4AF37] transition-colors">𝕏</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

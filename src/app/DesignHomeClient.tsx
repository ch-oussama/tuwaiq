"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { Package } from '@/lib/db';
import { DUMMY_PACKAGES, DUMMY_REVIEWS } from '@/lib/dummyData';
import { useBranch } from '@/lib/BranchContext';
import { Star, ArrowLeft, ArrowUpLeft, Layers, Target, Diamond, Infinity as InfinityIcon, Play, Quote } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

import TimelineSection from '@/components/TimelineSection';
import DesignGlobe from '@/components/DesignGlobe';

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

export default function DesignHomeClient({ packages }: { packages: Package[] }) {
  const { setBranch } = useBranch();
  const allPackages = packages.length > 0 ? packages : DUMMY_PACKAGES;
  const displayPackages = allPackages.filter(p => !p.branch || p.branch === 'design');

  const branchReviews = displayPackages.flatMap(p => p.reviews || []);
  const activeReviews = branchReviews.length > 0 ? branchReviews : DUMMY_REVIEWS;
  const [activeReview, setActiveReview] = useState(0);

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

  // 1. Hero Out
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.25], ["0vh", "-10vh"]);
  const heroDisplay = useTransform(scrollYProgress, (v) => v > 0.3 ? 'none' : 'flex') as any;

  // 2. Logo Move — stretched range for slower, more cinematic movement
  const progress40_75 = useTransform(scrollYProgress, [0.2, 0.85], [0, 1]);
  const logoScale = useTransform(progress40_75, [0, 1], [1, 1.15]);
  const logoX = useTransform(progress40_75, (v) => isMobile ? '0vw' : `${v * 10}vw`);
  const logoY = useTransform(progress40_75, (v) => {
    if (isMobile) return `${-12 - (v * 25)}vh`;
    return `${v * 20}vh`; // Slow descent to meet About text
  });

  // 3. About Move — also stretched to sync with slower logo
  const progress60_90 = useTransform(scrollYProgress, [0.50, 0.9], [0, 1]);
  const aboutOpacity = useTransform(progress60_90, [0, 1], [0, 1]);
  const aboutX = useTransform(progress60_90, (v) => isMobile ? '0vw' : '-18vw');
  const aboutY = useTransform(progress60_90, (v) => {
    if (isMobile) return `${25 - (v * 15)}vh`;
    return `${20 - (v * 15)}vh`;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveReview(prev => (prev + 1) % activeReviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeReviews.length]);

  return (
    <div
      className="flex flex-col w-full min-h-screen relative overflow-clip"
      style={{
        backgroundImage: "url('/bg design.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay */}
      <div className="fixed inset-0 bg-[#f5ecd8]/60 pointer-events-none z-0" />

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
        <div className="w-5 h-8 border-[1.5px] border-[#5c1a16] rounded-full flex justify-center pt-1 mb-1 relative">
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
            className="w-1 h-2 rounded-full bg-[#5c1a16]"
          />
        </div>
        <div className="w-[1px] h-6 bg-gradient-to-b from-[#5c1a16]/60 to-transparent" />
        <span className="text-[11px] font-bold tracking-widest text-[#5c1a16] mt-2">اسحب للأسفل</span>
      </motion.div>

      {/* ─── Hero + About Scroll Sequence ─── */}
      <section ref={containerRef} className="relative z-10 w-full" style={{ height: "150vh" }}>
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex items-center justify-center">
          
          {/* About Text (Fades in and moves up/left) */}
          <motion.div 
            style={{ opacity: aboutOpacity, x: aboutX, y: aboutY }}
            className="absolute flex flex-col items-center lg:items-start text-center lg:text-right max-w-xl px-6 w-full z-10"
          >
            <h2 className="text-xs font-black text-[#5c1a16] tracking-[0.3em] uppercase mb-4">من نحن</h2>
            <h3 className="text-4xl md:text-5xl font-black text-[#2d1a12] leading-tight mb-6">
              لسنا مجرد مصممين، نحن{' '}
              <br className="hidden md:block"/>
              <span className="italic text-[#5c1a16]">صُنّاع الهويات الخالدة.</span>
            </h3>
            <p className="text-lg text-[#4a3530]/80 leading-relaxed mb-8">
              في طويق ديزاين، نؤمن أن كل علامة تجارية تحمل روحاً تنتظر أن تُعبَّر عنها. نصمم هويات بصرية فاخرة وشعارات راسخة تجعلك لا تُنسى في أذهان جمهورك.
            </p>
            <div className="flex gap-10 pt-4 border-t border-[#5c1a16]/20">
              <div>
                <h4 className="text-4xl font-black text-[#2d1a12]">+80</h4>
                <p className="text-sm font-bold text-[#4a3530]/60 mt-1">هوية منجزة</p>
              </div>
              <div>
                <h4 className="text-4xl font-black text-[#2d1a12]">Premium</h4>
                <p className="text-sm font-bold text-[#4a3530]/60 mt-1">جودة لا تُضاهى</p>
              </div>
            </div>
          </motion.div>

          {/* Logo Container (Scales very slightly and strictly moves UP/DOWN based on device) */}
          <motion.div 
            style={{ x: logoX, y: logoY, scale: logoScale }}
            className="absolute top-[12%] md:top-[12%] flex items-center justify-center z-20 pointer-events-none"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/title of design.png"
              alt="طويق ديزاين"
              className="h-44 sm:h-56 md:h-[18rem] object-contain relative z-10"
            />
          </motion.div>

          {/* Hero Content (Fades out quickly on scroll) */}
          <motion.div 
            style={{ opacity: heroOpacity, y: heroY, display: heroDisplay }}
            className="absolute top-[42%] md:top-[38%] flex flex-col items-center w-full z-30 px-6"
          >
            {/* TUWAIQ DESIGN subtitle */}
            <p className="text-[10px] sm:text-xs md:text-sm tracking-[0.5em] font-medium text-[#5c1a16]/70 mb-6 lg:mb-8">
              T U W A I Q &nbsp; D E S I G N
            </p>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-[#2d1a12] leading-tight mb-4 lg:mb-5 text-center">
              تصميم هويات بصرية
              <br />
              <span className="text-[#5c1a16]">وشعارات احترافية</span>
            </h1>

            {/* Subtext */}
            <p className="text-base lg:text-lg text-[#4a3530]/80 font-medium mb-10 max-w-md text-center">
              نحو هوية تعكس رؤيتك وتبقى في الذاكرة
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-5">
              <Link
                href="/projects"
                className="flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-[#5c1a16] text-[#f5ecd8] font-black text-sm sm:text-base shadow-xl hover:bg-[#3D0A0C] transition-all hover:scale-105"
              >
                استكشف أعمالنا
                <ArrowLeft size={18} />
              </Link>
              <button className="flex items-center gap-3 text-[#5c1a16] font-bold text-sm sm:text-base hover:opacity-70 transition-opacity">
                <div className="w-10 h-10 rounded-full border-2 border-[#5c1a16] flex items-center justify-center">
                  <Play size={14} fill="#5c1a16" />
                </div>
                شاهد الفيديو
              </button>
            </div>

            {/* Feature Icons Row */}
            <div className="mt-14 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 w-full max-w-4xl">
              {features.map((f, i) => (
                <div key={i} className="flex flex-col items-center gap-2 text-center group">
                  <div className="w-12 h-12 rounded-2xl bg-[#5c1a16]/10 border border-[#5c1a16]/20 flex items-center justify-center text-[#5c1a16] transition-all">
                    {f.icon}
                  </div>
                  <h4 className="font-black text-[#2d1a12] text-xs lg:text-sm">{f.title}</h4>
                  <p className="text-[10px] lg:text-[11px] text-[#4a3530]/60 max-w-[100px] leading-relaxed hidden sm:block">{f.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* ─── Glowing Experience Timeline ─── */}
      <TimelineSection />

      {/* ─── Design Skills Globe ─── */}
      <DesignGlobe />

      {/* ─── Projects Grid ─── */}
      <section id="projects" className="relative z-30 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-14">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-[#2d1a12]">أعمالنا</h2>
              <p className="mt-3 text-lg text-[#4a3530]/70">لمحة من إبداعاتنا البصرية الفاخرة</p>
            </div>
            <Link href="/projects" className="flex items-center gap-2 font-black text-[#5c1a16] hover:opacity-70 transition-opacity">
              الكل <ArrowUpLeft size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayPackages.slice(0, 3).map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.8 }}
                className="group rounded-3xl overflow-hidden border border-[#5c1a16]/15 bg-[#f5ecd8]/60 backdrop-blur-sm shadow-sm hover:shadow-xl transition-all"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={pkg.thumbnailUrl} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-[#5c1a16] text-[#f5ecd8] px-4 py-1.5 rounded-full text-sm font-black">
                    ${pkg.price}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-black text-[#2d1a12] text-xl mb-2">{pkg.title}</h3>
                  <p className="text-sm text-[#4a3530]/70 leading-relaxed line-clamp-2">{pkg.description}</p>
                  <Link href={`/packages/${pkg.id}`} className="mt-4 inline-flex items-center gap-2 text-[#5c1a16] font-bold text-sm hover:gap-3 transition-all">
                    تفاصيل الباقة <ArrowLeft size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Reviews ─── */}
      <section id="reviews" className="relative z-10 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-black text-[#2d1a12] mb-14">ماذا يقولون عنّا</h2>
          <div className="relative bg-[#f5ecd8]/80 backdrop-blur-md border border-[#5c1a16]/15 rounded-3xl p-10 shadow-sm">
            <Quote size={36} className="text-[#5c1a16]/30 mx-auto mb-4" />
            <p className="text-xl text-[#2d1a12] font-medium leading-relaxed mb-8">
              "{activeReviews[activeReview]?.content}"
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#5c1a16]/20 flex items-center justify-center font-black text-[#5c1a16]">
                {activeReviews[activeReview]?.author?.[0]}
              </div>
              <div className="text-right">
                <p className="font-black text-[#2d1a12]">{activeReviews[activeReview]?.author}</p>
                <div className="flex gap-0.5">
                  {[...Array(activeReviews[activeReview]?.rating || 5)].map((_, i) => (
                    <Star key={i} size={12} fill="#5c1a16" className="text-[#5c1a16]" />
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
                  className={`w-2 h-2 rounded-full transition-all ${i === activeReview ? 'w-6 bg-[#5c1a16]' : 'bg-[#5c1a16]/30'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="relative z-10 border-t border-[#5c1a16]/15 py-10 px-6 text-center">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo design.webp" className="w-10 h-10 rounded-full opacity-70" alt="Tuwaiq Design" />
          <p className="text-sm text-[#4a3530]/60 font-medium">طويق ديزاين — إبداع لا حدود له &copy; {new Date().getFullYear()}</p>
          <div className="flex gap-5 text-sm font-bold text-[#5c1a16]/60">
            <a href="#" className="hover:text-[#5c1a16] transition-colors">واتساب</a>
            <a href="#" className="hover:text-[#5c1a16] transition-colors">إنستقرام</a>
            <a href="#" className="hover:text-[#5c1a16] transition-colors">𝕏</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

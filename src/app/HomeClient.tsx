"use client";

import { motion, AnimatePresence, useScroll, useTransform, useMotionTemplate, useMotionValue } from 'framer-motion';
import Link from 'next/link';
import { Package } from '@/lib/db';
import { DUMMY_PACKAGES, DUMMY_REVIEWS } from '@/lib/dummyData';
import { useBranch } from '@/lib/BranchContext';
import { Star, ArrowUpLeft, Hexagon, Quote } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

// === $3000 Premium Animations ===
const fadeUpObj: any = {
  hidden: { opacity: 0, y: 50 },
  visible: (custom: number) => ({
    opacity: 1, 
    y: 0, 
    transition: { delay: custom * 0.1, duration: 1, ease: 'easeOut' }
  })
};

const maskRevealObj: any = {
  hidden: { y: "150%", rotate: 5 },
  visible: (custom: number) => ({
    y: "0%", 
    rotate: 0,
    transition: { delay: custom * 0.1, duration: 1.2, ease: [0.16, 1, 0.3, 1] }
  })
};

const MagneticButton = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const ref = useRef<HTMLDivElement>(null);

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((e.clientX - centerX) * 0.2);
    y.set((e.clientY - centerY) * 0.2);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ x, y }}
      className={`relative inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default function HomeClient({ packages }: { packages: Package[] }) {
  const { branch } = useBranch();
  const allPackages = packages.length > 0 ? packages : DUMMY_PACKAGES;
  const displayPackages = allPackages.filter(p => !p.branch || p.branch === branch);
  
  // Grab reviews from filtered packages, fallback to dummy
  const branchReviews = displayPackages.flatMap(p => p.reviews || []);
  const activeReviews = branchReviews.length > 0 ? branchReviews : DUMMY_REVIEWS;

  const [activeReview, setActiveReview] = useState(0);
  const { scrollYProgress } = useScroll();
  
  // Parallax effects
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // Auto-rotate reviews
  useEffect(() => {
    setActiveReview(0);
    const interval = setInterval(() => {
      setActiveReview(prev => (prev + 1) % activeReviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeReviews.length, branch]);

  return (
    <div className="flex flex-col w-full bg-noise relative overflow-clip">
      
      {/* ─── Hero Section (Avant-Garde Style) ─── */}
      <section className="relative min-h-[95vh] flex items-center justify-center pt-20 px-4 sm:px-8">
        {/* Background Ambient Glow — commented out, uncomment to restore */}
        {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-brand-gold/10 blur-[120px] rounded-full pointer-events-none" /> */}
        
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Main Title Area */}
          <div className="flex-1 relative z-20 flex flex-col md:items-center text-center">
            <motion.div
              custom={0} initial="hidden" animate="visible" variants={fadeUpObj}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full border border-border bg-surface/50 backdrop-blur-md mb-8"
            >
              <Hexagon size={16} className="text-brand-gold animate-spin-slow" />
              <span className="text-sm font-bold tracking-widest uppercase text-brand-gold">أستوديو رقمي فاخر</span>
            </motion.div>
            
            <h1 className="text-6xl md:text-[5.5rem] lg:text-[7rem] font-black leading-[1.05] tracking-tight mb-8 flex flex-col text-foreground">
              <span className="overflow-hidden pb-4">
                <motion.span custom={1} initial="hidden" animate="visible" variants={maskRevealObj} className="block origin-bottom-left">
                  نصنع أثراً
                </motion.span>
              </span>
              <span className="overflow-hidden pb-4">
                <motion.span custom={2} initial="hidden" animate="visible" variants={maskRevealObj} className="block text-brand-gold italic origin-bottom-left">
                  رقمياً لا يُنسى.
                </motion.span>
              </span>
            </h1>
            
            <motion.p custom={3} initial="hidden" animate="visible" variants={fadeUpObj} className="text-xl md:text-2xl font-medium max-w-xl mb-12 leading-relaxed text-foreground/80">
              تجارب مستخدم استثنائية، هويات بصرية خالدة، ومنصات برمجية تفوق توقعات المستقبل.
            </motion.p>
            
            <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUpObj} className="flex flex-wrap gap-6 items-center justify-center">
              <MagneticButton>
                <Link
                  href="/packages"
                  className="group relative flex items-center gap-4 bg-brand-brown text-brand-beige px-10 py-5 rounded-full font-black text-lg overflow-hidden shadow-2xl transition-transform hover:scale-105"
                >
                  <span className="relative z-10">اكتشف باقاتنا</span>
                  <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center relative z-10 group-hover:bg-brand-gold group-hover:text-brand-brown transition-colors">
                    <ArrowUpLeft size={20} className="group-hover:-rotate-45 transition-transform" />
                  </div>
                  {/* Sweep element */}
                  <div className="absolute inset-0 w-0 bg-brand-gold transition-all duration-500 ease-out group-hover:w-full" style={{ zIndex: 0 }} />
                </Link>
              </MagneticButton>
            </motion.div>
          </div>


        </motion.div>
      </section>

      {/* ─── About Section (Overlapping Layers) ─── */}
      <section id="about" className="py-32 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1 }}
              className="flex-1 relative"
            >
              <div className="aspect-square w-full max-w-md rounded-full bg-border/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-3xl" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={branch === 'design' ? "/logo design.webp" : "/logo studio.webp"}
                alt={branch === 'design' ? "Tuwaiq Design" : "Tuwaiq Studio"}
                className={`w-3/4 mx-auto relative z-10 drop-shadow-[0_20px_50px_rgba(212,175,55,0.3)] animate-pulse-slow ${
                  branch === 'design' ? 'rounded-full' : ''
                }`}
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1, delay: 0.2 }}
              className="flex-1 space-y-8"
            >
              <h2 className="text-sm font-black text-brand-gold tracking-[0.2em] uppercase">رؤيتنا</h2>
              <h3 className="text-4xl md:text-5xl font-black leading-tight text-foreground">
                {branch === 'design' ? (
                  <>لسنا مجرد مصممين، نحن <span className="italic text-brand-gold">صُنّاع الهويات الخالدة.</span></>
                ) : (
                  <>لسنا مجرد مبرمجين، نحن <span className="italic text-brand-gold">مهندسو أحلامك الرقمية.</span></>
                )}
              </h3>
              <p className="text-xl text-foreground/70 font-medium leading-relaxed">
                {branch === 'design' 
                  ? "في طويق ديزاين، نؤمن أن كل علامة تجارية تحمل روحاً تنتظر أن تُعبَّر عنها. نصمم هويات بصرية فاخرة وشعارات راسخة تجعلك لا تُنسى في أذهان جمهورك."
                  : "في أستوديو طويق، نؤمن أن التصميم العظيم لا يُرى فقط، بل يُشعر به. ندمج بين الجماليات الفاخرة والقوة البرمجية لتقديم منصات تسطر قصة نجاحك وتعكس قيمتك الحقيقية في السوق."
                }
              </p>
              <div className="pt-4 flex gap-8 border-t border-border mt-8">
                <div>
                  <h4 className="text-4xl font-black text-foreground">150+</h4>
                  <p className="font-bold text-sm mt-1 text-foreground/70">مشروع منجز</p>
                </div>
                <div>
                  <h4 className="text-4xl font-black text-foreground">Elite</h4>
                  <p className="font-bold text-sm mt-1 text-foreground/70">جودة عالمية</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Premium Packages Grid ─── */}
      <section id="packages" className="py-32 bg-surface/30 relative border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-10% 0px' }}>
              <motion.h2 variants={fadeUpObj} custom={0} className="text-4xl md:text-6xl font-black text-foreground">باقات حصرية</motion.h2>
              <motion.p variants={fadeUpObj} custom={1} className="mt-4 text-xl font-medium max-w-xl text-foreground/70">
                استثمر في التفوق مع باقاتنا المصممة لتلبية تطلعات المشاريع النخبوية.
              </motion.p>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <Link href="/packages" className="group flex items-center gap-3 font-black text-lg text-brand-brown hover:text-brand-gold transition-colors">
                عرض الكتالوج الكامل <ArrowUpLeft className="group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayPackages.slice(0, 3).map((pkg, i) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: i * 0.15, duration: 0.8, ease: "easeOut" }}
                className="group relative rounded-[2.5rem] bg-surface border border-border p-3 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                {/* Glow behind the card */}
                <div className="absolute inset-0 bg-brand-gold/0 group-hover:bg-brand-gold/10 transition-colors duration-500 rounded-[2.5rem]" />
                
                <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden mb-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pkg.thumbnailUrl}
                    alt={pkg.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-1000 ease-out"
                  />
                  <div className="absolute top-4 left-4 glass px-5 py-2.5 rounded-full font-black text-brand-brown backdrop-blur-xl border-white/30 shadow-lg">
                    ${pkg.price}
                  </div>
                </div>
                
                <div className="px-5 pb-5 relative z-10 flex flex-col h-full">
                  <h3 className="text-2xl font-black mb-3 group-hover:text-brand-gold transition-colors text-foreground">{pkg.title}</h3>
                  <p className="mb-8 font-medium leading-relaxed text-foreground/70">{pkg.shortDescription}</p>
                  
                  <div className="mt-auto">
                    <Link
                      href={`/packages/${pkg.id}`}
                      className="flex items-center justify-between w-full p-4 rounded-2xl border border-border transition-all duration-300 bg-border/20 hover:bg-brand-brown hover:border-brand-brown group"
                    >
                      <span className="font-bold text-foreground group-hover:text-brand-beige">التفاصيل الكاملة</span>
                      <ArrowUpLeft className="text-brand-gold group-hover:text-brand-beige group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Elite Aesthetic Reviews ─── */}
      <section id="reviews" className="py-32 relative overflow-hidden">
        {/* Big subtle quote mark */}
        <Quote size={400} className="absolute -top-10 -left-20 text-brand-gold/5 -rotate-12 pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-20">
            <h2 className="text-sm font-black text-brand-gold tracking-[0.2em] uppercase mb-4">آراء العملاء النخبة</h2>
            <h3 className="text-4xl md:text-5xl font-black text-brand-brown">صُناع النجاح يتحدثون</h3>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeReview}
                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="bg-surface/80 glass rounded-[3rem] p-10 md:p-16 border border-white/20 shadow-2xl relative"
              >
                <div className="flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-right">
                  <div className="flex-shrink-0 w-24 h-24 rounded-full flex items-center justify-center font-black text-3xl shadow-inner border-4 border-border bg-surface text-brand-gold">
                    {activeReviews[activeReview]?.author?.charAt(0) || 'U'}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex gap-1 mb-6 justify-center md:justify-start" style={{ color: '#D4AF37' }}>
                      {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
                    </div>
                    <p className="text-2xl md:text-3xl font-medium leading-relaxed mb-8 text-balance text-foreground">
                      &quot;{activeReviews[activeReview]?.content}&quot;
                    </p>
                    <div>
                      <p className="font-black text-xl text-foreground">{activeReviews[activeReview]?.author}</p>
                      <p className="text-sm font-bold text-brand-gold tracking-wide uppercase mt-1">
                        {/* @ts-ignore */}
                        {activeReviews[activeReview]?.packageTitle || 'مراجعة عميل'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Pips */}
            <div className="flex justify-center gap-3 mt-12">
              {activeReviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveReview(i)}
                  className={`transition-all duration-500 rounded-full ${i === activeReview ? 'w-12 bg-brand-gold' : 'w-3 bg-border hover:bg-brand-brown'}`}
                  style={{ height: 12 }}
                  aria-label={`Review ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Mega Footer CTA ─── */}
      <section className="py-32 text-center relative overflow-hidden" style={{ background: '#1A0A05' }}>
        {/* Subtle texture */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full blur-[120px] pointer-events-none" style={{ background: 'rgba(163,29,36,0.18)' }} />
        <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1 }} className="relative z-10 max-w-3xl mx-auto px-4">
          <h2 className="text-5xl md:text-7xl font-black mb-6" style={{ color: '#F5EFE6' }}>هل أنت مستعد <br/>للتميز المطلق؟</h2>
          <p className="text-xl mb-12 font-medium" style={{ color: 'rgba(245,239,230,0.65)' }}>ابدأ رحلتك الرقمية معنا واجعل مشروعك القادم تحفة فنية تلفت الأنظار.</p>
          <MagneticButton>
            <Link
              href="/packages"
              className="inline-block px-12 py-5 font-black text-xl rounded-full transition-all ease-out duration-500 hover:scale-105"
              style={{ background: '#D4AF37', color: '#1A0A05', boxShadow: '0 0 40px rgba(212,175,55,0.4)' }}
            >
              دعنا نصنع المستحيل معاً
            </Link>
          </MagneticButton>
        </motion.div>
      </section>
    </div>
  );
}

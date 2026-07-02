"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useBranch } from "@/lib/BranchContext";

const EXPERIENCES = [
  {
    id: 1,
    year: "2025",
    title: "تأسيس طويق",
    company: "الانطلاقة الأولى",
    description:
      "انطلاقة شغفنا بتحويل الأفكار إلى هويات بصرية تعكس روح العلامات التجارية وتترك بصمة خالدة تلهم الجميع.",
  },
  {
    id: 2,
    year: "2026",
    title: "مشاريع استراتيجية",
    company: "توسيع النطاق",
    description:
      "بناء ملف أعمال فاخر يضم أكثر من 80 هوية بصرية منجزة وتسليم مشاريع لمؤسسات رائدة في أرجاء المنطقة.",
  },
  {
    id: 3,
    year: "حاليا",
    title: "الابتكار السينمائي",
    company: "التحول الرقمي",
    description:
      "إدماج التقنيات التفاعلية المتقدمة وتطوير واجهات سينمائية وتجارب بصرية تُعايش كأنها قصص نابضة.",
  },
];

const THRESHOLDS = [0.18, 0.50, 0.82];
const WINDOW = 0.06;

interface NodeProps {
  exp: (typeof EXPERIENCES)[0];
  isEven: boolean;
  scrollYProgress: MotionValue<number>;
  threshold: number;
}

function TimelineNode({ exp, isEven, scrollYProgress, threshold }: NodeProps) {
  const { branch } = useBranch();

  const opacity = useTransform(
    scrollYProgress,
    [threshold - WINDOW, threshold, 1],
    [0, 1, 1]
  );

  const x = useTransform(
    scrollYProgress,
    [threshold - WINDOW, threshold],
    [isEven ? -60 : 60, 0]
  );

  const dateX = useTransform(
    scrollYProgress,
    [threshold - WINDOW, threshold],
    [0, 0]
  );

  const nodeScale = useTransform(
    scrollYProgress,
    [threshold - WINDOW, threshold],
    [0, 1]
  );

  const CardContent = (
    <motion.div style={{ opacity, x }} className="max-w-xs">
      <div className={`p-5 rounded-2xl border backdrop-blur-sm ${
        branch === 'studio'
          ? 'bg-[#a78b66]/5 border-[#a78b66]/20'
          : 'bg-[#5c1a16]/4 border-[#5c1a16]/15'
      }`}>
        <span className={`text-xs font-black tracking-widest uppercase ${
          branch === 'studio' ? 'text-[#a78b66]' : 'text-[#5c1a16]'
        }`}>
          {exp.company}
        </span>
        <h4 className={`text-xl font-black mt-1 ${
          branch === 'studio' ? 'text-white' : 'text-[#2d1a12]'
        }`}>
          {exp.title}
        </h4>
        <p className={`text-sm mt-2 leading-relaxed ${
          branch === 'studio' ? 'text-white/60' : 'text-[#4a3530]/70'
        }`}>
          {exp.description}
        </p>
      </div>
    </motion.div>
  );

  const DateContent = (
    <motion.div style={{ opacity, x: dateX }}>
      <span className={`text-4xl md:text-5xl font-black ${branch === 'studio' ? 'text-[#a78b66]/20' : 'text-[#5c1a16]/25'}`}>
        {exp.year}
      </span>
    </motion.div>
  );

  return (
    <div className="relative grid grid-cols-[1fr_auto_1fr] items-center w-full">
      <div className="flex justify-end pr-10 md:pr-20">
        {isEven ? CardContent : DateContent}
      </div>
      <div className="relative flex items-center justify-center w-8 z-30">
        <motion.div
          style={{ scale: nodeScale, opacity }}
          className={`w-7 h-7 rounded-full border-[3px] ${
            branch === 'studio'
              ? 'bg-[#111] border-[#a78b66] shadow-[0_0_18px_rgba(167, 139, 102,0.7)]'
              : 'bg-[#f5ecd8] border-[#5c1a16] shadow-[0_0_18px_rgba(92,26,22,0.85)]'
          }`}
        />
      </div>
      <div className="flex justify-start pl-10 md:pl-20">
        {isEven ? DateContent : CardContent}
      </div>
    </div>
  );
}

export default function TimelineSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { branch } = useBranch();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const tipY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={containerRef}
      id="experience"
      className="relative py-24 px-6 overflow-visible z-20"
    >
      <div className="max-w-5xl mx-auto relative">
        <div className="text-center mb-28">
          <h2 className={`text-xs font-black tracking-[0.3em] uppercase mb-4 ${branch === 'studio' ? 'text-[#a78b66]' : 'text-[#5c1a16]'}`}>
            مسيرتنا
          </h2>
          <h3 className={`text-4xl md:text-5xl font-black ${branch === 'studio' ? 'text-white' : 'text-[#2d1a12]'}`}>
            محطات صنع الإبداع
          </h3>
        </div>

        <div className="relative flex flex-col gap-28 md:gap-36">
          <div className={`absolute inset-y-0 left-[24px] md:left-1/2 w-px md:-translate-x-px ${branch === 'studio' ? 'bg-[#a78b66]/20' : 'bg-[#5c1a16]/15'}`} />

          <div className="absolute inset-y-0 left-[24px] md:left-1/2 w-px md:-translate-x-px overflow-visible z-10">
            <motion.div
              style={{ scaleY: scrollYProgress, transformOrigin: "top" }}
              className={`w-full h-full ${
                branch === 'studio'
                  ? 'bg-gradient-to-b from-[#8c7117] via-[#a78b66] to-[#ffeaa3] shadow-[0_0_10px_rgba(167, 139, 102,0.6)]'
                  : 'bg-gradient-to-b from-[#5c1a16] via-[#8a2020] to-[#ff2a1f] shadow-[0_0_10px_rgba(255,42,31,0.5)]'
              }`}
            />
            <motion.div
              style={{ top: tipY }}
              className={`absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 z-20 ${
                branch === 'studio'
                  ? 'bg-[#ffeaa3] border-[#111] shadow-[0_0_18px_6px_rgba(167, 139, 102,0.8)]'
                  : 'bg-[#ff2a1f] border-[#f5ecd8] shadow-[0_0_18px_6px_rgba(255,42,31,0.9)]'
              }`}
            />
          </div>

          {EXPERIENCES.map((exp, index) => (
            <TimelineNode
              key={exp.id}
              exp={exp}
              isEven={index % 2 === 0}
              scrollYProgress={scrollYProgress}
              threshold={THRESHOLDS[index]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  MotionValue,
} from "framer-motion";

const EXPERIENCES = [
  {
    id: 1,
    year: "2024",
    title: "تأسيس طويق ديزاين",
    company: "الانطلاقة الأولى",
    description:
      "انطلاقة شغفنا بتحويل الأفكار إلى هويات بصرية تعكس روح العلامات التجارية وتترك بصمة خالدة تلهم الجميع.",
  },
  {
    id: 2,
    year: "2025",
    title: "مشاريع استراتيجية",
    company: "توسيع النطاق",
    description:
      "بناء ملف أعمال فاخر يضم أكثر من 80 هوية بصرية منجزة وتسليم مشاريع لمؤسسات رائدة في أرجاء المنطقة.",
  },
  {
    id: 3,
    year: "2026",
    title: "الابتكار السينمائي",
    company: "التحول الرقمي",
    description:
      "إدماج التقنيات التفاعلية المتقدمة وتطوير واجهات سينمائية وتجارب بصرية تُعايش كأنها قصص نابضة.",
  },
];

// Thresholds where each node's red ball reaches it (0–1 of scrollYProgress)
// Item 0 → ball hits at ~20% scroll, Item 1 → ~50%, Item 2 → ~80%
const THRESHOLDS = [0.18, 0.50, 0.82];
// Window around the threshold for the appear/disappear transition (5% each side)
const WINDOW = 0.06;

interface NodeProps {
  exp: (typeof EXPERIENCES)[0];
  isEven: boolean;
  scrollYProgress: MotionValue<number>;
  threshold: number;
}

function TimelineNode({ exp, isEven, scrollYProgress, threshold }: NodeProps) {
  // Appear: from (threshold - WINDOW) to threshold → opacity 0→1, x offset→0
  // Disappear: we DON'T auto-reverse on downscroll — item stays visible once revealed.
  //            It disappears when scrolling back UP past (threshold - WINDOW).
  const opacity = useTransform(
    scrollYProgress,
    [threshold - WINDOW, threshold, 1],
    [0, 1, 1]
  );
  const cardX = useTransform(
    scrollYProgress,
    [threshold - WINDOW, threshold, 1],
    [isEven ? -50 : 50, 0, 0]
  );
  const dateX = useTransform(
    scrollYProgress,
    [threshold - WINDOW, threshold, 1],
    [isEven ? 50 : -50, 0, 0],
  );
  const nodeScale = useTransform(
    scrollYProgress,
    [threshold - WINDOW, threshold, 1],
    [0, 1, 1]
  );

  const CardContent = (
    <motion.div style={{ opacity, x: cardX }} className="max-w-xs">
      <h4
        className={`text-xl md:text-2xl font-black text-[#2d1a12] mb-1 ${
          isEven ? "text-right" : "text-left"
        }`}
      >
        {exp.title}
      </h4>
      <h5
        className={`text-xs font-bold text-[#5c1a16]/70 mb-3 ${
          isEven ? "text-right" : "text-left"
        }`}
      >
        {exp.company}
      </h5>
      <p
        className={`text-sm text-[#4a3530]/80 leading-relaxed ${
          isEven ? "text-right" : "text-left"
        }`}
      >
        {exp.description}
      </p>
    </motion.div>
  );

  const DateContent = (
    <motion.div style={{ opacity, x: dateX }}>
      <span className="text-4xl md:text-5xl font-black text-[#5c1a16]/25">
        {exp.year}
      </span>
    </motion.div>
  );

  return (
    <div className="relative grid grid-cols-[1fr_auto_1fr] items-center w-full">
      {/* Left */}
      <div className="flex justify-end pr-8 md:pr-14">
        {isEven ? CardContent : DateContent}
      </div>

      {/* Center node */}
      <div className="relative flex items-center justify-center w-8 z-30">
        <motion.div
          style={{ scale: nodeScale, opacity }}
          className="w-7 h-7 rounded-full bg-[#f5ecd8] border-[3px] border-[#5c1a16] shadow-[0_0_18px_rgba(92,26,22,0.85)]"
        />
      </div>

      {/* Right */}
      <div className="flex justify-start pl-8 md:pl-14">
        {isEven ? DateContent : CardContent}
      </div>
    </div>
  );
}

export default function TimelineSection() {
  const containerRef = useRef<HTMLDivElement>(null);

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
        {/* Title */}
        <div className="text-center mb-28">
          <h2 className="text-xs font-black text-[#5c1a16] tracking-[0.3em] uppercase mb-4">
            مسيرتنا
          </h2>
          <h3 className="text-4xl md:text-5xl font-black text-[#2d1a12]">
            محطات صنع الإبداع
          </h3>
        </div>

        {/* Timeline Items Container */}
        <div className="relative flex flex-col gap-28 md:gap-36">
          {/* Faint base line */}
          <div className="absolute inset-y-0 left-[24px] md:left-1/2 w-px bg-[#5c1a16]/15 md:-translate-x-px" />

          {/* Growing glowing line + red tip */}
          <div className="absolute inset-y-0 left-[24px] md:left-1/2 w-px md:-translate-x-px overflow-visible z-10">
            <motion.div
              style={{ scaleY: scrollYProgress, transformOrigin: "top" }}
              className="w-full h-full bg-gradient-to-b from-[#5c1a16] via-[#8a2020] to-[#ff2a1f] shadow-[0_0_10px_rgba(255,42,31,0.5)]"
            />
            {/* Glowing red tip ball */}
            <motion.div
              style={{ top: tipY }}
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#ff2a1f] border-2 border-[#f5ecd8] shadow-[0_0_18px_6px_rgba(255,42,31,0.9)] z-20"
            />
          </div>

          {/* Nodes */}
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

"use client";

import { useEffect, useRef, useCallback } from "react";
import { useBranch } from "@/lib/BranchContext";
import { motion } from "framer-motion";

const STUDIO_SKILLS = [
  { text: "تصوير", weight: 9 },
  { text: "مونتاج", weight: 9 },
  { text: "تصميم", weight: 8 },
  { text: "تعديل", weight: 8 },
  { text: "تحريك", weight: 7 },
  { text: "تصميم 3D", weight: 9 },
  { text: "كاميرا", weight: 7 },
  { text: "تصميم سوشيال ميديا", weight: 6 },
  { text: "تحسين اداء", weight: 7 },
  { text: "انيميشن", weight: 6 },
  { text: "افلام", weight: 7 },
  { text: "تريلرات", weight: 8 },
  { text: "اعلانات", weight: 7 },
  { text: "تصميم مواقع", weight: 7 },
  { text: "تصميم تطبيقات", weight: 8 },
  { text: "تصميم العاب", weight: 6 },
  { text: "تصميم واجهات", weight: 7 },
  { text: "تصميم تجربة المستخدم", weight: 6 },
];

const DESIGN_SKILLS = [
  { text: "هوية بصرية", weight: 9 },
  { text: "تصميم شعارات", weight: 9 },
  { text: "3D Modeling", weight: 8 },
  { text: "تصميم حركي", weight: 8 },
  { text: "Typography", weight: 7 },
  { text: "Branding", weight: 9 },
  { text: "تصميم مطبوعات", weight: 7 },
  { text: "Color Theory", weight: 6 },
  { text: "UI / UX", weight: 7 },
  { text: "رسم رقمي", weight: 6 },
  { text: "تصميم عبوات", weight: 7 },
  { text: "Motion Design", weight: 8 },
  { text: "Illustrator", weight: 7 },
  { text: "Photoshop", weight: 7 },
  { text: "Brand Strategy", weight: 8 },
  { text: "Figma", weight: 6 },
  { text: "After Effects", weight: 7 },
  { text: "تصميم إعلانات", weight: 6 },
];

interface Tag {
  text: string;
  weight: number;
  x: number;
  y: number;
  z: number;
}

function initTags(skills: {text: string, weight: number}[], radius: number): Tag[] {
  return skills.map((skill, i) => {
    const phi = Math.acos(-1 + (2 * i) / skills.length);
    const theta = Math.sqrt(skills.length * Math.PI) * phi;
    return {
      text: skill.text,
      weight: skill.weight,
      x: radius * Math.sin(phi) * Math.cos(theta),
      y: radius * Math.sin(phi) * Math.sin(theta),
      z: radius * Math.cos(phi),
    };
  });
}

function rotateX(tags: Tag[], a: number): Tag[] {
  const cos = Math.cos(a), sin = Math.sin(a);
  return tags.map(t => ({ ...t, y: t.y * cos - t.z * sin, z: t.y * sin + t.z * cos }));
}
function rotateY(tags: Tag[], a: number): Tag[] {
  const cos = Math.cos(a), sin = Math.sin(a);
  return tags.map(t => ({ ...t, x: t.x * cos + t.z * sin, z: -t.x * sin + t.z * cos }));
}

function dist3d(a: Tag, b: Tag) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
}

export default function DesignGlobe() {
  const { branch } = useBranch();
  const currentSkills = branch === 'studio' ? STUDIO_SKILLS : DESIGN_SKILLS;
  
  const radius = 170;
  const size = 480;
  const maxLineDist = radius * 1.1;

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<Tag[]>(initTags(currentSkills, radius));
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    tagsRef.current = initTags(currentSkills, radius);
  }, [branch, radius, currentSkills]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = {
      x: (e.clientX - rect.left - rect.width / 2) / rect.width,
      y: (e.clientY - rect.top - rect.height / 2) / rect.height,
    };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove as any);
    return () => el.removeEventListener("mousemove", handleMouseMove as any);
  }, [handleMouseMove]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const labels = labelsRef.current;
    if (!canvas || !labels) return;

    const SIZE = size;
    const CX = SIZE / 2;
    const CY = SIZE / 2;
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext("2d")!;

    const spans: HTMLSpanElement[] = currentSkills.map((skill) => {
      const span = document.createElement("span");
      span.textContent = skill.text;
      span.style.cssText = `
        position: absolute;
        left: 50%;
        top: 50%;
        pointer-events: none;
        font-weight: 900;
        font-family: inherit;
        white-space: nowrap;
        color: ${branch === 'studio' ? '#a78b66' : '#2d1a12'};
        transition: color 0.2s;
        transform-origin: center;
        cursor: default;
      `;
      labels.appendChild(span);
      return span;
    });

    let prev = performance.now();

    const animate = (now: number) => {
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      let t = rotateY(tagsRef.current, (mx * 2.2 + 0.25) * dt);
      t = rotateX(t, (-my * 2.2) * dt);
      tagsRef.current = t;

      const projected = t.map(tag => {
        const scale = (radius + tag.z) / (2 * radius);
        const alpha = 0.18 + scale * 0.82;
        const baseFontSize = 9;
        const fontScale = 4;
        const weightScale = 6;
        const fontSize = baseFontSize + (tag.weight / 9) * weightScale + scale * fontScale;
        return { tag, px: tag.x, py: tag.y, pz: tag.z, alpha, fontSize, scale };
      });

      const sorted = [...projected].sort((a, b) => a.pz - b.pz);

      ctx.clearRect(0, 0, SIZE, SIZE);

      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const a = projected[i];
          const b = projected[j];
          const d = dist3d(a.tag, b.tag);
          if (d < maxLineDist) {
            const proximity = (maxLineDist - d) / maxLineDist;
            const depthAlpha = (Math.min(a.alpha, b.alpha) - 0.18) / 0.82;
            const lineAlpha = proximity * 0.5 + depthAlpha * 0.2;

            const ax = CX + a.px, ay = CY + a.py;
            const bx = CX + b.px, by = CY + b.py;

            const midX = (ax + bx) / 2;
            const midY = (ay + by) / 2;
            const dx = midX - CX;
            const dy = midY - CY;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            const bow = 1.35;
            const targetDist = len * bow;
            const maxDist = radius * 0.96;
            const finalDist = Math.min(targetDist, maxDist);
            const cpx = CX + (dx / len) * finalDist;
            const cpy = CY + (dy / len) * finalDist;

            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.quadraticCurveTo(cpx, cpy, bx, by);
            ctx.strokeStyle = branch === "studio" ? `rgba(167, 139, 102, ${Math.min(lineAlpha, 0.35)})` : `rgba(92, 26, 22, ${Math.min(lineAlpha, 0.45)})`;
            ctx.lineWidth = 1.0;
            ctx.stroke();
          }
        }
      }

      sorted.forEach(({ tag, px, py, alpha, fontSize }) => {
        const origIdx = projected.findIndex(p => p.tag === tag);
        const span = spans[origIdx];
        span.style.transform = `translate(calc(-50% + ${px}px), calc(-50% + ${py}px))`;
        span.style.fontSize = `${fontSize}px`;
        span.style.opacity = String(alpha);
        span.style.color = branch === "studio" ? (tag.z > 0 ? "#a78b66" : "rgba(167, 139, 102, 0.4)") : (tag.z > 0 ? "#2d1a12" : "#6b3a32");
        span.style.zIndex = String(Math.round(tag.z + radius));
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      spans.forEach(s => s.remove());
    };
  }, [branch, radius, size, maxLineDist, currentSkills]);

  return (
    <section className="relative py-24 px-6 z-20 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-20% 0px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className={`text-xs font-black ${branch === 'studio' ? 'text-[#a78b66]' : 'text-[#5c1a16]'} tracking-[0.3em] uppercase mb-4`}>
            {branch === 'studio' ? 'تخصصاتنا التقنية' : 'تخصصاتنا'}
          </h2>
          <h3 className={`text-4xl md:text-5xl font-black ${branch === 'studio' ? 'text-white' : 'text-[#2d1a12]'}`}>
            {branch === 'studio' ? 'كوكب الإبداع الرقمي' : 'كوكب الإبداع البصري'}
          </h3>
          <p className={`mt-4 text-base max-w-md mx-auto ${branch === 'studio' ? 'text-white/50' : 'text-[#4a3530]/60'}`}>
            حرّك الماوس فوق الكوكب وتفاعل مع عالمنا
          </p>
        </motion.div>

        <div
          ref={containerRef}
          className="relative mx-auto"
          style={{ width: size, height: size, maxWidth: "100%" }}
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={`w-72 h-72 rounded-full ${branch === 'studio' ? 'bg-[#a78b66]/10' : 'bg-[#5c1a16]/6'} blur-3xl`} />
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className={`rounded-full border ${branch === 'studio' ? 'border-[#a78b66]/20' : 'border-[#5c1a16]/12'}`}
              style={{ width: radius * 2, height: radius * 2 }}
            />
          </div>

          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            style={{ width: "100%", height: "100%" }}
          />

          <div
            ref={labelsRef}
            className="absolute inset-0"
            style={{ fontFamily: "inherit" }}
          />

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
            <div className={`w-3 h-3 rounded-full ${branch === 'studio' ? 'bg-[#a78b66] shadow-[0_0_14px_6px_rgba(167, 139, 102,0.4)]' : 'bg-[#5c1a16] shadow-[0_0_14px_6px_rgba(92,26,22,0.55)]'}`} />
          </div>
        </div>
      </div>
    </section>
  );
}

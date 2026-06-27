"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

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

const RADIUS = 200;
const MAX_LINE_DIST = RADIUS * 1.1; // connect most pairs

interface Tag {
  text: string;
  weight: number;
  x: number;
  y: number;
  z: number;
}

function initTags(): Tag[] {
  return DESIGN_SKILLS.map((skill, i) => {
    const phi = Math.acos(-1 + (2 * i) / DESIGN_SKILLS.length);
    const theta = Math.sqrt(DESIGN_SKILLS.length * Math.PI) * phi;
    return {
      text: skill.text,
      weight: skill.weight,
      x: RADIUS * Math.sin(phi) * Math.cos(theta),
      y: RADIUS * Math.sin(phi) * Math.sin(theta),
      z: RADIUS * Math.cos(phi),
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
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<Tag[]>(initTags());
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

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

    const SIZE = 520;
    const CX = SIZE / 2;
    const CY = SIZE / 2;
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext("2d")!;

    // Pre-create label spans
    const spans: HTMLSpanElement[] = DESIGN_SKILLS.map((skill, i) => {
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
        color: #2d1a12;
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

      // Compute projection info for each tag
      const projected = t.map(tag => {
        const scale = (RADIUS + tag.z) / (2 * RADIUS); // 0..1 (front to back flipped: 0=back, 1=front)
        const alpha = 0.18 + scale * 0.82;
        const fontSize = 12 + (tag.weight / 9) * 8 + scale * 6;
        return { tag, px: tag.x, py: tag.y, pz: tag.z, alpha, fontSize, scale };
      });

      // Sort by Z (paint far tags first = behind)
      const sorted = [...projected].sort((a, b) => a.pz - b.pz);

      // ── 1. Canvas: draw connection lines ──
      ctx.clearRect(0, 0, SIZE, SIZE);

      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const a = projected[i];
          const b = projected[j];
          const d = dist3d(a.tag, b.tag);
          if (d < MAX_LINE_DIST) {
            const proximity = (MAX_LINE_DIST - d) / MAX_LINE_DIST;
            const depthAlpha = (Math.min(a.alpha, b.alpha) - 0.18) / 0.82;
            const lineAlpha = proximity * 0.5 + depthAlpha * 0.2;

            // Start and end on canvas
            const ax = CX + a.px, ay = CY + a.py;
            const bx = CX + b.px, by = CY + b.py;

            // Control point: midpoint pushed outward from globe center
            const midX = (ax + bx) / 2;
            const midY = (ay + by) / 2;
            const dx = midX - CX;
            const dy = midY - CY;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            // Bow factor: push outward proportional to arc length, but never outside the globe
            const bow = 1.35;
            const targetDist = len * bow;
            const maxDist = RADIUS * 0.96;
            const finalDist = Math.min(targetDist, maxDist);
            const cpx = CX + (dx / len) * finalDist;
            const cpy = CY + (dy / len) * finalDist;

            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.quadraticCurveTo(cpx, cpy, bx, by);
            ctx.strokeStyle = `rgba(92, 26, 22, ${Math.min(lineAlpha, 0.45)})`;
            ctx.lineWidth = 1.0;
            ctx.stroke();
          }
        }
      }

      // ── 2. DOM: update label positions ──
      sorted.forEach(({ tag, px, py, alpha, fontSize }, sortedIdx) => {
        const origIdx = projected.findIndex(p => p.tag === tag);
        const span = spans[origIdx];
        span.style.transform = `translate(calc(-50% + ${px}px), calc(-50% + ${py}px))`;
        span.style.fontSize = `${fontSize}px`;
        span.style.opacity = String(alpha);
        span.style.color = tag.z > 0 ? "#2d1a12" : "#6b3a32";
        span.style.zIndex = String(Math.round(tag.z + RADIUS));
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      spans.forEach(s => s.remove());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="relative py-24 px-6 z-20 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-20% 0px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-xs font-black text-[#5c1a16] tracking-[0.3em] uppercase mb-4">
            تخصصاتنا
          </h2>
          <h3 className="text-4xl md:text-5xl font-black text-[#2d1a12]">
            كوكب الإبداع البصري
          </h3>
          <p className="mt-4 text-[#4a3530]/60 text-base max-w-md mx-auto">
            حرّك الماوس فوق الكوكب وتفاعل مع عالمنا التصميمي
          </p>
        </motion.div>

        {/* Globe Container */}
        <div
          ref={containerRef}
          className="relative mx-auto"
          style={{ width: 520, height: 520, maxWidth: "100%" }}
        >
          {/* Ambient glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-72 h-72 rounded-full bg-[#5c1a16]/6 blur-3xl" />
          </div>

          {/* Faint outer ring */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="rounded-full border border-[#5c1a16]/12"
              style={{ width: RADIUS * 2, height: RADIUS * 2 }}
            />
          </div>

          {/* Canvas for lines (behind labels) */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none"
            style={{ width: "100%", height: "100%" }}
          />

          {/* Labels container */}
          <div
            ref={labelsRef}
            className="absolute inset-0"
            style={{ fontFamily: "inherit" }}
          />

          {/* Center glowing dot */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
            <div className="w-3 h-3 rounded-full bg-[#5c1a16] shadow-[0_0_14px_6px_rgba(92,26,22,0.55)]" />
          </div>
        </div>
      </div>
    </section>
  );
}

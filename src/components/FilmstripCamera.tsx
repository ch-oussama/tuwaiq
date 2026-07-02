"use client";

import { useScroll, useMotionValueEvent, motion } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

// Winding path in percentage coordinates (0-100 = 0%-100% of viewport)
// Starts precisely where the Navbar logo typically sits in RTL (Top-Right)
const PATH_D = "M 89,4 C 98,4 99,16 88,22 C 72,30 28,24 14,36 C 0,48 8,64 24,68 C 40,72 76,62 86,74 C 96,86 86,97 70,98";

export default function FilmstripCamera() {
  const pathRef = useRef<SVGPathElement>(null);
  const [camPos, setCamPos] = useState({ x: 88, y: 5, rotate: 0 });
  const [pathReady, setPathReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    if (pathRef.current) {
      setPathReady(true);
      const pt = pathRef.current.getPointAtLength(0);
      setCamPos({ x: pt.x, y: pt.y, rotate: 0 });
    }
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setProgress(v);
    if (!pathRef.current) return;
    const total = pathRef.current.getTotalLength();
    const dist = v * total;
    const pt = pathRef.current.getPointAtLength(dist);
    const ptAhead = pathRef.current.getPointAtLength(Math.min(dist + 2, total));
    const angle = Math.atan2(ptAhead.y - pt.y, ptAhead.x - pt.x) * (180 / Math.PI);
    setCamPos({ x: pt.x, y: pt.y, rotate: angle });
  });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0, opacity: 0.5 }}>
      {/* SVG: viewBox is 0 0 100 100, matching percentage coords */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        {/* === FILMSTRIP LAYERS === */}

        {/* Layer 1: Strip body - thick golden band */}
        <motion.path
          d={PATH_D}
          fill="none"
          stroke="rgba(167, 139, 102,0.08)"
          strokeWidth="3.5"
          strokeLinecap="round"
          style={{ pathLength: scrollYProgress }}
          strokeDasharray="1"
        />

        {/* Layer 2: Strip edges / outline */}
        <motion.path
          d={PATH_D}
          fill="none"
          stroke="rgba(167, 139, 102,0.15)"
          strokeWidth="1.2"
          strokeLinecap="round"
          style={{ pathLength: scrollYProgress }}
          strokeDasharray="1"
        />

        {/* Layer 3: Perforation holes top-row simulation — short dashes */}
        <motion.path
          d={PATH_D}
          fill="none"
          stroke="rgba(255,250,235,0.6)"
          strokeWidth="0.7"
          strokeLinecap="square"
          strokeDasharray="1 2.5"
          style={{ pathLength: scrollYProgress }}
        />

        {/* Layer 4: Frame dividers — less frequent dashes */}
        <motion.path
          d={PATH_D}
          fill="none"
          stroke="rgba(167, 139, 102,0.35)"
          strokeWidth="0.4"
          strokeLinecap="butt"
          strokeDasharray="0.2 4"
          style={{ pathLength: scrollYProgress }}
        />

        {/* Hidden path reference used for getPointAtLength */}
        <path
          ref={pathRef}
          d={PATH_D}
          fill="none"
          stroke="transparent"
          strokeWidth="0"
        />
      </svg>

      {/* Camera image following the path */}
      {pathReady && (
        <div
          className="absolute transition-none"
          style={{
            left: `${camPos.x}%`,
            top: `${camPos.y}%`,
            transform: `translate(-50%, -50%) rotate(${camPos.rotate}deg)`,
            width: 90,
            height: 90,
            opacity: progress === 0 ? 0 : progress < 0.98 ? 1 : 0,
            transition: 'opacity 0.3s',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt=""
            className="w-full h-full object-contain"
            style={{
              filter: 'drop-shadow(0 4px 12px rgba(167, 139, 102,0.5))',
            }}
          />
          {/* Tiny glow ring around camera */}
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              background: 'radial-gradient(circle, rgba(167, 139, 102,0.3) 0%, transparent 70%)',
              animationDuration: '2s',
            }}
          />
        </div>
      )}
    </div>
  );
}

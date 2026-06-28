"use client";

import { motion, useScroll } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[999] origin-left"
      style={{
        scaleX: scrollYProgress,
        background: 'linear-gradient(to left, var(--brand-gold), #D4AF37)',
      }}
    />
  );
}

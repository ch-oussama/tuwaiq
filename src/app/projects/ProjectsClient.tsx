"use client";

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ExternalLink, Sparkles } from 'lucide-react';
import { useState, useMemo } from 'react';
import type { Project } from '@/lib/db';
import { useBranch } from '@/lib/BranchContext';
import { useLang } from '@/lib/LanguageContext';
import { t } from '@/lib/translations';
import { ThreeDPhotoCarousel } from "@/components/ui/3d-carousel";

const branchConfig = {
  studio: {
    accent: '#a78b66',
    textMuted: 'rgba(255,255,255,0.5)',
    cardBg: '#1a1a1a',
    border: 'rgba(167, 139, 102,0.25)',
    borderHover: '#a78b66',
    overlay: 'rgba(0,0,0,0.85)',
    bg: 'from-[#0a0a0a] via-[#111] to-[#0a0a0a]',
    headerText: '#fff',
    cardText: '#f0f0f0',
    cardMuted: 'rgba(255,255,255,0.45)',
    overlayText: '#fff',
    overlayMuted: 'rgba(255,255,255,0.7)',
    tagBg: 'rgba(255,255,255,0.12)',
    tagText: '#fff',
    tagBorder: 'rgba(255,255,255,0.2)',
    badgeText: '#111',
    badgeBg: '#a78b66',
    ctaText: '#111',
    glow: 'rgba(167, 139, 102,0.06)',
    shadow: '0 8px 30px rgba(0,0,0,0.4)',
    shadowHover: '0 20px 60px rgba(167, 139, 102,0.2)',
  },
  design: {
    accent: '#8B2020',
    textMuted: 'rgba(74,53,48,0.5)',
    cardBg: '#ffffff',
    border: 'rgba(139,32,32,0.15)',
    borderHover: '#8B2020',
    overlay: 'rgba(139,32,32,0.93)',
    bg: 'from-[#f5ecd8] via-[#f0e6d2] to-[#f5ecd8]',
    headerText: '#2d1a12',
    cardText: '#2d1a12',
    cardMuted: 'rgba(45,26,18,0.45)',
    overlayText: '#f5ecd8',
    overlayMuted: 'rgba(245,236,216,0.75)',
    tagBg: 'rgba(245,236,216,0.15)',
    tagText: '#f5ecd8',
    tagBorder: 'rgba(245,236,216,0.25)',
    badgeText: '#f5ecd8',
    badgeBg: '#8B2020',
    ctaText: '#f5ecd8',
    glow: 'rgba(139,32,32,0.05)',
    shadow: '0 8px 30px rgba(74,53,48,0.1)',
    shadowHover: '0 20px 60px rgba(139,32,32,0.15)',
  },
};

export default function ProjectsClient({ projects }: { projects: Project[] }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const { branch } = useBranch();
  const { lang } = useLang();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const isDesign = branch === 'design';
  const cfg = isDesign ? branchConfig.design : branchConfig.studio;

  const branchProjects = useMemo(() =>
    projects.filter(p => p.branch === branch),
    [projects, branch],
  );

  const allCategories = useMemo(() =>
    Array.from(new Set(branchProjects.map(p => p.category).filter(Boolean))),
    [branchProjects],
  );

  const filteredProjects = useMemo(() =>
    activeCategory === 'all'
      ? branchProjects
      : branchProjects.filter(p => p.category === activeCategory),
    [activeCategory, branchProjects],
  );

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none" style={{ background: cfg.glow }} />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none" style={{ background: cfg.glow }} />

      <div className="relative z-10 py-28 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest mb-6"
              style={{ background: `${cfg.accent}15`, color: cfg.accent, border: `1px solid ${cfg.accent}30` }}
            >
              <Sparkles size={12} />
              {isDesign ? 'أعمالنا المميزة' : 'إبداعاتنا'}
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r" style={{
                backgroundImage: isDesign
                  ? 'linear-gradient(to right, #8B2020, #b22d2d)'
                  : 'linear-gradient(to right, #a78b66, #f0d080)',
              }}>
                {t(lang, 'projects.title')}
              </span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: cfg.textMuted }}>
              {t(lang, 'projects.subtitle')}
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-2 mb-14">
            <motion.button
              key="all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setActiveCategory('all')}
              className="relative px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 overflow-hidden"
              style={{
                background: activeCategory === 'all' ? cfg.accent : `${cfg.accent}08`,
                color: activeCategory === 'all' ? (isDesign ? '#f5ecd8' : '#111') : cfg.textMuted,
                border: `1px solid ${activeCategory === 'all' ? cfg.accent : `${cfg.accent}20`}`,
                boxShadow: activeCategory === 'all' ? `0 4px 20px ${cfg.accent}30` : 'none',
              }}
            >
              {activeCategory === 'all' && (
                <motion.div layoutId="activeTab" className="absolute inset-0" style={{ background: cfg.accent }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
              )}
              <span className="relative z-10">{t(lang, 'projects.all')}</span>
            </motion.button>

            {allCategories.map((cat, i) => {
              const isActive = activeCategory === cat;
              return (
                <motion.button
                  key={cat}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.5 }}
                  onClick={() => setActiveCategory(cat)}
                  className="relative px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 overflow-hidden"
                  style={{
                    background: isActive ? cfg.accent : `${cfg.accent}08`,
                    color: isActive ? (isDesign ? '#f5ecd8' : '#111') : cfg.textMuted,
                    border: `1px solid ${isActive ? cfg.accent : `${cfg.accent}20`}`,
                    boxShadow: isActive ? `0 4px 20px ${cfg.accent}30` : 'none',
                  }}
                >
                  {isActive && (
                    <motion.div layoutId="activeTab" className="absolute inset-0" style={{ background: cfg.accent }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                  )}
                  <span className="relative z-10">{cat}</span>
                </motion.button>
              );
            })}
          </div>

          <ThreeDPhotoCarousel projects={filteredProjects} />

          {filteredProjects.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32">
              <div className="text-8xl mb-6 opacity-20">...</div>
              <p className="text-2xl font-bold" style={{ color: cfg.textMuted }}>{t(lang, 'projects.no_projects')}</p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-20"
          >
            <p className="text-lg mb-6" style={{ color: cfg.textMuted }}>{t(lang, 'projects.have_project')}</p>
            <Link
              href="/packages"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-black text-lg transition-all duration-300 hover:scale-105 group"
              style={{
                background: `linear-gradient(135deg, ${cfg.accent}, ${isDesign ? '#b22d2d' : '#f0d080'})`,
                color: cfg.ctaText,
                boxShadow: `0 10px 40px ${cfg.accent}30`,
              }}
            >
              {t(lang, 'projects.start_project')}
              <ExternalLink size={18} className="transition-transform group-hover:-translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

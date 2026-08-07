"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Package } from '@/lib/db';
import { useBranch } from '@/lib/BranchContext';
import { useLang } from '@/lib/LanguageContext';
import { t } from '@/lib/translations';
import { Sparkles, Check, ArrowLeft, Crown, Star, Zap } from 'lucide-react';
import { useState } from 'react';

const branchConfig = {
  studio: {
    accent: '#a78b66',
    bg: 'from-[#0a0a0a] via-[#111] to-[#0a0a0a]',
    cardBorder: 'rgba(167, 139, 102,0.25)',
    cardBg: '#1a1a1a',
    cardBorderHover: '#a78b66',
    glow: 'rgba(167, 139, 102,0.08)',
    text: '#f0f0f0',
    muted: 'rgba(255,255,255,0.45)',
    lightText: '#111',
  },
  design: {
    accent: '#8B2020',
    bg: 'from-[#f5ecd8] via-[#f0e6d2] to-[#f5ecd8]',
    cardBorder: 'rgba(139,32,32,0.15)',
    cardBg: '#ffffff',
    cardBorderHover: '#8B2020',
    glow: 'rgba(139,32,32,0.06)',
    text: '#2d1a12',
    muted: 'rgba(45,26,18,0.45)',
    lightText: '#f5ecd8',
  },
};

export default function PackagesClient({ packages }: { packages: Package[] }) {
  const { branch } = useBranch();
  const { lang } = useLang();
  const cfg = branchConfig[branch === 'design' ? 'design' : 'studio'];
  const displayPackages = packages.filter(p => p.branch === branch);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Ambient Glow */}
      <div
        className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none"
        style={{ background: cfg.glow }}
      />

      <div className="relative z-10 py-28 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* ─── Header ─── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center mb-20"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest mb-6"
              style={{ background: `${cfg.accent}15`, color: cfg.accent, border: `1px solid ${cfg.accent}30` }}
            >
              <Sparkles size={12} />
              {branch === 'design' ? 'خطط مصممة للتميز' : 'خطط إبداع مصمم خصيصاً لك'}
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r" style={{ backgroundImage: branch === 'design' ? 'linear-gradient(to right, #8B2020, #b22d2d)' : 'linear-gradient(to right, #a78b66, #f0d080)' }}>
                {t(lang, 'packages.title')}
              </span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: cfg.muted }}>
              {t(lang, 'packages.subtitle')}
            </p>
          </motion.div>

          {/* ─── Packages Grid ─── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayPackages.map((pkg, i) => {
              const isHovered = hoveredId === pkg.id;
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12, duration: 0.7, ease: 'easeOut' }}
                  onMouseEnter={() => setHoveredId(pkg.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group relative"
                >
                  {/* Glow on hover */}
                  <motion.div
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    className="absolute -inset-4 rounded-3xl blur-2xl pointer-events-none transition-opacity duration-500"
                    style={{ background: cfg.accent + '15' }}
                  />

                  <div
                    className="relative rounded-3xl overflow-hidden transition-all duration-500 h-full flex flex-col"
                    style={{
                      background: cfg.cardBg,
                      border: `1px solid ${isHovered ? cfg.cardBorderHover : cfg.cardBorder}`,
                      transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                      boxShadow: isHovered ? `0 30px 60px ${cfg.accent}25` : `0 10px 30px ${cfg.accent}08`,
                    }}
                  >
                    {/* ─── Image ─── */}
                    <div className="relative h-52 overflow-hidden">
                      <motion.img
                        src={pkg.thumbnailUrl}
                        alt={pkg.title}
                        className="w-full h-full object-cover"
                        style={{ scale: isHovered ? 1.1 : 1 }}
                        transition={{ duration: 0.8 }}
                      />
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(to top, ${branch === 'design' ? '#f5ecd8' : '#000'} 0%, transparent 60%)`,
                        }}
                      />

                      {/* Price Badge */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.12 + 0.3 }}
                        className="absolute top-4 left-4 flex items-center gap-1.5 px-4 py-2 rounded-full font-black shadow-lg backdrop-blur-md"
                        style={{
                          background: cfg.accent,
                          color: cfg.lightText,
                        }}
                      >
                        <span className="text-base sm:text-lg px-1">{pkg.price}</span>
                      </motion.div>

                      {/* Icon Top Right */}
                      <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center">
                        {i === 0 ? <Crown size={18} className="text-[#a78b66]" /> : <Star size={16} className="text-white/70" />}
                      </div>
                    </div>

                    {/* ─── Content ─── */}
                    <div className="p-7 flex flex-col flex-grow">
                      <h3
                        className="text-2xl font-black mb-2"
                        style={{ color: cfg.text }}
                      >
                        {pkg.title}
                      </h3>
                      <p
                        className="text-sm leading-relaxed mb-6 flex-grow"
                        style={{ color: cfg.muted }}
                      >
                        {pkg.shortDescription || pkg.description}
                      </p>

                      {/* ─── Features Preview ─── */}
                      <div className="space-y-2 mb-6">
                        {pkg.features.slice(0, 3).map((f, fi) => (
                          <div key={fi} className="flex items-center gap-2.5 text-xs font-bold">
                            <Check size={14} style={{ color: cfg.accent }} />
                            <span style={{ color: cfg.muted }}>
                              {f}
                            </span>
                          </div>
                        ))}
                        {pkg.features.length > 3 && (
                          <p className="text-xs font-bold" style={{ color: cfg.accent }}>
                            +{pkg.features.length - 3} {branch === 'design' ? 'مميزات أخرى' : 'مميزات إضافية'}
                          </p>
                        )}
                      </div>

                      {/* ─── CTA ─── */}
                      <Link
                        href={`/packages/${pkg.id}`}
                        className="group/btn relative overflow-hidden rounded-xl py-3.5 font-black text-sm text-center transition-all duration-300"
                        style={{
                          background: cfg.accent,
                          color: cfg.lightText,
                        }}
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {t(lang, 'packages.view_details')}
                          <ArrowLeft size={16} className="transition-transform duration-300 group-hover/btn:-translate-x-1" />
                        </span>
                        <div
                          className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
                          style={{
                            background: `linear-gradient(135deg, ${cfg.accent}, transparent)`,
                          }}
                        />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* ─── Empty State ─── */}
          {displayPackages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-32"
            >
              <p className="text-7xl mb-6 opacity-30">✨</p>
              <p className="text-2xl font-bold" style={{ color: cfg.muted }}>
                {t(lang, 'packages.no_packages')}
              </p>
            </motion.div>
          )}

          {/* ─── Custom CTA ─── */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-24"
          >
            <p className="text-base mb-6" style={{ color: cfg.muted }}>
              {branch === 'design' ? 'ما لقيت الباقة المناسبة؟' : 'ما لقيت الباقة المناسبة؟'}
            </p>
            <Link
              href="/custom"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-black text-lg transition-all duration-300 hover:scale-105 group"
              style={{
                background: `linear-gradient(135deg, ${cfg.accent}, ${branch === 'design' ? '#8a2020' : '#f0d080'})`,
                color: cfg.lightText,
                boxShadow: `0 10px 40px ${cfg.accent}30`,
              }}
            >
              <Zap size={20} />
              باقة مخصصة
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

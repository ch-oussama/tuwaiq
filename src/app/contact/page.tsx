"use client";

import { useState, useEffect, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useBranch } from '@/lib/BranchContext';
import { useLang } from '@/lib/LanguageContext';
import { t } from '@/lib/translations';

interface BranchSocials {
  discord: string;
  twitter: string;
  tiktok: string;
  email: string;
}

const branchMeta = {
  studio: {
    accent: '#D4AF37',
    accentBg: 'rgba(212,175,55,0.1)',
    glow: 'rgba(212,175,55,0.08)',
    cardBg: '#111',
    cardBorder: 'rgba(212,175,55,0.2)',
    text: '#f5f5f5',
    muted: 'rgba(255,255,255,0.5)',
    response: 'نرد خلال 24 ساعة',
    tag: 'تواصل مع فريقنا',
    bottom: 'نحوّال أفكارك إلى واقع',
  },
  design: {
    accent: '#8B2020',
    accentBg: 'rgba(139,32,32,0.1)',
    glow: 'rgba(139,32,32,0.08)',
    cardBg: '#f5ecd8',
    cardBorder: 'rgba(139,32,32,0.15)',
    text: '#2d1a12',
    muted: 'rgba(45,26,18,0.5)',
    response: 'نرد خلال 24 ساعة',
    tag: 'تواصل مع مصممينا',
    bottom: 'دعنا نصنع الجمال معًا',
  },
};

const socialIcons: Record<string, { label: string; icon: ReactNode }> = {
  discord: {
    label: 'ديسكورد',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-2.2248-.3306-4.4663-.3306-6.656 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.057a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.993a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
      </svg>
    ),
  },
  twitter: {
    label: 'تويتر (X)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  tiktok: {
    label: 'تيك توك',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.24 8.24 0 0 0 4.82 1.55V6.8a4.84 4.84 0 0 1-1.05-.11z"/>
      </svg>
    ),
  },
  email: {
    label: 'البريد الإلكتروني',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 4l-10 8L2 4" />
      </svg>
    ),
  },
};

export default function ContactPage() {
  const { branch } = useBranch();
  const { lang } = useLang();
  const isDesign = branch === 'design';
  const cfg = branchMeta[isDesign ? 'design' : 'studio'];
  const [socials, setSocials] = useState<BranchSocials>({
    discord: 'https://discord.gg/twq3',
    twitter: 'https://x.com/tuwaiq_design',
    tiktok: 'https://tiktok.com/@tuwaiq_design',
    email: 'design@tuwaiqstudio.com',
  });

  useEffect(() => {
    fetch('/api/socials')
      .then(r => r.json())
      .then(data => {
        const s = data[isDesign ? 'design' : 'studio'];
        if (s) setSocials(s);
      })
      .catch(() => {});
  }, [isDesign]);

  const items = [
    { key: 'discord', href: socials.discord, colors: { bg: 'linear-gradient(135deg, #5865F2, #7289DA)', border: '#5865F2' } },
    { key: 'twitter', href: socials.twitter, colors: { bg: 'linear-gradient(135deg, #14171A, #2b2d30)', border: '#333' } },
    { key: 'tiktok', href: socials.tiktok, colors: { bg: 'linear-gradient(135deg, #010101, #2b2b2b)', border: '#69C9D0' } },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen relative overflow-hidden pb-32 pt-12 md:pt-24">
      <div
        className="fixed inset-0 -z-10 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${cfg.glow}, transparent 70%)` }}
      />

      <div className="max-w-6xl mx-auto px-6 sm:px-8">
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
            style={{ background: cfg.accentBg, color: cfg.accent, border: `1px solid ${cfg.accent}30` }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
            </svg>
            {cfg.tag}
          </motion.div>

          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-4 leading-tight"
            style={{
              background: `linear-gradient(135deg, ${cfg.accent}, ${isDesign ? '#b22d2d' : '#f0d080'})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {t(lang, 'contact.title')}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto" style={{ color: cfg.muted }}>
            {t(lang, 'contact.subtitle')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Email Card */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <a
              href={`mailto:${socials.email}`}
              className="block rounded-3xl p-8 md:p-10 transition-all duration-300 hover:-translate-y-1 group"
              style={{
                background: cfg.cardBg,
                border: `1px solid ${cfg.cardBorder}`,
                boxShadow: `0 20px 60px rgba(0,0,0,${isDesign ? '0.08' : '0.3'})`,
              }}
            >
              <div className="flex items-center gap-5">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ background: cfg.accentBg, color: cfg.accent }}
                >
                  {socialIcons.email.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-black" style={{ color: isDesign ? cfg.text : '#fff' }}>{socialIcons.email.label}</h3>
                  <p className="text-lg font-bold transition-opacity group-hover:opacity-70" style={{ color: cfg.accent }}>
                    {socials.email}
                  </p>
                  <p className="text-sm font-medium mt-1" style={{ color: cfg.muted }}>
                    {cfg.response}
                  </p>
                </div>
              </div>
            </a>
          </motion.div>

          {/* Social Cards */}
          {items.map((item) => {
            const info = socialIcons[item.key];
            return (
              <motion.div key={item.key} variants={itemVariants}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-3xl p-8 md:p-10 transition-all duration-300 hover:-translate-y-2 group h-full"
                  style={{
                    background: cfg.cardBg,
                    border: `1px solid ${cfg.cardBorder}`,
                    boxShadow: `0 20px 60px rgba(0,0,0,${isDesign ? '0.08' : '0.3'})`,
                  }}
                >
                  <div className="flex items-center gap-5">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-white transition-transform group-hover:scale-110"
                      style={{ background: item.colors.bg, border: `1px solid ${item.colors.border}` }}
                    >
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-black" style={{ color: isDesign ? cfg.text : '#fff' }}>{info.label}</h3>
                      <p className="text-sm font-medium" style={{ color: cfg.muted }}>
                        {isDesign ? `تابعنا على ${info.label}` : `تابعنا على ${info.label}`}
                      </p>
                    </div>
                  </div>
                  <div
                    className="mt-6 w-full h-px"
                    style={{ background: `linear-gradient(90deg, ${cfg.accent}40, transparent)` }}
                  />
                  <div className="mt-4 flex items-center gap-2 text-sm font-bold" style={{ color: cfg.accent }}>
                    <span>زيارة</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </a>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-16 text-sm font-bold"
          style={{ color: cfg.muted }}
        >
          {cfg.bottom}
        </motion.p>
      </div>
    </div>
  );
}

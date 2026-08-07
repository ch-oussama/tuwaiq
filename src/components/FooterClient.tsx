"use client";

import Link from 'next/link';
import { useBranch } from '@/lib/BranchContext';
import { useLang } from '@/lib/LanguageContext';
import { t } from '@/lib/translations';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function FooterClient() {
  const { branch } = useBranch();
  const { lang } = useLang();
  const isDesign = branch === 'design';

  const titlePrefix = 'Tuwaiq';
  const titleSuffix = isDesign ? 'Design' : 'Studio';

  const descriptionText = isDesign
    ? t(lang, 'footer.desc_design')
    : t(lang, 'footer.desc_studio');

  return (
    <footer className="bg-black border-t border-white/10 relative z-10">
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        {/* Logo */}
        <Link href="/" className="inline-block mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={isDesign ? "/title of design.png" : "/title of twaq.png"} alt="Tuwaiq" className="h-14 w-auto" />
        </Link>

        {/* Description */}
        <p className="text-white/50 text-sm leading-relaxed max-w-lg mx-auto mb-10">
          {descriptionText}
        </p>

        {/* Contact Info */}
        <div className="space-y-3 mb-10">
          <a href="mailto:tuwaiqstudio2026@gmail.com" className="flex items-center justify-center gap-2 text-white/60 hover:text-brand-gold transition-colors text-sm">
            <Mail size={16} />
            <span>tuwaiqstudio2026@gmail.com</span>
          </a>
          <a href="tel:+966530036410" className="flex items-center justify-center gap-2 text-white/60 hover:text-brand-gold transition-colors text-sm" dir="ltr">
            <Phone size={16} />
            <span>+966 53 003 6410</span>
          </a>
          <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
            <MapPin size={16} />
            <span>المملكة العربية السعودية - الرياض</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-10 border-t border-white/10 pt-8">
          <Link href="/contact" className="text-sm text-white/40 hover:text-brand-gold transition-colors">{t(lang, 'footer.contact_us')}</Link>
          <Link href="/terms" className="text-sm text-white/40 hover:text-brand-gold transition-colors">{t(lang, 'footer.terms')}</Link>
          <Link href="/privacy" className="text-sm text-white/40 hover:text-brand-gold transition-colors">{t(lang, 'footer.privacy')}</Link>
        </div>

        {/* Copyright */}
        <p className="text-white/25 text-xs">
          © {new Date().getFullYear()} {titlePrefix} {titleSuffix}. {t(lang, 'footer.all_rights')}
        </p>
      </div>
    </footer>
  );
}

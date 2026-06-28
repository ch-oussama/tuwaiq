"use client";

import { motion } from 'framer-motion';
import { useBranch } from '@/lib/BranchContext';
import { useLang } from '@/lib/LanguageContext';
import { t } from '@/lib/translations';

export default function ContactPage() {
  const { branch } = useBranch();
  const { lang } = useLang();

  return (
    <div className="min-h-screen relative overflow-hidden pb-32">
      {/* Background Decor */}
      <div className="fixed top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-gold/10 via-background to-background -z-10" />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-12 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6 tracking-tight">
            {t(lang, 'contact.title')}
          </h1>
          <p className="text-lg text-foreground/70 font-medium max-w-2xl mx-auto">
            {t(lang, 'contact.subtitle')}
          </p>
        </motion.div>

        <div className="flex justify-center mt-12">
          <div className="glass p-8 md:p-12 rounded-3xl border border-border w-full max-w-3xl">
            <h3 className="text-2xl font-black mb-8 text-center text-foreground">{t(lang, 'contact.social')}</h3>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {/* WhatsApp */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:-translate-y-1 shadow-lg hover:shadow-xl"
                style={{ background: 'linear-gradient(135deg,#25D366,#128C7E)', color: '#fff' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.031 21.488a9.882 9.882 0 01-5.01-1.353l-.36-.214-3.719.976.995-3.626-.235-.373A9.854 9.854 0 012.14 11.96 9.897 9.897 0 0112.031 2.06c5.452 0 9.891 4.437 9.891 9.894s-4.439 9.89-9.891 9.89m0-18.156A8.22 8.22 0 003.815 11.96c0 1.636.425 3.23 1.236 4.636l1.246 2.164-1.455 5.3 5.418-1.42 2.109 1.154A8.22 8.22 0 0012.031 24c4.542 0 8.23-3.687 8.23-8.226S16.573 3.332 12.031 3.332m4.512 11.238c-.247-.124-1.464-.722-1.692-.805-.226-.082-.392-.124-.556.124-.165.247-.64 .805-.783.97-.145.164-.29.185-.536.061-.247-.124-1.045-.385-1.99-1.229-.735-.658-1.23-1.472-1.375-1.72-.145-.247-.015-.38.108-.504.112-.112.247-.288.371-.433.124-.144.165-.247.247-.412.083-.165.041-.31-.02-.433-.062-.124-.556-1.341-.762-1.836-.201-.484-.403-.418-.556-.425h-.475c-.165 0-.432.062-.659.31-.227.247-.866.845-.866 2.06 0 1.216.886 2.39 1.01 2.556.124.165 1.742 2.657 4.22 3.668 2.083.85 2.502.68 2.955.638.453-.041 1.464-.597 1.67-1.174.206-.577.206-1.072.145-1.174-.062-.103-.227-.165-.474-.288"/>
                </svg>
                واتساب
              </a>

              {/* Instagram */}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:-translate-y-1 shadow-lg hover:shadow-xl"
                style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)', color: '#fff' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                إنستقرام
              </a>

              {/* Twitter/X */}
              <a
                href="https://x.com/tuwaiq_design"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:-translate-y-1 shadow-lg hover:shadow-xl"
                style={{ background: '#14171A', color: '#fff', border: '1px solid #333' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                𝕏 (تويتر)
              </a>

              {/* Discord */}
              <a
                href="https://discord.gg/GvFv9nQY7j"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:-translate-y-1 shadow-lg hover:shadow-xl"
                style={{ background: 'linear-gradient(135deg,#7289DA,#5865F2)', color: '#fff' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-2.2248-.3306-4.4663-.3306-6.656 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.057a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.993a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                </svg>
                ديسكورد
              </a>

              {/* TikTok */}
              <a
                href="https://www.tiktok.com/@tuwaiq_design"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:-translate-y-1 shadow-lg hover:shadow-xl"
                style={{ background: 'linear-gradient(135deg,#010101,#2b2b2b)', color: '#fff', border: '1px solid #69C9D0' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.24 8.24 0 0 0 4.82 1.55V6.8a4.84 4.84 0 0 1-1.05-.11z"/>
                </svg>
                TikTok
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

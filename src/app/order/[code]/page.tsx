"use client";

import { motion } from 'framer-motion';
import { CheckCircle, Copy, ExternalLink, MessageCircle } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';
import { t } from '@/lib/translations';
import { useParams } from 'next/navigation';
import { useState } from 'react';

const DISCORD_INVITE = 'https://discord.gg/GvFv9nQY7j';

export default function OrderSuccessPage() {
  const { lang } = useLang();
  const params = useParams();
  const code = params.code as string;
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden pb-32 flex items-center justify-center">
      <div className="fixed top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-gold/10 via-background to-background -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg mx-auto px-6 text-center"
      >
        <div className="inline-flex items-center justify-center p-4 bg-green-500/10 text-green-500 rounded-full mb-6">
          <CheckCircle size={48} />
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4">
          {t(lang, 'order.success_title')}
        </h1>
        <p className="text-lg text-foreground/70 font-medium mb-8">
          {t(lang, 'order.success_message')}
        </p>

        <div className="glass p-8 rounded-3xl border border-border space-y-6">
          <div>
            <p className="text-sm text-foreground/50 font-bold mb-2">{t(lang, 'order.your_code')}</p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl font-black text-brand-gold tracking-widest">{code}</span>
              <button
                onClick={copyCode}
                className="p-2 rounded-xl bg-surface border border-border hover:border-brand-gold transition-colors"
                title={lang === 'ar' ? 'نسخ' : 'Copy'}
              >
                {copied ? <CheckCircle size={18} className="text-green-500" /> : <Copy size={18} />}
              </button>
            </div>
          </div>

          <div className="bg-brand-gold/5 rounded-2xl p-5 border border-brand-gold/20">
            <div className="flex items-center gap-2 mb-3">
              <MessageCircle size={20} className="text-brand-gold" />
              <p className="font-bold text-foreground">
                {lang === 'ar' ? 'خطوات إتمام الطلب' : 'Steps to complete your order'}
              </p>
            </div>
            <ol className="text-right space-y-2 text-sm text-foreground/70 font-medium">
              <li>{lang === 'ar' ? `انسخ كود الطلب: ${code}` : `Copy your order code: ${code}`}</li>
              <li>{lang === 'ar' ? 'انضم إلى سيرفر الديسكورد بالضغط على الزر أدناه' : 'Join our Discord server by clicking the button below'}</li>
              <li>{lang === 'ar' ? 'افتح تذكرة (Ticket) في قسم الدعم' : 'Open a ticket in the support section'}</li>
              <li>{lang === 'ar' ? `أرسل الكود ${code} واسم المستخدم واسمك الكامل` : `Send the code ${code}, your username and full name`}</li>
              <li>{lang === 'ar' ? 'فريقنا سيتواصل معك لتأكيد الطلب' : 'Our team will contact you to confirm the order'}</li>
            </ol>
          </div>

          <a
            href={DISCORD_INVITE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-lg transition-all hover:-translate-y-1 shadow-lg hover:shadow-xl"
            style={{ background: 'linear-gradient(135deg,#7289DA,#5865F2)', color: '#fff' }}
          >
            <ExternalLink size={20} />
            {t(lang, 'order.join_discord')}
          </a>
        </div>
      </motion.div>
    </div>
  );
}

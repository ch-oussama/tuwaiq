"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useBranch } from '@/lib/BranchContext';
import { useLang } from '@/lib/LanguageContext';
import { t } from '@/lib/translations';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order?: number;
}

export default function FAQPage() {
  const { branch } = useBranch();
  const { lang } = useLang();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  useEffect(() => {
    fetch('/api/faqs').then(r => r.json()).then(setFaqs);
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen relative overflow-hidden pb-32">
      {/* Background Decor */}
      <div className="fixed top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-gold/10 via-background to-background -z-10" />
      
      <div className="max-w-4xl mx-auto px-6 sm:px-8 pt-12 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 bg-brand-gold/10 text-brand-gold rounded-full mb-6">
            <HelpCircle size={32} />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6 tracking-tight">
            {t(lang, 'faq.title')}
          </h1>
          <p className="text-lg text-foreground/70 font-medium max-w-2xl mx-auto">
            {t(lang, 'faq.subtitle')}
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                key={faq.id}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 glass ${isOpen ? 'border-brand-gold shadow-[0_0_20px_rgba(167, 139, 102,0.1)]' : 'border-border hover:border-brand-gold/50'}`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-right focus:outline-none"
                >
                  <h3 className={`text-lg font-bold transition-colors duration-300 ${isOpen ? 'text-brand-gold' : 'text-foreground'}`}>
                    {faq.question}
                  </h3>
                  <div className={`p-2 rounded-full flex-shrink-0 transition-transform duration-300 ${isOpen ? 'bg-brand-gold text-background rotate-180' : 'bg-surface text-foreground/50'}`}>
                    <ChevronDown size={20} />
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-foreground/70 leading-relaxed font-medium">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
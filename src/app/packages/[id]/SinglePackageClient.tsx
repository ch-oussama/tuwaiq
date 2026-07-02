"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Package } from '@/lib/db';
import { Star, CheckCircle, ExternalLink, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useLang } from '@/lib/LanguageContext';
import { t } from '@/lib/translations';

export default function SinglePackageClient({ pkg }: { pkg: Package }) {
  const { lang } = useLang();
  const allImages = [pkg.thumbnailUrl, ...(pkg.images || [])];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  
  const activeImage = allImages[currentIndex];

  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [lightboxOpen]);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);
  const prevImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev === 0 ? allImages.length - 1 : prev - 1));
  }, [allImages.length]);
  const nextImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev === allImages.length - 1 ? 0 : prev + 1));
  }, [allImages.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') setCurrentIndex(p => (p === 0 ? allImages.length - 1 : p - 1));
      if (e.key === 'ArrowRight') setCurrentIndex(p => (p === allImages.length - 1 ? 0 : p + 1));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxOpen, allImages.length]);

  return (
    <>
    <div className="py-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Images Section */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div 
              className="aspect-[4/3] rounded-2xl overflow-hidden glass border border-border cursor-zoom-in relative group"
              onClick={() => openLightbox(currentIndex)}
            >
              {activeImage.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) ? (
                <video src={activeImage} className="object-cover w-full h-full transition-all duration-500" autoPlay loop muted playsInline />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={activeImage} alt={pkg.title} className="object-cover w-full h-full transition-all duration-500" />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm">
                  {t(lang, 'projects.click_to_zoom') || 'تكبير'}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {allImages.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentIndex(i)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${currentIndex === i ? 'border-brand-gold scale-105 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  {img.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) ? (
                    <video src={img} className="object-cover w-full h-full" muted playsInline />
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={img} alt="" className="object-cover w-full h-full" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Details Section */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
            <h1 className="text-4xl md:text-5xl font-black text-brand-brown dark:text-brand-gold mb-4">{pkg.title}</h1>
            <div className="text-3xl text-brand-gold font-bold mb-6">{pkg.price}</div>
            
            <p className="text-lg text-foreground/80 leading-relaxed mb-8">
              {pkg.description}
            </p>

            <div className="bg-surface rounded-2xl p-6 border border-border mb-8 shadow-sm">
              <h3 className="text-xl font-bold mb-4 border-b border-border pb-2">{t(lang, 'packages.features')}</h3>
              <ul className="space-y-3">
                {pkg.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-foreground/80">
                    <CheckCircle className="text-brand-gold" size={20} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <a 
              href="https://discord.gg/twq2" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-4 bg-brand-brown text-brand-beige dark:bg-brand-beige dark:text-brand-brown rounded-xl font-black text-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-xl"
            >
              {t(lang, 'packages.buy_discord')} <ExternalLink size={24} />
            </a>
          </motion.div>
        </div>

        {/* Reviews Section */}
        {pkg.reviews && pkg.reviews.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-24">
            <h2 className="text-3xl font-black text-brand-brown dark:text-brand-gold mb-8 text-center">{t(lang, 'packages.reviews')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pkg.reviews.map(review => (
                <div key={review.id} className="bg-surface rounded-xl p-6 border border-border shadow-sm">
                  <div className="flex gap-1 text-brand-gold mb-3">
                    {[...Array(review.rating)].map((_, idx) => <Star key={idx} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-foreground/80 italic mb-4">&quot;{review.content}&quot;</p>
                  <p className="font-bold text-sm text-brand-brown dark:text-brand-gold">- {review.author}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>

    {/* ── Fullscreen Lightbox ── */}
    <AnimatePresence>
      {lightboxOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/97 backdrop-blur-xl"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50 backdrop-blur"
          >
            <X size={24} />
          </button>

          {/* Arrows */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/25 text-white rounded-full transition-all z-50 backdrop-blur"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/25 text-white rounded-full transition-all z-50 backdrop-blur"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          {/* Image/Video */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.93 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-[90vw] max-h-[88vh] flex items-center justify-center"
            onClick={e => e.stopPropagation()}
          >
            {allImages[currentIndex].match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) ? (
              <video
                src={allImages[currentIndex]}
                className="max-w-full max-h-[88vh] object-contain rounded-lg shadow-2xl"
                autoPlay loop muted playsInline
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={allImages[currentIndex]}
                alt={`${pkg.title}`}
                className="max-w-full max-h-[88vh] object-contain rounded-lg shadow-2xl"
              />
            )}
          </motion.div>

          {/* Counter */}
          {allImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 font-bold text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur">
              {currentIndex + 1} / {allImages.length}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}

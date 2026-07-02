"use client";

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { X, ChevronRight, ChevronLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import type { Project } from '@/lib/db';
import { useLang } from '@/lib/LanguageContext';
import { t } from '@/lib/translations';

export default function ProjectDetailsClient({ projectId }: { projectId: string }) {
  const { lang } = useLang();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch project from API (same approach as packages)
  useEffect(() => {
    async function loadProject() {
      try {
        const res = await fetch('/api/projects');
        if (!res.ok) throw new Error('fetch failed');
        const all: Project[] = await res.json();
        const found = all.find(p => p.id === projectId);
        if (found) {
          setProject(found);
        } else {
          setNotFound(true);
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [projectId]);

  // All images deduplicated
  const allImages = project
    ? [
        ...(project.imageUrl ? [project.imageUrl] : []),
        ...(project.images
          ? project.images.filter(img => img !== project.imageUrl)
          : []),
      ]
    : [];

  // Lightbox scroll lock
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

  // Keyboard navigation
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

  // ── Loading State ──
  if (loading) {
    return (
      <div className={`min-h-screen  flex items-center justify-center`}>
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-brand-gold mx-auto mb-4" />
          <p className="text-brand-brown/60 font-bold">{t(lang, 'projects.loading')}</p>
        </div>
      </div>
    );
  }

  // ── Not Found State ──
  if (notFound || !project) {
    return (
      <div className={`min-h-screen  flex items-center justify-center`}>
        <div className="text-center">
          <p className="text-8xl mb-6">🔍</p>
          <h1 className="text-4xl font-black text-brand-brown mb-4">{t(lang, 'projects.not_found')}</h1>
          <p className="text-foreground/60 mb-8">{t(lang, 'projects.not_found_desc')}</p>
          <Link href="/projects" className="inline-block px-8 py-3 bg-brand-brown text-brand-beige font-black rounded-full hover:scale-105 transition-transform">
            {t(lang, 'projects.back')}
          </Link>
        </div>
      </div>
    );
  }

  // ── Project View (Behance Style) ──
  return (
    <>
      <div className={`min-h-screen `}>

        {/* ── Hero Header ── */}
        <div className="pt-32 pb-16 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 text-brand-brown/60 hover:text-brand-brown font-bold mb-8 transition-colors text-sm"
              >
                <ArrowRight size={16} />
                {t(lang, 'projects.back_to_all')}
              </Link>

              {/* Category + Title */}
              <div className="mb-4">
                <span className="inline-block bg-brand-gold text-brand-beige px-4 py-1.5 rounded-full text-sm font-black shadow-sm mb-4">
                  {project.category}
                </span>
                <h1 className="text-5xl md:text-7xl font-black text-foreground leading-tight">
                  {project.title}
                </h1>
              </div>

              {/* Description + Tags Row */}
              <div className="flex flex-col md:flex-row gap-8 mt-8 pb-10 border-b border-border">
                <div className="flex-1">
                  <p className="text-lg text-foreground/80 leading-relaxed">
                    {project.description}
                  </p>
                  <Link
                    href="/packages"
                    className="inline-block mt-6 px-8 py-3 bg-brand-brown text-brand-beige font-black rounded-xl hover:scale-105 shadow-lg transition-transform"
                  >
                    {t(lang, 'projects.request_similar')}
                  </Link>
                </div>
                {project.tags && project.tags.length > 0 && (
                  <div className="md:w-64 flex-shrink-0">
                    <h3 className="text-xs font-black text-foreground/40 uppercase tracking-widest mb-3">
                      {t(lang, 'projects.tech_used')}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map(tag => (
                        <span
                          key={tag}
                          className="bg-surface border border-border text-brand-brown px-3 py-1.5 rounded-lg text-sm font-bold"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Behance-Style Vertical Image Stack ── */}
        {allImages.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
            <div className="flex flex-col gap-4">
              {allImages.map((img, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                  onClick={() => openLightbox(i)}
                  className="relative group cursor-zoom-in overflow-hidden rounded-2xl shadow-xl bg-brand-brown/5"
                >
                  {img.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) ? (
                    <video
                      src={img}
                      className="w-full h-auto object-contain"
                      autoPlay loop muted playsInline
                    />
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={img}
                      alt={`${project.title} ${i + 1}`}
                      className="w-full h-auto object-contain"
                      loading={i === 0 ? 'eager' : 'lazy'}
                    />
                  )}
                  {/* Zoom hint overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm">
                      {t(lang, 'projects.click_to_zoom')}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-20 border-t border-border pt-16"
            >
              <p className="text-2xl font-black text-foreground mb-2">{t(lang, 'projects.like_this')}</p>
              <p className="text-foreground/70 mb-8">{t(lang, 'projects.contact_cta')}</p>
              <Link
                href="/packages"
                className="inline-block px-12 py-4 bg-brand-gold text-brand-beige font-black text-lg rounded-full hover:scale-105 transition-transform shadow-2xl"
              >
                {t(lang, 'projects.view_packages')}
              </Link>
            </motion.div>
          </div>
        )}

        {allImages.length === 0 && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 text-center py-24 text-foreground/50">
            <p className="text-6xl mb-4">🖼️</p>
            <p className="text-xl font-bold">{t(lang, 'projects.no_images')}</p>
          </div>
        )}
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

            {/* Image */}
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
                  alt={`${project.title}`}
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

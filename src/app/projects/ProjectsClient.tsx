"use client";

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';
import type { Project } from '@/lib/db';
import { useBranch } from '@/lib/BranchContext';

const categories = ['الكل', 'برمجة', 'تصميم جرافيك', '3D design', 'لوقو'];

export default function ProjectsClient({ projects }: { projects: Project[] }) {
  const [activeCategory, setActiveCategory] = useState('الكل');
  const { branch } = useBranch();

  const branchProjects = projects.filter(p => !p.branch || p.branch === branch);

  const filteredProjects = activeCategory === 'الكل'
    ? branchProjects
    : branchProjects.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-transparent py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-black text-brand-brown mb-4">
            مشاريعنا
          </h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            نماذج من أعمالنا المتميزة التي نفخر بتقديمها لعملائنا حول العالم
          </p>
          <div className="w-24 h-1 bg-brand-gold mx-auto mt-6 rounded-full" />
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat, i) => {
            const isActive = activeCategory === cat;
            return (
              <motion.button
                key={cat}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full font-bold text-sm border-2 transition-all ${
                  isActive
                    ? 'bg-brand-brown text-brand-beige border-brand-brown shadow-md'
                    : 'border-border text-foreground hover:border-brand-brown hover:text-brand-brown bg-surface'
                }`}
              >
                {cat}
              </motion.button>
            );
          })}
        </div>

        {/* Projects Grid - Behance Style */}
        <motion.div layout className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence>
            {filteredProjects.map((project, i) => (
              <Link
                href={`/projects/${project.id}`}
                key={project.id}
                className="block break-inside-avoid group relative overflow-hidden rounded-3xl border border-border bg-surface shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer"
              >
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.07 }}
                >
                  {/* Thumbnail */}
                  <div className="overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.imageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'}
                      alt={project.title}
                      className="w-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-brand-brown/0 group-hover:bg-brand-brown/80 transition-all duration-500 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center p-6">
                      <h3 className="text-2xl font-black text-brand-beige mb-2">{project.title}</h3>
                      <p className="text-brand-nude text-sm mb-4">{project.description}</p>
                      <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {(project.tags || []).map(tag => (
                          <span key={tag} className="bg-brand-gold/20 text-brand-gold border border-brand-gold/30 px-3 py-1 rounded-full text-xs font-bold">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 mx-auto px-5 py-2.5 bg-brand-gold text-brand-brown rounded-full font-black text-sm hover:scale-105 transition-transform w-max">
                        عرض المشروع <ExternalLink size={14} />
                      </div>
                    </div>
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-brand-gold text-brand-brown px-3 py-1 rounded-full text-xs font-black shadow-md">
                      {project.category}
                    </span>
                  </div>

                  {/* Info below */}
                  <div className="p-5 relative z-10 bg-surface">
                    <h3 className="font-black text-lg text-brand-brown">{project.title}</h3>
                    <p className="text-foreground/60 text-sm mt-1">{project.category}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-24 text-foreground/50">
            <p className="text-6xl mb-4">📂</p>
            <p className="text-xl font-bold">لا توجد مشاريع في هذا التصنيف.</p>
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <p className="text-xl text-foreground/70 mb-6">هل لديك مشروع تريد تنفيذه؟</p>
          <Link
            href="/packages"
            className="inline-block px-10 py-4 bg-brand-brown text-brand-beige font-black text-lg rounded-full hover:scale-105 transition-transform shadow-xl"
          >
            ابدأ مشروعك معنا
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

"use client";

import { motion } from 'framer-motion';
import { Package } from '@/lib/db';
import { Star, CheckCircle, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function SinglePackageClient({ pkg }: { pkg: Package }) {
  const [activeImage, setActiveImage] = useState(pkg.thumbnailUrl);
  const allImages = [pkg.thumbnailUrl, ...pkg.images];

  return (
    <div className="py-24 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Images Section */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden glass border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={activeImage} alt={pkg.title} className="object-cover w-full h-full transition-all duration-500" />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {allImages.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(img)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === img ? 'border-brand-gold scale-105 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Details Section */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
            <h1 className="text-4xl md:text-5xl font-black text-brand-brown dark:text-brand-nude mb-4">{pkg.title}</h1>
            <div className="text-3xl text-brand-gold font-bold mb-6">${pkg.price}</div>
            
            <p className="text-lg text-foreground/80 leading-relaxed mb-8">
              {pkg.description}
            </p>

            <div className="bg-surface rounded-2xl p-6 border border-border mb-8 shadow-sm">
              <h3 className="text-xl font-bold mb-4 border-b border-border pb-2">مميزات الباقة</h3>
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
              شراء الآن عبر ديسكورد <ExternalLink size={24} />
            </a>
          </motion.div>
        </div>

        {/* Reviews Section */}
        {pkg.reviews && pkg.reviews.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-24">
            <h2 className="text-3xl font-black text-brand-brown dark:text-brand-nude mb-8 text-center">تقييمات العملاء لهذه الباقة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pkg.reviews.map(review => (
                <div key={review.id} className="bg-surface rounded-xl p-6 border border-border shadow-sm">
                  <div className="flex gap-1 text-brand-gold mb-3">
                    {[...Array(review.rating)].map((_, idx) => <Star key={idx} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-foreground/80 italic mb-4">&quot;{review.content}&quot;</p>
                  <p className="font-bold text-sm text-brand-brown dark:text-brand-nude">- {review.author}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

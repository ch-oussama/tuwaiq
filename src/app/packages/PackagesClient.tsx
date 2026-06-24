"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Package } from '@/lib/db';

export default function PackagesClient({ packages }: { packages: Package[] }) {
  return (
    <div className="py-24 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-black text-brand-brown dark:text-brand-nude mb-4">كافة الباقات</h1>
          <p className="text-xl text-foreground/70">اختر من مجموعة خدماتنا المتكاملة والمصممة لتلبية تطلعاتك</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg, i) => (
            <motion.div 
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group glass rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-border bg-surface flex flex-col"
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={pkg.thumbnailUrl} alt={pkg.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-in-out"/>
                <div className="absolute top-4 left-4 bg-brand-gold text-brand-brown px-3 py-1 rounded-full font-bold shadow-md">
                  ${pkg.price}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold mb-2 text-brand-brown dark:text-brand-beige">{pkg.title}</h3>
                <p className="text-foreground/70 mb-6 flex-grow">{pkg.description}</p>
                <Link href={`/packages/${pkg.id}`} className="block w-full text-center py-3 rounded-lg border border-transparent bg-brand-brown text-brand-beige dark:bg-brand-beige dark:text-brand-brown font-bold hover:scale-105 transition-transform">
                  استعراض التفاصيل
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

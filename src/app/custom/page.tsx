"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Check, Search, X, ArrowLeft, Send, PackageOpen } from 'lucide-react';
import { useBranch } from '@/lib/BranchContext';
import { useLang } from '@/lib/LanguageContext';
import { t } from '@/lib/translations';
import { useRouter } from 'next/navigation';
import type { CustomOption } from '@/lib/db';

const DISCORD_INVITE = 'https://discord.gg/GvFv9nQY7j';

export default function CustomPage() {
  const { branch } = useBranch();
  const { lang } = useLang();
  const router = useRouter();

  const [options, setOptions] = useState<CustomOption[]>([]);
  const [selected, setSelected] = useState<Map<string, CustomOption>>(new Map());
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(false);

  // Order form
  const [showForm, setShowForm] = useState(false);
  const [discordUsername, setDiscordUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    fetch('/api/custom-options')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setOptions(data);
      })
      .catch(() => {});
  }, []);

  const categories = ['all', ...new Set(options.map(o => o.category))];

  const filtered = options.filter(o => {
    if (category !== 'all' && o.category !== category) return false;
    if (search && !o.name.toLowerCase().includes(search.toLowerCase()) && !o.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const total = Array.from(selected.values()).reduce((sum, o) => sum + o.price, 0);

  const toggleOption = (opt: CustomOption) => {
    setSelected(prev => {
      const next = new Map(prev);
      if (next.has(opt.id)) next.delete(opt.id);
      else next.set(opt.id, opt);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: Array.from(selected.values()).map(o => ({ optionId: o.id, optionName: o.name, price: o.price })),
          total,
          discordUsername,
          fullName,
          email,
          phone,
          branch,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/order/${data.code}`);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden pb-32">
      <div className="fixed top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-gold/10 via-background to-background -z-10" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-12 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center p-3 bg-brand-gold/10 text-brand-gold rounded-full mb-6">
            <ShoppingCart size={32} />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6 tracking-tight">
            {t(lang, 'custom.title')}
          </h1>
          <p className="text-lg text-foreground/70 font-medium max-w-2xl mx-auto">
            {t(lang, 'custom.subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Options grid */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search + Category */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search size={18} className="absolute top-1/2 -translate-y-1/2 right-4 text-foreground/40" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder={t(lang, 'custom.search')}
                  className="w-full bg-surface border border-border rounded-2xl px-12 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${
                      category === cat ? 'bg-brand-gold text-brand-brown' : 'bg-surface border border-border text-foreground/70 hover:border-brand-gold'
                    }`}
                  >
                    {cat === 'all' ? (lang === 'ar' ? 'الكل' : 'All') : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((opt, index) => {
                const isSelected = selected.has(opt.id);
                return (
                  <motion.div
                    key={opt.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => toggleOption(opt)}
                    className={`relative cursor-pointer rounded-2xl p-5 border-2 transition-all duration-300 ${
                      isSelected
                        ? 'border-brand-gold bg-brand-gold/5 shadow-[0_0_20px_rgba(240,192,64,0.15)]'
                        : 'border-border bg-surface hover:border-brand-gold/50'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 left-3 bg-brand-gold text-brand-brown rounded-full p-1">
                        <Check size={14} />
                      </div>
                    )}
                    {opt.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={opt.imageUrl} alt={opt.name} className="w-full h-32 object-cover rounded-xl mb-3" />
                    )}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-black text-foreground">{opt.name}</h3>
                        <p className="text-xs text-foreground/50 font-medium mt-1">{opt.category}</p>
                      </div>
                      <span className="text-lg font-black text-brand-gold whitespace-nowrap">${opt.price}</span>
                    </div>
                    <p className="text-sm text-foreground/60 mt-2 line-clamp-2">{opt.description}</p>
                  </motion.div>
                );
              })}
              {filtered.length === 0 && (
                <div className="col-span-2 text-center py-16 text-foreground/60 bg-surface rounded-2xl border border-border">
                  <PackageOpen size={40} className="mx-auto mb-4 opacity-30" />
                  <p className="font-bold">{lang === 'ar' ? 'لا توجد خيارات متاحة' : 'No options available'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Cart sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-surface border border-border rounded-3xl p-6 shadow-xl">
              <h2 className="text-xl font-black mb-1 flex items-center gap-2">
                <ShoppingCart size={20} className="text-brand-gold" />
                {t(lang, 'custom.selected')} ({selected.size})
              </h2>
              <p className="text-sm text-foreground/50 mb-6">{t(lang, 'custom.total')}: <span className="text-brand-gold font-black text-2xl">${total}</span></p>

              <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto">
                {Array.from(selected.values()).map(opt => (
                  <div key={opt.id} className="flex items-center justify-between bg-background/50 rounded-xl px-4 py-3 border border-border">
                    <div>
                      <p className="font-bold text-sm text-foreground">{opt.name}</p>
                      <p className="text-xs text-foreground/40">${opt.price}</p>
                    </div>
                    <button
                      onClick={() => toggleOption(opt)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {selected.size === 0 && (
                  <p className="text-center text-foreground/40 text-sm py-8">{lang === 'ar' ? 'لم تختر أي شيء بعد' : 'Nothing selected yet'}</p>
                )}
              </div>

              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  disabled={selected.size === 0}
                  className="w-full bg-brand-gold text-brand-brown font-black py-3.5 rounded-xl hover:brightness-105 transition disabled:opacity-50 shadow-md flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={18} /> {t(lang, 'custom.submit')}
                </button>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-black mb-1 text-foreground/70">{t(lang, 'order.discord_username')}</label>
                    <input value={discordUsername} onChange={e => setDiscordUsername(e.target.value)} required className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-black mb-1 text-foreground/70">{t(lang, 'order.fullname_label')}</label>
                    <input value={fullName} onChange={e => setFullName(e.target.value)} required className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-black mb-1 text-foreground/70">{t(lang, 'order.email_label')}</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-black mb-1 text-foreground/70">{t(lang, 'order.phone_label')}</label>
                    <input value={phone} onChange={e => setPhone(e.target.value)} required className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button type="submit" disabled={loading} className="flex-1 bg-brand-gold text-brand-brown font-black py-3 rounded-xl hover:brightness-105 transition disabled:opacity-50 shadow-md flex items-center justify-center gap-2">
                      {loading ? '...' : <><Send size={16} /> {t(lang, 'order.submit_order')}</>}
                    </button>
                    <button type="button" onClick={() => setShowForm(false)} className="px-4 py-3 rounded-xl border border-border text-foreground/60 hover:bg-surface-hover transition-colors">
                      {lang === 'ar' ? 'رجوع' : 'Back'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

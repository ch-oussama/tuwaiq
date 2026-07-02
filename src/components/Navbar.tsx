"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, LogOut, User, Building, Paintbrush } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useBranch } from '@/lib/BranchContext';
import { useLang } from '@/lib/LanguageContext';
import { t } from '@/lib/translations';
import { auth } from '@/lib/firebase';

export default function Navbar() {
  const { branch, setBranch } = useBranch();
  const { lang } = useLang();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  }, []);

  useEffect(() => {
    setActiveId(window.location.hash);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
      const sections = ['about', 'reviews'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) { setActiveId('#' + id); return; }
        }
      }
      if (window.scrollY < 200) setActiveId('');
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { user, isAdmin } = useAuth();

  const navLinks = [
    { name: t(lang, 'nav.home'), path: '/' },
    { name: t(lang, 'nav.projects'), path: '/projects' },
    { name: t(lang, 'nav.packages'), path: '/packages' },
    { name: t(lang, 'nav.about'), path: '/#about' },
    { name: t(lang, 'nav.faq'), path: '/faq' },
    { name: t(lang, 'nav.contact'), path: '/contact' },
    ...(isAdmin ? [{ name: t(lang, 'nav.admin'), path: '/admin' }] : []),
  ];

  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > 100 && latest > previous!) setHidden(true);
    else setHidden(false);
  });

  return (
    <motion.nav
      variants={{ visible: { y: 0 }, hidden: { y: "-100%" } }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 w-full z-50 transition-all duration-400"
      style={{
        background: isScrolled ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(30px) saturate(1.3)' : 'none',
        borderBottom: isScrolled ? '1px solid var(--border)' : 'none',
        boxShadow: isScrolled ? '0 2px 30px rgba(0,0,0,0.05)' : 'none',
      }}
    >
      <div className="w-full px-4 lg:px-10">
        <div className="flex items-center h-20 gap-4">

          {/* ── RIGHT: Logo + Name ── */}
          <div className="flex items-center gap-3 flex-shrink-0 ms-auto md:ms-0">
            <Link href="/" className="flex items-center gap-3">
              <span
                className="text-2xl font-black tracking-tight whitespace-nowrap hidden sm:block text-foreground"
              >
                Tuwaiq <span className="text-brand-gold">{branch === 'design' ? 'Design' : 'Studio'}</span>
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={branch === 'design' ? "/logo design.webp" : "/logo studio.webp"}
                alt={branch === 'design' ? "Tuwaiq Design" : "Tuwaiq Studio"}
                className={`object-contain drop-shadow-lg transition-all duration-300 hover:scale-110 ${branch === 'design' ? 'rounded-full' : ''}`}
                style={{ height: isScrolled ? 56 : 72, width: isScrolled ? 56 : 72, filter: 'drop-shadow(0 0 8px var(--brand-gold))' }}
              />
            </Link>
          </div>

          {/* ── CENTER: Nav links ── */}
          <div className="hidden md:flex items-center justify-center flex-1 gap-8">
            {navLinks.map((link) => {
              const isHashLink = link.path.includes('#');
              let isActive = false;
              if (isHashLink) isActive = pathname === '/' && activeId === link.path.substring(link.path.indexOf('#'));
              else isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={(e) => {
                    if (isHashLink && pathname === '/') {
                      const id = link.path.split('#')[1];
                      const el = document.getElementById(id);
                      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
                    }
                  }}
                  className="relative py-2 font-bold text-sm tracking-wide group transition-colors"
                  style={{ color: isActive ? 'var(--brand-gold)' : 'var(--foreground)' }}
                >
                  {link.name}
                  <span className="absolute bottom-0 right-0 h-0.5 rounded-full transition-all duration-300 bg-brand-gold"
                    style={{ width: isActive ? '100%' : '0%' }} />
                  <span className="absolute bottom-0 right-0 h-0.5 rounded-full opacity-0 group-hover:opacity-100 group-hover:w-full transition-all duration-300 w-0 bg-brand-gold" />
                </Link>
              );
            })}
          </div>

          {/* ── LEFT: Branch / Auth ── */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0 me-auto md:me-0">
            <button
              onClick={() => setBranch(null)}
              title={t(lang, 'nav.branch_switch')}
              className="px-4 py-2 rounded-full font-black text-sm transition-all hover:scale-105 border-2 text-foreground border-border hover:bg-surface flex items-center gap-2"
            >
              {branch === 'design' ? <Paintbrush size={16} /> : <Building size={16} />}
              {t(lang, 'nav.branch')}
            </button>
            
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border">
                  {user.photoURL ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.photoURL} alt="Avatar" className="w-6 h-6 rounded-full" />
                  ) : (
                    <User size={16} className="text-foreground" />
                  )}
                  <span className="text-sm font-bold truncate max-w-[100px] text-foreground">
                    {user.displayName?.split(' ')[0] || t(lang, 'nav.login')}
                  </span>
                </div>
                <button
                  onClick={() => { auth.signOut(); document.cookie = 'admin_auth=; path=/; max-age=0'; }}
                  title={t(lang, 'nav.logout')}
                  className="p-2.5 rounded-full border border-border transition-all hover:scale-105 text-foreground hover:bg-foreground hover:text-background"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2.5 rounded-full font-black text-sm transition-all hover:scale-105 bg-brand-beige text-brand-brown border-2 border-brand-nude-dark hover:bg-brand-brown hover:text-brand-beige hover:border-brand-brown"
              >
                {t(lang, 'nav.login')}
              </Link>
            )}
          </div>

          {/* ── Mobile menu button ── */}
          <div className="md:hidden flex items-center ms-auto gap-4">
            <button
              onClick={() => setBranch(null)}
              className="text-brand-gold"
            >
              <Building size={22} />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground"
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ background: 'var(--nav-bg)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)' }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-6 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-3 rounded-xl font-bold text-base transition-colors text-foreground hover:bg-surface"
                >
                  {link.name}
                </Link>
              ))}
              {user ? (
                <button
                  onClick={() => { auth.signOut(); setIsMobileMenuOpen(false); }}
                  className="w-full mt-4 flex items-center justify-center gap-2 px-3 py-3 rounded-xl font-black text-base border-2 text-brand-brown border-brand-brown"
                >
                  <LogOut size={18} />
                  {t(lang, 'nav.logout')}
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block mt-4 px-3 py-3 text-center rounded-xl font-black text-base bg-brand-brown text-brand-beige"
                >
                  {t(lang, 'nav.login')}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

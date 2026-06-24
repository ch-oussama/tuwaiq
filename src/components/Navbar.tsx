"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { auth } from '@/lib/firebase';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    // Update hash on load and when hash changes manually
    setActiveId(window.location.hash);
    
    // Intersection observer to track sections by ID
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
      
      const sections = ['about', 'reviews'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveId('#' + id);
            return;
          }
        }
      }
      if (window.scrollY < 200) setActiveId('');
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { user, isAdmin } = useAuth();

  const navLinks = [
    { name: 'الرئيسية', path: '/' },
    { name: 'من نحن', path: '/#about' },
    { name: 'مشاريعنا', path: '/projects' },
    { name: 'باقاتنا', path: '/packages' },
    { name: 'آراء', path: '/#reviews' },
    // Show admin link conditionally
    ...(isAdmin ? [{ name: 'لوحة الإدارة', path: '/admin' }] : []),
  ];

  const isHeroPage = pathname === '/';
  
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > 100 && latest > previous!) {
      setHidden(true); // Hide when scrolling down
    } else {
      setHidden(false); // Show when scrolling up
    }
  });

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" }
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-0 w-full z-50 transition-colors duration-400"
      style={{
        background: isScrolled
          ? 'rgba(240,233,223,0.92)'
          : isHeroPage
          ? 'transparent'
          : 'rgba(240,233,223,0.92)',
        backdropFilter: isScrolled ? 'blur(16px)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(200,185,177,0.5)' : 'none',
        boxShadow: isScrolled ? '0 2px 20px rgba(62,39,35,0.07)' : 'none',
      }}
    >
      <div className="w-full px-4 lg:px-10">
        <div className="flex items-center h-20 gap-4">

          {/* ── RIGHT: Logo + Name (flex-shrink-0, pushed to the far right in RTL) ── */}
          <div className="flex items-center gap-3 flex-shrink-0 ms-auto md:ms-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Link href="/" className="flex items-center gap-3">
              <span
                className="text-2xl font-black tracking-tight whitespace-nowrap hidden sm:block transition-all duration-300"
                style={{ color: isHeroPage && !isScrolled ? '#F5EFE6' : '#3E2723' }}
              >
                Tuwaiq<span style={{ color: '#D4AF37' }}>Studio</span>
              </span>
              <img
                src="/logo.png"
                alt="Tuwaiq Studio"
                className="object-contain drop-shadow-lg transition-all duration-300 transform hover:scale-110"
                style={{ height: isScrolled ? 56 : 80, width: isScrolled ? 56 : 80 }}
              />
            </Link>
          </div>

          {/* ── CENTER: Nav links ── */}
          <div className="hidden md:flex items-center justify-center flex-1 gap-8">
            {navLinks.map((link) => {
              const isHashLink = link.path.includes('#');
              let isActive = false;
              if (isHashLink) {
                isActive = pathname === '/' && activeId === link.path.substring(link.path.indexOf('#'));
              } else {
                isActive = pathname === link.path;
              }
              const textColor = isHeroPage && !isScrolled ? 'rgba(240,233,213,0.9)' : '#3E2723';
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={(e) => {
                    if (isHashLink && pathname === '/') {
                      const id = link.path.split('#')[1];
                      const el = document.getElementById(id);
                      if (el) {
                        e.preventDefault();
                        el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }
                  }}
                  className="relative py-2 font-bold text-sm tracking-wide group transition-colors"
                  style={{ color: isActive ? '#D4AF37' : textColor }}
                >
                  {link.name}
                  {/* Animated underline */}
                  <span
                    className="absolute bottom-0 right-0 h-0.5 rounded-full transition-all duration-300"
                    style={{
                      background: '#D4AF37',
                      width: isActive ? '100%' : '0%',
                    }}
                  />
                  <span
                    className="absolute bottom-0 right-0 h-0.5 rounded-full opacity-0 group-hover:opacity-100 group-hover:w-full transition-all duration-300 w-0"
                    style={{ background: '#D4AF37' }}
                  />
                </Link>
              );
            })}
          </div>

          {/* ── LEFT: Login / Logout button ── */}
          <div className="hidden md:flex items-center flex-shrink-0 me-auto md:me-0">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border">
                  {user.photoURL ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.photoURL} alt="Avatar" className="w-6 h-6 rounded-full" />
                  ) : (
                    <User size={16} className="text-brand-brown" />
                  )}
                  <span className="text-sm font-bold text-brand-brown truncate max-w-[100px]">
                    {user.displayName?.split(' ')[0] || 'مرحباً'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    auth.signOut();
                    document.cookie = 'admin_auth=; path=/; max-age=0'; // Clear admin cookie just in case
                  }}
                  title="تسجيل الخروج"
                  className="p-2.5 rounded-full text-brand-brown hover:bg-brand-brown hover:text-brand-nude border border-transparent hover:border-brand-brown transition-all"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2.5 rounded-full font-black text-sm transition-all hover:scale-105 shadow-md"
                style={{
                  background: '#E6DFD5',
                  color: '#3E2723',
                  border: '2px solid #C8B9B1',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = '#3E2723';
                  (e.currentTarget as HTMLAnchorElement).style.color = '#F5EFE6';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = '#3E2723';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = '#E6DFD5';
                  (e.currentTarget as HTMLAnchorElement).style.color = '#3E2723';
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = '#C8B9B1';
                }}
              >
                دخول
              </Link>
            )}
          </div>

          {/* ── Mobile menu button ── */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center ms-auto"
            style={{ color: isHeroPage && !isScrolled ? '#F5EFE6' : '#3E2723' }}
          >
            {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ background: 'rgba(240,233,223,0.97)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #C8B9B1' }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-6 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-3 rounded-xl font-bold text-base text-brand-brown hover:bg-[#DDD0BE] transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              {user ? (
                <button
                  onClick={() => {
                    auth.signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full mt-4 flex items-center justify-center gap-2 px-3 py-3 rounded-xl font-black text-base border-2 border-brand-brown text-brand-brown"
                >
                  <LogOut size={18} />
                  تسجيل الخروج
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block mt-4 px-3 py-3 text-center rounded-xl font-black text-base"
                  style={{ background: '#3E2723', color: '#F5EFE6' }}
                >
                  دخول
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useLang } from '@/lib/LanguageContext';
import { useAuth } from '@/lib/AuthContext';
import { t } from '@/lib/translations';

const COOLDOWN_MS = 2000;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { lang } = useLang();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const lastClick = useRef(0);
  const redirecting = useRef(false);

  useEffect(() => {
    if (!authLoading && user && !redirecting.current) {
      redirecting.current = true;
      if (isAdmin) {
        document.cookie = 'admin_auth=true; path=/; max-age=86400';
        router.push('/admin');
      } else {
        router.push('/');
      }
    }
  }, [user, isAdmin, authLoading, router]);

  async function handleGoogleLogin() {
    const now = Date.now();
    if (now - lastClick.current < COOLDOWN_MS || loading) return;
    lastClick.current = now;

    setError('');
    setLoading(true);

    try {
      await signInWithPopup(auth, googleProvider);
      // Let the useEffect handle the routing based on AuthContext's state
    } catch (err: any) {
      console.error(err);
      if (err?.code === 'auth/popup-closed-by-user') {
        setLoading(false);
        return;
      }
      setError(t(lang, 'login.failed') + ' ' + (err?.code || err?.message || t(lang, 'login.try_again')));
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <div className="bg-surface border border-border rounded-3xl p-10 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Tuwaiq Studio" className="h-20 w-20 object-contain mb-4 drop-shadow-lg" />
            <h1 className="text-4xl font-black text-brand-brown tracking-tight">
              Tuwaiq<span className="text-brand-gold">Studio</span>
            </h1>
            <p className="text-brand-brown/70 mt-3 font-medium text-center">{t(lang, 'login.welcome')}</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm font-bold mb-6 text-center"
            >
              {error}
            </motion.div>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-4 px-4 bg-white border border-[#C8B9B1] text-brand-brown font-black rounded-xl text-lg hover:bg-gray-50 hover:shadow-md transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-brand-brown" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t(lang, 'login.logging_in')}
              </span>
            ) : (
              <>
                <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                {t(lang, 'login.continue_google')}
              </>
            )}
          </button>

          <div className="mt-8 text-center border-t border-border pt-6">
            <Link href="/" className="text-brand-brown/60 text-sm hover:text-brand-brown hover:underline transition-colors font-bold">
              {t(lang, 'login.back_home')}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

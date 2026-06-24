"use client";

import { loginAction } from './actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);
    
    if (result.success) {
      router.refresh();
    } else {
      setError(result.error || 'فشل تسجيل الدخول');
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-24 px-4">
      <div className="max-w-md w-full bg-surface border border-border rounded-3xl p-8 shadow-2xl">
        <h2 className="text-3xl font-black text-brand-brown dark:text-brand-nude text-center mb-8">لوحة الإدارة</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-foreground/80 font-bold mb-2">البريد الإلكتروني المصرّح:</label>
            <input 
              type="email" 
              name="email" 
              required 
              dir="ltr"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-brand-gold transition-colors"
              placeholder="admin@tuwaiqstudio.com"
            />
          </div>
          {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-gold text-brand-brown font-black py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'جاري التحقق...' : 'دخول'}
          </button>
        </form>
      </div>
    </div>
  );
}

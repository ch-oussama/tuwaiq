"use client";

import { Package, Project } from '@/lib/db';
import { logoutAction } from './actions';
import { LogOut, Plus, Trash2, Star, PackageOpen, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'packages' | 'reviews' | 'projects';

export default function AdminDashboard({ initialPackages, initialProjects }: { initialPackages: Package[], initialProjects: Project[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('packages');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  
  // Review form state
  const [selectedPkg, setSelectedPkg] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewLoading, setReviewLoading] = useState(false);

  // Project form state
  const [projectLoading, setProjectLoading] = useState(false);

  const showNotif = (type: 'success' | 'error', msg: string) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 3500);
  };

  async function handleLogout() {
    await logoutAction();
    router.refresh();
  }

  async function handleAddPackage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const body = {
      title: formData.get('title'),
      shortDescription: formData.get('shortDescription'),
      description: formData.get('description'),
      price: Number(formData.get('price')),
      branch: formData.get('branch'),
      thumbnailUrl: formData.get('thumbnailUrl'),
      images: (formData.get('images') as string).split(',').map(s => s.trim()).filter(s => s),
      features: (formData.get('features') as string).split('\n').map(s => s.trim()).filter(s => s),
    };
    try {
      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        (e.target as HTMLFormElement).reset();
        showNotif('success', 'تمت إضافة الباقة بنجاح ✓');
        router.refresh();
      } else {
        const err = await res.json();
        showNotif('error', 'فشل إضافة الباقة: ' + (err.error || 'Firestore غير مفعل'));
      }
    } catch {
      showNotif('error', 'خطأ في الاتصال، ربما Firestore غير مفعل.');
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذه الباقة؟')) return;
    setDeleteLoading(id);
    try {
      const res = await fetch('/api/packages', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        showNotif('success', 'تم حذف الباقة بنجاح');
        router.refresh();
      } else {
        showNotif('error', 'فشل الحذف');
      }
    } catch {
      showNotif('error', 'خطأ في الاتصال');
    }
    setDeleteLoading(null);
  }

  async function handleAddReview(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setReviewLoading(true);
    const formData = new FormData(e.currentTarget);
    const body = {
      packageId: selectedPkg,
      author: formData.get('author'),
      rating: reviewRating,
      content: formData.get('content'),
    };
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        (e.target as HTMLFormElement).reset();
        setReviewRating(5);
        showNotif('success', 'تمت إضافة التقييم بنجاح ✓');
        router.refresh();
      } else {
        showNotif('error', 'فشل إضافة التقييم');
      }
    } catch {
      showNotif('error', 'خطأ في الاتصال، ربما Firestore غير مفعل.');
    }
    setReviewLoading(false);
  }

  async function handleAddProject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setProjectLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const imagesText = formData.get('imagesText') as string;
      const imageUrls = imagesText 
        ? imagesText.split(/\r?\n|,/).map(s => s.trim()).filter(s => s.startsWith('http')) 
        : [];

      const body = {
        title: formData.get('title'),
        category: formData.get('category'),
        branch: formData.get('branch'),
        description: formData.get('description'),
        imageUrl: imageUrls[0] || '',
        images: imageUrls,
        tags: (formData.get('tags') as string).split(',').map(s => s.trim()).filter(s => s),
      };

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        (e.target as HTMLFormElement).reset();
        showNotif('success', 'تمت إضافة المشروع بنجاح ✓');
        router.refresh();
      } else {
        showNotif('error', 'فشل حفظ المشروع في قاعدة البيانات');
      }
    } catch (err: any) {
      console.error(err);
      showNotif('error', 'فشل إضافة المشروع: ' + (err?.message || 'خطأ مجهول'));
    }
    setProjectLoading(false);
  }

  async function handleDeleteProject(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذا المشروع؟')) return;
    setDeleteLoading(id);
    try {
      const res = await fetch('/api/projects', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        showNotif('success', 'تم حذف المشروع بنجاح');
        router.refresh();
      } else {
        showNotif('error', 'فشل الحذف');
      }
    } catch {
      showNotif('error', 'خطأ في الاتصال');
    }
    setDeleteLoading(null);
  }

  return (
    <div className="min-h-screen bg-background py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Toast Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              className={`fixed top-6 left-1/2 z-[9999] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl font-bold text-base ${
                notification.type === 'success' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-red-600 text-white'
              }`}
            >
              {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
              {notification.msg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-brand-brown dark:text-brand-nude">لوحة التحكم</h1>
            <p className="text-foreground/60 mt-1">إدارة باقات وتقييمات المتجر</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface border border-red-200 text-red-500 font-bold hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} /> تسجيل خروج
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
            <p className="text-foreground/60 text-sm font-bold mb-1">إجمالي الباقات</p>
            <p className="text-4xl font-black text-brand-brown dark:text-brand-nude">{initialPackages.length}</p>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
            <p className="text-foreground/60 text-sm font-bold mb-1">إجمالي التقييمات</p>
            <p className="text-4xl font-black text-brand-gold">
              {initialPackages.reduce((sum, p) => sum + (p.reviews?.length || 0), 0)}
            </p>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
            <p className="text-foreground/60 text-sm font-bold mb-1">متوسط السعر</p>
            <p className="text-4xl font-black text-brand-brown dark:text-brand-nude">
              ${initialPackages.length > 0 ? Math.round(initialPackages.reduce((sum, p) => sum + p.price, 0) / initialPackages.length) : 0}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-surface border border-border rounded-2xl p-1.5 w-fit flex-wrap">
          {([['packages', 'الباقات', PackageOpen], ['reviews', 'التقييمات', Star], ['projects', 'المشاريع', Lightbulb]] as const).map(([key, label, Icon]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all text-sm ${
                activeTab === key
                  ? 'bg-brand-brown text-brand-beige shadow-md'
                  : 'text-foreground hover:bg-surface-hover'
              }`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'packages' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Add Form */}
            <div className="lg:col-span-2 bg-surface border border-border rounded-3xl p-6 shadow-xl h-fit">
              <h2 className="text-xl font-black mb-5 flex items-center gap-2 text-brand-brown dark:text-brand-nude">
                <Plus className="text-brand-gold" size={20} /> إضافة باقة جديدة
              </h2>
              <form onSubmit={handleAddPackage} className="space-y-3.5">
                {[
                  { label: 'اسم الباقة', name: 'title', type: 'input', required: true },
                  { label: 'وصف مختصر', name: 'shortDescription', type: 'input', required: true },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block text-xs font-black mb-1 text-foreground/70 uppercase tracking-wide">{f.label}</label>
                    <input name={f.name} required={f.required} className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors" />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-black mb-1 text-foreground/70 uppercase tracking-wide">الفرع (Branch)</label>
                  <select name="branch" required className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors">
                    <option value="studio">أستوديو طويق (Studio)</option>
                    <option value="design">طويق للتصميم (Design)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black mb-1 text-foreground/70 uppercase tracking-wide">الوصف الكامل</label>
                  <textarea name="description" required rows={3} className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-black mb-1 text-foreground/70 uppercase tracking-wide">السعر ($)</label>
                  <input name="price" type="number" min="1" required className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-black mb-1 text-foreground/70 uppercase tracking-wide">رابط الصورة الرئيسية</label>
                  <input name="thumbnailUrl" required dir="ltr" className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-left focus:outline-none focus:border-brand-gold transition-colors" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-xs font-black mb-1 text-foreground/70 uppercase tracking-wide">صور إضافية (روابط مفصولة بفاصلة)</label>
                  <textarea name="images" dir="ltr" rows={2} className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-left focus:outline-none focus:border-brand-gold transition-colors resize-none" placeholder="https://..., https://..." />
                </div>
                <div>
                  <label className="block text-xs font-black mb-1 text-foreground/70 uppercase tracking-wide">المميزات (كل ميزة في سطر)</label>
                  <textarea name="features" required rows={3} className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors resize-none" />
                </div>
                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-brand-gold text-brand-brown font-black py-3 rounded-xl hover:brightness-105 transition disabled:opacity-50 mt-2 shadow-md"
                >
                  {loading ? 'جاري الحفظ...' : 'حفظ الباقة'}
                </button>
              </form>
            </div>

            {/* Packages List */}
            <div className="lg:col-span-3">
              <h2 className="text-xl font-black mb-5">الباقات الحالية ({initialPackages.length})</h2>
              <div className="space-y-4">
                {initialPackages.map(pkg => (
                  <div key={pkg.id} className="bg-surface border border-border rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={pkg.thumbnailUrl} alt="" className="w-16 h-16 rounded-xl object-cover border border-border" />
                      <div>
                        <h3 className="font-black text-base text-brand-brown dark:text-brand-nude">{pkg.title}</h3>
                        <p className="text-sm text-foreground/60 font-medium flex items-center gap-2">
                          {pkg.price}$ 
                          <span className="bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded text-xs font-bold">{pkg.branch === 'design' ? 'Design' : 'Studio'}</span>
                        </p>
                        <p className="text-xs text-foreground/40 mt-0.5">{pkg.reviews?.length || 0} تقييم</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      disabled={deleteLoading === pkg.id}
                      className="text-red-400 hover:text-red-600 transition p-2 rounded-lg hover:bg-red-50 disabled:opacity-50"
                      title="حذف الباقة"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
                {initialPackages.length === 0 && (
                  <div className="text-center py-16 text-foreground/60 bg-surface rounded-2xl border border-border">
                    <PackageOpen size={40} className="mx-auto mb-4 opacity-30" />
                    <p className="font-bold">لا توجد باقات مضافة بعد.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Add Review Form */}
            <div className="lg:col-span-2 bg-surface border border-border rounded-3xl p-6 shadow-xl h-fit">
              <h2 className="text-xl font-black mb-5 flex items-center gap-2 text-brand-brown dark:text-brand-nude">
                <Star className="text-brand-gold" size={20} /> إضافة تقييم
              </h2>
              <form onSubmit={handleAddReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-black mb-1 text-foreground/70 uppercase tracking-wide">الباقة</label>
                  <select
                    value={selectedPkg}
                    onChange={e => setSelectedPkg(e.target.value)}
                    required
                    className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                  >
                    <option value="">اختر الباقة...</option>
                    {initialPackages.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black mb-1 text-foreground/70 uppercase tracking-wide">اسم العميل</label>
                  <input name="author" required className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-black mb-2 text-foreground/70 uppercase tracking-wide">التقييم</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setReviewRating(n)}
                        className={`transition-transform hover:scale-110 ${n <= reviewRating ? 'text-brand-gold' : 'text-foreground/20'}`}
                      >
                        <Star size={28} fill={n <= reviewRating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black mb-1 text-foreground/70 uppercase tracking-wide">نص التقييم</label>
                  <textarea name="content" required rows={4} className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors resize-none" />
                </div>
                <button
                  disabled={reviewLoading || !selectedPkg}
                  type="submit"
                  className="w-full bg-brand-gold text-brand-brown font-black py-3 rounded-xl hover:brightness-105 transition disabled:opacity-50 shadow-md"
                >
                  {reviewLoading ? 'جاري الحفظ...' : 'نشر التقييم'}
                </button>
              </form>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-3">
              <h2 className="text-xl font-black mb-5">
                التقييمات الحالية ({initialPackages.reduce((sum, p) => sum + (p.reviews?.length || 0), 0)})
              </h2>
              <div className="space-y-4">
                {initialPackages.flatMap(pkg =>
                  (pkg.reviews || []).map(review => (
                    <div key={review.id} className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-black text-brand-brown dark:text-brand-nude">{review.author}</p>
                          <p className="text-xs text-foreground/40">{pkg.title}</p>
                        </div>
                        <div className="flex gap-1 text-brand-gold">
                          {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                        </div>
                      </div>
                      <p className="text-sm text-foreground/80 italic">&quot;{review.content}&quot;</p>
                    </div>
                  ))
                )}
                {initialPackages.flatMap(p => p.reviews || []).length === 0 && (
                  <div className="text-center py-16 bg-surface rounded-2xl border border-border text-foreground/60">
                    <Star size={40} className="mx-auto mb-4 opacity-30" />
                    <p className="font-bold">لا توجد تقييمات مضافة بعد.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 bg-surface border border-border rounded-3xl p-6 shadow-xl h-fit">
              <h2 className="text-xl font-black mb-5 flex items-center gap-2 text-brand-brown dark:text-brand-nude">
                <Plus className="text-brand-gold" size={20} /> إضافة مشروع جديد
              </h2>
              <form onSubmit={handleAddProject} className="space-y-3.5">
                {[
                  { label: 'اسم المشروع', name: 'title', required: true },
                  { label: 'التقنيات (مفصولة بفاصلة)', name: 'tags', required: true },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block text-xs font-black mb-1 text-foreground/70 uppercase tracking-wide">{f.label}</label>
                    <input name={f.name} required={f.required} className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors" />
                  </div>
                ))}
                {/* Category Dropdown */}
                <div>
                  <label className="block text-xs font-black mb-1 text-foreground/70 uppercase tracking-wide">التصنيف</label>
                  <select
                    name="category"
                    required
                    className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                  >
                    <option value="">اختر التصنيف...</option>
                    <option value="برمجة">برمجة</option>
                    <option value="تصميم جرافيك">تصميم جرافيك</option>
                    <option value="3D design">3D design</option>
                    <option value="لوقو">لوقو</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black mb-1 text-foreground/70 uppercase tracking-wide">الفرع (Branch)</label>
                  <select name="branch" required className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors">
                    <option value="studio">أستوديو طويق (Studio)</option>
                    <option value="design">طويق للتصميم (Design)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black mb-1 text-foreground/70 uppercase tracking-wide">الوصف</label>
                  <textarea name="description" required rows={3} className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors resize-none" />
                </div>

                {/* Discord URLs input */}
                <div>
                  <label className="block text-xs font-black mb-1 text-foreground/70 uppercase tracking-wide">
                    روابط الصور (ديسكورد وغيرها - ضع كلاً منها في سطر جديد)
                  </label>
                  <textarea 
                    name="imagesText" 
                    required 
                    rows={4} 
                    placeholder="https://cdn.discordapp.com/attachments/...&#10;https://cdn.discordapp.com/attachments/..."
                    className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors resize-none ltr text-left" 
                    dir="ltr"
                  />
                  <p className="text-xs text-brand-brown/50 mt-1">
                    أول رابط سيتم اعتباره الصورة الرئيسية للمشروع.
                  </p>
                </div>

                <button type="submit" disabled={projectLoading} className="w-full mt-4 bg-brand-gold text-brand-brown font-black py-4 rounded-xl hover:bg-brand-brown hover:text-brand-gold transition-colors disabled:opacity-50">
                  {projectLoading ? 'جاري الحفظ والإنشار...' : '🚀 نشر المشروع'}
                </button>
              </form>
            </div>
            {/* Projects List */}
            <div className="lg:col-span-3">
              <h2 className="text-xl font-black mb-5">
                المشاريع الحالية ({initialProjects.length})
              </h2>
              <div className="space-y-4">
                {initialProjects.map(proj => (
                  <div key={proj.id} className="bg-surface border border-border rounded-2xl p-5 shadow-sm flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={proj.imageUrl} alt={proj.title} className="w-20 h-20 rounded-xl object-cover" />
                    <div className="flex-1">
                      <p className="font-black text-brand-brown dark:text-brand-nude text-xl">{proj.title}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-bold text-brand-gold">{proj.category}</span>
                        <span className="bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded text-xs font-bold">{proj.branch === 'design' ? 'Design' : 'Studio'}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      disabled={deleteLoading === proj.id}
                      className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

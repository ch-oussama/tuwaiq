"use client";

import { Package, Project, TermsData, PrivacyData, TermsSection, CustomOption, Order, FAQItem } from '@/lib/db';
import { logoutAction } from './actions';
import { LogOut, Plus, Trash2, Star, PackageOpen, AlertTriangle, CheckCircle, Lightbulb, Edit2, X, FileText, Shield, ShoppingCart, ClipboardList, HelpCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'packages' | 'reviews' | 'projects' | 'terms' | 'privacy' | 'custom_options' | 'orders' | 'faqs';

export default function AdminDashboard({ initialPackages, initialProjects, initialTerms, initialPrivacy, initialCustomOptions, initialOrders, initialFAQs }: { initialPackages: Package[], initialProjects: Project[], initialTerms: TermsData, initialPrivacy: PrivacyData, initialCustomOptions: CustomOption[], initialOrders: Order[], initialFAQs: FAQItem[] }) {
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
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Terms state
  const [termsData, setTermsData] = useState<TermsData>(initialTerms);
  const [termsLoading, setTermsLoading] = useState(false);

  // Privacy state
  const [privacyData, setPrivacyData] = useState<PrivacyData>(initialPrivacy);
  const [privacyLoading, setPrivacyLoading] = useState(false);

  // Custom options state
  const [customOptions, setCustomOptions] = useState<CustomOption[]>(initialCustomOptions);
  const [optionName, setOptionName] = useState('');
  const [optionPrice, setOptionPrice] = useState(0);
  const [optionCategory, setOptionCategory] = useState('');
  const [optionDesc, setOptionDesc] = useState('');
  const [optionImage, setOptionImage] = useState('');
  const [optionLoading, setOptionLoading] = useState(false);
  const [editingOption, setEditingOption] = useState<CustomOption | null>(null);

  // Orders state
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  // FAQ state
  const [faqs, setFaqs] = useState<FAQItem[]>(initialFAQs);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqLoading, setFaqLoading] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);

  const showNotif = (type: 'success' | 'error', msg: string) => {
    setNotification({ type, msg });
    setTimeout(() => setNotification(null), 3500);
  };

  
  async function handleEditPackage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingPackage) return;
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const body = {
      id: editingPackage.id,
      title: formData.get('title'),
      shortDescription: formData.get('shortDescription'),
      description: formData.get('description'),
      price: formData.get('price') as string,
      branch: formData.get('branch'),
      thumbnailUrl: formData.get('thumbnailUrl'),
      images: (formData.get('images') as string).split(',').map(s => s.trim()).filter(s => s),
      features: (formData.get('features') as string).split('\n').map(s => s.trim()).filter(s => s),
    };
    try {
      const res = await fetch('/api/packages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        showNotif('success', 'تم تعديل الباقة بنجاح ✓');
        setEditingPackage(null);
        router.refresh();
      } else {
        showNotif('error', 'فشل التعديل');
      }
    } catch {
      showNotif('error', 'خطأ في الاتصال');
    }
    setLoading(false);
  }

  async function handleEditProject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingProject) return;
    setProjectLoading(true);
    const formData = new FormData(e.currentTarget);
    const body = {
      id: editingProject.id,
      title: formData.get('title'),
      category: formData.get('category'),
      description: formData.get('description'),
      imageUrl: formData.get('imageUrl'),
      branch: formData.get('branch'),
      tags: (formData.get('tags') as string).split(',').map(s => s.trim()).filter(s => s),
    };
    try {
      const res = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        showNotif('success', 'تم تعديل المشروع بنجاح ✓');
        setEditingProject(null);
        router.refresh();
      } else {
        showNotif('error', 'فشل التعديل');
      }
    } catch {
      showNotif('error', 'خطأ في الاتصال');
    }
    setProjectLoading(false);
  }

  async function handleDeleteReview(packageId: string, reviewId: string) {
    if (!confirm('هل أنت متأكد من حذف هذا التقييم؟')) return;
    try {
      const res = await fetch('/api/reviews', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId, reviewId }),
      });
      if (res.ok) {
        showNotif('success', 'تم حذف التقييم بنجاح ✓');
        router.refresh();
      }
    } catch {}
  }

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
      price: formData.get('price') as string,
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

  async function handleSaveTerms() {
    setTermsLoading(true);
    try {
      const res = await fetch('/api/terms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(termsData),
      });
      if (res.ok) {
        showNotif('success', 'تم حفظ الشروط والأحكام بنجاح ✓');
      } else {
        showNotif('error', 'فشل حفظ الشروط');
      }
    } catch {
      showNotif('error', 'خطأ في الاتصال');
    }
    setTermsLoading(false);
  }

  function updateTermsSection(branch: 'designTerms' | 'studioTerms', index: number, field: 'title' | 'content', value: string) {
    setTermsData(prev => {
      const updated = { ...prev };
      const sections = [...updated[branch]];
      sections[index] = { ...sections[index], [field]: value };
      updated[branch] = sections;
      return updated;
    });
  }

  function addTermsSection(branch: 'designTerms' | 'studioTerms') {
    setTermsData(prev => {
      const updated = { ...prev };
      updated[branch] = [...updated[branch], { title: '', content: '' }];
      return updated;
    });
  }

  async function handleSavePrivacy() {
    setPrivacyLoading(true);
    try {
      const res = await fetch('/api/privacy', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(privacyData),
      });
      if (res.ok) {
        showNotif('success', 'تم حفظ سياسة الخصوصية بنجاح ✓');
      } else {
        showNotif('error', 'فشل حفظ سياسة الخصوصية');
      }
    } catch {
      showNotif('error', 'خطأ في الاتصال');
    }
    setPrivacyLoading(false);
  }

  function updatePrivacySection(branch: 'designPrivacy' | 'studioPrivacy', index: number, field: 'title' | 'content', value: string) {
    setPrivacyData(prev => {
      const updated = { ...prev };
      const sections = [...updated[branch]];
      sections[index] = { ...sections[index], [field]: value };
      updated[branch] = sections;
      return updated;
    });
  }

  function addPrivacySection(branch: 'designPrivacy' | 'studioPrivacy') {
    setPrivacyData(prev => {
      const updated = { ...prev };
      updated[branch] = [...updated[branch], { title: '', content: '' }];
      return updated;
    });
  }

  async function handleAddOption(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOptionLoading(true);
    try {
      const res = await fetch('/api/custom-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: optionName, price: optionPrice, category: optionCategory, description: optionDesc, imageUrl: optionImage || undefined }),
      });
      if (res.ok) {
        showNotif('success', 'تمت إضافة الخيار بنجاح ✓');
        setOptionName(''); setOptionPrice(0); setOptionCategory(''); setOptionDesc(''); setOptionImage('');
        router.refresh();
      } else {
        showNotif('error', 'فشل إضافة الخيار');
      }
    } catch {
      showNotif('error', 'خطأ في الاتصال');
    }
    setOptionLoading(false);
  }

  async function handleEditOption(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingOption) return;
    setOptionLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/custom-options', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingOption.id,
          name: formData.get('name'),
          price: Number(formData.get('price')),
          category: formData.get('category'),
          description: formData.get('description'),
          imageUrl: formData.get('imageUrl') || undefined,
        }),
      });
      if (res.ok) {
        showNotif('success', 'تم تعديل الخيار بنجاح ✓');
        setEditingOption(null);
        router.refresh();
      } else {
        showNotif('error', 'فشل تعديل الخيار');
      }
    } catch {
      showNotif('error', 'خطأ في الاتصال');
    }
    setOptionLoading(false);
  }

  async function handleDeleteOption(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذا الخيار؟')) return;
    try {
      const res = await fetch('/api/custom-options', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        showNotif('success', 'تم حذف الخيار بنجاح');
        router.refresh();
      }
    } catch {}
  }

  async function handleUpdateOrderStatus(id: string, status: Order['status']) {
    try {
      const res = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        showNotif('success', 'تم تحديث حالة الطلب ✓');
        router.refresh();
      }
    } catch {}
  }

  function removePrivacySection(branch: 'designPrivacy' | 'studioPrivacy', index: number) {
    setPrivacyData(prev => {
      const updated = { ...prev };
      updated[branch] = updated[branch].filter((_, i) => i !== index);
      return updated;
    });
  }

  function removeTermsSection(branch: 'designTerms' | 'studioTerms', index: number) {
    setTermsData(prev => {
      const updated = { ...prev };
      updated[branch] = updated[branch].filter((_, i) => i !== index);
      return updated;
    });
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

  async function handleAddFAQ(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFaqLoading(true);
    try {
      const res = await fetch('/api/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: faqQuestion, answer: faqAnswer }),
      });
      if (res.ok) {
        setFaqQuestion('');
        setFaqAnswer('');
        showNotif('success', 'تمت إضافة السؤال بنجاح ✓');
        router.refresh();
      } else {
        showNotif('error', 'فشل الإضافة');
      }
    } catch {
      showNotif('error', 'خطأ في الاتصال');
    }
    setFaqLoading(false);
  }

  async function handleEditFAQ(faq: FAQItem) {
    setEditingFaq(faq);
    setFaqQuestion(faq.question);
    setFaqAnswer(faq.answer);
  }

  async function handleUpdateFAQ(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingFaq) return;
    setFaqLoading(true);
    try {
      const res = await fetch('/api/faqs', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingFaq.id, question: faqQuestion, answer: faqAnswer }),
      });
      if (res.ok) {
        setEditingFaq(null);
        setFaqQuestion('');
        setFaqAnswer('');
        showNotif('success', 'تم تعديل السؤال بنجاح ✓');
        router.refresh();
      }
    } catch {
      showNotif('error', 'خطأ في الاتصال');
    }
    setFaqLoading(false);
  }

  async function handleDeleteFAQ(id: string) {
    if (!confirm('هل أنت متأكد من حذف هذا السؤال؟')) return;
    try {
      const res = await fetch(`/api/faqs?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showNotif('success', 'تم حذف السؤال بنجاح');
        router.refresh();
      }
    } catch {}
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
            <h1 className="text-4xl font-black text-brand-brown dark:text-brand-gold">لوحة التحكم</h1>
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
            <p className="text-4xl font-black text-brand-brown dark:text-brand-gold">{initialPackages.length}</p>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
            <p className="text-foreground/60 text-sm font-bold mb-1">إجمالي التقييمات</p>
            <p className="text-4xl font-black text-brand-gold">
              {initialPackages.reduce((sum, p) => sum + (p.reviews?.length || 0), 0)}
            </p>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
            <p className="text-foreground/60 text-sm font-bold mb-1">متوسط السعر</p>
            <p className="text-4xl font-black text-brand-brown dark:text-brand-gold">
              ${initialPackages.length > 0 ? Math.round(initialPackages.reduce((sum, p) => sum + (parseFloat(p.price as string) || 0), 0) / initialPackages.length) : 0}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-surface border border-border rounded-2xl p-1.5 w-fit flex-wrap">
          {([['packages', 'الباقات', PackageOpen], ['reviews', 'التقييمات', Star], ['projects', 'المشاريع', Lightbulb], ['terms', 'الشروط', FileText], ['privacy', 'الخصوصية', Shield], ['custom_options', 'خيارات التخصيص', ShoppingCart], ['orders', 'الطلبات', ClipboardList], ['faqs', 'الأسئلة الشائعة', HelpCircle]] as const).map(([key, label, Icon]) => (
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
              <h2 className="text-xl font-black mb-5 flex items-center gap-2 text-brand-brown dark:text-brand-gold">
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
                  <label className="block text-xs font-black mb-1 text-foreground/70 uppercase tracking-wide">السعر (أو الأسعار)</label>
                  <input name="price" type="text" required placeholder="مثال: تبدأ من 50$ - أو 50$ لـ 100$" className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors" />
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
                  className="w-full bg-brand-gold text-brand-beige font-black py-3 rounded-xl hover:brightness-105 transition disabled:opacity-50 mt-2 shadow-md"
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
                        <h3 className="font-black text-base text-brand-brown dark:text-brand-gold">{pkg.title}</h3>
                        <p className="text-sm text-foreground/60 font-medium flex items-center gap-2">
                          {pkg.price}
                          <span className="bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded text-xs font-bold">{pkg.branch === 'design' ? 'Design' : 'Studio'}</span>
                        </p>
                        <p className="text-xs text-foreground/40 mt-0.5">{pkg.reviews?.length || 0} تقييم</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingPackage(pkg)}
                        className="text-brand-gold hover:text-brand-brown transition p-2 rounded-lg hover:bg-brand-gold/10 disabled:opacity-50"
                        title="تعديل الباقة"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        disabled={deleteLoading === pkg.id}
                        className="text-red-400 hover:text-red-600 transition p-2 rounded-lg hover:bg-red-50 disabled:opacity-50"
                        title="حذف الباقة"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
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

        {/* Edit Package Modal */}
        <AnimatePresence>
          {editingPackage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setEditingPackage(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-surface border border-border rounded-3xl p-6 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black text-brand-brown dark:text-brand-gold flex items-center gap-2">
                    <Edit2 className="text-brand-gold" size={20} /> تعديل الباقة
                  </h2>
                  <button onClick={() => setEditingPackage(null)} className="p-2 rounded-full hover:bg-surface-hover transition-colors">
                    <X size={20} />
                  </button>
                </div>
                <form onSubmit={handleEditPackage} className="space-y-3.5">
                  {[
                    { label: 'اسم الباقة', name: 'title', defaultValue: editingPackage.title, type: 'input' },
                    { label: 'وصف مختصر', name: 'shortDescription', defaultValue: editingPackage.shortDescription, type: 'input' },
                  ].map(f => (
                    <div key={f.name}>
                      <label className="block text-xs font-black mb-1 text-foreground/70 uppercase tracking-wide">{f.label}</label>
                      <input name={f.name} defaultValue={f.defaultValue} required className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-black mb-1 text-foreground/70 uppercase tracking-wide">الفرع (Branch)</label>
                    <select name="branch" defaultValue={editingPackage.branch || 'studio'} required className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors">
                      <option value="studio">أستوديو طويق (Studio)</option>
                      <option value="design">طويق للتصميم (Design)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black mb-1 text-foreground/70 uppercase tracking-wide">الوصف الكامل</label>
                    <textarea name="description" defaultValue={editingPackage.description} required rows={3} className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-black mb-1 text-foreground/70 uppercase tracking-wide">السعر (أو الأسعار)</label>
                    <input name="price" type="text" defaultValue={editingPackage.price} required className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-black mb-1 text-foreground/70 uppercase tracking-wide">رابط الصورة الرئيسية</label>
                    <input name="thumbnailUrl" defaultValue={editingPackage.thumbnailUrl} required dir="ltr" className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-left focus:outline-none focus:border-brand-gold transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-black mb-1 text-foreground/70 uppercase tracking-wide">صور إضافية (روابط مفصولة بفاصلة)</label>
                    <textarea name="images" defaultValue={editingPackage.images?.join(', ')} dir="ltr" rows={2} className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-left focus:outline-none focus:border-brand-gold transition-colors resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-black mb-1 text-foreground/70 uppercase tracking-wide">المميزات (كل ميزة في سطر)</label>
                    <textarea name="features" defaultValue={editingPackage.features?.join('\n')} required rows={3} className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors resize-none" />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={loading} className="flex-1 bg-brand-gold text-brand-beige font-black py-3 rounded-xl hover:brightness-105 transition disabled:opacity-50 shadow-md">
                      {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                    </button>
                    <button type="button" onClick={() => setEditingPackage(null)} className="px-6 py-3 rounded-xl border border-border text-foreground font-bold hover:bg-surface-hover transition-colors">
                      إلغاء
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Add Review Form */}
            <div className="lg:col-span-2 bg-surface border border-border rounded-3xl p-6 shadow-xl h-fit">
              <h2 className="text-xl font-black mb-5 flex items-center gap-2 text-brand-brown dark:text-brand-gold">
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
                  className="w-full bg-brand-gold text-brand-beige font-black py-3 rounded-xl hover:brightness-105 transition disabled:opacity-50 shadow-md"
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
                    <div key={review.id} className="bg-surface border border-border rounded-2xl p-5 shadow-sm relative group">
                      <button
                        onClick={() => handleDeleteReview(pkg.id, review.id)}
                        className="absolute top-3 left-3 p-2 bg-red-100 text-red-500 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all"
                        title="حذف التقييم"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-black text-brand-brown dark:text-brand-gold">{review.author}</p>
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
        
        {activeTab === 'terms' && (
          <div className="space-y-8">
            {(['designTerms', 'studioTerms'] as const).map(branch => {
              const label = branch === 'designTerms' ? 'طويق للتصميم (Design)' : 'أستوديو طويق (Studio)';
              const sections = termsData[branch];
              return (
                <div key={branch} className="bg-surface border border-border rounded-3xl p-6 shadow-xl">
                  <h2 className="text-xl font-black mb-5 flex items-center gap-2 text-brand-brown dark:text-brand-gold">
                    <FileText className="text-brand-gold" size={20} /> الشروط والأحكام - {label}
                  </h2>
                  <div className="space-y-4">
                    {sections.map((section, index) => (
                      <div key={index} className="relative border border-border rounded-2xl p-4 bg-background/50">
                        <button
                          onClick={() => removeTermsSection(branch, index)}
                          className="absolute top-3 left-3 p-1.5 bg-red-100 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                          title="حذف البند"
                        >
                          <Trash2 size={14} />
                        </button>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-black mb-1 text-foreground/70">عنوان البند</label>
                            <input
                              value={section.title}
                              onChange={e => updateTermsSection(branch, index, 'title', e.target.value)}
                              className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-black mb-1 text-foreground/70">نص البند</label>
                            <textarea
                              value={section.content}
                              onChange={e => updateTermsSection(branch, index, 'content', e.target.value)}
                              rows={3}
                              className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => addTermsSection(branch)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-border text-foreground/60 hover:text-brand-gold hover:border-brand-gold transition-colors text-sm font-bold"
                    >
                      <Plus size={16} /> إضافة بند جديد
                    </button>
                  </div>
                </div>
              );
            })}
            <div className="flex justify-center">
              <button
                onClick={handleSaveTerms}
                disabled={termsLoading}
                className="px-10 py-3.5 bg-brand-gold text-brand-beige font-black rounded-xl hover:brightness-105 transition disabled:opacity-50 shadow-md text-lg"
              >
                {termsLoading ? 'جاري الحفظ...' : 'حفظ جميع التغييرات'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-8">
            {(['designPrivacy', 'studioPrivacy'] as const).map(branch => {
              const label = branch === 'designPrivacy' ? 'طويق للتصميم (Design)' : 'أستوديو طويق (Studio)';
              const sections = privacyData[branch];
              return (
                <div key={branch} className="bg-surface border border-border rounded-3xl p-6 shadow-xl">
                  <h2 className="text-xl font-black mb-5 flex items-center gap-2 text-brand-brown dark:text-brand-gold">
                    <Shield className="text-brand-gold" size={20} /> سياسة الخصوصية - {label}
                  </h2>
                  <div className="space-y-4">
                    {sections.map((section, index) => (
                      <div key={index} className="relative border border-border rounded-2xl p-4 bg-background/50">
                        <button
                          onClick={() => removePrivacySection(branch, index)}
                          className="absolute top-3 left-3 p-1.5 bg-red-100 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                          title="حذف البند"
                        >
                          <Trash2 size={14} />
                        </button>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-black mb-1 text-foreground/70">عنوان البند</label>
                            <input
                              value={section.title}
                              onChange={e => updatePrivacySection(branch, index, 'title', e.target.value)}
                              className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-black mb-1 text-foreground/70">نص البند</label>
                            <textarea
                              value={section.content}
                              onChange={e => updatePrivacySection(branch, index, 'content', e.target.value)}
                              rows={3}
                              className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => addPrivacySection(branch)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-border text-foreground/60 hover:text-brand-gold hover:border-brand-gold transition-colors text-sm font-bold"
                    >
                      <Plus size={16} /> إضافة بند جديد
                    </button>
                  </div>
                </div>
              );
            })}
            <div className="flex justify-center">
              <button
                onClick={handleSavePrivacy}
                disabled={privacyLoading}
                className="px-10 py-3.5 bg-brand-gold text-brand-beige font-black rounded-xl hover:brightness-105 transition disabled:opacity-50 shadow-md text-lg"
              >
                {privacyLoading ? 'جاري الحفظ...' : 'حفظ جميع التغييرات'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 bg-surface border border-border rounded-3xl p-6 shadow-xl h-fit">
              <h2 className="text-xl font-black mb-5 flex items-center gap-2 text-brand-brown dark:text-brand-gold">
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

                <button type="submit" disabled={projectLoading} className="w-full mt-4 bg-brand-gold text-brand-beige font-black py-4 rounded-xl hover:bg-brand-beige hover:text-brand-gold transition-colors disabled:opacity-50">
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
                      <p className="font-black text-brand-brown dark:text-brand-gold text-xl">{proj.title}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-bold text-brand-gold">{proj.category}</span>
                        <span className="bg-brand-gold/20 text-brand-gold px-2 py-0.5 rounded text-xs font-bold">{proj.branch === 'design' ? 'Design' : 'Studio'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingProject(proj)}
                        className="text-brand-gold hover:text-brand-brown transition p-2 rounded-lg hover:bg-brand-gold/10"
                        title="تعديل المشروع"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        disabled={deleteLoading === proj.id}
                        className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Edit Project Modal */}
        <AnimatePresence>
          {editingProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setEditingProject(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-surface border border-border rounded-3xl p-6 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black text-brand-brown dark:text-brand-gold flex items-center gap-2">
                    <Edit2 className="text-brand-gold" size={20} /> تعديل المشروع
                  </h2>
                  <button onClick={() => setEditingProject(null)} className="p-2 rounded-full hover:bg-surface-hover transition-colors">
                    <X size={20} />
                  </button>
                </div>
                <form onSubmit={handleEditProject} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-black mb-1 text-foreground/70 uppercase tracking-wide">اسم المشروع</label>
                    <input name="title" defaultValue={editingProject.title} required className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-black mb-1 text-foreground/70 uppercase tracking-wide">التصنيف</label>
                    <select name="category" defaultValue={editingProject.category} required className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors">
                      <option value="برمجة">برمجة</option>
                      <option value="تصميم جرافيك">تصميم جرافيك</option>
                      <option value="3D design">3D design</option>
                      <option value="لوقو">لوقو</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black mb-1 text-foreground/70 uppercase tracking-wide">الفرع (Branch)</label>
                    <select name="branch" defaultValue={editingProject.branch || 'studio'} required className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors">
                      <option value="studio">أستوديو طويق (Studio)</option>
                      <option value="design">طويق للتصميم (Design)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-black mb-1 text-foreground/70 uppercase tracking-wide">الوصف</label>
                    <textarea name="description" defaultValue={editingProject.description} required rows={3} className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-black mb-1 text-foreground/70 uppercase tracking-wide">التقنيات (مفصولة بفاصلة)</label>
                    <input name="tags" defaultValue={editingProject.tags?.join(', ')} required className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-black mb-1 text-foreground/70 uppercase tracking-wide">رابط الصورة الرئيسية</label>
                    <input name="imageUrl" defaultValue={editingProject.imageUrl} dir="ltr" className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-left focus:outline-none focus:border-brand-gold transition-colors" />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={projectLoading} className="flex-1 bg-brand-gold text-brand-beige font-black py-3 rounded-xl hover:brightness-105 transition disabled:opacity-50 shadow-md">
                      {projectLoading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                    </button>
                    <button type="button" onClick={() => setEditingProject(null)} className="px-6 py-3 rounded-xl border border-border text-foreground font-bold hover:bg-surface-hover transition-colors">
                      إلغاء
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {activeTab === 'custom_options' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 bg-surface border border-border rounded-3xl p-6 shadow-xl h-fit">
              <h2 className="text-xl font-black mb-5 flex items-center gap-2 text-brand-brown dark:text-brand-gold">
                <Plus className="text-brand-gold" size={20} /> إضافة خيار تخصيص
              </h2>
              <form onSubmit={handleAddOption} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-black mb-1 text-foreground/70">اسم الخيار</label>
                  <input value={optionName} onChange={e => setOptionName(e.target.value)} required className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-black mb-1 text-foreground/70">السعر ($)</label>
                  <input value={optionPrice} onChange={e => setOptionPrice(Number(e.target.value))} type="number" min="0" required className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-black mb-1 text-foreground/70">التصنيف</label>
                  <input value={optionCategory} onChange={e => setOptionCategory(e.target.value)} required placeholder="مثال: لوقو, صورة متحركة, تصميم" className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-black mb-1 text-foreground/70">الوصف</label>
                  <textarea value={optionDesc} onChange={e => setOptionDesc(e.target.value)} required rows={2} className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-black mb-1 text-foreground/70">رابط صورة (اختياري)</label>
                  <input value={optionImage} onChange={e => setOptionImage(e.target.value)} dir="ltr" className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-left focus:outline-none focus:border-brand-gold transition-colors" />
                </div>
                <button type="submit" disabled={optionLoading} className="w-full bg-brand-gold text-brand-beige font-black py-3 rounded-xl hover:brightness-105 transition disabled:opacity-50 shadow-md">
                  {optionLoading ? 'جاري الحفظ...' : 'إضافة الخيار'}
                </button>
              </form>
            </div>
            <div className="lg:col-span-3">
              <h2 className="text-xl font-black mb-5">خيارات التخصيص ({customOptions.length})</h2>
              <div className="space-y-3">
                {customOptions.map(opt => (
                  <div key={opt.id} className="bg-surface border border-border rounded-2xl p-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-4">
                      {opt.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={opt.imageUrl} alt="" className="w-14 h-14 rounded-xl object-cover" />
                      )}
                      <div>
                        <h3 className="font-black text-sm text-foreground">{opt.name}</h3>
                        <p className="text-xs text-foreground/50">{opt.category} · ${opt.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => setEditingOption(opt)} className="text-brand-gold hover:text-brand-brown transition p-2 rounded-lg hover:bg-brand-gold/10" title="تعديل">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDeleteOption(opt.id)} className="text-red-400 hover:text-red-600 transition p-2 rounded-lg hover:bg-red-50" title="حذف">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
                {customOptions.length === 0 && (
                  <div className="text-center py-16 text-foreground/60 bg-surface rounded-2xl border border-border">
                    <ShoppingCart size={40} className="mx-auto mb-4 opacity-30" />
                    <p className="font-bold">لا توجد خيارات تخصيص مضافة بعد.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Edit Option Modal */}
        <AnimatePresence>
          {editingOption && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
              onClick={() => setEditingOption(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-surface border border-border rounded-3xl p-6 shadow-2xl w-full max-w-lg"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black text-brand-brown dark:text-brand-gold flex items-center gap-2">
                    <Edit2 className="text-brand-gold" size={20} /> تعديل الخيار
                  </h2>
                  <button onClick={() => setEditingOption(null)} className="p-2 rounded-full hover:bg-surface-hover transition-colors">
                    <X size={20} />
                  </button>
                </div>
                <form onSubmit={handleEditOption} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-black mb-1 text-foreground/70">اسم الخيار</label>
                    <input name="name" defaultValue={editingOption.name} required className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-black mb-1 text-foreground/70">السعر ($)</label>
                    <input name="price" type="number" min="0" defaultValue={editingOption.price} required className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-black mb-1 text-foreground/70">التصنيف</label>
                    <input name="category" defaultValue={editingOption.category} required className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-black mb-1 text-foreground/70">الوصف</label>
                    <textarea name="description" defaultValue={editingOption.description} required rows={2} className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold transition-colors resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-black mb-1 text-foreground/70">رابط صورة (اختياري)</label>
                    <input name="imageUrl" defaultValue={editingOption.imageUrl || ''} dir="ltr" className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-left focus:outline-none focus:border-brand-gold transition-colors" />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={optionLoading} className="flex-1 bg-brand-gold text-brand-beige font-black py-3 rounded-xl hover:brightness-105 transition disabled:opacity-50 shadow-md">
                      {optionLoading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                    </button>
                    <button type="button" onClick={() => setEditingOption(null)} className="px-6 py-3 rounded-xl border border-border text-foreground font-bold hover:bg-surface-hover transition-colors">
                      إلغاء
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {activeTab === 'orders' && (
          <div className="space-y-4">
            <h2 className="text-xl font-black mb-5">الطلبات ({orders.length})</h2>
            {orders.length === 0 && (
              <div className="text-center py-16 text-foreground/60 bg-surface rounded-2xl border border-border">
                <ClipboardList size={40} className="mx-auto mb-4 opacity-30" />
                <p className="font-bold">لا توجد طلبات بعد.</p>
              </div>
            )}
            <div className="space-y-4">
              {[...orders].sort((a, b) => b.createdAt - a.createdAt).map(order => (
                <div key={order.id} className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-black text-brand-gold tracking-widest">{order.code}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {order.status === 'pending' ? 'قيد الانتظار' : order.status === 'confirmed' ? 'مؤكد' : 'مكتمل'}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/60">{order.fullName} · {order.discordUsername}</p>
                      <p className="text-xs text-foreground/40">{order.email} · {order.phone}</p>
                    </div>
                    <span className="text-xl font-black text-brand-gold">${order.total}</span>
                  </div>
                  <div className="bg-background/50 rounded-xl p-4 mb-4">
                    <p className="text-xs font-bold text-foreground/50 mb-2">المكونات:</p>
                    <div className="space-y-1">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm text-foreground/70">
                          <span>{item.optionName}</span>
                          <span>${item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {order.status === 'pending' && (
                      <button onClick={() => handleUpdateOrderStatus(order.id, 'confirmed')} className="px-4 py-2 bg-blue-500 text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors">
                        تأكيد الطلب
                      </button>
                    )}
                    {order.status === 'confirmed' && (
                      <button onClick={() => handleUpdateOrderStatus(order.id, 'completed')} className="px-4 py-2 bg-green-500 text-white rounded-xl font-bold text-sm hover:bg-green-600 transition-colors">
                        إكمال الطلب
                      </button>
                    )}
                    <span className="text-xs text-foreground/30 self-center mr-auto">
                      {new Date(order.createdAt).toLocaleString('ar-SA')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'faqs' && (
          <div className="space-y-6">
            <h2 className="text-xl font-black mb-2">الأسئلة الشائعة</h2>
            <form onSubmit={editingFaq ? handleUpdateFAQ : handleAddFAQ} className="bg-surface border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <div>
                <label className="block text-xs font-black mb-1.5 text-foreground/70">السؤال</label>
                <input value={faqQuestion} onChange={e => setFaqQuestion(e.target.value)} required className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors" placeholder="أدخل السؤال" />
              </div>
              <div>
                <label className="block text-xs font-black mb-1.5 text-foreground/70">الإجابة</label>
                <textarea value={faqAnswer} onChange={e => setFaqAnswer(e.target.value)} required rows={3} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors resize-none" placeholder="أدخل الإجابة" />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={faqLoading} className="flex-1 bg-brand-gold text-brand-beige font-black py-3 rounded-xl hover:brightness-105 transition disabled:opacity-50 shadow-md">
                  {faqLoading ? 'جاري الحفظ...' : editingFaq ? 'حفظ التعديلات' : 'إضافة سؤال'}
                </button>
                {editingFaq && (
                  <button type="button" onClick={() => { setEditingFaq(null); setFaqQuestion(''); setFaqAnswer(''); }} className="px-6 py-3 rounded-xl border border-border text-foreground font-bold hover:bg-surface-hover transition-colors">
                    إلغاء
                  </button>
                )}
              </div>
            </form>
            <div className="space-y-3">
              {faqs.length === 0 && (
                <div className="text-center py-16 text-foreground/60 bg-surface rounded-2xl border border-border">
                  <HelpCircle size={40} className="mx-auto mb-4 opacity-30" />
                  <p className="font-bold">لا توجد أسئلة بعد.</p>
                </div>
              )}
              {faqs.map(faq => (
                <div key={faq.id} className="bg-surface border border-border rounded-2xl p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground mb-1">{faq.question}</h3>
                      <p className="text-sm text-foreground/60 line-clamp-2">{faq.answer}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => handleEditFAQ(faq)} className="p-2 rounded-lg hover:bg-brand-gold/10 text-brand-gold transition-colors" title="تعديل">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDeleteFAQ(faq.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors" title="حذف">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

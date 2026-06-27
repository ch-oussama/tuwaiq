const fs = require('fs');

const file = 'src/app/admin/AdminDashboard.tsx';
let code = fs.readFileSync(file, 'utf-8');

// 1. Add Edit icon to imports
code = code.replace(/CheckCircle, Lightbulb/, 'CheckCircle, Lightbulb, Edit2, X');

// 2. Add state for editing
code = code.replace(
  'const [projectLoading, setProjectLoading] = useState(false);',
  `const [projectLoading, setProjectLoading] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);`
);

// 3. Add edit and delete methods
let newMethods = `
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
      price: Number(formData.get('price')),
      branch: formData.get('branch'),
      thumbnailUrl: formData.get('thumbnailUrl'),
      images: (formData.get('images') as string).split(',').map(s => s.trim()).filter(s => s),
      features: (formData.get('features') as string).split('\\n').map(s => s.trim()).filter(s => s),
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
`;

code = code.replace(
  'async function handleLogout() {',
  `${newMethods}\n  async function handleLogout() {`
);

// 4. Inject Delete button in Reviews list
// Current:
// <div key={idx} className="bg-white/5 border border-[#5c1a16]/20 p-4 rounded-xl flex flex-col gap-3">
// <Star size={16} fill="currentColor" color="#D4AF37" />
code = code.replace(
  /<div key={idx} className="bg-white\/5 border border-\[#5c1a16\]\/20 p-4 rounded-xl flex flex-col gap-3">/g,
  '<div key={idx} className="bg-white/5 border border-[#5c1a16]/20 p-4 rounded-xl flex flex-col gap-3 relative"><button onClick={() => handleDeleteReview(pkg.id, rev.id)} className="absolute top-4 left-4 text-red-500 hover:text-red-400 p-2"><Trash2 size={16} /></button>'
);

// 5. Inject Edit button to Packages
code = code.replace(
  /<button\s+onClick=\{\(\) => handleDelete\(pkg.id\)\}\s+className="p-3 bg-red-500\/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-colors"\s+disabled=\{deleteLoading === pkg.id\}\s+>\s+<Trash2 size=\{20\} \/>\s+<\/button>/,
  `<button onClick={() => setEditingPackage(pkg)} className="p-3 bg-[#D4AF37]/10 text-[#D4AF37] rounded-xl hover:bg-[#D4AF37] hover:text-white transition-colors">
                            <Edit2 size={20} />
                          </button>
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
                        disabled={deleteLoading === pkg.id}
                      >
                        <Trash2 size={20} />
                      </button>`
);

// 6. Inject Edit button to Projects
code = code.replace(
  /<button\s+onClick=\{\(\) => handleDeleteProject\(proj.id\)\}\s+className="p-3 bg-red-500\/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-colors"\s+disabled=\{deleteLoading === proj.id\}\s+>\s+<Trash2 size=\{20\} \/>\s+<\/button>/,
  `<button onClick={() => setEditingProject(proj)} className="p-3 bg-[#D4AF37]/10 text-[#D4AF37] rounded-xl hover:bg-[#D4AF37] hover:text-white transition-colors">
                            <Edit2 size={20} />
                          </button>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
                        disabled={deleteLoading === proj.id}
                      >
                        <Trash2 size={20} />
                      </button>`
);

// 7. Inject Modals for editing at the end of the main container, right before </main>
let editModals = `
      {/* ─── MODALS ─── */}
      <AnimatePresence>
        {editingPackage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
            <div className="bg-[#111] max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-3xl p-8 border border-white/10 relative">
              <button onClick={() => setEditingPackage(null)} className="absolute top-6 left-6 text-white/50 hover:text-white"><X size={24} /></button>
              <h2 className="text-3xl font-black text-[#f5ecd8] mb-8">تعديل الباقة</h2>
              
              <form onSubmit={handleEditPackage} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[#f5ecd8]/70 mb-2">اسم الباقة</label>
                    <input type="text" name="title" required defaultValue={editingPackage.title} className="w-full bg-white/5 border border-white/10 text-[#f5ecd8] rounded-xl px-4 py-3 focus:outline-none focus:border-[#5c1a16]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#f5ecd8]/70 mb-2">السعر ($)</label>
                    <input type="number" name="price" required defaultValue={editingPackage.price} className="w-full bg-white/5 border border-white/10 text-[#f5ecd8] rounded-xl px-4 py-3 focus:outline-none focus:border-[#5c1a16]" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-[#f5ecd8]/70 mb-2">فرع الباقة (القسم)</label>
                    <select name="branch" defaultValue={editingPackage.branch || 'design'} className="w-full bg-[#111] border border-white/10 text-[#f5ecd8] rounded-xl px-4 py-3 focus:outline-none focus:border-[#5c1a16]">
                      <option value="design">طويق ديزاين</option>
                      <option value="studio">طويق ستوديو</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-[#f5ecd8]/70 mb-2">وصف قصير</label>
                    <input type="text" name="shortDescription" required defaultValue={editingPackage.shortDescription} className="w-full bg-white/5 border border-white/10 text-[#f5ecd8] rounded-xl px-4 py-3 focus:outline-none focus:border-[#5c1a16]" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-[#f5ecd8]/70 mb-2">وصف كامل</label>
                    <textarea name="description" rows={3} required defaultValue={editingPackage.description} className="w-full bg-white/5 border border-white/10 text-[#f5ecd8] rounded-xl px-4 py-3 focus:outline-none focus:border-[#5c1a16]" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-[#f5ecd8]/70 mb-2">رابط الصورة المصغرة (Thumbnail)</label>
                    <input type="url" name="thumbnailUrl" required defaultValue={editingPackage.thumbnailUrl} className="w-full bg-white/5 border border-white/10 text-[#f5ecd8] rounded-xl px-4 py-3 focus:outline-none focus:border-[#5c1a16]" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-[#f5ecd8]/70 mb-2">روابط الصور (مفصولة بفاصلة)</label>
                    <textarea name="images" rows={3} required defaultValue={editingPackage.images.join(', ')} className="w-full bg-white/5 border border-white/10 text-[#f5ecd8] rounded-xl px-4 py-3 focus:outline-none focus:border-[#5c1a16]" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-[#f5ecd8]/70 mb-2">المميزات (كل ميزة في سطر)</label>
                    <textarea name="features" rows={5} required defaultValue={editingPackage.features.join('\\n')} className="w-full bg-white/5 border border-white/10 text-[#f5ecd8] rounded-xl px-4 py-3 focus:outline-none focus:border-[#5c1a16]" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-[#f5ecd8] text-[#5c1a16] font-black py-4 rounded-xl hover:bg-white transition-colors">
                  {loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {editingProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
            <div className="bg-[#111] max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-3xl p-8 border border-white/10 relative">
              <button onClick={() => setEditingProject(null)} className="absolute top-6 left-6 text-white/50 hover:text-white"><X size={24} /></button>
              <h2 className="text-3xl font-black text-[#f5ecd8] mb-8">تعديل المشروع</h2>
              
              <form onSubmit={handleEditProject} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-[#f5ecd8]/70 mb-2">عنوان المشروع</label>
                    <input type="text" name="title" required defaultValue={editingProject.title} className="w-full bg-white/5 border border-white/10 text-[#f5ecd8] rounded-xl px-4 py-3 focus:outline-none focus:border-[#5c1a16]" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#f5ecd8]/70 mb-2">التصنيف</label>
                    <input type="text" name="category" required defaultValue={editingProject.category} className="w-full bg-white/5 border border-white/10 text-[#f5ecd8] rounded-xl px-4 py-3 focus:outline-none focus:border-[#5c1a16]" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-[#f5ecd8]/70 mb-2">فرع المشروع (القسم)</label>
                    <select name="branch" defaultValue={editingProject.branch || 'design'} className="w-full bg-[#111] border border-white/10 text-[#f5ecd8] rounded-xl px-4 py-3 focus:outline-none focus:border-[#5c1a16]">
                      <option value="design">طويق ديزاين</option>
                      <option value="studio">طويق ستوديو</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-[#f5ecd8]/70 mb-2">وصف المشروع</label>
                    <textarea name="description" rows={3} required defaultValue={editingProject.description} className="w-full bg-white/5 border border-white/10 text-[#f5ecd8] rounded-xl px-4 py-3 focus:outline-none focus:border-[#5c1a16]" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-[#f5ecd8]/70 mb-2">رابط الصورة الرئيسية</label>
                    <input type="url" name="imageUrl" required defaultValue={editingProject.imageUrl} className="w-full bg-white/5 border border-white/10 text-[#f5ecd8] rounded-xl px-4 py-3 focus:outline-none focus:border-[#5c1a16]" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-[#f5ecd8]/70 mb-2">العلامات (Tags) مفصولة بفاصلة</label>
                    <input type="text" name="tags" required defaultValue={editingProject.tags.join(', ')} className="w-full bg-white/5 border border-white/10 text-[#f5ecd8] rounded-xl px-4 py-3 focus:outline-none focus:border-[#5c1a16]" />
                  </div>
                </div>
                <button type="submit" disabled={projectLoading} className="w-full bg-[#f5ecd8] text-[#5c1a16] font-black py-4 rounded-xl hover:bg-white transition-colors">
                  {projectLoading ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
`;
code = code.replace(
  '    </main>\n  );\n}',
  `${editModals}\n    </main>\n  );\n}`
);

fs.writeFileSync(file, code);
console.log('Modify complete');

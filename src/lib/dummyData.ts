import type { Package, Review, Project } from './db';

export const DUMMY_REVIEWS: (Review & { packageTitle?: string })[] = [
  { id: 'dr1', author: 'محمد الخالدي', rating: 5, content: 'أفضل خدمة رقمية تعاملنا معها على الإطلاق. التسليم في الوقت المحدد وجودة تتجاوز كل التوقعات.', packageTitle: 'باقة التصميم الاحترافي' },
  { id: 'dr2', author: 'نورة السعيد', rating: 5, content: 'تجربة رائعة من البداية للنهاية! الإبداع لا حدود له وسرعة التنفيذ وفّرت علينا أسابيع من العمل.', packageTitle: 'باقة التطوير المتكامل' },
  { id: 'dr3', author: 'فهد المطيري', rating: 5, content: 'فريق عمل محترف جداً وخدمة استثنائية. التواصل سهل والنتائج مبهرة.', packageTitle: 'باقة الهوية البصرية' },
  { id: 'dr4', author: 'سارة الغامدي', rating: 5, content: 'المشروع الذي سلموه يتجاوز توقعاتي تماماً. شكراً لفريق أستوديو طويق على هذا الإبداع.', packageTitle: 'باقة التسويق الرقمي' },
  { id: 'dr5', author: 'عبدالله الحربي', rating: 5, content: 'تعاملت معهم أكثر من مرة، وفي كل مرة نتيجة أفضل من السابقة. أنصح بهم بشدة.', packageTitle: 'باقة التصميم الاحترافي' },
  { id: 'dr6', author: 'ريم القحطاني', rating: 5, content: 'احترافية عالية وأسعار منافسة. قدموا لي هوية بصرية رائعة أحبها كل من رآها.', packageTitle: 'باقة الهوية البصرية' },
];

export const DUMMY_PACKAGES: Package[] = [
  {
    id: 'demo-1',
    title: 'باقة التصميم الاحترافي',
    shortDescription: 'واجهات مستخدم فاخرة تخطف الأنظار',
    description: 'تصميم واجهات مستخدم وتجربة مستخدم (UI/UX) احترافية وعصرية لمختلف التطبيقات والمنصات، مع ضمان أعلى مستوى من الجودة والإبداع.',
    price: 100,
    thumbnailUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=800&auto=format&fit=crop'],
    features: ['تصميم حتى 10 شاشات', 'تسليم الملفات المصدرية', 'مرونة في التعديلات', 'متوافق مع جميع الأجهزة'],
    reviews: [DUMMY_REVIEWS[0], DUMMY_REVIEWS[4]],
  },
  {
    id: 'demo-2',
    title: 'باقة التطوير المتكامل',
    shortDescription: 'برمجة منصات ويب وتطبيقات بأحدث التقنيات',
    description: 'برمجة وتطوير منصات إلكترونية متكاملة من الصفر باستخدام أحدث التقنيات وأفضل ممارسات الأداء، لضمان تجربة مستخدم فائقة وسرعة استجابة عالية.',
    price: 300,
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop'],
    features: ['برمجة الواجهات الأمامية والخلفية', 'توافق مع مختلف الأجهزة', 'دعم فني لمدة شهر مجاناً', 'قاعدة بيانات متكاملة'],
    reviews: [DUMMY_REVIEWS[1]],
  },
  {
    id: 'demo-3',
    title: 'باقة الهوية البصرية',
    shortDescription: 'شعار وهوية بصرية تعبّر عن روح مشروعك',
    description: 'تصميم هوية بصرية متكاملة تشمل الشعار والألوان والخطوط والعناصر الجرافيكية التي تعكس شخصية مشروعك وتميزه في السوق.',
    price: 150,
    thumbnailUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=800&auto=format&fit=crop',
    images: [],
    features: ['تصميم شعار احترافي', 'دليل الهوية البصرية', 'تطبيق على مواد التسويق', 'ملفات بجميع الصيغ'],
    reviews: [DUMMY_REVIEWS[2], DUMMY_REVIEWS[5]],
  },
];

export const PROJECTS: Project[] = [
  {
    id: "1",
    title: 'منصة تجارة إلكترونية متكاملة',
    category: 'تطوير ويب',
    description: 'بناء متجر إلكتروني متكامل مع نظام دفع ذكي وإدارة مخزون.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
    tags: ['Next.js', 'Firebase', 'Stripe'],
  },
  {
    id: "2",
    title: 'هوية بصرية لشركة عقارية',
    category: 'تصميم جرافيك',
    description: 'تصميم هوية بصرية راقية تعكس التميز والثقة في قطاع العقارات.',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop',
    tags: ['Branding', 'Figma', 'Illustrator'],
  },
  {
    id: "3",
    title: 'تطبيق مرافق صحي ذكي',
    category: 'UI/UX Design',
    description: 'تجربة مستخدم سلسة لتطبيق يتتبع الصحة اليومية ويقدم توصيات شخصية.',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop',
    tags: ['UI/UX', 'Mobile', 'Research'],
  },
  {
    id: "4",
    title: 'موقع استعراض أعمال إبداعية',
    category: 'تطوير ويب',
    description: 'منصة Behance-style لعرض الأعمال الفنية مع انيميشن متقدم.',
    imageUrl: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800&auto=format&fit=crop',
    tags: ['React', 'Framer Motion', 'GSAP'],
  },
  {
    id: "5",
    title: 'تصميم تطبيق توصيل طعام',
    category: 'UI/UX Design',
    description: 'واجهة بسيطة وأنيقة لتطبيق توصيل يستهدف المستخدم العربي.',
    imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=800&auto=format&fit=crop',
    tags: ['UI Design', 'Prototyping', 'User Testing'],
  },
  {
    id: "6",
    title: 'لوحة تحكم بيانات تفاعلية',
    category: 'تطوير ويب',
    description: 'Dashboard متقدم لتحليل البيانات مع رسوم بيانية ديناميكية.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    tags: ['Vue.js', 'D3.js', 'Analytics'],
  },
];

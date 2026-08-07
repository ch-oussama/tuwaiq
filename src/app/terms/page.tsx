"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import { useBranch } from '@/lib/BranchContext';
import { useLang } from '@/lib/LanguageContext';
import { t } from '@/lib/translations';
import type { TermsData, TermsSection } from '@/lib/db';

const FALLBACK_DESIGN: TermsSection[] = [
  { title: 'مقدمة', content: 'تحكم هذه الشروط والأحكام استخدامك لخدمات Tuwaiq Design. باستخدامك لخدماتنا، فإنك توافق على هذه الشروط بشكل كامل. إذا كنت لا توافق على أي جزء من هذه الشروط، فيجب عليك عدم استخدام خدماتنا.' },
  { title: 'الملكية الفكرية', content: 'جميع التصاميم والهويات البصرية والشعارات والمواد الإبداعية المقدمة من Tuwaiq Design تبقى ملكيتنا الفكرية حتى يتم استلام الدفعة الكاملة. بعد الدفع الكامل، تُنقل ملكية التصاميم النهائية إليك مع احتفاظنا بالحق في عرضها في محفظتنا.' },
  { title: 'عملية التصميم والمراجعات', content: 'نتبع عملية تصميم منهجية تشمل: البحث والتحليل، وضع المفاهيم، التطوير، والتنفيذ النهائي. تشمل كل باقة عدداً محدداً من جولات التعديل (2-3 جولات). أي تعديلات إضافية بعد ذلك قد تخضع لرسوم إضافية حسب حجم التعديلات.' },
  { title: 'الدفع والجدول الزمني', content: 'يتم الدفع على دفعات حسب الاتفاق المبدئي (عادة 50% دفعة أولى و50% عند التسليم). تبدأ مدة المشروع بعد استلام الدفعة الأولى وتأكيد الاتفاق. أي تأخير في الدفع قد يؤدي إلى تمديد الجدول الزمني للمشروع.' },
  { title: 'إلغاء الخدمات واسترداد الأموال', content: 'يمكن إلغاء الطلب خلال 7 أيام من بدء المشروع مع استرداد 50% من الدفعة المقدمة. بعد تجاوز هذه الفترة أو بعد بدء مرحلة التنفيذ الفعلي، لا يمكن استرداد الدفعة المقدمة. في حال إلغاء المشروع من طرفنا، يتم استرداد كامل المبلغ المدفوع.' },
  { title: 'السرية وخصوصية البيانات', content: 'نحن نتعامل مع جميع المعلومات والبيانات التي تشاركها معنا بسرية تامة. لا يتم مشاركة أي معلومات خاصة بمشروعك مع أطراف ثالثة دون موافقتك الكتابية. نحن ملتزمون بحماية بياناتك وفقاً لسياسة الخصوصية الخاصة بنا.' },
  { title: 'التعديلات على الشروط', content: 'نحتفظ بالحق في تعديل هذه الشروط والأحكام في أي وقت. سيتم إخطارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو من خلال منصتنا. استمرارك في استخدام خدماتنا بعد التعديلات يعني موافقتك على الشروط المعدلة.' },
];

const FALLBACK_STUDIO: TermsSection[] = [
  { title: 'مقدمة', content: 'تنظم هذه الشروط والأحكام علاقتك مع Tuwaiq Studio فيما يتعلق باستخدام خدماتنا الرقمية. باستخدامك لخدماتنا، فإنك توافق على الالتزام بهذه الشروط. إذا كنت لا توافق، يرجى عدم استخدام خدماتنا.' },
  { title: 'نطاق الخدمات', content: 'نقدم خدمات رقمية متكاملة تشمل تطوير المواقع والتطبيقات، حلول التجارة الإلكترونية، استشارات رقمية، وتسويق إلكتروني. يتم تحديد نطاق العمل بدقة في عرض السعر المقدم قبل بدء أي مشروع.' },
  { title: 'حقوق الملكية الفكرية', content: 'الكود المصدري والمنتجات الرقمية المطورة تبقى ملكاً لـ Tuwaiq Studio حتى استلام الدفعات كاملة. بعد التسليم النهائي والدفع الكامل، تُنقل حقوق الاستخدام التجاري إليك. نحتفظ بحق استخدام الكود العام غير المخصص في مشاريع أخرى.' },
  { title: 'الدفع وبنود التعاقد', content: 'يتم تحديد هيكل الدفع في بداية المشروع. تشمل خيارات الدفع: دفعة أولى بنسبة 50% مع 50% عند التسليم، أو نظام أقساط حسب حجم المشروع. جميع المدفوعات غير قابلة للاسترداد بعد بدء مرحلة التطوير.' },
  { title: 'التسليم والمعايير', content: 'نلتزم بتسليم المشاريع وفقاً للمعايير والمواصفات المتفق عليها. بعد التسليم الأولي، يحق لك فترة اختبار ومراجعة مدتها 14 يوماً. يتم تسليم جميع الملفات والأكواد والتعليمات اللازمة ضمن حزمة التسليم النهائي.' },
  { title: 'الدعم الفني والصيانة', content: 'نوفر فترة دعم فني مجاني لمدة 30 يوماً بعد إطلاق المشروع تشمل إصلاح الأخطاء والمشاكل التقنية. بعد هذه الفترة، يمكن الاشتراك في باقات الصيانة الشهرية المتاحة. الدعم الفني لا يشمل إضافة ميزات جديدة أو تعديلات جوهرية.' },
  { title: 'إلغاء الخدمة', content: 'يمكن إلغاء الاتفاق خلال 14 يوماً من تاريخ التوقيع مع استرداد المبالغ المدفوعة بعد خصم تكاليف العمل المنجز. في حال الإلغاء بعد بدء التطوير، لا يتم استرداد الدفعة المقدمة. يحق لنا إلغاء الخدمة في حال انتهاك الشروط.' },
  { title: 'المسؤولية والضمانات', content: 'نضمن أن خدماتنا ستقدم بمستوى احترافي ومعايير جودة عالية. لا نتحمل المسؤولية عن أي أضرار غير مباشرة أو ناشئة عن استخدام الخدمة. أقصى مسؤولية لنا هي قيمة الخدمة المقدمة.' },
];

export const DEFAULT_TERMS: TermsData = {
  designTerms: FALLBACK_DESIGN,
  studioTerms: FALLBACK_STUDIO,
};

export default function TermsPage() {
  const { branch } = useBranch();
  const { lang } = useLang();
  const [termsData, setTermsData] = useState<TermsData | null>(null);

  useEffect(() => {
    fetch('/api/terms')
      .then(res => res.json())
      .then(data => {
        if (data && data.designTerms && data.studioTerms) {
          setTermsData(data);
        } else {
          setTermsData(DEFAULT_TERMS);
        }
      })
      .catch(() => setTermsData(DEFAULT_TERMS));
  }, []);

  const isDesign = branch === 'design';
  const terms = termsData
    ? (isDesign ? termsData.designTerms : termsData.studioTerms)
    : (isDesign ? FALLBACK_DESIGN : FALLBACK_STUDIO);
  const prefix = 'Tuwaiq';
  const suffix = isDesign ? 'Design' : 'Studio';

  return (
    <div className="min-h-screen relative overflow-hidden pb-32">
      <div className="fixed top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-gold/10 via-background to-background -z-10" />

      <div className="max-w-4xl mx-auto px-6 sm:px-8 pt-12 md:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 bg-brand-gold/10 text-brand-gold rounded-full mb-6">
            <FileText size={32} />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6 tracking-tight">
            {t(lang, 'terms.title')}
          </h1>
          <p className="text-lg text-foreground/70 font-medium max-w-2xl mx-auto">
            {t(lang, 'terms.subtitle')} {prefix} {suffix}.
          </p>
        </motion.div>

        <div className="space-y-6">
          {terms.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass p-6 md:p-8 rounded-3xl border border-border hover:border-brand-gold/50 transition-all duration-300"
            >
              <h2 className="text-xl font-black text-foreground mb-4 flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-brand-gold inline-block" />
                {section.title}
              </h2>
              <p className="text-foreground/70 font-medium leading-relaxed">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

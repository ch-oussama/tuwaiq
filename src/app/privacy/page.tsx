"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { useBranch } from '@/lib/BranchContext';
import { useLang } from '@/lib/LanguageContext';
import { t } from '@/lib/translations';
import type { PrivacyData, TermsSection } from '@/lib/db';

const FALLBACK_DESIGN: TermsSection[] = [
  { title: 'مقدمة', content: 'نحن في Tuwaiq Design نلتزم بحماية خصوصية زوارنا وعملائنا. توضح سياسة الخصوصية هذه كيفية جمع واستخدام وحماية معلوماتك الشخصية عند استخدامك لخدماتنا.' },
  { title: 'المعلومات التي نجمعها', content: 'قد نقوم بجمع المعلومات التالية: الاسم، البريد الإلكتروني، رقم الهاتف، تفاصيل المشروع، وأي معلومات تشاركها معنا ط intentionaly أثناء عملية التعاون. نجمع هذه المعلومات فقط عند تقديمها طواعية من قبلك.' },
  { title: 'كيف نستخدم معلوماتك', content: 'نستخدم معلوماتك لتقديم الخدمات المطلوبة، التواصل معك بخصوص مشروعك، تحسين خدماتنا، وإرسال معلومات ترويجية (بموافقتك). لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة.' },
  { title: 'حماية البيانات', content: 'نتخذ إجراءات أمنية مناسبة لحماية معلوماتك من الوصول غير المصرح به أو التعديل أو الكشف أو الإتلاف. تشمل هذه الإجراءات التشفير وجدران الحماية وبروتوكولات الأمان المحدثة.' },
  { title: 'ملفات تعريف الارتباط (Cookies)', content: 'قد نستخدم ملفات تعريف الارتباط لتحسين تجربتك على موقعنا. يمكنك التحكم في استخدام ملفات تعريف الارتباط من خلال إعدادات المتصفح الخاص بك. نستخدمها لتحليل حركة المرور وتخصيص المحتوى.' },
  { title: 'حقوقك', content: 'لديك الحق في الوصول إلى معلوماتك الشخصية وتصحيحها أو حذفها في أي وقت. يمكنك طلب عدم استخدام معلوماتك لأغراض تسويقية. للاستفسار عن سياسة الخصوصية، يرجى التواصل معنا.' },
  { title: 'التعديلات على السياسة', content: 'نحتفظ بالحق في تحديث سياسة الخصوصية هذه من وقت لآخر. سنقوم بإخطارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو من خلال موقعنا. تاريخ آخر تحديث لهذه السياسة هو بداية العام الحالي.' },
];

const FALLBACK_STUDIO: TermsSection[] = [
  { title: 'مقدمة', content: 'Tuwaiq Studio تضع خصوصية مستخدميها في صدارة أولوياتها. تصف هذه السياسة كيفية جمع ومعالجة وحماية بياناتك الشخصية عند استخدام منصاتنا وخدماتنا الرقمية.' },
  { title: 'البيانات التي نجمعها', content: 'قد نشمل: معلومات الحساب (الاسم، البريد الإلكتروني، رقم الجوال)، بيانات الاستخدام (الصفحات التي تزورها، مدة الزيارة)، معلومات الجهاز (نوع المتصفح، نظام التشغيل)، وأي بيانات تقدمها طواعية.' },
  { title: 'أساس معالجة البيانات', content: 'نقوم بمعالجة بياناتك بناءً على موافقتك، أو لتنفيذ عقد، أو للالتزام بالتزام قانوني، أو للمصالح المشروعة لتطوير خدماتنا وتحسين تجربة المستخدم.' },
  { title: 'مشاركة البيانات', content: 'قد نشارك بياناتك مع مزودي الخدمات الموثوقين (مثل منصات الاستضافة ومعالجة الدفع) بموجب اتفاقيات تضمن حماية بياناتك. لا نبيع بياناتك الشخصية لأي طرف ثالث.' },
  { title: 'الأمان والتشفير', content: 'نستخدم أحدث تقنيات التشفير (SSL/TLS) وبروتوكولات الأمان لحماية بياناتك أثناء النقل والتخزين. نطبق إجراءات صارمة للتحكم في الوصول ومراجعة أمنية دورية.' },
  { title: 'الاحتفاظ بالبيانات', content: 'نحتفظ ببياناتك للمدة اللازمة لتحقيق الأغراض الموضحة في هذه السياسة، أو للمدة التي يطلبها القانون. عندما لا تعود هناك حاجة لبياناتك، نقوم بحذفها أو إخفاء هويتها بشكل آمن.' },
  { title: 'حقوقك القانونية', content: 'لديك الحق في الوصول إلى بياناتك، تصحيحها، حذفها، تقييد معالجتها، الاعتراض على المعالجة، ونقل البيانات. يمكنك ممارسة هذه الحقوق بالتواصل معنا عبر قنواتنا الرسمية.' },
  { title: 'التعديلات والتواصل', content: 'قد نقوم بتحديث هذه السياسة دورياً. سنبلغك بالتغييرات الجوهرية عبر البريد الإلكتروني أو إشعار على المنصة. للاستفسارات، يرجى التواصل مع فريق دعم الخصوصية لدينا.' },
];

export const DEFAULT_PRIVACY: PrivacyData = {
  designPrivacy: FALLBACK_DESIGN,
  studioPrivacy: FALLBACK_STUDIO,
};

export default function PrivacyPage() {
  const { branch } = useBranch();
  const { lang } = useLang();
  const [privacyData, setPrivacyData] = useState<PrivacyData | null>(null);

  useEffect(() => {
    fetch('/api/privacy')
      .then(res => res.json())
      .then(data => {
        if (data && data.designPrivacy && data.studioPrivacy) {
          setPrivacyData(data);
        } else {
          setPrivacyData(DEFAULT_PRIVACY);
        }
      })
      .catch(() => setPrivacyData(DEFAULT_PRIVACY));
  }, []);

  const isDesign = branch === 'design';
  const privacy = privacyData
    ? (isDesign ? privacyData.designPrivacy : privacyData.studioPrivacy)
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
            <Shield size={32} />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-6 tracking-tight">
            {t(lang, 'privacy.title')}
          </h1>
          <p className="text-lg text-foreground/70 font-medium max-w-2xl mx-auto">
            {t(lang, 'privacy.subtitle')} {prefix} {suffix}.
          </p>
        </motion.div>

        <div className="space-y-6">
          {privacy.map((section, index) => (
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

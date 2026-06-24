import Link from 'next/link';
import { DUMMY_PACKAGES } from '@/lib/dummyData';

async function getFooterPackages() {
  try {
    const { getPackages } = await import('@/lib/db');
    const fetched = await getPackages();
    if (fetched.length > 0) return fetched;
  } catch {}
  return DUMMY_PACKAGES;
}

export default async function Footer() {
  const packages = await getFooterPackages();
  
  return (
    <footer style={{ background: '#F0E9DF', borderTop: '1px solid #C8B9B1', marginTop: 80, paddingTop: 48, paddingBottom: 48 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="" className="h-9 w-9 object-contain" />
              <span className="text-xl font-black" style={{ color: '#3E2723' }}>
                Tuwaiq<span style={{ color: '#D4AF37' }}>Studio</span>
              </span>
            </Link>
            <p className="text-sm font-medium" style={{ color: 'rgba(44,24,16,0.65)' }}>
              نقدم لك خدمات رقمية متكاملة بأسلوب استثنائي لتلبية طموحاتك وتحقيق نجاحك في العالم الرقمي.
            </p>
          </div>
          <div>
            <h4 className="text-base font-black mb-4" style={{ color: '#3E2723' }}>روابط سريعة</h4>
            <ul className="space-y-2.5">
              <li><Link href="/#about" scroll={true} className="text-sm font-medium hover:text-brand-gold transition-colors" style={{ color: 'rgba(44,24,16,0.7)' }}>من نحن</Link></li>
              <li><Link href="/packages" className="text-sm font-medium hover:text-brand-gold transition-colors" style={{ color: 'rgba(44,24,16,0.7)' }}>الباقات</Link></li>
              <li><Link href="/projects" className="text-sm font-medium hover:text-brand-gold transition-colors" style={{ color: 'rgba(44,24,16,0.7)' }}>مشاريعنا</Link></li>
              <li><Link href="/#reviews" scroll={true} className="text-sm font-medium hover:text-brand-gold transition-colors" style={{ color: 'rgba(44,24,16,0.7)' }}>آراء العملاء</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-black mb-4" style={{ color: '#3E2723' }}>خدماتنا</h4>
            <ul className="space-y-2.5">
              {packages.slice(0, 3).map((pkg) => (
                <li key={pkg.id}>
                  <Link href={`/packages/${pkg.id}`} className="text-sm font-medium hover:text-brand-gold transition-colors" style={{ color: 'rgba(44,24,16,0.7)' }}>
                    {pkg.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 text-center text-xs font-medium" style={{ borderTop: '1px solid #C8B9B1', color: 'rgba(44,24,16,0.45)' }}>
          © {new Date().getFullYear()} Tuwaiq Studio. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}

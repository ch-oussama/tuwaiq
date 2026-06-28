"use client";

import Link from 'next/link';
import { useBranch } from '@/lib/BranchContext';
import { useLang } from '@/lib/LanguageContext';
import { t } from '@/lib/translations';
import { Package } from '@/lib/db';

const DESIGN_DISCORD_URL = 'https://discord.gg/twq2';
const DESIGN_TWITTER_URL = 'https://x.com/TuwaiqDesgien';
const DESIGN_TIKTOK_URL = 'https://www.tiktok.com/@tuwaiqdesgien';

const STUDIO_DISCORD_URL = 'https://discord.gg/twq2';
const STUDIO_TWITTER_URL = 'https://x.com/TuwaiqStudio';
const STUDIO_TIKTOK_URL = 'https://www.tiktok.com/@tuwaiqstudio';

export default function FooterClient({ packages }: { packages: Package[] }) {
  const { branch } = useBranch();
  const { lang } = useLang();
  
  const isDesign = branch === 'design';

  const titleProps = {
    prefix: 'Tuwaiq',
    suffix: isDesign ? 'Design' : 'Studio',
  };

  const descriptionText = isDesign
    ? t(lang, 'footer.desc_design')
    : t(lang, 'footer.desc_studio');

  const discordUrl = isDesign ? DESIGN_DISCORD_URL : STUDIO_DISCORD_URL;
  const twitterUrl = isDesign ? DESIGN_TWITTER_URL : STUDIO_TWITTER_URL;
  const twitterHandle = isDesign ? '@TuwaiqDesgien' : '@TuwaiqStudio';
  const tiktokUrl = isDesign ? DESIGN_TIKTOK_URL : STUDIO_TIKTOK_URL;

  return (
    <footer className="bg-brand-brown dark:bg-black mt-20 py-12 border-t border-brand-brown-light dark:border-white/10 relative z-10 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={isDesign ? "/logo design.webp" : "/logo.png"} alt={`${titleProps.prefix} ${titleProps.suffix} Logo`} className={`h-9 w-9 object-contain ${isDesign ? 'rounded-full' : 'brightness-0 invert'}`} />
              <span className="text-xl font-black text-[#E6DFD5] dark:text-[#E6DFD5]">
                {titleProps.prefix}<span className="text-brand-gold">{titleProps.suffix}</span>
              </span>
            </Link>
            <p className="text-sm font-medium text-[#E6DFD5]/50 dark:text-[#b3b3b3]/60 leading-relaxed">
              {descriptionText}
            </p>
          </div>
          <div>
            <h4 className="text-base font-black mb-4 text-[#E6DFD5]">{t(lang, 'footer.quick_links')}</h4>
            <ul className="space-y-2.5">
              <li><Link href="/terms" className="text-sm font-medium text-[#E6DFD5]/70 hover:text-brand-gold transition-colors">{t(lang, 'footer.terms')}</Link></li>
              <li><Link href="/privacy" className="text-sm font-medium text-[#E6DFD5]/70 hover:text-brand-gold transition-colors">{t(lang, 'footer.privacy')}</Link></li>
              <li><Link href="/contact" className="text-sm font-medium text-[#E6DFD5]/70 hover:text-brand-gold transition-colors">{t(lang, 'footer.contact_us')}</Link></li>
              <li><Link href="/custom" className="text-sm font-medium text-[#E6DFD5]/70 hover:text-brand-gold transition-colors">{t(lang, 'custom.title')}</Link></li>
              <li><Link href="/#reviews" scroll={true} className="text-sm font-medium text-[#E6DFD5]/70 hover:text-brand-gold transition-colors">{t(lang, 'footer.reviews')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-black mb-4 text-[#E6DFD5]">{t(lang, 'footer.services')}</h4>
            <ul className="space-y-2.5">
              {packages.slice(0, 3).map((pkg) => (
                <li key={pkg.id}>
                  <Link href={`/packages/${pkg.id}`} className="text-sm font-medium text-[#E6DFD5]/70 hover:text-brand-gold transition-colors">
                    {pkg.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-3 border-t border-[#E6DFD5]/10 pt-0">
          <h4 className="text-center text-base font-black mb-0 text-[#E6DFD5]"></h4>
          <div className="flex flex-wrap justify-center gap-4">
          </div>
        </div>
        <div className="mt-0 pt-0 text-center text-xs font-medium text-[#E6DFD5]/40 border-t border-[#E6DFD5]/10"><br></br>
          © {new Date().getFullYear()} {titleProps.prefix} {titleProps.suffix}. {t(lang, 'footer.all_rights')}
        </div>
      </div>
    </footer>
  );
}

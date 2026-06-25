import { getPackageById } from '@/lib/db';
import SinglePackageClient from './SinglePackageClient';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const pkg = await getPackageById(resolvedParams.id);
    if (!pkg) return { title: 'الباقة غير موجودة | TuwaiqStudio' };

    return {
      title: `${pkg.title} | TuwaiqStudio`,
      description: pkg.shortDescription || pkg.description,
      openGraph: {
        siteName: 'TuwaiqStudio',
        title: pkg.title,
        description: pkg.shortDescription || pkg.description,
        images: [{ url: pkg.thumbnailUrl, width: 1200, height: 630 }],
        type: 'website',
      },
      twitter: {
        card: "summary_large_image",
        title: pkg.title,
        description: pkg.shortDescription || pkg.description,
        images: [pkg.thumbnailUrl],
      }
    };
  } catch (e) {
    return { title: 'باقة | TuwaiqStudio' };
  }
}



interface Params {
  params: Promise<{ id: string }>;
}

export default async function SinglePackagePage({ params }: Params) {
  const resolvedParams = await params;
  const pkg = await getPackageById(resolvedParams.id);
  
  if (!pkg) {
    notFound();
  }

  return <SinglePackageClient pkg={pkg} />;
}

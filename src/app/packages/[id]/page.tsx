import { getPackageById } from '@/lib/db';
import SinglePackageClient from './SinglePackageClient';
import { notFound } from 'next/navigation';

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

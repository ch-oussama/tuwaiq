import { Metadata } from 'next';
import { ClientPackageLoader } from './ClientPackageLoader';

export const metadata: Metadata = {
  title: 'باقة | TuwaiqStudio',
};

export default async function SinglePackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ClientPackageLoader id={id} />;
}

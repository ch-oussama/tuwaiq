import { getPackages } from '@/lib/db';
import PackagesClient from './PackagesClient';

export default async function PackagesPage() {
  const packages = await getPackages();
  return <PackagesClient packages={packages} />;
}

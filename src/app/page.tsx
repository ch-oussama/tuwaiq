import { getPackages } from '@/lib/db';
import { DUMMY_PACKAGES } from '@/lib/dummyData';
import HomeClient from './HomeClient';

export default async function Home() {
  let packages = DUMMY_PACKAGES;
  try {
    const fetched = await getPackages();
    if (fetched.length > 0) packages = fetched;
  } catch {}
  return <HomeClient packages={packages} />;
}

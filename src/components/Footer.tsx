import FooterClient from './FooterClient';

async function getFooterPackages() {
  try {
    const { getPackages } = await import('@/lib/db');
    const fetched = await getPackages();
    if (fetched.length > 0) return fetched;
  } catch {}
  return [];
}

export default async function Footer() {
  const packages = await getFooterPackages();
  return <FooterClient packages={packages} />;
}

import { cookies } from 'next/headers';
import AdminDashboard from './AdminDashboard';
import { getPackages, getProjects, getTerms, getPrivacy, getCustomOptions, getOrders } from '@/lib/db';
import { redirect } from 'next/navigation';
import { DUMMY_PACKAGES, PROJECTS as DUMMY_PROJECTS } from '@/lib/dummyData';
import { DEFAULT_TERMS } from '@/app/terms/page';
import { DEFAULT_PRIVACY } from '@/app/privacy/page';

export default async function AdminPage() {
  const session = (await cookies()).get('admin_auth')?.value;

  if (session !== 'true') {
    redirect('/login');
  }

  let packages = DUMMY_PACKAGES;
  let projects = DUMMY_PROJECTS;
  let terms = DEFAULT_TERMS;
  let privacy = DEFAULT_PRIVACY;
  let customOptions: any[] = [];
  let orders: any[] = [];

  try {
    const fetchedPackages = await getPackages();
    if (fetchedPackages?.length > 0) packages = fetchedPackages;
    
    const fetchedProjects = await getProjects();
    if (fetchedProjects?.length > 0) projects = fetchedProjects;

    const fetchedTerms = await getTerms();
    if (fetchedTerms?.designTerms?.length && fetchedTerms?.studioTerms?.length) terms = fetchedTerms;

    const fetchedPrivacy = await getPrivacy();
    if (fetchedPrivacy?.designPrivacy?.length && fetchedPrivacy?.studioPrivacy?.length) privacy = fetchedPrivacy;

    customOptions = await getCustomOptions();
    orders = await getOrders();
  } catch (error) {
    console.error("Firebase fetch error, falling back to dummy data", error);
  }
  
  return <AdminDashboard initialPackages={packages} initialProjects={projects} initialTerms={terms} initialPrivacy={privacy} initialCustomOptions={customOptions} initialOrders={orders} />;
}

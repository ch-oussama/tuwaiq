import { cookies } from 'next/headers';
import AdminDashboard from './AdminDashboard';
import { getPackages, getProjects } from '@/lib/db';
import { redirect } from 'next/navigation';
import { DUMMY_PACKAGES, PROJECTS as DUMMY_PROJECTS } from '@/lib/dummyData';

export default async function AdminPage() {
  const session = (await cookies()).get('admin_auth')?.value;

  if (session !== 'true') {
    redirect('/login');
  }

  let packages = DUMMY_PACKAGES;
  let projects = DUMMY_PROJECTS;

  try {
    const fetchedPackages = await getPackages();
    if (fetchedPackages?.length > 0) packages = fetchedPackages;
    
    const fetchedProjects = await getProjects();
    if (fetchedProjects?.length > 0) projects = fetchedProjects;
  } catch (error) {
    console.error("Firebase fetch error, falling back to dummy data", error);
  }
  
  return <AdminDashboard initialPackages={packages} initialProjects={projects} />;
}

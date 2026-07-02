import { getPackages, getProjects } from '@/lib/db';
import HomeSwitcherClient from './HomeSwitcherClient';

export default async function Home() {
  let packages: any[] = [];
  let projects: any[] = [];
  
  try {
    const fetchedPackages = await getPackages();
    if (fetchedPackages.length > 0) packages = fetchedPackages;
    
    const fetchedProjects = await getProjects();
    if (fetchedProjects && fetchedProjects.length > 0) {
      projects = fetchedProjects;
    }
  } catch {}

  return <HomeSwitcherClient packages={packages} projects={projects} />;
}

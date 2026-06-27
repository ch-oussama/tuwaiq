import { getPackages, getProjects } from '@/lib/db';
import { DUMMY_PACKAGES, PROJECTS as DUMMY_PROJECTS } from '@/lib/dummyData';
import HomeSwitcherClient from './HomeSwitcherClient';

export default async function Home() {
  let packages = DUMMY_PACKAGES;
  let projects = DUMMY_PROJECTS;
  
  try {
    const fetchedPackages = await getPackages();
    if (fetchedPackages.length > 0) packages = fetchedPackages;
    
    const fetchedProjects = await getProjects();
    if (fetchedProjects && fetchedProjects.length > 0) {
      projects = [...fetchedProjects, ...DUMMY_PROJECTS.filter(d => !fetchedProjects.find(f => f.id === d.id))];
    }
  } catch {}

  return <HomeSwitcherClient packages={packages} projects={projects} />;
}

import { getProjects } from '@/lib/db';
import { PROJECTS as DUMMY_PROJECTS } from '@/lib/dummyData';
import ProjectsClient from './ProjectsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProjectsPage() {
  let projects = DUMMY_PROJECTS;
  try {
    const fetched = await getProjects();
    if (fetched && fetched.length > 0) {
      // Merge: Firestore projects first, then dummy ones that don't clash
      projects = [...fetched, ...DUMMY_PROJECTS.filter(d => !fetched.find(f => f.id === d.id))];
    }
  } catch {}
  
  return <ProjectsClient projects={projects} />;
}

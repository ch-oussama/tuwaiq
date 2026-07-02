import { getProjects } from '@/lib/db';
import ProjectsClient from './ProjectsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProjectsPage() {
  let projects: any[] = [];
  try {
    const fetched = await getProjects();
    if (fetched && fetched.length > 0) {
      projects = fetched;
    }
  } catch {}
  
  return <ProjectsClient projects={projects} />;
}

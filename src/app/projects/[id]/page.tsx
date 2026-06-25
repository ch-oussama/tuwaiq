import ProjectPageClient from './ProjectDetailsClient';
import { Metadata } from 'next';
import { getProjects } from '@/lib/db';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const projects = await getProjects();
    const project = projects.find((p) => p.id === id);
    if (!project) return { title: 'المشروع غير موجود | TuwaiqStudio' };

    return {
      title: `${project.title} | TuwaiqStudio`,
      description: project.description,
      openGraph: {
        siteName: 'TuwaiqStudio',
        title: project.title,
        description: project.description,
        images: [{ url: project.imageUrl, width: 1200, height: 630 }],
        type: 'website',
      },
      twitter: {
        card: "summary_large_image",
        title: project.title,
        description: project.description,
        images: [project.imageUrl],
      }
    };
  } catch (e) {
    return { title: 'مشروع | TuwaiqStudio' };
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProjectPageClient projectId={id} />;
}

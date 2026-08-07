import { Metadata } from 'next';
import { ClientProjectLoader } from './ClientProjectLoader';

export const metadata: Metadata = {
  title: 'مشروع | TuwaiqStudio',
};

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ClientProjectLoader id={id} />;
}

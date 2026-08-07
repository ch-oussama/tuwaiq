"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { Project, getProjects } from "@/lib/db";
import ProjectDetailsClient from "./ProjectDetailsClient";

export function ClientProjectLoader({ id }: { id: string }) {
  const [project, setProject] = useState<Project | undefined | null>(undefined);

  useEffect(() => {
    getProjects().then((projects) => {
      const found = projects.find(p => p.id === id);
      setProject(found ?? null);
    }).catch(() => setProject(null));
  }, [id]);

  if (project === null) notFound();
  if (project === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold" />
      </div>
    );
  }

  return <ProjectDetailsClient projectId={id} />;
}

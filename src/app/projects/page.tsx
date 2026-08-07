"use client";

import { useEffect, useState } from "react";
import ProjectsClient from './ProjectsClient';
import { Project, getProjects } from '@/lib/db';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    getProjects().then(setProjects).catch(() => {});
  }, []);

  return <ProjectsClient projects={projects} />;
}

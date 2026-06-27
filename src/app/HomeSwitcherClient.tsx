"use client";

import { useBranch } from "@/lib/BranchContext";
import HomeClient from "./HomeClient";
import DesignHomeClient from "./DesignHomeClient";
import { Package, Project } from "@/lib/db";

export default function HomeSwitcherClient({ packages, projects }: { packages: Package[], projects: Project[] }) {
  const { branch } = useBranch();

  if (branch === 'design') {
    return <DesignHomeClient packages={packages} projects={projects} />;
  }

  // Default to studio / HomeClient
  return <HomeClient packages={packages} projects={projects} />;
}

"use client";

import { useEffect, useState } from "react";
import { useBranch } from "@/lib/BranchContext";
import HomeClient from "./HomeClient";
import DesignHomeClient from "./DesignHomeClient";
import { Package, Project, getPackages, getProjects } from "@/lib/db";

export default function HomeSwitcherClient() {
  const { branch } = useBranch();
  const [packages, setPackages] = useState<Package[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    getPackages().then(setPackages).catch(() => {});
    getProjects().then(setProjects).catch(() => {});
  }, []);

  if (branch === 'design') {
    return <DesignHomeClient packages={packages} projects={projects} />;
  }

  return <HomeClient packages={packages} projects={projects} />;
}

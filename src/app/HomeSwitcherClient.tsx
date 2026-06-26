"use client";

import { useBranch } from "@/lib/BranchContext";
import HomeClient from "./HomeClient";
import DesignHomeClient from "./DesignHomeClient";
import { Package } from "@/lib/db";

export default function HomeSwitcherClient({ packages }: { packages: Package[] }) {
  const { branch } = useBranch();

  if (branch === 'design') {
    return <DesignHomeClient packages={packages} />;
  }

  // Default to studio / HomeClient
  return <HomeClient packages={packages} />;
}

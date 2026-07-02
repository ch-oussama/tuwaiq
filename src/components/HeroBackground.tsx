"use client";

import { useBranch } from "@/lib/BranchContext";
import { WovenCanvas } from "@/components/ui/woven-light-hero";

export default function HeroBackground() {
  const { branch } = useBranch();

  if (branch !== 'studio') return null;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden opacity-80 pointer-events-none">
      <WovenCanvas />
    </div>
  );
}

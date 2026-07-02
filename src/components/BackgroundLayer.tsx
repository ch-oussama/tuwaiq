"use client";

import { useBranch } from "@/lib/BranchContext";

const bgConfig: Record<string, { image: string; overlay: string }> = {
  studio: { image: "/bg studio.png", overlay: "bg-black/65" },
  design: { image: "/bg design.png", overlay: "bg-[#f5ecd8]/60" },
};

export default function BackgroundLayer() {
  const { branch } = useBranch();
  const cfg = bgConfig[branch ?? 'studio'] || bgConfig.studio;

  return (
    <div className="fixed inset-0 -z-20" aria-hidden>
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('${cfg.image}')` }} />
      <div className={`absolute inset-0 ${cfg.overlay} pointer-events-none`} />
    </div>
  );
}

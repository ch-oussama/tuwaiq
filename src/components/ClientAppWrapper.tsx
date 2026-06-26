"use client";

import { useBranch } from "@/lib/BranchContext";
import BranchGate from "./BranchGate";
import React, { useEffect } from "react";

export default function ClientAppWrapper({ children }: { children: React.ReactNode }) {
  const { branch } = useBranch();

  useEffect(() => {
    if (branch === 'design') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [branch]);

  return (
    <>
      {/* Dynamic Background based on branch selection */}
      {branch === 'studio' && (
        <div 
          className="fixed inset-0 pointer-events-none -z-10" 
          style={{ 
            backgroundImage: 'url(/image.png)', 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat'
          }} 
        />
      )}
      {branch === 'design' && (
        <div 
          className="fixed inset-0 pointer-events-none -z-10" 
          style={{ 
            backgroundImage: "url('/bg design.png')", 
            backgroundSize: 'cover', 
            backgroundPosition: 'center', 
            backgroundAttachment: 'fixed',
            backgroundRepeat: 'no-repeat'
          }} 
        />
      )}

      {/* The Branch Gate interceptor */}
      <BranchGate>
        {children}
      </BranchGate>
    </>
  );
}

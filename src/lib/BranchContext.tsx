"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Branch = "studio" | "design" | null;

interface BranchContextType {
  branch: Branch;
  setBranch: (branch: Branch) => void;
  isHydrated: boolean;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

export function BranchProvider({ children }: { children: ReactNode }) {
  const [branch, setBranchState] = useState<Branch>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const savedBranch = localStorage.getItem("twaq_branch") as Branch;
    if (savedBranch === "studio" || savedBranch === "design") {
      setBranchState(savedBranch);
    }
    setIsHydrated(true);
  }, []);

  const setBranch = (newBranch: Branch) => {
    setBranchState(newBranch);
    if (newBranch) {
      localStorage.setItem("twaq_branch", newBranch);
    } else {
      localStorage.removeItem("twaq_branch");
    }
  };

  return (
    <BranchContext.Provider value={{ branch, setBranch, isHydrated }}>
      {children}
    </BranchContext.Provider>
  );
}

export function useBranch() {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error("useBranch must be used within a BranchProvider");
  }
  return context;
}

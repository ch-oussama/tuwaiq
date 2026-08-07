"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { Package, getPackageById } from "@/lib/db";
import SinglePackageClient from "./SinglePackageClient";

export function ClientPackageLoader({ id }: { id: string }) {
  const [pkg, setPkg] = useState<Package | undefined | null>(undefined);

  useEffect(() => {
    getPackageById(id).then(setPkg).catch(() => setPkg(null));
  }, [id]);

  if (pkg === null) notFound();
  if (pkg === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold" />
      </div>
    );
  }

  return <SinglePackageClient pkg={pkg} />;
}

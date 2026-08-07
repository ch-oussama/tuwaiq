"use client";

import { useEffect, useState } from "react";
import PackagesClient from './PackagesClient';
import { Package, getPackages } from '@/lib/db';

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);

  useEffect(() => {
    getPackages().then(setPackages).catch(() => {});
  }, []);

  return <PackagesClient packages={packages} />;
}

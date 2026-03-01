"use client";

import { WelcomeEmpty, BusinessList } from "@/components/dashboard";
import { useNegocioStore } from "@/lib/store";

export default function DashboardPage() {
  const negocios = useNegocioStore((s) => s.negocios);

  if (negocios.length === 0) {
    return <WelcomeEmpty />;
  }

  return <BusinessList />;
}

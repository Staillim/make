"use client";

import { WelcomeEmpty, BusinessList } from "@/components/dashboard";
import { useNegocios } from "@/lib/hooks";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui";

export default function DashboardPage() {
  const { negocios, loading, error, recargarNegocios } = useNegocios();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-zinc-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="text-lg">Cargando dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
          Error al cargar el dashboard
        </h2>
        <p className="text-zinc-500 mb-6 max-w-md">
          {error}
        </p>
        <Button onClick={recargarNegocios} variant="outline">
          <RefreshCw className="w-4 h-4" />
          Reintentar
        </Button>
      </div>
    );
  }

  if (negocios.length === 0) {
    return <WelcomeEmpty />;
  }

  return <BusinessList />;
}

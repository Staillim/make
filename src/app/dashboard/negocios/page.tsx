"use client";

import { useState } from "react";
import { useNegocios } from "@/lib/hooks";
import { useAuth } from "@/lib/context/AuthContext";
import { Button } from "@/components/ui";
import { 
  Plus, 
  Store, 
  Globe, 
  Calendar,
  MoreVertical,
  Edit3,
  Trash2,
  ExternalLink,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import Link from "next/link";

export default function NegociosPage() {
  const { user } = useAuth();
  const { negocios, loading, error, eliminarNegocio, recargarNegocios } = useNegocios();
  const [eliminando, setEliminando] = useState<string | null>(null);

  const handleEliminar = async (id: string, nombre: string) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar "${nombre}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    setEliminando(id);
    const success = await eliminarNegocio(id);
    setEliminando(null);
    
    if (success) {
      await recargarNegocios();
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'en_configuracion':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'pausado':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'Activo';
      case 'en_configuracion':
        return 'En configuración';
      case 'pausado':
        return 'Pausado';
      default:
        return estado;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-zinc-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="text-lg">Cargando negocios...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
          Error al cargar negocios
        </h2>
        <p className="text-zinc-500 mb-6 max-w-md">{error}</p>
        <Button 
          onClick={recargarNegocios}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Reintentar
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
            Mis Negocios
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Gestiona todos tus negocios autónomos desde aquí
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/dashboard/negocio/nuevo">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Crear Negocio
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center">
            <Store className="w-8 h-8 text-indigo-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Total Negocios
              </p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                {negocios.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center">
            <Globe className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Activos
              </p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                {negocios.filter(n => n.estado === 'activo').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                En Configuración
              </p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                {negocios.filter(n => n.estado === 'en_configuracion').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Negocios */}
      {negocios.length === 0 ? (
        <div className="text-center py-12">
          <Store className="w-16 h-16 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">
            No tienes negocios creados
          </h3>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">
            Crea tu primer negocio autónomo para empezar a vender
          </p>
          <Link href="/dashboard/negocio/nuevo">
            <Button className="flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4" />
              Crear Mi Primer Negocio
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-lg font-medium text-zinc-900 dark:text-white">
              Lista de Negocios
            </h2>
          </div>
          
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {negocios.map((negocio) => (
              <div key={negocio.id_negocio} className="p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-zinc-900 dark:text-white">
                        {negocio.nombre}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(negocio.estado)}`}>
                        {getEstadoTexto(negocio.estado)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-zinc-500 dark:text-zinc-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Creado: {new Date(negocio.fecha_creacion).toLocaleDateString()}
                      </div>
                      {negocio.url_tienda && (
                        <div className="flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          <a 
                            href={negocio.url_tienda} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            Ver Tienda
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {negocio.url_tienda && (
                      <a
                        href={negocio.url_tienda}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-sm text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ver
                      </a>
                    )}
                    
                    <Link href={`/dashboard/negocio/${negocio.id_negocio}/editar`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Edit3 className="w-4 h-4" />
                        Editar
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEliminar(negocio.id_negocio, negocio.nombre || "Sin nombre")}
                      disabled={eliminando === negocio.id_negocio}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                      {eliminando === negocio.id_negocio ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                      Eliminar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
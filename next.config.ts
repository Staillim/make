import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tipos encendidos: queremos que el build falle si hay errores TS.
  // Antes estaba ignoreBuildErrors:true y eso ocultaba regresiones reales.
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;

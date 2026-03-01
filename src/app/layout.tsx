import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Maket AI — Crea tu negocio autónomo con IA",
  description:
    "Construye, vende y administra tu negocio online con 3 agentes de inteligencia artificial. Sin código, sin complicaciones.",
  keywords: ["negocio", "IA", "e-commerce", "agentes", "tienda online"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}

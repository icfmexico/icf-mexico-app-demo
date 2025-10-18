// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PrintBrand from "@/components/PrintBrand";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: `${BRAND.title} — Calculadoras`,
  description:
    "Calculadoras de Muros ICF, Makros, Joists y SteelFoam con exportación a PDF.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        {/* Encabezado que solo aparece al imprimir */}
        <PrintBrand />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

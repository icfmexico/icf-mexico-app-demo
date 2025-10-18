"use client";
import Link from "next/link";

const BRAND = {
  blue: "#0A1D4D",
  red: "#C1121F",
};

function Card({
  href,
  title,
  desc,
}: {
  href: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="no-underline group rounded-2xl border border-gray-200 p-6 bg-white shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5"
    >
      <h2
        className="font-extrabold text-xl"
        style={{ color: BRAND.blue }}
      >
        {title}
      </h2>
      <p className="text-sm text-gray-600 mt-2 group-hover:text-gray-700">
        {desc}
      </p>
      <div
        className="mt-4 h-1 w-0 group-hover:w-16 transition-all rounded-full"
        style={{ backgroundColor: BRAND.red }}
      />
    </Link>
  );
}

export default function HomePage() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-14">
      {/* Hero */}
      <div className="text-center space-y-4 mb-10">
        <h1
          className="text-4xl md:text-5xl font-black tracking-tight"
          style={{ color: BRAND.blue }}
        >
          ICF MEXICO
        </h1>
        <p className="text-base md:text-lg text-gray-700">
          Calculadoras para sistemas ICF — Muros, Makros, Joists y SteelFoam.
          Construye <strong>más fuerte</strong>, <strong>más eficiente</strong> y <strong>más inteligente</strong>.
        </p>
      </div>

      {/* Grid de tarjetas */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Card
          href="/(calculadoras)/muros"
          title="Muros ICF"
          desc="Calcula materiales y concreto para Screen-Grid (Post & Beam) o Pared Sólida."
        />
        <Card
          href="/(calculadoras)/makros"
          title="Makros"
          desc='Calculadora de losas/techos Makros con peraltes 4", 5.5" y 7".'
        />
        <Card
          href="/(calculadoras)/joists"
          title="Joists"
          desc="Cálculo de materiales para losas Joist en 27 cm y 32 cm."
        />
        <Card
          href="/(calculadoras)/steelfoam"
          title="SteelFoam"
          desc="Cálculo de paneles SteelFoam en peraltes 25 cm y 30 cm."
        />
      </div>

      
    </main>
  );
}

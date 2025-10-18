"use client";
import { useMemo, useState } from "react";
import {
  MAKROS_PERALTES,
  type MakrosPeralte,
  MAKROS_SOLID_FRACTION,
  MAKROS_STEEL_KG_M2,
  MAKROS_EPS_FRACTION,
  MAKROS_THICKNESS_M,
  MAKROS_M2_PER_PIEZA,
  r1, r3,
} from "@/lib/tables";

export default function MakrosPage() {
  const [areaM2, setAreaM2] = useState(0);
  const [peralte, setPeralte] = useState<MakrosPeralte>("25 cm");
  const [desperdicio, setDesperdicio] = useState(5);

  const results = useMemo(() => {
    const factor = 1 + desperdicio / 100;

    const t = MAKROS_THICKNESS_M[peralte];           // espesor (m)
    const fSolid = MAKROS_SOLID_FRACTION[peralte];   // fracción sólida
    const fEPS = MAKROS_EPS_FRACTION[peralte];       // fracción EPS
    const kgm2 = MAKROS_STEEL_KG_M2[peralte];        // acero kg/m²

    // Volúmenes por m²
    const concretoPorM2 = t * fSolid; // m³/m²
    const epsPorM2 = t * fEPS;        // m³/m²

    // Totales
    const concretoM3 = r3(areaM2 * concretoPorM2 * factor);
    const aceroKg = r1(areaM2 * kgm2 * factor);
    const epsM3 = r3(areaM2 * epsPorM2 * factor);

    // Piezas requeridas
    const piezas = Math.ceil((areaM2 / MAKROS_M2_PER_PIEZA) * factor);

    return { piezas, concretoM3, aceroKg, epsM3 };
  }, [areaM2, peralte, desperdicio]);

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-6">
      <header>
        <h1 className="text-2xl font-black tracking-tight">MAKROS — Calculadora</h1>
        <p className="text-sm opacity-70">
          Peraltes: 18, 20, 25, 29 y 32 cm (datos centralizados en <code>src/lib/tables.ts</code>)
        </p>
      </header>

      <section className="grid md:grid-cols-2 gap-4">
        {/* Entradas */}
        <div className="rounded-2xl p-4 border space-y-3">
          <label className="text-sm block">
            Área a cubrir (m²)
            <input
              type="number"
              className="mt-1 w-full border rounded-lg p-2"
              value={areaM2}
              onChange={(e) => setAreaM2(Number(e.target.value))}
            />
          </label>

          <label className="text-sm block">
            Peralte
            <select
              className="mt-1 w-full border rounded-lg p-2"
              value={peralte}
              onChange={(e) => setPeralte(e.target.value as MakrosPeralte)}
            >
              {MAKROS_PERALTES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </label>

          <label className="text-sm block">
            Desperdicio (%)
            <input
              type="number"
              className="mt-1 w-full border rounded-lg p-2"
              value={desperdicio}
              onChange={(e) => setDesperdicio(Number(e.target.value))}
            />
          </label>
        </div>

        {/* Resultados */}
        <div className="rounded-2xl p-4 border break-inside-avoid">
          <h2 className="font-bold mb-3">Resultados</h2>
          <ul className="space-y-2 text-sm">
            <li>Piezas / paneles: <strong>{results.piezas}</strong></li>
            <li>Concreto (m³): <strong>{results.concretoM3}</strong></li>
            <li>Acero (kg): <strong>{results.aceroKg}</strong></li>
            <li>EPS (m³): <strong>{results.epsM3}</strong></li>
          </ul>

          <button onClick={() => window.print()} className="no-print mt-4 px-4 py-2 rounded-xl border w-full">
            Imprimir PDF
          </button>
        </div>
      </section>
    </main>
  );
}

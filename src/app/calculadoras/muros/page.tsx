// src/app/calculadoras/muros/page.tsx
'use client';

import { useMemo, useState } from 'react';
import { computeWall } from '@/lib/walls/compute';
import type { WallSystem } from '@/lib/walls/types';
import { TEXTS, type Lang } from '@/i18n/texts';

export default function WallsCalculatorPage() {
  const [lang, setLang] = useState<Lang>('es');
  const T = TEXTS[lang];

  const [system, setSystem] = useState<WallSystem>('screen-grid');
  const [thickness, setThickness] = useState<23 | 27 | 32 | undefined>(27);

  const [length_m, setLength] = useState<string>('10');
  const [height_m, setHeight] = useState<string>('3');
  const [openings_m2, setOpenings] = useState<string>('2');
  const [waste_pct, setWaste] = useState<string>('5');

  const [calcFlag, setCalcFlag] = useState(0);

  const result = useMemo(() => {
    return computeWall({
      system,
      thickness_cm: system === 'solid-wall' ? (thickness ?? 27) : undefined,
      length_m: Number(length_m) || 0,
      height_m: Number(height_m) || 0,
      openings_m2: Number(openings_m2) || 0,
      waste_pct: Number(waste_pct) || 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calcFlag]);

  const onCalculate = () => setCalcFlag((n) => n + 1);

  // 👇 Import dinámico (client-only) para evitar que el server lo cargue
  const onPrint = async () => {
    const { printSectionById } = await import('@/lib/pdf/print');
    printSectionById('results-card', 'ICF MEXICO — Muros');
  };

  return (
    <div className="min-h-[80vh] px-6 py-8 md:px-10 lg:px-14">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-extrabold">{T.title}</h1>
        <button
          className="rounded-xl border px-3 py-1 text-sm hover:bg-gray-100"
          onClick={() => setLang((l) => (l === 'es' ? 'en' : 'es'))}
        >
          {T.lang_toggle}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl border p-4 bg-white/60 dark:bg-neutral-900/40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold">{T.system_label}</span>
              <select
                className="rounded-lg border px-3 py-2"
                value={system}
                onChange={(e) => setSystem(e.target.value as WallSystem)}
              >
                <option value="screen-grid">{T.system_screen}</option>
                <option value="solid-wall">{T.system_solid}</option>
              </select>
            </label>

            {system === 'solid-wall' && (
              <label className="flex flex-col gap-1">
                <span className="text-sm font-semibold">{T.thickness_label}</span>
                <select
                  className="rounded-lg border px-3 py-2"
                  value={thickness ?? 27}
                  onChange={(e) => setThickness(Number(e.target.value) as 23 | 27 | 32)}
                >
                  <option value={23}>{T.thickness_23}</option>
                  <option value={27}>{T.thickness_27}</option>
                  <option value={32}>{T.thickness_32}</option>
                </select>
              </label>
            )}

            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold">{T.length_label}</span>
              <input
                type="number"
                inputMode="decimal"
                className="rounded-lg border px-3 py-2"
                value={length_m}
                onChange={(e) => setLength(e.target.value)}
                min={0}
                step="0.01"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold">{T.height_label}</span>
              <input
                type="number"
                inputMode="decimal"
                className="rounded-lg border px-3 py-2"
                value={height_m}
                onChange={(e) => setHeight(e.target.value)}
                min={0}
                step="0.01"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold">{T.openings_label}</span>
              <input
                type="number"
                inputMode="decimal"
                className="rounded-lg border px-3 py-2"
                value={openings_m2}
                onChange={(e) => setOpenings(e.target.value)}
                min={0}
                step="0.01"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-semibold">{T.waste_label}</span>
              <input
                type="number"
                inputMode="decimal"
                className="rounded-lg border px-3 py-2"
                value={waste_pct}
                onChange={(e) => setWaste(e.target.value)}
                min={0}
                step="0.5"
              />
            </label>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={onCalculate}
              className="rounded-xl bg-black text-white px-4 py-2 font-semibold hover:opacity-90"
            >
              {T.calc_btn}
            </button>
            <button
              onClick={onPrint}
              className="rounded-xl border px-4 py-2 font-semibold hover:bg-gray-100"
            >
              {T.print_btn}
            </button>
          </div>
        </div>

        <div id="results-card" className="rounded-2xl border p-4 bg-white/80 dark:bg-neutral-900/40">
          <h2 className="text-xl font-bold mb-3">{T.results}</h2>
          <table className="w-full text-sm">
            <tbody>
              <tr><td>{T.gross_area}</td><td>{result.area_gross_m2.toFixed(2)} m²</td></tr>
              <tr><td>{T.net_area}</td><td>{result.area_net_m2.toFixed(2)} m²</td></tr>
              <tr><td>{T.waste_area}</td><td>{result.waste_m2.toFixed(2)} m²</td></tr>
              <tr><td>{T.total_area}</td><td className="font-semibold">{result.area_total_m2.toFixed(2)} m²</td></tr>
              <tr><td>{T.units}</td><td className="font-semibold">{result.units_count}</td></tr>
            </tbody>
          </table>

          {result.notes?.length ? (
            <div className="mt-3 text-xs text-gray-600">
              <div className="font-semibold mb-1">{T.notes}</div>
              <ul className="list-disc pl-5 space-y-1">
                {result.notes.map((n, i) => (<li key={i}>{n}</li>))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

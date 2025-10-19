'use client';

import React, { useMemo, useState } from 'react';
import { computeWall } from '@/lib/walls/compute';
import { WALL_SYSTEMS, type WallSystemKey } from '@/lib/walls/constants';
import { TEXTS, type Lang } from '@/i18n/texts';

function fmt(n: number | undefined, d = 2) {
  return typeof n === 'number' && Number.isFinite(n) ? n.toFixed(d) : '0';
}

export default function WallsCalculatorPage() {
  const [lang, setLang] = useState<Lang>('es');
  const t = TEXTS[lang];

  // 🔹 Ahora el sistema permite ICF15/ICF20 aparte de solid-wall
  const [systemKey, setSystemKey] = useState<WallSystemKey>('ICF15');

  const [length_s, setLength] = useState('10');
  const [height_s, setHeight] = useState('3');
  const [openings_s, setOpenings] = useState('0');
  const [waste_s, setWaste] = useState('5');
  const [thickness_s, setThickness] = useState('27'); // sólo aplica para solid-wall

  const result = useMemo(() => {
    return computeWall({
      systemKey,
      length_m: Number(length_s) || 0,
      height_m: Number(height_s) || 0,
      openings_m2: Number(openings_s) || 0,
      waste_pct: Number(waste_s) || 0,
      thickness_cm: systemKey === 'solid-wall' ? Number(thickness_s) || 0 : undefined,
    });
  }, [systemKey, length_s, height_s, openings_s, waste_s, thickness_s]);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">{t.title?.replace('— ICF MEXICO', '') || 'Calculadora de Muros'} — ICF MEXICO</h1>
        <div className="flex gap-2">
          <button className={`px-3 py-1 border rounded ${lang === 'es' ? 'bg-black text-white' : ''}`} onClick={() => setLang('es')}>ES</button>
          <button className={`px-3 py-1 border rounded ${lang === 'en' ? 'bg-black text-white' : ''}`} onClick={() => setLang('en')}>EN</button>
        </div>
      </header>

      {/* Entrada */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm">{t.system_label || 'Sistema'}</span>
          <select
            className="border rounded p-2"
            value={systemKey}
            onChange={(e) => setSystemKey(e.target.value as WallSystemKey)}
          >
            <option value="ICF15">ICF-15 (Screen Grid)</option>
            <option value="ICF20">ICF-20 (Screen Grid)</option>
            <option value="solid-wall">{t.system_solid || 'Pared Sólida ICF'}</option>
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm">{t.length_label || 'Longitud (m)'}</span>
          <input className="border rounded p-2" value={length_s} onChange={(e) => setLength(e.target.value)} />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm">{t.height_label || 'Altura (m)'}</span>
          <input className="border rounded p-2" value={height_s} onChange={(e) => setHeight(e.target.value)} />
        </label>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm">{t.openings_label || 'Huecos (m²)'}</span>
          <input className="border rounded p-2" value={openings_s} onChange={(e) => setOpenings(e.target.value)} />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm">{t.waste_label || 'Merma (%)'}</span>
          <input className="border rounded p-2" value={waste_s} onChange={(e) => setWaste(e.target.value)} />
        </label>

        {systemKey === 'solid-wall' && (
          <label className="flex flex-col gap-1">
            <span className="text-sm">{t.thickness_label || 'Peralte (Pared Sólida)'}</span>
            <select className="border rounded p-2" value={thickness_s} onChange={(e) => setThickness(e.target.value)}>
              <option value="23">{t.thickness_23 || '23 cm'}</option>
              <option value="27">{t.thickness_27 || '27 cm'}</option>
              <option value="32">{t.thickness_32 || '32 cm'}</option>
            </select>
          </label>
        )}
      </section>

      {/* Resultados */}
      <section className="rounded-2xl border p-4 shadow-sm">
        <h2 className="font-semibold mb-3">{t.results || 'Resultados'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ul className="text-sm space-y-1">
            <li>{t.gross_area || 'Área Bruta'} <strong className="float-right">{fmt(result.area_gross_m2)} m²</strong></li>
            <li>{t.net_area || 'Área Neta (– huecos)'} <strong className="float-right">{fmt(result.net_area_m2)} m²</strong></li>
            <li>Concreto <strong className="float-right">{fmt(result.concrete_m3, 3)} m³</strong></li>
            {typeof result.rebar_kg === 'number' && (
              <li>Varilla <strong className="float-right">{fmt(result.rebar_kg, 1)} kg</strong></li>
            )}
            {typeof result.blocks_qty === 'number' && (
              <li>Piezas (aprox) <strong className="float-right">{result.blocks_qty}</strong></li>
            )}
            {typeof result.r_value_nominal === 'number' && (
              <li>Valor R (nominal) <strong className="float-right">R-{result.r_value_nominal}+</strong></li>
            )}
          </ul>

          <ul className="text-sm space-y-1 opacity-90">
            {result.notes.module_hint_cm && (<li>Módulo recomendado: <strong className="float-right">{result.notes.module_hint_cm} cm</strong></li>)}
            {result.notes.block_size && (<li>Bloque lineal: <strong className="float-right">{result.notes.block_size}</strong></li>)}
            {typeof result.notes.wall_thickness_cm === 'number' && (<li>Espesor de muro: <strong className="float-right">{result.notes.wall_thickness_cm} cm</strong></li>)}
            {result.notes.fc_min_kg_cm2 && (<li>Concreto: <strong className="float-right">f’c ≥ {result.notes.fc_min_kg_cm2} kg/cm²</strong></li>)}
            {result.notes.slump_cm && (<li>Revenimiento: <strong className="float-right">{result.notes.slump_cm}</strong></li>)}
            {result.notes.pour_limits_hint && (<li>{result.notes.pour_limits_hint}</li>)}
            {result.notes.solid_info && (<li>{result.notes.solid_info}</li>)}
          </ul>
        </div>
      </section>
    </div>
  );
}

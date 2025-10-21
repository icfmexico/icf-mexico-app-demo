'use client';

import React, { useMemo, useState } from 'react';
import LogisticaPDFButton from '../../../components/pdf/logistica/LogisticaPDFButton';

type Lang = 'es' | 'en';
type System = 'ICF15' | 'ICF20' | 'PS23' | 'PS27' | 'PS32';

function cx(...cls: (string | false | undefined)[]) {
  return cls.filter(Boolean).join(' ');
}
function fmt(n: number, d = 2) {
  return Number.isFinite(n) ? n.toFixed(d) : '-';
}
function ceilIfNeeded(n: number) {
  const up = Math.ceil(n);
  return up > n ? up : n;
}

export default function LogisticaICFPage() {
  const [lang, setLang] = useState<Lang>('es');
  const [system, setSystem] = useState<System>('ICF20');
  const [area, setArea] = useState('100');
  const [waste, setWaste] = useState('0');

  const t = {
    es: {
      title: 'Calculadora de Logística — ICF MEXICO',
      intro:
        'Planea tus embarques ICF con base en m² de muro. Resultados pensados para camión de 53 pies.',
      system: 'Sistema ICF',
      area: 'Superficie de muro (m²)',
      waste: 'Merma (%)',
      results: 'Resultados de Envío',
      blocks: 'Bloques lineales',
      corners: 'Bloques de esquina',
      pallets: 'Tarimas lineales',
      palletsCorner: 'Tarimas de esquina',
      palletsTotal: 'Tarimas totales',
      trucks: 'Camiones 53’',
      suggested: 'Sugerencia (redondeo)',
      note15:
        'Para ICF-15 se asume 90% lineal y 10% esquinas. 28 blk/tarima (lineal) · 24 blk/tarima (esquina) · 50 tarimas/camión.',
      note20:
        'Para ICF-20 todo el metraje se maneja como lineal. 54 blk/tarima · 1,702 blk/camión.',
      notePS:
        'Para Pared Sólida se asume 90% lineal y 10% esquinas. 24 blocks/tarima (lineal) · 21 blocks/tarima (esquina) · 50 tarimas/camión.',
      badge: { icf15: 'ICF-15', icf20: 'ICF-20', ps: 'Pared Sólida' },
      pdf: 'Descargar PDF',
      pdfLoading: 'Generando PDF…',
    },
    en: {
      title: 'Logistics Calculator — ICF MEXICO',
      intro:
        'Plan ICF shipments from wall area (m²). Results assume 53-ft dry van.',
      system: 'ICF System',
      area: 'Wall surface (m²)',
      waste: 'Waste (%)',
      results: 'Shipping Results',
      blocks: 'Linear blocks',
      corners: 'Corner blocks',
      pallets: 'Linear pallets',
      palletsCorner: 'Corner pallets',
      palletsTotal: 'Total pallets',
      trucks: '53-ft trucks',
      suggested: 'Suggestion (round up)',
      note15:
        'ICF-15 assumes 90% linear / 10% corners. 28 blk/pallet (linear) · 24 blk/pallet (corner) · 50 pallets/truck.',
      note20:
        'ICF-20 treats all area as linear. 54 blk/pallet · 1,702 blk/truck.',
      notePS:
        'Solid Wall assumes 90% linear / 10% corners. 24 blocks/pallet (linear) · 21 blocks/pallet (corner) · 50 pallets/truck.',
      badge: { icf15: 'ICF-15', icf20: 'ICF-20', ps: 'Solid Wall' },
      pdf: 'Download PDF',
      pdfLoading: 'Generating PDF…',
    },
  }[lang];

  const res = useMemo(() => {
    const A = Math.max(0, Number(area) || 0);
    const W = 1 + Math.max(0, Number(waste) || 0) / 100;

    let blocksLine = 0,
      blocksCorner = 0,
      palletsLine = 0,
      palletsCorner = 0,
      palletsTotal = 0,
      trucks = 0;

    switch (system) {
      case 'ICF15':
        blocksLine = A * 2.77 * 0.9 * W;
        blocksCorner = A * 3.4 * 0.1 * W;
        palletsLine = blocksLine / 28;
        palletsCorner = blocksCorner / 24;
        palletsTotal = palletsLine + palletsCorner;
        trucks = palletsTotal / 50;
        break;

      case 'ICF20':
        blocksLine = A * 3.33 * W;
        palletsLine = blocksLine / 54;
        palletsTotal = palletsLine;
        trucks = blocksLine / 1702;
        break;

      case 'PS23':
      case 'PS27':
      case 'PS32':
        blocksLine = A * 2.0 * 0.9 * W;
        blocksCorner = A * 2.55 * 0.1 * W;
        palletsLine = blocksLine / 24;
        palletsCorner = blocksCorner / 21;
        palletsTotal = palletsLine + palletsCorner;
        trucks = palletsTotal / 50;
        break;
    }

    return {
      blocksLine,
      blocksCorner,
      palletsLine,
      palletsCorner,
      palletsTotal,
      trucks,
      sug: {
        palletsLine: ceilIfNeeded(palletsLine),
        palletsCorner: ceilIfNeeded(palletsCorner),
        palletsTotal: ceilIfNeeded(palletsTotal),
        trucks: ceilIfNeeded(trucks),
      },
    };
  }, [system, area, waste]);

  const badge =
    system === 'ICF15'
      ? t.badge.icf15
      : system === 'ICF20'
      ? t.badge.icf20
      : t.badge.ps;

  const note =
    system === 'ICF15' ? t.note15 : system === 'ICF20' ? t.note20 : t.notePS;

  // Entradas numéricas ya listas para el PDF
  const inputNums = {
    area: Number(area) || 0,
    waste: Number(waste) || 0,
  };

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {t.title}
          </h1>
          <p className="text-sm opacity-80 mt-1">{t.intro}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang('es')}
            className={cx(
              'px-3 py-1 rounded border',
              lang === 'es' && 'bg-black text-white'
            )}
          >
            ES
          </button>
          <button
            onClick={() => setLang('en')}
            className={cx(
              'px-3 py-1 rounded border',
              lang === 'en' && 'bg-black text-white'
            )}
          >
            EN
          </button>

          {/* Botón PDF (no altera el diseño, se alinea junto a los toggles de idioma) */}
          <LogisticaPDFButton
            lang={lang}
            system={system}
            input={inputNums}
            out={res}
            note={note}
            badge={badge}
          />
        </div>
      </header>

      {/* Form */}
      <section className="rounded-2xl border p-4 md:p-6 shadow-sm bg-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className="flex flex-col gap-1 md:col-span-3">
            <span className="text-sm font-medium">{t.system}</span>
            <select
              value={system}
              onChange={(e) => setSystem(e.target.value as System)}
              className="border rounded-lg p-2"
            >
              <option value="ICF15">ICF-15 (Screen Grid)</option>
              <option value="ICF20">ICF-20 (Screen Grid)</option>
              <option value="PS23">Pared Sólida 23 cm</option>
              <option value="PS27">Pared Sólida 27 cm</option>
              <option value="PS32">Pared Sólida 32 cm</option>
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">{t.area}</span>
            <input
              type="number"
              min={0}
              className="border rounded-lg p-2"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium">{t.waste}</span>
            <input
              type="number"
              min={0}
              className="border rounded-lg p-2"
              value={waste}
              onChange={(e) => setWaste(e.target.value)}
            />
          </label>

          <div className="md:col-span-1 flex items-end">
            <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-black" />
              {badge}
            </span>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="rounded-2xl border p-4 md:p-6 shadow-sm bg-white space-y-4">
        <h2 className="text-lg font-semibold">{t.results}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tabla principal */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm tabular-nums">
              <tbody>
                <Row label={t.blocks} value={fmt(res.blocksLine)} />
                {res.blocksCorner > 0 && (
                  <Row label={t.corners} value={fmt(res.blocksCorner)} />
                )}
                <Row label={t.pallets} value={fmt(res.palletsLine)} />
                {res.palletsCorner > 0 && (
                  <Row
                    label={t.palletsCorner}
                    value={fmt(res.palletsCorner)}
                  />
                )}
                <Row label={t.palletsTotal} value={fmt(res.palletsTotal)} />
                <Row label={t.trucks} value={fmt(res.trucks)} />
              </tbody>
            </table>
          </div>

          {/* Sugerencias redondeadas */}
          <div className="rounded-xl border p-4 bg-slate-50">
            <div className="text-sm font-medium mb-2">{t.suggested}</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm tabular-nums">
                <tbody>
                  <Row label={t.pallets} value={String(res.sug.palletsLine)} />
                  {res.palletsCorner > 0 && (
                    <Row
                      label={t.palletsCorner}
                      value={String(res.sug.palletsCorner)}
                    />
                  )}
                  <Row
                    label={t.palletsTotal}
                    value={String(res.sug.palletsTotal)}
                  />
                  <Row label={t.trucks} value={String(res.sug.trucks)} />
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="text-xs opacity-80 pt-2">{note}</div>
      </section>

      <footer className="text-center text-xs opacity-70">
        © 2025 ICF MEXICO — Construcción eficiente y sostenible.
      </footer>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b last:border-b-0">
      <td className="py-2 pr-3 whitespace-nowrap">{label}</td>
      <td className="py-2 pl-3 text-right font-semibold whitespace-nowrap">
        {value}
      </td>
    </tr>
  );
}

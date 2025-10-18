import { COVERAGE_M2, SOLID_WALL_THICKNESSES, ceil } from './constants';
import type { WallInputs, WallResults } from './types';

function n(val: unknown, fallback = 0): number {
  const v = Number(val);
  return Number.isFinite(v) ? v : fallback;
}

export function computeWall(inputs: WallInputs): WallResults {
  const system = inputs.system;
  const thickness = inputs.thickness_cm;
  const length_m = n(inputs.length_m);
  const height_m = n(inputs.height_m);
  const openings_m2 = Math.max(0, n(inputs.openings_m2));
  const waste_pct = Math.max(0, n(inputs.waste_pct));

  const area_gross_m2 = Math.max(0, length_m * height_m);
  const area_net_m2 = Math.max(0, area_gross_m2 - openings_m2);
  const waste_m2 = (area_net_m2 * waste_pct) / 100;
  const area_total_m2 = area_net_m2 + waste_m2;

  const notes: string[] = [];
  let units_count = 0;

  if (system === 'screen-grid') {
    const cov = COVERAGE_M2.screenGridPerModule_m2;
    units_count = cov > 0 ? ceil(area_total_m2 / cov) : 0;
    notes.push('Screen-Grid: conteo por módulos (aprox).');
  } else if (system === 'solid-wall') {
    if (!thickness || !SOLID_WALL_THICKNESSES.includes(thickness)) {
      notes.push('⚠ Selecciona peralte válido: 23, 27 o 32 cm.');
    }
    const cov = COVERAGE_M2.solidWallPanel_m2;
    units_count = cov > 0 ? ceil(area_total_m2 / cov) : 0;
    notes.push(`Pared Sólida ${thickness ?? '—'} cm: conteo por panel (aprox).`);
  } else {
    notes.push('⚠ Sistema no reconocido.');
  }

  return {
    area_gross_m2,
    area_net_m2,
    waste_m2,
    area_total_m2,
    units_count,
    notes,
  };
}

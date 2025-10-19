// src/lib/walls/compute.ts
import { WALL_SYSTEMS, type WallSystemKey } from './constants';

export type ComputeInput = {
  systemKey: WallSystemKey;    // 'ICF15' | 'ICF20' | 'solid-wall'
  length_m: number;
  height_m: number;
  openings_m2: number;         // área de vanos (m²)
  waste_pct: number;           // merma (%)
  thickness_cm?: number;       // solo para pared sólida
};

export type ComputeResult = {
  area_gross_m2: number;
  net_area_m2: number;
  concrete_m3: number;
  rebar_kg?: number;
  blocks_qty?: number;
  r_value_nominal?: number;
  notes: {
    module_hint_cm?: number;
    block_size?: string;
    wall_thickness_cm?: number;
    fc_min_kg_cm2?: number;
    slump_cm?: string;
    pour_limits_hint?: string;
    solid_info?: string;
  };
};

export function computeWall({
  systemKey,
  length_m,
  height_m,
  openings_m2,
  waste_pct,
  thickness_cm,
}: ComputeInput): ComputeResult {
  const sys = WALL_SYSTEMS[systemKey];

  const area_gross_m2 = Math.max(0, length_m) * Math.max(0, height_m);
  const net_area_base = Math.max(0, area_gross_m2 - Math.max(0, openings_m2));
  const net_area_m2 = net_area_base * (1 + Math.max(0, waste_pct) / 100);

  if (sys.kind === 'screen-grid') {
    const concrete_m3 = +(net_area_m2 * sys.concrete_per_m2).toFixed(3);
    const rebar_kg = +(net_area_m2 * sys.rebar_kg_per_m2).toFixed(1);
    const blocks_qty = Math.ceil(net_area_m2 / sys.block_face_area_m2);

    return {
      area_gross_m2: +area_gross_m2.toFixed(2),
      net_area_m2: +net_area_m2.toFixed(2),
      concrete_m3,
      rebar_kg,
      blocks_qty,
      r_value_nominal: sys.r_value_nominal,
      notes: {
        module_hint_cm: sys.module_hint_cm,
        block_size: sys.block_size,
        wall_thickness_cm: sys.wall_thickness_cm,
        fc_min_kg_cm2: sys.fc_min_kg_cm2,
        slump_cm: sys.slump_cm,
        pour_limits_hint: sys.pour_limits_hint,
      },
    };
  }

  // solid-wall
  const thick_m = Math.max(0, (thickness_cm ?? 0) / 100);
  const concrete_m3 = +(net_area_m2 * thick_m).toFixed(3);

  return {
    area_gross_m2: +area_gross_m2.toFixed(2),
    net_area_m2: +net_area_m2.toFixed(2),
    concrete_m3,
    notes: {
      wall_thickness_cm: thickness_cm,
      fc_min_kg_cm2: sys.fc_min_kg_cm2,
      slump_cm: sys.slump_cm,
      solid_info: sys.solid_info,
    },
  };
}

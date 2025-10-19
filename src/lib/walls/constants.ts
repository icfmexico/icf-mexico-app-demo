// src/lib/walls/constants.ts
export type WallSystemKey = 'ICF15' | 'ICF20' | 'solid-wall';

export type ScreenGridSpec = {
  kind: 'screen-grid';
  name: string;
  block_face_area_m2: number;   // área de cara por bloque (m²) 122×30 cm = 0.366 m²
  concrete_per_m2: number;      // m³ de concreto por m² neto (antes de merma)
  rebar_kg_per_m2: number;      // kg de varilla por m² neto
  r_value_nominal: number;      // valor R nominal
  module_hint_cm: number;
  block_size: string;
  wall_thickness_cm: number;
  fc_min_kg_cm2: number;
  slump_cm: string;
  pour_limits_hint: string;
};

export type SolidWallSpec = {
  kind: 'solid-wall';
  name: string;
  // en pared sólida, el concreto se calcula por espesor
  r_value_nominal?: number;
  fc_min_kg_cm2: number;
  slump_cm: string;
  solid_info: string;
};

export type WallSystem = ScreenGridSpec | SolidWallSpec;

/**
 * Nota:
 * - ICF15 e ICF20 usan la misma cara (122×30 cm), por eso el conteo de piezas
 *   es similar; cambia el consumo de concreto y R nominal.
 * - Coeficientes ajustados para coincidir con tus números de referencia:
 *   ICF-15 → ~1.732 m³ para 30 m² (≈0.0577 m³/m²)
 *   ICF-20 → ~2.363 m³ para 30 m² (≈0.0788 m³/m²)
 *   Varilla: 3.15 kg/m² (30 m² → 94.5 kg)
 */
export const WALL_SYSTEMS: Record<WallSystemKey, WallSystem> = {
  ICF15: {
    kind: 'screen-grid',
    name: 'ICF-15 (Screen Grid)',
    block_face_area_m2: 0.366,       // 1.22 × 0.30 m
    concrete_per_m2: 0.0577,
    rebar_kg_per_m2: 3.15,
    r_value_nominal: 24,
    module_hint_cm: 120,
    block_size: '122×30×15 cm',
    wall_thickness_cm: 15,
    fc_min_kg_cm2: 200,
    slump_cm: '15-18 cm',
    pour_limits_hint: 'Altura máx. por colado: 3 hiladas (~0.90 m).',
  },
  ICF20: {
    kind: 'screen-grid',
    name: 'ICF-20 (Screen Grid)',
    block_face_area_m2: 0.366,       // misma cara
    concrete_per_m2: 0.0788,
    rebar_kg_per_m2: 3.15,
    r_value_nominal: 26,
    module_hint_cm: 120,
    block_size: '122×30×20 cm',
    wall_thickness_cm: 20,
    fc_min_kg_cm2: 200,
    slump_cm: '15-18 cm',
    pour_limits_hint: 'Altura máx. por colado: 3 hiladas (~0.90 m).',
  },
  'solid-wall': {
    kind: 'solid-wall',
    name: 'Pared Sólida ICF',
    fc_min_kg_cm2: 200,
    slump_cm: '12-15 cm',
    solid_info: 'Concreto monolítico según espesor seleccionado.',
  },
};

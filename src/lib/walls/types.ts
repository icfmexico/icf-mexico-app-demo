export type WallSystem = 'screen-grid' | 'solid-wall';

export interface WallInputs {
  system: WallSystem;           // 'screen-grid' | 'solid-wall'
  thickness_cm?: 23 | 27 | 32;  // Solo aplica a solid-wall
  length_m: number;
  height_m: number;
  openings_m2?: number;         // ventanas/puertas (m²) a descontar
  waste_pct?: number;           // merma en %
}

export interface WallResults {
  area_gross_m2: number;
  area_net_m2: number;
  waste_m2: number;
  area_total_m2: number;
  units_count: number;
  notes?: string[];
}

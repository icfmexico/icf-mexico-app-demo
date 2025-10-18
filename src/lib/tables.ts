// src/lib/tables.ts
// === Parámetros de ingeniería editables por ICF MEXICO ===

// ---------------- Utilidades ----------------
export const cmToM = (cm: number) => cm / 100;
export const inchToM = (inch: number) => inch * 0.0254;
export const r3 = (v: number) => Number(v.toFixed(3));
export const r1 = (v: number) => Number(v.toFixed(1));

// ================= Makros ===================
export const MAKROS_PERALTES = ["18 cm", "20 cm", "25 cm", "29 cm", "32 cm"] as const;
export type MakrosPeralte = typeof MAKROS_PERALTES[number];

export const MAKROS_THICKNESS_M: Record<MakrosPeralte, number> = {
  "18 cm": cmToM(18),
  "20 cm": cmToM(20),
  "25 cm": cmToM(25),
  "29 cm": cmToM(29),
  "32 cm": cmToM(32),
};

// ⚠️ PLACEHOLDERS — sustituir con ficha oficial Makros
export const MAKROS_SOLID_FRACTION: Record<MakrosPeralte, number> = {
  "18 cm": 0.30,
  "20 cm": 0.32,
  "25 cm": 0.35,
  "29 cm": 0.37,
  "32 cm": 0.39,
};

export const MAKROS_STEEL_KG_M2: Record<MakrosPeralte, number> = {
  "18 cm": 5.5,
  "20 cm": 6.5,
  "25 cm": 7.5,
  "29 cm": 8.5,
  "32 cm": 9.5,
};

export const MAKROS_EPS_FRACTION: Record<MakrosPeralte, number> = {
  "18 cm": 1 - MAKROS_SOLID_FRACTION["18 cm"],
  "20 cm": 1 - MAKROS_SOLID_FRACTION["20 cm"],
  "25 cm": 1 - MAKROS_SOLID_FRACTION["25 cm"],
  "29 cm": 1 - MAKROS_SOLID_FRACTION["29 cm"],
  "32 cm": 1 - MAKROS_SOLID_FRACTION["32 cm"],
};

// Módulo por pieza (m²/pieza) — AJUSTAR con panel real
export const MAKROS_M2_PER_PIEZA = 0.50;

// ================= Joists ===================
export const JOISTS_PERALTES = ["27 cm", "32 cm"] as const;
export type JoistPeralte = typeof JOISTS_PERALTES[number];

// ⚠️ PLACEHOLDERS — sustituir con ficha Joist oficial
export const JOISTS_CONCRETO_M3_M2: Record<JoistPeralte, number> = {
  "27 cm": 0.065,
  "32 cm": 0.078,
};

export const JOISTS_ACERO_KG_M2: Record<JoistPeralte, number> = {
  "27 cm": 7.5,
  "32 cm": 9.0,
};

export const JOISTS_EPS_M3_M2: Record<JoistPeralte, number> = {
  "27 cm": 0.045,
  "32 cm": 0.052,
};

// Módulo por pieza (m²/pieza) — AJUSTAR
export const JOISTS_M2_PER_PIEZA = 0.50;

// ================ SteelFoam =================
export const STEELFOAM_PERALTES = ["25 cm", "30 cm"] as const;
export type SteelFoamPeralte = typeof STEELFOAM_PERALTES[number];

// ⚠️ PLACEHOLDERS — sustituir con ficha SteelFoam oficial
export const STEELFOAM_CONCRETO_M3_M2: Record<SteelFoamPeralte, number> = {
  "25 cm": 0.060,
  "30 cm": 0.072,
};

export const STEELFOAM_ACERO_KG_M2: Record<SteelFoamPeralte, number> = {
  "25 cm": 7.0,
  "30 cm": 8.5,
};

export const STEELFOAM_EPS_M3_M2: Record<SteelFoamPeralte, number> = {
  "25 cm": 0.048,
  "30 cm": 0.056,
};

// Módulo por pieza (m²/pieza) — AJUSTAR
export const STEELFOAM_M2_PER_PIEZA = 0.50;

// ================ Muros ICF =================
// Modos y espesores
export const MUROS_MODES = ["screen-grid", "solid"] as const;
export type MurosMode = typeof MUROS_MODES[number];

export const MUROS_ESPESORES = ['6"', '8"', '10"'] as const;
export type MurosEspesor = typeof MUROS_ESPESORES[number];

// Espesores a metros (pared sólida equivalente)
export const MUROS_SOLID_THICKNESS_M: Record<MurosEspesor, number> = {
  '6"': inchToM(6),   // 0.1524 m
  '8"': inchToM(8),   // 0.2032 m
  '10"': inchToM(10), // 0.2540 m
};

// Módulo por pieza (m²/pieza) — AJUSTAR a tu bloque/panel real
export const MUROS_M2_PER_PIEZA = 0.488; // ej. panel 1.22 x 0.40 m

// Conectores por pieza (ratio) — AJUSTAR
export const MUROS_CONECTORES_POR_PIEZA = 0.60;

// Screen-Grid: fracción sólida respecto a pared maciza del mismo espesor — AJUSTAR
export const MUROS_GRID_SOLID_FRACTION = 0.28;

// Screen-Grid: espaciamientos por defecto (m) — AJUSTAR
export const MUROS_SEP_CASTILLOS_M_DEFAULT = 1.20;
export const MUROS_SEP_VIGAS_M_DEFAULT = 0.60;

// Acero — PLACEHOLDERS
// Screen-Grid: kg por metro lineal de refuerzo
export const MUROS_GRID_ACERO_KG_M_VERT = 3.5; // varillas en castillos
export const MUROS_GRID_ACERO_KG_M_HORZ = 3.0; // varillas en vigas

// Pared sólida: kg de acero por m² según espesor — AJUSTAR
export const MUROS_SOLID_ACERO_KG_M2: Record<MurosEspesor, number> = {
  '6"': 9,
  '8"': 11,
  '10"': 13,
};

// EPS estimado por m² (placeholder genérico) — AJUSTAR
export const MUROS_EPS_M3_POR_M2 = 0.05;

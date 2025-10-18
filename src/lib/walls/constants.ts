export const COVERAGE_M2 = {
  screenGridPerModule_m2: 0.75, // Ajusta luego con tus datos
  solidWallPanel_m2: 0.50,      // Ajusta luego con tus datos
};

export const SOLID_WALL_THICKNESSES: Array<23 | 27 | 32> = [23, 27, 32];

export const ceil = (v: number) => Math.ceil(v - 1e-9);

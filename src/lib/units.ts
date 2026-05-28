export type UnitSystem = "metric" | "imperial";

export const CM_PER_INCH = 2.54;
export const KG_PER_LB = 0.45359237;

export function cmToIn(cm: number): number {
  return cm / CM_PER_INCH;
}

export function inToCm(inch: number): number {
  return inch * CM_PER_INCH;
}

export function kgToLb(kg: number): number {
  return kg / KG_PER_LB;
}

export function lbToKg(lb: number): number {
  return lb * KG_PER_LB;
}

export function formatLength(
  cm: number | null | undefined,
  system: UnitSystem,
): string {
  if (cm == null) return "—";
  if (system === "imperial") return `${cmToIn(cm).toFixed(1)} in`;
  return `${Number(cm).toFixed(1)} cm`;
}

export function formatWeight(
  kg: number | null | undefined,
  system: UnitSystem,
): string {
  if (kg == null) return "—";
  if (system === "imperial") return `${kgToLb(kg).toFixed(2)} lb`;
  return `${Number(kg).toFixed(2)} kg`;
}

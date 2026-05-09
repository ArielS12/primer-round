/**
 * Utilidades de color para calcular contrastes y derivar variables CSS de marca.
 */

function clamp(n: number, min = 0, max = 255): number {
  return Math.max(min, Math.min(max, n));
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.trim().replace(/^#/, "");
  const expanded =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  if (!/^[0-9a-fA-F]{6}$/.test(expanded)) return null;
  const r = parseInt(expanded.slice(0, 2), 16);
  const g = parseInt(expanded.slice(2, 4), 16);
  const b = parseInt(expanded.slice(4, 6), 16);
  return { r, g, b };
}

/**
 * Devuelve "#000000" o "#ffffff" según el color base, optimizando contraste WCAG.
 */
export function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return "#ffffff";
  // Luminancia relativa (WCAG)
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const L =
    0.2126 * toLinear(rgb.r) + 0.7152 * toLinear(rgb.g) + 0.0722 * toLinear(rgb.b);
  return L > 0.55 ? "#1c1917" : "#ffffff";
}

/**
 * Genera un tono más claro o oscuro mezclando con blanco/negro.
 * `amount` entre -1 y 1.
 */
export function shade(hex: string, amount: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const target = amount >= 0 ? 255 : 0;
  const a = Math.abs(amount);
  const r = Math.round(clamp(rgb.r + (target - rgb.r) * a));
  const g = Math.round(clamp(rgb.g + (target - rgb.g) * a));
  const b = Math.round(clamp(rgb.b + (target - rgb.b) * a));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b
    .toString(16)
    .padStart(2, "0")}`;
}

/**
 * Mezcla dos colores hex en proporción `t` (0..1). Útil para derivar tonos.
 */
function mix(a: string, b: string, t: number): string {
  const ra = hexToRgb(a);
  const rb = hexToRgb(b);
  if (!ra || !rb) return a;
  const r = Math.round(ra.r + (rb.r - ra.r) * t);
  const g = Math.round(ra.g + (rb.g - ra.g) * t);
  const bl = Math.round(ra.b + (rb.b - ra.b) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bl
    .toString(16)
    .padStart(2, "0")}`;
}

/**
 * Construye un objeto de variables CSS de marca para inyectar en `<html style={...}>`.
 *
 * Genera además `--color-soft`: un fondo muy claro derivado del primario,
 * pensado para los fondos de sección. Es independiente de `secondary` para
 * que el secundario pueda ser un color oscuro (negro) sin oscurecer todo el sitio.
 *
 * `--color-border` siempre se deriva de un gris cálido independiente del
 * secundario para mantener legibilidad.
 */
export function buildBrandCssVars(primary: string, secondary: string): Record<string, string> {
  // soft = primario mezclado al 92% con blanco => crema cálido en la familia del primario.
  const soft = mix(primary, "#ffffff", 0.92);

  // Si el secundario es claro, usamos su shade oscuro como border; si es oscuro, beige neutro.
  const secondaryRgb = hexToRgb(secondary);
  const secondaryIsDark = secondaryRgb
    ? (0.299 * secondaryRgb.r + 0.587 * secondaryRgb.g + 0.114 * secondaryRgb.b) / 255 < 0.5
    : false;
  const border = secondaryIsDark ? mix(soft, "#000000", 0.12) : shade(secondary, -0.18);

  return {
    "--color-primary": primary,
    "--color-primary-contrast": getContrastColor(primary),
    "--color-secondary": secondary,
    "--color-secondary-contrast": getContrastColor(secondary),
    "--color-soft": soft,
    "--color-border": border,
  };
}

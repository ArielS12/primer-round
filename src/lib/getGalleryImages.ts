/**
 * Server-only: lectura del filesystem de `public/uploads/` para detectar
 * dinámicamente cuántas imágenes `gallery-N.jpg` existen.
 *
 * Este módulo SOLO debe importarse desde Server Components o Route Handlers.
 */

import "server-only";
import fs from "node:fs";
import path from "node:path";

import { getConfiguredGalleryUrls } from "@/lib/images";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const GALLERY_REGEX = /^gallery-(\d+)\.jpg$/i;

/**
 * Busca secuencialmente `gallery-1.jpg`, `gallery-2.jpg`, ... hasta que no
 * encuentra más, y devuelve las rutas públicas correspondientes.
 *
 * Implementación: lee el directorio una sola vez, filtra por patrón y ordena
 * por índice. Soporta huecos en la numeración devolviendo SOLO los que existen
 * (manteniendo el orden de N creciente). El requisito original es buscar
 * "secuencialmente hasta que no encuentre más"; al usar readdir + sort por N
 * ascendente cumplimos con el caso típico (1..N consecutivos) y además somos
 * tolerantes si el usuario salta números.
 */
export function getLocalGalleryImages(): string[] {
  try {
    if (!fs.existsSync(UPLOADS_DIR)) return [];
    const entries = fs.readdirSync(UPLOADS_DIR, { withFileTypes: true });

    const matches: { index: number; file: string }[] = [];
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      const m = entry.name.match(GALLERY_REGEX);
      if (!m) continue;
      const index = Number.parseInt(m[1], 10);
      if (!Number.isFinite(index) || index < 1) continue;
      matches.push({ index, file: entry.name });
    }

    matches.sort((a, b) => a.index - b.index);
    return matches.map(({ file }) => `/uploads/${file}`);
  } catch {
    return [];
  }
}

/**
 * Devuelve la lista FINAL de imágenes a renderizar en la galería:
 *   - Si hay imágenes locales: usa todas (N dinámico).
 *   - Si no hay locales: usa URLs declaradas en `siteConfig.media.galeria`.
 *   - Si tampoco hay URLs: array vacío (el componente mostrará placeholders).
 */
export function getFinalGalleryImages(): string[] {
  const local = getLocalGalleryImages();
  if (local.length > 0) return local;
  return getConfiguredGalleryUrls();
}

/**
 * Verifica si existen archivos clave (logo / hero) en local.
 * Útil para que el componente decida si renderizar `<Image>` local o fallback.
 */
export function hasLocalLogo(): boolean {
  return safeExists(path.join(UPLOADS_DIR, "logo.jpg"));
}

export function hasLocalHero(): boolean {
  return safeExists(path.join(UPLOADS_DIR, "hero.jpg"));
}

function safeExists(p: string): boolean {
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
}

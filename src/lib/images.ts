/**
 * Helpers de resolución de imágenes.
 *
 * Reglas de prioridad (en orden):
 *   1. Local JPG en `public/uploads/...`
 *   2. URL declarada en `siteConfig.media`
 *   3. Placeholder elegante (string vacío => SmartImage muestra placeholder)
 *
 * Las funciones que requieren leer el filesystem (galería local con N dinámico)
 * están en `getGalleryImages.ts` (server-only). Acá viven utilidades puras
 * y seguras para usar en cualquier entorno.
 */

import { siteConfig } from "@/config/siteConfig";

export type ImageType = "logo" | "hero" | "gallery";

export const LOCAL_IMAGE_PATHS = {
  logo: "/uploads/logo.jpg",
  hero: "/uploads/hero.jpg",
  galleryPattern: (index: number) => `/uploads/gallery-${index}.jpg`,
} as const;

/**
 * Resuelve la fuente preferida (URL pública) para logo / hero / gallery dado el orden:
 *   1. Local (asume que existe; el componente SmartImage hará fallback si rompe)
 *   2. URL del config
 *   3. "" (placeholder)
 *
 * NOTA: para `gallery` con N dinámico real (sin asumir existencia), usar
 * `getFinalGalleryImages()` desde `getGalleryImages.ts` (server-only).
 */
export function resolveImageSource(type: ImageType, index?: number): string {
  if (type === "logo") {
    if (siteConfig.media.logoUrl) return siteConfig.media.logoUrl;
    return LOCAL_IMAGE_PATHS.logo;
  }
  if (type === "hero") {
    if (siteConfig.media.heroUrl) return siteConfig.media.heroUrl;
    return LOCAL_IMAGE_PATHS.hero;
  }
  if (type === "gallery") {
    const i = typeof index === "number" && index >= 1 ? index : 1;
    return LOCAL_IMAGE_PATHS.galleryPattern(i);
  }
  return "";
}

/**
 * Devuelve las URLs declaradas en config para galería.
 * Útil como fallback cuando no hay imágenes locales.
 */
export function getConfiguredGalleryUrls(): string[] {
  return [...siteConfig.media.galeria].filter(Boolean);
}

/**
 * Decide si una URL es local (a `/uploads/...`) o externa.
 */
export function isLocalUpload(src: string): boolean {
  return typeof src === "string" && src.startsWith("/uploads/");
}

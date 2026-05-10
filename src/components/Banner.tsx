import Image from "next/image";

import { siteConfig } from "@/config/siteConfig";

/**
 * Banner full-width que se muestra arriba del Hero. Sirve de "tarjeta de
 * presentación" de la marca.
 *
 * La imagen `/uploads/banner.jpg` se generó como un canvas wide 1600x480
 * (ratio ~3.33:1) con el cuadro del logo centrado y padding negro lateral
 * abundante. Por eso usamos `object-cover`: el contenedor llena siempre el
 * ancho y los recortes laterales/verticales caen sobre fondo negro, nunca
 * sobre el logo. Sección decorativa → `aria-hidden`.
 */
export function Banner() {
  return (
    <section
      aria-label={`${siteConfig.nombreEmprendimiento} · banner`}
      className="relative w-full overflow-hidden bg-black"
    >
      <div className="relative mx-auto h-[clamp(252px,30.8vw,504px)] w-full max-w-content">
        <Image
          src="/uploads/banner.jpg"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}

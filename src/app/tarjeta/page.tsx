import type { Metadata } from "next";
import QRCode from "qrcode";

import { siteConfig } from "@/config/siteConfig";
import { resolveImageSource } from "@/lib/images";
import { SmartImage } from "@/components/ui/SmartImage";
import { TarjetaActions } from "./TarjetaActions";

/**
 * URL absoluta del sitio. En prod debería venir de NEXT_PUBLIC_SITE_URL.
 * En dev cae a localhost. Igualmente eliminamos slash final y barra de cierre
 * para que el QR codifique una URL "limpia".
 */
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
  .trim()
  .replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Tarjeta con QR",
  description: `Tarjeta imprimible con QR de ${siteConfig.nombreEmprendimiento}.`,
  robots: { index: false, follow: false },
};

/**
 * Página /tarjeta:
 *   - Server Component que genera el QR como SVG inline (sin canvas / sin
 *     dependencias en el cliente) apuntando a SITE_URL.
 *   - Diseño: tarjeta vertical 360×600 con logo, nombre del gimnasio,
 *     slogan, QR central y URL al pie.
 *   - Soporta impresión: `@media print` deja solo la tarjeta centrada.
 *   - Botones para imprimir o descargar el SVG (cliente).
 */
export default async function TarjetaPage() {
  const targetUrl = `${SITE_URL}/`;

  // Genero el SVG del QR (alto contraste, margen razonable).
  const qrSvg = await QRCode.toString(targetUrl, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 1,
    width: 320,
    color: {
      dark: "#171717",
      light: "#FFFFFF",
    },
  });

  return (
    <main className="bg-soft py-12 print:bg-white print:p-0">
      <div className="mx-auto max-w-content px-4">
        <div className="mb-6 flex flex-col items-center gap-3 text-center print:hidden">
          <h1 className="font-serif text-2xl text-ink md:text-3xl">
            Tarjeta con QR
          </h1>
          <p className="max-w-xl text-sm text-ink/70">
            El código apunta a <span className="font-medium text-ink">{targetUrl}</span>.
            Imprimila, compartila o descargala como imagen.
          </p>
          <TarjetaActions />
        </div>

        <div className="flex justify-center">
          <article
            id="tarjeta-card"
            className="flex w-[360px] flex-col items-center gap-5 rounded-3xl border border-border bg-surface px-7 py-8 text-center shadow-soft print:rounded-none print:border-0 print:shadow-none"
            aria-label={`Tarjeta de ${siteConfig.nombreEmprendimiento}`}
          >
            <header className="flex flex-col items-center gap-3">
              <span className="relative block h-20 w-20 overflow-hidden rounded-full ring-2 ring-primary">
                <SmartImage
                  src={resolveImageSource("logo")}
                  fallbackSrc={siteConfig.media.logoUrl || undefined}
                  alt={`Logo ${siteConfig.nombreEmprendimiento}`}
                  placeholderText={siteConfig.nombreEmprendimiento}
                  priority
                  sizes="80px"
                  className="h-full w-full"
                />
              </span>
              <div>
                <h2 className="font-serif text-3xl leading-tight text-ink">
                  {siteConfig.nombreEmprendimiento}
                </h2>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  {siteConfig.tipoEmprendimiento}
                </p>
              </div>
            </header>

            <div className="h-px w-full bg-border" aria-hidden="true" />

            <div
              className="rounded-2xl bg-white p-3 shadow-card print:shadow-none"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />

            <div>
              <p className="font-serif text-lg text-ink">
                Escaneá y reservá tu clase
              </p>
              <p className="mt-1 text-xs text-ink/60">
                {siteConfig.ciudadPais}
              </p>
            </div>

            <footer className="w-full">
              <div className="h-px w-full bg-border" aria-hidden="true" />
              <p className="mt-3 break-all text-xs text-ink/60">
                {targetUrl.replace(/^https?:\/\//, "")}
              </p>
            </footer>
          </article>
        </div>
      </div>
    </main>
  );
}

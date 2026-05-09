import type { Metadata, Viewport } from "next";
import type { CSSProperties, ReactNode } from "react";

import "./globals.css";
import { siteConfig, type DiaSemana } from "@/config/siteConfig";
import { buildBrandCssVars } from "@/lib/colors";
import { IntroAnimation } from "@/components/IntroAnimation";

const DIA_TO_SCHEMA: Record<DiaSemana, string> = {
  Lunes: "Mo",
  Martes: "Tu",
  Miércoles: "We",
  Jueves: "Th",
  Viernes: "Fr",
  Sábado: "Sa",
  Domingo: "Su",
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: siteConfig.seo.title,
    template: `%s · ${siteConfig.nombreEmprendimiento}`,
  },
  description: siteConfig.seo.description,
  applicationName: siteConfig.nombreEmprendimiento,
  authors: [{ name: siteConfig.nombreEmprendimiento }],
  keywords: [
    siteConfig.tipoEmprendimiento,
    siteConfig.rubroObjetivo,
    siteConfig.ciudadPais,
    ...siteConfig.servicios.map((s) => s.nombre),
  ],
  openGraph: {
    type: "website",
    locale: siteConfig.idioma,
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    siteName: siteConfig.nombreEmprendimiento,
    images: siteConfig.seo.ogImage ? [{ url: siteConfig.seo.ogImage }] : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.seo.title,
    description: siteConfig.seo.description,
    images: siteConfig.seo.ogImage ? [siteConfig.seo.ogImage] : undefined,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: true, email: true, address: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: siteConfig.branding.colorPrimario,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const brandVars = buildBrandCssVars(
    siteConfig.branding.colorPrimario,
    siteConfig.branding.colorSecundario,
  ) as CSSProperties;

  const dayCodes = siteConfig.horariosAtencion.dias
    .map((d) => DIA_TO_SCHEMA[d])
    .join(",");
  const openingHours = siteConfig.horariosAtencion.franjas.map(
    (f) => `${dayCodes} ${f.inicio}-${f.fin}`,
  );

  const localBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.nombreEmprendimiento,
    description: siteConfig.seo.description,
    image: siteConfig.seo.ogImage,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.contacto.direccion,
      addressLocality: siteConfig.ciudadPais,
    },
    telephone: `+${siteConfig.contacto.whatsappAdmin}`,
    email: siteConfig.contacto.email,
    priceRange: "$$",
    openingHours,
  };

  return (
    <html lang={siteConfig.idioma} style={brandVars}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-contrast"
        >
          Saltar al contenido
        </a>
        <IntroAnimation />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
        />
      </body>
    </html>
  );
}

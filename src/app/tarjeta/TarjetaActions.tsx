"use client";

import { useCallback, useState } from "react";

/**
 * Botones cliente para la página /tarjeta:
 *   - "Imprimir": invoca window.print() (el @media print del layout deja solo la tarjeta).
 *   - "Descargar SVG": serializa el nodo de la tarjeta como SVG dentro de un <foreignObject>
 *     no es trivial; en su lugar generamos un PNG del nodo mediante html2canvas... sería
 *     más dependencia. Para mantenerlo simple: ofrecemos descargar el QR como SVG suelto
 *     (extraído del DOM) y abrir el diálogo de impresión para "guardar como PDF".
 */
export function TarjetaActions() {
  const [busy, setBusy] = useState(false);

  const handlePrint = useCallback(() => {
    if (typeof window === "undefined") return;
    window.print();
  }, []);

  const handleDownloadSvg = useCallback(() => {
    if (typeof document === "undefined") return;
    setBusy(true);
    try {
      const card = document.getElementById("tarjeta-card");
      if (!card) return;
      const svg = card.querySelector("svg");
      if (!svg) return;
      const serializer = new XMLSerializer();
      const data = serializer.serializeToString(svg);
      const blob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "primer-round-qr.svg";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(false);
    }
  }, []);

  return (
    <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        onClick={handlePrint}
        className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-contrast shadow-card transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-soft"
      >
        Imprimir o guardar como PDF
      </button>
      <button
        type="button"
        onClick={handleDownloadSvg}
        disabled={busy}
        className="rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-ink shadow-card transition hover:border-primary hover:text-primary disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-soft"
      >
        Descargar QR (SVG)
      </button>
    </div>
  );
}

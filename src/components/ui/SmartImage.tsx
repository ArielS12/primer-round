"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";

import { isLocalUpload } from "@/lib/images";

type SmartImageProps = {
  /**
   * Fuente preferida (puede ser local `/uploads/...` o URL externa).
   * Si está vacía o falla, se usa `fallbackSrc` y luego un placeholder.
   */
  src: string;
  alt: string;
  /** Fuente alternativa si la primaria falla. Suele ser una URL del config. */
  fallbackSrc?: string;
  /** Texto a mostrar dentro del placeholder cuando no hay imagen disponible. */
  placeholderText?: string;
  className?: string;
  imgClassName?: string;
  width?: number;
  height?: number;
  /** Si es true, ocupa todo el contenedor con object-cover. */
  fill?: boolean;
  /** Hint para Next/Image. */
  sizes?: string;
  priority?: boolean;
  decorative?: boolean;
  style?: CSSProperties;
};

/**
 * Imagen tolerante con cadena de fallback:
 *   primaria (local o URL) -> fallbackSrc -> placeholder elegante.
 *
 * Detecta automáticamente si la fuente es local (`/uploads/...`) para usar
 * `next/image` con optimización; caso contrario, usa <img> nativa para
 * evitar requerir configuración manual de `remotePatterns` por host.
 */
export function SmartImage({
  src,
  alt,
  fallbackSrc,
  placeholderText,
  className = "",
  imgClassName = "",
  width,
  height,
  fill = true,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  priority = false,
  decorative = false,
  style,
}: SmartImageProps) {
  const [stage, setStage] = useState<"primary" | "fallback" | "placeholder">("primary");

  const currentSrc =
    stage === "primary" ? src : stage === "fallback" ? fallbackSrc || "" : "";

  if (!currentSrc) {
    return (
      <PlaceholderTile
        text={placeholderText || alt}
        className={className}
        style={style}
      />
    );
  }

  const handleError = () => {
    if (stage === "primary" && fallbackSrc) setStage("fallback");
    else setStage("placeholder");
  };

  const altText = decorative ? "" : alt;
  const ariaHidden = decorative || undefined;

  if (isLocalUpload(currentSrc)) {
    if (fill) {
      return (
        <div className={`relative overflow-hidden ${className}`} style={style}>
          <Image
            src={currentSrc}
            alt={altText}
            aria-hidden={ariaHidden}
            fill
            sizes={sizes}
            priority={priority}
            onError={handleError}
            className={`object-cover ${imgClassName}`}
          />
        </div>
      );
    }
    return (
      <Image
        src={currentSrc}
        alt={altText}
        aria-hidden={ariaHidden}
        width={width || 800}
        height={height || 600}
        priority={priority}
        onError={handleError}
        className={`${imgClassName} ${className}`}
      />
    );
  }

  if (fill) {
    return (
      <div className={`relative overflow-hidden ${className}`} style={style}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentSrc}
          alt={altText}
          aria-hidden={ariaHidden}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onError={handleError}
          className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
        />
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentSrc}
      alt={altText}
      aria-hidden={ariaHidden}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      width={width}
      height={height}
      onError={handleError}
      className={`${imgClassName} ${className}`}
    />
  );
}

function PlaceholderTile({
  text,
  className = "",
  style,
}: {
  text: string;
  className?: string;
  style?: CSSProperties;
}) {
  const initial = (text || "").trim().charAt(0).toUpperCase() || "·";
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={style}
      role="img"
      aria-label={text}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(135deg, var(--color-secondary) 0%, var(--color-primary) 200%)",
          opacity: 0.55,
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 flex flex-col items-center gap-2 px-6 py-8 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-surface/70 text-2xl font-serif text-primary backdrop-blur">
          {initial}
        </span>
        <span className="max-w-[20ch] text-xs font-medium uppercase tracking-[0.18em] text-ink/70">
          {text}
        </span>
      </div>
    </div>
  );
}

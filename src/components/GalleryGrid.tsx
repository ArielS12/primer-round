"use client";

import { useCallback, useEffect, useState } from "react";

import { SmartImage } from "@/components/ui/SmartImage";
import { Icon } from "@/components/ui/Icon";
import { siteConfig } from "@/config/siteConfig";

/** Fotos visibles antes de pulsar "Ver más". */
const INITIAL_VISIBLE = 5;

type Props = {
  images: string[];
};

export function GalleryGrid({ images }: Props) {
  const [showAll, setShowAll] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const reals = images.filter(Boolean);
  const placeholderMode = reals.length === 0;

  const displayImages =
    placeholderMode
      ? images
      : reals.length > INITIAL_VISIBLE && !showAll
        ? reals.slice(0, INITIAL_VISIBLE)
        : reals;

  const canExpand = reals.length > INITIAL_VISIBLE;
  const hiddenCount = reals.length - INITIAL_VISIBLE;

  useEffect(() => {
    if (lightboxIndex === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxIndex]);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) => {
      if (i === null || reals.length === 0) return null;
      return (i - 1 + reals.length) % reals.length;
    });
  }, [reals.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((i) => {
      if (i === null || reals.length === 0) return null;
      return (i + 1) % reals.length;
    });
  }, [reals.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, closeLightbox, goPrev, goNext]);

  const openAt = (indexInReals: number) => {
    if (reals.length === 0) return;
    setLightboxIndex(indexInReals);
  };

  const currentSrc =
    lightboxIndex !== null && reals[lightboxIndex] ? reals[lightboxIndex] : null;

  return (
    <>
      <ul
        className="mt-10 grid auto-rows-[minmax(180px,1fr)] grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4"
        aria-label={`Galería de ${siteConfig.nombreEmprendimiento}`}
      >
        {displayImages.map((src, i) => {
          const isFeatured = i % 7 === 0;
          const liClass = `group overflow-hidden rounded-2xl shadow-card ring-1 ring-border ${
            isFeatured ? "row-span-2 aspect-square md:col-span-2" : "aspect-square"
          }`;

          const alt = `${siteConfig.nombreEmprendimiento} · imagen ${i + 1} de ${displayImages.length}`;

          return (
            <li key={`${src || "ph"}-${i}`} className={liClass}>
              {src ? (
                <button
                  type="button"
                  className="relative block h-full min-h-[180px] w-full cursor-zoom-in text-left outline-none transition ring-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-soft"
                  onClick={() => openAt(i)}
                  aria-haspopup="dialog"
                  aria-label={`Ampliar: ${alt}`}
                >
                  <SmartImage
                    src={src}
                    alt={alt}
                    placeholderText={siteConfig.nombreEmprendimiento}
                    className="h-full w-full"
                    imgClassName="transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                </button>
              ) : (
                <div className="relative h-full min-h-[180px] w-full">
                  <SmartImage
                    src={src}
                    alt={alt}
                    placeholderText={siteConfig.nombreEmprendimiento}
                    className="h-full w-full"
                    imgClassName="transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {canExpand && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-ink shadow-card transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-soft"
          >
            {showAll ? (
              "Ver menos"
            ) : (
              <>
                Ver más
                {hiddenCount > 0 ? (
                  <span className="ml-1 text-ink/70">
                    ({hiddenCount} {hiddenCount === 1 ? "foto más" : "fotos más"})
                  </span>
                ) : null}
              </>
            )}
          </button>
        </div>
      )}

      {currentSrc && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Vista ampliada de la galería"
          onClick={closeLightbox}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white outline-none ring-white transition hover:bg-white/20 focus-visible:ring-2"
            onClick={(e) => {
              e.stopPropagation();
              closeLightbox();
            }}
            aria-label="Cerrar vista ampliada"
          >
            <Icon name="close" size={28} className="text-white" decorative />
          </button>

          {reals.length > 1 && (
            <>
              <button
                type="button"
                className="absolute left-2 top-1/2 z-[101] -translate-y-1/2 rounded-full bg-white/10 p-3 text-white outline-none ring-white transition hover:bg-white/20 focus-visible:ring-2 md:left-6"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                aria-label="Foto anterior"
              >
                <span className="inline-block rotate-180">
                  <Icon name="arrow-right" size={24} className="text-white" decorative />
                </span>
              </button>
              <button
                type="button"
                className="absolute right-2 top-1/2 z-[101] -translate-y-1/2 rounded-full bg-white/10 p-3 text-white outline-none ring-white transition hover:bg-white/20 focus-visible:ring-2 md:right-6"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                aria-label="Foto siguiente"
              >
                <Icon name="arrow-right" size={24} className="text-white" decorative />
              </button>
            </>
          )}

          <div
            className="relative mx-auto flex max-h-[min(90vh,900px)] max-w-[min(96vw,1200px)] items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentSrc}
              alt={`${siteConfig.nombreEmprendimiento} · foto ${lightboxIndex + 1} de ${reals.length}`}
              className="max-h-[min(90vh,900px)] max-w-full object-contain shadow-2xl"
            />
          </div>

          {reals.length > 1 && (
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-1.5 text-sm text-white/90">
              {lightboxIndex + 1} / {reals.length}
            </p>
          )}
        </div>
      )}
    </>
  );
}

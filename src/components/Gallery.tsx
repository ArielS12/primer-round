import { getFinalGalleryImages } from "@/lib/getGalleryImages";
import { GalleryGrid } from "@/components/GalleryGrid";

/**
 * Galería con N dinámico. Server Component: lee `public/uploads/` en runtime
 * para detectar cuántas `gallery-N.jpg` existen.
 *
 * La cuadrícula interactiva (Ver más + lightbox) vive en `GalleryGrid` (client).
 */
export function Gallery() {
  const raw = getFinalGalleryImages();
  const images = raw.length > 0 ? raw : ["", "", ""];

  return (
    <section
      id="galeria"
      aria-labelledby="galeria-title"
      className="bg-soft py-16 md:py-24"
    >
      <div className="mx-auto max-w-content px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Galería
          </p>
          <h2
            id="galeria-title"
            className="mt-3 font-serif text-3xl text-ink md:text-4xl"
          >
            Conocé nuestro espacio
          </h2>
          <p className="mt-4 text-base text-ink/75">
            Un ambiente cuidado en cada detalle, pensado para que te sientas en casa.
          </p>
        </div>

        <GalleryGrid images={images} />
      </div>
    </section>
  );
}

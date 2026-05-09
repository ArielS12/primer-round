import { siteConfig } from "@/config/siteConfig";
import { getFinalGalleryImages } from "@/lib/getGalleryImages";
import { SmartImage } from "@/components/ui/SmartImage";

/**
 * Galería con N dinámico. Server Component: lee `public/uploads/` en runtime
 * para detectar cuántas `gallery-N.jpg` existen.
 */
export function Gallery() {
  const images = getFinalGalleryImages();

  // Si no hay imágenes locales NI URLs declaradas, mostramos 3 placeholders
  // elegantes para que la sección igual respire visualmente.
  const finalList = images.length > 0 ? images : ["", "", ""];

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

        <ul
          className="mt-10 grid auto-rows-[minmax(180px,1fr)] grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4"
          aria-label={`Galería de ${siteConfig.nombreEmprendimiento}`}
        >
          {finalList.map((src, i) => {
            const isFeatured = i % 7 === 0;
            return (
              <li
                key={`${src}-${i}`}
                className={`group overflow-hidden rounded-2xl shadow-card ring-1 ring-border ${
                  isFeatured ? "row-span-2 aspect-square md:col-span-2" : "aspect-square"
                }`}
              >
                <SmartImage
                  src={src}
                  alt={`${siteConfig.nombreEmprendimiento} · imagen ${i + 1} de ${finalList.length}`}
                  placeholderText={`${siteConfig.nombreEmprendimiento}`}
                  className="h-full w-full"
                  imgClassName="transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

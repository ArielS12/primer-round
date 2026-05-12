import { siteConfig } from "@/config/siteConfig";
import { SmartImage } from "@/components/ui/SmartImage";

/**
 * Sección "Sobre la escuela": cuenta la historia y la identidad del club,
 * con una imagen destacada, 3 párrafos de copy y una tira de 4 hitos.
 *
 * Todo el contenido se edita desde `siteConfig.historia`. La imagen se toma
 * del campo `historia.imagen` (path local en `/uploads/*.jpg`).
 */
export function About() {
  const { historia, nombreEmprendimiento } = siteConfig;

  return (
    <section
      id="sobre-nosotros"
      aria-labelledby="sobre-nosotros-title"
      className="bg-soft py-16 md:py-24"
    >
      <div className="mx-auto max-w-content px-4 md:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-soft ring-1 ring-border md:aspect-[5/4] lg:aspect-[4/5]">
              <SmartImage
                src={historia.imagen}
                alt={`${nombreEmprendimiento} · entrenamiento en la escuela`}
                placeholderText={nombreEmprendimiento}
                sizes="(max-width: 1024px) 100vw, 600px"
                className="h-full w-full"
              />
            </div>
          </div>

          <div className="lg:col-span-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {historia.eyebrow}
            </p>
            <h2
              id="sobre-nosotros-title"
              className="mt-3 font-serif text-3xl text-ink md:text-4xl"
            >
              {historia.titulo}
            </h2>

            <div className="mt-5 space-y-4 text-base leading-relaxed text-ink/80">
              {historia.parrafos.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-4">
              {historia.hitos.map((h) => (
                <div
                  key={h.etiqueta}
                  className="rounded-2xl border border-border bg-surface p-4 shadow-card"
                >
                  <dt className="text-xs font-medium uppercase tracking-[0.16em] text-ink/60">
                    {h.etiqueta}
                  </dt>
                  <dd className="mt-1 font-serif text-2xl text-primary md:text-3xl">
                    {h.valor}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

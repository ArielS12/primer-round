import { siteConfig } from "@/config/siteConfig";
import { Icon, type IconName } from "@/components/ui/Icon";

const ICON_FALLBACK: IconName = "sparkle";

export function Benefits() {
  const { beneficios, publicoObjetivo } = siteConfig;

  return (
    <section
      id="beneficios"
      aria-labelledby="beneficios-title"
      className="bg-surface py-16 md:py-24"
    >
      <div className="mx-auto max-w-content px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Por qué elegirnos
          </p>
          <h2
            id="beneficios-title"
            className="mt-3 font-serif text-3xl text-ink md:text-4xl"
          >
            Pensado para {publicoObjetivo.toLowerCase()}
          </h2>
          <p className="mt-4 text-base text-ink/75">
            Cuidamos cada detalle para que tu experiencia sea sencilla, profesional y memorable.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {beneficios.map((b) => (
            <li
              key={b.titulo}
              className="group rounded-2xl border border-border bg-surface p-6 shadow-card transition hover:-translate-y-1 hover:shadow-soft"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-secondary text-primary">
                <Icon name={(b.icono as IconName) || ICON_FALLBACK} size={24} />
              </span>
              <h3 className="mt-5 font-serif text-xl text-ink">{b.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{b.descripcion}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

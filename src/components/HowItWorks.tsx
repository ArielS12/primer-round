import { siteConfig } from "@/config/siteConfig";
import { LinkButton } from "@/components/ui/Button";

export function HowItWorks() {
  const { comoFunciona, branding } = siteConfig;

  return (
    <section
      id="como-funciona"
      aria-labelledby="como-funciona-title"
      className="bg-surface py-16 md:py-24"
    >
      <div className="mx-auto max-w-content px-4 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Cómo funciona
          </p>
          <h2
            id="como-funciona-title"
            className="mt-3 font-serif text-3xl text-ink md:text-4xl"
          >
            Reservar es muy simple
          </h2>
          <p className="mt-4 text-base text-ink/75">
            En 3 pasos tenés tu turno listo y confirmado por WhatsApp.
          </p>
        </div>

        <ol className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {comoFunciona.map((step) => (
            <li
              key={step.paso}
              className="relative flex flex-col rounded-2xl border border-border bg-soft p-6 md:p-8"
            >
              <span
                aria-hidden="true"
                className="grid h-12 w-12 place-items-center rounded-full bg-primary font-serif text-xl text-primary-contrast"
              >
                {step.paso}
              </span>
              <h3 className="mt-5 font-serif text-xl text-ink">{step.titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{step.descripcion}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex justify-center">
          <LinkButton href="#reservas" variant="primary" size="lg">
            {branding.ctaPrincipal}
          </LinkButton>
        </div>
      </div>
    </section>
  );
}

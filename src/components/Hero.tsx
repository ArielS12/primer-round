import { siteConfig } from "@/config/siteConfig";
import { resolveImageSource } from "@/lib/images";
import { LinkButton } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import { Icon } from "@/components/ui/Icon";

export function Hero() {
  const { branding, propuestaValor, ciudadPais, tipoEmprendimiento } = siteConfig;

  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden"
    >
      <div className="mx-auto grid max-w-content items-center gap-10 px-4 py-12 md:gap-12 md:px-8 md:py-20 lg:grid-cols-12 lg:py-24">
        <div className="lg:col-span-6">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
            <Icon name="sparkle" size={14} />
            {tipoEmprendimiento}
          </p>

          <h1
            id="hero-title"
            className="mt-5 font-serif text-4xl leading-[1.05] text-ink sm:text-5xl md:text-6xl"
          >
            {propuestaValor}
          </h1>

          <p className="mt-5 max-w-xl text-base text-ink/75 md:text-lg">
            {siteConfig.problemaQueResuelve}. Te recibimos en {ciudadPais} con un
            servicio pensado para vos.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <LinkButton href="#reservas" variant="primary" size="lg" className="w-full sm:w-auto">
              {branding.ctaPrincipal}
              <Icon name="arrow-right" size={18} />
            </LinkButton>
            <LinkButton href="#reservas" variant="secondary" size="lg" className="w-full sm:w-auto">
              {branding.ctaSecundario}
            </LinkButton>
          </div>

          <ul className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink/70">
            <li className="flex items-center gap-2">
              <Icon name="check" size={16} className="text-primary" />
              Reserva en 1 minuto
            </li>
            <li className="flex items-center gap-2">
              <Icon name="check" size={16} className="text-primary" />
              Confirmación por WhatsApp
            </li>
            <li className="flex items-center gap-2">
              <Icon name="check" size={16} className="text-primary" />
              Atención personalizada
            </li>
          </ul>
        </div>

        <div className="relative lg:col-span-6">
          <div
            aria-hidden="true"
            className="absolute -inset-4 -z-10 rounded-[2rem] bg-soft blur-2xl"
          />
          <SmartImage
            src={resolveImageSource("hero")}
            fallbackSrc={siteConfig.media.heroUrl || undefined}
            alt={`${siteConfig.nombreEmprendimiento} · ${tipoEmprendimiento}`}
            placeholderText={siteConfig.nombreEmprendimiento}
            priority
            sizes="(max-width: 1024px) 100vw, 600px"
            className="aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-soft ring-1 ring-border md:aspect-[5/6] lg:aspect-[4/5]"
          />
        </div>
      </div>
    </section>
  );
}

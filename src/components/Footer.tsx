import { siteConfig } from "@/config/siteConfig";
import { formatFranjas } from "@/lib/validation";
import { Icon, type IconName } from "@/components/ui/Icon";

const SOCIAL_ICON: Record<string, IconName> = {
  Instagram: "instagram",
  Facebook: "facebook",
  TikTok: "tiktok",
  YouTube: "youtube",
  X: "x",
  LinkedIn: "linkedin",
};

export function Footer() {
  const { contacto, redes, legales, nombreEmprendimiento, ciudadPais, horariosAtencion } =
    siteConfig;
  const year = new Date().getFullYear();

  return (
    <footer
      id="footer"
      className="bg-ink text-surface"
      aria-labelledby="footer-title"
    >
      <div className="mx-auto grid max-w-content gap-10 px-4 py-14 md:grid-cols-3 md:px-8 md:py-16">
        <div>
          <h3
            id="footer-title"
            className="font-serif text-2xl text-surface"
          >
            {nombreEmprendimiento}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-surface/70">
            {siteConfig.propuestaValor}
          </p>
          <p className="mt-4 text-sm text-surface/70">
            {ciudadPais}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-surface/80">
            Contacto
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-surface/80">
            <li className="flex items-start gap-2">
              <Icon name="whatsapp" size={16} className="mt-0.5" />
              <a
                href={`https://wa.me/${contacto.whatsappAdmin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-surface"
              >
                +{contacto.whatsappAdmin}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Icon name="map" size={16} className="mt-0.5" />
              <span>
                {contacto.direccion} · {ciudadPais}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Icon name="clock" size={16} className="mt-0.5" />
              <span>
                {horariosAtencion.dias.join(", ")} · {formatFranjas()}
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-surface/80">
            Seguinos
          </h4>
          {redes.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-3">
              {redes.map((r) => (
                <li key={r.url}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={r.nombre}
                    className="grid h-10 w-10 place-items-center rounded-full bg-surface/10 transition hover:bg-surface/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-surface"
                  >
                    <Icon
                      name={SOCIAL_ICON[r.nombre] || "instagram"}
                      size={18}
                      decorative={false}
                      title={r.nombre}
                    />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-surface/60">Próximamente.</p>
          )}

          <h4 className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-surface/80">
            Legales
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-surface/70">
            <li>
              <a href={legales.terminosUrl} className="hover:text-surface">
                Términos y condiciones
              </a>
            </li>
            <li>
              <a href={legales.politicaPrivacidadUrl} className="hover:text-surface">
                Política de privacidad
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-surface/10">
        <div className="mx-auto flex max-w-content flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-surface/60 md:flex-row md:px-8">
          <p>
            © {year} {legales.razonSocial}. Todos los derechos reservados.
          </p>
          <p>Hecho con cuidado en {ciudadPais}.</p>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useEffect, useState } from "react";

import { siteConfig } from "@/config/siteConfig";
import { resolveImageSource } from "@/lib/images";
import { Icon } from "@/components/ui/Icon";
import { LinkButton } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";

const NAV_LINKS = [
  { href: "#beneficios", label: "Beneficios" },
  { href: "#como-funciona", label: "Cómo funciona" },
  { href: "#galeria", label: "Galería" },
  { href: "#reservas", label: "Reservar" },
  { href: "#contacto", label: "Contacto" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        scrolled
          ? "bg-surface/85 backdrop-blur shadow-soft"
          : "bg-surface/60 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-content items-center justify-between gap-4 px-4 md:h-20 md:px-8">
        <a
          href="#inicio"
          className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md"
          aria-label={`${siteConfig.nombreEmprendimiento} · Ir al inicio`}
        >
          <span className="relative block h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-border md:h-11 md:w-11">
            <SmartImage
              src={resolveImageSource("logo")}
              fallbackSrc={siteConfig.media.logoUrl || undefined}
              alt={`Logo ${siteConfig.nombreEmprendimiento}`}
              placeholderText={siteConfig.nombreEmprendimiento}
              priority
              sizes="44px"
              className="h-full w-full"
            />
          </span>
          <span className="hidden font-serif text-lg leading-none text-ink sm:block md:text-xl">
            {siteConfig.nombreEmprendimiento}
          </span>
        </a>

        <nav aria-label="Navegación principal" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-sm">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-ink/80 transition hover:text-primary focus:outline-none focus-visible:text-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden lg:block">
          <LinkButton href="#reservas" variant="primary" size="md">
            {siteConfig.branding.ctaPrincipal}
          </LinkButton>
        </div>

        <button
          type="button"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className="grid h-11 w-11 place-items-center rounded-full text-ink hover:bg-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-primary lg:hidden"
        >
          <Icon name={open ? "close" : "menu"} size={22} />
        </button>
      </div>

      <div
        id="mobile-nav"
        className={`overflow-hidden border-t border-border bg-surface transition-[max-height,opacity] duration-300 lg:hidden ${
          open ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav aria-label="Navegación móvil" className="mx-auto max-w-content px-4 py-4">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-3 text-base text-ink/90 hover:bg-soft focus:outline-none focus-visible:bg-soft"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-3 px-1">
            <LinkButton
              href="#reservas"
              variant="primary"
              size="lg"
              onClick={() => setOpen(false)}
              className="w-full"
            >
              {siteConfig.branding.ctaPrincipal}
            </LinkButton>
          </div>
        </nav>
      </div>
    </header>
  );
}

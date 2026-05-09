"use client";

import { useState, type FormEvent } from "react";

import { siteConfig } from "@/config/siteConfig";
import { Button } from "@/components/ui/Button";
import { Checkbox, Field, TextArea, TextInput } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { buildWhatsAppContactMessage, openWhatsApp } from "@/lib/whatsapp";
import {
  validateContact,
  type ContactFields,
  type ValidationErrors,
} from "@/lib/validation";

type FormState = {
  nombre: string;
  telefono: string;
  mensaje: string;
  consentimiento: boolean;
};

const INITIAL: FormState = {
  nombre: "",
  telefono: "",
  mensaje: "",
  consentimiento: false,
};

export function Contact() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<ValidationErrors<ContactFields>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as ContactFields]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
    if (status === "success") setStatus("idle");
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = validateContact(form);
    if (Object.keys(v).length > 0) {
      setErrors(v);
      const firstKey = Object.keys(v)[0];
      const el = document.getElementById(`contacto-${firstKey}`);
      el?.focus();
      return;
    }
    setStatus("submitting");
    const message = buildWhatsAppContactMessage({
      nombre: form.nombre.trim(),
      telefono: form.telefono.trim(),
      mensaje: form.mensaje.trim(),
    });
    openWhatsApp(siteConfig.contacto.whatsappAdmin, message);
    setStatus("success");
  };

  const { contacto, ciudadPais, redes } = siteConfig;
  const instagram = redes.find((r) => r.nombre === "Instagram");
  const instagramHandle = instagram
    ? instagram.url.replace(/\/+$/, "").split("/").pop() || ""
    : "";

  return (
    <section
      id="contacto"
      aria-labelledby="contacto-title"
      className="bg-surface py-16 md:py-24"
    >
      <div className="mx-auto grid max-w-content gap-10 px-4 md:px-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Contáctenos
          </p>
          <h2
            id="contacto-title"
            className="mt-3 font-serif text-3xl text-ink md:text-4xl"
          >
            ¿Tenés alguna duda? Te respondemos por WhatsApp
          </h2>
          <p className="mt-4 text-base text-ink/75">
            Dejanos tu mensaje y abrimos un chat directo con vos. Atendemos personalmente cada
            consulta.
          </p>

          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex items-start gap-3 text-ink/85">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                <Icon name="whatsapp" size={18} />
              </span>
              <div>
                <p className="font-medium text-ink">WhatsApp</p>
                <a
                  href={`https://wa.me/${contacto.whatsappAdmin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink/75 hover:text-primary"
                >
                  +{contacto.whatsappAdmin}
                </a>
              </div>
            </li>
            {instagram && (
              <li className="flex items-start gap-3 text-ink/85">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                  <Icon name="instagram" size={18} />
                </span>
                <div>
                  <p className="font-medium text-ink">Instagram</p>
                  <a
                    href={instagram.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink/75 hover:text-primary"
                  >
                    @{instagramHandle}
                  </a>
                </div>
              </li>
            )}
            <li className="flex items-start gap-3 text-ink/85">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                <Icon name="map" size={18} />
              </span>
              <div>
                <p className="font-medium text-ink">Dónde estamos</p>
                <p className="text-ink/75">
                  {contacto.direccion} · {ciudadPais}
                </p>
              </div>
            </li>
          </ul>
        </div>

        <form
          noValidate
          onSubmit={onSubmit}
          className="rounded-3xl border border-border bg-soft p-6 shadow-soft md:p-8 lg:col-span-7"
        >
          <fieldset disabled={status === "submitting"} className="space-y-5">
            <legend className="sr-only">Formulario de contacto</legend>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Nombre"
                htmlFor="contacto-nombre"
                error={errors.nombre}
                required
              >
                <TextInput
                  id="contacto-nombre"
                  name="nombre"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Tu nombre"
                  value={form.nombre}
                  onChange={(e) => update("nombre", e.target.value)}
                  error={Boolean(errors.nombre)}
                />
              </Field>

              <Field
                label="Teléfono"
                htmlFor="contacto-telefono"
                error={errors.telefono}
                required
              >
                <TextInput
                  id="contacto-telefono"
                  name="telefono"
                  type="tel"
                  required
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="+54 9 11 1234 5678"
                  value={form.telefono}
                  onChange={(e) => update("telefono", e.target.value)}
                  error={Boolean(errors.telefono)}
                />
              </Field>
            </div>

            <Field
              label="Mensaje"
              htmlFor="contacto-mensaje"
              error={errors.mensaje}
              required
            >
              <TextArea
                id="contacto-mensaje"
                name="mensaje"
                rows={5}
                required
                placeholder="Contanos en qué podemos ayudarte..."
                value={form.mensaje}
                onChange={(e) => update("mensaje", e.target.value)}
                error={Boolean(errors.mensaje)}
              />
            </Field>

            <Checkbox
              id="contacto-consentimiento"
              checked={form.consentimiento}
              onChange={(e) => update("consentimiento", e.target.checked)}
              error={errors.consentimiento}
              label={
                <span className="text-ink/85">
                  Acepto que mis datos se usen para responder mi consulta por WhatsApp.{" "}
                  <span className="text-muted">(Requerido)</span>
                </span>
              }
            />

            {status === "success" && (
              <div
                role="status"
                className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
              >
                <Icon name="check" size={20} className="mt-0.5 text-green-700" />
                <div>
                  <p className="font-medium">¡Te abrimos WhatsApp!</p>
                  <p className="mt-1">
                    Si no se abrió,{" "}
                    <button
                      type="submit"
                      className="underline underline-offset-2 hover:text-green-900"
                    >
                      tocá acá para reintentar
                    </button>
                    .
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit" variant="whatsapp" size="lg">
                <Icon name="whatsapp" size={20} />
                Enviar por WhatsApp
              </Button>
            </div>
          </fieldset>
        </form>
      </div>
    </section>
  );
}

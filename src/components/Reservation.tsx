"use client";

import { useMemo, useState, type FormEvent } from "react";

import { siteConfig } from "@/config/siteConfig";
import { Button } from "@/components/ui/Button";
import { Checkbox, Field, Select, TextArea, TextInput } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import {
  buildWhatsAppReservationMessage,
  formatHumanDate,
  openWhatsApp,
} from "@/lib/whatsapp";
import {
  formatFranjas,
  generateTimeSlots,
  todayIso,
  validateReservation,
  type ValidationErrors,
  type ReservationFields,
} from "@/lib/validation";

type FormState = {
  nombre: string;
  telefono: string;
  servicio: string;
  fecha: string;
  hora: string;
  comentarios: string;
  consentimiento: boolean;
};

const INITIAL: FormState = {
  nombre: "",
  telefono: "",
  servicio: "",
  fecha: "",
  hora: "",
  comentarios: "",
  consentimiento: false,
};

export function Reservation() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<ValidationErrors<ReservationFields>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const slots = useMemo(() => generateTimeSlots(), []);
  const minDate = useMemo(() => todayIso(), []);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as ReservationFields]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
    if (status === "success") setStatus("idle");
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = validateReservation({
      nombre: form.nombre,
      telefono: form.telefono,
      servicio: form.servicio,
      fecha: form.fecha,
      hora: form.hora,
      consentimiento: form.consentimiento,
    });
    if (Object.keys(v).length > 0) {
      setErrors(v);
      const firstKey = Object.keys(v)[0];
      const el = document.getElementById(`reserva-${firstKey}`);
      el?.focus();
      return;
    }
    setStatus("submitting");
    const message = buildWhatsAppReservationMessage({
      nombre: form.nombre.trim(),
      telefono: form.telefono.trim(),
      servicio: form.servicio,
      fecha: form.fecha,
      hora: form.hora,
      comentarios: form.comentarios.trim(),
    });
    openWhatsApp(siteConfig.contacto.whatsappAdmin, message);
    setStatus("success");
  };

  const { servicios, horariosAtencion, branding } = siteConfig;

  return (
    <section
      id="reservas"
      aria-labelledby="reservas-title"
      className="bg-soft py-16 md:py-24"
    >
      <div className="mx-auto grid max-w-content gap-10 px-4 md:px-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Reservá tu turno
          </p>
          <h2
            id="reservas-title"
            className="mt-3 font-serif text-3xl text-ink md:text-4xl"
          >
            Elegí día y horario, te confirmamos por WhatsApp
          </h2>
          <p className="mt-4 text-base text-ink/75">
            Atendemos {horariosAtencion.dias.join(", ")} de{" "}
            <strong className="text-ink">{formatFranjas()}</strong>, con turnos
            cada {horariosAtencion.intervaloMin} minutos.
          </p>

          <ul className="mt-6 space-y-3 text-sm text-ink/80">
            <li className="flex items-start gap-3">
              <Icon name="check" size={18} className="mt-0.5 text-primary" />
              <span>Tus datos viajan directo al WhatsApp del estudio.</span>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="check" size={18} className="mt-0.5 text-primary" />
              <span>Si necesitás otro horario, escribinos y lo coordinamos.</span>
            </li>
            <li className="flex items-start gap-3">
              <Icon name="check" size={18} className="mt-0.5 text-primary" />
              <span>Recordá: la reserva se confirma desde el chat.</span>
            </li>
          </ul>
        </div>

        <form
          noValidate
          onSubmit={onSubmit}
          className="rounded-3xl border border-border bg-surface p-6 shadow-soft md:p-8 lg:col-span-7"
          aria-describedby="reserva-disclaimer"
        >
          <fieldset disabled={status === "submitting"} className="space-y-5">
            <legend className="sr-only">Formulario de reserva</legend>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Nombre"
                htmlFor="reserva-nombre"
                error={errors.nombre}
                required
              >
                <TextInput
                  id="reserva-nombre"
                  name="nombre"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Tu nombre"
                  value={form.nombre}
                  onChange={(e) => update("nombre", e.target.value)}
                  aria-invalid={Boolean(errors.nombre)}
                  aria-describedby={errors.nombre ? "reserva-nombre-error" : undefined}
                  error={Boolean(errors.nombre)}
                />
              </Field>

              <Field
                label="Teléfono"
                htmlFor="reserva-telefono"
                error={errors.telefono}
                hint="Lo usamos para confirmarte el turno."
                required
              >
                <TextInput
                  id="reserva-telefono"
                  name="telefono"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  required
                  placeholder="+54 9 11 1234 5678"
                  value={form.telefono}
                  onChange={(e) => update("telefono", e.target.value)}
                  aria-invalid={Boolean(errors.telefono)}
                  aria-describedby={
                    errors.telefono ? "reserva-telefono-error" : "reserva-telefono-hint"
                  }
                  error={Boolean(errors.telefono)}
                />
              </Field>
            </div>

            <Field
              label="Servicio"
              htmlFor="reserva-servicio"
              error={errors.servicio}
              required
            >
              <Select
                id="reserva-servicio"
                name="servicio"
                required
                value={form.servicio}
                onChange={(e) => update("servicio", e.target.value)}
                aria-invalid={Boolean(errors.servicio)}
                error={Boolean(errors.servicio)}
              >
                <option value="">— Elegí un servicio —</option>
                {servicios.map((s) => (
                  <option key={s.nombre} value={s.nombre}>
                    {s.nombre} · {s.precio}
                  </option>
                ))}
              </Select>
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Fecha"
                htmlFor="reserva-fecha"
                error={errors.fecha}
                required
              >
                <TextInput
                  id="reserva-fecha"
                  name="fecha"
                  type="date"
                  required
                  min={minDate}
                  value={form.fecha}
                  onChange={(e) => update("fecha", e.target.value)}
                  aria-invalid={Boolean(errors.fecha)}
                  error={Boolean(errors.fecha)}
                />
              </Field>

              <Field
                label="Hora"
                htmlFor="reserva-hora"
                error={errors.hora}
                required
              >
                <Select
                  id="reserva-hora"
                  name="hora"
                  required
                  value={form.hora}
                  onChange={(e) => update("hora", e.target.value)}
                  aria-invalid={Boolean(errors.hora)}
                  error={Boolean(errors.hora)}
                >
                  <option value="">— Elegí un horario —</option>
                  {slots.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <Field
              label="Comentarios"
              htmlFor="reserva-comentarios"
              hint="Opcional · contanos si tenés alguna preferencia."
            >
              <TextArea
                id="reserva-comentarios"
                name="comentarios"
                rows={3}
                placeholder="Ej: prefiero turnos por la mañana, soy alérgico a..."
                value={form.comentarios}
                onChange={(e) => update("comentarios", e.target.value)}
              />
            </Field>

            <Checkbox
              id="reserva-consentimiento"
              checked={form.consentimiento}
              onChange={(e) => update("consentimiento", e.target.checked)}
              error={errors.consentimiento}
              label={
                <span className="text-ink/85">
                  Acepto que mis datos se usen para coordinar mi reserva por WhatsApp.{" "}
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
                  <p className="font-medium">¡Listo! Te abrimos WhatsApp.</p>
                  <p className="mt-1">
                    Si no se abrió,{" "}
                    <button
                      type="submit"
                      className="underline underline-offset-2 hover:text-green-900"
                    >
                      tocá acá para reintentar
                    </button>
                    . Confirmá enviando el mensaje desde tu WhatsApp.
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p
                id="reserva-disclaimer"
                className="text-xs text-muted sm:max-w-md"
              >
                Al continuar abriremos WhatsApp con tu reserva prellenada.
                {form.fecha && form.hora && (
                  <>
                    {" "}
                    Turno: <strong>{formatHumanDate(form.fecha)}</strong> a las{" "}
                    <strong>{form.hora}</strong>.
                  </>
                )}
              </p>
              <Button type="submit" variant="whatsapp" size="lg" className="sm:shrink-0">
                <Icon name="whatsapp" size={20} />
                {branding.ctaPrincipal}
              </Button>
            </div>
          </fieldset>
        </form>
      </div>
    </section>
  );
}

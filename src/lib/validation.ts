/**
 * Validaciones de formularios (reserva y contacto).
 * Sin dependencias externas. Mensajes en español.
 */

import { siteConfig } from "@/config/siteConfig";

export type ValidationErrors<T extends string> = Partial<Record<T, string>>;

/* -------------------------------------------------------------------------- */
/*                            Validadores atómicos                            */
/* -------------------------------------------------------------------------- */

export function isNonEmpty(value: string | undefined | null): boolean {
  return typeof value === "string" && value.trim().length >= 2;
}

/**
 * Validación básica de teléfono: 7–15 dígitos, permitiendo `+`, espacios,
 * guiones y paréntesis como separadores.
 */
export function isValidPhone(value: string): boolean {
  if (!value) return false;
  const digits = value.replace(/\D+/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

/**
 * Acepta YYYY-MM-DD y verifica que NO sea anterior a hoy.
 */
export function isFutureOrTodayDate(isoDate: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return false;
  const [y, m, d] = isoDate.split("-").map((n) => Number.parseInt(n, 10));
  const candidate = new Date(y, m - 1, d);
  if (Number.isNaN(candidate.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return candidate.getTime() >= today.getTime();
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map((n) => Number.parseInt(n, 10));
  return h * 60 + m;
}

/**
 * Verifica que `HH:mm` esté dentro de cualquiera de las franjas horarias
 * configuradas y sea múltiplo del intervalo desde el inicio de SU franja.
 */
export function isWithinBusinessHours(time: string): boolean {
  if (!/^\d{2}:\d{2}$/.test(time)) return false;
  const { franjas, intervaloMin } = siteConfig.horariosAtencion;
  const t = timeToMinutes(time);
  for (const franja of franjas) {
    const start = timeToMinutes(franja.inicio);
    const end = timeToMinutes(franja.fin);
    if (t >= start && t <= end && (t - start) % intervaloMin === 0) {
      return true;
    }
  }
  return false;
}

/* -------------------------------------------------------------------------- */
/*                          Validación: Reserva                               */
/* -------------------------------------------------------------------------- */

export type ReservationFields =
  | "nombre"
  | "telefono"
  | "servicio"
  | "fecha"
  | "hora"
  | "consentimiento";

export function validateReservation(input: {
  nombre: string;
  telefono: string;
  servicio: string;
  fecha: string;
  hora: string;
  consentimiento: boolean;
}): ValidationErrors<ReservationFields> {
  const errors: ValidationErrors<ReservationFields> = {};

  if (!isNonEmpty(input.nombre)) {
    errors.nombre = "Ingresá tu nombre (mínimo 2 caracteres).";
  }
  if (!isValidPhone(input.telefono)) {
    errors.telefono = "Ingresá un teléfono válido (7 a 15 dígitos).";
  }
  if (!isNonEmpty(input.servicio)) {
    errors.servicio = "Elegí un servicio.";
  }
  if (!isFutureOrTodayDate(input.fecha)) {
    errors.fecha = "Elegí una fecha igual o posterior a hoy.";
  }
  if (!isWithinBusinessHours(input.hora)) {
    errors.hora = `Elegí un horario dentro de nuestra agenda (${formatFranjas()}).`;
  }
  if (!input.consentimiento) {
    errors.consentimiento = "Necesitamos tu consentimiento para continuar.";
  }

  return errors;
}

/* -------------------------------------------------------------------------- */
/*                          Validación: Contacto                              */
/* -------------------------------------------------------------------------- */

export type ContactFields = "nombre" | "telefono" | "mensaje" | "consentimiento";

export function validateContact(input: {
  nombre: string;
  telefono: string;
  mensaje: string;
  consentimiento: boolean;
}): ValidationErrors<ContactFields> {
  const errors: ValidationErrors<ContactFields> = {};

  if (!isNonEmpty(input.nombre)) {
    errors.nombre = "Ingresá tu nombre.";
  }
  if (!isValidPhone(input.telefono)) {
    errors.telefono = "Ingresá un teléfono válido.";
  }
  if (!input.mensaje || input.mensaje.trim().length < 5) {
    errors.mensaje = "Contanos un poco más (mínimo 5 caracteres).";
  }
  if (!input.consentimiento) {
    errors.consentimiento = "Necesitamos tu consentimiento para continuar.";
  }

  return errors;
}

/* -------------------------------------------------------------------------- */
/*                          Helpers para horarios                             */
/* -------------------------------------------------------------------------- */

/**
 * Genera todos los slots de tiempo disponibles según la configuración,
 * combinando todas las franjas horarias configuradas.
 * Ej: ["10:00","11:00","12:00","19:00","20:00","21:00"].
 */
export function generateTimeSlots(): string[] {
  const { franjas, intervaloMin } = siteConfig.horariosAtencion;
  const slots: string[] = [];
  for (const franja of franjas) {
    const start = timeToMinutes(franja.inicio);
    const end = timeToMinutes(franja.fin);
    for (let t = start; t <= end; t += intervaloMin) {
      const h = Math.floor(t / 60).toString().padStart(2, "0");
      const m = (t % 60).toString().padStart(2, "0");
      slots.push(`${h}:${m}`);
    }
  }
  return slots;
}

/**
 * Devuelve un texto humano de las franjas horarias.
 * Ej: "10:00 a 12:00 y 19:00 a 21:00".
 */
export function formatFranjas(): string {
  const { franjas } = siteConfig.horariosAtencion;
  const partes = franjas.map((f) => `${f.inicio} a ${f.fin}`);
  if (partes.length === 0) return "";
  if (partes.length === 1) return partes[0];
  if (partes.length === 2) return `${partes[0]} y ${partes[1]}`;
  return `${partes.slice(0, -1).join(", ")} y ${partes.at(-1)}`;
}

/**
 * Devuelve la fecha de hoy en formato YYYY-MM-DD (zona horaria del navegador).
 */
export function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${y}-${m}-${day}`;
}

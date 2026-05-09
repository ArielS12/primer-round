/**
 * Helpers para construir y abrir enlaces de WhatsApp con mensajes prellenados.
 */

import { siteConfig } from "@/config/siteConfig";

export type ReservationData = {
  nombre: string;
  telefono: string;
  servicio: string;
  fecha: string; // YYYY-MM-DD
  hora: string; // HH:mm
  comentarios?: string;
};

export type ContactData = {
  nombre: string;
  telefono: string;
  mensaje: string;
};

/**
 * Sanitiza un número a formato internacional sin "+" ni espacios ni guiones.
 * Acepta "+54 9 11 1234 5678" => "5491112345678".
 */
export function normalizeWhatsAppNumber(raw: string): string {
  return (raw || "").replace(/\D+/g, "");
}

/**
 * Formatea una fecha YYYY-MM-DD a un formato humano (es-AR).
 * Si llega un valor inválido, lo devuelve tal cual.
 */
export function formatHumanDate(isoDate: string): string {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-").map((n) => Number.parseInt(n, 10));
  if (!y || !m || !d) return isoDate;
  const date = new Date(y, m - 1, d);
  if (Number.isNaN(date.getTime())) return isoDate;
  return new Intl.DateTimeFormat(siteConfig.idioma, {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function buildWhatsAppReservationMessage(data: ReservationData): string {
  const fechaHumana = formatHumanDate(data.fecha) || data.fecha;
  const lineas = [
    "📅 Nueva reserva",
    `Emprendimiento: ${siteConfig.nombreEmprendimiento}`,
    `👤 Nombre: ${data.nombre}`,
    `📞 Teléfono: ${data.telefono}`,
    `🛎 Servicio: ${data.servicio}`,
    `🗓 Fecha: ${fechaHumana}`,
    `⏰ Hora: ${data.hora}`,
    `📝 Comentarios: ${data.comentarios?.trim() ? data.comentarios.trim() : "—"}`,
  ];
  return lineas.join("\n");
}

export function buildWhatsAppContactMessage(data: ContactData): string {
  const lineas = [
    "📩 Nuevo contacto desde landing",
    `Emprendimiento: ${siteConfig.nombreEmprendimiento}`,
    `👤 Nombre: ${data.nombre}`,
    `📞 Teléfono: ${data.telefono}`,
    `💬 Mensaje: ${data.mensaje}`,
  ];
  return lineas.join("\n");
}

export function buildWhatsAppUrl(rawNumber: string, message: string): string {
  const number = normalizeWhatsAppNumber(rawNumber);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * Abre WhatsApp en una nueva pestaña / app.
 * Solo se debe llamar desde código de cliente (event handlers).
 */
export function openWhatsApp(rawNumber: string, message: string): void {
  const url = buildWhatsAppUrl(rawNumber, message);
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

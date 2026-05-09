"use client";

import { useEffect, useState, type CSSProperties } from "react";

/**
 * Intro animada de bienvenida:
 *   - Fondo negro full-screen.
 *   - Foto del ring de boxeo "a lo lejos" (atmósfera).
 *   - Dos guantes (foto real) entran desde los costados, chocan en el centro
 *     (efecto de impacto con flash) y se alejan hacia los lados.
 *   - En cuanto los guantes empiezan a alejarse tras el impacto, arranca el
 *     fade-out hacia la landing (no se espera a que salgan del todo).
 *
 * Reglas:
 *   - Se muestra una vez por sesión (sessionStorage).
 *   - Respeta `prefers-reduced-motion` (skip total).
 *   - Botón "Saltar" siempre disponible.
 *   - Bloquea el scroll del body mientras está activa.
 *   - El ring (`/uploads/intro-ring.jpg`) usa `mix-blend-mode: lighten` para
 *     fundir su fondo negro con el overlay.
 *   - Los guantes (`/uploads/intro-glove.png`) tienen canal alfa real
 *     (transparencia) generado por chroma-key del fondo negro original.
 */

/**
 * Duración total de la coreografía CSS (los keyframes de los guantes corren
 * durante este tiempo). Los guantes saldrían del todo al final, pero el fade
 * a la landing arranca antes (ver FADE_START_RATIO) para no esperar a la
 * salida completa.
 */
export const INTRO_ANIMATION_DURATION_MS = 8000;
const FADE_OUT_MS = 600;
const SESSION_KEY = "primer-round-intro-shown";

/** Momento del impacto (44 % del timeline = ~3520 ms). */
const IMPACT_AT_RATIO = 0.44;
const FLASH_DURATION_MS = 500;

/**
 * En qué punto del timeline arranca la transición a la landing.
 * 0.50 = justo después del rebote inicial post-impacto. Los guantes siguen
 * con su animación CSS (alejándose) mientras el overlay se desvanece.
 */
const FADE_START_RATIO = 0.5;

type Phase = "boot" | "playing" | "fading" | "done";

export function IntroAnimation() {
  /**
   * `boot`: evita pintar overlay negro en SSR / primera hidratación hasta saber
   * si debemos mostrar la intro (corrige flash negro de 1 frame).
   * IMPORTANTE: no guardar sessionStorage al **inicio** del efecto — en React 18
   * Strict Mode el efecto corre 2× en desarrollo; si marcamos "ya visto" antes
   * de tiempo, la segunda pasada cierra la intro al instante (pantalla negra ~1s).
   */
  const [phase, setPhase] = useState<Phase>("boot");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const params = new URLSearchParams(window.location.search);
    const forceReplay = params.has("replayIntro");

    let alreadyShown = false;
    try {
      alreadyShown = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      alreadyShown = false;
    }

    if (reduceMotion || (alreadyShown && !forceReplay)) {
      setPhase("done");
      return;
    }

    if (forceReplay) {
      try {
        sessionStorage.removeItem(SESSION_KEY);
      } catch {
        /* ignore */
      }
    }

    setPhase("playing");
    document.body.style.overflow = "hidden";

    // El fade arranca tras el impacto + un poco de rebote visible
    // (los guantes siguen su animación CSS durante el fade-out).
    const fadeStartMs = Math.round(INTRO_ANIMATION_DURATION_MS * FADE_START_RATIO);
    const fadeTimer = window.setTimeout(() => setPhase("fading"), fadeStartMs);
    const doneTimer = window.setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = "";
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
    }, fadeStartMs + FADE_OUT_MS);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(doneTimer);
      document.body.style.overflow = "";
    };
  }, []);

  const skip = () => {
    setPhase("fading");
    window.setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = "";
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
    }, FADE_OUT_MS);
  };

  if (phase === "boot" || phase === "done") return null;

  const flashDelayMs = Math.round(INTRO_ANIMATION_DURATION_MS * IMPACT_AT_RATIO);

  const overlayStyle = {
    "--intro-duration": `${INTRO_ANIMATION_DURATION_MS}ms`,
    "--intro-flash-delay": `${flashDelayMs}ms`,
    "--intro-flash-duration": `${FLASH_DURATION_MS}ms`,
  } as CSSProperties;

  return (
    <div
      className={`intro-overlay ${phase === "fading" ? "intro-overlay--fading" : ""}`}
      style={overlayStyle}
      role="presentation"
    >
      <button
        type="button"
        onClick={skip}
        className="intro-skip"
        aria-label="Saltar animación de intro"
      >
        Saltar
      </button>

      {/* eslint-disable @next/next/no-img-element */}
      <img
        src="/uploads/intro-ring.jpg"
        alt=""
        aria-hidden="true"
        className="intro-ring"
      />

      <div className="intro-stage" aria-hidden="true">
        <div className="intro-glove intro-glove--left">
          <img src="/uploads/intro-glove.png" alt="" aria-hidden="true" className="intro-glove-img" />
        </div>
        <div className="intro-glove intro-glove--right">
          <img src="/uploads/intro-glove.png" alt="" aria-hidden="true" className="intro-glove-img" />
        </div>
        <ImpactFlash />
      </div>
      {/* eslint-enable @next/next/no-img-element */}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Flash de impacto                              */
/* -------------------------------------------------------------------------- */

function ImpactFlash() {
  return (
    <div className="intro-flash">
      <svg viewBox="0 0 200 200" aria-hidden="true" className="intro-flash-svg">
        <circle cx="100" cy="100" r="32" fill="#ffffff" opacity="0.95" />
        <circle
          cx="100"
          cy="100"
          r="50"
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="6"
        />
        <g
          stroke="var(--color-primary)"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        >
          <line x1="100" y1="35" x2="100" y2="12" />
          <line x1="100" y1="165" x2="100" y2="188" />
          <line x1="35" y1="100" x2="12" y2="100" />
          <line x1="165" y1="100" x2="188" y2="100" />
          <line x1="55" y1="55" x2="38" y2="38" />
          <line x1="145" y1="55" x2="162" y2="38" />
          <line x1="55" y1="145" x2="38" y2="162" />
          <line x1="145" y1="145" x2="162" y2="162" />
        </g>
        <g fill="#ffffff" opacity="0.8">
          <circle cx="65" cy="65" r="3" />
          <circle cx="135" cy="65" r="3" />
          <circle cx="65" cy="135" r="3" />
          <circle cx="135" cy="135" r="3" />
        </g>
      </svg>
    </div>
  );
}

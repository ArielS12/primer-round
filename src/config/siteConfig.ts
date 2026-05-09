/**
 * Configuración central del emprendimiento.
 *
 * IMPORTANTE: este archivo es el ÚNICO punto de personalización del negocio.
 * Edita los valores y todo el sitio (copy, paleta, secciones, WhatsApp, SEO)
 * se adapta automáticamente.
 *
 * Configurado para: Primer Round · Escuela de Kickboxing en Necochea, Argentina.
 */

export type Servicio = {
  nombre: string;
  precio: string;
  duracionMin: number;
  descripcion?: string;
};

export type Testimonio = {
  nombre: string;
  texto: string;
  rating: 1 | 2 | 3 | 4 | 5;
  rol?: string;
};

export type RedSocial = {
  nombre: "Instagram" | "Facebook" | "TikTok" | "YouTube" | "X" | "LinkedIn";
  url: string;
};

export type Beneficio = {
  titulo: string;
  descripcion: string;
  icono?: "sparkle" | "shield" | "clock" | "heart" | "star" | "leaf";
};

export type DiaSemana =
  | "Lunes"
  | "Martes"
  | "Miércoles"
  | "Jueves"
  | "Viernes"
  | "Sábado"
  | "Domingo";

export type FranjaHoraria = {
  /** Hora de inicio en formato HH:mm (24h). */
  inicio: string;
  /** Hora de fin en formato HH:mm (24h). */
  fin: string;
};

export const siteConfig = {
  nombreEmprendimiento: "Primer Round",
  tipoEmprendimiento: "Escuela de Kickboxing",
  rubroObjetivo: "Deportes de combate · Kickboxing, Muay Thai y boxeo",
  ciudadPais: "Necochea, Argentina",
  publicoObjetivo:
    "Chicas, chicos y adultos que quieren entrenar kickboxing, mejorar su estado físico, descargar energía y aprender técnica real",
  problemaQueResuelve:
    "La falta de un espacio profesional, motivador y con técnica de competencia para entrenar kickboxing en Necochea",
  propuestaValor:
    "Entrená kickboxing donde se forman atletas convocados al Panamericano. Técnica real, energía de competencia y un grupo que te empuja a dar más",
  idioma: "es-AR",
  moneda: "ARS",

  servicios: [
    {
      nombre: "Kickboxing inicial",
      precio: "Consultar",
      duracionMin: 60,
      descripcion:
        "Para los que arrancan. Acondicionamiento físico, técnica básica de patadas, puños y guardia. Sin contacto.",
    },
    {
      nombre: "Kickboxing avanzado · Sparring",
      precio: "Consultar",
      duracionMin: 90,
      descripcion:
        "Trabajo de combinaciones, defensa, ritmo y sparring controlado. Para alumnos con experiencia.",
    },
    {
      nombre: "Funcional de combate",
      precio: "Consultar",
      duracionMin: 45,
      descripcion:
        "Entrenamiento físico de alto impacto con guantes y bolsa. Quema calorías y mejora coordinación. Apto para todo nivel.",
    },
    {
      nombre: "Clase de prueba gratuita",
      precio: "GRATIS",
      duracionMin: 60,
      descripcion:
        "Probá una clase sin costo. Te prestamos el equipo y te integrás al grupo desde el primer día.",
    },
  ] as Servicio[],

  horariosAtencion: {
    dias: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"] as DiaSemana[],
    /**
     * Soporte de múltiples franjas (ej: mañana y tarde).
     * Si solo hay una franja, dejá un único elemento en el array.
     */
    franjas: [
      { inicio: "10:00", fin: "12:00" },
      { inicio: "19:00", fin: "21:00" },
    ] as FranjaHoraria[],
    intervaloMin: 60,
  },

  contacto: {
    /** Formato internacional SIN el "+". 549 = Argentina móvil + 2262 (Necochea) + número. */
    whatsappAdmin: "5492262364355",
    nombreAdmin: "Coach Primer Round",
    email: "primerroundnecochea@gmail.com",
    direccion: "Calle 68 Nº 2474",
  },

  branding: {
    /** Naranja vibrante: energía, combate, motivación. */
    colorPrimario: "#F97316",
    /** Negro profundo para acentos, badges y fondos suaves (con opacidad). */
    colorSecundario: "#171717",
    estiloVisual:
      "Deportivo y agresivo. Naranja sobre negro, tipografía firme, mucho contraste y fotos en grande.",
    tonoMarca: "Motivador, directo y cercano. Tuteo, sin vueltas, lenguaje del gimnasio.",
    ctaPrincipal: "Reservar mi clase",
    ctaSecundario: "Probar gratis",
  },

  seo: {
    title: "Primer Round Necochea · Escuela de Kickboxing",
    description:
      "Clases de kickboxing en Necochea para todos los niveles. Técnica de competencia, profes formando atletas del Panamericano. Reservá tu clase de prueba gratis.",
    ogImage: "/uploads/hero.jpg",
  },

  media: {
    logoUrl: "",
    heroUrl: "",
    galeria: [] as string[],
  },

  testimonios: [
    {
      nombre: "Mateo F.",
      rol: "Alumno hace 1 año",
      texto:
        "Empecé sin saber nada y hoy entreno sparring. Los profes te corrigen siempre y se nota que les importa cómo progresás.",
      rating: 5,
    },
    {
      nombre: "Luciana P.",
      rol: "Clase funcional",
      texto:
        "Bajé peso, gané fuerza y descargo todo el estrés del día. El grupo es buenísimo y nadie te mira mal por ser principiante.",
      rating: 5,
    },
    {
      nombre: "Bruno A.",
      rol: "Competidor amateur",
      texto:
        "El nivel de la escuela es real. Si querés competir te preparan, y si querés solo entrenar también te empujan. Recomendadísimo.",
      rating: 5,
    },
  ] as Testimonio[],

  beneficios: [
    {
      titulo: "Profes con nivel de competencia",
      descripcion:
        "Equipo con atletas convocados a la Selección Argentina de Kickboxing y al Panamericano 2025.",
      icono: "shield",
    },
    {
      titulo: "Para todos los niveles",
      descripcion:
        "Desde la primera clase sin saber nada, hasta sparring avanzado. Te ubicamos donde estás.",
      icono: "star",
    },
    {
      titulo: "Energía de equipo",
      descripcion:
        "Un grupo que te recibe, te apoya y te empuja a dar lo mejor en cada ronda.",
      icono: "heart",
    },
    {
      titulo: "Reservá en 1 minuto",
      descripcion:
        "Elegís el día y horario, confirmás por WhatsApp y vení con ropa cómoda. Equipo lo prestamos.",
      icono: "clock",
    },
  ] as Beneficio[],

  comoFunciona: [
    {
      paso: 1,
      titulo: "Elegí tu clase",
      descripcion:
        "Inicial, avanzado, funcional o la primera gratis. Mirá los horarios y elegí el que te quede mejor.",
    },
    {
      paso: 2,
      titulo: "Reservá por WhatsApp",
      descripcion:
        "Completás el formulario, te abrimos un chat con tus datos prellenados y confirmás.",
    },
    {
      paso: 3,
      titulo: "Vení a entrenar",
      descripcion:
        "Llegá 10 minutos antes con ropa cómoda y agua. Si es tu primera vez te prestamos guantes.",
    },
  ],

  redes: [
    { nombre: "Instagram", url: "https://instagram.com/primerroundnecochea" },
  ] as RedSocial[],

  legales: {
    razonSocial: "Primer Round Necochea",
    politicaPrivacidadUrl: "#politica-privacidad",
    terminosUrl: "#terminos",
  },
} as const;

export type SiteConfig = typeof siteConfig;

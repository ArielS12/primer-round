# Primer Round — Landing

Landing page del gimnasio de kickboxing **Primer Round** (Necochea, Argentina).

Stack: **Next.js 14 (App Router)** + **TypeScript** + **Tailwind CSS**, mobile-first, con integración de WhatsApp para reservas y contacto, animación de intro y galería dinámica.

---

## Desarrollo local

Requisitos: **Node 20.x** y **npm**.

```bash
npm install
cp .env.example .env.local      # ajustá NEXT_PUBLIC_SITE_URL si querés
npm run dev                     # http://localhost:3000
```

Otros scripts útiles:

```bash
npm run build          # build de producción
npm run start          # sirve el build (puerto $PORT o 3000)
npm run lint           # eslint
npm run type-check     # tsc --noEmit
```

Para forzar la animación de intro (ignorando `sessionStorage`):
`http://localhost:3000/?replayIntro`

---

## Personalización

Toda la información del negocio (nombre, contacto, horarios, colores, copy, servicios, redes sociales) está centralizada en:

```
src/config/siteConfig.ts
```

Imágenes locales (servidas tal cual desde `/public/uploads/`):

| Archivo                       | Uso                                       |
| ----------------------------- | ----------------------------------------- |
| `public/uploads/logo.jpg`     | Logo en header / footer                   |
| `public/uploads/hero.jpg`     | Imagen del hero                           |
| `public/uploads/gallery-N.jpg`| Galería (numerá `gallery-1.jpg`, `-2.jpg`…) |
| `public/uploads/intro-ring.jpg` | Ring de fondo en la intro animada       |
| `public/uploads/intro-glove.png`| Guante (PNG con canal alpha)            |

---

## Despliegue en Render

El repositorio incluye un [Blueprint de Render](https://render.com/docs/blueprint-spec) (`render.yaml`) que crea un Web Service Node listo para usar.

### Opción A — Blueprint (recomendado, 1 click)

1. Subí el repo a GitHub / GitLab.
2. En Render: **Dashboard → New + → Blueprint**.
3. Conectá el repo. Render leerá `render.yaml` y mostrará los servicios a crear.
4. Confirmá. Render hará el primer build (`npm ci && npm run build`) y arrancará la app (`npm run start`).
5. Cuando el deploy termine, copiá la URL pública (algo como `https://primer-round-landing.onrender.com`) y configurala en la variable de entorno `NEXT_PUBLIC_SITE_URL` desde **Service → Environment**. Eso hace que los metadatos de Open Graph apunten a la URL real.
6. Volvé a desplegar (o `Manual Deploy → Deploy latest commit`).

### Opción B — Web Service manual

Si preferís no usar Blueprint:

1. **New + → Web Service** y conectá el repo.
2. Configuración:
   - **Runtime**: `Node`
   - **Build command**: `npm ci && npm run build`
   - **Start command**: `npm run start`
   - **Health check path**: `/`
3. **Environment Variables**:
   - `NODE_VERSION` = `20.14.0`
   - `NODE_ENV` = `production`
   - `NEXT_PUBLIC_SITE_URL` = la URL pública del servicio (la pegás tras el primer deploy).
4. Guardá → Render hará el primer build.

### Notas sobre el plan Free

- El plan gratuito duerme tras 15 min de inactividad → la primera visita después puede tardar 30–60 s en levantar (cold start). Para evitarlo, subí a un plan **Starter** o configurá un cron/uptime-monitor que pingee la URL cada 10 min.
- Render asigna `$PORT` automáticamente; `next start` lo lee sin configuración extra.
- Las imágenes de `/public/uploads/` viajan con el repo (no necesitás storage externo). Para agregar fotos a la galería, copiá nuevos `gallery-N.jpg` y hacé commit/push: el siguiente deploy las recogerá.

### Dominio personalizado

En **Service → Settings → Custom Domain**, agregá tu dominio y seguí las instrucciones DNS de Render. Después actualizá `NEXT_PUBLIC_SITE_URL` con la nueva URL.

---

## Estructura

```
src/
├── app/
│   ├── layout.tsx        # metadata global, JSON-LD LocalBusiness, IntroAnimation
│   ├── page.tsx          # composición de secciones
│   └── globals.css       # tokens de marca + animaciones de intro
├── components/           # Header, Hero, Benefits, Gallery, Reservation, Contact…
├── config/siteConfig.ts  # 👈 todas las variables del negocio
└── lib/                  # validación, WhatsApp, colores, imágenes
```

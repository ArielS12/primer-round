import fs from "node:fs";
import path from "node:path";

import { NextResponse } from "next/server";

/** Siempre dinámico: sin caché CDN ni respuesta estática en build. */
export const dynamic = "force-dynamic";

type PackageMeta = {
  name?: string;
  version?: string;
};

function readPackageMeta(): PackageMeta {
  try {
    const pkgPath = path.join(process.cwd(), "package.json");
    const raw = fs.readFileSync(pkgPath, "utf8");
    return JSON.parse(raw) as PackageMeta;
  } catch {
    return {};
  }
}

/**
 * Health check público para balanceadores, Render, uptime monitors, etc.
 *
 * GET  → JSON con estado y metadatos mínimos.
 * HEAD → solo código 200 (sin cuerpo), útil para pings ligeros.
 */
export async function GET() {
  const pkg = readPackageMeta();

  return NextResponse.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
      service: pkg.name ?? "landing-emprendimiento",
      version: pkg.version ?? "unknown",
      environment: process.env.NODE_ENV ?? "development",
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}

export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

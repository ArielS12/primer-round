import QRCode from "qrcode";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Prioridad: argumento CLI > NEXT_PUBLIC_SITE_URL > localhost. Así pasar la URL
// desde la línea de comandos siempre gana, sin depender del entorno.
const url = (process.argv[2] || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
  .trim()
  .replace(/\/$/, "");

const out = path.join(__dirname, "..", "public", "uploads", "tarjeta-qr-raw.png");

await QRCode.toFile(out, `${url}/`, {
  type: "png",
  errorCorrectionLevel: "M",
  margin: 1,
  width: 800,
  color: { dark: "#171717", light: "#FFFFFF" },
});

console.log(`OK -> ${out}  (url=${url}/)`);

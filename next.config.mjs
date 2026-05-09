/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // En Windows el optimizer puede devolver 0 bytes si `sharp` falla.
    // Como las imágenes locales ya están comprimidas (JPG <50KB), las servimos
    // directamente desde /public sin optimización. Si querés re-activar la
    // optimización, instalá sharp (`npm install sharp`) y poné `unoptimized: false`.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default nextConfig;

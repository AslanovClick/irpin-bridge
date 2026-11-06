import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  images: {
    // AVIF — найменші файли для сучасних браузерів, WebP — запасний варіант
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;

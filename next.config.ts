import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Foto galeri bisa berasal dari Vercel Blob (domain berbeda) saat upload.
    remotePatterns: [
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;

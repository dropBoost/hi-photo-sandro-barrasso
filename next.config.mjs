/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb", // aumenta per upload
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_SUPABASE_HOSTNAME,
        pathname: "/storage/v1/object/public/**",
      },
    ],
    minimumCacheTTL: 2678400, // 31 giorni
    deviceSizes: [640, 768, 1024, 1280, 1536],
    imageSizes: [32, 64, 128, 256, 384],
    qualities: [60, 75],
  },
};

export default nextConfig;

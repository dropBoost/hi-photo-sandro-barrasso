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
  },
};

export default nextConfig;

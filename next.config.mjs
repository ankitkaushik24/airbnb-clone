/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "lh3.googleusercontent.com",
        protocol: "https",
        port: "",
      },
      {
        hostname: "static.vecteezy.com",
        protocol: "https",
        port: "",
      },
      {
        hostname: "a0.muscache.com",
        protocol: "https",
        port: "",
      },
      {
        hostname: "josdibecllgrettfgfhn.supabase.co",
        protocol: "https",
        port: "",
      },
      {
        hostname: "glvmmupiqwlmhicmggqp.supabase.co",
        protocol: "https",
        port: "",
      },
    ],
  },
};

export default nextConfig;

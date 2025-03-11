/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
      },
    ],
  },
  experimental: {
    serverActions: true,
    // esmExternals: "loose", 
  },
  // webpack: (config) => {
  //   config.externals = config.externals || {};
  //   config.externals["@react-pdf/renderer"] = "@react-pdf/renderer"; 
  //   return config;
  // },
};

export default nextConfig;

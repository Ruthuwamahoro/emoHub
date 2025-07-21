import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "assets.aceternity.com",
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com", 
      },
    ],
  },
  i18n: {
    locales: ['en', 'rw'],
    defaultLocale: 'en',

  },
  experimental: {
    serverComponentsExternalPackages: ['swagger-jsdoc']
  }
};

export default nextConfig;

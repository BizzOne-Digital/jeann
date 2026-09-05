import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/products/beans-and-pulses/white-kidney-beans",
        destination: "/products/beans-and-pulses/white-beans",
        permanent: true,
      },
      {
        source: "/products/beans-and-pulses/chickpeas",
        destination: "/products/beans-and-pulses",
        permanent: true,
      },
      {
        source: "/products/other-commodities",
        destination: "/products",
        permanent: true,
      },
      {
        source: "/products/other-commodities/coffee-beans",
        destination: "/products/coffee/green-coffee-beans",
        permanent: true,
      },
      {
        source: "/products/other-commodities/cashews",
        destination: "/products/spices/cashews",
        permanent: true,
      },
      {
        source: "/products/other-commodities/cinnamon-sticks",
        destination: "/products/spices/cinnamon-sticks",
        permanent: true,
      },
      {
        source: "/products/other-commodities/black-pepper",
        destination: "/products/spices/black-pepper",
        permanent: true,
      },
      {
        source: "/products/other-commodities/turmeric",
        destination: "/products/spices/turmeric",
        permanent: true,
      },
      {
        source: "/products/other-commodities/cloves",
        destination: "/products/spices/cloves",
        permanent: true,
      },
      {
        source: "/products/other-commodities/cardamom",
        destination: "/products/spices/cardamom",
        permanent: true,
      },
      {
        source: "/products/other-commodities/nutmeg",
        destination: "/products/spices/nutmeg",
        permanent: true,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    localPatterns: [
      { pathname: "/images/**" },
      { pathname: "/brand/**" },
      { pathname: "/api/uploads/**" },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube-nocookie.com",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: blob: https:",
            "font-src 'self' data:",
            "connect-src 'self'",
            "frame-src https://www.youtube-nocookie.com",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'none'",
          ].join("; "),
        },
      ],
    },
  ],
};

export default nextConfig;

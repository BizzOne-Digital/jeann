import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      {
        source: "/products/beans-and-pulses/yellow-beans",
        destination: "/products/beans-and-pulses/white-beans",
        permanent: true,
      },
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
        source: "/products/beans-and-pulses/soybeans",
        destination: "/products/beans-and-pulses",
        permanent: true,
      },
      {
        source: "/products/rice-and-grains/basmati-rice",
        destination: "/products/rice-and-grains/basmati-370",
        permanent: true,
      },
      {
        source: "/products/rice-and-grains/parboiled-rice",
        destination: "/products/rice-and-grains/white-parboiled-rice",
        permanent: true,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    localPatterns: [
      { pathname: "/images/**" },
      { pathname: "/products/**" },
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

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Photos des projets envoyées depuis le dashboard (Firebase Storage)
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com', pathname: '/v0/b/**' },
    ],
  },
  async redirects() {
    return [
      { source: "/projet", has: [{ type: "query", key: "p", value: "(?<slug>.+)" }], destination: "/projets/:slug", permanent: true },
      { source: "/projet.html", has: [{ type: "query", key: "p", value: "(?<slug>.+)" }], destination: "/projets/:slug", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/apropos.html", destination: "/apropos", permanent: true },
      { source: "/services.html", destination: "/services", permanent: true },
    ];
  },
};

export default nextConfig;

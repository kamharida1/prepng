import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.prepng.com" }],
        destination: "https://prepng.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

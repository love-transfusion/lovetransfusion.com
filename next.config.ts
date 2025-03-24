import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    staleTimes: {
      dynamic: 60,
      static: 10 * 60,
    },
    // reactCompiler: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bnsyauupzwhhsloomymu.supabase.co',
      },
    ],
  },
}

export default nextConfig

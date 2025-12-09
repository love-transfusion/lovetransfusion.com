import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
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
      {
        protocol: 'https',
        hostname: 'xbjzdshnnddfeqyninmm.supabase.co',
      },
    ],
    qualities: [25, 50, 75, 80, 90, 100],
  },
}

export default nextConfig

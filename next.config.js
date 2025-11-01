/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.islamic.network', 'api.quran.com'],
  },
  async headers() {
    return [
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
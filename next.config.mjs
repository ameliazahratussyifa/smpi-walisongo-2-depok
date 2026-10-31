/** @type {import('next').NextConfig} */
const backendUrl = process.env.BACKEND_URL || 'http://127.0.0.1:8000';

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: '/login',
        destination: `${backendUrl}/login`,
      },
      {
        source: '/admin/:path*',
        destination: `${backendUrl}/admin/:path*`,
      },
      {
        source: '/admin',
        destination: `${backendUrl}/admin`,
      },
      {
        source: '/app',
        destination: `${backendUrl}/app`,
      },
      {
        source: '/mobile',
        destination: `${backendUrl}/mobile`,
      },
      {
        source: '/portal',
        destination: `${backendUrl}/portal`,
      },
      {
        source: '/profil',
        destination: `${backendUrl}/profil`,
      },
      {
        source: '/ppdb',
        destination: `${backendUrl}/ppdb`,
      },
    ];
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for mysql2 to work in Vercel serverless functions
  experimental: {
    serverComponentsExternalPackages: ['mysql2'],
  },
};

module.exports = nextConfig;

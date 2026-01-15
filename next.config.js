/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  experimental: {
    runtime: 'nodejs'
  }
};

module.exports = nextConfig;

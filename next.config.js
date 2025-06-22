/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pg']
  },
  output: 'standalone'
};

module.exports = nextConfig;

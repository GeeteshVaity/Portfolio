const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['@prisma/client', 'prisma'],
  turbopack: {
    root: path.resolve(__dirname),
  },
}

module.exports = nextConfig

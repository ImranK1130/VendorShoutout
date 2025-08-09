/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['nodemailer']
  },
  // Increase file upload limits
  serverRuntimeConfig: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
  },
  publicRuntimeConfig: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
  }
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true, // Enforces React's strict mode for identifying potential problems
  experimental: {
    appDir: true, // Ensures support for the App Directory feature introduced in Next.js 13
  },
}

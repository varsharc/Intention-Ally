/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Make Next.js output more portable
  basePath: '',
  // Set to false to allow the webview to embed the app
  trailingSlash: false,
  // Enhanced CORS and security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // These headers are critical for Replit's webview
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL', // Allow iframe embedding
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Allow cross-origin requests
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,POST,OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: '*',
          },
        ],
      },
    ];
  },
  // Configuration for Replit and optimization
  // Add allowedDevOrigins to allow cross-origin in development
  experimental: {
    allowedDevOrigins: [
      'localhost:5000',
      'localhost:3000',
      'localhost:8080',
      'localhost:*',
      'http://localhost:*',
      'https://*.replit.dev',
      'https://*.repl.co',
      'https://*.replit.app',
      'https://*.picard.replit.dev',
      'https://replit.com',
      'https://ce132cda-9e2d-417d-8fed-b0ec64c27ca5-00-2tx172xuax2xs.picard.replit.dev',
      '*.picard.replit.dev', // Add wildcard for picard subdomains
      'ce132cda-9e2d-417d-8fed-b0ec64c27ca5-00-2tx172xuax2xs.picard.replit.dev', // Specific domain
      '.picard.replit.dev', // Root domain with subdomain wildcard
    ],
  },
  // The CORS settings are better handled in the Express server directly
  // Optional: Configure webpack for better watching
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  },
  // Ensure Next.js works with Replit
  poweredByHeader: false,
}

module.exports = nextConfig
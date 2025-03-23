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
  // Allow embedding in Replit webview from any origin
  allowedDevOrigins: ['*', 'https://*.replit.dev', 'https://*.replit.app'],
  // Disable strict mode for static optimization
  experimental: {
    optimizeCss: true,
  },
  // Ensure Next.js works with Replit
  poweredByHeader: false,
}

module.exports = nextConfig
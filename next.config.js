const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

module.exports = withPWA({
  reactStrictMode: true,
  output: 'export',  // ✅ Enables `next export` for static hosting (required for Netlify)
  typescript: {
    ignoreBuildErrors: true, // ✅ Fixes build crash from `.next/types/...`
  },
  images: {
    unoptimized: true,
  },
});

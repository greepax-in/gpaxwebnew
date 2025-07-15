const withPWA = require('next-pwa')({
  dest: 'public',         // Service worker and files will be generated in /public
  register: true,         // Registers service worker automatically
  skipWaiting: true,      // Activates new service worker as soon as it's installed
  disable: process.env.NODE_ENV === 'development', // Disable PWA in development
});

module.exports = withPWA({
  // Add any other Next.js config options here
  reactStrictMode: true,
  // ...other config options
});

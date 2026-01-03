// CODEX_PATCH_BEGIN
// FILE: next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // TEMP: Force maps ON so bundle analysis works.
  // Once analysis is done, switch back to env-gated if you prefer.
  productionBrowserSourceMaps: true,
};

module.exports = nextConfig;

// CODEX_PATCH_END

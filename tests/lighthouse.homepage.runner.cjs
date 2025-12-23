// Lighthouse runner (Node-compatible, ESM-safe)

import('./lighthouse.homepage.js').catch(err => {
  console.error(err);
  process.exit(1);
});

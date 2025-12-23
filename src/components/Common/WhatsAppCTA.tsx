// FILE: src/components/Common/WhatsAppCTA.tsx

const BASE_URL = "https://wa.me/919999999999";

/**
 * Returns a WhatsApp deep link with a guided, consultative prompt.
 * Accepts optional context to pre-fill the packaging type or section of origin.
 */
export function getHomepageWhatsAppLink(context?: string): string {
  const message = `
Hi GreenPax team,

I need eco-friendly paper packaging.

Packaging type: ${context ?? "Not specified"}
Quantity and timeline:
Printing needs:
City:

Please share MOQ options, materials, and sample photos.
`.trim();

  return `${BASE_URL}?text=${encodeURIComponent(message)}`;
}

export function buildHomepageWhatsAppLink(context?: string): string {
  const BASE_URL = "https://wa.me/919999999999";

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

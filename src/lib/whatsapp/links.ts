import { buildHomepageWhatsAppLink } from "@/lib/whatsapp";

/**
 * Server-safe helper.
 * No client boundary. No React. Deterministic.
 */
export function getHomepageWhatsAppLink(context?: string): string {
  return buildHomepageWhatsAppLink(context);
}

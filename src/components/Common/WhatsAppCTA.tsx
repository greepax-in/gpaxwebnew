// FILE: src/components/Common/WhatsAppCTA.tsx

"use client";

import { buildHomepageWhatsAppLink } from "@/lib/whatsapp";

type WhatsAppCTAProps = {
  context?: string;
};

export function WhatsAppCTA({ context }: WhatsAppCTAProps) {
  const href = buildHomepageWhatsAppLink(context);

  return (
    <a
      href={href}
      data-cta="whatsapp"
      aria-label="Contact GreenPax on WhatsApp"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px 16px",
        borderRadius: "8px",
        backgroundColor: "#25D366",
        color: "#ffffff",
        fontWeight: 600,
        textDecoration: "none",
      }}
    >
      WhatsApp Us
    </a>
  );
}

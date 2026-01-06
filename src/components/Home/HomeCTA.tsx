// FILE: src/components/Home/HomeCTA.tsx

/**
 * HomeCTA is design-locked.
 * - Canonical strongest CTA for homepage; do not restyle or add variants.
 * - Keep copy, layout, and CTA weight unchanged to preserve hierarchy and CWV.
 * - No additional interactivity, effects, or secondary actions allowed.
 */
import { buildHomepageWhatsAppLink } from "@/lib/whatsapp";

export default function HomeCTA() {
  return (
    <section className="cta-panel" id="cta">
      <div className="container cta-inner">
        <div className="cta-copy">
          <p className="section-kicker">Start the brief</p>
          <h2>Ready to brief your packaging?</h2>
          <p className="cta-lede">
            Share packaging type, quantity band, and delivery timeline. We
            respond quickly on WhatsApp with specs and sample photos.
          </p>
        </div>
        <div className="cta-actions">
          <a
            href={buildHomepageWhatsAppLink("Primary CTA strip")}
            target="_blank"
            rel="noopener noreferrer"
            className="primary-cta"
          >
            Talk to GreenPax on WhatsApp
          </a>
          <p className="cta-note">Responses during business hours.</p>
        </div>
      </div>
    </section>
  );
}

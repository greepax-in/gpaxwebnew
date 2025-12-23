// FILE: src/components/Home/HomeHero.tsx

import Image from "next/image";
import { getHomepageWhatsAppLink } from "@/components/Common/WhatsAppCTA";

const capabilityBadges = [
  "Food-safe inks & compliant adhesives",
  "Custom sizes, GSM & finishes",
  "In-house printing & conversion",
  "Planned dispatch for bulk orders",
  "Pan-India distribution coverage",
];

const heroHighlights = [
  {
    title: "MOQ-based production",
    detail: "Bulk-ready scheduling with clear dispatch windows.",
  },
  {
    title: "Food-safe materials",
    detail: "Compliant inks and adhesives for food packaging.",
  },
  {
    title: "Pan-India delivery",
    detail: "Reliable logistics for multi-location brands.",
  },
];

export default function HomeHero() {
  return (
    <section className="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: '3rem', paddingBottom: '3rem' }}>
      <div className="container hero-grid">
        <div className="hero-copy fade-up">
          <p className="hero-eyebrow" style={{ letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            INDIA’S ECO-FRIENDLY PAPER PACKAGING MANUFACTURER
          </p>
           <h1 className="hero-title">
             Custom Paper Bags, Boxes & Food Packaging — Made at Scale
           </h1>
           <p className="hero-lede" style={{ maxWidth: 520 }}>
             We manufacture custom paper packaging for retail, QSR, and FMCG brands —
             using food-safe inks, controlled MOQs, and planned Pan-India dispatch.
           </p>
          <div className="hero-actions">
            <a
              className="primary-cta"
              href={getHomepageWhatsAppLink("Homepage hero")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Talk to a packaging specialist about bulk paper packaging requirements"
            >
              Talk to a Packaging Specialist
            </a>
          </div>
          <p className="hero-note">
            Share packaging type, quantity band, and delivery timeline.
            Responses during business hours.
          </p>

          {/* NOTE:
              Capability chips & value cards intentionally removed.
              Hero must stay above-the-fold and message-first. */}
        </div>

        <div className="hero-media fade-up delay-1">
          <div className="hero-media-frame">
            <Image
              src="/images/home/hero/printed-multi-color.svg"
              alt="Printed eco-friendly paper bags and boxes from GreenPax"
              width={1200}
              height={600}
              sizes="(max-width: 900px) 100vw, 50vw"
              style={{ width: "100%", height: "auto" }}
              priority
              className="hero-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

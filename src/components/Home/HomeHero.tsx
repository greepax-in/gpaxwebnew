"use client";
import Image from "next/image";
import { buildHomepageWhatsAppLink } from "@/lib/whatsapp";
import styles from "./HomeHero.module.css";

function HeroImage() {
  return (
    <div className={styles.heroVisual}>
      <Image
        src="/images/home/hero/gpax-hero-final-400x500.webp"
        alt="Printed eco-friendly paper bags and boxes manufactured by GreenPax"
        width={900}
        height={500}
        priority
        fetchPriority="high"
        sizes="(max-width: 900px) 94vw, 640px"
        className={styles.heroImage}
      />
    </div>
  );
}

export default function HomeHero() {
  return (
    <section className="home-hero hero-fold-safe">
      <div className="hero-content">
        {/* HERO HEADING — use H2 so homepage keeps a single H1 for SEO authority */}
        <h2>Eco-Friendly Paper Packaging Manufacturer</h2>

        {/* PRIMARY CTA — ABOVE THE FOLD (LOCKED) */}
        <div className="hero-primary-cta hero-primary-cta--abovefold">
          <a
            href={buildHomepageWhatsAppLink("Homepage hero")}
            target="_blank"
            rel="noopener noreferrer"
            className="primary-cta"
            data-cta="primary-whatsapp"
            aria-label="Talk to GreenPax on WhatsApp"
          >
            Talk to GreenPax on WhatsApp
          </a>
        </div>

        <p>
          Bulk paper bags, covers, and boxes manufactured in India with
          MOQ-based production.
        </p>

        {/* VISUAL — MUST NOT AFFECT ABOVE-FOLD CTA */}
        <div className="hero-visual-wrap">
          <HeroImage />
        </div>
      </div>
    </section>
  );
}

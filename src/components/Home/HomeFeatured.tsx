// FILE: src/components/Home/HomeFeatured.tsx

"use client";

import Image from "next/image";
import { getHomepageWhatsAppLink } from "@/lib/whatsapp/links";
import items from "@/data/items";
import { selectHomeFeaturedItems } from "@/lib/home/HomeFeatured.selector";
import { validateHomeFeatured } from "@/lib/home/HomeFeatured.validator";
import { useState } from "react";
import { buildProductSubtitle } from "@/lib/productSubtitle";
import styles from "./HomeFeatured.module.css";

/**
 * HomeFeatured
 *
 * Role:
 * - Validate buyer intent by showing commonly requested packaging
 * - NOT a catalog
 * - NOT ecommerce
 * - WhatsApp enquiry only
 */

const FALLBACK_FEATURED_IMAGE = "/images/home/hero/printed-multi-color.svg";

export default function HomeFeatured() {
  const featuredItems = selectHomeFeaturedItems(items);

  if (process.env.NODE_ENV !== "production") {
    validateHomeFeatured(items);
  }

  return (
    <section id="featured" className={styles.section}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.header}>
          <p className={styles.kicker}>Buyer demand signals</p>
          <h2 className={styles.title}>Most Requested Packaging</h2>
          <p className={styles.lede}>
            These formats validate the most common enquiries we handle for retail, QSR, and FMCG brands across India.
          </p>
        </div>

        <div className={styles.grid}>
          {featuredItems.map((item) => (
            <article className={styles.card} key={item.id}>
              <div className={styles.imageSurface}>
                <FeaturedImage
                  src={item.image}
                  alt={`${item.name} by GreenPax`}
                />
              </div>

              <div className={styles.copyBlock}>
                <p className={styles.productName}>{item.name}</p>
                <p className={styles.productSubtitle}>{buildProductSubtitle(item)}</p>
              </div>

              <div className={styles.ctaRow}>
                <a
                  className={styles.outlineButton}
                  href={getHomepageWhatsAppLink(`Homepage featured: ${item.name}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Enquire about ${item.name}`}
                >
                  Request specs on WhatsApp
                </a>
              </div>
            </article>
          ))}
        </div>

        <p className={styles.caption}>
          Intent validation only. Share size, GSM, quantity band, and delivery timeline for
          accurate quotes.
        </p>
      </div>
    </section>
  );
}

/* =========================================================
   Safe Image Wrapper (prevents broken UI)
   ========================================================= */

function FeaturedImage({
  src,
  alt,
}: {
  src?: string;
  alt: string;
}) {
  const [error, setError] = useState(false);

  const imageSrc = !src || error ? FALLBACK_FEATURED_IMAGE : src;

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={400}
      height={240}
      sizes="(max-width: 600px) 88vw, (max-width: 900px) 42vw, 320px"
      loading="lazy"
      onError={() => setError(true)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
        padding: "8px",
      }}
    />
  );
}

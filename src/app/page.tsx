// CODEX_PATCH_BEGIN
// FILE: src/app/page.tsx

import type { Metadata } from "next";
import type { JSX } from "react";

import HomeHero from "@/components/Home/HomeHero";
import HomeCategories from "@/components/Home/HomeCategories";
import HomeFeatured from "@/components/Home/HomeFeatured";
import HomeUseCases from "@/components/Home/HomeUseCases";
import HomeWhyGreenPax from "@/components/Home/HomeWhyGreenPax";
import HomeClients from "@/components/Home/HomeClients";
import HomeCTA from "@/components/Home/HomeCTA";

/* ------------------------------------------------------------------ */
/* SEO METADATA (HOMEPAGE LOCKED)                                   */
/* ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title:
    "GreenPax | Eco-Friendly Paper Bags & Packaging Manufacturer in India",
  description:
    "GreenPax manufactures eco-friendly paper bags, paper covers, and paper boxes for food delivery, grocery, retail, and e-commerce businesses across India. Bulk supply with MOQ. Enquire via WhatsApp.",
  alternates: {
    canonical: "https://www.greenpax.in/",
  },
  openGraph: {
    title:
      "GreenPax | Eco-Friendly Paper Bags & Packaging Manufacturer in India",
    description:
      "Eco-friendly paper packaging manufactured in India for bulk supply. MOQ-based orders. Chat with GreenPax on WhatsApp.",
    url: "https://www.greenpax.in/",
    siteName: "GreenPax",
    type: "website",
    images: [
      {
        url: "https://www.greenpax.in/images/og/greenpax-home.jpg",
        width: 1200,
        height: 630,
        alt: "GreenPax eco-friendly paper packaging manufacturer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/* ------------------------------------------------------------------ */
/* STRUCTURED DATA (ORGANIZATION + OFFER CATALOG)                      */
/* ------------------------------------------------------------------ */

function HomePageStructuredData(): JSX.Element {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://www.greenpax.in/#organization",
    name: "GreenPax",
    url: "https://www.greenpax.in/",
    logo: "https://www.greenpax.in/logo.png",
    description:
      "GreenPax is an Indian manufacturer of eco-friendly paper bags, paper covers, and kraft packaging for food delivery, retail, and brands.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Sales",
      availableLanguage: ["English", "Hindi"],
      // TODO: Replace with real WhatsApp number before production
      url: "https://wa.me/91XXXXXXXXXX",
    },
    makesOffer: {
      "@type": "OfferCatalog",
      name: "Eco-Friendly Packaging Products",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: "Paper Bags",
        },
        {
          "@type": "Offer",
          itemOffered: "Paper Covers",
        },
        {
          "@type": "Offer",
          itemOffered: "Paper Boxes",
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* HOMEPAGE RENDER                                                     */
/* ------------------------------------------------------------------ */

export default function HomePage(): JSX.Element {
  return (
    <div className="home">
      <HomePageStructuredData />
      <HomeHero />
      <HomeCategories />
      <HomeFeatured />
      <HomeUseCases />
      <HomeWhyGreenPax />
      <HomeClients />
      <HomeCTA />
    </div>
  );
}
// CODEX_PATCH_END

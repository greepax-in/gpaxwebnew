
// Product pages are currently renderable; no notFound fallback here.

/**
 * ProductPageComponent
 *
 * 🚫 Placeholder only.
 * Product pages are intentionally NOT enabled yet.
 * This component exists to keep the App Router build-safe.
 */
import type { JSX } from 'react';
import React from 'react';

// Use the app-wide `ItemType` to stay consistent with page route
import type { ItemType } from '@/types/itemTypes';

type Props = {
  product: ItemType;
};

export default function ProductPageComponent({
  product,
}: Props): JSX.Element {
  return (
    <main className="product-page">
      <h1>{product.name}</h1>

      {/* 
        Product content sections go here.
        Keep pricing non-transactional (indicative only).
      */}
    </main>
  );
}


// FILE: src/components/Home/HomeFeatured.tsx

import items from "@/data/items.json";
import ProductCard from "@/components/Products/ProductCard";

export default function HomeFeatured() {
  const featured = items.filter((item: any) => item.featured === true);

  return (
    <section className="section section-featured" id="featured">
      <div className="container">
        <div className="section-header fade-up">
          <p className="section-kicker">Reference builds</p>
          <h2>Popular packaging specs we supply</h2>
          <p className="section-lede">
            Reference examples to guide your enquiry. We tailor GSM, sizes, and
            printing to your use case.
          </p>
        </div>

        <div className="featured-grid">
          {featured.slice(0, 4).map((item: any) => (
            <ProductCard key={item.slug} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

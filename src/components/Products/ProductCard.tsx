// FILE: src/components/Products/ProductCard.tsx

import Image from "next/image";
import { getHomepageWhatsAppLink } from "@/components/Common/WhatsAppCTA";

export default function ProductCard({ item }: { item: any }) {
  const gsm = item?.GSM ? `GSM ${item.GSM}` : "Custom GSM";
  const subTitle = item?.subTitle ?? "Plain or custom printed options";

  return (
    <div className="product-card card">
      <div className="product-card__header">
        <Image
          src={item.image}
          alt={item.name}
          width={160}
          height={160}
          className="product-card__image"
        />
        <div>
          <h3>{item.name}</h3>
          <p className="product-card__sub">{subTitle}</p>
        </div>
      </div>

      <ul className="product-card__details">
        <li>{gsm}</li>
        <li>MOQ-based manufacturing; share your sizes</li>
        <li>Plain or printed; sample photos on request</li>
      </ul>

      <a
        href={getHomepageWhatsAppLink(item.name)}
        target="_blank"
        rel="noopener noreferrer"
        className="secondary-cta"
      >
        See samples on WhatsApp
      </a>
    </div>
  );
}

export type ProductType = {
  name: string;
  slug: string;
  category: string;
  description: string;
  industry: string;
  image: string;
  featuredImage: string;
  productImages: string[];
  pageLink: string;
  printvariants: string[];
  papervariant: string[];
  featuredProduct: string;
  offeredPrice: number;
  sellingPrice: number;
  tagtext: string;
  highlights: string[];
  specifications: Record<string, string>;
  faqs: { q: string; a: string }[];
  usecases: string[]; // e.g., "Food Delivery", "Retail", "E-commerce"

  // ✅ New section: Customer Assurance
  assurance?: {
    icon: string;
    title: string;
    desc: string;
  }[];

  // Size & Variant Details
  sizes: string[]; // e.g., "6x8\""
  sizeImages?: { [size: string]: string[] }; // size-specific images
  sizePrices?: { [size: string]: number };   // default price per size

  units?: string[]; // e.g., ['100 pcs', '1kg']
  minimumQuantities?: number[]; // e.g., [100, 200, 500]
  customers?: { name: string; logo: string; alt?: string }[];
  categorySlug?: string; // e.g., "paper-bags"
  subcategorySlug?: string; // e.g., "food-delivery-paper-bags"
  variantPrices?: {
    [size: string]: {
      [unit: string]: {
        [minQty: number]: number;
      };
    };
  };
};

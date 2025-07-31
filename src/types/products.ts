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

  // New additions
  sizes: string[]; // e.g., "6x8\""
  sizeImages?: { [size: string]: string[] }; // size-specific images
  sizePrices?: { [size: string]: number };   // default price per size

  units?: string[]; // e.g., ['per piece', '100 pcs']
  minimumQuantities?: number[]; // e.g., [100, 200, 500]

  variantPrices?: {
    [size: string]: {
      [unit: string]: {
        [minQty: number]: number; // e.g., variantPrices["6x8"]["per piece"][100] = 9
      };
    };
  };
};

export type ItemType = {
  // HeroSection
  name: string;
  slug: string;
  category: string;
  featuredImage: string;
  productImages: string[];
  pageLink: string;
  tagtext: string;
  // tags: string[];
  packSize?: string;

  // ProductDetails
  description: string;

  printVariants: string[];
  paperVariant: string[];
  featuredProduct: string;
  offeredPrice: number;
  sellingPrice: number;

  // ProductSpecifications
  highlights: string[];
  specifications: Record<string, string>;

  // ProductAssurance
  assurance?: {
    icon: string;
    title: string;
    desc: string;
  }[];

  // IndustriesServed
  // industry field already declared above
    industry: string;

  // TrustedBy
  customers?: { name: string; logo: string; alt?: string }[];

  // UseCases
  usecases: string[];

  // ProductFAQ
  faqs: { q: string; a: string }[];

  // SimilarProducts
  categorySlug?: string;
  subcategorySlug?: string;

  // Size & Variant Details (used in multiple sections)
  sizes: string[];
  sizeImages?: { [size: string]: string[] };
  sizePrices?: { [size: string]: number };
  units?: string[];
  minimumQuantities?: number[];
 variantPrices?: {
    [size: string]: {
      [unit: string]: {
        [qty: string]: number;
      };
    };
  };

};

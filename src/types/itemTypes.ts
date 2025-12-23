// types/itemTypes.ts

export type SizeUnit = 'in' | 'cm';

export type UnitType = 'pc' | 'kg' | 'bundle';

export interface UnitData {
  unitType: UnitType;
  offeredPrice: number;
  sellingPrice: number;
  moq: number;
  contains: number;
  containsLabel: string;
}

export interface FAQ {
  q: string; // Question
  a: string; // Answer
}


export interface SizeVariant {
  sizeIn: string;
  sizeCm: string;
  sizeImages?: string[];
  units: UnitData[]; // embedded with offeredPrice and sellingPrice
}

export interface AssuranceInfo {
  icon: string;    // Emoji or icon string
  title: string;   // Short headline
  desc: string;    // Detailed description
}

export interface Customer {
  name: string;
  logo: string;
  alt?: string;
}

export interface VariantInfo {
  type: 'plain' | 'printed' | 'multicolor';
  printColors?: number;
}

export interface MaterialInfo {
  paperType: string[];
  gsmRange: string;
  foodSafe: boolean;
}

export interface TaxonomyInfo {
  industries: string[];
  useCases: string[];
  foodSafe: boolean;
}

export interface ItemType {
  id?: string;
  name: string;
  category?: string;
  subcategory?: string;
  productType?: 'bag' | 'cover' | 'box';
  variant?: VariantInfo;
  material?: MaterialInfo;
  taxonomy?: TaxonomyInfo;
  tag?: string;
  featured?: boolean;
  image: string;
  productImages?: string[];
  featuredImage?: string;
  sizeImages?: {
    [size: string]: string[];
  };
  sizes: SizeVariant[];

  features: string[];
  shippingInfo?: string;
  subTitle?: string;
  categorySlug: string;
  subcategorySlug: string;
  baseSlug?: string;
  slug: string;
  pageLink?: string;
  GSM?: string; // Optional GSM for paper products
  description?: string;
  highlights?: string[];
  specifications?: Record<string, string>;
 assurance?: AssuranceInfo[];
 customers?: Customer[];
  faqs: FAQ[];
  minimumQuantities: {
    [unit: string]: number; // e.g., "pc": 100
  };
}

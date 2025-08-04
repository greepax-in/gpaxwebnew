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

export interface ItemType {
  name: string;
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
  slug: string;
  pageLink?: string;
  GSM?: string; // Optional GSM for paper products
  offeredPrice?: number;
  sellingPrice?: number;
  description?: string;
  highlights?: string[];
  specifications?: string[];
 assurance?: AssuranceInfo[];
 customers?: Customer[];
  industry: string;
  printVariants?: string[];
  paperVariant?: string[];
  faqs: FAQ[];
  usecases: string[];
  minimumQuantities: {
    [unit: string]: number; // e.g., "pc": 100
  };
  sizePrices?: {
    [size: string]: number;
  };
  variantPrices?: {
    [size: string]: {
      [unit: string]: {
        [quantity: string]: number;
      };
    };
  };
}

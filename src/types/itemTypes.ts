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

export interface SizeVariant {
  sizeIn: string;
  sizeCm: string;
  sizeImages?: string[];
  units: UnitData[]; // embedded with offeredPrice and sellingPrice
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
  pageLink?: string;
  offeredPrice?: number;
  sellingPrice?: number;
  description?: string;
  industry?: string;
  printVariants?: string[];
  paperVariant?: string[];
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

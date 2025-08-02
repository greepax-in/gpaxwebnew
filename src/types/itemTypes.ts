// types/itemTypes.ts

export type SizeUnit = 'in' | 'cm';

export type UnitType = 'pc' | 'kg' | 'bundle';

export interface SizeVariant {
  sizeIn: string;
  sizeCm: string;
  availableUnits: UnitType[];
}

export interface UnitData {
  unitType: UnitType;
  price: number;
  moq: number;
  contains: number;
  containsLabel: string;
}

export interface ItemType {
  name: string;
  image: string;
  productImages?: string[];
  sizeImages?: {
    [size: string]: string[];
  };
  sizes: SizeVariant[];
  units: UnitData[];
  features: string[];
  shippingInfo?: string;
  subtitle?: string;
  pageLink?: string;
}

import items from '@/data/items.json';
import type { ItemType } from '@/types/itemTypes';
import ProductPageComponent from '@/components/ProductPage/ProductPage';
import { notFound } from 'next/navigation';

type ItemsModuleType = ItemType[] | { default?: ItemType[]; items?: ItemType[] } | Record<string, ItemType[]>;
type RawUnit = {
  unitType: string;
  offeredPrice: number;
  sellingPrice: number;
  moq: number;
  contains: number;
  containsLabel: string;
};

type RawSize = {
  sizeIn: string;
  sizeCm: string;
  units: RawUnit[];
  sizeImages: string[];
};

type RawItem = Omit<ItemType, 'sizes'> & {
  sizes: RawSize[];
  minimumQuantities: number[];
};

function extractProducts(itemsModule: ItemsModuleType): ItemType[] {
  let arr: unknown[] = [];
  if (Array.isArray(itemsModule)) arr = itemsModule;
  else if (Array.isArray((itemsModule as Record<string, unknown>)?.default)) arr = (itemsModule as Record<string, unknown>).default as unknown[];
  else if (Array.isArray((itemsModule as Record<string, unknown>)?.items)) arr = (itemsModule as Record<string, unknown>).items as unknown[];
  else if (typeof itemsModule === 'object' && itemsModule !== null) {
    for (const key in itemsModule as Record<string, unknown>) {
      if (Array.isArray((itemsModule as Record<string, unknown>)[key])) arr = (itemsModule as Record<string, unknown>)[key] as unknown[];
    }
  }
  // Ensure features property exists
  return arr.map((p) => {
    if (typeof p === 'object' && p !== null) {
      const obj = p as { [key: string]: unknown };
      return {
        ...obj,
        features: Array.isArray(obj.features) ? obj.features : [],
      };
    }
    return p;
  }) as ItemType[];
}

export async function generateStaticParams() {
  // Map raw items to match ItemType structure, converting unitType to UnitType
  const products = extractProducts(
    (items as unknown[]).map((item) => {
      const typedItem = item as RawItem;
      return {
        ...typedItem,
        sizes: typedItem.sizes?.map((size: RawSize) => ({
          ...size,
          units: size.units?.map((unit: RawUnit) => ({
            ...unit,
            unitType: unit.unitType as import('@/types/itemTypes').UnitType,
          })) ?? [],
        })) ?? [],
      };
    })
  );

  console.log('📦 Products count:', products.length);
  console.log('📦 Example product:', products[0]);

  const validProducts = products.filter(
    (p): p is ItemType & { pageLink: string } =>
      typeof p.pageLink === 'string' &&
      /^\/[^/]+\/[^/]+\/[^/]+$/.test(p.pageLink)
  );

  console.log('✅ Valid filtered count:', validProducts.length);
  console.log('✅ Valid paths:', validProducts.map((p) => p.pageLink));

  const paths = validProducts.map((p) => {
    const [category, subcategory, product] = p.pageLink.replace(/^\//, '').split('/');
    return { category, subcategory, product };
  });

  console.log('📍Final paths:', paths);

  return paths;
}


export default async function ProductPage({
  params,
}: {
  params: { category: string; subcategory: string; product: string };
}) {
  const { category, subcategory, product } = params;
  const itemsModule = await import('@/data/items.json');
  const products = extractProducts(itemsModule as unknown as ItemsModuleType);
  console.log('Products2:', products);

  const pagePath = `/${category}/${subcategory}/${product}`;
  const item = products.find((p) => p.pageLink === pagePath);

  if (!item) notFound();

  return <ProductPageComponent product={item} />;
}

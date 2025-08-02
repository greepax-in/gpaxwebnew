import items from '@/data/items.json';
import type { ItemType } from '@/types/itemTypes';
import ProductPageComponent from '@/components/ProductPage/ProductPage';
import { notFound } from 'next/navigation';

function extractProducts(itemsModule: any): ItemType[] {
  if (Array.isArray(itemsModule)) return itemsModule;
  if (Array.isArray(itemsModule?.default)) return itemsModule.default;
  if (Array.isArray(itemsModule?.items)) return itemsModule.items;
  if (typeof itemsModule === 'object' && itemsModule !== null) {
    for (const key in itemsModule) {
      if (Array.isArray(itemsModule[key])) return itemsModule[key];
    }
  }
  return [];
}

export async function generateStaticParams() {
  const products = extractProducts(items);

  console.log('📦 Products count:', products.length);
  console.log('📦 Example product:', products[0]);

  const validProducts = products.filter(
    (p: ItemType): p is ItemType & { pageLink: string } =>
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
  const products = extractProducts(itemsModule);
  console.log('Products2:', products);

  const pagePath = `/${category}/${subcategory}/${product}`;
  const item = products.find((p) => p.pageLink === pagePath);

  if (!item) notFound();

  return <ProductPageComponent product={item as ItemType} />;
}

import ProductPageComponent from '@/components/ProductPage/ProductPage';
import { notFound } from 'next/navigation';
import type { ItemType } from '@/types/itemTypes';

export async function generateStaticParams() {
  const products = (await import('@/data/items.json')).default;

  return products
    .map((p) => {
      const segments = p.pageLink?.split('/').filter(Boolean);
      if (segments?.length === 3) {
        const [category, subcategory, product] = segments;
        return { category, subcategory, product };
      }
      return null;
    })
    .filter(Boolean) as { category: string; subcategory: string; product: string }[];
}

export default async function ProductPage({
  params,
}: {
  params: { category: string; subcategory: string; product: string };
}) {
  const { category, subcategory, product } = params;

  const products = (await import('@/data/items.json')).default;

  const pagePath = `/${category}/${subcategory}/${product}`; // ✅ build first

  const item = products.find((p) => p.pageLink === pagePath); // ✅ safe

  if (!item) notFound();

  return <ProductPageComponent product={item as ItemType} />;
}

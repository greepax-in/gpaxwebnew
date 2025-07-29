import path from 'path';
import matter from 'gray-matter';
import { promises as fs } from 'fs';

export async function generateStaticParams() {
  const basePath = path.join(process.cwd(), 'content/products');
  const slugs: { category: string; subcategory: string; slug: string }[] = [];

  const categories = await fs.readdir(basePath);
  for (const category of categories) {
    const subPath = path.join(basePath, category);
    if (!(await fs.stat(subPath)).isDirectory()) continue;
    const subcategories = await fs.readdir(subPath);

    for (const subcategory of subcategories) {
      const subcategoryPath = path.join(subPath, subcategory);
      if (!(await fs.stat(subcategoryPath)).isDirectory()) continue;
      const productFiles = await fs.readdir(subcategoryPath);
      for (const file of productFiles) {
        if (!file.endsWith('.md')) continue;
        const slug = file.replace(/\.md$/, '');
        slugs.push({ category, subcategory, slug });
      }
    }
  }

  return slugs;
}

export default async function ProductPage({ params }: { params: { category: string; subcategory: string; slug: string } }) {
  const { category, subcategory, slug } = params;

  const filePath = path.join(
    process.cwd(),
    'content/products',
    category,
    subcategory,
    `${slug}.md`
  );

  let fileContent = '';
  try {
    fileContent = await fs.readFile(filePath, 'utf8');
  } catch (err) {
    return <div>Product not found.</div>;
  }
  const { data, content } = matter(fileContent);

  // Import a markdown parser
  const { marked } = await import('marked');
  const htmlContent = await marked.parse(content);

  return (
    <div>
      <h1>{data.title}</h1>
      <p>{data.description}</p>
      <article dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
}

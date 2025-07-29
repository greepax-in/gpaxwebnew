import path from 'path';
import matter from 'gray-matter';
import { promises as fs } from 'fs';
import { notFound } from 'next/navigation';
import { Container, Typography, Box } from '@mui/material';

export async function generateStaticParams() {
  const basePath = path.join(process.cwd(), 'content/products');
  const paths: { category: string; subcategory: string; slug: string }[] = [];

  const categories = await fs.readdir(basePath);
  for (const category of categories) {
    const categoryPath = path.join(basePath, category);
    if (!(await fs.stat(categoryPath)).isDirectory()) continue;

    const subcategories = await fs.readdir(categoryPath);
    for (const subcategory of subcategories) {
      const subcategoryPath = path.join(categoryPath, subcategory);
      if (!(await fs.stat(subcategoryPath)).isDirectory()) continue;

      const files = await fs.readdir(subcategoryPath);
      for (const file of files) {
        if (file.endsWith('.md')) {
          paths.push({
            category,
            subcategory,
            slug: file.replace(/\.md$/, ''),
          });
        }
      }
    }
  }

  return paths;
}

export async function generateMetadata({
  params,
}: {
  params: { category: string; subcategory: string; slug: string };
}) {
  const { category, subcategory, slug } = params;
  const filePath = path.join(
    process.cwd(),
    'content/products',
    category,
    subcategory,
    `${slug}.md`
  );

  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data } = matter(fileContent);

    return {
      title: data.title || slug,
      description: data.description || '',
    };
  } catch {
    return {
      title: 'Product Not Found',
      description: '',
    };
  }
}

export default async function Page({
  params,
}: {
  params: { category: string; subcategory: string; slug: string };
}) {
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
    console.error('File not found:', err);
    notFound();
  }

  const { data, content } = matter(fileContent);
  const { marked } = await import('marked');
  const htmlContent = await marked.parse(content);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h3" gutterBottom>
        {data.title}
      </Typography>
      <Typography variant="subtitle1" paragraph>
        {data.description}
      </Typography>
      <Box
        component="article"
        sx={{
          mt: 4,
          typography: 'body1',
          '& h2': { mt: 4 },
          '& ul': { pl: 3, listStyle: 'disc' },
        }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </Container>
  );
}

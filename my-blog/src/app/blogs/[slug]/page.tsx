import { Blog } from "@/types/blog";
import BlogDetail from "@/app/components/BlogDetail/page";
const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
export async function getBlogBySlug(slug: string) {
  const res = await fetch(`${API_URL}/api/blogs/slug/${slug}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) throw new Error("Failed to fetch blog");

  return res.json();
}

export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blogs`);
  const blogs: Blog[] = await res.json();

  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export default async function BlogPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  return <BlogDetail blog={blog} />;
}

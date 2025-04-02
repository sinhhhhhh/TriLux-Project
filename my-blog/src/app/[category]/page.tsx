import BlogList from "../components/BlogList/page";
import BlogDetail from "../components/BlogDetail/page";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
async function getBlogsByCategory(category: string) {
  const res = await fetch(`${API_URL}/api/blogs?category=${category}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error("Failed to fetch blogs");
  return res.json();
}

export async function getBlogBySlug(category: string) {
  const res = await fetch(`${API_URL}/api/blogs/slug/${category}-blog`, {
    cache: "force-cache",
  });

  if (!res.ok) throw new Error("Failed to fetch blog");

  return res.json();
}

export async function generateStaticParams() {
  const categories = [
    "HomeRenovation",
    "Landscaping",
    "Cleaning",
    "Staging",
    "PropertyMaintenance",
    "News",
  ];
  return categories.map((category) => ({ category }));
}

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const { category } = await params;
  const blogs = await getBlogsByCategory(category);
  const blog = await getBlogBySlug(category);

  return (
    <div>
      <BlogDetail blog={blog} />
      <h1 className="text-2xl font-bold">Danh mục: {category}</h1>
      <BlogList blogs={blogs} />
    </div>
  );
}

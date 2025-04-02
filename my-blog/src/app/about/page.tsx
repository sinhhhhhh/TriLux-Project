import Link from "next/link";
import ImageSlider from "../components/ImageSlider/page";
import BlogList from "../components/BlogList/page";
import BlogDetail from "../components/BlogDetail/page";
const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
async function getBlogs() {
  const res = await fetch(`${API_URL}/api/blogs-with-slug`, {
    next: { revalidate: 60 },
  }); // SSG
  if (!res.ok) throw new Error("Failed to fetch blogs");
  return res.json();
}

export async function getBlogBySlug() {
  const res = await fetch(`${API_URL}/api/blogs/slug/about-blog`, {
    cache: "force-cache",
  });

  if (!res.ok) throw new Error("Failed to fetch blog");

  return res.json();
}

export default async function About() {
  const blogs = await getBlogs();
  const blog = await getBlogBySlug();
  return (
    <div>
      <ImageSlider />
      <BlogDetail blog={blog} />
      <BlogList blogs={blogs} limit={8} />
    </div>
  );
}

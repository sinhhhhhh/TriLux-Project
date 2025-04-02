import Link from "next/link";
import ImageSlider from "./components/ImageSlider/page";
import Intro from "./components/Intro/page";
import BlogDetail from "./components/BlogDetail/page";
import BlogList from "./components/BlogList/page";
const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
async function getBlogs() {
  const res = await fetch(`${API_URL}/api/blogs-with-slug`, {
    next: { revalidate: 60 },
  }); // SSG
  if (!res.ok) throw new Error("Failed to fetch blogs");
  return res.json();
}

export async function getBlogBySlug() {
  const res = await fetch(`${API_URL}/api/blogs/slug/home-blog`, {
    cache: "force-cache",
  });

  if (!res.ok) throw new Error("Failed to fetch blog");

  return res.json();
}

export default async function Home() {
  const blogs = await getBlogs();
  const blog = await getBlogBySlug();
  return (
    <div>
      <ImageSlider />
      <Intro />
      <BlogDetail blog={blog} />
      <h1>Other Services</h1>
      <BlogList blogs={blogs} limit={8} />
    </div>
  );
}

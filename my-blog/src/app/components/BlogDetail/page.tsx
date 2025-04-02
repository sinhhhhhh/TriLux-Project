import { Blog } from "@/types/blog";
import "./style.css";

export default function BlogDetail({ blog }: { blog: Blog }) {
  return (
    <div className="blog-detail">
      <h1 className="blog-title">{blog.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: blog.content }} />
    </div>
  );
}

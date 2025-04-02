import Link from "next/link";
import "./style.css";

interface Blog {
  id: string;
  title: string;
  slug: string;
  category: string;
  thumbnail: string;
}

interface BlogListProps {
  blogs: Blog[];
  limit?: number;
}

const BlogList: React.FC<BlogListProps> = ({ blogs, limit }) => {
  const displayedBlogs = limit ? blogs.slice(0, limit) : blogs;

  return (
    <div className="blog-list">
      {displayedBlogs.map((blog) => (
        <div key={blog.id} className="blog-item">
          <Link href={`/blogs/${blog.slug}`}>
            <img
              src={blog.thumbnail}
              alt={blog.title}
              className="blog-thumbnail"
            />
            <h3 className="blog-title">{blog.title}</h3>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default BlogList;

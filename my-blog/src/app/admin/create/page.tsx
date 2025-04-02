"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { handleQuillImageUpload } from "../../utils/uploadImage";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

const modules = {
  toolbar: {
    container: [
      [{ font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "sub" }, { script: "super" }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      ["link", "image", "video", "formula"],
      ["clean"],
    ],
    handlers: {
      image: function (this: any) {
        const quillInstance = this.quill;
        handleQuillImageUpload(quillInstance);
      },
    },
  },
};

export default function CreateBlog() {
  const router = useRouter();
  const [blog, setBlog] = useState({
    id: "tempid",
    title: "",
    slug: "",
    content: "",
    thumbnail: "/images/default-avatar.jpg",
    category: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch("/api/auth/token");
      if (res.status !== 200) {
        router.push("/admin/login");
      }
    }
    checkAuth();
  }, []);

  // Tự động cập nhật slug từ tiêu đề
  useEffect(() => {
    setBlog((prev) => ({
      ...prev,
      slug: prev.title.toLowerCase().replace(/\s+/g, "-"),
    }));
  }, [blog.title]);

  async function handleThumbnailChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/blogs/upload-thumbnail", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setBlog((prev) => ({ ...prev, thumbnail: data.url }));
      } else {
        alert("Lỗi khi upload ảnh");
      }
    } catch (error) {
      console.error("Upload thất bại:", error);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const authres = await fetch("/api/auth/token");
      const { token } = await authres.json();
      if (!token) {
        alert("Bạn chưa đăng nhập hoặc phiên đã hết hạn!");
        return;
      }
      console.log(JSON.stringify(blog));
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(blog),
      });

      if (res.ok) {
        alert("Blog đã được tạo!");
        router.push("/admin/dashboard"); // Quay về trang quản lý
      } else {
        const errorText = await res.text();
        alert("Lỗi khi tạo blog: " + errorText);
      }
    } catch (error) {
      console.error("Lỗi khi gửi request:", error);
      alert("Lỗi trong quá trình tạo blog.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Tạo Blog Mới</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tiêu đề"
          value={blog.title}
          onChange={(e) => setBlog({ ...blog, title: e.target.value })}
          required
        />
        <input type="text" placeholder="Slug" value={blog.slug} readOnly />
        <ReactQuill
          value={blog.content}
          onChange={(content) => setBlog({ ...blog, content })}
          modules={modules}
        />
        <input type="file" accept="image/*" onChange={handleThumbnailChange} />
        {blog.thumbnail && (
          <img src={blog.thumbnail} alt="Thumbnail" width="100" />
        )}
        <select
          value={blog.category}
          onChange={(e) => setBlog({ ...blog, category: e.target.value })}
          required
        >
          <option value="">Chọn danh mục</option>
          <option value="HomeRenovation">Home Renovation</option>
          <option value="Staging">Staging</option>
          <option value="Cleaning">Cleaning</option>
          <option value="Landscaping">Landscaping</option>
          <option value="PropertyMaintenance">Property Maintenance</option>
          <option value="News">News</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Đang tạo..." : "Tạo Blog"}
        </button>
      </form>
    </div>
  );
}

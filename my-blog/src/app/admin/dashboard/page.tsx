"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Blog as BaseBlog } from "@/types/blog";
import { handleQuillImageUpload } from "../../utils/uploadImage";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";
import "./style.css";

type Blog = BaseBlog & {
  isDeleted?: boolean;
  isNew?: boolean;
  updatedTitle?: string;
  updatedContent?: string;
};
const specialSlugs = [
  "homerenovation-blog",
  "landscaping-blog",
  "cleaning-blog",
  "staging-blog",
  "propertymaintenance-blog",
  "news-blog",
  "home-blog",
  "contact-blog",
  "about-blog",
];
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

export default function AdminDashboard() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [pendingChanges, setPendingChanges] = useState<Partial<Blog>[]>([]);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      const res = await fetch("/api/auth/token");
      if (res.status !== 200) {
        router.push("/admin/login");
      }
    }
    checkAuth();
  }, []);

  useEffect(() => {
    async function fetchBlogs() {
      const res = await fetch("/api/blogs-with-content");
      if (!res.ok) throw new Error("Failed to fetch blogs");
      const data = await res.json();
      setBlogs(data);
    }
    fetchBlogs();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (pendingChanges.length > 0) {
        const message =
          "Bạn có thay đổi chưa lưu. Nếu bạn rời trang, thay đổi sẽ bị mất.";
        event.returnValue = message; // Chuẩn bị hiển thị cảnh báo mặc định của trình duyệt
        return message; // Một số trình duyệt yêu cầu trả về thông điệp này
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [pendingChanges]);

  function deleteTempBlog(id: string) {
    if (!confirm("Bạn có chắc chắn muốn xóa blog này?")) return;
    setBlogs(
      blogs.map((blog) =>
        blog.id === id ? { ...blog, isDeleted: true } : blog
      )
    );
    setPendingChanges([...pendingChanges, { id, isDeleted: true }]);
  }

  function editBlog(id: string) {
    const blogToEdit = blogs.find((blog) => blog.id === id);
    if (!blogToEdit) return;
    setEditingBlog({ ...blogToEdit });
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
  function updateEditingBlog(field: keyof Blog, value: string) {
    if (editingBlog) {
      let updatedBlog = { ...editingBlog, [field]: value };

      // Tự động tạo slug khi chỉnh sửa title
      if (field === "title" && !editingBlog.slug) {
        updatedBlog.slug = value
          .toLowerCase()
          .normalize("NFD") // Chuẩn hóa Unicode
          .replace(/[\u0300-\u036f]/g, "") // Xóa dấu
          .replace(/[^a-z0-9\s-]/g, "") // Xóa ký tự đặc biệt
          .trim()
          .replace(/\s+/g, "-"); // Thay khoảng trắng bằng dấu gạch ngang
      }

      setEditingBlog(updatedBlog);
    }
  }
  async function handleThumbnailChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Gọi API frontend thay vì gọi trực tiếp backend
      const response = await fetch("/api/blogs/upload-thumbnail", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (editingBlog) {
          setEditingBlog((prev) =>
            prev ? { ...prev, thumbnail: data.url } : null
          );
        }
      } else {
        alert("Lỗi khi upload ảnh");
      }
    } catch (error) {
      console.error("Upload thất bại:", error);
    }
  }

  function saveEditedBlog() {
    if (!editingBlog) return;
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) =>
        blog.id === editingBlog.id
          ? {
              ...blog,
              updatedTitle: editingBlog.title,
              updatedContent: editingBlog.content,
              category: editingBlog.category,
            }
          : blog
      )
    );
    setPendingChanges([...pendingChanges, { ...editingBlog }]);
    setEditingBlog(null);
  }

  async function commitChanges() {
    console.log("🚀 pendingChanges trước commit:", pendingChanges);
    if (pendingChanges.length === 0) return;

    try {
      const res = await fetch("/api/auth/token");
      const { token } = await res.json();
      if (!token) {
        alert("Bạn chưa đăng nhập hoặc phiên đã hết hạn!");
        return;
      }

      for (const change of pendingChanges) {
        try {
          let res;
          if (change.isDeleted) {
            console.log("Xóa blog:", change.id);
            res = await fetch(`/api/blogs/${change.id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
          } else {
            console.log("Cập nhật blog:", change.id, change);
            res = await fetch(`/api/blogs/${change.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                id: change.id,
                slug:
                  change.slug ??
                  (change.title ?? "untitled")
                    .toLowerCase()
                    .replace(/\s+/g, "-"),
                title: change.updatedTitle ?? change.title,
                content: change.updatedContent ?? change.content,
                category: change.category, // Gửi category
                thumbnail: change.thumbnail ?? "/images/default-avatar.jpg",
              }),
            });
          }

          if (!res.ok) {
            console.error("Lỗi API:", res.status, await res.text());
            let errorMessage = `Lỗi ${res.status}`;
            try {
              const contentType = res.headers.get("content-type");
              if (contentType?.includes("application/json")) {
                const errorData = await res.json();
                errorMessage += `: ${
                  errorData.message || JSON.stringify(errorData)
                }`;
              } else {
                errorMessage += `: ${await res.text()}`;
              }
            } catch (error) {
              errorMessage += " (Không có thông tin lỗi cụ thể)";
            }
            console.error(`${errorMessage}`);
            alert(errorMessage);
          } else {
            console.log(`Thành công: ${res.status}`);
          }
        } catch (error) {
          console.error("Lỗi trong quá trình cập nhật:", error);
          alert("Đã xảy ra lỗi trong quá trình cập nhật.");
        }
      }
      alert("Commit thành công!");
      setPendingChanges([]);
    } catch (error) {
      console.error("Lỗi khi lấy token hoặc commit:", error);
      alert("Đã xảy ra lỗi khi commit thay đổi.");
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  }
  const changeBackground = (slug: string) => {
    if (slug.toLowerCase().endsWith("showblog")) {
      return "green"; // Nếu slug kết thúc bằng "showblog", nền sẽ là màu xanh lá
    }
    if (specialSlugs.some((specialSlug) => slug.includes(specialSlug))) {
      return "red"; // Nếu slug có trong specialSlugs, nền sẽ là màu đỏ
    }
    return ""; // Nếu không, giữ nguyên nền mặc định
  };
  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>
      <div className="button-container">
        <button
          onClick={() => router.push("/admin/create")}
          className="large-button"
        >
          📝 Tạo Blog
        </button>
        <button
          onClick={commitChanges}
          disabled={pendingChanges.length === 0}
          className="large-button"
        >
          Commit Thay Đổi
        </button>
        <button onClick={logout} className="large-button">
          Đăng xuất
        </button>
      </div>
      {editingBlog && (
        <div
          style={{
            border: "1px solid black",
            padding: "10px",
            marginBottom: "20px",
          }}
        >
          <h2>Chỉnh sửa Blog</h2>
          <input
            type="text"
            value={editingBlog.title}
            onChange={(e) => updateEditingBlog("title", e.target.value)}
            placeholder="Nhập tiêu đề blog......"
          />
          <input
            type="text"
            value={editingBlog.slug || ""}
            onChange={(e) => updateEditingBlog("slug", e.target.value)}
            placeholder="Nhập slug blog..."
          />
          <select
            value={editingBlog.category || ""}
            onChange={(e) => updateEditingBlog("category", e.target.value)}
          >
            <option value="">Chọn danh mục</option>
            <option value="HomeRenovation">Home Renovation</option>
            <option value="Staging">Staging</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Landscaping">Landscaping</option>
            <option value="PropertyMaintenance">Property Maintenance</option>
            <option value="News">News</option>
          </select>
          <div>
            <label>Ảnh Thumbnail:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleThumbnailChange(e)}
            />
            {editingBlog.thumbnail && (
              <img src={editingBlog.thumbnail} alt="Thumbnail" width={100} />
            )}
          </div>
          <button onClick={saveEditedBlog}> 💾 Lưu</button>
          <button
            onClick={() => setEditingBlog(null)}
            style={{ marginLeft: "10px" }}
          >
            ❌ Hủy
          </button>

          <ReactQuill
            value={editingBlog.content || ""}
            onChange={(value) => updateEditingBlog("content", value)}
            placeholder="Nhập nội dung blog..."
            theme="snow"
            modules={modules}
          />
        </div>
      )}

      <h2>All Blogs</h2>
      <ul>
        {blogs
          .filter((blog) => !blog.isDeleted)
          .map((blog) => (
            <li
              key={blog.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                backgroundColor: changeBackground(blog.slug ?? ""),
              }}
            >
              <img src={blog.thumbnail} alt="Avatar" width={50} height={50} />
              <div>
                <strong>{blog.updatedTitle || blog.title}</strong>
                <p>
                  <em>Category: {blog.category || "Uncategorized"}</em>
                </p>{" "}
                {/* Hiển thị category */}
              </div>
              <button onClick={() => editBlog(blog.id)}>✏️ Sửa</button>
              <button onClick={() => deleteTempBlog(blog.id)}>🗑 Xóa</button>
            </li>
          ))}
      </ul>
    </div>
  );
}

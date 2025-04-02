import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      console.error("❌ Không có token, yêu cầu bị từ chối.");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const updatedBlog = await req.json();
    if (!updatedBlog.title || !updatedBlog.content) {
      return NextResponse.json({ message: "Title and content are required" }, { status: 400 });
    }

    const { id } = context.params;
    console.log(`📝 Updating blog with ID: ${id}`);

    const res = await fetch(`${process.env.API_BACKEND_URL}/api/blogs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(updatedBlog),
    });

    if (!res.ok) {
      const errorMessage = await res.text();
      console.error(`❌ Backend error: ${res.status} ${errorMessage}`);
      return NextResponse.json({ message: `Failed to update blog: ${errorMessage}` }, { status: res.status });
    }

    console.log("✅ Blog updated successfully");
    return NextResponse.json({ message: "✅ Blog updated successfully" });
  } catch (error) {
    console.error("❌ Lỗi trong API PUT:", error);
    return NextResponse.json({ message: "Internal Server Error", error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request, context: { params: { id: string } }) {
  try {
    const cookieStore = await cookies(); // Add `await` here
    const token = cookieStore.get("authToken")?.value || "";

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const {id} = await context.params; // Ensure `params` is accessed correctly
    console.log(`🗑 Deleting blog with ID: ${id}`);

    const res = await fetch(`${process.env.API_BACKEND_URL}/api/blogs/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const errorMessage = await res.text();
      console.error(`❌ Backend error: ${res.status} ${errorMessage}`);
      return NextResponse.json({ message: `Failed to delete blog: ${res.statusText}` }, { status: res.status });
    }

    return NextResponse.json({ message: "✅ Blog deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting blog:", error);
    return NextResponse.json({ message: "Internal Server Error", error: (error as Error).message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData(); // Lấy dữ liệu từ request

    const response = await fetch(`${process.env.API_BACKEND_URL}/api/blogs/upload-thumbnail`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Upload thất bại" }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Lỗi server: " + error }, { status: 500 });
  }
}

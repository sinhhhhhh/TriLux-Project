import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, context: { params: { slug: string } }) {
  try {
    const {slug} = await context.params; 
    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const API_URL = process.env.API_BACKEND_URL;
    if (!API_URL) {
      return NextResponse.json({ error: "API_BACKEND_URL is not defined" }, { status: 500 });
    }

    const res = await fetch(`${API_URL}/api/blogs/slug/${slug}`);

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch blog" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
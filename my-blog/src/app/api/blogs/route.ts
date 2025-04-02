import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  try {
    let url = `${process.env.API_BACKEND_URL}/api/blogs`;
    console.log(url);
    if (category) {
      url = `${process.env.API_BACKEND_URL}/api/blogs/category/${category}`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch blogs");

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const cookieStore = await cookies(); 
    const token = cookieStore.get("authToken")?.value || ""; 

    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const blog = await req.json();
    const res = await fetch(`${process.env.API_BACKEND_URL}/api/blogs`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(blog),
    });

    if (!res.ok) throw new Error("Failed to create blog");
    return NextResponse.json(await res.json(), { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}

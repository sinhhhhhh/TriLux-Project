import { cookies } from "next/headers";
import { NextResponse } from "next/server";


export async function GET() {

  try {
    let url = `${process.env.API_BACKEND_URL}/api/blogs/with-content`;
    console.log(url);


    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch blogs");

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 500 });
  }
}
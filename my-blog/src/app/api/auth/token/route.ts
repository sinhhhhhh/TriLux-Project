import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("authToken")?.value || "";

    if (!token) {
      return NextResponse.json({ message: "No token found" }, { status: 401 });
    }

    return NextResponse.json({ token });
  } catch (error) {
    console.error("❌ Lỗi API token:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
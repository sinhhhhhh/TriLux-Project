import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logout successful" });
  response.cookies.set("authToken", "", { expires: new Date(0), path: "/" }); // ✅ Xóa cookie
  return response;
}

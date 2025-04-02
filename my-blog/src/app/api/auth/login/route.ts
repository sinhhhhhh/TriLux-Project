import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    const res = await fetch(`${process.env.API_BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!res.ok) throw new Error("Invalid password");

    const { token } = await res.json();

    const response = NextResponse.json({ message: "Login successful" });
    response.cookies.set("authToken", token, { httpOnly: true, secure: true, path: "/" });

    return response;
  } catch (error) {
    return NextResponse.json({ message: (error as Error).message }, { status: 401 });
  }
}

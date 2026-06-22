import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const base = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL;
    if (!base) {
      return NextResponse.json(
        { success: false, message: "BASE_URL missing in env" },
        { status: 500 },
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    console.log("COOKIE token exists?", !!cookieStore.get("token")?.value);

    const res = await fetch(`${base}/notification`, {
      method: "GET",
      headers: {
        accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });

    const raw = await res.text();
    let data: any = raw;

    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {}

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error", error: String(error) },
      { status: 500 },
    );
  }
}

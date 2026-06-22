import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  console.log("✅ COUNT route hit");

  try {
    const { id } = await params;
    console.log("✅ params id:", id);

    const base = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL;
    console.log("✅ base:", base);

    if (!base) {
      return NextResponse.json(
        { success: false, message: "BASE_URL missing" },
        { status: 500 },
      );
    }

    if (!id || id === "undefined") {
      return NextResponse.json(
        { success: false, message: "Invalid id", id },
        { status: 400 },
      );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    console.log("✅ token exists?", !!token);

    const url = `${base}/notification/count/${encodeURIComponent(id)}`;
    console.log("➡️ fetching:", url);

    // Keep timeout above observed upstream latency.
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 12000);

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          accept: "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        cache: "no-store",
        signal: controller.signal,
      });

      const raw = await res.text();
      let data: any = { count: 0 };

      try {
        data = raw ? JSON.parse(raw) : { count: 0 };
      } catch {
        data = { count: 0 };
      }

      return NextResponse.json(data, { status: res.status });
    } catch (fetchError: any) {
      const isAbort = fetchError?.name === "AbortError";
      return NextResponse.json(
        {
          success: false,
          message: isAbort
            ? "Notification count request timed out"
            : "Failed to fetch notification count",
          count: 0,
        },
        { status: isAbort ? 504 : 502 },
      );
    } finally {
      clearTimeout(t);
    }
  } catch (error) {
    console.log("❌ COUNT route error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error", error: String(error) },
      { status: 500 },
    );
  }
}

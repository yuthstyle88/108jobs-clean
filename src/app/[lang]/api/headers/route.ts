import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const hdr = await headers();

  // Build a plain object of request headers (case-insensitive pairs)
  const headersObj = Object.fromEntries(Array.from(hdr as any)) as Record<string, string>;

  // Resolve host/proto robustly behind proxies (nginx/vercel/etc.)
  const host = hdr.get("x-forwarded-host") || hdr.get("host") || "localhost:3000";
  const protocol = hdr.get("x-forwarded-proto") || (host?.startsWith("localhost") ? "http" : "https");

  const fullUrl = `${protocol}://${host}`;

  return NextResponse.json(
    { headers: headersObj, fullUrl },
    { status: 200 }
  );
}
// src/app/api/search/route.ts
import { NextResponse } from "next/server";

const UNSPLASH_BASE_URL = "https://api.unsplash.com";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const page = Number(searchParams.get("page") || "1");
  const perPage = Number(searchParams.get("perPage") || "12");

  if (!query) {
    return NextResponse.json(
      { error: "Missing search query (?q=)" },
      { status: 400 }
    );
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    return NextResponse.json(
      { error: "Unsplash access key not configured on server" },
      { status: 500 }
    );
  }

  const url = `${UNSPLASH_BASE_URL}/search/photos?query=${encodeURIComponent(
    query
  )}&page=${page}&per_page=${perPage}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
    },
    // Optional: disable caching while developing
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json(
      { error: "Unsplash request failed", details: text },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}

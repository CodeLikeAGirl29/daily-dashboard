// app/api/dashboard/route.ts
import { NextResponse } from "next/server";
import {
  fetchWeather,
  fetchDailyQuote,
  fetchDashboardImage,
  type WeatherData,
  type QuoteData,
  type DashboardImage,
} from "../../lib/dashboard";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city =
    searchParams.get("city") || "Fort Walton Beach, Florida";

  try {
    const [weather, quote, image] = await Promise.all([
      fetchWeather(city),
      fetchDailyQuote(),
      fetchDashboardImage(),
    ]);

    return NextResponse.json({
      city,
      weather,
      quote,
      image,
    });
  } catch (err: any) {
    console.error("Dashboard API error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Failed to load dashboard" },
      { status: 500 }
    );
  }
}

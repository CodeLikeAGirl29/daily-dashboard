// app/lib/dashboard.ts

const WEATHERSTACK_BASE_URL = `http://api.weatherstack.com`;
const API_NINJAS_QUOTES_URL =
  `https://api.api-ninjas.com/v2/quotes?category=success,wisdom,life,knowledge,attitude,leadership,hope,happiness,learning,experience`;
const UNSPLASH_RANDOM_URL =
  `https://api.unsplash.com/photos/random?query=landscape&orientation=landscape`;

export type WeatherData = {
  request?: {
    type?: string;
    query?: string;
    language?: string;
    unit?: string; // "m" | "f" | "s"
  };
  location: {
    name: string;
    country: string;
    region: string;
    lat?: string;
    lon?: string;
    timezone_id?: string;
    localtime?: string;
    localtime_epoch?: number;
    utc_offset?: string;
  };
  current: {
    observation_time?: string;
    temperature: number; // as returned by API (we'll convert)
    weather_code?: number;
    weather_icons: string[];
    weather_descriptions: string[];
    wind_speed: number;
    wind_degree?: number;
    wind_dir?: string;
    pressure?: number;
    precip?: number;
    humidity: number;
    cloudcover?: number;
    feelslike: number;
    uv_index?: number;
    visibility?: number;
  };
};

export type QuoteData = {
  quote: string;
  author: string;
};

export type DashboardImage = {
  id: string;
  urls: {
    regular: string;
    small: string;
  };
  alt_description: string | null;
  user: {
    name: string;
  };
};

export async function fetchWeather(city: string): Promise<WeatherData> {
  const apiKey = process.env.WEATHERSTACK_API_KEY;
  if (!apiKey) {
    throw new Error("WEATHERSTACK_API_KEY is not set in environment");
  }

  // Let Weatherstack use its default unit ("m" on free plans).
  const url = `${WEATHERSTACK_BASE_URL}/current?access_key=${apiKey}&query=${encodeURIComponent(
    city
  )}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Weather request failed (${res.status} ${res.statusText}): ${text}`
    );
  }

  const data = await res.json();

  if (data.error) {
    throw new Error(
      `Weatherstack error: ${data.error.code} - ${data.error.info}`
    );
  }

  return data as WeatherData;
}

export async function fetchDailyQuote(): Promise<QuoteData> {
  const apiKey = process.env.API_NINJAS_KEY;
  if (!apiKey) {
    throw new Error("API_NINJAS_KEY is not set in environment");
  }

  const res = await fetch(API_NINJAS_QUOTES_URL, {
    headers: {
      "X-Api-Key": apiKey,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Quote request failed (${res.status}): ${text}`);
  }

  const data = (await res.json()) as QuoteData[];

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("No quote returned from API Ninjas");
  }

  return data[0];
}

export async function fetchDashboardImage(): Promise<DashboardImage> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    throw new Error("UNSPLASH_ACCESS_KEY is not set in environment");
  }

  const res = await fetch(UNSPLASH_RANDOM_URL, {
    headers: {
      Authorization: `Client-ID ${accessKey}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Unsplash image request failed (${res.status}): ${text}`
    );
  }

  return res.json();
}

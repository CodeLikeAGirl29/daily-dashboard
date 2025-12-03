"use client";

import { useEffect, useState, FormEvent } from "react";
import type {
  WeatherData,
  QuoteData,
  DashboardImage,
} from "../lib/dashboard";

type DashboardResponse = {
  city: string;
  weather: WeatherData;
  quote: QuoteData;
  image: DashboardImage;
};

export default function DashboardClient() {
  const [cityInput, setCityInput] = useState("Fort Walton Beach, Florida");
  const [city, setCity] = useState("Fort Walton Beach, Florida");

  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard data whenever `city` changes
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/dashboard?city=${encodeURIComponent(city)}`
        );

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Failed to load dashboard");
        }

        const json = (await res.json()) as DashboardResponse;
        if (!cancelled) {
          setData(json);
        }
      } catch (err: any) {
        if (!cancelled) {
          console.error(err);
          setError(err?.message ?? "Failed to load dashboard");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [city]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (cityInput.trim() === "") return;
    setCity(cityInput.trim());
  }

  const weather = data?.weather;
  const quote = data?.quote;
  const image = data?.image;

  // Convert whatever Weatherstack sends to Fahrenheit for display
  const apiUnit = weather?.request?.unit ?? "m"; // "m" | "f" | "s"
  const rawTemp = weather?.current.temperature;
  const rawFeels = weather?.current.feelslike;

  const tempDisplay =
    rawTemp == null
      ? null
      : apiUnit === "m"
        ? Math.round((rawTemp * 9) / 5 + 32)
        : Math.round(rawTemp);
  const feelsDisplay =
    rawFeels == null
      ? null
      : apiUnit === "m"
        ? Math.round((rawFeels * 9) / 5 + 32)
        : Math.round(rawFeels);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "2rem 1.5rem",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        background: "linear-gradient(135deg, #0f172a, #1e293b, #020617)",
        color: "#e5e7eb",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1.75rem",
        }}
      >
        {/* Header + search */}
        <header
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "2.25rem",
                marginBottom: "0.25rem",
                letterSpacing: "0.02em",
              }}
            >
              Daily Dashboard
            </h1>
            <p style={{ color: "#9ca3af", margin: 0 }}>
              A quick snapshot of today — image, wisdom, and weather.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              background: "rgba(15, 23, 42, 0.9)",
              padding: "0.5rem 0.75rem",
              borderRadius: "999px",
              border: "1px solid rgba(148,163,184,0.6)",
            }}
          >
            <input
              type="text"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="Enter city (e.g. Miami, Florida)"
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#e5e7eb",
                fontSize: "0.95rem",
                minWidth: "220px",
              }}
            />
            <button
              type="submit"
              style={{
                borderRadius: "999px",
                border: "none",
                padding: "0.4rem 0.9rem",
                fontSize: "0.9rem",
                fontWeight: 600,
                cursor: "pointer",
                background:
                  "linear-gradient(135deg, #38bdf8, #6366f1, #a855f7)",
                color: "#0f172a",
              }}
            >
              Update
            </button>
          </form>
        </header>

        {/* Loading / error */}
        {loading && (
          <p style={{ color: "#9ca3af", fontSize: "0.9rem" }}>
            Loading dashboard…
          </p>
        )}

        {error && !loading && (
          <p
            style={{
              padding: "1rem 1.25rem",
              borderRadius: "0.75rem",
              background: "#b91c1c",
              color: "white",
            }}
          >
            {error}
          </p>
        )}

        {/* Top: image */}
        {image && !loading && (
          <section
            style={{
              borderRadius: "1.25rem",
              overflow: "hidden",
              border: "1px solid rgba(148, 163, 184, 0.4)",
              background:
                "radial-gradient(circle at top, rgba(148, 163, 184, 0.2), transparent 60%)",
            }}
          >
            <div style={{ lineHeight: 0 }}>
              <img
                src={image.urls.regular}
                alt={image.alt_description ?? "Daily Unsplash image"}
                style={{
                  width: "100%",
                  maxHeight: "260px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>
            <div
              style={{
                padding: "0.85rem 1.1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "0.85rem",
                background:
                  "linear-gradient(to right, rgba(15,23,42,0.95), rgba(15,23,42,0.85))",
              }}
            >
              <span
                style={{
                  color: "#d1d5db",
                  textTransform: "capitalize",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "70%",
                }}
              >
                {image.alt_description || "Curated daily image"}
              </span>
              <span style={{ color: "#9ca3af" }}>
                Photo by <strong>{image.user.name}</strong> on Unsplash
              </span>
            </div>
          </section>
        )}

        {/* Bottom: quote + weather */}
        {!loading && (
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {/* Quote card */}
            <article
              style={{
                background: "rgba(15, 23, 42, 0.9)",
                borderRadius: "1rem",
                padding: "1.5rem",
                border: "1px solid rgba(148, 163, 184, 0.4)",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                boxShadow: "0 18px 40px rgba(15, 23, 42, 0.65)",
                minHeight: "180px",
              }}
            >
              <h2
                style={{
                  fontSize: "1.25rem",
                  margin: 0,
                  marginBottom: "0.25rem",
                }}
              >
                Daily Quote
              </h2>

              {quote ? (
                <>
                  <p
                    style={{
                      fontSize: "1rem",
                      lineHeight: 1.7,
                      margin: 0,
                      color: "#e5e7eb",
                    }}
                  >
                    “{quote.quote}”
                  </p>
                  <p
                    style={{
                      margin: 0,
                      color: "#9ca3af",
                      fontStyle: "italic",
                      textAlign: "right",
                    }}
                  >
                    — {quote.author}
                  </p>
                </>
              ) : (
                <p
                  style={{
                    margin: 0,
                    color: "#f97316",
                    fontSize: "0.9rem",
                  }}
                >
                  Quote unavailable right now.
                </p>
              )}
            </article>

            {/* Weather card */}
            <article
              style={{
                background: "rgba(15, 23, 42, 0.9)",
                borderRadius: "1rem",
                padding: "1.5rem",
                border: "1px solid rgba(148, 163, 184, 0.4)",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                boxShadow: "0 18px 40px rgba(15, 23, 42, 0.65)",
                minHeight: "180px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: "1.25rem",
                      margin: 0,
                    }}
                  >
                    Weather
                  </h2>
                  <p style={{ margin: 0, color: "#9ca3af" }}>
                    {weather
                      ? `${weather.location.name}, ${weather.location.region}`
                      : city}
                  </p>
                  {weather && (
                    <p
                      style={{
                        margin: 0,
                        marginTop: "0.25rem",
                        fontSize: "0.7rem",
                        color: "#6b7280",
                      }}
                    >
                    </p>
                  )}
                </div>
                {weather?.current.weather_icons?.[0] && (
                  <img
                    src={weather.current.weather_icons[0]}
                    alt={
                      weather.current.weather_descriptions?.[0] || "Weather"
                    }
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "999px",
                    }}
                  />
                )}
              </div>

              {weather && tempDisplay != null && feelsDisplay != null ? (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "0.3rem",
                    }}
                  >
                    <span style={{ fontSize: "2.7rem", fontWeight: 600 }}>
                      {tempDisplay}°
                    </span>
                    <span style={{ color: "#9ca3af" }}>F</span>
                  </div>

                  <p
                    style={{
                      margin: 0,
                      textTransform: "capitalize",
                      color: "#e5e7eb",
                    }}
                  >
                    {weather.current.weather_descriptions?.[0] ||
                      "Current weather"}
                  </p>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: "0.75rem",
                      marginTop: "0.5rem",
                      fontSize: "0.9rem",
                      color: "#d1d5db",
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, color: "#9ca3af" }}>Feels like</p>
                      <p style={{ margin: 0 }}>{feelsDisplay}°</p>
                    </div>
                    <div>
                      <p style={{ margin: 0, color: "#9ca3af" }}>Humidity</p>
                      <p style={{ margin: 0 }}>
                        {weather.current.humidity}%
                      </p>
                    </div>
                    <div>
                      <p style={{ margin: 0, color: "#9ca3af" }}>Wind</p>
                      <p style={{ margin: 0 }}>
                        {weather.current.wind_speed} mph
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <p
                  style={{
                    margin: 0,
                    color: "#f97316",
                    fontSize: "0.9rem",
                  }}
                >
                  Weather data is unavailable right now.
                </p>
              )}
            </article>
          </section>
        )}
      </div>
    </main>
  );
}

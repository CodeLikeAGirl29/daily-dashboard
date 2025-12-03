// src/app/unsplash/page.tsx
"use client";

import { FormEvent, useState } from "react";

type UnsplashPhoto = {
  id: string;
  urls: {
    small: string;
    regular: string;
  };
  alt_description: string | null;
  user: {
    name: string;
    links: {
      html: string;
    };
  };
  links: {
    html: string;
  };
};

type UnsplashResponse = {
  results: UnsplashPhoto[];
  total: number;
  total_pages: number;
};

export default function UnsplashSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UnsplashPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&perPage=15`
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Search failed");
      }
      const data: UnsplashResponse = await res.json();
      setResults(data.results);
    } catch (err: any) {
      setError(err.message ?? "Unknown error");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        padding: "2rem",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        maxWidth: "960px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>
        Unsplash Image Search
      </h1>
      <p style={{ marginBottom: "1.5rem", color: "#555" }}>
        Type a keyword and search high-quality photos via the Unsplash API.
      </p>

      <form
        onSubmit={handleSearch}
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <input
          type="text"
          placeholder="Search for cars, dogs, beaches…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            flex: 1,
            padding: "0.6rem 0.75rem",
            borderRadius: "0.5rem",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.6rem 1.25rem",
            borderRadius: "0.5rem",
            border: "none",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: "pointer",
            background: "#111827",
            color: "white",
            opacity: loading ? 0.8 : 1,
          }}
        >
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {error && (
        <p style={{ color: "red", marginBottom: "1rem" }}>Error: {error}</p>
      )}

      {!loading && searched && results.length === 0 && !error && (
        <p style={{ color: "#555" }}>No results found. Try a different query.</p>
      )}

      {/* Results grid */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        {results.map((photo) => (
          <article
            key={photo.id}
            style={{
              borderRadius: "0.75rem",
              overflow: "hidden",
              border: "1px solid #e5e7eb",
              background: "#fff",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <a
              href={photo.links.html}
              target="_blank"
              rel="noreferrer"
              style={{ display: "block", lineHeight: 0 }}
            >
              <img
                src={photo.urls.small}
                alt={photo.alt_description ?? "Unsplash photo"}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </a>
            <div style={{ padding: "0.75rem" }}>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.9rem",
                  color: "#111827",
                  fontWeight: 500,
                }}
              >
                {photo.alt_description || "Untitled"}
              </p>
              <p
                style={{
                  margin: "0.35rem 0 0",
                  fontSize: "0.8rem",
                  color: "#6b7280",
                }}
              >
                Photo by{" "}
                <a
                  href={photo.user.links.html}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#2563eb" }}
                >
                  {photo.user.name}
                </a>{" "}
                on Unsplash
              </p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

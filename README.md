# 🌤️ Daily Dashboard  
A modern Next.js application that displays a curated daily experience with a **random Unsplash image**, a **daily quote**, and **live weather** based on a user-selected city.

This project uses server-side API routes for secure data fetching and client-side rendering for a smooth, app-like dashboard experience.

<img width="1920" height="917" alt="image" src="https://github.com/user-attachments/assets/fbab4ff3-c849-4165-a88d-beeb5570bfc7" />


---

## ⭐ Features

### 🖼️ **Random Daily Image**
- Uses the **Unsplash API**
- Shows a new image each time the dashboard loads
- Displays the photographer’s name + alt description

### 📝 **Daily Quote**
- Fetches quotes from **API-Ninjas Quotes API**
- Pulls multiple quotes and selects one at random
- Automatically changes on reload

### 🌦️ **Weather Card**
- Powered by **Weatherstack API**
- Shows:
  - Current temperature (converted to Fahrenheit)
  - Weather icon + description
  - Feels-like temperature
  - Humidity
  - Wind speed
- Includes a city search bar (users can enter any location)
- Displays fallback errors if a request fails

### 🎨 **Styling**
- Gradient dashboard background  
- Custom “glass card” style inspired by CodePen article UI  
- Compact layout designed to fit on a single screen  
- Responsive structure using CSS + inline Next.js styling

---

## 🧩 Tech Stack

- **Next.js 14 (App Router)**
- **React**
- **Server Components + Client Components**
- **API Routes (`/api/dashboard` and `/api/search`)**
- **Unsplash API**
- **Weatherstack API**
- **API-Ninjas Quotes API**

---

## 🗂️ Project Structure

```

app/
├── api/
│   ├── dashboard/
│   │   └── route.ts        # Combines weather, quote, and image API calls
│   ├── search/
│   │   └── route.ts        # Unsplash search route
│
├── dashboard/
│   ├── page.tsx            # Redirect target page
│   └── DashboardClient.tsx # Full dashboard UI + client logic
│
├── lib/
│   └── dashboard.ts        # Fetch helpers for weather, quotes, images
│
└── page.tsx                # Redirects / → /dashboard

````

---

## 🔑 Environment Variables

Create a `.env.local` file in your project root:

```env
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
WEATHERSTACK_API_KEY=your_weatherstack_api_key
NINJAS_API_KEY=your_api_ninjas_key
````

> **Never commit this file.**

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

Visit:

```
http://localhost:3000/dashboard
```

### 3. Search for a city

Use the search bar to update the weather card instantly.

---

## 🔌 API Endpoints

### **GET /api/dashboard**

Returns:

```json
{
  "city": "Fort Walton Beach, Florida",
  "weather": { ... },
  "quote": { ... },
  "image": { ... }
}
```

### **GET /api/search?q=mountains**

Proxy route for Unsplash search.

---

## 🤝 Credits

* **Unsplash API** — Daily/random photography
* **Weatherstack** — Live weather data
* **API-Ninjas** — Daily quotes
* Some of the UI styling inspired by **RAFA3L** on CodePen

---

### ⭐ If you like this project, feel free to star it!

```

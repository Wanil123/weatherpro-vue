# 🌦️ WeatherPro

A modern, elegant Vue 3 weather application with real-time forecasts, geolocation, bilingual UI (FR/EN) and a polished dark luxury design.

![Vue](https://img.shields.io/badge/Vue.js-3.5-42b883?logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-2.3-yellow)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## ✨ Features

- 🌍 **Real-time weather** for any city via the free Open-Meteo API (no API key required)
- 📍 **Geolocation** with graceful permission handling
- 🗓️ **5-day forecast** with daily aggregation
- ⭐ **Favorites & search history** (persisted in `localStorage`)
- 🌐 **Bilingual** UI : French / English with auto-detection & live switch
- 🎨 **Premium animated weather backgrounds** (clear, clouds, rain, snow, thunderstorm, fog, night)
- ✨ **Canvas effects** : aurora bands, adaptive particles, parallax
- ♿ **Accessibility-first** : ARIA, focus-visible everywhere, `prefers-reduced-motion` honored, screen-reader friendly toasts
- 🎯 **Performance** : adaptive particle count, debounced resize, rAF-throttled mouse, LRU cache, cached gradient sprites
- 📱 **Mobile-first** responsive, touch-targets ≥ 44 px, viewport-fit support
- 🌗 **Dynamic `theme-color`** meta synced with the current weather

---

## 📸 Preview

The interface dynamically changes its background, particles and color palette based on the current weather and time of day.

| State        | Visual                                                      |
| ------------ | ----------------------------------------------------------- |
| Clear day    | Warm amber orb, soft sun glow, gentle fireflies             |
| Rain         | Falling raindrops canvas, deep-blue gradient, drifting cloud |
| Thunderstorm | Sporadic lightning flash (WCAG-safe), heavy rain            |
| Night        | Aurora bands, twinkling stars, crescent moon                |

---

## 🛠️ Tech stack

| Layer            | Library                                                          |
| ---------------- | ---------------------------------------------------------------- |
| Framework        | [Vue 3.5](https://vuejs.org/) (Composition API + `<script setup>`) |
| Build            | [Vite 5](https://vitejs.dev/)                                      |
| State            | [Pinia 2](https://pinia.vuejs.org/)                                |
| Styling          | [Tailwind CSS 3](https://tailwindcss.com/) + CSS Custom Properties |
| HTTP             | [Axios](https://axios-http.com/) with `AbortController` + LRU cache |
| Dates            | [Day.js](https://day.js.org/) with locale support                  |
| API              | [OpenWeatherMap](https://openweathermap.org/api)                   |

---

## 📂 Project structure

```
src/
├── App.vue                    # Root component
├── main.js                    # Vue bootstrap (global errorHandler, ripple directive)
├── assets/styles.css          # Tailwind + design tokens (CSS variables)
├── components/
│   ├── SearchBar.vue
│   ├── CurrentWeather.vue
│   ├── WeatherDetails.vue
│   ├── ForecastList.vue / ForecastCard.vue
│   ├── FavoritesPanel.vue / SearchHistory.vue
│   ├── WeatherBackground.vue  # Animated CSS background per weather theme
│   ├── ParticleCanvas.vue     # Adaptive canvas particles
│   ├── AuroraEffect.vue       # Canvas aurora bands (night only)
│   ├── WeatherGreeting.vue    # Typing-effect greeting (a11y-safe)
│   ├── ToastNotifications.vue # ARIA-live + pause on hover/focus
│   ├── LoadingSpinner.vue / SkeletonLoader.vue
│   ├── ThemeToggle.vue
│   └── icons/                 # WeatherIcon dispatcher + SVG variants
├── composables/
│   ├── useWeather.js          # Fetch + format + abort handling
│   ├── useGeolocation.js      # Permission, validation, timeout fallback
│   ├── useLocalStorage.js     # Safe persistence (Safari private mode aware)
│   ├── useTilt.js             # 3D tilt (RAF-throttled, hover:none aware)
│   └── useAnimatedNumber.js   # Eased counter (prefers-reduced-motion aware)
├── directives/vRipple.js      # Material ripple (memory-safe)
├── i18n/                      # fr.js / en.js + useI18n.js
├── services/weatherApi.js     # Axios client + LRU cache + AbortController + timeout
├── stores/                    # Pinia (favorites, notifications)
└── utils/                     # formatters, themes, weatherIcons
```

---

## 🚀 Getting started

### Prerequisites

- **Node.js ≥ 18** (Vite 5 requires it)
- An **OpenWeatherMap API key** (free tier: 1 000 calls / day) — [get one here](https://openweathermap.org/api)

### Install

```bash
git clone <your-repo>
cd weatherpro-vue
npm install
```

### Configure the API key

```bash
# Linux / macOS
cp .env.example .env

# Windows PowerShell
Copy-Item .env.example .env
```

Then edit `.env` :

```ini
VITE_OPENWEATHER_KEY=your_api_key_here
```

> ⚠️ **Security note.** Any `VITE_*` variable is inlined into the client bundle and therefore visible to anyone who inspects your site. For production deployments, proxy the request through a serverless function (Cloudflare Worker, Vercel Edge Function, Netlify Function) that keeps the key server-side, or restrict the key by referrer/IP on the OpenWeather dashboard.

### Develop

```bash
npm run dev
# → http://localhost:5173
```

### Build & preview

```bash
npm run build      # outputs to dist/
npm run preview    # serves the built bundle
```

---

## ⚙️ Environment variables

| Variable               | Required | Description                          |
| ---------------------- | -------- | ------------------------------------ |
| `VITE_OPENWEATHER_KEY` | ✅ Yes   | Your OpenWeatherMap API key          |

---

## ♿ Accessibility

WeatherPro takes accessibility seriously :

- Skip-to-content link at the top of the page
- Semantic HTML (`<main>`, `<header>`, `<footer>`, `<section role="region">`, `<dl>` for paired data)
- All interactive elements have `aria-label`, `aria-pressed`, `aria-busy` or `aria-live` where appropriate
- `:focus-visible` rings everywhere — no `outline: none` without a replacement
- Toast notifications use a polite + assertive `aria-live` split
- Toasts pause on hover / focus and resume on leave
- Animations honor `prefers-reduced-motion: reduce` at the CSS and JS level
- Color contrast tuned for WCAG AA on dark backgrounds
- Touch targets ≥ 44 × 44 px (WCAG 2.5.5)
- Lightning visuals are **single-flash** (no strobing) to meet WCAG 2.3.1

---

## 🌐 Internationalization

Add a new language in 3 steps :

1. Duplicate `src/i18n/en.js` → `src/i18n/<code>.js` and translate values
2. Register it in `src/i18n/useI18n.js` (`messages` + `SUPPORTED`)
3. (Optional) add it to the RTL list if applicable

Interpolation pattern : `t('weatherLoaded', { city: 'Paris' })`.

---

## 🧪 Available scripts

| Command              | What it does                       |
| -------------------- | ---------------------------------- |
| `npm run dev`        | Start the dev server with HMR      |
| `npm run build`      | Production build to `dist/`        |
| `npm run preview`    | Serve the production build locally |

---

## 🩹 Known limitations

- The **UV Index** field is not provided by `/data/2.5/weather` and is therefore displayed as `—`. Switching to OneCall 3.0 (paid tier) would expose it.
- The API key is **client-side** by design of Vite env handling — proxy it for production.

---

## 📜 License

MIT — feel free to fork, learn and adapt.

---

Built with ❤️, Vue 3 and a lot of midnight coffee.

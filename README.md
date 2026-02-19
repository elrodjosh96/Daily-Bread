# Daily Bread

Daily Bread is a frontend-only Bible reading app built with **React + Vite**, powered by the **Crossway ESV API**. It was built as a portfolio project to demonstrate API integration, localStorage persistence, date-based logic, and a clean component-driven UI — all without a backend.

---

## User Story

A user opens Daily Bread, selects a reading plan, and sets a start date. From that point on, the app automatically calculates the current day in the plan, fetches the correct Scripture passages from the ESV API, and displays them chapter by chapter. Progress is saved locally so the user never loses their place. If they prefer reading at night, they can switch to dark mode with a single toggle — and the app will remember their preference the next time they visit.

---

## Features

- **Multiple reading plans** — 30-day OT, 30-day NT, 90-day whole Bible, 1-year whole Bible
- **Date-based day calculation** — determines the current reading day from a stored start date
- **Single API call per session** — all chapters for the day are fetched in one request and paginated client-side
- **Chapter pagination** — Previous/Next controls let users move through chapters without scrolling
- **Red-letter text** — words of Christ rendered in red via ESV HTML endpoint and the `.woc` CSS class
- **Dark mode** — pill-style toggle switches between light and dark themes, preference saved in localStorage
- **localStorage persistence** — start date, selected plan, completed days, and theme preference are all saved in the browser
- **GitHub Pages deployment** — statically hosted with Vite's base path config

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build tool | Vite |
| API | Crossway ESV API |
| Styling | Plain CSS with CSS custom properties |
| Hosting | GitHub Pages via `gh-pages` |
| State persistence | localStorage |

---

## Getting Started

1. Register for a free ESV API key at [api.esv.org](https://api.esv.org/)
2. Clone the repo:
   ```bash
   git clone https://github.com/elrodjosh96/Daily-Bread.git
   cd Daily-Bread
   ```
3. Create a `.env` file in the project root:
   ```
   VITE_ESV_API_KEY=your_api_key_here
   VITE_BASE_PATH=/
   ```
4. Install dependencies and start the dev server:
   ```bash
   npm install
   npm run dev
   ```

---

## Deployment

Build and deploy to GitHub Pages:

```bash
npm run build
npm run deploy
```

Ensure `.env.production` contains:
```
VITE_BASE_PATH=/Daily-Bread/
```

---

## Scripture Credit

Scripture quotations are from The Holy Bible, English Standard Version® (ESV®), copyright © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved.
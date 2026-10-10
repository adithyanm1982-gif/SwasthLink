# SWASTHLINK

Unified AI Triage & Tele-care Grid for Chennai. Monochrome clinical UI; colour is used only for status (green live, red emergency).

## Run
    npm install
    npm run dev                      # frontend on http://localhost:5173
    cd server && cp .env.example .env && npm install && npm start   # optional API on :5000

The frontend works on its own. If the API is offline, or returns 404/5xx, it falls back to demo data so no page is ever blank. Real 4xx errors (bad login, forbidden) are shown to the user.

## Stack
| Concern | Where |
|---|---|
| React + Vite, React Router (lazy routes, skeleton fallbacks, error boundary) | `src/` |
| Tailwind CSS (sharp-edged monochrome theme) | `tailwind.config.js`, `src/index.css` |
| Express API, JWT auth, RBAC middleware, rate limit, Helmet | `server/index.js` |
| Jitsi Meet video consultations | `components/features/VideoRoom.jsx`, `pages/dashboard/Consult.jsx` |
| AI (OpenAI via backend, local fallback) | `server/index.js`, `src/lib/api.js`, `src/lib/assistant.js` |
| Uploads (Cloudinary via backend, local fallback; swap for S3) | `server/index.js`, `components/features/UploadZone.jsx` |
| Charts (Recharts) | `pages/dashboard/Analytics.jsx` |
| Database | users are in memory; replace with PostgreSQL or MongoDB in `server/index.js` |
| Clerk / Auth0 | optional: replace `login/signup` in `src/lib/store.jsx`; env keys in `.env.example` |

## Roles (RBAC)
`patient`, `guest`, `worker` (doctor or staff), `authority`. `src/lib/nav.js` drives both the sidebar and route guards. The API enforces the same roles.

## HTTPS
Serve behind a TLS proxy (Nginx, Caddy, Cloudflare) in production. Helmet sends HSTS once the API is reached over HTTPS. For local HTTPS add `@vitejs/plugin-basic-ssl`.

## Notes
- Data in `src/data/dataset.json` is fictional mock data. Demo password for the seeded accounts is `Swasth@123`.
- The Health ID is a demo identifier, not a government ABHA number.
- Jitsi uses the public `meet.jit.si` by default. Set `VITE_JITSI_DOMAIN` to self-host.

## Performance notes
- Every page is code-split, then preloaded right after first paint (`src/lib/lazyPage.jsx`). Preloaded pages render synchronously, so tab, sidebar and button clicks respond instantly.
- Auth and data calls skip an unreachable backend for 30 seconds (`src/lib/api.js`), so demo-mode login and signup are immediate.
- Vite pre-bundles the heavy libraries (`optimizeDeps` in `vite.config.js`) to keep the first dev-server navigation quick.

## Theme (dark / light)
Colours are CSS variables (`src/index.css`) wired into Tailwind (`tailwind.config.js`), so the toggle in the header re-themes every page. The choice is saved in `localStorage` and applied before first paint (script in `index.html`). Use the `keep-light` class on an element that must stay black-and-white in both themes.

## AI Assistant
`src/pages/dashboard/Assistant.jsx` composes `components/chat/*` (history sidebar, messages, composer, welcome screen). Chats are saved per user by `src/lib/useChats.js`.

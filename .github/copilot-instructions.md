---
description: "Quick, focused instructions to help AI coding agents work productively in this assignment repo."
---

# Copilot / AI agent instructions for this repository

This repo is a small Express + static frontend app for a course assignment (A4). The goal of the project is a user-scoped CRUD app for car entries stored in MongoDB. The guidance below focuses on concrete, discoverable patterns, commands, and files you should read or update.

Key files
- `server.express.js` — single Express server, API routes, and auth guard (`requireUser`). Read this first to understand server-side routing, middleware, and data model.
- `package.json` — minimal scripts: `npm start` runs `node server.express.js`.
- `public/` — static frontend pages. Important files:
  - `public/app.html` — React/ESM single-file UI using CDN React (client-side components, `api` helpers that hit `/api/*`).
  - `public/index.html` — legacy vanilla JS UI that also calls `/api/entries` endpoints.
  - `public/results.html` — table + CSV/JSON export; client-side filtering and sorting.

Big picture architecture
- Single-process Express server serving static files and a small JSON API under `/api/entries`.
- Authentication is cookie-based: a signed cookie named `user` is set on login (`/login` route) and cleared on `/logout`.
- Data lives in MongoDB collections `users` and `entries`. Each `entry` document includes at least `{ user, model, year, mpg }`. Server converts `_id` to string when responding and derives `age` from `year` via `withDerived()`.

Developer workflows / commands
- Start the app locally: `npm install` (if dependencies missing) then `npm start` (or `node server.express.js`). The server listens on `PORT` or 3000.
- Environment: the server uses `process.env.MONGODB_URI` and optional `COOKIE_SECRET`. If not present, local runs will fail connecting to MongoDB — use a local MongoDB or a cloud URI in `.env`.

API surface (concrete shapes)
- GET /api/entries — returns JSON array of entries for signed-in user. Each row: `{ _id, user, model, year, mpg, age }` (`_id` is string).
- POST /api/entries — body { model, year, mpg } → creates entry and returns created document (with age).
- PUT /api/entries/:id — partial update (any of model/year/mpg) for the authenticated user's entry.
- DELETE /api/entries/:id — deletes the user's entry and returns deleted doc.

Project-specific conventions & patterns
- Authentication guard: server sets a signed cookie `user` and protects routes using `requireUser` middleware. Frontend expects that fetches returning HTML (instead of JSON) indicate not-authenticated and will redirect to `/login`.
- Client code expects JSON content-type for API success. When content-type is not JSON, frontends treat it as "not logged in" and show an error.
- Frontend uses ESM imports from CDNs (in `public/app.html`) instead of a local bundler. Keep changes compatible with ESM/browser environment (no Node-only APIs in that file).
- IDs are MongoDB ObjectIds (server validates with `ObjectId.isValid`). Frontend stores and copies stringified `_id` values.

Testing and debugging tips
- If the server logs "MongoDB connected" the DB connection succeeded. Otherwise check `MONGODB_URI` and run MongoDB locally.
- To reproduce auth flows locally: visit `/` to reach login page, POST to `/login` with JSON { username, password } to create or sign in a user (server auto-creates users on first login).
- Use the browser devtools network tab to inspect fetch requests to `/api/entries` and confirm request bodies and response content-type.

Small, safe changes agents may make
- Add input validation messages on server-side routes to match the client-side expectations (server already checks types; preserve current 400/401/404 behaviors).
- Convert `app.listen` logging or add a small health route (`/health`) if required for monitoring.
- When editing `public/app.html`, keep it as ESM module and avoid adding build steps. If adding libraries, prefer unpkg/jsdelivr/esm.sh ESM CDN imports as currently used.

Examples from codebase
- API helper (client) expects JSON or treats HTML as not-logged-in:
  - See `public/app.html` api.list(): it throws if response content-type does not include `application/json`.
- Auth guard usage on static file route:
  - `app.use('/results.html', requireUser);` — this ensures unauthenticated access to `results.html` redirects to `/login.html`.

What not to change without asking
- Do not replace the cookie-based `user` session mechanism with JWT or a different auth flow unless the assignment requires it.
- Avoid introducing a bundler/build pipeline when making small frontend edits — the project intentionally uses CDN ESM imports.

If you need more context
- Read `server.express.js` and the three main `public/*.html` files; those contain the full app behavior for this assignment.
- Ask for the developer's intended deployment target (Render/Heroku) if you need to add build/deploy configuration.

Questions for the repo owner
- Do you expect new features to use a bundler (Vite/webpack) or stay CDN/ESM-based?
- Should agents add tests or keep changes limited to small runtime-safe edits?

---
If anything above is unclear or you'd like me to expand a section (examples, quick-start, or health checks), tell me which part and I'll update the file.

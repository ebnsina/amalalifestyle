# AMALA Lifestyle

**Purify Your Life, Transform Your Future.** — Where Better Habits Build Better Lives.

A lifestyle app for everyday people in Bangladesh, in বাংলা and English. It installs from the browser as an app
(PWA), works offline, and keeps everything on the device in SQLite. No account, no server, no tracking.

- **খাবারের হিসাব / Food log**: pick what was cooked at home and get suggested portions in household measures,
  based on a daily calorie estimate.
- **নামাজ / Prayer**: tick the five daily prayers, witr and nafl; see the last seven days and your streak.
- **ফিটনেস / Fitness**: home and gym routines with sets, a rest timer and form tips.
- **বই পড়া / Reading**: track the page you're on.
- **আজকের কাজ / Tasks**: to-dos with a date and priority, filtered by today, overdue, upcoming and done.
- **BMI** with the WHO Asian cut-offs.
- **Backup**: export and import everything as a JSON file. Backups from the Expo phone app import too.

> Nutrition values in `src/lib/data/foods.ts` are placeholders for UI review, not verified data.

## Run

```bash
npm install
npm run dev            # http://localhost:5173
npm test               # unit tests: calculations, search, backup parsing, tasks, language
npm run check          # types
npm run build && npm run preview   # the production build, with the offline service worker
```

## Deploy

`npm run build` writes a static site to `build/`. Serve it from any web server; unknown paths must fall back to
`index.html`, for example with nginx:

```nginx
location / { try_files $uri /index.html; }
```

## How it works

- **SvelteKit 3 + Svelte 5**, client-only (`ssr = false`), built with `adapter-static`.
- **SQLite in the browser**: `@sqlite.org/sqlite-wasm` runs in a Web Worker (`src/lib/db.worker.ts`) on the
  OPFS SAH-pool storage, so no special server headers are needed. Only one tab can hold the database at a time.
  Same tables as the phone app.
- **Offline**: `src/service-worker/index.ts` caches the app, fonts and the SQLite engine on first visit; every
  route opens from the cached page.
- **Two languages**: `t('বাংলা', 'English')` from `src/lib/i18n.svelte.ts`, written where each text is used.
  Numbers and dates follow the chosen language through `Intl`.
- **UI**: [sinaui](https://github.com/ebnsina/sinaui) components in `src/lib/sinaui`, styled only through
  `--ui-*` tokens in `src/app.css`. Noto Serif Bengali for Bangla; Clash Display (headings) and Inter Tight (body) for English, all bundled.

## Layout

- `src/routes/`: screens. `(tabs)/` holds home, food and profile.
- `src/lib/`: pure logic (`nutrition`, `bmi`, `search`, `backup`, `tasks`, `format`), the database (`db`,
  `db.worker`), the app store and language helper.
- `src/lib/data/`: the bundled food list and workouts.

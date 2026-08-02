# Changelog

All notable changes to this project are recorded here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Full marketing site: home, training, timetable, membership, nutrition,
  women's floor, coaches, method, journal (index and articles) and contact.
- `/app` — five browser-only tools: body check, calories and macros, meal plan,
  one-rep max and plate loader. All maths in `src/lib/fitness.ts`, from published
  formulas, with guard rails that block calorie output for under-18s, over-80s,
  pregnancy and BMI under 16.
- Women's floor: separate hours, women-only sessions flagged across the
  timetable, and a dedicated page.
- Design system in `src/routes/layout.css` — Archivo/Inter/Geist Mono, lime used
  only as a fill, square corners, no shadows.
- Error handling: `+error.svelte` with plain-language copy per status, and
  `handleError` in `src/hooks.ts` that logs detail and returns none of it.
- SEO: reusable `Seo` component emitting title, description, canonical, Open
  Graph and Twitter tags on every route.
- Mobile: sticky call/book bar, full-height nav sheet, full-width thumb-height
  buttons, safe-area insets.

### Changed

- Icons moved from hand-drawn SVG paths to HugeIcons (`@hugeicons/svelte`).
- Contact form validation moved to a shared valibot schema
  (`src/lib/schemas/enquiry.ts`) used by both the server action and the browser,
  so a message cannot drift between them.
- Number and date formatting centralised on `Intl` in `src/lib/format.ts`.
- Cards changed from grey fills to white with hairline borders; neutrals cooled.
- Women-only sessions marked with a chip rather than a left border.
- Disciplines on the home page moved from a row list to a card grid.
- Section headings no longer count items ("Four things..." to "Coached
  together, never in isolation") and now sit on one line.
- Coloured stub borders on card tops and edges replaced by a shared `.chip`,
  so emphasis reads as a label rather than a fragment of a frame.
- Hairline grids enclosed on all four sides with symmetric cell padding —
  open left and right edges made the cells look unfinished.
- Food photography runs unfiltered via `.media--vivid`; the blanket
  desaturation was draining the one subject where colour is the point.
- Home page figures strip moved onto the dark band with lime numerals, so the
  hero photograph resolves into a solid block before the white starts.

### Fixed

- Horizontal overflow on `/nutrition` at phone widths, caused by a nowrap table
  stretching its grid column (grid children default to `min-width: auto`).
- Safe-area padding on `.container` was being overridden by a duplicate rule.
- Meal plan suggested unrealistic portions (650 g of yoghurt) by dividing
  protein evenly and forcing one food to carry it.

### Notes for launch

Testimonials, contact details, prices, coach names and the timetable are all
placeholder content. Neither the contact form nor the newsletter delivers
anywhere yet. See `README.md`.

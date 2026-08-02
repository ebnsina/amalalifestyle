# Amala Lifestyle

Website for a coached strength, conditioning and nutrition gym in Banani, Dhaka.
SvelteKit 2 + Svelte 5 (runes), Tailwind 4, light theme only.

## Run it

```sh
pnpm install
pnpm dev        # dev server
pnpm build      # production build
pnpm check      # svelte-check
```

## Structure

| Path | What it is |
| --- | --- |
| `src/routes/layout.css` | The design system. Tokens, type scale, layout and component classes all live here — change values here, not in components. |
| `src/lib/data/site.ts` | All site content: nav, classes, timetable, plans, coaches, facilities, FAQs, journal articles. |
| `src/lib/components/` | Shared components. |
| `src/lib/icons.ts` | Named icon registry mapping to HugeIcons. |
| `src/lib/images.ts` | Resolves a `/images/name.jpg` path to its processed asset. |
| `src/lib/images/` | Placeholder photography, processed to AVIF/WebP at build time — see `CREDITS.md`. |

### Pages

`/` · `/training` · `/timetable` · `/membership` · `/nutrition` · `/womens` ·
`/coaches` · `/method` · `/journal` + `/journal/[slug]` · `/app` · `/contact`

### /app — the tools

Five calculators, picked from an index and opened one at a time (`?tool=`).
All maths lives in `src/lib/fitness.ts`; shared inputs live in
`src/lib/state/profile.svelte.ts` so details carry between tools.

| Tool | Formula |
| --- | --- |
| Body check | BMI, WHO 2004 South Asian cut-offs, waist-to-height, US Navy body fat |
| Calories & macros | Mifflin-St Jeor BMR → TDEE → goal split, ISSN protein ranges |
| Meal plan | Macro shares converted to capped portions of local food |
| One-rep max | Epley and Brzycki averaged, plus a %-of-max table |
| Plate loader | Greedy plate fill per side of a 20/15/10 kg bar |

Everything runs client-side; nothing is stored or transmitted. `advisoryFor()`
blocks calorie output for under-18s, over-80s, pregnancy and BMI under 16 —
**do not bypass it**, those formulas are only validated on healthy adults.

## Design system

- **Type** — Archivo (display, uses its 62–125 width axis), Inter (body), Geist
  Mono (labels, figures, metadata). Archivo is imported from its `wdth` build;
  the standard build has no width axis and headings would fall back to full
  width.
- **Colour** — neutrals carry the structure. Lime (`--lime`) is the only accent
  and appears **only as a fill**: buttons, marks, the current-page underline,
  women-only session flags, section ticks. Never as body text.
- **Shape** — every corner is square. There is no radius token.
- **Depth** — no shadows. A boundary is marked once: by space, a hairline, or a
  surface change, never two at the same edge.
- **Motion** — content ships visible in the HTML; page transitions only
  cross-fade, and everything is disabled under `prefers-reduced-motion`.

## Before this goes live

1. **Testimonials are placeholder copy.** `testimonials` in `site.ts` is written
   sample text, not real members. Replace with genuine, permissioned quotes.
2. **The contact form does not email anyone.** `src/routes/contact/+page.server.ts`
   validates and logs to the server console. Wire it to an inbox or booking
   system.
3. **The newsletter form does not subscribe anyone.** `Newsletter.svelte` only
   sets local state. Connect it to a mailing list provider.
4. **Contact details, prices and the timetable are invented.** Address, phone,
   email, social URLs, `plans` pricing and every session time need replacing.
5. **Photography is placeholder stock.** See `static/images/CREDITS.md`. Coach
   portraits in particular are stock people, not the actual coaches.
6. **Pick an adapter.** The project still uses `adapter-auto`.

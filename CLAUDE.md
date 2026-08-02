# Amala Lifestyle — working notes

Website for a coached strength, conditioning and nutrition gym in Banani, Dhaka.
SvelteKit 2 + Svelte 5 (runes), Tailwind 4, light theme only.

Read `README.md` first for how to run it and what lives where. This file records
**decisions that are not obvious from the code** — the reasons a change was made,
so a later session does not undo it.

## Commands

```sh
pnpm dev
pnpm check                  # svelte-check — must be 0 errors, 0 warnings
pnpm build
node scripts/check-responsive.mjs   # must report no horizontal overflow
```

Run all three before calling anything done. `check` treats unused CSS selectors
as warnings — clean them up rather than leaving them.

**Preview servers:** `pkill -f "vite.js preview"` is the pattern that actually
matches (`pkill -f "vite preview"` does **not** — the process is
`node .../vite.js preview`). Use port **4173** and reuse it; the user runs their
own `vite dev` on 5173/5179, so never kill by a pattern that catches `dev`.

## Information architecture

Six top-level items, deliberately. Order matters — it is the order a visitor
asks the questions.

**There is no "Home" item.** The wordmark links to `/`; a menu slot repeating
that is a slot wasted. Do not add one back.

**The home page does not preview pages that already exist.** It is hero →
"Which one of these is you?" → what you train → pricing → FAQ → CTA, and
nothing else. The coaches, facilities, method-steps, testimonial and women's
floor sections were all removed from it because each has its own page; the
women's floor is signalled instead as one of the four self-identifying cards.
Do not re-add teaser sections.

| Menu | Route | Notes |
| --- | --- | --- |
| — | `/` | Reached via the wordmark. Carries pricing and the FAQ in full |
| About us | `/about` | Story, four principles, the method steps |
| Programmes | `/training` | |
| Facilities | `/facilities` | **The gallery lives here**, not on its own page |
| Team | `/coaches` | |
| Blog | `/journal` | |
| Contact | `/contact` | |

**Not in the menu on purpose**, reachable from the footer and in-page links:
`/method`, `/nutrition`, `/timetable`, `/womens`, `/membership`,
`/success-stories`, `/app`.

- **Pricing and the FAQ are home-page sections** (`/#pricing`, `/#faq`), shown in
  full rather than teased. `/membership` still exists for the line-by-line
  comparison table, which is a genuinely different job. A menu entry for a block
  of text is a menu entry wasted.
- There is **no `/gallery` or `/faq` route** — they were built and then folded in.
  Do not recreate them.
- Every nav item carries a `blurb` in `src/lib/data/site.ts`. The menu sheet
  shows it under the label; the desktop bar uses it as `title`. Eleven bare
  labels is what made the old menu unreadable — keep the blurbs if items are
  added.

## Layout and header

- `--header-h` in `layout.css` is the single source of truth for the sticky bar
  (64px, 108px at ≥1120px where the second tier appears). The hero pulls itself
  up by exactly this, the menu sheet starts at it, and the scroll observer
  measures `bar.offsetHeight`. **Do not hardcode a header height anywhere.**
- The header is **one row**: wordmark, then the nav centred in the space left
  (`flex: 1; justify-content: center`), then phone + CTA. Six links fit beside a
  wordmark and a button with room to spare — it was briefly two tiers when the
  menu had eleven items, and that is no longer needed.
- The header is **transparent only while the home page is at rest at the top**,
  and takes its white surface back on `scrollY > 8`. It is *not* transparent for
  the whole length of the hero: the headline scrolls under the bar and white
  labels then cross white type and the lime mark, which is unreadable. `solid`
  defaults to `true`, so pages without `[data-hero]` — all of which start on a
  light `PageHeader` — are solid from first paint.
- `.section` has `scroll-margin-top: calc(var(--header-h) + 24px)` because
  sections are now link targets.

### The hero

Full-viewport (`100svh`), photograph behind, header blended over it. Content is
**headline and one sentence only** — no eyebrow, no buttons. Both were removed
deliberately; the header's own button is the call to action.

- Composition is **centred and asymmetric**: headline in the left column, the
  sentence in a narrower right column aligned to the headline's last line
  (≥1000px), with a small lime scroll cue beneath both.
- One word of the headline sits in `.mark` — a lime fill *behind* the word, the
  same rule the accent follows everywhere else. An inline background is drawn
  to the font's ascender and descender, and Archivo's are generous, so at
  display size it needs `display: inline-block` plus a tight `line-height` to
  hug the word instead of forming a slab.
- Two scrims: a flat 20% wash for the centre of the frame (the shared
  `.media__scrim` is bottom-weighted and thinnest exactly where the headline
  now sits) and the top gradient that gives the transparent bar its contrast.
- `afterNavigate` in `+layout.svelte` re-scrolls to `location.hash` inside a
  **double** `requestAnimationFrame`. One frame is not enough — the router's own
  scroll restoration runs after it and lands the page at the top.

## Design system (`src/routes/layout.css`)

Everything shared lives here. Change values here, not in components.

- **Colour** — neutrals carry the structure. Lime (`--lime`) is the accent, with
  `--lime-wash` as its thin surface tint. The client's note was that the
  original was "too black and white", so colour now appears as: card and tile
  hovers, icon badges, step badges, and the pricing cards.
- **Pricing cards** — outer two `--lime-wash`, the featured one full `--lime`.
  The featured card inverts its button to black, or a pale button on lime would
  read as the *quieter* option.
- `.icon-badge` — a 54px lime-wash tile behind an icon, filling solid when its
  parent tile or card is hovered. Icons on their own read as decoration. Use it
  for **decorative** icons; `.icon-box` stays for actual **controls** (the menu
  button, the disclosure toggle). `.icon-badge--solid` is for confirmations.
- `.step-badge` — a filled lime marker for numbered sequences.
- `.tile-hover` — for the bordered-grid blocks that are built as 1px gaps over a
  rule-coloured parent rather than as `.card`. **It owns the resting
  `background` too.** If a component also sets `background: var(--paper)` on the
  same element the two tie on specificity and the component, loaded later, wins
  — and the hover silently never paints.
- **Shape** — every corner is square. There is no radius token. No shadows. A
  boundary is marked once: by space, a hairline, or a surface change.

## Component gotchas

- **`.plans` uses subgrid.** The row template is declared on the parent in
  `layout.css` and each `PlanCard` opts in with `grid-template-rows: subgrid`,
  so the name, price, feature list and button align across all three. A
  placeholder claims the flag's row on unflagged cards, or they start a row
  early.
- **`PlanCard` switches layout mode at 900px** (flex column → grid). The
  "Most people start here" flag needs **both** `align-self: flex-start` *and*
  `justify-self: start` — the first constrains it in flex, the second in grid.
  With only one it stretches into a full-width bar on desktop.
- **`DisciplineCard`** is a photo tile with text over it, not an icon card.
  Readability is two layers: a flat 34% wash so a pale patch of wall cannot wash
  out the meta chip, plus a bottom gradient, plus a hairline text-shadow. The
  summary has `min-height: 4.8em` because the block is bottom-anchored and a
  two-line summary would lift its heading above the others.
- **Buttons are full-width below 560px** by design (`layout.css`). Do not
  override this per-page — it is what makes the site read as an app on a phone.
- `enhanced:img` wraps images in `<picture>`, which Svelte's scoped selectors do
  not reach. Use `:global()` inside the component.

## Content

- `src/lib/data/site.ts` holds all copy. Photography in `src/lib/images/` is
  **placeholder** — see `CREDITS.md`.
- **The testimonials are samples** (`name: 'Sample member'`). They render as-is
  on `/` and `/success-stories`. Real quotes are needed before launch.
- `/success-stories` deliberately avoids kilos, centimetres and before-and-after
  photos, and carries an "honest limits" section. Promising outcomes to a
  stranger reading a website is how gyms end up lying.
- `advisoryFor()` in the `/app` calculators blocks output for under-18s,
  over-80s, pregnancy and BMI under 16 — **do not bypass it.**

## Tone

**There are no eyebrow labels anywhere.** The small mono caption that used to
sit above every heading is gone from `Section`, `PageHeader` and `CtaBand` — it
said the same thing as the heading below it, in a second type size. Those
components no longer accept a `label`/`eyebrow` prop. Do not add one back.

**Headings are the conventional term for the thing, not a slogan and not an
over-simplified paraphrase.** "FAQ", "Pricing", "Testimonials", "Weekly
timetable", "Our story" — the words people already look for. Do not invent a
plainer phrase where a standard one exists.

**"Banani" has been removed from all copy and SEO descriptions** — the location
is a placeholder the client will set. `site.addressLines` still contains it and
is meant to be replaced wholesale.

Plain, concrete, faintly dry. Say what a thing is, not how it will make someone
feel. Label things the way a first-time visitor would ask for them ("Pricing",
not "Membership"; "How it works", not "Our method"). No exclamation marks, no
marketing superlatives, no invented statistics.

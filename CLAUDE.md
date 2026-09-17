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

**Three top-level items, and the two that own deeper pages open a panel**
(`under` in `src/lib/data/site.ts`). Order matters — it is the order a visitor
asks the questions: what would I do here, what does it cost, how do I get in
touch.

The bar had **seven** items and was the busiest thing on a page whose whole
brief is to feel like fresh air. Seven labels is not a menu a first-time visitor
reads, it is one they scan and give up on, and five of the seven answered
questions nobody has before deciding whether to walk in at all.

**`/about`, `/method`, `/journal`, `/success-stories`, `/nutrition` and `/app`
are no longer in the bar.** They are in the footer — which is a directory, not a
second nav — and in in-page links and `nextUp`. That is a deliberate cost, taken
knowingly: they are pages you read once you are interested, not pages that help
you decide to be. **Do not add them back to the bar** without also deciding what
comes out.

The **phone number in the bar appears only at ≥1500px**. It is still in the
sheet, the footer and on `/contact`.

**There is no "Home" item.** The wordmark links to `/`; a menu slot repeating
that is a slot wasted. Do not add one back.

**The home page is a story in four pictures, and then the price.** It is hero →
"What happens here" (four beats) → the women's floor → what it costs → five
questions → CTA. Nothing else.

It was previously six sections built from grids of cards: four self-identifying
tiles, three step cards, four photo tiles, four figures on a dark band, prices,
eleven questions. Each block was defensible and the page as a whole was a wall.
The brief is a gym for people who do not spend their day on websites, and that
reader does not decode a grid of four tiles as four choices — one big
photograph and one short sentence is the only pattern everybody already knows
how to read. So the page now walks through what actually happens to you, in the
order it happens (`homeStory` in `site.ts`).

- **Do not re-add teaser sections**, and do not re-add the card grids.
- **Five questions on the home page, not eleven** (`homeFaqQuestions` →
  `homeFaqs`). These are the five that stop a first-timer booking. A list long
  enough to scroll past is a list nobody opens; the rest are on the pages that
  own them.
- **The women's floor is a full-bleed band, not a tile.** For the people it
  matters to it is the whole decision, and one card among four is not how you
  say that. Its photo needs a fixed `aspect-ratio` — `enhanced:img` emits the
  real dimensions, so a portrait will otherwise set the height of the band.
- **The hero carries a button.** The old rule was that the header's own CTA was
  enough, which is true on a desktop and false on a phone, where that button
  sits behind a menu tap.

| Menu | Route | Notes |
| --- | --- | --- |
| — | `/` | Reached via the wordmark. Carries pricing and the FAQ in full |
| Training ▾ | `/training` | Panel: timetable, coaches, facilities, women's floor |
| Pricing ▾ | `/#pricing` | Panel: `/membership`, `/#faq` |
| Contact | `/contact` | No panel — it is where the paths end |

**Footer-only**, by the decision above: `/about`, `/method`, `/nutrition`,
`/journal`, `/success-stories`, `/app`. **The gallery lives on `/facilities`**,
not on its own page.

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
  shows it under the label; the desktop bar uses it as `title`; the flyouts show
  one per sub-page. Bare labels are what made the old menu unreadable — keep the
  blurbs if items are added.
- **The mobile sheet shows sub-pages open, not behind an accordion.** A tap
  spent finding out whether a page exists is a tap most people never make.

### Wayfinding

Three devices, added together, because the site read as a set of pages rather
than a place you could move around in:

1. **The flyouts** above — every page in the bar's two panels. Since the cut to
   three items, the footer carries the rest, so `NextUp` and in-page links do
   more of this work than they used to.
2. **`trailFor()`** in `site.ts` → the breadcrumb in `PageHeader`. Every H1 on
   this site is a slogan ("A floor, not a showroom", "Pick a tool"), so no inner
   page said which page it was. The trail supplies the plain name.
   **It renders only when it has more than one step** — a single step above a
   heading is not a breadcrumb, it is the eyebrow label that was deliberately
   removed, and on a top-level page the amber mark in the bar has already said it.
3. **`NextUp`** (`nextUp` in `site.ts`) — every page used to end on the same
   dark band asking for a booking. That is the right ending for someone who has
   decided and a dead end for everyone else, so each page names two or three
   places to go on first. `/contact` is deliberately absent: it is where the
   paths end.

## Layout and header

- `--header-h` in `layout.css` is the single source of truth for the sticky bar
  (64px, 108px at ≥1120px where the second tier appears). The hero pulls itself
  up by exactly this, the menu sheet starts at it, and the scroll observer
  measures `bar.offsetHeight`. **Do not hardcode a header height anywhere.**
- The header is **one row**: wordmark, then the nav centred in the space left
  (`flex: 1; justify-content: center`), then phone + CTA. Seven links fit beside
  a wordmark and a button — it was briefly two tiers when the menu had eleven
  items, and that is no longer needed.
- The nav is **stretched to the full bar height** (`align-self: stretch`) so a
  flyout can hang off the bar's bottom edge with `top: 100%` and no gap. A gap
  is a hole the pointer falls through on its way into the panel.
- The bar goes **solid while a flyout is open**, or white labels would sit
  beside a white panel over the hero photograph.
- The header is **transparent only while the home page is at rest at the top**,
  and takes its white surface back on `scrollY > 8`. It is *not* transparent for
  the whole length of the hero: the headline scrolls under the bar and white
  labels then cross white type and the amber mark, which is unreadable. `solid`
  defaults to `true`, so pages without `[data-hero]` — all of which start on a
  light `PageHeader` — are solid from first paint.
- `.section` has `scroll-margin-top: calc(var(--header-h) + 24px)` because
  sections are now link targets.

### The hero

**An open field, ink type on the sky.** Heading, one sentence, one button,
centred over a full-bleed landscape photograph.

It used to be `100svh` of a dark, teal-graded close-crop of a deadlift with the
header blended over it, the headline across the middle and a button and small
print stacked beside it — powerful, and precisely the image that tells somebody
nervous about gyms that they would be out of place. The brief is fresh air, and
this is the most literal reading of it: the one picture on the site that is not
a room.

- `src/lib/images/hero-field.jpg` is a green meadow under an open sky
  (Unsplash, credited in `CREDITS.md`). Like all the photography here it is a
  placeholder for the gym's own; replacing that one file is the whole swap,
  because nothing in the markup names the image any other way.
- **The crop is `object-position: center 74%`**, which lands the standfirst on
  lit grass rather than on the treeline. Ink type at this wash strength does not
  carry over dark trees. If you change the photograph, check that line before
  anything else — it is the first thing to break.
- **The wash is pale, not dark** (`rgb(255 253 249 / 0.62)`). The photograph is
  bright, so the type on it is the same ink as the rest of the page. Darkening
  the frame to carry white type would throw away the one thing the picture is
  there for. **If you swap in a darker field photo, deepen the wash — do not
  invert to white type.**
- **`min-height` is 74svh, not 100.** A full-viewport anything is a wall, and
  the point of this frame is that you can see past it.
- **There is no `[data-hero]` on this page any more.** The header is therefore
  solid white from the first paint — it has to be, because the top of the frame
  is pale sky and white nav labels on it would be invisible. All the
  transparent-over-photo handling (`solid`, the light wordmark, the pale nav
  labels) is now only exercised if a future page opts back in. Do not delete
  that code — just do not assume the home page uses it.
- One word of the headline sits in `.mark` — an amber fill *behind* the word,
  the same rule the accent follows everywhere else. An inline background is
  drawn to the font's ascender and descender, and Bricolage's are generous, so
  at display size it needs `display: inline-block` plus a tight `line-height`
  to hug the word instead of forming a slab.
- The standfirst is capped at **34ch on purpose**. Three short lines under a
  headline read as one thought; one long line reads as a paragraph you have
  started.
- `afterNavigate` in `+layout.svelte` re-scrolls to `location.hash` inside a
  **double** `requestAnimationFrame`. One frame is not enough — the router's own
  scroll restoration runs after it and lands the page at the top.

## Design system (`src/routes/layout.css`)

Everything shared lives here. Change values here, not in components.

### Type

Two faces, and neither is the one this site launched with.

- **Bricolage Grotesque** (`--font-display`, weight axis only — no
  `font-stretch` anywhere) carries the headings. **Sentence case at every
  size.** `.t-display` and `.t-h1` used to be compressed uppercase — a poster
  voice. Uppercase strips the word-shapes that make a line quick to read and
  compressing strips the rest, so the biggest words on the site were the slowest
  ones on it.
- **Plus Jakarta Sans** (`--font-sans`) carries everything you read. Body is
  **17px**; the cheapest readability win available is bigger words.
- **Geist Mono** (`--font-mono`) is now for **figures only** — tabular columns
  in the timetable and the calculators. It is no longer the label face.
- **There are no micro-labels.** `.t-label` was 10.5px mono, uppercase, 0.16em
  tracking: a designer's caption that reads like an eye test. It is now 13px
  sans at weight 600. Buttons and chips went the same way. **Do not reintroduce
  small-uppercase-mono anywhere**, including in new components.

### Colour and shape

- **Warm throughout.** The palette was cool grey with an acid-lime accent —
  sharp, and unmistakably a design object. This is a gym in Dhaka that somebody
  who has never trained has to feel able to walk into, so the paper, the black
  and the accent are all warm.
- **Two accents, and they do different jobs.** `--sun` (amber) is a **fill**:
  ink always sits on top of it, so it is safe behind a word, in a badge, on a
  chip. `--ember` (orange) is the **action** colour and the only one carrying
  `--ember-ink`. Buttons, and nothing else — if everything is an action, nothing
  looks like one. `--sun-wash` and `--ember-wash` are the thin surface tints.
- **Shape** — corners are rounded, on one scale: `--r-sm` / `--r-md` / `--r-lg`
  / `--r-pill`. The site was square everywhere on the grounds that a boundary
  should be marked once; it read as severe, and severe is the opposite of
  approachable. There is still no shadow anywhere.
- **Photographs run warm and at full strength.** They were desaturated across
  the board so lime stayed the only strong colour on the page. That reason is
  gone, and they are the only thing on this site showing a real room.
- **Pricing cards** — outer two `--sun-wash`, the featured one full `--sun`. The
  featured card inverts its button to black, or a pale button on amber would
  read as the *quieter* option. **Prices are set in the display face, not the
  mono one** — three prices in three separate cards are read one at a time, and
  mono's wide even digits made "6,000" look like a serial number.
- `.icon-badge` — a 68px `--sun-wash` tile behind an icon, filling solid when
  its parent tile or card is hovered. Use it for **decorative** icons;
  `.icon-box` stays for actual **controls** (the menu button, the disclosure
  toggle). `.icon-badge--solid` is for confirmations.
- `.step-badge` — a filled amber disc for numbered sequences.
- `.section--tint` — a full-bleed `--surface` band. It is **global**, not
  page-scoped, because it is handed to `<Section>` as a prop and Svelte's
  scoping cannot follow a class name across a component boundary.
- `.tile-hover` — for the bordered-grid blocks that are built as 1px gaps over a
  rule-coloured parent rather than as `.card`. **It owns the resting
  `background` too.** If a component also sets `background: var(--paper)` on the
  same element the two tie on specificity and the component, loaded later, wins
  — and the hover silently never paints.

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
  summary has `min-height: 5.2em` because the block is bottom-anchored and a
  two-line summary would lift its heading above the others.
- **Buttons are full-width below 560px** by design (`layout.css`). Do not
  override this per-page — it is what makes the site read as an app on a phone.
- `enhanced:img` wraps images in `<picture>`, which Svelte's scoped selectors do
  not reach. Use `:global()` inside the component.

## Content

- `src/lib/data/site.ts` holds all copy. Photography in `src/lib/images/` is
  **placeholder** — see `CREDITS.md`.
- **The testimonials are samples** (`name: 'Sample member'`). They no longer
  appear on `/`; they still render on `/success-stories`. Real quotes are needed
  before launch.
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

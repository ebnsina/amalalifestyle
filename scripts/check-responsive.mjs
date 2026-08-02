// Fails if any route scrolls sideways at a real device width.
// Run a server first, then: pnpm check:responsive
// Override the target with BASE_URL, e.g. BASE_URL=http://localhost:5190
import { chromium } from "playwright";

const BASE = process.env.BASE_URL ?? 'http://localhost:5179';

const routes = [
  "/",
  "/about",
  "/facilities",
  "/success-stories",
  "/training",
  "/timetable",
  "/membership",
  "/nutrition",
  "/womens",
  "/coaches",
  "/method",
  "/journal",
  "/journal/protein-without-the-tubs",
  "/contact",
  "/app",
  "/app?tool=body",
  "/app?tool=calories",
  "/app?tool=meals",
  "/app?tool=max",
  "/app?tool=plates",
  "/does-not-exist",
];
const widths = [360, 390, 430, 768, 1024, 1280];

const browser = await chromium.launch();
const problems = [];

for (const w of widths) {
  const page = await browser.newPage({
    viewport: { width: w, height: 900 },
    deviceScaleFactor: 1,
  });
  for (const r of routes) {
    await page.goto(BASE + r, { waitUntil: "networkidle" });
    const res = await page.evaluate(async () => {
      window.scrollTo(600, 0);
      await new Promise((r) => requestAnimationFrame(r));
      const reallyScrolls = window.scrollX > 0;
      window.scrollTo(0, 0);
      const docW = document.documentElement.clientWidth;
      const clipped = (el) => {
        for (let p = el.parentElement; p; p = p.parentElement) {
          const s = getComputedStyle(p);
          if (
            s.overflowX === "auto" ||
            s.overflowX === "scroll" ||
            s.overflowX === "hidden"
          )
            return true;
        }
        return false;
      };
      const over = [];
      for (const el of document.querySelectorAll("body *")) {
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.left < -100) continue;
        if (rect.right > docW + 1 && !clipped(el)) {
          const cls =
            typeof el.className === "string"
              ? el.className.split(" ").slice(0, 2).join(".")
              : "";
          over.push(
            `${el.tagName.toLowerCase()}.${cls} w=${Math.round(rect.width)} r=${Math.round(rect.right)}`,
          );
        }
      }
      return {
        reallyScrolls,
        scrollW: document.documentElement.scrollWidth,
        docW,
        over: over.slice(0, 3),
      };
    });
    if (res.reallyScrolls) {
      problems.push(
        `${w}px ${r} — scrollW ${res.scrollW} vs ${res.docW}\n      ${res.over.join("\n      ") || "(no unclipped offender found)"}`,
      );
    }
  }
  await page.close();
}
await browser.close();
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log("No horizontal overflow at any width.");

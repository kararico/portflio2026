/**
 * Hero JW expand intro 진단
 * node scripts/diagnose-hero-expand-intro.mjs [url]
 */
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const base = process.argv[2] ?? 'http://localhost:3030';
const outDir = path.join(process.cwd(), 'scripts', 'output');

async function readExpandState(page) {
  return page.evaluate(() => {
    const track = document.querySelector('[data-hero-expand-track]');
    const titleBack = document.querySelector('[data-hero-title-back]');
    const composition = document.querySelector('[data-hero-composition]');

    const masks = [...document.querySelectorAll('[data-hero-expand-char]')].slice(0, 9);

    return {
      preloaderActive: document.documentElement.hasAttribute('data-preloader-active'),
      preloaderExiting: document.documentElement.hasAttribute('data-preloader-exiting'),
      mainVisible: document.getElementById('main-transition')
        ? getComputedStyle(document.getElementById('main-transition')).visibility
        : null,
      hasExpandTrack: Boolean(track),
      titleBackOpacity: titleBack ? getComputedStyle(titleBack).opacity : null,
      compositionOpacity: composition ? getComputedStyle(composition).opacity : null,
      trackExpanded: track?.classList.contains('is-expanded') ?? false,
      jText: document.querySelector('[data-hero-expand-j]')?.textContent,
      wX: document.querySelector('[data-hero-expand-w]')?.style.transform || 'none',
      maskWidths: masks.map((el, i) => ({
        i,
        text: el.textContent?.trim(),
        width: getComputedStyle(el).width,
        rectW: Math.round(el.getBoundingClientRect().width),
      })),
      totalMaskRectW: masks.reduce((s, el) => s + Math.round(el.getBoundingClientRect().width), 0),
    };
  });
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto(base, { waitUntil: 'networkidle', timeout: 90000 });

  const absTimes = [0, 500, 1900, 2050, 2150, 2250, 2350, 2500, 2700, 3200];
  const samples = [];
  let prev = 0;

  for (const ms of absTimes) {
    await page.waitForTimeout(ms - prev);
    prev = ms;
    const state = await readExpandState(page);
    samples.push({ ms, ...state });
    await page.screenshot({
      path: path.join(outDir, `hero-expand-${String(ms).padStart(5, '0')}ms.png`),
    });
  }

  fs.writeFileSync(
    path.join(outDir, 'hero-expand-intro.json'),
    JSON.stringify(samples, null, 2),
  );

  console.log(JSON.stringify(samples, null, 2));
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

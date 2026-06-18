/**
 * Navigation 기준 Hero expand 타이밍 진단
 */
import { chromium } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:3030';

async function readState(page) {
  return page.evaluate(() => ({
    t: Math.round(performance.now()),
    preloaderActive: document.documentElement.hasAttribute('data-preloader-active'),
    preloaderExiting: document.documentElement.hasAttribute('data-preloader-exiting'),
    mainVisible: getComputedStyle(document.getElementById('main-transition')).visibility,
    expanded: document.querySelector('[data-hero-expand-track]')?.classList.contains('is-expanded'),
    maskTotal: [...document.querySelectorAll('[data-hero-expand-char]')]
      .slice(0, 9)
      .reduce((s, el) => s + Math.round(el.getBoundingClientRect().width), 0),
  }));
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto(base, { waitUntil: 'commit' });

  const samples = [];
  for (let ms = 0; ms <= 4500; ms += 250) {
    await page.waitForTimeout(ms === 0 ? 0 : 250);
    samples.push(await readState(page));
  }

  console.log(JSON.stringify(samples, null, 2));
  await browser.close();
}

main();

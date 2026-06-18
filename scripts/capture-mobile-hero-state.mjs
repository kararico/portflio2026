/**
 * 모바일 Hero 표시 상태 스크린샷 + bfcache 시뮬레이션
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium, devices } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'docs', 'screenshots', 'debug-mobile-hero');
const base = process.argv[2] ?? 'http://localhost:3030';

fs.mkdirSync(OUT, { recursive: true });

async function snap(page, name) {
  const metrics = await page.evaluate(() => ({
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
    scrollX: window.scrollX,
    preloaderActive: document.documentElement.hasAttribute('data-preloader-active'),
    preloader: !!document.querySelector('[data-preloader]'),
    heroIntro: (() => {
      const el = document.querySelector('[data-home-intro]');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const st = getComputedStyle(el);
      return { w: r.width, h: r.height, top: r.top, left: r.left, vis: st.visibility, opacity: st.opacity };
    })(),
    heroTitle: (() => {
      const el = document.querySelector('[data-hero-title]');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { w: r.width, left: r.left, right: r.right, inView: r.left >= -5 && r.right <= window.innerWidth + 5 };
    })(),
  }));
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: false });
  return metrics;
}

async function main() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    ...devices['iPhone 13'],
    viewport: { width: 390, height: 844, deviceScaleFactor: 1 },
  });
  const page = await ctx.newPage();

  await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 60000 });
  const t0 = await snap(page, '01-fresh-domcontentloaded');
  await page.waitForTimeout(500);
  const t500 = await snap(page, '02-preloader-500ms');
  await page.waitForTimeout(3000);
  const t3500 = await snap(page, '03-after-preloader');

  // bfcache: complete preloader, navigate, back
  await page.goto(`${base}/work/mlb-korea`, { waitUntil: 'domcontentloaded' }).catch(() => {});
  await page.waitForTimeout(800);
  await page.goBack({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(200);
  const bfcache = await snap(page, '04-bfcache-back-200ms');

  // reload
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(200);
  const reload = await snap(page, '05-reload-200ms');

  console.log(JSON.stringify({ t0, t500, t3500, bfcache, reload }, null, 2));
  console.log(`Screenshots: ${OUT}`);

  await browser.close();
}

main();

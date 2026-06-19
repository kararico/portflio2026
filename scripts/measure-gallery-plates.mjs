import { chromium, devices } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:3030';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    ...devices['iPhone 13'],
    viewport: { width: 390, height: 844 },
  });

  await page.goto(base, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(4500);
  for (const scrollY of [950, 1100, 1300]) {
    await page.evaluate((y) => window.scrollTo(0, y), scrollY);
    await page.waitForTimeout(1200);
  }

  const data = await page.evaluate(() => {
    const stage = document.querySelector('[data-hero-composition]');
    const sr = stage?.getBoundingClientRect();
    const plates = [1, 2, 3, 4, 5].map((id) => {
      const el =
        document.querySelector(`.projectItem[data-plate-id="${id}"] .plateAnchor`) ??
        document.querySelector(`[data-plate-id="${id}"][data-hero-plate]`);
      const r = el?.getBoundingClientRect();
      const st = el ? getComputedStyle(el) : null;
      return {
        id,
        found: !!el,
        active: el?.getAttribute('data-plate-active'),
        visibility: st?.visibility,
        top: r ? Math.round(r.top) : null,
        bottom: r ? Math.round(r.bottom) : null,
        cssTop: st?.top,
        height: r ? Math.round(r.height) : null,
        pctOfStage: sr && r && r.height > 0 ? +(((r.top - sr.top) / sr.height) * 100).toFixed(1) : null,
        inViewport: r ? r.top >= 0 && r.bottom <= window.innerHeight : null,
      };
    });

    const byId = Object.fromEntries(plates.map((p) => [p.id, p]));
    const mlb = byId[2];
    const gaps =
      mlb?.top != null && mlb?.bottom != null
        ? {
            topToMlb: mlb.top - Math.max(byId[1]?.bottom ?? 0, byId[3]?.bottom ?? 0),
            mlbToBottom: Math.min(byId[4]?.top ?? 9999, byId[5]?.top ?? 9999) - mlb.bottom,
            bottomDiagonal: (byId[4]?.top ?? 0) - (byId[5]?.top ?? 0),
          }
        : null;
    return {
      stageH: sr ? Math.round(sr.height) : null,
      stageTop: sr ? Math.round(sr.top) : null,
      viewportH: window.innerHeight,
      galleryActive: document.querySelector('[data-home-story]')?.getAttribute('data-gallery-active'),
      plates,
      gaps,
    };
  });

  console.log(JSON.stringify(data, null, 2));
  await page.screenshot({ path: 'scripts/output/hero-gallery-measure.png' });
  await browser.close();
}

main();

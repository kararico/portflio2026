import { chromium, devices } from 'playwright';
import fs from 'fs';

const OUT = 'scripts/output/hero-gallery-top-cards.png';
const base = process.argv[2] ?? 'http://localhost:3030';

async function main() {
  fs.mkdirSync('scripts/output', { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({
    ...devices['iPhone 13'],
    viewport: { width: 390, height: 844 },
  });

  await page.goto(base, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(4500);

  let best = null;
  for (let step = 0; step <= 40; step++) {
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(150);

    const snap = await page.evaluate(() => {
      const read = (id) => {
        const el =
          document.querySelector(`.projectItem[data-plate-id="${id}"] .plateAnchor`) ??
          document.querySelector(`[data-plate-id="${id}"][data-hero-plate]`);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        const st = getComputedStyle(el);
        const inView = r.bottom > 0 && r.top < innerHeight && r.width > 0 && st.visibility === 'visible';
        return {
          cssTop: st.top,
          cssLeft: st.left,
          cssRight: st.right,
          visibility: st.visibility,
          inView,
          rect: { top: Math.round(r.top), left: Math.round(r.left), width: Math.round(r.width) },
        };
      };

      const card1 = read('1');
      const card3 = read('3');
      const visibleCount = [1, 2, 3, 4, 5].filter((id) => {
        const el = document.querySelector(`[data-plate-id="${id}"][data-hero-plate]`);
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return getComputedStyle(el).visibility === 'visible' && r.top < innerHeight && r.bottom > 0;
      }).length;

      return {
        scrollY: Math.round(window.scrollY),
        galleryActive: document.querySelector('[data-home-story]')?.getAttribute('data-gallery-active'),
        visibleCount,
        card1,
        card3,
      };
    });

    if (snap.card1?.inView && snap.card3?.inView && snap.visibleCount >= 3) {
      best = snap;
      break;
    }
    if (!best || snap.visibleCount > (best.visibleCount ?? 0)) best = snap;
  }

  await page.waitForTimeout(400);
  await page.screenshot({ path: OUT, fullPage: false });
  console.log(JSON.stringify({ screenshot: OUT, layout: best }, null, 2));
  await browser.close();
}

main();

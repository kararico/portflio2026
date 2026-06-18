/** Hero hidden 타이밍 vs gallery trigger 분리 검증 */
import { chromium } from 'playwright';

async function snap(page) {
  return page.evaluate(() => {
    const hero = document.querySelector('[data-hero-image-layer]');
    const root = document.querySelector('[data-home-story]');
    const p2 = document.querySelector('[data-hero-float][data-plate-id="2"]');
    const hst = hero ? getComputedStyle(hero) : null;
    const r = hero?.getBoundingClientRect();
    return {
      scrollY: Math.round(scrollY),
      galleryActive: root?.getAttribute('data-gallery-active'),
      hero: hero && {
        vis: hst.visibility,
        opacity: hst.opacity,
        top: Math.round(r.top),
        bottom: Math.round(r.bottom),
      },
      plate2Active: p2?.getAttribute('data-plate-active'),
      plate2Vis: p2 ? getComputedStyle(p2).visibility : null,
    };
  });
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3030', { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForTimeout(3500);

const critical = [];
for (let i = 0; i <= 50; i++) {
  await page.mouse.wheel(0, 90);
  await page.waitForTimeout(70);
  const s = await snap(page);
  // gallery active but hero still visible = desired overlap window
  if (s.galleryActive === 'true' && s.hero?.vis === 'visible') {
    critical.push({ step: i, ...s, note: 'gallery ON, hero still visible' });
  }
  if (s.galleryActive === 'true' && s.hero?.vis === 'hidden' && critical.length === 0) {
    critical.push({ step: i, ...s, note: 'FIRST: gallery ON + hero hidden (no overlap?)' });
  }
}

console.log('Overlap windows (gallery active, hero visible):', critical.filter((c) => c.note.includes('still')).length);
console.log(JSON.stringify(critical.slice(0, 8), null, 2));
await browser.close();

/** Gallery trigger vs Hero position sync 검증 */
import { chromium } from 'playwright';

async function snap(page) {
  return page.evaluate(() => {
    const hero = document.querySelector('[data-hero-image-layer]');
    const root = document.querySelector('[data-home-story]');
    const r = hero?.getBoundingClientRect();
    return {
      scrollY: Math.round(scrollY),
      galleryActive: root?.getAttribute('data-gallery-active'),
      heroBottom: r ? Math.round(r.bottom) : null,
      heroTop: r ? Math.round(r.top) : null,
      heroVis: hero ? getComputedStyle(hero).visibility : null,
    };
  });
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3030', { waitUntil: 'networkidle', timeout: 90000 });
await page.waitForTimeout(3500);

const earlyGallery = []; // gallery active while hero still in viewport (bottom > 0)
let firstGallery = null;

for (let i = 0; i <= 55; i++) {
  await page.mouse.wheel(0, 90);
  await page.waitForTimeout(70);
  const s = await snap(page);
  if (s.galleryActive === 'true' && s.heroBottom !== null && s.heroBottom > 0) {
    earlyGallery.push({ step: i, ...s });
  }
  if (s.galleryActive === 'true' && !firstGallery) {
    firstGallery = { step: i, ...s };
  }
}

console.log('VIOLATIONS (gallery active while hero bottom > 0):', earlyGallery.length);
if (earlyGallery.length) console.log(JSON.stringify(earlyGallery.slice(0, 5), null, 2));
console.log('\nFirst gallery active:', JSON.stringify(firstGallery, null, 2));
await browser.close();

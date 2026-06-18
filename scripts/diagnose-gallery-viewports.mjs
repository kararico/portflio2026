/** tablet/mobile viewport — plate 2 display:none 확인 */
import { chromium } from 'playwright';

async function run(viewport, label) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport });
  await page.goto('http://localhost:3030', { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(3500);

  const samples = [];
  for (let i = 0; i <= 60; i++) {
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(70);
    if (i % 6 === 0) {
      samples.push(
        await page.evaluate(() => {
          const p2item = document.querySelector('[data-plate-id="2"]');
          const p2 = document.querySelector('[data-hero-float][data-plate-id="2"]');
          const hero = document.querySelector('[data-hero-image-layer]');
          const root = document.querySelector('[data-home-story]');
          const itemSt = p2item ? getComputedStyle(p2item) : null;
          const p2st = p2 ? getComputedStyle(p2) : null;
          const hst = hero ? getComputedStyle(hero) : null;
          return {
            scrollY: Math.round(scrollY),
            galleryActive: root?.getAttribute('data-gallery-active'),
            plate2ItemDisplay: itemSt?.display,
            plate2Vis: p2st?.visibility,
            plate2Active: p2?.getAttribute('data-plate-active'),
            heroOpacity: hst?.opacity,
            heroVis: hst?.visibility,
          };
        }),
      );
    }
  }
  await browser.close();
  console.log(`\n=== ${label} ${viewport.width}x${viewport.height} ===`);
  console.log(JSON.stringify(samples, null, 2));
}

await run({ width: 1440, height: 900 }, 'desktop');
await run({ width: 768, height: 1024 }, 'tablet');
await run({ width: 390, height: 844 }, 'mobile');

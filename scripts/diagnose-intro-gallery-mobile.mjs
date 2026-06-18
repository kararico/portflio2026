/**
 * 모바일 IntroGallery plate 크기·위치 진단
 * node scripts/diagnose-intro-gallery-mobile.mjs [url]
 */
import { chromium, devices } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:3030';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    ...devices['iPhone 13'],
    viewport: { width: 390, height: 844 },
  });

  await page.goto(base, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3500);

  await page.evaluate(() => {
    const intro = document.querySelector('[data-home-intro]');
    const h = intro?.offsetHeight ?? 2200;
    window.scrollTo(0, h * 0.72);
  });
  await page.waitForTimeout(900);

  const hero = await page.evaluate(() => {
    const img = document.querySelector('[data-intro-media]');
    const imgR = img?.getBoundingClientRect();
    const plates = [...document.querySelectorAll('[data-hero-plate]')]
      .map((anchor) => {
        const item = anchor.closest('[data-plate-id]');
        const id = item?.getAttribute('data-plate-id');
        const r = anchor.getBoundingClientRect();
        const cs = getComputedStyle(anchor);
        return {
          id,
          display: item ? getComputedStyle(item).display : null,
          w: Math.round(r.width),
          h: Math.round(r.height),
          top: Math.round(r.top),
          left: Math.round(r.left),
          imgW: cs.getPropertyValue('--img-w').trim(),
          imgRatio: cs.getPropertyValue('--img-ratio').trim(),
        };
      })
      .filter((p) => p.display !== 'none' && p.w > 0)
      .sort((a, b) => Number(a.id) - Number(b.id));

    return {
      viewport: window.innerWidth,
      heroImage: imgR
        ? {
            w: Math.round(imgR.width),
            h: Math.round(imgR.height),
            top: Math.round(imgR.top),
            left: Math.round(imgR.left),
          }
        : null,
      plates,
    };
  });

  console.log(JSON.stringify(hero, null, 2));
  await page.screenshot({ path: 'scripts/output/intro-gallery-mobile-hero.png' });
  await browser.close();
}

main();

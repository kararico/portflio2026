/**
 * Hero → Gallery 핸드오프 구간 집중 진단
 */
import { chromium } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:3030';

async function snap(page) {
  return page.evaluate(() => {
    const root = document.querySelector('[data-home-story]');
    const p2 = document.querySelector('[data-hero-float][data-plate-id="2"]');
    const hero = document.querySelector('[data-hero-image-layer]');
    const st = (el) => (el ? getComputedStyle(el) : null);
    const p2st = st(p2);
    const hst = st(hero);
    return {
      scrollY: Math.round(scrollY),
      galleryActive: root?.getAttribute('data-gallery-active'),
      plate2: p2
        ? {
            active: p2.getAttribute('data-plate-active'),
            visibility: p2st.visibility,
            opacity: p2st.opacity,
            top: Math.round(p2.getBoundingClientRect().top),
          }
        : null,
      hero: hero
        ? {
            visibility: hst.visibility,
            opacity: hst.opacity,
            top: Math.round(hero.getBoundingClientRect().top),
          }
        : null,
      plates: [...document.querySelectorAll('[data-hero-float]')].map((el) => ({
        id: el.dataset.plateId,
        active: el.getAttribute('data-plate-active'),
        vis: getComputedStyle(el).visibility,
      })),
    };
  });
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(base, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(3500);

  const out = [];
  for (let i = 0; i <= 80; i++) {
    await page.mouse.wheel(0, 80);
    await page.waitForTimeout(60);
    if (i % 2 === 0) out.push({ step: i, ...(await snap(page)) });
  }

  // blank gap: hero opacity < 0.5 AND plate2 not visible
  const gaps = out.filter(
    (s) =>
      s.hero &&
      parseFloat(s.hero.opacity) < 0.5 &&
      s.hero.visibility !== 'hidden' &&
      (!s.plate2 || s.plate2.visibility !== 'visible' || s.plate2.active !== 'true'),
  );

  console.log('GAP windows (hero fading, plate2 not active):', gaps.length);
  if (gaps.length) console.log(JSON.stringify(gaps.slice(0, 5), null, 2));

  console.log('\nFull timeline sample:');
  console.log(JSON.stringify(out.filter((_, i) => i % 4 === 0), null, 2));
  await browser.close();
}

main().catch(console.error);

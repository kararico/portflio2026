/**
 * Gallery plate DOM / visibility / z-index 진단 (console)
 * node scripts/diagnose-gallery-plates.mjs [url]
 */
import { chromium } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:3030';

async function inspect(page) {
  return page.evaluate(() => {
    const root = document.querySelector('[data-home-story]');
    const wrappers = [...document.querySelectorAll('[data-intro-gallery]')].map((el) => {
      const st = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        layer: el.getAttribute('data-editorial-layer'),
        zIndex: st.zIndex,
        visibility: st.visibility,
        opacity: st.opacity,
        display: st.display,
        rect: { w: Math.round(r.width), h: Math.round(r.height), top: Math.round(r.top) },
      };
    });

    const plates = [...document.querySelectorAll('[data-hero-float]')].map((el) => {
      const st = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const item = el.closest('[data-plate-id]');
      const itemSt = item ? getComputedStyle(item) : null;
      const img = el.querySelector('[data-hero-plate-image]');
      const imgSt = img ? getComputedStyle(img) : null;
      return {
        id: el.dataset.plateId,
        active: el.getAttribute('data-plate-active'),
        visibility: st.visibility,
        opacity: st.opacity,
        display: st.display,
        itemDisplay: itemSt?.display,
        y: el.style.transform || 'gsap',
        top: Math.round(r.top),
        left: Math.round(r.left),
        w: Math.round(r.width),
        h: Math.round(r.height),
        imgOpacity: imgSt?.opacity,
        inViewport: r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth,
      };
    });

    const heroLayer = document.querySelector('[data-hero-image-layer]');
    const about = document.querySelector('[data-about-cover]');

    return {
      scrollY: Math.round(scrollY),
      galleryActive: root?.getAttribute('data-gallery-active'),
      scenePinned: root?.getAttribute('data-scene-pinned'),
      wrappers,
      plates,
      heroLayer: heroLayer
        ? {
            visibility: getComputedStyle(heroLayer).visibility,
            opacity: getComputedStyle(heroLayer).opacity,
            top: Math.round(heroLayer.getBoundingClientRect().top),
          }
        : null,
      aboutCover: about
        ? {
            zIndex: getComputedStyle(about).zIndex,
            transform: getComputedStyle(about).transform,
            top: Math.round(about.getBoundingClientRect().top),
          }
        : null,
    };
  });
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(base, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(3500);

  const out = [];
  for (let i = 0; i <= 35; i++) {
    await page.mouse.wheel(0, 150);
    await page.waitForTimeout(100);
    if (i % 5 === 0) out.push({ step: i, ...(await inspect(page)) });
  }

  console.log(JSON.stringify(out, null, 2));
  await browser.close();
}

main().catch(console.error);

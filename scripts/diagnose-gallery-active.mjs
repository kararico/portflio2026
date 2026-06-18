/**
 * galleryActive / plate visibility 진단
 */
import { chromium } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:3030';

async function sample(page) {
  return page.evaluate(() => {
    const heroLayer = document.querySelector('[data-hero-image-layer]');
    const plates = [...document.querySelectorAll('[data-hero-float]')].map((el) => {
      const st = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const parent = el.closest('[data-plate-id]');
      const parentSt = parent ? getComputedStyle(parent) : null;
      return {
        id: el.dataset.plateId,
        visibility: st.visibility,
        opacity: st.opacity,
        display: st.display,
        parentDisplay: parentSt?.display,
        y: gsap?.getProperty?.(el, 'y'),
        top: Math.round(r.top),
        active: el.getAttribute('data-plate-active'),
      };
    });
    const root = document.querySelector('[data-home-story]');
    return {
      galleryActive: root?.getAttribute('data-gallery-active'),
      heroLayer: heroLayer
        ? {
            top: heroLayer.getBoundingClientRect().top,
            opacity: getComputedStyle(heroLayer).opacity,
            visibility: getComputedStyle(heroLayer).visibility,
          }
        : null,
      scrollY: window.scrollY,
      progress: window.__heroProgress ?? null,
      plates,
    };
  });
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(base, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(3500);

  // inject progress hook
  await page.evaluate(() => {
    window.__heroProgress = 0;
    const tick = () => {
      const st = document.querySelector('[data-home-intro]');
      if (st) {
        const rect = st.getBoundingClientRect();
        const total = st.offsetHeight - window.innerHeight;
        window.__heroProgress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      }
      requestAnimationFrame(tick);
    };
    tick();
  });

  const samples = [];
  for (let i = 0; i <= 40; i++) {
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(80);
    if (i % 4 === 0) samples.push({ step: i, ...(await sample(page)) });
  }

  console.log(JSON.stringify(samples, null, 2));
  await browser.close();
}

main().catch(console.error);

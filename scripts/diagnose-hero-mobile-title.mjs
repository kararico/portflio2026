/**
 * 모바일 Hero 타이포 rect / clip 진단
 * node scripts/diagnose-hero-mobile-title.mjs [url]
 */
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

  const state = await page.evaluate(() => {
    const rect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const st = getComputedStyle(el);
      return {
        left: Math.round(r.left),
        right: Math.round(r.right),
        width: Math.round(r.width),
        vw: window.innerWidth,
        cssWidth: st.width,
        overflowX: st.overflowX,
        transform: st.transform,
      };
    };

    const track = document.querySelector('[data-hero-expand-track]');
    const back = document.querySelector('[data-hero-title-back]');
    const front = document.querySelector('[data-hero-title-front]');
    const stage = document.querySelector('[data-hero-composition]');

    return {
      viewport: window.innerWidth,
      viewportWidthVar: getComputedStyle(document.documentElement).getPropertyValue('--viewport-width'),
      trackText: track?.textContent?.trim(),
      track: rect(track),
      back: rect(back),
      front: rect(front),
      stage: rect(stage),
      frontClip: front?.style.clipPath,
      clipDebug: (window).__heroClipDebug,
      trackVisible: track
        ? track.getBoundingClientRect().left >= 0 && track.getBoundingClientRect().right <= window.innerWidth
        : null,
    };
  });

  console.log(JSON.stringify(state, null, 2));
  await page.screenshot({ path: 'scripts/output/hero-mobile-title.png' });
  await browser.close();
}

main();

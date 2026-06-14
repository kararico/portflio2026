/**
 * Profile distortion WebGL 상태 검증
 * node scripts/debug-profile-distortion.mjs
 */
import { chromium } from 'playwright';

const BASE = 'http://localhost:3030';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto(`${BASE}/#about`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-about-image-frame]', { timeout: 15000 });
  await page.waitForTimeout(1500);

  const idle = await page.evaluate(() => ({
    distortion: document.querySelector('#about')?.getAttribute('data-profile-distortion'),
    canvas: !!document.querySelector('[data-profile-distortion-canvas]'),
    ready: document.querySelector('[data-about-image-frame]')?.getAttribute('data-distortion-ready'),
    hoverMq: window.matchMedia('(hover: hover)').matches,
    coarse: window.matchMedia('(pointer: coarse)').matches,
  }));

  const frame = page.locator('[data-about-image-frame]');
  const box = await frame.boundingBox();
  if (!box) throw new Error('no frame');

  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
  await page.waitForTimeout(300);
  await page.mouse.move(box.x + box.width * 0.65, box.y + box.height * 0.4, { steps: 10 });
  await page.waitForTimeout(800);

  const hover = await page.evaluate(() => ({
    ready: document.querySelector('[data-about-image-frame]')?.getAttribute('data-distortion-ready'),
    active: document.querySelector('[data-about-image-media]')?.getAttribute('data-distortion-active'),
    canvasOpacity: getComputedStyle(
      document.querySelector('[data-profile-distortion-canvas]'),
    ).opacity,
    canvasSize: (() => {
      const c = document.querySelector('[data-profile-distortion-canvas]');
      return c ? { w: c.width, h: c.height } : null;
    })(),
  }));

  console.log(JSON.stringify({ idle, hover }, null, 2));
  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

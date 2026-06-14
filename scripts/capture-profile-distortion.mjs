/**
 * Profile Liquid Distortion hover 캡처 (before / hover / leave)
 * node scripts/capture-profile-distortion.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const OUT = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  'docs',
  'screenshots',
  'profile-distortion',
);
const BASE = 'http://localhost:3030';

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: OUT, size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();

  await page.goto(`${BASE}/#about`, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-about-image-frame]', { timeout: 15000 });
  await page.locator('#about').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);

  const frame = page.locator('[data-about-image-frame]');
  const box = await frame.boundingBox();
  if (!box) throw new Error('Frame not found');

  const cx = box.x + box.width * 0.5;
  const cy = box.y + box.height * 0.5;
  const hx = box.x + box.width * 0.68;
  const hy = box.y + box.height * 0.42;

  await frame.screenshot({ path: path.join(OUT, 'profile-distortion-before.png') });

  await page.mouse.move(cx, cy);
  await page.waitForTimeout(200);
  await page.mouse.move(hx, hy, { steps: 16 });
  await page.waitForTimeout(700);
  await frame.screenshot({ path: path.join(OUT, 'profile-distortion-hover.png') });

  await page.mouse.move(hx + 50, hy - 20, { steps: 10 });
  await page.waitForTimeout(500);

  await page.mouse.move(box.x - 20, box.y - 20, { steps: 12 });
  await page.waitForTimeout(700);
  await frame.screenshot({ path: path.join(OUT, 'profile-distortion-leave.png') });

  await page.waitForTimeout(400);
  await context.close();
  await browser.close();

  const videos = fs.readdirSync(OUT).filter((f) => f.endsWith('.webm'));
  if (videos.length > 0) {
    fs.renameSync(path.join(OUT, videos[0]), path.join(OUT, 'profile-distortion-demo.webm'));
    console.log('✓ profile-distortion-demo.webm');
  }

  console.log('✓ profile-distortion-before.png');
  console.log('✓ profile-distortion-hover.png');
  console.log('✓ profile-distortion-leave.png');
  console.log(`Saved to ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

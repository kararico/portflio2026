/**
 * Profile 이미지 hover 인터랙션 캡처
 * node scripts/capture-profile-hover.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'screenshots', 'profile-hover');
const URL = 'http://localhost:3030/#about';

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: OUT, size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();

  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-about-image-frame]', { timeout: 15000 });
  await page.waitForTimeout(1200);

  const frame = page.locator('[data-about-image-frame]');
  const box = await frame.boundingBox();
  if (!box) throw new Error('Frame not found');

  await frame.screenshot({ path: path.join(OUT, 'profile-hover-before.png') });

  const cx = box.x + box.width * 0.5;
  const cy = box.y + box.height * 0.5;
  const hx = box.x + box.width * 0.72;
  const hy = box.y + box.height * 0.38;

  await page.mouse.move(cx, cy);
  await page.waitForTimeout(300);
  await page.mouse.move(hx, hy, { steps: 12 });
  await page.waitForTimeout(900);
  await frame.screenshot({ path: path.join(OUT, 'profile-hover-after.png') });

  await page.mouse.move(hx + 40, hy - 30, { steps: 8 });
  await page.waitForTimeout(600);

  await context.close();
  await browser.close();

  const videos = fs.readdirSync(OUT).filter((f) => f.endsWith('.webm'));
  if (videos.length > 0) {
    fs.renameSync(path.join(OUT, videos[0]), path.join(OUT, 'profile-hover-demo.webm'));
    console.log('✓ profile-hover-demo.webm');
  }

  console.log('✓ profile-hover-before.png');
  console.log('✓ profile-hover-after.png');
  console.log(`Saved to ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

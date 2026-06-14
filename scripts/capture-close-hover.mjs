/**
 * Capture detail close button hover states
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const BASE = 'http://localhost:3030';
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'screenshots', 'close-hover');

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto(`${BASE}/work/discovery-expedition`, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForSelector('[data-detail-hero]', { timeout: 15000 });

  const btn = page.locator('[data-detail-close]');
  await btn.screenshot({ path: path.join(OUT, 'close-default.png') });

  const box = await btn.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(100);
    await page.screenshot({ path: path.join(OUT, 'close-hover-100ms.png') });
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(OUT, 'close-hover-300ms.png') });
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(OUT, 'close-hover-600ms.png') });
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

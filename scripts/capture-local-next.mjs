/**
 * Capture local detail next-project footer
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const BASE = 'http://localhost:3030';
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'screenshots', 'next-project');

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(`${BASE}/work/discovery-expedition`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.locator('[data-detail-next]').scrollIntoViewIfNeeded({ timeout: 15000 });
  await page.waitForTimeout(1800);
  await page.screenshot({ path: path.join(OUT, 'local-next.png') });

  const link = page.locator('[data-detail-next] .nextProjectLink, [data-detail-next] a').first();
  const box = await link.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.4);
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(OUT, 'local-next-hover.png') });
  }

  await browser.close();
}

main().catch(console.error);

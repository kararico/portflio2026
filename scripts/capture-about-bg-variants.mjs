/**
 * Profile 배경 타이포 라벨 비교 캡처
 * node scripts/capture-about-bg-variants.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'screenshots', 'about-bg');
const BASE = 'http://localhost:3030';

async function capture(page, name) {
  await page.locator('#about').screenshot({ path: path.join(OUT, name) });
  console.log(`✓ ${name}`);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();

  for (const typeKey of ['profile', 'since2013']) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(`${BASE}/?about-type=${typeKey}#about`, { waitUntil: 'networkidle' });
    await page.waitForSelector(`[data-about-type="${typeKey}"]`, { timeout: 15000 });
    await page.waitForTimeout(800);
    await capture(page, `profile-type-${typeKey}-1440.png`);
    await page.close();
  }

  for (const typeKey of ['profile', 'since2013']) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto(`${BASE}/?about-type=${typeKey}#about`, { waitUntil: 'networkidle' });
    await page.waitForSelector(`[data-about-type="${typeKey}"]`, { timeout: 15000 });
    await page.waitForTimeout(600);
    await capture(page, `profile-type-${typeKey}-390.png`);
    await page.close();
  }

  await browser.close();
  console.log(`Saved to ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

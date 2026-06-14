/**
 * Hero 배경 ON/OFF 스크린샷 비교
 * npx playwright install chromium && node scripts/capture-hero-screenshots.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'docs', 'screenshots', 'hero-bg');
const URL = 'http://localhost:3030';

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-hero-bg]', { timeout: 15000 }).catch(() => null);
  await page.waitForTimeout(800);

  await page.screenshot({
    path: path.join(OUT, 'hero-with-background.png'),
    fullPage: false,
  });

  await page.evaluate(() => {
    const bg = document.querySelector('[data-hero-bg]');
    if (bg instanceof HTMLElement) bg.style.display = 'none';
  });
  await page.waitForTimeout(200);

  await page.screenshot({
    path: path.join(OUT, 'hero-without-background.png'),
    fullPage: false,
  });

  await browser.close();
  console.log(`Screenshots saved to ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

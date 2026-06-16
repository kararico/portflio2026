/**
 * Hero 시각 비교 + 스크린샷
 */
import { chromium } from 'playwright';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const base = 'http://localhost:3030';
const outDir = join(process.cwd(), 'scripts', '.hero-audit');
mkdirSync(outDir, { recursive: true });

function hashFile(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex').slice(0, 16);
}

console.log('\n=== File comparison ===');
console.log('mlb-img.png hash:', hashFile(join(process.cwd(), 'public/images/products/mlb-img.png')));
console.log(
  'mlb-main-bg.png hash:',
  hashFile(join(process.cwd(), 'public/images/products/visual-main/mlb-main-bg.png')),
);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

// Direct detail page
await page.goto(`${base}/work/mlb-korea`, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('[data-shared-hero-target] img', { timeout: 30000 });
await page.waitForTimeout(2000);

const directHero = await page.$eval('[data-shared-hero-target] img', (el) => el.currentSrc);
console.log('\nDirect URL hero currentSrc:', directHero);

await page.locator('[data-shared-hero-target]').screenshot({
  path: join(outDir, 'hero-direct.png'),
});

// Gallery transition
await page.goto(`${base}/`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(5000);
await page.locator(`[data-gallery-item][data-project-slug="mlb-korea"]`).first().click();
await page.waitForTimeout(3000);

const transitionHero = await page.$eval('[data-shared-hero-target] img', (el) => el.currentSrc);
console.log('Gallery transition hero currentSrc:', transitionHero);

await page.locator('[data-shared-hero-target]').screenshot({
  path: join(outDir, 'hero-gallery-transition.png'),
});

// Overlay during transition (if visible)
const overlay = await page.$('[data-project-transition-image]');
if (overlay) {
  const overlaySrc = await overlay.evaluate((el) => el.currentSrc || el.src);
  console.log('Overlay img src:', overlaySrc);
}

// Fetch hero image bytes and compare to files
const heroResponse = await page.goto(directHero);
const heroBytes = await heroResponse.body();
const heroHash = createHash('sha256').update(heroBytes).digest('hex').slice(0, 16);
console.log('\nBrowser-loaded hero bytes hash:', heroHash);

const mlbImgBytes = readFileSync(join(process.cwd(), 'public/images/products/mlb-img.png'));
const mainBgBytes = readFileSync(
  join(process.cwd(), 'public/images/products/visual-main/mlb-main-bg.png'),
);
console.log('Matches mlb-img.png:', heroHash === hashFile(join(process.cwd(), 'public/images/products/mlb-img.png')));
console.log(
  'Matches mlb-main-bg.png:',
  heroHash === hashFile(join(process.cwd(), 'public/images/products/visual-main/mlb-main-bg.png')),
);

console.log('\nScreenshots saved to scripts/.hero-audit/');

await browser.close();

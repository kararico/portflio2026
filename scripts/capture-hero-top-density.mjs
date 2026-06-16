/**
 * Hero gallery 상단 밀도 — 현재 vs 레퍼런스 첫 화면 비교
 * node scripts/capture-hero-top-density.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'docs', 'screenshots', 'hero-gallery-compare');
const LOCAL_URL = 'http://localhost:3030';
const REF_URL = 'https://www.septiembrearquitectura.com/';

async function scrollToGalleryView(page) {
  await page.waitForSelector('[data-home-intro]', { timeout: 20000 });
  await page.waitForTimeout(1000);

  const y = await page.evaluate(() => {
    const section = document.querySelector('[data-home-intro]');
    if (!section) return Math.round(window.innerHeight * 0.28);
    return Math.round(section.offsetHeight * 0.26);
  });

  await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
  await page.waitForTimeout(2000);
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto(LOCAL_URL, { waitUntil: 'networkidle', timeout: 60000 });
  await scrollToGalleryView(page);
  await page.screenshot({ path: path.join(OUT, 'hero-top-current.png'), fullPage: false });

  await page.goto(REF_URL, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(2000);
  const refY = await page.evaluate(() => {
    const intro = document.querySelector('.home-intro');
    if (!intro) return Math.round(window.innerHeight * 0.26);
    return Math.round(intro.offsetHeight * 0.2);
  });
  await page.evaluate((scrollY) => window.scrollTo(0, scrollY), refY);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(OUT, 'hero-top-reference.png'), fullPage: false });

  const sharp = (await import('sharp')).default;
  const cur = await sharp(path.join(OUT, 'hero-top-current.png'))
    .resize({ height: 900, fit: 'contain', background: '#f5f5f3' })
    .toBuffer();
  const ref = await sharp(path.join(OUT, 'hero-top-reference.png'))
    .resize({ height: 900, fit: 'contain', background: '#fffbf2' })
    .toBuffer();
  const curW = (await sharp(cur).metadata()).width;
  const refW = (await sharp(ref).metadata()).width;
  const gap = 20;
  const labelH = 44;
  const totalW = curW + refW + gap;
  const svg = `<svg width="${totalW}" height="${labelH}"><text x="12" y="28" font-family="Arial" font-size="17" fill="#333">Current</text><text x="${curW + gap + 12}" y="28" font-family="Arial" font-size="17" fill="#333">Reference</text></svg>`;

  await sharp({
    create: { width: totalW, height: 900 + labelH, channels: 4, background: '#e8e8e6' },
  })
    .composite([
      { input: Buffer.from(svg), top: 0, left: 0 },
      { input: cur, top: labelH, left: 0 },
      { input: ref, top: labelH, left: curW + gap },
    ])
    .png()
    .toFile(path.join(OUT, 'hero-top-comparison.png'));

  await browser.close();
  console.log(`Saved: ${path.join(OUT, 'hero-top-comparison.png')}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

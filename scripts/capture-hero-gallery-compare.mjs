/**
 * Hero Floating Gallery — 현재 구현 vs Septiembre 레퍼런스 비교 캡처
 * node scripts/capture-hero-gallery-compare.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'docs', 'screenshots', 'hero-gallery-compare');
const LOCAL_URL = 'http://localhost:3030';
const REF_URL = 'https://www.septiembrearquitectura.com/';

async function scrollHeroGallery(page) {
  await page.waitForSelector('[data-home-intro]', { timeout: 20000 });
  await page.waitForTimeout(1200);

  const scrollTarget = await page.evaluate(() => {
    const section = document.querySelector('[data-home-intro]');
    if (!section) return 0;
    const height = section.offsetHeight;
    const vh = window.innerHeight;
    return Math.round(height * 0.22 + vh * 0.08);
  });

  await page.evaluate((y) => window.scrollTo(0, y), scrollTarget);
  await page.waitForTimeout(1800);
}

async function captureLocal(page) {
  await page.goto(LOCAL_URL, { waitUntil: 'networkidle', timeout: 60000 });
  await scrollHeroGallery(page);
  await page.screenshot({
    path: path.join(OUT, 'current-implementation.png'),
    fullPage: false,
  });
}

async function captureReference(page) {
  await page.goto(REF_URL, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(2500);

  const scrollTarget = await page.evaluate(() => {
    const intro = document.querySelector('.home-intro');
    if (!intro) return Math.round(window.innerHeight * 0.35);
    return Math.round(intro.offsetHeight * 0.2 + window.innerHeight * 0.1);
  });

  await page.evaluate((y) => window.scrollTo(0, y), scrollTarget);
  await page.waitForTimeout(2000);

  await page.screenshot({
    path: path.join(OUT, 'reference-septiembre.png'),
    fullPage: false,
  });
}

async function stitchComparison() {
  const sharp = (await import('sharp')).default;
  const current = path.join(OUT, 'current-implementation.png');
  const reference = path.join(OUT, 'reference-septiembre.png');

  const [curMeta, refMeta] = await Promise.all([
    sharp(current).metadata(),
    sharp(reference).metadata(),
  ]);

  const height = Math.max(curMeta.height, refMeta.height);
  const curBuf = await sharp(current)
    .resize({ height, fit: 'contain', background: '#f5f5f3' })
    .toBuffer();
  const refBuf = await sharp(reference)
    .resize({ height, fit: 'contain', background: '#fffbf2' })
    .toBuffer();

  const curW = (await sharp(curBuf).metadata()).width;
  const refW = (await sharp(refBuf).metadata()).width;
  const gap = 24;
  const labelH = 48;
  const totalW = curW + refW + gap;
  const totalH = height + labelH;

  const svgLabels = `
    <svg width="${totalW}" height="${labelH}">
      <style>
        text { font-family: Arial, sans-serif; font-size: 18px; fill: #333; }
      </style>
      <text x="16" y="32">Current (scaled down)</text>
      <text x="${curW + gap + 16}" y="32">Reference — Septiembre</text>
    </svg>`;

  await sharp({
    create: {
      width: totalW,
      height: totalH,
      channels: 4,
      background: '#e8e8e6',
    },
  })
    .composite([
      { input: Buffer.from(svgLabels), top: 0, left: 0 },
      { input: curBuf, top: labelH, left: 0 },
      { input: refBuf, top: labelH, left: curW + gap },
    ])
    .png()
    .toFile(path.join(OUT, 'side-by-side-comparison.png'));
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  try {
    await captureLocal(page);
    console.log('Local capture done');
  } catch (err) {
    console.warn('Local capture failed:', err.message);
  }

  try {
    await captureReference(page);
    console.log('Reference capture done');
  } catch (err) {
    console.warn('Reference capture failed:', err.message);
  }

  await browser.close();

  try {
    await stitchComparison();
    console.log(`Comparison saved to ${path.join(OUT, 'side-by-side-comparison.png')}`);
  } catch (err) {
    console.warn('Stitch failed:', err.message);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

/**
 * Hero 이미지 브라우저 실측 — node scripts/audit-hero-browser.mjs [slug]
 */
import { chromium } from 'playwright';

const slug = process.argv[2] ?? 'mlb-korea';
const base = process.argv[3] ?? 'http://localhost:3030';
const url = `${base}/work/${slug}`;

const imageRequests = [];

const browser = await chromium.launch();
const page = await browser.newPage();

page.on('console', (msg) => {
  const text = msg.text();
  if (text.includes('[HeroDebug]')) console.log('CONSOLE:', text);
});

page.on('request', (req) => {
  const u = req.url();
  if (req.resourceType() === 'image' || u.includes('_next/image') || u.includes('/images/')) {
    imageRequests.push(u);
  }
});

console.log(`\n=== Browser audit: ${slug} ===`);
console.log(`URL: ${url}\n`);

const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
console.log('Page status:', response?.status());

await page.waitForTimeout(8000);

const heroTarget = await page.$('[data-shared-hero-target]');
console.log('data-shared-hero-target exists:', !!heroTarget);

const heroImg = await page.$('[data-shared-hero-target] img');
if (heroImg) {
  const info = await heroImg.evaluate((el) => ({
    src: el.getAttribute('src'),
    currentSrc: el.currentSrc,
    alt: el.getAttribute('alt'),
    complete: el.complete,
    naturalWidth: el.naturalWidth,
  }));
  console.log('\n--- Hero <img> DOM ---');
  console.log('src:       ', info.src);
  console.log('currentSrc:', info.currentSrc);
  console.log('alt:       ', info.alt);
  console.log('loaded:    ', info.complete, `(${info.naturalWidth}px wide)`);
} else {
  console.log('\nHero <img> NOT FOUND');
  const html = await page.content();
  console.log('Has shared-hero-target in HTML:', html.includes('data-shared-hero-target'));
  console.log('Has mlb-main-bg:', html.includes('mlb-main-bg'));
  console.log('Has mlb-img:', html.includes('mlb-img'));
  console.log('Has visual-main:', html.includes('visual-main'));
}

const allImgs = await page.$$eval('img', (els) =>
  els.map((el) => ({ src: el.getAttribute('src'), currentSrc: el.currentSrc })),
);
console.log('\n--- All <img> on page (' + allImgs.length + ') ---');
allImgs.forEach((img, i) => console.log(`${i + 1}.`, img.currentSrc || img.src));

const relevant = [...new Set(imageRequests)].filter(
  (u) =>
    u.includes('mlb') ||
    u.includes('visual-main') ||
    u.includes('_next/image') ||
    u.includes('work-thumb'),
);
console.log('\n--- Network image requests (filtered) ---');
relevant.forEach((u) => console.log(u));

await browser.close();

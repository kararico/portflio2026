import { chromium } from 'playwright';

const slug = process.argv[2] ?? 'mlb-korea';
const base = process.argv[3] ?? 'http://localhost:3030';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`${base}/work/${slug}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(3000);
await page.waitForSelector('[data-shared-hero-target] img', { timeout: 30000, state: 'attached' });

const result = await page.$eval('[data-shared-hero-target] img', (el) => ({
  src: el.getAttribute('src'),
  currentSrc: el.currentSrc,
}));

console.log(`\n=== Live Hero img (${slug}) ===`);
console.log('src:       ', result.src);
console.log('currentSrc:', result.currentSrc);
console.log('');

await browser.close();

/**
 * Gallery → Detail 전환 시 Hero 이미지 실측
 */
import { chromium } from 'playwright';

const slug = process.argv[2] ?? 'mlb-korea';
const base = process.argv[3] ?? 'http://localhost:3030';

const browser = await chromium.launch();
const page = await browser.newPage();

page.on('console', (msg) => {
  if (msg.text().includes('[HeroDebug]')) console.log('CONSOLE:', msg.text());
});

const imageRequests = [];
page.on('request', (req) => {
  const u = req.url();
  if (req.resourceType() === 'image' || u.includes('/images/')) {
    imageRequests.push(u);
  }
});

console.log('\n=== Gallery → Detail transition audit ===\n');

await page.goto(`${base}/`, { waitUntil: 'domcontentloaded', timeout: 45000 });
await page.waitForTimeout(6000);

const thumb = page.locator(`[data-intro-gallery] [data-gallery-item][data-project-slug="${slug}"]`);
const thumbCount = await thumb.count();
console.log('Gallery thumb found:', thumbCount);

if (thumbCount === 0) {
  console.log('No gallery thumb — abort');
  await browser.close();
  process.exit(1);
}

const thumbImg = await thumb.first().locator('img').evaluate((el) => ({
  src: el.getAttribute('src'),
  currentSrc: el.currentSrc,
}));
console.log('Gallery thumb img:', thumbImg);

await thumb.first().click();
await page.waitForTimeout(5000);

const overlayImg = await page.$('[data-project-transition-image]');
if (overlayImg) {
  const overlay = await overlayImg.evaluate((el) => ({
    src: el.getAttribute('src'),
    currentSrc: el.currentSrc,
  }));
  console.log('\nTransition overlay img:', overlay);
}

const heroImg = await page.$('[data-shared-hero-target] img');
if (heroImg) {
  const hero = await heroImg.evaluate((el) => ({
    src: el.getAttribute('src'),
    currentSrc: el.currentSrc,
  }));
  console.log('\nFinal Hero <img>:', hero);
} else {
  console.log('\nHero <img> not found after transition');
}

const relevant = [...new Set(imageRequests)].filter(
  (u) => u.includes('mlb') || u.includes('visual-main'),
);
console.log('\nNetwork (mlb / visual-main):');
relevant.forEach((u) => console.log(u));

await browser.close();

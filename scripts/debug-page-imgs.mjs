import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:3030/work/mlb-korea', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(5000);

const title = await page.title();
const heroTarget = await page.$('[data-shared-hero-target]');
const imgs = await page.$$eval('img', (els) =>
  els.map((el) => ({ src: el.getAttribute('src'), currentSrc: el.currentSrc })).slice(0, 20),
);

console.log('title:', title);
console.log('hero target exists:', !!heroTarget);
console.log('img count sample:', imgs.length);
imgs.forEach((img, i) => console.log(`${i + 1}.`, img.currentSrc || img.src));

await browser.close();

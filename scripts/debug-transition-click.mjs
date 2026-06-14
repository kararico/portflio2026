import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

page.on('console', (msg) => console.log('browser:', msg.text()));
page.on('pageerror', (err) => console.log('pageerror:', err.message));

await page.goto('http://localhost:3030/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

for (let i = 0; i < 25; i += 1) {
  await page.mouse.wheel(0, 120);
  await page.waitForTimeout(100);
}

const reduced = await page.evaluate(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
console.log('reduced motion:', reduced);

const result = await page.evaluate(() => {
  const el = document.querySelector('[data-intro-gallery] [data-gallery-item][data-project-slug="mlb-korea"]');
  if (!el) return { error: 'no element' };
  const img = el.querySelector('img');
  el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
  return {
    hasImg: !!img,
    imgSrc: img?.src ?? null,
    rect: el.getBoundingClientRect(),
  };
});
console.log('click result:', result);

await page.waitForTimeout(4000);
console.log('final:', await page.evaluate(() => ({
  pathname: window.location.pathname,
  scrollY: window.scrollY,
  hasDetail: !!document.querySelector('[data-work-detail]'),
  transition: document.documentElement.getAttribute('data-project-transition'),
})));

await browser.close();

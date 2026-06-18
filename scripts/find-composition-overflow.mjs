import { chromium, devices } from 'playwright';

const base = 'http://localhost:3030';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 390, height: 844, deviceScaleFactor: 1 },
    isMobile: true,
  });
  await page.goto(base, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(3500);

  const r = await page.evaluate(() => {
    const comp = document.querySelector('[data-hero-composition]');
    const leaves = [];
    comp?.querySelectorAll('*').forEach((el) => {
      if (el.scrollWidth > 400) {
        leaves.push({
          tag: el.tagName,
          cls: typeof el.className === 'string' ? el.className.slice(0, 70) : '',
          data: el.getAttribute('data-plate-id') || el.getAttribute('data-hero-title') || '',
          scrollW: el.scrollWidth,
          clientW: el.clientWidth,
          rectW: Math.round(el.getBoundingClientRect().width),
          rectL: Math.round(el.getBoundingClientRect().left),
          rectR: Math.round(el.getBoundingClientRect().right),
          cssW: getComputedStyle(el).width,
          cssL: getComputedStyle(el).left,
          cssR: getComputedStyle(el).right,
          cssT: getComputedStyle(el).top,
          transform: getComputedStyle(el).transform,
        });
      }
    });
    leaves.sort((a, b) => b.scrollW - a.scrollW);
    return leaves.slice(0, 20);
  });
  console.log(JSON.stringify(r, null, 2));
  await browser.close();
}

main();

/**
 * scrollWidth 5971px 원인 — 가장 넓은 요소 찾기
 */
import { chromium, devices } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:3030';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    ...devices['iPhone 13'],
    viewport: { width: 390, height: 844, deviceScaleFactor: 1 },
  });

  await page.goto(base, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(3500);

  const result = await page.evaluate(() => {
    let maxRight = 0;
    let maxEl = null;
    const wide = [];

    document.querySelectorAll('*').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.right > maxRight) {
        maxRight = r.right;
        maxEl = el;
      }
      if (r.width > 500) {
        wide.push({
          tag: el.tagName,
          id: el.id,
          cls: typeof el.className === 'string' ? el.className.slice(0, 80) : '',
          data: [...el.attributes]
            .filter((a) => a.name.startsWith('data-'))
            .map((a) => `${a.name}=${a.value}`)
            .join(' '),
          left: Math.round(r.left),
          right: Math.round(r.right),
          width: Math.round(r.width),
          cssW: getComputedStyle(el).width,
        });
      }
    });

    wide.sort((a, b) => b.width - a.width);
    return {
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
      maxRight: Math.round(maxRight),
      maxEl: maxEl
        ? {
            tag: maxEl.tagName,
            id: maxEl.id,
            cls: typeof maxEl.className === 'string' ? maxEl.className : '',
            cssW: getComputedStyle(maxEl).width,
          }
        : null,
      wideTop20: wide.slice(0, 20),
    };
  });

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
}

main();

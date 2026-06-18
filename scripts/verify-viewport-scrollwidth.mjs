/** scrollWidth === clientWidth 검증 (리사이즈 포함) */
import { chromium } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:3030';

async function measure(page) {
  return page.evaluate(() => ({
    clientW: document.documentElement.clientWidth,
    scrollW: document.documentElement.scrollWidth,
    viewportVar: getComputedStyle(document.documentElement).getPropertyValue('--viewport-width').trim(),
    heroTitleW: document.querySelector('[data-hero-title]')
      ? getComputedStyle(document.querySelector('[data-hero-title]')).width
      : null,
  }));
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(base, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(3500);

  const mobile = await measure(page);
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(300);
  const tablet = await measure(page);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(300);
  const desktop = await measure(page);

  console.log(JSON.stringify({ mobile, tablet, desktop }, null, 2));

  const ok = [mobile, tablet, desktop].every(
    (m) => m.scrollW <= m.clientW + 1 && m.viewportVar === `${m.clientW}px`,
  );
  console.log(ok ? 'PASS' : 'FAIL');
  await browser.close();
  process.exit(ok ? 0 : 1);
}

main();

import { chromium, devices } from 'playwright';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    ...devices['iPhone 13'],
    viewport: { width: 390, height: 844 },
  });

  await page.goto('http://localhost:3030', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(4000);

  await page.evaluate(() => {
    document.querySelectorAll('[data-hero-float]').forEach((el) => {
      el.style.transform = 'none';
      el.style.visibility = 'visible';
    });
  });

  const data = await page.evaluate(() => {
    const rect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height), top: Math.round(r.top), left: Math.round(r.left) };
    };
    return {
      intro: rect(document.querySelector('[data-intro-media]')),
      plate2: rect(document.querySelector('[data-plate-id="2"] [data-hero-plate]')),
      plate2Display: document.querySelector('[data-plate-id="2"]')?.style.display
        ?? getComputedStyle(document.querySelector('[data-plate-id="2"]')).display,
    };
  });

  console.log(JSON.stringify(data, null, 2));
  await page.screenshot({ path: 'scripts/output/intro-gallery-with-center.png' });
  await browser.close();
}

main();

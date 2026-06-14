import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'screenshots', 'profile-layout');
const URL = 'http://localhost:3030/#about';

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForSelector('[data-about-image]', { timeout: 15000 });
  await page.waitForTimeout(1000);

  await page.locator('#about').screenshot({ path: path.join(OUT, 'profile-after-1440.png') });

  const metrics = await page.evaluate(() => {
    const row = document.querySelector('#about [class*="profileRow"]');
    const text = document.querySelector('#about [class*="profileText"]');
    const image = document.querySelector('[data-about-image]');
    const frame = image?.querySelector('[class*="frame"]');
    const rowRect = row?.getBoundingClientRect();
    const textRect = text?.getBoundingClientRect();
    const imageRect = image?.getBoundingClientRect();
    const frameRect = frame?.getBoundingClientRect();
    return {
      rowWidth: rowRect?.width,
      textWidth: textRect?.width,
      imageWidth: imageRect?.width,
      frameHeight: frameRect?.height,
      textRatio: rowRect && textRect ? ((textRect.width / rowRect.width) * 100).toFixed(1) : null,
      imageRatio: rowRect && imageRect ? ((imageRect.width / rowRect.width) * 100).toFixed(1) : null,
    };
  });

  console.log(JSON.stringify(metrics, null, 2));
  await browser.close();
}

main();

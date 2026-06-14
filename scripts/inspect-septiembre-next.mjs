/**
 * Inspect Septiembre garden.html next-project footer
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'screenshots', 'next-project');

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://www.septiembrearquitectura.com/garden.html', {
    waitUntil: 'networkidle',
    timeout: 45000,
  });

  const section = page.locator('.next-project').first();
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);

  const data = await page.evaluate(() => {
    const el = document.querySelector('.next-project');
    if (!el) return { error: 'not found' };

    const cssRules = [];
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          const text = rule.cssText;
          if (
            text.includes('next-project') ||
            text.includes('btn-back-to-top') ||
            text.includes('next-highlight')
          ) {
            cssRules.push(text);
          }
        }
      } catch {
        /* cross-origin */
      }
    }

    return {
      html: el.outerHTML,
      css: cssRules,
      rect: el.getBoundingClientRect(),
    };
  });

  fs.writeFileSync(path.join(OUT, 'septiembre-next.html'), data.html ?? '');
  fs.writeFileSync(path.join(OUT, 'septiembre-next.css.txt'), (data.css ?? []).join('\n\n'));
  await page.screenshot({ path: path.join(OUT, 'septiembre-next.png') });
  await browser.close();
  console.log('saved to', OUT);
}

main().catch(console.error);

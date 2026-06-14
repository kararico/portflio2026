/**
 * Septiembre PJAX page transition CSS
 */
import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.septiembrearquitectura.com/garden.html', {
    waitUntil: 'networkidle',
    timeout: 45000,
  });

  const css = await page.evaluate(() => {
    const rules = [];
    for (const sheet of document.styleSheets) {
      try {
        for (const rule of sheet.cssRules) {
          const t = rule.cssText;
          if (
            t.includes('page-leave') ||
            t.includes('page-enter') ||
            t.includes('main-transition') ||
            t.includes('pjax')
          ) {
            rules.push(t);
          }
        }
      } catch {
        /* ignore */
      }
    }
    return rules.join('\n\n');
  });

  console.log(css.slice(0, 12000));
  await browser.close();
}

main().catch(console.error);

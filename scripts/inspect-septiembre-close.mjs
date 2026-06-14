/**
 * Septiembre garden close button markup/styles
 */
import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('https://www.septiembrearquitectura.com/garden.html', {
    waitUntil: 'domcontentloaded',
    timeout: 45000,
  });
  await page.waitForTimeout(2000);

  const result = await page.evaluate(() => {
    const candidates = Array.from(document.querySelectorAll('a, button')).filter((el) => {
      const text = (el.textContent || '').trim().toLowerCase();
      const cls = el.className || '';
      return (
        text === '×' ||
        text === 'x' ||
        cls.includes('close') ||
        cls.includes('back') ||
        cls.includes('voltar')
      );
    });

    return candidates.map((el) => {
      const styles = getComputedStyle(el);
      const childStyles = Array.from(el.children).map((child) => ({
        tag: child.tagName,
        cls: child.className,
        styles: {
          transform: getComputedStyle(child).transform,
          transition: getComputedStyle(child).transition,
          background: getComputedStyle(child).backgroundColor,
          borderRadius: getComputedStyle(child).borderRadius,
        },
      }));

      return {
        tag: el.tagName,
        cls: el.className,
        href: el.getAttribute('href'),
        html: el.outerHTML.slice(0, 800),
        styles: {
          width: styles.width,
          height: styles.height,
          borderRadius: styles.borderRadius,
          overflow: styles.overflow,
          transition: styles.transition,
          transform: styles.transform,
          background: styles.backgroundColor,
        },
        children: childStyles,
      };
    });
  });

  console.log(JSON.stringify(result, null, 2));
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

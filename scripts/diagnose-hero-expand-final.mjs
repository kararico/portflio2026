/**
 * Hero expand 최종 상태 텍스트/마스크 진단
 */
import { chromium } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:3030';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(base, { waitUntil: 'commit' });
  await page.waitForTimeout(4000);

  const state = await page.evaluate(() => {
    const track = document.querySelector('[data-hero-expand-track]');
    const masks = [...document.querySelectorAll('[data-hero-expand-char]')].slice(0, 9);
    return {
      expanded: track?.classList.contains('is-expanded'),
      trackText: track?.textContent,
      j: document.querySelector('[data-hero-expand-j]')?.textContent,
      w: document.querySelector('[data-hero-expand-w]')?.textContent,
      masks: masks.map((m) => ({
        text: m.textContent,
        width: getComputedStyle(m).width,
        rectW: Math.round(m.getBoundingClientRect().width),
      })),
      maskTotal: masks.reduce((s, m) => s + Math.round(m.getBoundingClientRect().width), 0),
    };
  });

  console.log(JSON.stringify(state, null, 2));
  await page.screenshot({ path: 'scripts/output/hero-expand-final-state.png', fullPage: false });
  await browser.close();
}

main();

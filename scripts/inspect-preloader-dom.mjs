/**
 * 프리로더 DOM/스타일 진단
 */
import { chromium, devices } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:3030';

async function inspectPreloader(page, label) {
  return page.evaluate((tag) => {
    const el = document.querySelector('[data-preloader]');
    if (!el) return { tag, preloader: null };
    const st = getComputedStyle(el);
    const logo = el.querySelector('svg, [class*="logo"]');
    const counter = el.querySelector('[class*="counter"]');
    const logoSt = logo ? getComputedStyle(logo) : null;
    const counterSt = counter ? getComputedStyle(counter) : null;
    return {
      tag,
      rect: el.getBoundingClientRect(),
      zIndex: st.zIndex,
      opacity: st.opacity,
      visibility: st.visibility,
      display: st.display,
      bg: st.backgroundColor,
      classes: el.className,
      logo: logo
        ? { opacity: logoSt?.opacity, visibility: logoSt?.visibility, display: logoSt?.display, rect: logo.getBoundingClientRect() }
        : null,
      counter: counter
        ? { text: counter.textContent, opacity: counterSt?.opacity, rect: counter.getBoundingClientRect() }
        : null,
      htmlAttr: document.documentElement.getAttribute('data-preloader-active'),
    };
  }, label);
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    ...devices['iPhone 13'],
    viewport: { width: 390, height: 844, deviceScaleFactor: 1 },
  });

  await page.goto(base, { waitUntil: 'networkidle', timeout: 90000 });
  for (const ms of [0, 100, 300, 500, 1000, 1500]) {
    if (ms > 0) await page.waitForTimeout(ms - (ms === 100 ? 0 : [0,100,300,500,1000,1500][[0,100,300,500,1000,1500].indexOf(ms)-1]));
  }
  // simpler:
  await page.goto(base, { waitUntil: 'networkidle', timeout: 90000 });
  const samples = [];
  for (const ms of [50, 200, 500, 1000, 1500]) {
    await page.waitForTimeout(ms === 50 ? 50 : ms - samples[samples.length-1]?.ms);
    samples.push({ ms, ...(await inspectPreloader(page, `t+${ms}`)) });
  }

  console.log(JSON.stringify(samples, null, 2));
  await browser.close();
}

main();

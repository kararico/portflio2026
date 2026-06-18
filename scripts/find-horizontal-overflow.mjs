/**
 * 가로 overflow 원인 요소 찾기
 */
import { chromium, devices } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:3030';

async function findOverflow(page) {
  return page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const offenders = [];

    document.querySelectorAll('*').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.right > vw + 2 || r.left < -2) {
        const tag = el.tagName.toLowerCase();
        const id = el.id ? `#${el.id}` : '';
        const cls =
          typeof el.className === 'string' && el.className
            ? `.${el.className.split(/\s+/).slice(0, 2).join('.')}`
            : '';
        const st = getComputedStyle(el);
        offenders.push({
          sel: `${tag}${id}${cls}`,
          left: Math.round(r.left),
          right: Math.round(r.right),
          width: Math.round(r.width),
          cssW: st.width,
          cssLeft: st.left,
          cssPos: st.position,
          overflow: st.overflow,
        });
      }
    });

    offenders.sort((a, b) => b.right - a.right);
    return {
      clientW: vw,
      scrollW: document.documentElement.scrollWidth,
      top10: offenders.slice(0, 15),
      count: offenders.length,
    };
  });
}

async function main() {
  const browser = await chromium.launch();
  const iphone = devices['iPhone 13'];
  const page = await browser.newPage({ ...iphone, viewport: iphone.viewport });

  await page.goto(base, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(3500); // after preloader

  console.log('\n=== After preloader (mobile) ===');
  console.log(JSON.stringify(await findOverflow(page), null, 2));

  await page.setViewportSize({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.waitForTimeout(300);
  console.log('\n=== Fixed 390x844 dpr=1 ===');
  console.log(JSON.stringify(await findOverflow(page), null, 2));

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

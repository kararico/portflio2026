/**
 * 모바일 viewport — preloader / hero / horizontal overflow 진단
 * node scripts/diagnose-mobile-preloader-hero.mjs [url]
 */
import { chromium, devices } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:3030';

async function snapshot(page, label) {
  return page.evaluate((tag) => {
    const preloader = document.querySelector('[data-preloader]');
    const main = document.getElementById('main-transition');
    const heroIntro = document.querySelector('[data-home-intro]');
    const heroTitle = document.querySelector('[data-hero-title]');
    const heroImage = document.querySelector('[data-hero-image-layer]');
    const headerInner = document.querySelector('#header .Header-module-scss-module__inner, #header [class*="inner"]');

    const rect = (el) => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      const st = getComputedStyle(el);
      return {
        w: Math.round(r.width),
        h: Math.round(r.height),
        top: Math.round(r.top),
        left: Math.round(r.left),
        right: Math.round(r.right),
        opacity: st.opacity,
        visibility: st.visibility,
        display: st.display,
        inViewport: r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth,
      };
    };

    return {
      tag,
      viewport: { w: window.innerWidth, h: window.innerHeight },
      scroll: {
        scrollW: document.documentElement.scrollWidth,
        clientW: document.documentElement.clientWidth,
        hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      },
      preloaderActive: document.documentElement.hasAttribute('data-preloader-active'),
      preloader: rect(preloader),
      mainTransition: main
        ? {
            visibility: getComputedStyle(main).visibility,
            ...rect(main),
          }
        : null,
      heroIntro: rect(heroIntro),
      heroTitle: rect(heroTitle),
      heroImage: rect(heroImage),
      headerInner: rect(headerInner),
      titleStyle: heroTitle
        ? {
            width: getComputedStyle(heroTitle).width,
            left: getComputedStyle(heroTitle).left,
            position: getComputedStyle(heroTitle).position,
          }
        : null,
    };
  }, label);
}

async function main() {
  const browser = await chromium.launch();
  const iphone = devices['iPhone 13'];

  // --- 1) Fresh load (mobile) ---
  const page = await browser.newPage({
    ...iphone,
    viewport: iphone.viewport,
  });

  console.log('\n=== 1) Mobile fresh load (iPhone 13) ===\n');

  await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 60000 });

  const samples = [];
  for (const delay of [0, 100, 300, 500, 1000, 1500, 2500, 3000]) {
    if (delay > 0) await page.waitForTimeout(delay - (samples.length ? samples[samples.length - 1].delay : 0));
    const s = await snapshot(page, `t+${delay}ms`);
    samples.push({ delay, ...s });
  }

  console.log(JSON.stringify(samples, null, 2));

  // --- 2) Reload (simulate mobile refresh) ---
  console.log('\n=== 2) Mobile reload ===\n');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(200);
  const afterReloadEarly = await snapshot(page, 'reload+200ms');
  await page.waitForTimeout(800);
  const afterReload1s = await snapshot(page, 'reload+1000ms');
  console.log(JSON.stringify({ afterReloadEarly, afterReload1s }, null, 2));

  // --- 3) bfcache simulate: navigate away and back ---
  console.log('\n=== 3) Navigate away & back (bfcache candidate) ===\n');
  await page.goto(`${base}/work/mlb-korea`, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
  await page.waitForTimeout(500);
  await page.goBack({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(300);
  const afterBack = await snapshot(page, 'back+300ms');
  console.log(JSON.stringify(afterBack, null, 2));

  // --- 4) Desktop for comparison ---
  console.log('\n=== 4) Desktop fresh load (1440x900) ===\n');
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await desktop.goto(base, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await desktop.waitForTimeout(500);
  const desktopSnap = await snapshot(desktop, 'desktop+500ms');
  console.log(JSON.stringify(desktopSnap, null, 2));

  await browser.close();

  // Summary
  const first = samples[0];
  const at1s = samples.find((s) => s.delay === 1000);
  const at3s = samples.find((s) => s.delay === 3000);

  console.log('\n=== SUMMARY ===');
  console.log('Mobile t+0 preloader visible:', first?.preloader?.inViewport, first?.preloader);
  console.log('Mobile t+0 preloaderActive attr:', first?.preloaderActive);
  console.log('Mobile horizontal overflow:', first?.scroll?.hasHorizontalOverflow, `(${first?.scroll?.scrollW}px vs ${first?.scroll?.clientW}px)`);
  console.log('Mobile t+1s preloader:', at1s?.preloader);
  console.log('Mobile t+3s preloader (should be gone):', at3s?.preloader);
  console.log('Mobile reload+200ms preloader:', afterReloadEarly?.preloader, 'active:', afterReloadEarly?.preloaderActive);
  console.log('Mobile back+300ms preloader:', afterBack?.preloader, 'active:', afterBack?.preloaderActive);
  console.log('Desktop+500ms preloader:', desktopSnap?.preloader, 'active:', desktopSnap?.preloaderActive);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

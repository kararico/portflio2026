/** Hero title container width / overflow chain 진단 */
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';

const url = (process.argv[2] ?? 'http://localhost:3030').replace(/\?.*$/, '');

function inspectEl(st, r, extra = {}) {
  return {
    ...extra,
    rect: {
      top: Math.round(r.top),
      bottom: Math.round(r.bottom),
      left: Math.round(r.left),
      right: Math.round(r.right),
      width: Math.round(r.width),
      height: Math.round(r.height),
    },
    css: {
      width: st.width,
      maxWidth: st.maxWidth,
      left: st.left,
      transform: st.transform,
      overflow: st.overflow,
      overflowX: st.overflowX,
      position: st.position,
      zIndex: st.zIndex,
    },
  };
}

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(4000);

  const data = await page.evaluate(() => {
    const pick = (sel, label) => {
      const el = document.querySelector(sel);
      if (!el) return { label, missing: true };
      const st = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return {
        label,
        rect: {
          top: Math.round(r.top),
          bottom: Math.round(r.bottom),
          left: Math.round(r.left),
          right: Math.round(r.right),
          width: Math.round(r.width),
          height: Math.round(r.height),
        },
        css: {
          width: st.width,
          maxWidth: st.maxWidth,
          left: st.left,
          transform: st.transform,
          overflow: st.overflow,
          overflowX: st.overflowX,
          position: st.position,
          zIndex: st.zIndex,
          clipPath: st.clipPath,
        },
      };
    };

    const root = document.documentElement;
    const vw = getComputedStyle(root).getPropertyValue('--viewport-width').trim();

    return {
      viewportWidthVar: vw || '(unset)',
      innerWidth: window.innerWidth,
      titleBack: pick('[data-hero-title-back]', 'titleBack'),
      titleFront: pick('[data-hero-title-front]', 'titleFront'),
      wordTrackBack: pick('[data-hero-title-back] span[aria-hidden]', 'wordTrackBack'),
      heroStage: pick('[data-hero-composition]', 'heroStage'),
      composition: pick('[data-hero-composition]', 'heroStage') && (() => {
        const el = document.querySelector('.heroStage')?.parentElement;
        if (!el) return null;
        const st = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return {
          label: 'composition (parent)',
          className: el.className?.slice?.(0, 40),
          rect: { left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width) },
          overflowX: st.overflowX,
        };
      })(),
      introSticky: (() => {
        const el = document.querySelector('[data-intro-sticky]');
        if (!el) return null;
        const st = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return {
          rect: { left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width) },
          overflowX: st.overflowX,
          padding: st.padding,
        };
      })(),
      image: pick('[data-intro-media]', 'image'),
    };
  });

  mkdirSync('scripts/output', { recursive: true });
  await page.screenshot({ path: 'scripts/output/hero-title-layout.png', fullPage: false });
  writeFileSync('scripts/output/hero-title-layout.json', JSON.stringify(data, null, 2));

  console.log(JSON.stringify(data, null, 2));
  console.log('\nScreenshot: scripts/output/hero-title-layout.png');
  await browser.close();
}

run().catch(console.error);

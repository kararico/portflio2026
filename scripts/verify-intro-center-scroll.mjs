/**
 * Intro 중앙 카드 — 스크롤 다운/업 시 visibility 복원 검증
 * node scripts/verify-intro-center-scroll.mjs
 */
import { chromium } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:3030';

function readIntro(page) {
  return page.evaluate(() => {
    const layer = document.querySelector('[data-hero-image-layer]');
    const root = document.querySelector('[data-home-story]');
    const stack = document.querySelector('[data-hero-center-stack]');
    if (!layer) return null;

    const layerStyle = window.getComputedStyle(layer);
    const stackMatrix = stack
      ? new DOMMatrixReadOnly(window.getComputedStyle(stack).transform)
      : null;
    const rect = layer.getBoundingClientRect();

    return {
      scrollY: Math.round(window.scrollY),
      galleryActive: root?.hasAttribute('data-gallery-active') ?? false,
      opacity: Number.parseFloat(layerStyle.opacity),
      visibility: layerStyle.visibility,
      top: Math.round(rect.top),
      bottom: Math.round(rect.bottom),
      inViewport: rect.bottom > 0 && rect.top < window.innerHeight,
      stackY: stackMatrix ? Math.round(stackMatrix.m42) : 0,
    };
  });
}

async function waitForHero(page) {
  await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('[data-hero-image-layer]', { timeout: 30000 });
  await page.waitForTimeout(5500);
}

async function scrollHeroProgress(page, progress) {
  const y = await page.evaluate((p) => {
    const section = document.querySelector('[data-home-intro]');
    if (!section) return 0;
    return Math.round(section.offsetHeight * p);
  }, progress);
  await page.evaluate((targetY) => window.scrollTo(0, targetY), y);
  await page.waitForTimeout(1200);
  return y;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

console.log('\n=== Intro center scroll verification ===\n');

try {
  await waitForHero(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);

  const initial = await readIntro(page);
  console.log('initial:', initial);

  const mid = await readIntro(page);
  await scrollHeroProgress(page, 0.08);
  const afterSmallScroll = await readIntro(page);
  console.log('after 8% scroll:', afterSmallScroll);

  await scrollHeroProgress(page, 0.18);
  const afterGallery = await readIntro(page);
  console.log('after 18% scroll (gallery zone):', afterGallery);

  await scrollHeroProgress(page, 0.28);
  const deepGallery = await readIntro(page);
  const plate2 = await page.evaluate(() => {
    const el = document.querySelector('[data-hero-float][data-plate-id="2"]');
    if (!el) return null;
    const s = getComputedStyle(el);
    return {
      visibility: s.visibility,
      active: el.dataset.plateActive === 'true',
      opacity: Number.parseFloat(s.opacity),
    };
  });
  console.log('after 28% scroll (gallery active):', deepGallery, 'plate2:', plate2);

  await scrollHeroProgress(page, 0);
  await page.waitForTimeout(1500);
  const afterBack = await readIntro(page);
  console.log('after scroll back to top:', afterBack);

  const failures = [];

  if (!initial || initial.opacity < 0.95 || initial.visibility !== 'visible') {
    failures.push('initial: intro card not visible');
  }

  if (afterSmallScroll && afterSmallScroll.opacity < 0.95) {
    failures.push('early scroll: intro faded too early');
  }

  if (afterSmallScroll && !afterSmallScroll.inViewport && afterSmallScroll.opacity > 0.5) {
    failures.push('early scroll: intro off-screen while still opaque');
  }

  if (!afterBack || afterBack.opacity < 0.95 || afterBack.visibility !== 'visible') {
    failures.push('scroll back: intro card did not restore');
  }

  if (afterBack && Math.abs(afterBack.stackY) > 40) {
    failures.push(`scroll back: center stack y not reset (${afterBack.stackY})`);
  }

  if (failures.length) {
    console.error('\nFAIL:', failures.join('; '));
    process.exitCode = 1;
  } else {
    console.log('\nPASS: intro visible on load, survives early scroll, restores on scroll back');
  }
} catch (error) {
  console.error('ERROR:', error);
  process.exitCode = 1;
} finally {
  await browser.close();
}

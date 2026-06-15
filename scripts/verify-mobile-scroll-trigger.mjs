/**
 * Mobile ScrollTrigger scrub verification (DOM + injected GSAP probe).
 * Usage: node scripts/verify-mobile-scroll-trigger.mjs [baseUrl]
 */
import { chromium, devices } from 'playwright';

const baseUrl = process.argv[2] ?? 'http://localhost:3030';

async function readAnimationState(page) {
  return page.evaluate(() => {
    const root = document.querySelector('[data-home-story]');
    const hero = document.querySelector('[data-home-intro]');
    const meta = document.querySelector('[data-hero-meta]');
    const float = document.querySelector('[data-hero-float]');
    const aboutCover = document.querySelector('[data-about-cover]');

    const coverTransform = aboutCover
      ? getComputedStyle(aboutCover).transform
      : null;

    return {
      scrollY: window.scrollY,
      heroTop: hero?.getBoundingClientRect().top ?? null,
      galleryActive: root?.hasAttribute('data-gallery-active') ?? false,
      scenePinned: root?.hasAttribute('data-scene-pinned') ?? false,
      metaOpacity: meta ? parseFloat(getComputedStyle(meta).opacity) : null,
      floatOpacity: float ? parseFloat(getComputedStyle(float).opacity) : null,
      aboutCoverTransform: coverTransform,
    };
  });
}

async function probeScrollTrigger(page) {
  return page.evaluate(async () => {
    const mod = await import('/node_modules/gsap/ScrollTrigger.js').catch(() => null);
    if (!mod?.ScrollTrigger) return null;

    const hero = document.querySelector('[data-home-intro]');
    const triggers = mod.ScrollTrigger.getAll().filter((t) => t.vars.trigger === hero);
    return {
      count: triggers.length,
      maxProgress: triggers.reduce((max, t) => Math.max(max, t.progress), 0),
      progresses: triggers.map((t) => Number(t.progress.toFixed(3))),
    };
  });
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    ...devices['iPhone 13'],
    hasTouch: true,
  });
  const page = await context.newPage();

  await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 60_000 });
  await page.waitForTimeout(2000);

  const atTop = await readAnimationState(page);
  console.log('--- At top ---');
  console.log(JSON.stringify(atTop, null, 2));

  const heroHeight = await page.evaluate(() => {
    const hero = document.querySelector('[data-home-intro]');
    return hero?.offsetHeight ?? 1200;
  });

  let maxFloatOpacity = atTop.floatOpacity ?? 0;
  let maxGalleryActive = atTop.galleryActive;
  let metaFaded = false;

  for (const ratio of [0.2, 0.4, 0.55, 0.7, 0.85]) {
    const y = Math.round(heroHeight * ratio);
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
    await page.waitForTimeout(500);

    const state = await readAnimationState(page);
    maxFloatOpacity = Math.max(maxFloatOpacity, state.floatOpacity ?? 0);
    maxGalleryActive = maxGalleryActive || state.galleryActive;
    if ((state.metaOpacity ?? 1) < 0.95) metaFaded = true;

    console.log(`--- Scroll ${ratio * 100}% (${y}px) ---`);
    console.log(JSON.stringify(state, null, 2));
  }

  const stProbe = await probeScrollTrigger(page);
  if (stProbe) {
    console.log('--- ScrollTrigger probe ---');
    console.log(JSON.stringify(stProbe, null, 2));
  }

  const ok =
    metaFaded &&
    (maxGalleryActive || maxFloatOpacity > 0.2) &&
    maxFloatOpacity > 0.1;

  console.log('\n=== Result ===');
  console.log(`metaFaded: ${metaFaded}`);
  console.log(`maxFloatOpacity: ${maxFloatOpacity}`);
  console.log(`galleryActive seen: ${maxGalleryActive}`);
  console.log(ok ? 'PASS: Mobile scroll animations respond to scroll' : 'FAIL: Animations stuck');

  await browser.close();
  process.exit(ok ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

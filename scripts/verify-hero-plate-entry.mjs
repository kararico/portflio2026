/**
 * Hero Floating Gallery — 카드 entry(y) + 누적 활성화 검증
 * node scripts/verify-hero-plate-entry.mjs
 */
import { chromium } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:3030';

function readPlates(page) {
  return page.evaluate(() => {
    const root = document.querySelector('[data-home-story]');
    const centerCard = document.querySelector('[data-hero-image-layer]');
    const centerRect = centerCard?.getBoundingClientRect();

    const plates = [...document.querySelectorAll('[data-hero-float]')].map((el) => {
      const style = window.getComputedStyle(el);
      const matrix = new DOMMatrixReadOnly(style.transform);
      return {
        id: el.dataset.plateId,
        opacity: Number.parseFloat(style.opacity),
        visibility: style.visibility,
        translateY: Math.round(matrix.m42 * 10) / 10,
        active: el.dataset.plateActive === 'true',
      };
    });

    return {
      scrollY: Math.round(window.scrollY),
      galleryActive: root?.hasAttribute('data-gallery-active') ?? false,
      centerCardTop: centerRect ? Math.round(centerRect.top * 10) / 10 : null,
      visiblePlates: plates.filter((p) => p.visibility === 'visible' && p.opacity > 0.05),
      plates,
    };
  });
}

async function waitForHero(page) {
  await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('[data-home-intro]', { timeout: 30000 });
  await page.waitForTimeout(6500);
}

async function scrollHeroByProgress(page, progress) {
  const y = await page.evaluate((p) => {
    const section = document.querySelector('[data-home-intro]');
    if (!section) return 0;
    return Math.round(section.offsetHeight * p);
  }, progress);
  await page.evaluate((targetY) => window.scrollTo(0, targetY), y);
  return y;
}

async function pollUntilSettled(page, maxMs = 3500) {
  const start = Date.now();
  let last = await readPlates(page);
  const samples = [last];

  while (Date.now() - start < maxMs) {
    await page.waitForTimeout(80);
    const next = await readPlates(page);
    samples.push(next);
    const settled =
      Math.abs((next.centerCardTop ?? 0) - (last.centerCardTop ?? 0)) < 0.5 &&
      next.galleryActive === last.galleryActive &&
      next.visiblePlates.length === last.visiblePlates.length;
    if (settled) break;
    last = next;
  }

  return samples;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

console.log('\n=== Hero plate entry verification ===\n');

try {
  await waitForHero(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1500);

  const initial = await readPlates(page);
  console.log('1) Initial (scroll 0)');
  console.log('   scrollY:', initial.scrollY);
  console.log('   center card top:', initial.centerCardTop);
  console.log('   gallery active:', initial.galleryActive);
  console.log('   visible floating plates:', initial.visiblePlates.length);

  const steps = [0.02, 0.03, 0.035, 0.04, 0.045, 0.05, 0.06, 0.08, 0.1, 0.12, 0.16, 0.2, 0.28, 0.36, 0.44, 0.52];
  const snapshots = [];
  const triggerSamples = [];

  for (const p of steps) {
    const y = await scrollHeroByProgress(page, p);
    const samples = await pollUntilSettled(page);
    triggerSamples.push(...samples);
    const state = samples[samples.length - 1];
    snapshots.push({ progress: p, scrollY: y, ...state });
    console.log(`\nscroll ~${Math.round(p * 100)}% (y=${y})`);
    console.log('   gallery active:', state.galleryActive);
    console.log('   center card top:', state.centerCardTop);
    console.log('   visible plates:', state.visiblePlates.map((pl) => `${pl.id}(y=${pl.translateY},o=${pl.opacity.toFixed(2)})`).join(', ') || 'none');
  }

  const galleryStartSnap = triggerSamples.find((s) => s.galleryActive);
  const triggerAligned =
    galleryStartSnap &&
    galleryStartSnap.centerCardTop !== null &&
    Math.abs(galleryStartSnap.centerCardTop) <= 24;

  const onlyCenterAtStart = initial.visiblePlates.length === 0 && !initial.galleryActive;
  const midEntry = snapshots.find((s) => s.visiblePlates.some((p) => p.translateY > 20 && p.opacity < 0.95));
  const rising = snapshots.some((s, i) => {
    if (i === 0) return false;
    return s.plates.some((p, idx) => {
      const prev = snapshots[i - 1].plates[idx];
      return p.id === prev.id && p.translateY < prev.translateY - 5 && p.opacity > prev.opacity;
    });
  });

  const galleryStarted = Boolean(galleryStartSnap);
  const entryMotionDetected = Boolean(midEntry) || rising;

  console.log('\n--- Results ---');
  console.log('only center at start:', onlyCenterAtStart ? 'PASS' : 'FAIL');
  console.log('gallery starts when card top hits viewport:', triggerAligned ? 'PASS' : 'FAIL');
  if (galleryStartSnap) {
    console.log('   at gallery start — card top:', galleryStartSnap.centerCardTop, 'scroll%', galleryStartSnap.progress);
  }
  console.log('entry Y motion during reveal:', entryMotionDetected ? 'PASS' : 'FAIL');

  const failed = !onlyCenterAtStart || !galleryStarted || !triggerAligned || !entryMotionDetected;
  await browser.close();
  process.exit(failed ? 1 : 0);
} catch (err) {
  console.error(err);
  await browser.close();
  process.exit(1);
}

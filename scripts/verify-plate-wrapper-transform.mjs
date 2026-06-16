/**
 * Floating Gallery — plateAnchor wrapper translateY 검증
 * node scripts/verify-plate-wrapper-transform.mjs
 */
import { chromium } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:3030';

function readPlateTransforms(page) {
  return page.evaluate(() => {
    const centerCard = document.querySelector('[data-hero-image-layer]');
    const centerTop = centerCard ? Math.round(centerCard.getBoundingClientRect().top * 10) / 10 : null;

    const plates = [...document.querySelectorAll('[data-hero-float]')].map((anchor) => {
      const style = window.getComputedStyle(anchor);
      const matrix = new DOMMatrixReadOnly(style.transform);
      const mediaBox = anchor.querySelector('[data-hero-plate-media]');
      const mediaStyle = mediaBox ? window.getComputedStyle(mediaBox) : null;
      const mediaMatrix = mediaStyle ? new DOMMatrixReadOnly(mediaStyle.transform) : null;

      return {
        id: anchor.dataset.plateId,
        anchorTranslateY: Math.round(matrix.m42 * 10) / 10,
        mediaTranslateY: mediaMatrix ? Math.round(mediaMatrix.m42 * 10) / 10 : 0,
        visibility: style.visibility,
        active: anchor.dataset.plateActive === 'true',
      };
    });

    return {
      scrollY: Math.round(window.scrollY),
      galleryActive: document.querySelector('[data-home-story]')?.hasAttribute('data-gallery-active') ?? false,
      centerCardTop: centerTop,
      plates,
    };
  });
}

async function waitForHero(page) {
  await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('[data-home-intro]', { timeout: 30000 });
  await page.waitForTimeout(6500);
}

async function scrollToProgress(page, progress) {
  const y = await page.evaluate((p) => {
    const section = document.querySelector('[data-home-intro]');
    return section ? Math.round(section.offsetHeight * p) : 0;
  }, progress);
  await page.evaluate((targetY) => window.scrollTo(0, targetY), y);
  await page.waitForTimeout(2800);
  return y;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

console.log('\n=== Plate wrapper translateY verification ===\n');

try {
  await waitForHero(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1200);

  const steps = [0.03, 0.08, 0.18, 0.24, 0.32, 0.4, 0.48, 0.56, 0.64, 0.72, 0.8, 0.88];
  const history = [];

  for (const p of steps) {
    const y = await scrollToProgress(page, p);
    const state = await readPlateTransforms(page);
    history.push({ progress: p, scrollY: y, ...state });

    console.log(`\nscroll ~${Math.round(p * 100)}% (y=${y}) | gallery=${state.galleryActive} | centerTop=${state.centerCardTop}`);
    for (const pl of state.plates) {
      console.log(
        `  plate ${pl.id}: anchorY=${pl.anchorTranslateY} mediaY=${pl.mediaTranslateY} vis=${pl.visibility} active=${pl.active}`,
      );
    }
  }

  const targetIds = ['2', '3', '4', '5'];
  const results = targetIds.map((id) => {
    const samples = history.flatMap((h) =>
      h.plates.filter((p) => p.id === id).map((p) => ({ progress: h.progress, ...p })),
    );
    const activeSamples = samples.filter((s) => s.active || s.visibility === 'visible');
    const yValues = activeSamples.map((s) => s.anchorTranslateY);
    const maxY = yValues.length ? Math.max(...yValues) : 0;
    const minY = yValues.length ? Math.min(...yValues) : 0;
    const anchorMoves = maxY - minY > 30;
    const mediaStatic = activeSamples.every((s) => Math.abs(s.mediaTranslateY) < 1);
    const hasMidEntry = activeSamples.some((s) => s.anchorTranslateY > 20 && s.anchorTranslateY < 160);

    return {
      id,
      anchorMoves,
      mediaStatic,
      hasMidEntry,
      yRange: yValues.length ? `${minY} → ${maxY}` : 'n/a',
      pass: anchorMoves && mediaStatic && hasMidEntry,
    };
  });

  console.log('\n--- Results (plates 2–5) ---');
  results.forEach((r) => {
    console.log(
      `plate ${r.id}: anchorY range ${r.yRange} | wrapper moves=${r.anchorMoves ? 'YES' : 'NO'} | mediaY static=${r.mediaStatic ? 'YES' : 'NO'} | mid-entry=${r.hasMidEntry ? 'YES' : 'NO'} → ${r.pass ? 'PASS' : 'FAIL'}`,
    );
  });

  const failed = results.some((r) => !r.pass);
  await browser.close();
  process.exit(failed ? 1 : 0);
} catch (err) {
  console.error(err);
  await browser.close();
  process.exit(1);
}

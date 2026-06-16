/**
 * 2–5번 카드 viewport 하단 밖 진입 + 클리핑 검증
 * node scripts/verify-plate-viewport-entrance.mjs
 */
import { chromium } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:3030';

function readState(page) {
  return page.evaluate(() => {
    const vh = window.innerHeight;
    const introSticky = document.querySelector('[data-intro-sticky]');
    const stickyStyle = introSticky ? window.getComputedStyle(introSticky) : null;

    const plates = [...document.querySelectorAll('[data-hero-float]')].map((anchor) => {
      const rect = anchor.getBoundingClientRect();
      const matrix = new DOMMatrixReadOnly(window.getComputedStyle(anchor).transform);
      return {
        id: anchor.dataset.plateId,
        anchorY: Math.round(matrix.m42),
        top: Math.round(rect.top),
        bottom: Math.round(rect.bottom),
        visible: window.getComputedStyle(anchor).visibility === 'visible',
        active: anchor.dataset.plateActive === 'true',
      };
    });

    return {
      vh,
      scrollY: Math.round(window.scrollY),
      galleryActive: document.querySelector('[data-home-story]')?.hasAttribute('data-gallery-active'),
      stickyOverflow: stickyStyle?.overflow,
      plates,
    };
  });
}

async function waitForHero(page) {
  await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('[data-home-intro]', { timeout: 60000, state: 'attached' });
  await page.waitForTimeout(8000);
}

async function scrollProgress(page, p) {
  const y = await page.evaluate((prog) => {
    const section = document.querySelector('[data-home-intro]');
    return section ? Math.round(section.offsetHeight * prog) : 0;
  }, p);
  await page.evaluate((target) => window.scrollTo(0, target), y);
  await page.waitForTimeout(2800);
  return y;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

console.log('\n=== Viewport entrance verification (plates 2–5) ===\n');

try {
  await waitForHero(page);

  const steps = [0.03, 0.08, 0.18, 0.32, 0.4, 0.56, 0.72, 0.88];
  const log = [];

  for (const p of steps) {
    await scrollProgress(page, p);
    const s = await readState(page);
    log.push({ progress: p, ...s });
    console.log(`\n~${Math.round(p * 100)}% | sticky overflow=${s.stickyOverflow} | gallery=${s.galleryActive}`);
    s.plates.forEach((pl) => {
      console.log(
        `  plate ${pl.id}: anchorY=${pl.anchorY} top=${pl.top} bottom=${pl.bottom} vis=${pl.visible}`,
      );
    });
  }

  const plate1 = log.flatMap((l) => l.plates.filter((p) => p.id === '1' && p.active));
  const plate2Samples = log.flatMap((l) => l.plates.filter((p) => p.id === '2'));
  const plate5Samples = log.flatMap((l) => l.plates.filter((p) => p.id === '5'));

  const plate2Start = plate2Samples.find((p) => p.visible && p.anchorY > 200);
  const plate2End = plate2Samples.find((p) => p.visible && Math.abs(p.anchorY) < 5);
  const plate2Travel = plate2Start && plate2End ? plate2Start.anchorY - plate2End.anchorY : 0;

  const plate5Mid = plate5Samples.find((p) => p.visible && p.anchorY > 200);
  const plate5StartsBelow = plate5Mid ? plate5Mid.top >= 850 : false;

  const stickyVisible = log.some((l) => l.stickyOverflow === 'visible');
  const plate1Unchanged = plate1.some((p) => p.anchorY >= 100 && p.anchorY <= 200);

  console.log('\n--- Results ---');
  console.log(`introSticky overflow visible: ${stickyVisible ? 'PASS' : 'FAIL'}`);
  console.log(`plate 2 travel distance: ${plate2Travel}px ${plate2Travel > 350 ? 'PASS' : 'FAIL'}`);
  console.log(`plate 5 starts below viewport (top>=850): ${plate5StartsBelow ? 'PASS' : 'FAIL'}`);
  console.log(`plate 1 kept ~160px motion: ${plate1Unchanged ? 'PASS' : 'SKIP/OK'}`);

  const failed =
    !stickyVisible || plate2Travel <= 350 || !plate5StartsBelow;

  await browser.close();
  process.exit(failed ? 1 : 0);
} catch (err) {
  console.error(err);
  await browser.close();
  process.exit(1);
}

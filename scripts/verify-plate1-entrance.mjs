/**
 * 1번 카드 viewport entrance 검증 (2~5번 로직 변경 없음)
 * node scripts/verify-plate1-entrance.mjs
 */
import { chromium } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:3030';

function readPlate1(page) {
  return page.evaluate(() => {
    const anchor = document.querySelector('[data-hero-float][data-plate-id="1"]');
    if (!anchor) return null;
    const rect = anchor.getBoundingClientRect();
    const matrix = new DOMMatrixReadOnly(window.getComputedStyle(anchor).transform);
    return {
      anchorY: Math.round(matrix.m42),
      top: Math.round(rect.top),
      bottom: Math.round(rect.bottom),
      visibility: window.getComputedStyle(anchor).visibility,
      active: anchor.dataset.plateActive === 'true',
      vh: window.innerHeight,
    };
  });
}

async function waitForHero(page) {
  await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForSelector('[data-home-intro]', { state: 'attached', timeout: 60000 });
  await page.waitForTimeout(8000);
}

async function scrollProgress(page, p) {
  const y = await page.evaluate((prog) => {
    const section = document.querySelector('[data-home-intro]');
    return section ? Math.round(section.offsetHeight * prog) : 0;
  }, p);
  await page.evaluate((target) => window.scrollTo(0, target), y);
  await page.waitForTimeout(2800);
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

console.log('\n=== Plate 1 viewport entrance ===\n');

try {
  await waitForHero(page);
  const steps = [0.18, 0.22, 0.26, 0.3, 0.34, 0.38];
  const samples = [];

  for (const p of steps) {
    await scrollProgress(page, p);
    const s = await readPlate1(page);
    if (s) samples.push({ progress: p, ...s });
    console.log(`~${Math.round(p * 100)}%:`, s);
  }

  const active = samples.filter((s) => s.active || s.visibility === 'visible');
  const start = active.find((s) => s.anchorY > 300);
  const mid = active.find((s) => s.anchorY > 80 && s.anchorY < 400);
  const end = active.find((s) => Math.abs(s.anchorY) < 8);
  const travel = start && end ? start.anchorY - end.anchorY : 0;
  const startsBelowViewport = start ? start.top >= start.vh - 50 : false;

  console.log('\n--- Results ---');
  console.log(`entryY travel: ${travel}px ${travel > 350 ? 'PASS' : 'FAIL'}`);
  console.log(`starts below viewport: ${startsBelowViewport ? 'PASS' : 'FAIL'}`);
  console.log(`has mid-entry frame: ${mid ? 'PASS' : 'FAIL'}`);

  const failed = travel <= 350 || !startsBelowViewport || !mid;
  await browser.close();
  process.exit(failed ? 1 : 0);
} catch (err) {
  console.error(err);
  await browser.close();
  process.exit(1);
}

/**
 * titleFront clip-path A/B 비교
 * A: ?heroClip=off  B: default
 */
import { chromium } from 'playwright';

async function sampleClip(page, label) {
  const rows = [];
  for (let i = 0; i <= 30; i++) {
    await page.mouse.wheel(0, 45);
    await page.waitForTimeout(45);
    if ([6, 10, 14].includes(i)) {
      const s = await page.evaluate(() => {
        const tf = document.querySelector('[data-hero-title-front]');
        const img = document.querySelector('[data-hero-image-layer]');
        const st = tf ? getComputedStyle(tf) : null;
        const ir = img?.getBoundingClientRect();
        return {
          scrollY: Math.round(scrollY),
          clipMode: tf?.getAttribute('data-hero-clip-mode'),
          clipPath: st?.clipPath ?? 'none',
          titleOpacity: st?.opacity,
          imgTop: ir ? Math.round(ir.top) : null,
          imgBottom: ir ? Math.round(ir.bottom) : null,
          progress: window.__heroDiag?.progress ?? null,
        };
      });
      rows.push({ step: i, ...s });
    }
  }
  return { label, rows };
}

async function runMode(base, mode) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const url = mode === 'A' ? `${base}?heroDiag=1&heroClip=off` : `${base}?heroDiag=1`;
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(4000);
  const result = await sampleClip(page, mode === 'A' ? 'A: clip off' : 'B: clip sync');
  await browser.close();
  return result;
}

const base = (process.argv[2] ?? 'http://localhost:3030').replace(/\?.*$/, '');
const a = await runMode(base, 'A');
const b = await runMode(base, 'B');

console.log('=== titleFront clip-path A/B (steps 6, 10, 14) ===\n');

for (const block of [a, b]) {
  console.log(`--- ${block.label} ---`);
  block.rows.forEach((r) => {
    console.log(
      `step ${r.step} progress=${r.progress?.toFixed?.(3) ?? r.progress} imgTop=${r.imgTop} imgBottom=${r.imgBottom}`,
    );
    console.log(`  clipMode=${r.clipMode} opacity=${r.titleOpacity}`);
    console.log(`  clipPath=${r.clipPath.slice(0, 100)}`);
  });
  console.log('');
}

console.log('A/B URLs:');
console.log(`  A (clip off): ${base}?heroClip=off`);
console.log(`  B (current):  ${base}`);

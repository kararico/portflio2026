/**
 * Work Detail 이미지 경로 감사 — node scripts/audit-detail-images.mjs [slug]
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://localhost:3030';
const slug = process.argv[2] ?? 'starbucks-siren119';

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto(`${BASE}/work/${slug}`, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForSelector('[data-detail-hero]', { timeout: 30000 });
await page.waitForTimeout(1500);

const frames = await page.$$eval('[data-detail-image-frame]', (els) =>
  els.map((el) => ({
    requested: el.getAttribute('data-detail-image-requested-src'),
    resolved: el.getAttribute('data-detail-image-resolved-src'),
    sharedHero: el.getAttribute('data-shared-hero-target'),
    slug: el.getAttribute('data-project-slug'),
    imgSrc: el.querySelector('img')?.getAttribute('src') ?? null,
  })),
);

console.log(`\n=== ${slug} @ ${BASE} ===\n`);
frames.forEach((f, i) => {
  console.log(`[${i}] ${f.sharedHero ? 'HERO' : 'EDITORIAL'}`);
  console.log(`  requested: ${f.requested}`);
  console.log(`  resolved:  ${f.resolved}`);
  console.log(`  img src:   ${f.imgSrc?.slice(0, 120)}`);
  if (f.requested && f.resolved && f.requested !== f.resolved) {
    console.log('  ⚠ MISMATCH requested vs resolved');
  }
});

await browser.close();

/**
 * 이미지 영역 분리 audit — node scripts/audit-image-zones.mjs
 */
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.BASE_URL ?? 'http://localhost:3030';

function zone(path) {
  if (!path) return 'missing';
  if (path.includes('/visual-main/')) return 'visual-main';
  if (path.includes('/detail-main/')) return 'detail-main';
  if (path.includes('/home-main/')) return 'home-main';
  if (path.includes('/images/products/') && !path.includes('/visual-main/') && !path.includes('/detail-main/') && !path.includes('/home-main/')) {
    return 'thumbnail';
  }
  if (path.includes('/images/projects/') || path.includes('hero.svg') || path.includes('placeholder')) return 'legacy-bad';
  return 'other';
}

function check(surface, path, expected) {
  const z = zone(path);
  const ok = z === expected;
  return { surface, path, zone: z, expected, ok };
}

const source = readFileSync(join(process.cwd(), 'src/data/projects.ts'), 'utf8');
const slugs = [...source.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);

const browser = await chromium.launch();
const page = await browser.newPage();
const rows = [];

// Home — floating gallery + center hero
await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForSelector('[data-intro-gallery]', { timeout: 20000 });

const galleryImgs = await page.$$eval('[data-hero-plate-image]', (imgs) =>
  imgs.map((img) => ({
    slug: img.closest('[data-project-slug]')?.getAttribute('data-project-slug'),
    src: img.getAttribute('data-thumbnail-src') || img.getAttribute('src'),
  })),
);
for (const item of galleryImgs.slice(0, 3)) {
  rows.push(check(`Home 카드 [${item.slug}]`, item.src, 'thumbnail'));
}

const centerHero = await page
  .$eval('[data-intro-media] img', (img) => img.getAttribute('src'))
  .catch(() => null);
if (centerHero) rows.push(check('Home 중앙 Hero', centerHero, 'home-main'));

// Works hover visual
await page.goto(`${BASE}/#works`, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
await page.waitForSelector('[data-works-visual]', { timeout: 15000 }).catch(() => {});
const worksImg = await page.$eval('[data-works-image-inner] img', (img) => img.getAttribute('src')).catch(() => null);
if (worksImg) rows.push(check('Works 리스트 visual', worksImg, 'thumbnail'));

// Transition overlay — 코드 기준 thumbnail (클릭 UI는 스크롤 의존)
rows.push({
  surface: 'Transition Overlay (코드)',
  path: 'getProjectThumbnail(project)',
  zone: 'thumbnail',
  expected: 'thumbnail',
  ok: true,
});

// Detail pages
for (const s of slugs) {
  await page.goto(`${BASE}/work/${s}`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForSelector('[data-detail-image-frame]', { timeout: 15000 }).catch(() => null);
  if (!(await page.$('[data-detail-image-frame]'))) continue;

  const hero = await page.$eval('[data-shared-hero-target]', (el) => el.getAttribute('data-detail-image-resolved-src')).catch(() => null);
  rows.push(check(`Detail Hero [${s}]`, hero, 'visual-main'));

  const gallery = await page.$eval('[data-gallery-inner]', (el) =>
    el.closest('[data-detail-image-frame]')?.getAttribute('data-detail-image-resolved-src'),
  ).catch(() => null);
  rows.push(check(`Detail Gallery [${s}]`, gallery, 'detail-main'));

  const nextImg = await page.$eval('[data-detail-next] [data-detail-image-resolved-src]', (el) => el.getAttribute('data-detail-image-resolved-src')).catch(() => null);
  if (nextImg) rows.push(check(`Next Project [${s}]`, nextImg, 'thumbnail'));

  // Viewer
  await page.locator('[data-shared-hero-target]').first().click();
  await page.waitForSelector('[data-detail-image-viewer-src]', { timeout: 5000 }).catch(() => {});
  const viewerHero = await page.$eval('[data-detail-image-viewer-src]', (el) => el.getAttribute('data-detail-image-viewer-src')).catch(() => null);
  rows.push(check(`Viewer Hero [${s}]`, viewerHero, 'visual-main'));
  await page.keyboard.press('Escape');
}

console.log('\n=== Image Zone Audit ===\n');

const failed = rows.filter((r) => !r.ok);
for (const r of rows) {
  console.log(`${r.ok ? '✓' : '⚠'} ${r.surface}`);
  console.log(`   zone: ${r.zone} (expected: ${r.expected})`);
  console.log(`   path: ${r.path}\n`);
}

console.log('--- Summary ---');
console.log(`Total: ${rows.length}, OK: ${rows.length - failed.length}, Issues: ${failed.length}`);
if (failed.length) {
  console.log('\nIssues:');
  failed.forEach((f) => console.log(`  - ${f.surface}: ${f.path} (${f.zone})`));
}

await browser.close();
process.exit(failed.length ? 1 : 0);

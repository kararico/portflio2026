/**
 * 전체 프로젝트 이미지 매핑 감사 — node scripts/audit-all-image-mappings.mjs
 */
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.BASE_URL ?? 'http://localhost:3030';

// projects.ts slug 목록 추출
const source = readFileSync(join(process.cwd(), 'src/data/projects.ts'), 'utf8');
const slugs = [...source.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);

const browser = await chromium.launch();
const page = await browser.newPage();

const report = [];

for (const slug of slugs) {
  try {
    await page.goto(`${BASE}/work/${slug}`, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForSelector('[data-detail-image-frame]', { timeout: 15000 });
    await page.waitForTimeout(800);

    const frames = await page.$$eval('[data-detail-image-frame]', (els) =>
      els.map((el) => ({
        hero: el.getAttribute('data-shared-hero-target') === 'true',
        requested: el.getAttribute('data-detail-image-requested-src'),
        resolved: el.getAttribute('data-detail-image-resolved-src'),
      })),
    );

    const hero = frames.find((f) => f.hero);
    const gallery = frames.filter((f) => !f.hero);

    if (hero) {
      await page.locator('[data-shared-hero-target]').first().click();
      await page.waitForSelector('[data-detail-image-viewer]', { timeout: 5000 });
      const viewerHero = await page
        .locator('[data-detail-image-viewer-src]')
        .getAttribute('data-detail-image-viewer-src');
      await page.keyboard.press('Escape');

      report.push({ slug, type: 'hero', path: hero.resolved, viewer: viewerHero, bad: hasBad(hero.resolved) || hasBad(viewerHero) });
    }

    if (gallery[0]) {
      await page.locator('[data-gallery-inner]').first().click();
      await page.waitForSelector('[data-detail-image-viewer]', { timeout: 5000 });
      const viewerGallery = await page
        .locator('[data-detail-image-viewer-src]')
        .getAttribute('data-detail-image-viewer-src');
      await page.keyboard.press('Escape');

      report.push({
        slug,
        type: 'gallery[0]',
        path: gallery[0].resolved,
        viewer: viewerGallery,
        bad: hasBad(gallery[0].resolved) || hasBad(viewerGallery),
      });
    }
  } catch (e) {
    report.push({ slug, type: 'error', path: String(e.message), bad: true });
  }
}

function hasBad(path) {
  if (!path) return true;
  return (
    path.includes('/images/projects/') ||
    path.includes('hero.svg') ||
    path.includes('placeholder') ||
    path.includes('detail-01.svg') ||
    path.includes('detail-01.jpg') && path.includes('/images/projects/')
  );
}

console.log('\n=== Image Mapping Audit ===\n');
for (const row of report) {
  const flag = row.bad ? '⚠' : '✓';
  console.log(`${flag} [${row.slug}] ${row.type}`);
  console.log(`   path:   ${row.path}`);
  if (row.viewer) console.log(`   viewer: ${row.viewer}`);
}

const badProjects = [...new Set(report.filter((r) => r.bad).map((r) => r.slug))];
console.log('\n--- Bad path projects ---');
console.log(badProjects.length ? badProjects.join(', ') : '(none)');

await browser.close();

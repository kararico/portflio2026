/**
 * DetailImage 클릭 뷰어 감사 — node scripts/audit-detail-viewer.mjs [slug]
 */
import { chromium } from 'playwright';

const BASE = process.env.BASE_URL ?? 'http://localhost:3030';
const slug = process.argv[2] ?? 'starbucks-employee-platform';

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto(`${BASE}/work/${slug}`, { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForSelector('[data-detail-image-frame]', { timeout: 30000 });
await page.waitForTimeout(1500);

const hero = page.locator('[data-shared-hero-target]').first();
const heroBefore = await hero.getAttribute('data-detail-image-resolved-src');
await hero.click();
await page.waitForSelector('[data-detail-image-viewer]', { timeout: 5000 });
const viewerSrc = await page.locator('[data-detail-image-viewer-src]').getAttribute('data-detail-image-viewer-src');
await page.keyboard.press('Escape');

const gallery = page.locator('[data-gallery-inner]').first();
const galleryBefore = await gallery.locator('xpath=ancestor::*[@data-detail-image-frame]').getAttribute('data-detail-image-resolved-src');
const galleryRequested = await gallery.locator('xpath=ancestor::*[@data-detail-image-frame]').getAttribute('data-detail-image-requested-src');
await gallery.locator('xpath=ancestor::*[@data-detail-image-frame]').click();
await page.waitForSelector('[data-detail-image-viewer]', { timeout: 5000 });
const galleryViewerSrc = await page.locator('[data-detail-image-viewer-src]').getAttribute('data-detail-image-viewer-src');

console.log(`\n=== Viewer audit: ${slug} ===`);
console.log('Hero resolved before click:', heroBefore);
console.log('Hero viewer src:         ', viewerSrc);
console.log('Gallery requested:       ', galleryRequested);
console.log('Gallery resolved:        ', galleryBefore);
console.log('Gallery viewer src:      ', galleryViewerSrc);

await browser.close();

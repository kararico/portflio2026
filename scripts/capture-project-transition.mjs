/**
 * Gallery → Detail / Detail → Back 전환 캡처
 * node scripts/capture-project-transition.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'docs', 'screenshots', 'project-transition');
const URL = 'http://localhost:3030/';

async function waitForServer(page, retries = 30) {
  for (let i = 0; i < retries; i += 1) {
    try {
      await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 4000 });
      return;
    } catch {
      await page.waitForTimeout(1000);
    }
  }
  throw new Error('Dev server not ready at localhost:3030');
}

async function scrollToVisibleGallery(page) {
  for (let step = 0; step < 40; step += 1) {
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(120);

    const visible = await page.evaluate(() => {
      const items = [...document.querySelectorAll('[data-intro-gallery] [data-gallery-item]')];
      return items.some((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top > 80 && rect.top < 650 && rect.height > 40;
      });
    });

    if (visible) return;
  }
  throw new Error('Gallery not visible after scroll');
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: OUT, size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();

  await waitForServer(page);
  await page.waitForSelector('[data-intro-gallery] [data-gallery-item]', { timeout: 20000 });
  await page.waitForTimeout(2000);

  await scrollToVisibleGallery(page);
  await page.screenshot({ path: path.join(OUT, 'local-01-gallery-before-click.png'), fullPage: false });

  const thumb = page.locator('[data-intro-gallery] [data-gallery-item][data-project-slug="mlb-korea"]');
  await thumb.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const box = await thumb.boundingBox();
  if (!box) throw new Error('MLB Korea thumbnail not found');

  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(250);
  await thumb.click();
  await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(OUT, 'local-02-transition-start.png'), fullPage: false });

  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(OUT, 'local-03-transition-mid.png'), fullPage: false });

  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(OUT, 'local-04-transition-end.png'), fullPage: false });

  await page.waitForSelector('[data-work-detail]', { timeout: 20000 });
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(OUT, 'local-05-detail-hero.png'), fullPage: false });

  const scrollY = await page.evaluate(() => window.scrollY);
  fs.writeFileSync(path.join(OUT, 'local-scroll-after-enter.json'), JSON.stringify({ window: scrollY }, null, 2));

  await page.locator('.backLink, [data-detail-hero-reveal]').first().click();
  await page.waitForTimeout(250);
  await page.screenshot({ path: path.join(OUT, 'local-06-back-transition-start.png'), fullPage: false });

  await page.waitForTimeout(1600);
  await page.screenshot({ path: path.join(OUT, 'local-07-back-transition-end.png'), fullPage: false });

  await page.waitForSelector('[data-intro-gallery]', { timeout: 20000 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, 'local-08-gallery-restored.png'), fullPage: false });

  const scrollBack = await page.evaluate(() => window.scrollY);
  fs.writeFileSync(
    path.join(OUT, 'local-scroll-after-back.json'),
    JSON.stringify({ window: scrollBack }, null, 2),
  );

  await context.close();
  await browser.close();

  const videos = fs.readdirSync(OUT).filter((f) => f.endsWith('.webm') && !f.startsWith('local-'));
  for (const video of videos) {
    const target = path.join(OUT, 'local-transition-demo.webm');
    if (fs.existsSync(target)) fs.unlinkSync(target);
    fs.renameSync(path.join(OUT, video), target);
    console.log('✓ local-transition-demo.webm');
    break;
  }

  console.log(`Saved to ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

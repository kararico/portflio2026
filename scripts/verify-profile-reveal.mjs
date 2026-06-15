/**
 * Profile section reveal verification.
 * Usage: node scripts/verify-profile-reveal.mjs [baseUrl]
 */
import { chromium, devices } from 'playwright';

const baseUrl = process.argv[2] ?? 'http://localhost:3030';

async function readProfileState(page) {
  return page.evaluate(() => {
    const title = document.querySelector('[data-about-reveal="title"]');
    const descriptions = document.querySelectorAll('[data-about-reveal="description"]');
    const imageReveal = document.querySelector('[data-about-image-reveal]');
    const imageMedia = document.querySelector('[data-about-image-media]');
    const meta = document.querySelectorAll('[data-about-reveal="meta"]');
    const profileRow = document.querySelector('[data-about-profile-row]');

    const styleOf = (el) => {
      if (!el) return null;
      const s = getComputedStyle(el);
      const m = new DOMMatrixReadOnly(s.transform);
      return {
        opacity: parseFloat(s.opacity),
        translateY: Math.round(m.m42),
      };
    };

    return {
      scrollY: window.scrollY,
      profileRowTop: profileRow?.getBoundingClientRect().top ?? null,
      title: styleOf(title),
      descriptions: Array.from(descriptions).map((el) => styleOf(el)),
      image: styleOf(imageReveal),
      imageScale: imageMedia
        ? (() => {
            const m = new DOMMatrixReadOnly(getComputedStyle(imageMedia).transform);
            return Math.round(m.a * 1000) / 1000;
          })()
        : null,
      meta: Array.from(meta).map((el) => styleOf(el)),
    };
  });
}

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    ...devices['iPhone 13'],
    hasTouch: true,
  });
  const page = await context.newPage();

  await page.goto(baseUrl, { waitUntil: 'networkidle', timeout: 60_000 });
  await page.waitForTimeout(1500);

  const before = await readProfileState(page);
  console.log('--- Before scroll (profile hidden) ---');
  console.log(JSON.stringify(before, null, 2));

  for (let y = 0; y <= 3600; y += 80) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
    await page.waitForTimeout(40);
  }

  await page.waitForTimeout(1200);

  const after = await readProfileState(page);
  console.log('--- After scroll (profile revealed) ---');
  console.log(JSON.stringify(after, null, 2));

  const ok =
    (before.title?.opacity ?? 1) < 0.5 &&
    (after.title?.opacity ?? 0) > 0.9 &&
    (after.title?.translateY ?? 99) < 5 &&
    (after.image?.opacity ?? 0) > 0.9 &&
    (after.imageScale ?? 0) >= 0.995 &&
    (after.meta?.[0]?.opacity ?? 0) > 0.9;

  console.log('\n=== Result ===');
  console.log(ok ? 'PASS: Profile fade-up sequence works' : 'FAIL: Profile reveal incorrect');

  await browser.close();
  process.exit(ok ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

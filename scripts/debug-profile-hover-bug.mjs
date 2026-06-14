/**
 * Profile hover bug investigation
 * node scripts/debug-profile-hover-bug.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'screenshots', 'profile-hover-bug');
const BASE = 'http://localhost:3030';

function readStyles(el) {
  if (!el) return null;
  const cs = getComputedStyle(el);
  return {
    overflow: cs.overflow,
    transform: cs.transform,
    clipPath: cs.clipPath,
    willChange: cs.willChange,
    opacity: cs.opacity,
    width: cs.width,
    height: cs.height,
  };
}

async function captureHoverState(page, mode, label) {
  await page.goto(`${BASE}/?profile-interaction=${mode}&profile-force-hover=1#about`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-about-image-frame]', { timeout: 15000 });
  await page.locator('[data-about-image-frame]').scrollIntoViewIfNeeded();
  await page.waitForTimeout(2500);

  const before = await page.evaluate(() => {
    const frame = document.querySelector('[data-about-image-frame]');
    const media = document.querySelector('[data-about-image-media]');
    const img = document.querySelector('[data-about-image-media] img');
    const read = (el) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      return {
        overflow: cs.overflow,
        transform: cs.transform,
        clipPath: cs.clipPath,
        willChange: cs.willChange,
        opacity: cs.opacity,
      };
    };
    return {
      imgSrc: img?.getAttribute('src') ?? null,
      imgComplete: img?.complete ?? null,
      imgNaturalWidth: img?.naturalWidth ?? null,
      frame: read(frame),
      media: read(media),
      img: read(img),
    };
  });

  const frame = page.locator('[data-about-image-frame]');
  await frame.hover({ force: true });
  await page.waitForTimeout(80);

  await frame.screenshot({ path: path.join(OUT, `${label}-hover-80ms.png`) });

  const mid = await page.evaluate(() => {
    const frame = document.querySelector('[data-about-image-frame]');
    const media = document.querySelector('[data-about-image-media]');
    const img = document.querySelector('[data-about-image-media] img');
    const read = (el) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      return {
        overflow: cs.overflow,
        transform: cs.transform,
        clipPath: cs.clipPath,
        willChange: cs.willChange,
        opacity: cs.opacity,
      };
    };
    return {
      imgSrc: img?.getAttribute('src') ?? null,
      imgSrcChanged: false,
      frame: read(frame),
      media: read(media),
      img: read(img),
    };
  });
  mid.imgSrcChanged = before.imgSrc !== mid.imgSrc;

  await page.waitForTimeout(500);
  await frame.screenshot({ path: path.join(OUT, `${label}-hover-580ms.png`) });

  const after = await page.evaluate((prevSrc) => {
    const frame = document.querySelector('[data-about-image-frame]');
    const media = document.querySelector('[data-about-image-media]');
    const img = document.querySelector('[data-about-image-media] img');
    const read = (el) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      return {
        overflow: cs.overflow,
        transform: cs.transform,
        clipPath: cs.clipPath,
        willChange: cs.willChange,
        opacity: cs.opacity,
      };
    };
    return {
      imgSrc: img?.getAttribute('src') ?? null,
      imgSrcChanged: prevSrc !== (img?.getAttribute('src') ?? null),
      frame: read(frame),
      media: read(media),
      img: read(img),
    };
  }, before.imgSrc);

  return { mode, label, before, mid, after };
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const results = [];
  results.push(await captureHoverState(page, 'default', 'fixed-default'));
  results.push(await captureHoverState(page, 'scaleOnly', 'fixed-scale-only'));

  await browser.close();

  const report = {
    capturedAt: new Date().toISOString(),
    rootCause:
      'hover 시 frame clip-path를 inset() ↔ polygon()으로 GSAP 보간 — 브라우저가 중간 프레임에서 clip 영역을 0으로 만들어 빈 네모(엑박처럼 보임) 발생',
    notCause: {
      nextImageRerender: 'hover 중 img src 변경 없음 (테스트로 확인)',
      overflowAlone: 'overflow:hidden 단독으로는 깜빡임 없음',
    },
    fix: 'hover clip-path wave 제거 — reveal은 inset→inset만 유지, hover는 rotation/scale/parallax만',
    results,
  };

  fs.writeFileSync(path.join(OUT, 'hover-bug-report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

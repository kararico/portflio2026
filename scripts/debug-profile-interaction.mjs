/**
 * Profile hover transform 디버그 + A/B 캡처
 * node scripts/debug-profile-interaction.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs', 'screenshots', 'profile-debug');
const BASE = 'http://localhost:3030';

function parseMatrix(transform) {
  if (!transform || transform === 'none') {
    return { translateX: 0, translateY: 0, scaleX: 1, scaleY: 1, rotation: 0 };
  }
  const match = transform.match(/matrix\(([^)]+)\)/);
  if (!match) return { translateX: 0, translateY: 0, scaleX: 1, scaleY: 1, rotation: 0 };
  const [a, b, c, d, tx, ty] = match[1].split(',').map((v) => parseFloat(v.trim()));
  const scaleX = Math.sqrt(a * a + b * b);
  const rotation = Math.atan2(b, a) * (180 / Math.PI);
  return {
    translateX: Math.round(tx * 100) / 100,
    translateY: Math.round(ty * 100) / 100,
    scaleX: Math.round(scaleX * 1000) / 1000,
    scaleY: Math.round(Math.sqrt(c * c + d * d) * 1000) / 1000,
    rotation: Math.round(rotation * 100) / 100,
  };
}

async function probeHover(page, mode) {
  await page.goto(`${BASE}/?profile-interaction=${mode}&profile-force-hover=1#about`, {
    waitUntil: 'networkidle',
  });
  await page.waitForSelector('[data-about-image-frame]', { timeout: 15000 });
  await page.waitForTimeout(1500);

  const frame = page.locator('[data-about-image-frame]');
  const box = await frame.boundingBox();
  if (!box) throw new Error('frame missing');

  const idle = await page.evaluate(() => {
    const frameEl = document.querySelector('[data-about-image-frame]');
    const mediaEl = document.querySelector('[data-about-image-media]');
    const frameStyle = frameEl ? getComputedStyle(frameEl) : null;
    const mediaStyle = mediaEl ? getComputedStyle(mediaEl) : null;
    return {
      frameOverflow: frameStyle?.overflow ?? null,
      frameTransform: frameStyle?.transform ?? 'none',
      mediaTransform: mediaStyle?.transform ?? 'none',
      frameClipPath: frameStyle?.clipPath ?? 'none',
    };
  });

  await frame.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2500);

  const listenerCheck = await page.evaluate(() => ({
    mode: document.querySelector('#about')?.getAttribute('data-profile-interaction'),
    force: document.querySelector('#about')?.getAttribute('data-profile-force-hover'),
    frameMode: document.querySelector('[data-about-image-frame]')?.getAttribute('data-interaction-mode'),
    hoverMq: window.matchMedia('(hover: hover)').matches,
  }));
  console.log('listenerCheck', listenerCheck);

  await frame.hover({ force: true });
  await page.waitForTimeout(500);

  const boxAfter = await frame.boundingBox();
  if (!boxAfter) throw new Error('frame missing after hover');

  await page.evaluate(
    ({ x, y }) => {
      const frameEl = document.querySelector('[data-about-image-frame]');
      if (!frameEl) return;
      frameEl.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      frameEl.dispatchEvent(
        new MouseEvent('mousemove', { clientX: x, clientY: y, bubbles: true }),
      );
    },
    { x: boxAfter.x + boxAfter.width * 0.85, y: boxAfter.y + boxAfter.height * 0.2 },
  );

  await page.waitForTimeout(1200);

  const hover = await page.evaluate(() => {
    const frameEl = document.querySelector('[data-about-image-frame]');
    const mediaEl = document.querySelector('[data-about-image-media]');
    const frameStyle = frameEl ? getComputedStyle(frameEl) : null;
    const mediaStyle = mediaEl ? getComputedStyle(mediaEl) : null;

    return {
      hoverBound: frameEl?.dataset.hoverBound ?? 'false',
      frameTransform: frameStyle?.transform ?? 'none',
      mediaTransform: mediaStyle?.transform ?? 'none',
      frameClipPath: frameStyle?.clipPath ?? 'none',
      frameOverflow: frameStyle?.overflow ?? null,
      mediaInline: mediaEl?.getAttribute('style') ?? '',
      frameInline: frameEl?.getAttribute('style') ?? '',
    };
  });

  await frame.screenshot({ path: path.join(OUT, `profile-hover-${mode}.png`) });

  return {
    mode,
    idle: {
      frame: parseMatrix(idle.frameTransform),
      media: parseMatrix(idle.mediaTransform),
      overflow: idle.frameOverflow,
    },
    hover: {
      frame: parseMatrix(hover.frameTransform),
      media: parseMatrix(hover.mediaTransform),
      overflow: hover.frameOverflow,
      clipPath: hover.frameClipPath,
      gsapFrame: hover.gsapFrame,
      gsapMedia: hover.gsapMedia,
    },
  };
}

async function recordHoverVideo(mode, filename) {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: OUT, size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();
  await page.goto(`${BASE}/?profile-interaction=${mode}&profile-force-hover=1#about`, {
    waitUntil: 'networkidle',
  });
  await page.waitForTimeout(1500);

  const box = await page.locator('[data-about-image-frame]').boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.55);
    await page.waitForTimeout(300);
    await page.mouse.move(box.x + box.width * 0.78, box.y + box.height * 0.25, { steps: 16 });
    await page.waitForTimeout(1200);
    await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.72, { steps: 16 });
    await page.waitForTimeout(1200);
  }

  await context.close();
  await browser.close();

  const webm = fs.readdirSync(OUT).find((f) => f.endsWith('.webm'));
  if (webm) {
    fs.renameSync(path.join(OUT, webm), path.join(OUT, filename));
  }
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const results = [];
  for (const mode of ['default', 'enhanced', 'scaleOnly']) {
    results.push(await probeHover(page, mode));
  }

  await browser.close();

  await recordHoverVideo('default', 'profile-hover-default.webm');
  await recordHoverVideo('enhanced', 'profile-hover-enhanced.webm');

  const report = {
    capturedAt: new Date().toISOString(),
    presets: {
      default: { parallaxMax: 8, scale: 1.03, rotation: 0.4 },
      enhanced: { parallaxMax: 18, scale: 1.06, rotation: 1.2 },
      scaleOnly: { parallaxMax: 0, scale: 1.03, rotation: 0 },
    },
    overflowNote:
      'frame overflow:hidden — scale/parallax edges intentionally crop; parallax ±18px may clip ~18px at borders',
    results,
  };

  fs.writeFileSync(path.join(OUT, 'transform-report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  console.log(`\nSaved to ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

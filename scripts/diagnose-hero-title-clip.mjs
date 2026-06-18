/** Hero title clip at rest — rect vs inset 검증 */
import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3030?heroClip=debug&heroDiag=1', {
  waitUntil: 'networkidle',
  timeout: 90000,
});
await page.waitForTimeout(4000);

const atRest = await page.evaluate(() => {
  const track = document.querySelector('[data-hero-title-front] .heroWordTrack, [data-hero-title-front] span');
  const front = document.querySelector('[data-hero-title-front]');
  const back = document.querySelector('[data-hero-title-back] span[aria-hidden]');
  return {
    phraseSample: back?.textContent?.slice(0, 40),
    clipDebug: window.__heroClipDebug,
    progress: window.__heroDiag?.progress,
  };
});

console.log('=== At rest (after preloader) ===');
console.log(JSON.stringify(atRest, null, 2));

const steps = [];
for (let i = 0; i <= 20; i++) {
  await page.mouse.wheel(0, 50);
  await page.waitForTimeout(60);
  if (i % 4 === 0) {
    steps.push(
      await page.evaluate(() => ({
        step: window.__heroDiag?.progress,
        centerT: document.querySelector('[data-home-story]')?.getAttribute('data-center-move-t'),
        clip: window.__heroClipDebug,
      })),
    );
  }
}

console.log('\n=== During scroll ===');
steps.forEach((s) => {
  const c = s.clip;
  if (!c) return;
  console.log(
    `progress=${Number(s.step).toFixed(3)} centerT=${s.centerT} inset=${JSON.stringify(c.inset)} imgH=${c.imageRect.height} visibleH=${c.visible.height}`,
  );
});

await browser.close();

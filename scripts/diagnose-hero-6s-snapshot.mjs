/**
 * Hero 6~7초 구간 — 전 요소 rect/opacity/transform 동시 로그
 * node scripts/diagnose-hero-6s-snapshot.mjs [url]
 *
 * URL에 ?heroDiag=1 필수 (homeStoryAnimation progress hook)
 */
import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

const base = (process.argv[2] ?? 'http://localhost:3030').replace(/\?.*$/, '');
const url = `${base}?heroDiag=1`;

function fmt(d) {
  if (!d?.__heroDiag) return null;
  const h = d.__heroDiag;
  const line = (key, el) => {
    if (!el) return `${key}: (missing)`;
    return [
      `${key}`,
      `top=${el.top}`,
      `bottom=${el.bottom}`,
      `opacity=${el.opacity}`,
      `vis=${el.visibility}`,
      `z=${el.zIndex}`,
      `transform=${el.transform?.slice(0, 60) ?? 'none'}`,
      el.clipPath ? `clip=${el.clipPath}` : '',
      el.plateActive ? `plateActive=${el.plateActive}` : '',
    ]
      .filter(Boolean)
      .join(' | ');
  };

  return {
    scrollY: d.scrollY,
    progress: h.progress?.toFixed(4),
    centerT: h.centerT?.toFixed(4),
    heroExited: h.heroExited,
    galleryActive: h.galleryActive,
    gallerySeqStart: h.gallerySequenceStartProgress,
    heroExitLayer: h.heroExitLayerSelector,
    centerMoveTarget: h.centerMoveTarget,
    rootGalleryActive: h.root?.galleryActive,
    rootPinned: h.root?.scenePinned,
    centerStack: line('centerStack', h.elements?.centerStack),
    heroImageLayer: line('heroImageLayer', h.elements?.heroImageLayer),
    introMedia: line('introMedia', h.elements?.introMedia),
    heroMlbImg: line('heroMlbImg', h.elements?.heroMlbImg),
    composition: line('composition', h.elements?.composition),
    titleFront: line('titleFront', h.elements?.titleFront),
    plate2: line('plate2', h.elements?.plate2),
    aboutCover: line('aboutCover', h.elements?.aboutCover),
  };
}

async function readSnap(page) {
  return page.evaluate(() => ({
    scrollY: Math.round(window.scrollY),
    __heroDiag: window.__heroDiag ?? null,
  }));
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(4000);

  const samples = [];
  const raw = [];

  // 초반 구간 촘촘히 (6~7초 ≈ 초기 스크롤 구간)
  for (let i = 0; i <= 120; i++) {
    await page.mouse.wheel(0, 45);
    await page.waitForTimeout(45);
    const d = await readSnap(page);
    raw.push(d);
    if (i % 2 === 0) {
      const f = fmt(d);
      if (f) samples.push({ step: i, ...f });
    }
  }

  // 변화 감지: progress 연속 샘플에서 galleryActive 또는 titleFront opacity 급변
  const transitions = [];
  for (let i = 1; i < raw.length; i++) {
    const prev = raw[i - 1]?.__heroDiag;
    const curr = raw[i]?.__heroDiag;
    if (!prev || !curr) continue;

    const flags = [];
    if (!prev.galleryActive && curr.galleryActive) flags.push('galleryActive: false→true');
    if (!prev.heroExited && curr.heroExited) flags.push('heroExited: false→true');
    if (prev.root?.galleryActive !== curr.root?.galleryActive) {
      flags.push(`data-gallery-active: ${prev.root?.galleryActive}→${curr.root?.galleryActive}`);
    }
    const prevImg = prev.elements?.heroMlbImg;
    const currImg = curr.elements?.heroMlbImg;
    if (prevImg && currImg) {
      if (prevImg.visibility === 'visible' && currImg.visibility === 'hidden') {
        flags.push('heroMlbImg visibility: visible→hidden');
      }
      const opPrev = parseFloat(prevImg.opacity);
      const opCurr = parseFloat(currImg.opacity);
      if (Math.abs(opPrev - opCurr) > 0.3) {
        flags.push(`heroMlbImg opacity: ${opPrev}→${opCurr}`);
      }
    }
    const prevTf = prev.elements?.titleFront;
    const currTf = curr.elements?.titleFront;
    if (prevTf && currTf) {
      const opPrev = parseFloat(prevTf.opacity);
      const opCurr = parseFloat(currTf.opacity);
      if (Math.abs(opPrev - opCurr) > 0.08) {
        flags.push(`titleFront opacity: ${opPrev.toFixed(2)}→${opCurr.toFixed(2)} @ progress ${curr.progress?.toFixed(3)}`);
      }
    }
    const prevP2 = prev.elements?.plate2;
    const currP2 = curr.elements?.plate2;
    if (prevP2?.visibility === 'hidden' && currP2?.visibility === 'visible') {
      flags.push(`plate2 visible @ progress ${curr.progress?.toFixed(3)} heroBottom=${currImg?.bottom}`);
    }

    if (flags.length) {
      transitions.push({ step: i, scrollY: raw[i].scrollY, progress: curr.progress, flags, snap: fmt(raw[i]) });
    }
  }

  const outPath = 'scripts/output/hero-6s-diagnostic.json';
  writeFileSync(
    outPath,
    JSON.stringify({ url, samples, transitions, rawCount: raw.length }, null, 2),
  );

  console.log('=== heroExitLayer ===');
  console.log('Code uses: [data-hero-image-layer] (div.heroImage wrapping IntroMedia)');
  console.log('centerMove transform applied to: [data-hero-center-stack] (parent)');
  console.log('Visible MLB pixels: [data-hero-image-layer] img or [data-intro-media] img\n');

  console.log(`=== STATE TRANSITIONS (${transitions.length}) ===`);
  transitions.slice(0, 20).forEach((t) => {
    console.log(`\n--- step ${t.step} scrollY=${t.scrollY} progress=${t.progress} ---`);
    t.flags.forEach((f) => console.log('  •', f));
    if (t.snap) {
      console.log(' ', t.snap.heroMlbImg);
      console.log(' ', t.snap.heroImageLayer);
      console.log(' ', t.snap.centerStack);
      console.log(' ', t.snap.titleFront);
      console.log(' ', t.snap.plate2);
    }
  });

  console.log(`\nFull log written: ${outPath}`);
  console.log('\n=== EARLY SAMPLES (step 0-30) ===');
  samples.slice(0, 16).forEach((s) => {
    console.log(
      `\nstep ${s.step} progress=${s.progress} centerT=${s.centerT} gallery=${s.galleryActive} heroExited=${s.heroExited}`,
    );
    console.log(' ', s.heroMlbImg);
    console.log(' ', s.titleFront);
    console.log(' ', s.plate2);
  });

  await browser.close();
}

main().catch(console.error);

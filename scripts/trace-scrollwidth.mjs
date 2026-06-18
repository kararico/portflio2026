/**
 * scrollWidth 비정상 원인 추적
 */
import { chromium, devices } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:3030';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    ...devices['iPhone 13'],
    viewport: { width: 390, height: 844, deviceScaleFactor: 1 },
  });

  await page.goto(base, { waitUntil: 'networkidle', timeout: 90000 });
  await page.waitForTimeout(3500);

  const result = await page.evaluate(() => {
    const doc = document.documentElement;
    const body = document.body;
    const main = document.getElementById('main-transition');
    const heroIntro = document.querySelector('[data-home-intro]');
    const heroTitle = document.querySelector('[data-hero-title]');
    const preloader = document.querySelector('[data-preloader]');

    const dims = (el, name) => {
      if (!el) return { name, missing: true };
      return {
        name,
        scrollW: el.scrollWidth,
        clientW: el.clientWidth,
        offsetW: el.offsetWidth,
        rectW: Math.round(el.getBoundingClientRect().width),
      };
    };

    const pinSpacers = [...document.querySelectorAll('.pin-spacer')].map((el, i) => ({
      i,
      scrollW: el.scrollWidth,
      clientW: el.clientWidth,
      offsetW: el.offsetWidth,
      rect: el.getBoundingClientRect(),
    }));

    const wideScroll = [];
    document.querySelectorAll('*').forEach((el) => {
      if (el.scrollWidth > doc.clientWidth + 10) {
        wideScroll.push({
          tag: el.tagName,
          id: el.id,
          cls: typeof el.className === 'string' ? el.className.slice(0, 60) : '',
          scrollW: el.scrollWidth,
          clientW: el.clientWidth,
          data: el.getAttribute('data-home-intro') !== null ? 'home-intro' : el.getAttribute('data-hero-title') !== null ? 'hero-title' : '',
        });
      }
    });
    wideScroll.sort((a, b) => b.scrollW - a.scrollW);

    return {
      html: dims(doc, 'html'),
      body: dims(body, 'body'),
      main: dims(main, 'main-transition'),
      heroIntro: dims(heroIntro, 'heroIntro'),
      heroTitle: heroTitle
        ? {
            scrollW: heroTitle.scrollWidth,
            clientW: heroTitle.clientWidth,
            css: {
              width: getComputedStyle(heroTitle).width,
              left: getComputedStyle(heroTitle).left,
            },
            rect: heroTitle.getBoundingClientRect(),
          }
        : null,
      preloader: preloader ? 'present' : 'gone',
      pinSpacers: pinSpacers.slice(0, 5),
      pinSpacerCount: pinSpacers.length,
      wideScrollTop15: wideScroll.slice(0, 15),
    };
  });

  console.log(JSON.stringify(result, null, 2));

  // During preloader
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(150);
  const duringPreloader = await page.evaluate(() => ({
    preloaderActive: document.documentElement.hasAttribute('data-preloader-active'),
    preloader: !!document.querySelector('[data-preloader]'),
    mainVis: getComputedStyle(document.getElementById('main-transition')).visibility,
    scrollW: document.documentElement.scrollWidth,
    heroIntroRect: document.querySelector('[data-home-intro]')?.getBoundingClientRect(),
    heroTitleRect: document.querySelector('[data-hero-title]')?.getBoundingClientRect(),
    heroImageRect: document.querySelector('[data-hero-image-layer]')?.getBoundingClientRect(),
  }));
  console.log('\n=== During preloader (reload +150ms) ===');
  console.log(JSON.stringify(duringPreloader, null, 2));

  await browser.close();
}

main();

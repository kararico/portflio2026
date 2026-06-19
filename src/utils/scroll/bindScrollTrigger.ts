import type Lenis from 'lenis';
import { gsap, ScrollTrigger } from '@/utils/gsap/registerGsap';
import { refreshScrollTrigger, refreshScrollTriggerDelayed } from '@/animations/scrollTriggerRefresh';
import { isTouchDevice } from './scrollEnvironment';
import { syncViewportWidth } from '@/utils/viewport/syncViewportWidth';
import { heroStoryConfig } from '@/data/heroStory';

let refreshDebounceId = 0;

function debouncedRefresh(ms = 200): void {
  window.clearTimeout(refreshDebounceId);
  refreshDebounceId = window.setTimeout(() => refreshScrollTrigger(), ms);
}

/** 모바일 Gallery reveal 중 — full refresh 대신 layout update만 */
function isMobileGalleryRevealInProgress(): boolean {
  if (!isTouchDevice()) return false;
  if (!heroStoryConfig.mobileGalleryReveal.skipViewportRefreshDuringReveal) return false;

  const homeStory = document.querySelector('[data-home-story]');
  if (!homeStory) return false;

  return (
    homeStory.getAttribute('data-gallery-active') === 'true' ||
    homeStory.getAttribute('data-gallery-pre-reveal') === 'true'
  );
}

function onHardViewportChange(): void {
  syncViewportWidth();
  debouncedRefresh(heroStoryConfig.mobileGalleryReveal.viewportRefreshDebounceMs);
}

function onSoftViewportChange(): void {
  syncViewportWidth();
  if (isMobileGalleryRevealInProgress()) {
    ScrollTrigger.update();
    return;
  }
  debouncedRefresh(heroStoryConfig.mobileGalleryReveal.viewportRefreshDebounceMs);
}

function scheduleMobileRefreshes(): void {
  refreshScrollTriggerDelayed(100);
  refreshScrollTriggerDelayed(500);

  if (typeof document !== 'undefined' && document.fonts?.ready) {
    void document.fonts.ready.then(() => refreshScrollTrigger(true));
  }

  window.addEventListener(
    'load',
    () => refreshScrollTriggerDelayed(120),
    { once: true },
  );
}

function bindScrollPositionPoll(): () => void {
  let lastY = -1;

  const poll = () => {
    const y = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
    if (y !== lastY) {
      lastY = y;
      ScrollTrigger.update();
    }
  };

  gsap.ticker.add(poll);

  return () => {
    gsap.ticker.remove(poll);
  };
}

function bindFirstInteractionRefresh(): () => void {
  let refreshed = false;

  const refreshOnce = () => {
    if (refreshed) return;
    refreshed = true;
    refreshScrollTrigger(true);
    window.removeEventListener('touchstart', refreshOnce, true);
    window.removeEventListener('scroll', refreshOnce, true);
    window.removeEventListener('wheel', refreshOnce, true);
  };

  window.addEventListener('touchstart', refreshOnce, { capture: true, passive: true });
  window.addEventListener('scroll', refreshOnce, { capture: true, passive: true });
  window.addEventListener('wheel', refreshOnce, { capture: true, passive: true });

  return () => {
    window.removeEventListener('touchstart', refreshOnce, true);
    window.removeEventListener('scroll', refreshOnce, true);
    window.removeEventListener('wheel', refreshOnce, true);
  };
}

/** Lenis 없이 window 네이티브 스크롤 ↔ ScrollTrigger */
export function bindNativeScrollToScrollTrigger(): () => void {
  // 모바일은 CSS sticky — normalizeScroll은 pin용이라 터치 스크롤과 충돌함

  const onScroll = () => ScrollTrigger.update();
  window.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('scroll', onScroll, { passive: true });

  const onViewportChange = () => onHardViewportChange();
  window.addEventListener('resize', onViewportChange);
  window.addEventListener('orientationchange', onViewportChange);

  const vv = window.visualViewport;
  if (vv) {
    vv.addEventListener('resize', onSoftViewportChange);
    if (isTouchDevice()) {
      vv.addEventListener('scroll', onSoftViewportChange);
    }
  }

  const onPageShow = (event: PageTransitionEvent) => {
    if (event.persisted) refreshScrollTrigger(true);
  };
  window.addEventListener('pageshow', onPageShow);

  const unbindPoll = isTouchDevice() ? bindScrollPositionPoll() : () => {};
  const unbindFirstInteraction = bindFirstInteractionRefresh();

  scheduleMobileRefreshes();

  return () => {
    window.removeEventListener('scroll', onScroll);
    document.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onViewportChange);
    window.removeEventListener('orientationchange', onViewportChange);
    window.removeEventListener('pageshow', onPageShow);
    if (vv) {
      vv.removeEventListener('resize', onSoftViewportChange);
      if (isTouchDevice()) {
        vv.removeEventListener('scroll', onSoftViewportChange);
      }
    }
    unbindPoll();
    unbindFirstInteraction();
  };
}

/** Lenis ↔ ScrollTrigger 공식 연동 (데스크톱 wheel 스무스 스크롤) */
export function bindLenisToScrollTrigger(lenis: Lenis): () => void {
  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value) {
      if (arguments.length && typeof value === 'number') {
        lenis.scrollTo(value, { immediate: true });
      }
      return lenis.scroll;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
  });

  const onLenisScroll = () => ScrollTrigger.update();
  lenis.on('scroll', onLenisScroll);

  const onRefresh = () => lenis.resize();
  ScrollTrigger.addEventListener('refresh', onRefresh);

  refreshScrollTriggerDelayed(50);

  return () => {
    lenis.off('scroll', onLenisScroll);
    ScrollTrigger.removeEventListener('refresh', onRefresh);
    ScrollTrigger.scrollerProxy(document.documentElement, {});
  };
}

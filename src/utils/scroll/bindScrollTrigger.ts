import type Lenis from 'lenis';
import { ScrollTrigger } from '@/utils/gsap/registerGsap';
import { refreshScrollTrigger, refreshScrollTriggerDelayed } from '@/animations/scrollTriggerRefresh';
import { isIosLike } from './scrollEnvironment';

function scheduleMobileRefreshes(): void {
  refreshScrollTriggerDelayed(50);
  refreshScrollTriggerDelayed(250);
  refreshScrollTriggerDelayed(600);

  if (typeof document !== 'undefined' && document.fonts?.ready) {
    void document.fonts.ready.then(() => refreshScrollTrigger(true));
  }

  window.addEventListener(
    'load',
    () => refreshScrollTriggerDelayed(120),
    { once: true },
  );
}

/** Lenis 없이 window 네이티브 스크롤 ↔ ScrollTrigger */
export function bindNativeScrollToScrollTrigger(): () => void {
  if (isIosLike()) {
    ScrollTrigger.normalizeScroll(true);
  }

  const onScroll = () => ScrollTrigger.update();
  window.addEventListener('scroll', onScroll, { passive: true });

  const onViewportChange = () => refreshScrollTrigger();
  window.addEventListener('resize', onViewportChange);
  window.addEventListener('orientationchange', onViewportChange);

  const vv = window.visualViewport;
  if (vv) {
    vv.addEventListener('resize', onViewportChange);
    vv.addEventListener('scroll', onViewportChange);
  }

  const onPageShow = (event: PageTransitionEvent) => {
    if (event.persisted) refreshScrollTrigger(true);
  };
  window.addEventListener('pageshow', onPageShow);

  scheduleMobileRefreshes();

  return () => {
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onViewportChange);
    window.removeEventListener('orientationchange', onViewportChange);
    window.removeEventListener('pageshow', onPageShow);
    if (vv) {
      vv.removeEventListener('resize', onViewportChange);
      vv.removeEventListener('scroll', onViewportChange);
    }
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

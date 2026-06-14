import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ensureNativeScrollEnvironment } from '@/utils/scroll/initNativeScroll';
import { isTouchDevice } from '@/utils/scroll/scrollEnvironment';

let registered = false;

export function registerGsapPlugins(): void {
  if (registered || typeof window === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({
    // 모바일 주소창 show/hide 시 pin 치수 재계산 (Android Chrome 포함)
    ignoreMobileResize: !isTouchDevice(),
  });

  registered = true;

  // HomeStory useLayoutEffect보다 먼저 네이티브 스크롤 ↔ ScrollTrigger 연결
  ensureNativeScrollEnvironment();
}

export { gsap, ScrollTrigger };

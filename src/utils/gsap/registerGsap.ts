import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ensureNativeScrollEnvironment } from '@/utils/scroll/initNativeScroll';

let registered = false;

export function registerGsapPlugins(): void {
  if (registered || typeof window === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({
    ignoreMobileResize: true,
  });

  registered = true;

  // HomeStory useLayoutEffect보다 먼저 네이티브 스크롤 ↔ ScrollTrigger 연결
  ensureNativeScrollEnvironment();
}

export { gsap, ScrollTrigger };

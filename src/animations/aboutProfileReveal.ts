import { gsap, ScrollTrigger } from '@/utils/gsap/registerGsap';
import { heroStoryConfig } from '@/data/heroStory';

export const ABOUT_PROFILE_REVEAL_EVENT = 'about-profile-reveal';

let homeStoryRevealHandler: (() => void) | null = null;

export function isAboutInHomeStory(root: HTMLElement): boolean {
  return Boolean(root.closest('[data-home-story]'));
}

function getHeroPinEnd(): string {
  const mobile = window.matchMedia('(max-width: 767px)').matches;
  const vh = mobile ? heroStoryConfig.pinScrollVh.mobile : heroStoryConfig.pinScrollVh.desktop;
  return `+=${vh}%`;
}

/** aboutCover 슬라이드가 절반쯤 올라온 Hero pin progress */
export function getAboutProfileRevealProgress(): number {
  const { start, end } = heroStoryConfig.scrollPhases.aboutCover;
  return start + (end - start) * 0.42;
}

export function dispatchAboutProfileReveal(): void {
  window.dispatchEvent(new CustomEvent(ABOUT_PROFILE_REVEAL_EVENT));
}

/** HomeStory scrub 타임라인에서 동일한 reveal 콜백 호출 */
export function notifyAboutProfileRevealFromTimeline(): void {
  homeStoryRevealHandler?.();
}

export function bindHomeStoryProfileReveal(
  root: HTMLElement,
  onReveal: () => void,
): () => void {
  const heroSection = root
    .closest('[data-home-story]')
    ?.querySelector<HTMLElement>('[data-home-intro]');

  if (!heroSection) return () => undefined;

  const profileRow = root.querySelector<HTMLElement>('[data-about-profile-row]');
  const imageReveal = root.querySelector<HTMLElement>('[data-about-image-reveal]');
  let revealed = false;
  const threshold = getAboutProfileRevealProgress();

  const fireReveal = () => {
    if (revealed) return;
    revealed = true;
    onReveal();
  };

  homeStoryRevealHandler = fireReveal;

  const isProfileRowVisible = () => {
    if (!profileRow) return false;
    const rect = profileRow.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
  };

  let rowSt: ScrollTrigger | undefined;

  const heroSt = ScrollTrigger.create({
    trigger: heroSection,
    start: 'top top',
    end: getHeroPinEnd(),
    onUpdate: (self) => {
      if (self.progress >= threshold) fireReveal();
    },
  });

  const syncReveal = () => {
    if (revealed) return;
    if (heroSt.progress >= threshold) {
      fireReveal();
      return;
    }
    if (rowSt?.isActive || isProfileRowVisible()) {
      fireReveal();
    }
  };

  if (profileRow) {
    rowSt = ScrollTrigger.create({
      trigger: profileRow,
      start: 'top 92%',
      once: true,
      onEnter: fireReveal,
    });
  }

  const observerTarget = imageReveal ?? profileRow;
  let intersectionObserver: IntersectionObserver | undefined;
  if (observerTarget && typeof IntersectionObserver !== 'undefined') {
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.12)) {
          fireReveal();
        }
      },
      { threshold: [0, 0.12, 0.25] },
    );
    intersectionObserver.observe(observerTarget);
  }

  ScrollTrigger.addEventListener('refresh', syncReveal);

  const tickerSync = () => {
    if (revealed) {
      gsap.ticker.remove(tickerSync);
      return;
    }
    syncReveal();
  };
  gsap.ticker.add(tickerSync);

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
    syncReveal();
  });

  return () => {
    if (homeStoryRevealHandler === fireReveal) {
      homeStoryRevealHandler = null;
    }
    gsap.ticker.remove(tickerSync);
    heroSt?.kill();
    rowSt?.kill();
    intersectionObserver?.disconnect();
    ScrollTrigger.removeEventListener('refresh', syncReveal);
  };
}

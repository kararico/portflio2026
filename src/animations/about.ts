import { gsap } from '@/utils/gsap/registerGsap';
import { registerGsapPlugins, ScrollTrigger } from '@/utils/gsap/registerGsap';
import { refreshScrollTrigger } from '@/animations/scrollTriggerRefresh';
import { dispatchAboutProfileReveal } from '@/animations/aboutProfileReveal';
import { initProfileImageReveal } from '@/animations/profileImage';
import type { ProfileInteractionMode } from '@/utils/profileImageConfig';

const PROFILE_REVEAL_START = 'top 82%';
const SELECTED_PROJECTS_START = 'top 90%';
const REVEAL_Y = 36;
const META_REVEAL_Y = 32;
const IMAGE_SCALE_FROM = 1.03;

function resolveMode(root: HTMLElement): ProfileInteractionMode {
  const mode = root.dataset.profileInteraction;
  if (mode === 'enhanced' || mode === 'scaleOnly') return mode;
  return 'default';
}

function setProfileRevealInitialState(root: HTMLElement): void {
  const title = root.querySelector('[data-about-reveal="title"]');
  const descriptions = root.querySelectorAll('[data-about-reveal="description"]');
  const imageReveal = root.querySelector('[data-about-image-reveal]');
  const imageMedia = root.querySelector('[data-about-image-media]');
  const meta = root.querySelectorAll('[data-about-reveal="meta"]');

  if (title) gsap.set(title, { opacity: 0, y: REVEAL_Y });
  if (descriptions.length) gsap.set(descriptions, { opacity: 0, y: REVEAL_Y });
  if (imageReveal) gsap.set(imageReveal, { opacity: 0, y: REVEAL_Y });
  if (imageMedia) gsap.set(imageMedia, { scale: IMAGE_SCALE_FROM, transformOrigin: 'center center' });
  if (meta.length) gsap.set(meta, { opacity: 0, y: META_REVEAL_Y });
}

function playProfileRevealSequence(root: HTMLElement): gsap.core.Timeline {
  const title = root.querySelector('[data-about-reveal="title"]');
  const descriptions = root.querySelectorAll('[data-about-reveal="description"]');
  const imageReveal = root.querySelector('[data-about-image-reveal]');
  const imageMedia = root.querySelector('[data-about-image-media]');
  const meta = root.querySelectorAll('[data-about-reveal="meta"]');

  const tl = gsap.timeline({
    onComplete: () => dispatchAboutProfileReveal(),
  });

  if (title) {
    tl.to(title, {
      opacity: 1,
      y: 0,
      duration: 0.72,
      ease: 'power2.out',
    });
  }

  if (descriptions.length) {
    tl.to(
      descriptions,
      {
        opacity: 1,
        y: 0,
        duration: 0.68,
        stagger: 0.1,
        ease: 'power2.out',
      },
      title ? '-=0.38' : 0,
    );
  }

  if (imageReveal) {
    tl.to(
      imageReveal,
      {
        opacity: 1,
        y: 0,
        duration: 0.78,
        ease: 'power2.out',
      },
      descriptions.length ? '-=0.18' : '-=0.2',
    );
  }

  if (imageMedia) {
    tl.to(
      imageMedia,
      {
        scale: 1,
        duration: 0.85,
        ease: 'power2.out',
      },
      imageReveal ? '<' : 0,
    );
  }

  if (meta.length) {
    tl.to(
      meta,
      {
        opacity: 1,
        y: 0,
        duration: 0.62,
        stagger: 0.07,
        ease: 'power2.out',
      },
      '-=0.42',
    );
  }

  return tl;
}

/** Profile row viewport 진입 reveal — gsap.context 밖에서 등록 (Hero cover transform 구간 대응) */
export function bindProfileSectionReveal(root: HTMLElement): () => void {
  registerGsapPlugins();

  const profileRow = root.querySelector('[data-about-profile-row]');
  if (!profileRow) return () => undefined;

  setProfileRevealInitialState(root);

  let revealed = false;
  let timeline: gsap.core.Timeline | null = null;

  const reveal = () => {
    if (revealed) return;
    revealed = true;
    timeline = playProfileRevealSequence(root);
  };

  const shouldReveal = () => {
    const rect = profileRow.getBoundingClientRect();
    const enterLine = window.innerHeight * 0.82;
    return rect.top <= enterLine && rect.bottom > 0;
  };

  const profileSt = ScrollTrigger.create({
    trigger: profileRow,
    start: PROFILE_REVEAL_START,
    once: true,
    onEnter: reveal,
  });

  const onScroll = () => {
    if (shouldReveal()) reveal();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  let profileObserver: IntersectionObserver | undefined;
  if (typeof IntersectionObserver !== 'undefined') {
    profileObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.boundingClientRect.top <= window.innerHeight * 0.82) {
            reveal();
            break;
          }
        }
      },
      { threshold: [0, 0.05, 0.12, 0.2, 0.35] },
    );
    profileObserver.observe(profileRow);
  }

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
    if (profileSt.isActive || shouldReveal()) reveal();
  });

  return () => {
    profileSt.kill();
    profileObserver?.disconnect();
    window.removeEventListener('scroll', onScroll);
    timeline?.kill();
  };
}

/** Selected Projects — viewport 진입 즉시 순차 등장 */
export function bindSelectedProjectsAnimation(root: HTMLElement): () => void {
  registerGsapPlugins();

  const selectedBlock = root.querySelector('[data-about-selected]');
  const selectedLabel = root.querySelector('[data-about-selected-label]');
  const projectEntries = root.querySelectorAll('[data-about-project-entry]');
  const viewAll = root.querySelector('[data-about-view-all]');

  if (!selectedBlock) return () => undefined;

  gsap.set(selectedLabel, { opacity: 0, x: -40 });
  gsap.set(projectEntries, { opacity: 0, x: -40 });
  if (viewAll) gsap.set(viewAll, { opacity: 0, x: -40 });

  let played = false;
  let timeline: gsap.core.Timeline | null = null;

  const play = () => {
    if (played) return;
    played = true;

    timeline = gsap.timeline();

    if (selectedLabel) {
      timeline.to(selectedLabel, {
        opacity: 1,
        x: 0,
        duration: 0.75,
        ease: 'power2.out',
      });
    }

    if (projectEntries.length) {
      timeline.to(
        projectEntries,
        {
          opacity: 1,
          x: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power2.out',
        },
        selectedLabel ? '-=0.35' : 0,
      );
    }

    if (viewAll) {
      timeline.to(
        viewAll,
        {
          opacity: 1,
          x: 0,
          duration: 0.75,
          ease: 'power2.out',
        },
        '-=0.55',
      );
    }
  };

  const shouldPlay = () => {
    const rect = selectedBlock.getBoundingClientRect();
    return rect.top <= window.innerHeight * 0.9 && rect.bottom > 0;
  };

  const selectedSt = ScrollTrigger.create({
    trigger: selectedBlock,
    start: SELECTED_PROJECTS_START,
    once: true,
    onEnter: play,
  });

  const onScroll = () => {
    if (shouldPlay()) play();
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
    if (selectedSt.isActive || shouldPlay()) play();
  });

  return () => {
    selectedSt.kill();
    window.removeEventListener('scroll', onScroll);
    timeline?.kill();
  };
}

/** 배경 PROFILE 타이포 — 스크롤 패럴랙스 */
export function bindBackgroundTypeParallax(root: HTMLElement): () => void {
  registerGsapPlugins();

  const typeWord = root.querySelector('[data-about-type-word]');
  if (!typeWord) return () => undefined;

  return bindBackgroundTypeParallaxTween(root, typeWord);
}

function bindBackgroundTypeParallaxTween(root: HTMLElement, typeWord: Element): () => void {
  gsap.set(typeWord, { x: 0, opacity: 0.08 });

  const tween = gsap.to(typeWord, {
    x: -300,
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: root,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}

export function initAboutAnimation(root: HTMLElement): gsap.Context {
  registerGsapPlugins();

  return gsap.context((self) => {
    const mode = resolveMode(root);

    self.add(initProfileImageReveal(root, mode, { manual: true }));
    refreshScrollTrigger();
  }, root);
}

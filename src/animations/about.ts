import { gsap } from '@/utils/gsap/registerGsap';
import { registerGsapPlugins, ScrollTrigger } from '@/utils/gsap/registerGsap';
import { refreshScrollTrigger } from '@/animations/scrollTriggerRefresh';
import {
  bindHomeStoryProfileReveal,
  dispatchAboutProfileReveal,
  isAboutInHomeStory,
} from '@/animations/aboutProfileReveal';
import { initProfileImageReveal } from '@/animations/profileImage';
import type { ProfileInteractionMode } from '@/utils/profileImageConfig';

/** HomeStory 밖(직접 #about 진입) fallback */
const PROFILE_FALLBACK_START = 'top bottom';

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function resolveMode(root: HTMLElement): ProfileInteractionMode {
  const mode = root.dataset.profileInteraction;
  if (mode === 'enhanced' || mode === 'scaleOnly') return mode;
  return 'default';
}

function isProfileSectionVisible(root: HTMLElement): boolean {
  const profileRow = root.querySelector('[data-about-profile-row]');
  if (!profileRow) return false;

  const rect = profileRow.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
}

function playProfileRevealIfVisible(
  root: HTMLElement,
  onReveal: () => void,
  isRevealed: () => boolean,
): void {
  if (isRevealed() || prefersReducedMotion()) return;
  if (isProfileSectionVisible(root)) onReveal();
}

export function initAboutAnimation(root: HTMLElement): gsap.Context {
  registerGsapPlugins();

  return gsap.context((self) => {
    const reduced = prefersReducedMotion();
    const mode = resolveMode(root);
    const inHomeStory = isAboutInHomeStory(root);
    const typeWord = root.querySelector('[data-about-type-word]');
    const profileRow = root.querySelector('[data-about-profile-row]');
    const selectedBlock = root.querySelector('[data-about-selected]');

    let profileRevealed = false;

    const playProfileReveal = () => {
      if (profileRevealed || reduced) return;
      profileRevealed = true;

      if (profileRow) {
        const profileTargets = profileRow.querySelectorAll('[data-about-reveal]');
        gsap.from(profileTargets, {
          opacity: 0,
          y: 24,
          duration: 0.75,
          stagger: 0.08,
          ease: 'power2.out',
        });
      }

      const imageReveal = root.querySelector<HTMLElement>('[data-about-image-reveal]');
      if (imageReveal) {
        gsap.fromTo(
          imageReveal,
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
        );
      }

      dispatchAboutProfileReveal();
    };

    self.add(initProfileImageReveal(root, reduced, mode, { manual: inHomeStory }));

    if (reduced) {
      gsap.set(root.querySelectorAll('[data-about-reveal]'), { opacity: 1, y: 0 });
    } else if (inHomeStory) {
      self.add(bindHomeStoryProfileReveal(root, playProfileReveal));
    } else if (profileRow) {
      const st = ScrollTrigger.create({
        trigger: profileRow,
        start: PROFILE_FALLBACK_START,
        once: true,
        onEnter: playProfileReveal,
      });
      self.add(() => st.kill());
    }

    if (selectedBlock && !reduced) {
      const selectedTargets = selectedBlock.querySelectorAll('[data-about-reveal]');
      gsap.from(selectedTargets, {
        opacity: 0,
        y: 24,
        duration: 0.75,
        stagger: 0.06,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: selectedBlock,
          start: 'top 90%',
          once: true,
        },
      });
    }

    if (typeWord) {
      gsap.fromTo(
        typeWord,
        { y: 0 },
        {
          y: -40,
          ease: 'none',
          scrollTrigger: {
            trigger: root,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        },
      );
    }

    refreshScrollTrigger();

    if (!reduced && inHomeStory) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
          playProfileRevealIfVisible(root, playProfileReveal, () => profileRevealed);
        });
      });
    }
  }, root);
}

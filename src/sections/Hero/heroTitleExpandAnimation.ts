import { gsap } from '@/utils/gsap/registerGsap';
import { heroStoryConfig } from '@/data/heroStory';

type ExpandConfig = typeof heroStoryConfig.heroIntro.titleExpand;

const WIDTH_BUFFER_PX = 3;

function measureCharWidth(mask: HTMLElement): number {
  const inner = mask.querySelector<HTMLElement>('[data-hero-expand-char-inner]');
  if (!inner) return 0;

  const previousWidth = mask.style.width;
  mask.style.width = 'auto';
  const width = inner.getBoundingClientRect().width;
  mask.style.width = previousWidth;

  return Math.ceil(width) + WIDTH_BUFFER_PX;
}

function buildTrackExpandTimeline(track: HTMLElement, config: ExpandConfig): gsap.core.Timeline {
  const j = track.querySelector<HTMLElement>('[data-hero-expand-j]');
  const w = track.querySelector<HTMLElement>('[data-hero-expand-w]');
  const charMasks = track.querySelectorAll<HTMLElement>('[data-hero-expand-char]');

  if (!j || !w || charMasks.length === 0) {
    return gsap.timeline();
  }

  gsap.set(track, { letterSpacing: `${config.initialLetterSpacingEm}em` });
  gsap.set(charMasks, { width: 0 });
  gsap.set(w, { x: `${config.wKernEm}em` });

  const tl = gsap.timeline();

  tl.to({}, { duration: config.hold });

  tl.to(
    w,
    {
      x: 0,
      duration: config.wKernReleaseDuration,
      ease: config.revealEase,
    },
    'expand',
  );

  charMasks.forEach((mask, index) => {
    tl.fromTo(
      mask,
      { width: 0 },
      {
        width: () => measureCharWidth(mask),
        duration: config.charDuration,
        ease: config.charEase,
      },
      `expand+=${config.wKernReleaseDuration * 0.12 + index * config.charStagger}`,
    );
  });

  const expandEnd =
    config.wKernReleaseDuration * 0.12 +
    (charMasks.length - 1) * config.charStagger +
    config.charDuration;

  tl.to(
    track,
    {
      letterSpacing: `${config.finalLetterSpacingEm}em`,
      duration: config.letterSpacingDuration,
      ease: config.revealEase,
    },
    `expand+=${expandEnd * config.letterSpacingAt}`,
  );

  tl.add(
    () => {
      track.classList.add('is-expanded');
      gsap.set(w, { clearProps: 'x' });
      charMasks.forEach((mask) => {
        mask.style.overflow = 'visible';
      });
    },
    `expand+=${expandEnd * config.uppercaseAt}`,
  );

  return tl;
}

export function initHeroTitleExpandIntro(
  introTimeline: gsap.core.Timeline,
  composition: HTMLElement,
  atPosition: string | number,
): void {
  const config = heroStoryConfig.heroIntro.titleExpand;
  const tracks = composition.querySelectorAll<HTMLElement>('[data-hero-expand-track]');

  if (tracks.length === 0) return;

  const expandTl = gsap.timeline();
  tracks.forEach((track) => {
    expandTl.add(buildTrackExpandTimeline(track, config), 0);
  });

  introTimeline.add(expandTl, atPosition);
}
